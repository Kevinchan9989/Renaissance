// ============================================
// Column Mapping Utilities
// ============================================

import {
  Table,
  Column,
  ColumnMapping,
  MappingValidation,
  MappingProject,
  TableMapping,
  TypeCompatibility,
  TypeRuleSet,
  Transformation,
} from '../types';
import {
  checkTypeCompatibility,
  getRuleSetsForDatabases,
  extractTypeParams,
  normalizeType,
  getBaseType,
} from '../constants/typeMatrix';
import { generateId } from './storage';

// Re-export type matrix functions for convenience
export { checkTypeCompatibility, getRuleSetsForDatabases, extractTypeParams, normalizeType, getBaseType };

// ============================================
// Validation Functions
// ============================================

/**
 * Validate a column mapping considering all aspects:
 * - Type compatibility
 * - Size/Length
 * - Nullable
 * - Precision/Scale
 * - Default values
 * - Constraints
 */
export function validateColumnMapping(
  sourceCol: Column,
  targetCol: Column,
  sourceTable: Table,
  targetTable: Table,
  ruleSets: TypeRuleSet[]
): MappingValidation {
  const warnings: string[] = [];
  const errors: string[] = [];

  // 1. Type compatibility check
  const typeCheck = checkTypeCompatibility(sourceCol.type, targetCol.type, ruleSets);
  const typeMatch = typeCheck.compatibility !== 'incompatible';
  if (typeCheck.warning) {
    if (typeCheck.compatibility === 'incompatible') {
      errors.push(typeCheck.warning);
    } else {
      warnings.push(typeCheck.warning);
    }
  }

  // 2. Size/Length check
  const sourceParams = extractTypeParams(sourceCol.type);
  const targetParams = extractTypeParams(targetCol.type);
  let sizeMatch = true;

  if (sourceParams.length > 0 && targetParams.length > 0) {
    if (sourceParams[0] > targetParams[0]) {
      sizeMatch = false;
      warnings.push(`Target size (${targetParams[0]}) < source size (${sourceParams[0]}) - data may truncate`);
    }
  }

  // 3. Nullable check
  const sourceNullable = sourceCol.nullable.toUpperCase() === 'YES' || sourceCol.nullable.toUpperCase() === 'Y';
  const targetNullable = targetCol.nullable.toUpperCase() === 'YES' || targetCol.nullable.toUpperCase() === 'Y';
  const nullableMatch = !sourceNullable || targetNullable; // OK if source is NOT NULL, or target allows NULL

  if (!nullableMatch) {
    errors.push('Source allows NULL but target is NOT NULL - migration may fail');
  }

  // 4. Precision/Scale check for decimal types
  let precisionMatch = true;
  const sourceBase = getBaseType(sourceCol.type);

  if (['NUMBER', 'NUMERIC', 'DECIMAL'].includes(sourceBase)) {
    if (sourceParams.length >= 2 && targetParams.length >= 2) {
      // Check precision (total digits)
      if (sourceParams[0] > targetParams[0]) {
        precisionMatch = false;
        warnings.push(`Target precision (${targetParams[0]}) < source precision (${sourceParams[0]})`);
      }
      // Check scale (decimal places)
      if (sourceParams[1] > targetParams[1]) {
        precisionMatch = false;
        warnings.push(`Target scale (${targetParams[1]}) < source scale (${sourceParams[1]}) - decimal truncation`);
      }
    }
  }

  // 5. Default value check
  let defaultMatch = true;
  if (sourceCol.default && !targetCol.default) {
    defaultMatch = false;
    warnings.push(`Source has default (${sourceCol.default}) but target has none`);
  }

  // 6. Constraint check
  let constraintMatch = true;

  // Check if source column is PK
  const sourcePK = sourceTable.constraints.find(
    c => c.type === 'Primary Key' && c.localCols.toUpperCase().includes(sourceCol.name.toUpperCase())
  );
  const targetPK = targetTable.constraints.find(
    c => c.type === 'Primary Key' && c.localCols.toUpperCase().includes(targetCol.name.toUpperCase())
  );

  if (sourcePK && !targetPK) {
    constraintMatch = false;
    warnings.push('Source is Primary Key but target is not');
  }

  // Check if source column has unique constraint
  const sourceUnique = sourceTable.constraints.find(
    c => c.type === 'Unique' && c.localCols.toUpperCase().includes(sourceCol.name.toUpperCase())
  );
  const targetUnique = targetTable.constraints.find(
    c => c.type === 'Unique' && c.localCols.toUpperCase().includes(targetCol.name.toUpperCase())
  );

  if (sourceUnique && !targetUnique && !targetPK) {
    warnings.push('Source has UNIQUE constraint but target does not');
  }

  return {
    typeMatch,
    sizeMatch,
    nullableMatch,
    precisionMatch,
    defaultMatch,
    constraintMatch,
    warnings,
    errors,
  };
}

/**
 * Get overall compatibility status from validation
 */
export function getOverallCompatibility(
  typeCompatibility: TypeCompatibility,
  validation: MappingValidation
): TypeCompatibility {
  // If type is incompatible, return incompatible
  if (typeCompatibility === 'incompatible') {
    return 'incompatible';
  }

  // If there are errors, return incompatible
  if (validation.errors.length > 0) {
    return 'incompatible';
  }

  // If type needs conversion or has warnings, return needs_conversion
  if (typeCompatibility === 'needs_conversion' || validation.warnings.length > 0) {
    return 'needs_conversion';
  }

  // If any validation failed but no errors, return compatible with warnings
  if (!validation.sizeMatch || !validation.precisionMatch || !validation.defaultMatch || !validation.constraintMatch) {
    return 'needs_conversion';
  }

  // Return the type compatibility
  return typeCompatibility;
}

// ============================================
// Auto-Mapping Algorithm
// ============================================

interface MatchScore {
  column: Column;
  score: number;
  matchType: 'exact' | 'case_insensitive' | 'similar' | 'type_position';
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * Find best matching column for a source column
 */
export function findBestMatch(
  sourceCol: Column,
  targetCols: Column[],
  usedTargetCols: Set<string>,
  sourceIndex: number,
  totalSourceCols: number
): MatchScore | null {
  const scores: MatchScore[] = [];
  const sourceNameUpper = sourceCol.name.toUpperCase();

  for (const targetCol of targetCols) {
    if (usedTargetCols.has(targetCol.name)) continue;

    const targetNameUpper = targetCol.name.toUpperCase();
    let score = 0;
    let matchType: MatchScore['matchType'] = 'type_position';

    // 1. Exact name match (confidence: 1.0)
    if (sourceCol.name === targetCol.name) {
      score = 1.0;
      matchType = 'exact';
    }
    // 2. Case-insensitive name match (confidence: 0.95)
    else if (sourceNameUpper === targetNameUpper) {
      score = 0.95;
      matchType = 'case_insensitive';
    }
    // 3. Name similarity using Levenshtein distance (confidence: 0.6-0.85)
    else {
      const distance = levenshteinDistance(sourceNameUpper, targetNameUpper);
      const maxLen = Math.max(sourceNameUpper.length, targetNameUpper.length);

      if (distance <= 3 && maxLen > 3) {
        // Similar names
        score = 0.85 - (distance * 0.08);
        matchType = 'similar';
      } else if (distance / maxLen < 0.3) {
        // Reasonably similar (less than 30% different)
        score = 0.65 - (distance / maxLen) * 0.2;
        matchType = 'similar';
      }
    }

    // 4. Same type + similar position bonus
    const sourceBase = getBaseType(sourceCol.type);
    const targetBase = getBaseType(targetCol.type);

    if (sourceBase === targetBase || normalizeType(sourceCol.type) === normalizeType(targetCol.type)) {
      if (score === 0) {
        // Only type match, use position
        const targetIndex = targetCols.indexOf(targetCol);
        const positionSimilarity = 1 - Math.abs(sourceIndex / totalSourceCols - targetIndex / targetCols.length);
        score = 0.4 + (positionSimilarity * 0.2);
        matchType = 'type_position';
      } else {
        // Boost existing score for matching type
        score = Math.min(score + 0.05, 1.0);
      }
    }

    if (score > 0.4) {  // Minimum threshold
      scores.push({ column: targetCol, score, matchType });
    }
  }

  if (scores.length === 0) return null;

  // Return highest scoring match
  scores.sort((a, b) => b.score - a.score);
  return scores[0];
}

/**
 * Auto-map columns between source and target tables
 */
export function autoMapColumns(
  sourceTable: Table,
  targetTable: Table,
  sourceScriptId: string,
  targetScriptId: string,
  ruleSets: TypeRuleSet[]
): ColumnMapping[] {
  const mappings: ColumnMapping[] = [];
  const usedTargetCols = new Set<string>();

  for (let i = 0; i < sourceTable.columns.length; i++) {
    const sourceCol = sourceTable.columns[i];
    const match = findBestMatch(
      sourceCol,
      targetTable.columns,
      usedTargetCols,
      i,
      sourceTable.columns.length
    );

    if (match) {
      usedTargetCols.add(match.column.name);

      // Check type compatibility
      const typeCheck = checkTypeCompatibility(sourceCol.type, match.column.type, ruleSets);

      // Validate the mapping
      const validation = validateColumnMapping(
        sourceCol,
        match.column,
        sourceTable,
        targetTable,
        ruleSets
      );

      const mapping: ColumnMapping = {
        id: generateId(),
        sourceScriptId,
        sourceTable: sourceTable.tableName,
        sourceColumn: sourceCol.name,
        sourceType: sourceCol.type,
        targetScriptId,
        targetTable: targetTable.tableName,
        targetColumn: match.column.name,
        targetType: match.column.type,
        mapType: 'auto',
        typeCompatibility: typeCheck.compatibility,
        validation,
        transformations: [],
        confidence: match.score,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      mappings.push(mapping);
    }
  }

  return mappings;
}

/**
 * Find matching target table for a source table
 */
export function findMatchingTable(
  sourceTable: Table,
  targetTables: Table[]
): Table | null {
  const sourceNameUpper = sourceTable.tableName.toUpperCase();

  // 1. Exact name match
  const exactMatch = targetTables.find(t => t.tableName === sourceTable.tableName);
  if (exactMatch) return exactMatch;

  // 2. Case-insensitive match
  const caseMatch = targetTables.find(t => t.tableName.toUpperCase() === sourceNameUpper);
  if (caseMatch) return caseMatch;

  // 3. Similar name match (Levenshtein distance <= 3)
  for (const target of targetTables) {
    const distance = levenshteinDistance(sourceNameUpper, target.tableName.toUpperCase());
    if (distance <= 3) {
      return target;
    }
  }

  return null;
}

/**
 * Auto-map all tables and their columns
 */
export function autoMapProject(
  sourceTables: Table[],
  targetTables: Table[],
  sourceScriptId: string,
  targetScriptId: string,
  sourceDb: string,
  targetDb: string,
  customRules: TypeRuleSet[] = []
): { mappings: ColumnMapping[]; tableMappings: TableMapping[] } {
  const ruleSets = getRuleSetsForDatabases(sourceDb, targetDb, customRules);
  const allMappings: ColumnMapping[] = [];
  const tableMappings: TableMapping[] = [];

  for (const sourceTable of sourceTables) {
    const targetTable = findMatchingTable(sourceTable, targetTables);

    if (targetTable) {
      const columnMappings = autoMapColumns(
        sourceTable,
        targetTable,
        sourceScriptId,
        targetScriptId,
        ruleSets
      );

      allMappings.push(...columnMappings);

      const autoCount = columnMappings.length;
      const totalSourceCols = sourceTable.columns.length;

      tableMappings.push({
        sourceTable: sourceTable.tableName,
        targetTable: targetTable.tableName,
        status: autoCount === totalSourceCols ? 'complete' :
                autoCount > 0 ? 'partial' : 'unmapped',
        autoMapCount: autoCount,
        manualMapCount: 0,
      });
    } else {
      tableMappings.push({
        sourceTable: sourceTable.tableName,
        targetTable: '',
        status: 'unmapped',
        autoMapCount: 0,
        manualMapCount: 0,
      });
    }
  }

  return { mappings: allMappings, tableMappings };
}

// ============================================
// Create Manual Mapping
// ============================================

/**
 * Create a manual column mapping
 */
export function createManualMapping(
  sourceCol: Column,
  targetCol: Column,
  sourceTable: Table,
  targetTable: Table,
  sourceScriptId: string,
  targetScriptId: string,
  ruleSets: TypeRuleSet[]
): ColumnMapping {
  const typeCheck = checkTypeCompatibility(sourceCol.type, targetCol.type, ruleSets);
  const validation = validateColumnMapping(sourceCol, targetCol, sourceTable, targetTable, ruleSets);

  return {
    id: generateId(),
    sourceScriptId,
    sourceTable: sourceTable.tableName,
    sourceColumn: sourceCol.name,
    sourceType: sourceCol.type,
    targetScriptId,
    targetTable: targetTable.tableName,
    targetColumn: targetCol.name,
    targetType: targetCol.type,
    mapType: 'manual',
    typeCompatibility: typeCheck.compatibility,
    validation,
    transformations: [],
    confidence: 1.0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

// ============================================
// Transformation Helpers
// ============================================

/**
 * Create a transformation
 */
export function createTransformation(
  type: Transformation['type'],
  sequence: number,
  params?: Record<string, unknown>,
  expression?: string
): Transformation {
  return {
    id: generateId(),
    type,
    sequence,
    params,
    expression,
  };
}

/**
 * Preview transformation result (sample)
 */
export function previewTransformation(
  sampleValue: string,
  transformations: Transformation[]
): string {
  let result = sampleValue;

  for (const transform of transformations.sort((a, b) => a.sequence - b.sequence)) {
    switch (transform.type) {
      case 'trim':
        result = result.trim();
        break;
      case 'uppercase':
        result = result.toUpperCase();
        break;
      case 'lowercase':
        result = result.toLowerCase();
        break;
      case 'substring':
        const start = (transform.params?.start as number) || 0;
        const length = transform.params?.length as number;
        result = length ? result.substring(start, start + length) : result.substring(start);
        break;
      case 'replace':
        const find = (transform.params?.find as string) || '';
        const replace = (transform.params?.replace as string) || '';
        result = result.split(find).join(replace);
        break;
      case 'default_value':
        if (!result || result === 'null' || result === 'NULL') {
          result = (transform.params?.defaultValue as string) || '';
        }
        break;
      case 'concat':
        const prefix = (transform.params?.prefix as string) || '';
        const suffix = (transform.params?.suffix as string) || '';
        result = prefix + result + suffix;
        break;
      default:
        // Other transformations would need more complex handling
        break;
    }
  }

  return result;
}

// ============================================
// Mapping Statistics
// ============================================

/**
 * Get statistics for a mapping project
 */
export function getMappingStats(project: MappingProject): {
  totalMappings: number;
  autoMappings: number;
  manualMappings: number;
  exactMatches: number;
  compatibleMatches: number;
  needsConversion: number;
  incompatible: number;
  withWarnings: number;
  withErrors: number;
} {
  const mappings = project.mappings;

  return {
    totalMappings: mappings.length,
    autoMappings: mappings.filter(m => m.mapType === 'auto').length,
    manualMappings: mappings.filter(m => m.mapType === 'manual').length,
    exactMatches: mappings.filter(m => m.typeCompatibility === 'exact').length,
    compatibleMatches: mappings.filter(m => m.typeCompatibility === 'compatible').length,
    needsConversion: mappings.filter(m => m.typeCompatibility === 'needs_conversion').length,
    incompatible: mappings.filter(m => m.typeCompatibility === 'incompatible').length,
    withWarnings: mappings.filter(m => m.validation.warnings.length > 0).length,
    withErrors: mappings.filter(m => m.validation.errors.length > 0).length,
  };
}

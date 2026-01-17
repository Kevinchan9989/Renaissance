// ============================================
// Type Compatibility Matrix - Cross-Database Rules
// ============================================

import { TypeCompatibilityRule, TypeRuleSet, TypeCompatibility } from '../types';

// ============================================
// Built-in Type Compatibility Rules
// ============================================

// Oracle to PostgreSQL Rules
export const ORACLE_TO_POSTGRES_RULES: TypeCompatibilityRule[] = [
  // Exact matches
  {
    id: 'o2p-varchar-varchar',
    name: 'VARCHAR2 to VARCHAR',
    sourcePattern: '^VARCHAR2?(\\(\\d+\\))?$',
    targetPattern: '^VARCHAR(\\(\\d+\\))?$',
    compatibility: 'compatible',
    priority: 100,
    enabled: true,
  },
  {
    id: 'o2p-char-char',
    name: 'CHAR to CHAR',
    sourcePattern: '^CHAR(\\(\\d+\\))?$',
    targetPattern: '^(CHAR|BPCHAR)(\\(\\d+\\))?$',
    compatibility: 'compatible',
    priority: 100,
    enabled: true,
  },
  {
    id: 'o2p-number-numeric',
    name: 'NUMBER to NUMERIC',
    sourcePattern: '^NUMBER(\\([^)]+\\))?$',
    targetPattern: '^(NUMERIC|DECIMAL)(\\([^)]+\\))?$',
    compatibility: 'compatible',
    conversionSql: 'CAST(${column} AS NUMERIC)',
    priority: 90,
    enabled: true,
  },
  {
    id: 'o2p-number-integer',
    name: 'NUMBER(p,0) to INTEGER',
    description: 'NUMBER with scale 0 to INTEGER types',
    sourcePattern: '^NUMBER(\\(\\d+,?0?\\))?$',
    targetPattern: '^(INTEGER|INT|INT4|INT8|BIGINT|SMALLINT)$',
    compatibility: 'compatible',
    warning: 'Ensure source has no decimal values',
    priority: 85,
    enabled: true,
  },
  {
    id: 'o2p-date-timestamp',
    name: 'DATE to TIMESTAMP',
    sourcePattern: '^DATE$',
    targetPattern: '^TIMESTAMP(\\s+WITH(OUT)?\\s+TIME\\s+ZONE)?$',
    compatibility: 'compatible',
    conversionSql: 'CAST(${column} AS TIMESTAMP)',
    priority: 80,
    enabled: true,
  },
  {
    id: 'o2p-date-date',
    name: 'DATE to DATE',
    sourcePattern: '^DATE$',
    targetPattern: '^DATE$',
    compatibility: 'needs_conversion',
    warning: 'Oracle DATE includes time, PostgreSQL DATE does not',
    conversionSql: 'CAST(${column} AS DATE)',
    priority: 80,
    enabled: true,
  },
  {
    id: 'o2p-timestamp-timestamp',
    name: 'TIMESTAMP to TIMESTAMP',
    sourcePattern: '^TIMESTAMP(\\(\\d+\\))?(\\s+WITH(OUT)?\\s+(LOCAL\\s+)?TIME\\s+ZONE)?$',
    targetPattern: '^TIMESTAMP(\\(\\d+\\))?(\\s+WITH(OUT)?\\s+TIME\\s+ZONE)?$',
    compatibility: 'compatible',
    priority: 90,
    enabled: true,
  },
  {
    id: 'o2p-clob-text',
    name: 'CLOB to TEXT',
    sourcePattern: '^CLOB$',
    targetPattern: '^TEXT$',
    compatibility: 'compatible',
    priority: 85,
    enabled: true,
  },
  {
    id: 'o2p-blob-bytea',
    name: 'BLOB to BYTEA',
    sourcePattern: '^BLOB$',
    targetPattern: '^BYTEA$',
    compatibility: 'compatible',
    conversionSql: 'CAST(${column} AS BYTEA)',
    priority: 85,
    enabled: true,
  },
  {
    id: 'o2p-float-double',
    name: 'FLOAT to DOUBLE PRECISION',
    sourcePattern: '^(BINARY_FLOAT|BINARY_DOUBLE|FLOAT(\\(\\d+\\))?)$',
    targetPattern: '^(DOUBLE\\s+PRECISION|FLOAT8|REAL|FLOAT4)$',
    compatibility: 'compatible',
    priority: 85,
    enabled: true,
  },
  {
    id: 'o2p-raw-bytea',
    name: 'RAW to BYTEA',
    sourcePattern: '^RAW(\\(\\d+\\))?$',
    targetPattern: '^BYTEA$',
    compatibility: 'compatible',
    priority: 80,
    enabled: true,
  },
  // Incompatible types
  {
    id: 'o2p-blob-varchar',
    name: 'BLOB to VARCHAR (Incompatible)',
    sourcePattern: '^BLOB$',
    targetPattern: '^VARCHAR',
    compatibility: 'incompatible',
    warning: 'Binary to text conversion not supported',
    priority: 100,
    enabled: true,
  },
];

// PostgreSQL to Oracle Rules
export const POSTGRES_TO_ORACLE_RULES: TypeCompatibilityRule[] = [
  {
    id: 'p2o-varchar-varchar2',
    name: 'VARCHAR to VARCHAR2',
    sourcePattern: '^VARCHAR(\\(\\d+\\))?$',
    targetPattern: '^VARCHAR2(\\(\\d+\\))?$',
    compatibility: 'compatible',
    priority: 100,
    enabled: true,
  },
  {
    id: 'p2o-text-clob',
    name: 'TEXT to CLOB',
    sourcePattern: '^TEXT$',
    targetPattern: '^CLOB$',
    compatibility: 'compatible',
    priority: 85,
    enabled: true,
  },
  {
    id: 'p2o-numeric-number',
    name: 'NUMERIC to NUMBER',
    sourcePattern: '^(NUMERIC|DECIMAL)(\\([^)]+\\))?$',
    targetPattern: '^NUMBER(\\([^)]+\\))?$',
    compatibility: 'compatible',
    priority: 90,
    enabled: true,
  },
  {
    id: 'p2o-integer-number',
    name: 'INTEGER to NUMBER',
    sourcePattern: '^(INTEGER|INT|INT4|INT8|BIGINT|SMALLINT)$',
    targetPattern: '^NUMBER(\\(\\d+\\))?$',
    compatibility: 'compatible',
    priority: 85,
    enabled: true,
  },
  {
    id: 'p2o-timestamp-timestamp',
    name: 'TIMESTAMP to TIMESTAMP',
    sourcePattern: '^TIMESTAMP(\\(\\d+\\))?(\\s+WITH(OUT)?\\s+TIME\\s+ZONE)?$',
    targetPattern: '^TIMESTAMP(\\(\\d+\\))?(\\s+WITH(OUT)?\\s+(LOCAL\\s+)?TIME\\s+ZONE)?$',
    compatibility: 'compatible',
    priority: 90,
    enabled: true,
  },
  {
    id: 'p2o-date-date',
    name: 'DATE to DATE',
    sourcePattern: '^DATE$',
    targetPattern: '^DATE$',
    compatibility: 'needs_conversion',
    warning: 'PostgreSQL DATE has no time, Oracle DATE includes time',
    priority: 80,
    enabled: true,
  },
  {
    id: 'p2o-bytea-blob',
    name: 'BYTEA to BLOB',
    sourcePattern: '^BYTEA$',
    targetPattern: '^BLOB$',
    compatibility: 'compatible',
    priority: 85,
    enabled: true,
  },
  {
    id: 'p2o-boolean-number',
    name: 'BOOLEAN to NUMBER(1)',
    sourcePattern: '^(BOOLEAN|BOOL)$',
    targetPattern: '^NUMBER\\(1\\)$',
    compatibility: 'needs_conversion',
    conversionSql: 'CASE WHEN ${column} THEN 1 ELSE 0 END',
    warning: 'Oracle has no native BOOLEAN, use NUMBER(1)',
    priority: 80,
    enabled: true,
  },
  {
    id: 'p2o-serial-number',
    name: 'SERIAL to NUMBER',
    sourcePattern: '^(SERIAL|BIGSERIAL|SMALLSERIAL)$',
    targetPattern: '^NUMBER(\\(\\d+\\))?$',
    compatibility: 'needs_conversion',
    warning: 'Use Oracle SEQUENCE for auto-increment',
    priority: 75,
    enabled: true,
  },
  {
    id: 'p2o-json-clob',
    name: 'JSON/JSONB to CLOB',
    sourcePattern: '^JSONB?$',
    targetPattern: '^CLOB$',
    compatibility: 'needs_conversion',
    warning: 'JSON stored as text in Oracle CLOB',
    priority: 70,
    enabled: true,
  },
  {
    id: 'p2o-uuid-varchar2',
    name: 'UUID to VARCHAR2(36)',
    sourcePattern: '^UUID$',
    targetPattern: '^VARCHAR2\\(36\\)$',
    compatibility: 'needs_conversion',
    conversionSql: 'CAST(${column} AS VARCHAR2(36))',
    priority: 75,
    enabled: true,
  },
];

// Universal/Same-Type Rules
export const UNIVERSAL_RULES: TypeCompatibilityRule[] = [
  // Exact type matches
  {
    id: 'uni-exact-match',
    name: 'Exact Type Match',
    sourcePattern: '^(.+)$',
    targetPattern: '^\\1$',  // Same as source (backreference)
    compatibility: 'exact',
    priority: 1000,  // Highest priority
    enabled: true,
  },
  // String type variations
  {
    id: 'uni-varchar-variations',
    name: 'VARCHAR Variations',
    sourcePattern: '^VARCHAR2?(\\(\\d+\\))?$',
    targetPattern: '^VARCHAR2?(\\(\\d+\\))?$',
    compatibility: 'compatible',
    priority: 95,
    enabled: true,
  },
  // Integer type family
  {
    id: 'uni-integer-family',
    name: 'Integer Family',
    sourcePattern: '^(INTEGER|INT|INT2|INT4|INT8|SMALLINT|BIGINT|TINYINT)$',
    targetPattern: '^(INTEGER|INT|INT2|INT4|INT8|SMALLINT|BIGINT|TINYINT)$',
    compatibility: 'compatible',
    warning: 'Check value ranges match',
    priority: 90,
    enabled: true,
  },
  // Decimal type family
  {
    id: 'uni-decimal-family',
    name: 'Decimal Family',
    sourcePattern: '^(NUMERIC|DECIMAL|NUMBER)(\\([^)]+\\))?$',
    targetPattern: '^(NUMERIC|DECIMAL|NUMBER)(\\([^)]+\\))?$',
    compatibility: 'compatible',
    warning: 'Check precision and scale',
    priority: 90,
    enabled: true,
  },
  // Float type family
  {
    id: 'uni-float-family',
    name: 'Float Family',
    sourcePattern: '^(FLOAT|REAL|DOUBLE|DOUBLE\\s+PRECISION|FLOAT4|FLOAT8|BINARY_FLOAT|BINARY_DOUBLE)(\\(\\d+\\))?$',
    targetPattern: '^(FLOAT|REAL|DOUBLE|DOUBLE\\s+PRECISION|FLOAT4|FLOAT8|BINARY_FLOAT|BINARY_DOUBLE)(\\(\\d+\\))?$',
    compatibility: 'compatible',
    priority: 85,
    enabled: true,
  },
  // Date/Time family
  {
    id: 'uni-datetime-family',
    name: 'DateTime Family',
    sourcePattern: '^(DATE|DATETIME|TIMESTAMP).*$',
    targetPattern: '^(DATE|DATETIME|TIMESTAMP).*$',
    compatibility: 'compatible',
    warning: 'Check timezone and precision handling',
    priority: 80,
    enabled: true,
  },
  // Text/CLOB family
  {
    id: 'uni-text-family',
    name: 'Large Text Family',
    sourcePattern: '^(TEXT|CLOB|NCLOB|LONG)$',
    targetPattern: '^(TEXT|CLOB|NCLOB|LONG)$',
    compatibility: 'compatible',
    priority: 85,
    enabled: true,
  },
  // Binary family
  {
    id: 'uni-binary-family',
    name: 'Binary Family',
    sourcePattern: '^(BLOB|BYTEA|BINARY|VARBINARY|RAW)(\\(\\d+\\))?$',
    targetPattern: '^(BLOB|BYTEA|BINARY|VARBINARY|RAW)(\\(\\d+\\))?$',
    compatibility: 'compatible',
    priority: 85,
    enabled: true,
  },
  // Boolean
  {
    id: 'uni-boolean',
    name: 'Boolean Types',
    sourcePattern: '^(BOOLEAN|BOOL|BIT)$',
    targetPattern: '^(BOOLEAN|BOOL|BIT|NUMBER\\(1\\))$',
    compatibility: 'compatible',
    priority: 80,
    enabled: true,
  },
  // Size reduction warning
  {
    id: 'uni-size-reduction',
    name: 'Size Reduction Warning',
    description: 'Warn when target size is smaller',
    sourcePattern: '^(VARCHAR|CHAR|VARCHAR2)\\((\\d+)\\)$',
    targetPattern: '^(VARCHAR|CHAR|VARCHAR2)\\((\\d+)\\)$',
    compatibility: 'needs_conversion',
    warning: 'Target size may be smaller - check for truncation',
    priority: 50,  // Lower priority, checked after exact matches
    enabled: true,
  },
];

// ============================================
// Built-in Rule Sets
// ============================================

export const BUILT_IN_RULE_SETS: TypeRuleSet[] = [
  {
    id: 'oracle-to-postgres',
    name: 'Oracle → PostgreSQL',
    description: 'Type conversion rules for migrating Oracle schemas to PostgreSQL',
    sourceDb: 'oracle',
    targetDb: 'postgresql',
    rules: ORACLE_TO_POSTGRES_RULES,
    isBuiltIn: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'postgres-to-oracle',
    name: 'PostgreSQL → Oracle',
    description: 'Type conversion rules for migrating PostgreSQL schemas to Oracle',
    sourceDb: 'postgresql',
    targetDb: 'oracle',
    rules: POSTGRES_TO_ORACLE_RULES,
    isBuiltIn: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'universal',
    name: 'Universal Rules',
    description: 'Generic type compatibility rules applicable across databases',
    sourceDb: 'any',
    targetDb: 'any',
    rules: UNIVERSAL_RULES,
    isBuiltIn: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// ============================================
// Type Compatibility Checking Functions
// ============================================

/**
 * Normalize type string for comparison
 */
export function normalizeType(typeStr: string): string {
  return typeStr
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')  // Normalize whitespace
    .replace(/\s*\(\s*/g, '(')  // Remove spaces around parentheses
    .replace(/\s*\)\s*/g, ')')
    .replace(/\s*,\s*/g, ',');  // Remove spaces around commas
}

/**
 * Extract size/precision from type string
 * Returns [precision, scale] or [length] or []
 */
export function extractTypeParams(typeStr: string): number[] {
  const match = typeStr.match(/\(([^)]+)\)/);
  if (!match) return [];

  const params = match[1].split(',').map(p => parseInt(p.trim(), 10));
  return params.filter(p => !isNaN(p));
}

/**
 * Get base type without parameters
 */
export function getBaseType(typeStr: string): string {
  return normalizeType(typeStr).replace(/\([^)]*\)/, '').trim();
}

/**
 * Check type compatibility using rule sets
 */
export function checkTypeCompatibility(
  sourceType: string,
  targetType: string,
  ruleSets: TypeRuleSet[]
): {
  compatibility: TypeCompatibility;
  matchedRule: TypeCompatibilityRule | null;
  warning?: string;
  conversionSql?: string;
} {
  const normalizedSource = normalizeType(sourceType);
  const normalizedTarget = normalizeType(targetType);

  // Exact match check first
  if (normalizedSource === normalizedTarget) {
    return {
      compatibility: 'exact',
      matchedRule: null,
    };
  }

  // Collect all enabled rules from all rule sets, sorted by priority
  const allRules: TypeCompatibilityRule[] = [];
  for (const ruleSet of ruleSets) {
    for (const rule of ruleSet.rules) {
      if (rule.enabled) {
        allRules.push(rule);
      }
    }
  }

  // Sort by priority (higher first)
  allRules.sort((a, b) => b.priority - a.priority);

  // Check each rule
  for (const rule of allRules) {
    try {
      const sourceRegex = new RegExp(rule.sourcePattern, 'i');
      const targetRegex = new RegExp(rule.targetPattern, 'i');

      if (sourceRegex.test(normalizedSource) && targetRegex.test(normalizedTarget)) {
        return {
          compatibility: rule.compatibility,
          matchedRule: rule,
          warning: rule.warning,
          conversionSql: rule.conversionSql,
        };
      }
    } catch (e) {
      // Invalid regex, skip this rule
      console.warn(`Invalid regex in rule ${rule.id}:`, e);
    }
  }

  // Size comparison for same base types
  const sourceBase = getBaseType(sourceType);
  const targetBase = getBaseType(targetType);
  const sourceParams = extractTypeParams(sourceType);
  const targetParams = extractTypeParams(targetType);

  if (sourceBase === targetBase && sourceParams.length > 0 && targetParams.length > 0) {
    // Same base type, check sizes
    if (sourceParams[0] > targetParams[0]) {
      return {
        compatibility: 'needs_conversion',
        matchedRule: null,
        warning: `Target size (${targetParams[0]}) is smaller than source (${sourceParams[0]}) - data may truncate`,
      };
    }
    return {
      compatibility: 'compatible',
      matchedRule: null,
    };
  }

  // No rule matched - incompatible by default
  return {
    compatibility: 'incompatible',
    matchedRule: null,
    warning: `No compatibility rule found for ${sourceType} → ${targetType}`,
  };
}

/**
 * Get appropriate rule sets based on source and target database types
 */
export function getRuleSetsForDatabases(
  sourceDb: string,
  targetDb: string,
  customRuleSets: TypeRuleSet[] = []
): TypeRuleSet[] {
  const ruleSets: TypeRuleSet[] = [];

  // Add custom rule sets first (highest priority)
  ruleSets.push(...customRuleSets);

  // Add matching built-in rule sets
  for (const ruleSet of BUILT_IN_RULE_SETS) {
    if (
      (ruleSet.sourceDb === sourceDb || ruleSet.sourceDb === 'any') &&
      (ruleSet.targetDb === targetDb || ruleSet.targetDb === 'any')
    ) {
      ruleSets.push(ruleSet);
    }
  }

  // Always include universal rules
  const universalSet = BUILT_IN_RULE_SETS.find(rs => rs.id === 'universal');
  if (universalSet && !ruleSets.includes(universalSet)) {
    ruleSets.push(universalSet);
  }

  return ruleSets;
}

// ============================================
// Type Family Definitions (for smart matching)
// ============================================

export const TYPE_FAMILIES = {
  string: ['VARCHAR', 'VARCHAR2', 'CHAR', 'BPCHAR', 'TEXT', 'NVARCHAR', 'NCHAR', 'CLOB', 'NCLOB'],
  integer: ['INTEGER', 'INT', 'INT2', 'INT4', 'INT8', 'SMALLINT', 'BIGINT', 'TINYINT', 'SERIAL', 'BIGSERIAL'],
  decimal: ['NUMERIC', 'DECIMAL', 'NUMBER', 'MONEY'],
  float: ['FLOAT', 'REAL', 'DOUBLE', 'DOUBLE PRECISION', 'FLOAT4', 'FLOAT8', 'BINARY_FLOAT', 'BINARY_DOUBLE'],
  datetime: ['DATE', 'DATETIME', 'TIMESTAMP', 'TIMESTAMPTZ', 'TIME', 'TIMETZ', 'INTERVAL'],
  binary: ['BLOB', 'BYTEA', 'BINARY', 'VARBINARY', 'RAW', 'LONG RAW'],
  boolean: ['BOOLEAN', 'BOOL', 'BIT'],
  json: ['JSON', 'JSONB'],
  uuid: ['UUID', 'UNIQUEIDENTIFIER'],
  xml: ['XML', 'XMLTYPE'],
} as const;

/**
 * Get the type family for a given type
 */
export function getTypeFamily(typeStr: string): keyof typeof TYPE_FAMILIES | null {
  const baseType = getBaseType(typeStr);

  for (const [family, types] of Object.entries(TYPE_FAMILIES)) {
    if (types.some(t => baseType.startsWith(t) || baseType === t)) {
      return family as keyof typeof TYPE_FAMILIES;
    }
  }

  return null;
}

/**
 * Check if two types are in the same family
 */
export function areTypesInSameFamily(type1: string, type2: string): boolean {
  const family1 = getTypeFamily(type1);
  const family2 = getTypeFamily(type2);

  return family1 !== null && family1 === family2;
}

// ============================================
// Compatibility Colors for UI
// ============================================

export const COMPATIBILITY_COLORS = {
  exact: { stroke: '#16a34a', fill: '#dcfce7', label: 'Exact Match' },      // Darker Green
  compatible: { stroke: '#059669', fill: '#d1fae5', label: 'Compatible' },  // Emerald Green
  needs_conversion: { stroke: '#eab308', fill: '#fef9c3', label: 'Needs Conversion' }, // Yellow
  incompatible: { stroke: '#ef4444', fill: '#fee2e2', label: 'Incompatible' }, // Red
} as const;

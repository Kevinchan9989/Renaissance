# OMEGA Migration Report POC

## Overview

This is a Proof-of-Concept Java prototype for the **Project OMEGA Data Migration Tool**. It simulates the migration of data from the Legacy Oracle system (eApps/Renaissance) to the new CloudMAS PostgreSQL system and generates a **4-Layer Excel Validation Report**.

## Architecture

### Strategy Pattern Implementation

The migration uses the **Strategy Pattern** with a `MigrationProcessor` interface to handle different migration logic types:

| Type | Pattern | Description |
|------|---------|-------------|
| **Direct** | 1:1 | Single source record maps to single target record |
| **Split** | 1:N | Single source record explodes to multiple target records |
| **Bridge** | M:N | Multiple source tables join via lookup to create target |
| **Transform** | 1:1 | Data transformation/parsing during migration |

### Simulated Scenarios

| Scenario | Source | Target | Records | Failures |
|----------|--------|--------|---------|----------|
| **A** | ABA0001_SECURITY_MASTER | sec.sec_security_master | 2,000 | 0 (100% success) |
| **B** | ABA0001_SECURITY_MASTER | sec.sec_coupon_schedule | 500 | 5 (empty coupons) |
| **C** | AQA0002_TRANSACTION + ORG | iss.iss_bid_institutional | 1,000 | 150 (bank lookup NULL) |
| **D** | AQA0020_AUCTION_RESULTS | iss.iss_allotment_yield | 300 | 10 (invalid format) |

## Excel Report Structure (4 Layers)

### Tab 1: Dashboard (Executive Summary)
- Overall migration status with **Traffic Light** indicators
- Total counts: Source, Success, Failures
- Business type summary table

### Tab 2: Reconciliation
- Detailed counts by business type
- Source vs Target record counts
- Success rates

### Tab 3: Verification_Scenarios
- Logic check results for each migration scenario
- Pass/Fail status with counts

### Tab 4: Failure_Logs
- Detailed error messages for failed records
- Record ID, source/target tables, error details

## Styling

Following MAS branding guidelines:
- **Header**: Dark Blue (RGB: 0, 32, 96) with White Bold font
- **PASS**: Green background (#C6EFCE)
- **FAIL**: Red background (#FFC7CE)
- **WARN**: Yellow background (#FFEB9C)

## Prerequisites

- Java 11+ (JDK)
- Apache Maven 3.6+

## Maven Dependencies

```xml
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>5.2.5</version>
</dependency>
```

## How to Build & Run

### Option 1: Using Maven (Recommended)

```bash
# Navigate to project directory
cd report-tool

# Compile and package
mvn clean package

# Run the POC
mvn exec:java
```

Or run the fat JAR:

```bash
java -jar target/omega-migration-report-poc-1.0-POC.jar
```

### Option 2: Direct Compilation

```bash
# Ensure POI JARs are in classpath
javac -cp "poi-5.2.5.jar:poi-ooxml-5.2.5.jar:*" OmegaMigrationReportPOC.java

# Run
java -cp ".:poi-5.2.5.jar:poi-ooxml-5.2.5.jar:*" OmegaMigrationReportPOC
```

### Option 3: Custom Output Path

```bash
java -jar target/omega-migration-report-poc-1.0-POC.jar /path/to/output/report.xlsx
```

## Output

The POC generates:
- **File**: `OMEGA_Migration_Report_POC.xlsx`
- **Console Output**: Migration summary with counts

### Sample Console Output

```
========================================
  OMEGA Migration POC - Starting...
========================================

Scenario A: Security Master (1:1 Direct)
-----------------------------------------
  Source: 2000 records | Target: 2000 records | Status: PASS

Scenario B: Bond Issuances -> Coupon Dates (1:N Split)
------------------------------------------------------
  Source: 500 bonds | Coupons Created: 5245 | Failures: 5 | Status: FAIL

Scenario C: Institutional Bids (M:N Bridge)
-------------------------------------------
  Source: 1000 bids | Target: 850 | Failures: 150 | Status: FAIL

Scenario D: Price Range Transformation
--------------------------------------
  Source: 300 records | Target: 290 | Failures: 10 | Status: FAIL

========================================
  Migration Summary
========================================
Total Source Records: 3,800
Total Success: 8,385 (95.7%)
Total Failures: 165 (4.3%)

Generating Excel Report...
Report generated: OMEGA_Migration_Report_POC.xlsx

========================================
  POC Complete!
========================================
```

## Code Structure

```
OmegaMigrationReportPOC.java
├── Constants (MAS colors)
├── Enums
│   ├── MigrationStatus (PASS, FAIL, WARN)
│   └── MigrationType (DIRECT, SPLIT, BRIDGE, TRANSFORM)
├── Data Classes
│   ├── MigrationRecord
│   ├── ReconciliationSummary
│   └── VerificationScenario
├── Strategy Pattern
│   ├── MigrationProcessor (interface)
│   ├── SecurityMasterProcessor (Scenario A)
│   ├── CouponScheduleProcessor (Scenario B)
│   ├── InstitutionalBidProcessor (Scenario C)
│   └── PriceRangeTransformProcessor (Scenario D)
├── MockDataSource
│   ├── generateSecurityMasterData()
│   ├── generateBondIssuanceData()
│   ├── generateInstitutionalBidData()
│   ├── generatePriceRangeData()
│   └── generateBankCodeLookup()
├── MigrationService
│   └── runMigration()
├── ExcelReportGenerator
│   ├── createDashboardSheet()
│   ├── createReconciliationSheet()
│   ├── createVerificationSheet()
│   └── createFailureLogsSheet()
└── main()
```

## Future Enhancements

1. **Database Connectivity**: Replace MockDataSource with actual JDBC connections
2. **Spring Boot Integration**: Use Spring Batch for chunked processing
3. **Parallel Processing**: Multi-threaded migration for large datasets
4. **Configuration**: Externalize scenarios to YAML/properties
5. **REST API**: Expose migration as REST endpoints
6. **Monitoring**: Add metrics and health checks

## Technical Notes

- Uses `SXSSFWorkbook` for memory-efficient streaming (keeps only 100 rows in memory)
- `try-with-resources` pattern for proper resource management
- Fixed random seed (42) for reproducible mock data generation

## Contact

MAS DM Team - Project OMEGA

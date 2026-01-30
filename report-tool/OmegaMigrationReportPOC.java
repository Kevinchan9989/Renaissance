/**
 * OMEGA Data Migration Report POC
 * Monetary Authority of Singapore (MAS) - Project OMEGA
 *
 * This prototype simulates data migration from Legacy Oracle (eApps/ABA)
 * to CloudMAS PostgreSQL and generates a 4-Layer Excel Validation Report.
 *
 * Maven Dependencies Required:
 * <dependency>
 *     <groupId>org.apache.poi</groupId>
 *     <artifactId>poi-ooxml</artifactId>
 *     <version>5.2.5</version>
 * </dependency>
 *
 * @author MAS DM Team
 * @version 1.0 POC
 */

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;

import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

public class OmegaMigrationReportPOC {

    // =====================================================================
    // CONSTANTS - MAS Styling
    // =====================================================================
    private static final byte[] MAS_DARK_BLUE = new byte[]{(byte) 0, (byte) 32, (byte) 96};
    private static final byte[] PASS_GREEN = new byte[]{(byte) 198, (byte) 239, (byte) 206};
    private static final byte[] FAIL_RED = new byte[]{(byte) 255, (byte) 199, (byte) 206};
    private static final byte[] WARN_YELLOW = new byte[]{(byte) 255, (byte) 235, (byte) 156};
    private static final byte[] LIGHT_GRAY = new byte[]{(byte) 242, (byte) 242, (byte) 242};

    // =====================================================================
    // ENUMS
    // =====================================================================
    public enum MigrationStatus {
        PASS, FAIL, WARN
    }

    public enum MigrationType {
        DIRECT_1_TO_1("1:1 Direct Mapping"),
        SPLIT_1_TO_N("1:N Split/Explode"),
        BRIDGE_M_TO_N("M:N Bridge Table"),
        TRANSFORM("Data Transformation");

        private final String description;

        MigrationType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    // =====================================================================
    // DATA CLASSES
    // =====================================================================

    /**
     * Represents a single migration record with its validation result
     */
    static class MigrationRecord {
        String sourceTable;
        String targetTable;
        String recordId;
        MigrationType migrationType;
        MigrationStatus status;
        String errorMessage;
        Map<String, Object> sourceData;
        Map<String, Object> targetData;

        MigrationRecord(String sourceTable, String targetTable, String recordId,
                        MigrationType migrationType, MigrationStatus status, String errorMessage) {
            this.sourceTable = sourceTable;
            this.targetTable = targetTable;
            this.recordId = recordId;
            this.migrationType = migrationType;
            this.status = status;
            this.errorMessage = errorMessage;
            this.sourceData = new HashMap<>();
            this.targetData = new HashMap<>();
        }
    }

    /**
     * Aggregated statistics for a business type
     */
    static class ReconciliationSummary {
        String businessType;
        String sourceTable;
        String targetTable;
        MigrationType migrationType;
        int sourceCount;
        int targetCount;
        int successCount;
        int failureCount;
        int warningCount;

        ReconciliationSummary(String businessType, String sourceTable, String targetTable,
                              MigrationType migrationType) {
            this.businessType = businessType;
            this.sourceTable = sourceTable;
            this.targetTable = targetTable;
            this.migrationType = migrationType;
        }

        MigrationStatus getOverallStatus() {
            if (failureCount > 0) return MigrationStatus.FAIL;
            if (warningCount > 0) return MigrationStatus.WARN;
            return MigrationStatus.PASS;
        }

        double getSuccessRate() {
            if (sourceCount == 0) return 100.0;
            return (successCount * 100.0) / sourceCount;
        }
    }

    /**
     * Verification scenario result
     */
    static class VerificationScenario {
        String scenarioId;
        String scenarioName;
        String description;
        MigrationType migrationType;
        MigrationStatus status;
        int totalRecords;
        int passedRecords;
        int failedRecords;
        String notes;

        VerificationScenario(String scenarioId, String scenarioName, String description,
                             MigrationType migrationType) {
            this.scenarioId = scenarioId;
            this.scenarioName = scenarioName;
            this.description = description;
            this.migrationType = migrationType;
        }

        void computeStatus() {
            if (failedRecords > 0) {
                status = MigrationStatus.FAIL;
            } else if (passedRecords < totalRecords) {
                status = MigrationStatus.WARN;
            } else {
                status = MigrationStatus.PASS;
            }
        }
    }

    // =====================================================================
    // STRATEGY PATTERN - Migration Processors
    // =====================================================================

    /**
     * Strategy interface for different migration logic types
     */
    interface MigrationProcessor {
        List<MigrationRecord> process(List<Map<String, Object>> sourceData);
        MigrationType getMigrationType();
        String getSourceTable();
        String getTargetTable();
    }

    /**
     * Scenario A: 1:1 Direct Mapping - Security Master
     * ABA0001_SECURITY_MASTER -> sec.sec_security_master
     */
    static class SecurityMasterProcessor implements MigrationProcessor {
        @Override
        public List<MigrationRecord> process(List<Map<String, Object>> sourceData) {
            List<MigrationRecord> results = new ArrayList<>();

            for (Map<String, Object> record : sourceData) {
                String securityCode = (String) record.get("SECURITY_CODE");

                // All 2000 records succeed in this scenario
                MigrationRecord migrationRecord = new MigrationRecord(
                    getSourceTable(),
                    getTargetTable(),
                    securityCode,
                    getMigrationType(),
                    MigrationStatus.PASS,
                    null
                );
                migrationRecord.sourceData = record;
                migrationRecord.targetData = transformSecurityMaster(record);
                results.add(migrationRecord);
            }
            return results;
        }

        private Map<String, Object> transformSecurityMaster(Map<String, Object> source) {
            Map<String, Object> target = new HashMap<>();
            target.put("isin_code", source.get("ISIN_CODE"));
            target.put("issue_code", source.get("SECURITY_CODE"));
            target.put("issue_desc", source.get("SECURITY_NAME"));
            target.put("tax_status", source.get("TAX_IND"));
            target.put("currency", "SGD");
            target.put("coupon_pay_frequency", source.get("COUPON_FREQ"));
            return target;
        }

        @Override
        public MigrationType getMigrationType() {
            return MigrationType.DIRECT_1_TO_1;
        }

        @Override
        public String getSourceTable() {
            return "ABA0001_SECURITY_MASTER";
        }

        @Override
        public String getTargetTable() {
            return "sec.sec_security_master";
        }
    }

    /**
     * Scenario B: 1:N Split - Bond Issuances to Coupon Dates
     * ABA0001_SECURITY_MASTER -> sec.sec_coupon_schedule (multiple rows)
     */
    static class CouponScheduleProcessor implements MigrationProcessor {
        private int failureCount = 0;
        private static final int MAX_FAILURES = 5;

        @Override
        public List<MigrationRecord> process(List<Map<String, Object>> sourceData) {
            List<MigrationRecord> results = new ArrayList<>();
            failureCount = 0;

            for (Map<String, Object> record : sourceData) {
                String securityCode = (String) record.get("SECURITY_CODE");
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> coupons = (List<Map<String, Object>>) record.get("COUPONS");

                // Simulate 5 failures where coupons list is empty
                if (coupons == null || coupons.isEmpty()) {
                    if (failureCount < MAX_FAILURES) {
                        MigrationRecord failedRecord = new MigrationRecord(
                            getSourceTable(),
                            getTargetTable(),
                            securityCode,
                            getMigrationType(),
                            MigrationStatus.FAIL,
                            "Empty coupon schedule - no coupon dates found for bond issuance"
                        );
                        failedRecord.sourceData = record;
                        results.add(failedRecord);
                        failureCount++;
                        continue;
                    }
                }

                // Process each coupon as separate target record
                if (coupons != null) {
                    for (int i = 0; i < coupons.size(); i++) {
                        Map<String, Object> coupon = coupons.get(i);
                        MigrationRecord migrationRecord = new MigrationRecord(
                            getSourceTable(),
                            getTargetTable(),
                            securityCode + "_CPN_" + (i + 1),
                            getMigrationType(),
                            MigrationStatus.PASS,
                            null
                        );
                        migrationRecord.sourceData = record;
                        migrationRecord.targetData = transformCoupon(securityCode, i + 1, coupon);
                        results.add(migrationRecord);
                    }
                }
            }
            return results;
        }

        private Map<String, Object> transformCoupon(String securityCode, int index, Map<String, Object> coupon) {
            Map<String, Object> target = new HashMap<>();
            target.put("sec_security_master_id", securityCode);
            target.put("coupon_index", index);
            target.put("coupon_payment_dt", coupon.get("PAYMENT_DATE"));
            return target;
        }

        @Override
        public MigrationType getMigrationType() {
            return MigrationType.SPLIT_1_TO_N;
        }

        @Override
        public String getSourceTable() {
            return "ABA0001_SECURITY_MASTER";
        }

        @Override
        public String getTargetTable() {
            return "sec.sec_coupon_schedule";
        }
    }

    /**
     * Scenario C: M:N Bridge - Institutional Bids
     * AQA0002_TRANSACTION + ABA0222_SB_ORG -> iss.iss_bid_institutional
     */
    static class InstitutionalBidProcessor implements MigrationProcessor {
        private int failureCount = 0;
        private static final int MAX_FAILURES = 150;
        private final Map<String, String> bankCodeLookup;

        InstitutionalBidProcessor(Map<String, String> bankCodeLookup) {
            this.bankCodeLookup = bankCodeLookup;
        }

        @Override
        public List<MigrationRecord> process(List<Map<String, Object>> sourceData) {
            List<MigrationRecord> results = new ArrayList<>();
            failureCount = 0;

            for (Map<String, Object> record : sourceData) {
                String transId = (String) record.get("TRANS_ID");
                String bankCode = (String) record.get("BANK_CODE");

                // Simulate 150 failures where bank_code lookup returns NULL
                String bankMasterId = bankCodeLookup.get(bankCode);

                if (bankMasterId == null && failureCount < MAX_FAILURES) {
                    MigrationRecord failedRecord = new MigrationRecord(
                        getSourceTable(),
                        getTargetTable(),
                        transId,
                        getMigrationType(),
                        MigrationStatus.FAIL,
                        "Bank code lookup failed - no matching bank_master entry for code: " + bankCode
                    );
                    failedRecord.sourceData = record;
                    results.add(failedRecord);
                    failureCount++;
                    continue;
                }

                // Successful mapping
                MigrationRecord migrationRecord = new MigrationRecord(
                    getSourceTable(),
                    getTargetTable(),
                    transId,
                    getMigrationType(),
                    MigrationStatus.PASS,
                    null
                );
                migrationRecord.sourceData = record;
                migrationRecord.targetData = transformBid(record, bankMasterId != null ? bankMasterId : "DEFAULT");
                results.add(migrationRecord);
            }
            return results;
        }

        private Map<String, Object> transformBid(Map<String, Object> source, String bankMasterId) {
            Map<String, Object> target = new HashMap<>();
            target.put("cm_bank_master_map_id", bankMasterId);
            target.put("bank_ref_no", source.get("REF_NO"));
            target.put("applicant_type", source.get("APPLICANT_TYPE"));
            target.put("nominal_amount", source.get("AMOUNT"));
            target.put("yield_pct", source.get("YIELD"));
            target.put("is_competitive", source.get("COMP_CHECK"));
            return target;
        }

        @Override
        public MigrationType getMigrationType() {
            return MigrationType.BRIDGE_M_TO_N;
        }

        @Override
        public String getSourceTable() {
            return "AQA0002_TRANSACTION + ABA0222_SB_ORG";
        }

        @Override
        public String getTargetTable() {
            return "iss.iss_bid_institutional";
        }
    }

    /**
     * Scenario D: Transformation - Split price_range string
     * Format: "LOW-HIGH" needs to be parsed into separate fields
     */
    static class PriceRangeTransformProcessor implements MigrationProcessor {
        private int failureCount = 0;
        private static final int MAX_FAILURES = 10;

        @Override
        public List<MigrationRecord> process(List<Map<String, Object>> sourceData) {
            List<MigrationRecord> results = new ArrayList<>();
            failureCount = 0;

            for (Map<String, Object> record : sourceData) {
                String recordId = (String) record.get("RECORD_ID");
                String priceRange = (String) record.get("PRICE_RANGE");

                // Simulate 10 failures on invalid format
                try {
                    if (priceRange == null || !priceRange.contains("-")) {
                        throw new IllegalArgumentException("Invalid price range format");
                    }

                    String[] parts = priceRange.split("-");
                    if (parts.length != 2) {
                        throw new IllegalArgumentException("Price range must have exactly two values");
                    }

                    double lowPrice = Double.parseDouble(parts[0].trim());
                    double highPrice = Double.parseDouble(parts[1].trim());

                    if (lowPrice > highPrice) {
                        throw new IllegalArgumentException("Low price exceeds high price");
                    }

                    // Successful transformation
                    MigrationRecord migrationRecord = new MigrationRecord(
                        getSourceTable(),
                        getTargetTable(),
                        recordId,
                        getMigrationType(),
                        MigrationStatus.PASS,
                        null
                    );
                    migrationRecord.sourceData = record;
                    migrationRecord.targetData = new HashMap<>();
                    migrationRecord.targetData.put("price_low", lowPrice);
                    migrationRecord.targetData.put("price_high", highPrice);
                    migrationRecord.targetData.put("price_mid", (lowPrice + highPrice) / 2);
                    results.add(migrationRecord);

                } catch (Exception e) {
                    if (failureCount < MAX_FAILURES) {
                        MigrationRecord failedRecord = new MigrationRecord(
                            getSourceTable(),
                            getTargetTable(),
                            recordId,
                            getMigrationType(),
                            MigrationStatus.FAIL,
                            "Price range transformation failed: " + e.getMessage() + " [Value: " + priceRange + "]"
                        );
                        failedRecord.sourceData = record;
                        results.add(failedRecord);
                        failureCount++;
                    }
                }
            }
            return results;
        }

        @Override
        public MigrationType getMigrationType() {
            return MigrationType.TRANSFORM;
        }

        @Override
        public String getSourceTable() {
            return "AQA0020_AUCTION_RESULTS_REPORT";
        }

        @Override
        public String getTargetTable() {
            return "iss.iss_allotment_yield_distribution";
        }
    }

    // =====================================================================
    // MOCK DATA SOURCE
    // =====================================================================

    static class MockDataSource {
        private static final Random random = new Random(42); // Fixed seed for reproducibility

        /**
         * Generate mock Security Master records (Scenario A)
         */
        static List<Map<String, Object>> generateSecurityMasterData(int count) {
            List<Map<String, Object>> data = new ArrayList<>();
            String[] secTypes = {"SGS", "TBILL", "SSB", "MASBILL", "FRN"};

            for (int i = 0; i < count; i++) {
                Map<String, Object> record = new HashMap<>();
                String secType = secTypes[i % secTypes.length];
                record.put("SECURITY_CODE", String.format("%s%05d", secType.substring(0, 2), i));
                record.put("ISIN_CODE", String.format("SGXF%08d", 10000000 + i));
                record.put("SECURITY_NAME", String.format("%s BOND 2025 DUE %02d%02d35", secType, (i % 12) + 1, (i % 28) + 1));
                record.put("ISSUE_NO", "1");
                record.put("TAX_IND", i % 3 == 0 ? "N" : "Y");
                record.put("COUPON_FREQ", i % 2 == 0 ? "SEMI_ANNUALLY" : "ANNUALLY");
                record.put("ISSUE_DATE", "2025-01-" + String.format("%02d", (i % 28) + 1));
                record.put("MATURITY_DATE", "2035-01-" + String.format("%02d", (i % 28) + 1));
                data.add(record);
            }
            return data;
        }

        /**
         * Generate mock Bond Issuance data with Coupons (Scenario B)
         */
        static List<Map<String, Object>> generateBondIssuanceData(int count, int emptyCount) {
            List<Map<String, Object>> data = new ArrayList<>();

            for (int i = 0; i < count; i++) {
                Map<String, Object> record = new HashMap<>();
                record.put("SECURITY_CODE", String.format("GX%05dA", i));
                record.put("ISSUE_DESC", String.format("10YR BOND 2025 SERIES %d", i));
                record.put("COUPON_RATE", 2.5 + (i % 30) * 0.1);

                // First 'emptyCount' records have empty coupon list to trigger failures
                if (i < emptyCount) {
                    record.put("COUPONS", Collections.emptyList());
                } else {
                    List<Map<String, Object>> coupons = new ArrayList<>();
                    int couponCount = 4 + (i % 17); // 4-20 coupons per bond
                    for (int j = 0; j < couponCount; j++) {
                        Map<String, Object> coupon = new HashMap<>();
                        coupon.put("PAYMENT_DATE", String.format("2025-%02d-01", (j % 12) + 1));
                        coupon.put("COUPON_AMOUNT", 1000000 * (2.5 + (i % 30) * 0.1) / 100);
                        coupons.add(coupon);
                    }
                    record.put("COUPONS", coupons);
                }
                data.add(record);
            }
            return data;
        }

        /**
         * Generate mock Institutional Bid data (Scenario C)
         */
        static List<Map<String, Object>> generateInstitutionalBidData(int count, int invalidBankCount) {
            List<Map<String, Object>> data = new ArrayList<>();
            String[] validBanks = {"DBS", "OCBC", "UOB", "SCB", "CITI", "HSBC", "BOC", "ICBC"};
            String[] applicantTypes = {"PD", "BANK", "FI"};

            for (int i = 0; i < count; i++) {
                Map<String, Object> record = new HashMap<>();
                record.put("TRANS_ID", String.format("TXN%08d", 100000 + i));
                record.put("REF_NO", String.format("BIDREF%06d", i));

                // First 'invalidBankCount' records have invalid bank codes
                if (i < invalidBankCount) {
                    record.put("BANK_CODE", "INVALID_" + i);
                } else {
                    record.put("BANK_CODE", validBanks[i % validBanks.length]);
                }

                record.put("APPLICANT_TYPE", applicantTypes[i % applicantTypes.length]);
                record.put("AMOUNT", (1 + random.nextInt(100)) * 1000000.0);
                record.put("YIELD", 2.0 + random.nextDouble() * 2.0);
                record.put("COMP_CHECK", i % 3 == 0 ? "N" : "Y");
                data.add(record);
            }
            return data;
        }

        /**
         * Generate mock Price Range data (Scenario D)
         */
        static List<Map<String, Object>> generatePriceRangeData(int count, int invalidCount) {
            List<Map<String, Object>> data = new ArrayList<>();

            for (int i = 0; i < count; i++) {
                Map<String, Object> record = new HashMap<>();
                record.put("RECORD_ID", String.format("PRC%06d", i));

                // First 'invalidCount' records have invalid price range format
                if (i < invalidCount) {
                    switch (i % 5) {
                        case 0: record.put("PRICE_RANGE", "INVALID"); break;
                        case 1: record.put("PRICE_RANGE", "100.50"); break; // Missing separator
                        case 2: record.put("PRICE_RANGE", "100.50-90.25"); break; // Low > High
                        case 3: record.put("PRICE_RANGE", null); break;
                        case 4: record.put("PRICE_RANGE", "ABC-DEF"); break; // Non-numeric
                    }
                } else {
                    double low = 95.0 + random.nextDouble() * 5;
                    double high = low + random.nextDouble() * 3;
                    record.put("PRICE_RANGE", String.format("%.2f-%.2f", low, high));
                }

                record.put("SECURITY_CODE", String.format("NX%05dH", i));
                data.add(record);
            }
            return data;
        }

        /**
         * Generate bank code lookup map (for Scenario C)
         */
        static Map<String, String> generateBankCodeLookup() {
            Map<String, String> lookup = new HashMap<>();
            lookup.put("DBS", "uuid-bank-dbs-001");
            lookup.put("OCBC", "uuid-bank-ocbc-002");
            lookup.put("UOB", "uuid-bank-uob-003");
            lookup.put("SCB", "uuid-bank-scb-004");
            lookup.put("CITI", "uuid-bank-citi-005");
            lookup.put("HSBC", "uuid-bank-hsbc-006");
            lookup.put("BOC", "uuid-bank-boc-007");
            lookup.put("ICBC", "uuid-bank-icbc-008");
            // Intentionally missing codes to trigger lookup failures
            return lookup;
        }
    }

    // =====================================================================
    // MIGRATION SERVICE
    // =====================================================================

    static class MigrationService {
        private final List<MigrationRecord> allRecords = new ArrayList<>();
        private final List<ReconciliationSummary> summaries = new ArrayList<>();
        private final List<VerificationScenario> scenarios = new ArrayList<>();

        public void runMigration() {
            System.out.println("========================================");
            System.out.println("  OMEGA Migration POC - Starting...");
            System.out.println("========================================\n");

            // Scenario A: Security Master (1:1)
            runScenarioA();

            // Scenario B: Coupon Schedule (1:N)
            runScenarioB();

            // Scenario C: Institutional Bids (M:N)
            runScenarioC();

            // Scenario D: Price Range Transform
            runScenarioD();

            printSummary();
        }

        private void runScenarioA() {
            System.out.println("Scenario A: Security Master (1:1 Direct)");
            System.out.println("-----------------------------------------");

            List<Map<String, Object>> sourceData = MockDataSource.generateSecurityMasterData(2000);
            SecurityMasterProcessor processor = new SecurityMasterProcessor();
            List<MigrationRecord> results = processor.process(sourceData);
            allRecords.addAll(results);

            ReconciliationSummary summary = new ReconciliationSummary(
                "Security Master",
                processor.getSourceTable(),
                processor.getTargetTable(),
                processor.getMigrationType()
            );
            summary.sourceCount = sourceData.size();
            summary.targetCount = (int) results.stream().filter(r -> r.status == MigrationStatus.PASS).count();
            summary.successCount = summary.targetCount;
            summary.failureCount = (int) results.stream().filter(r -> r.status == MigrationStatus.FAIL).count();
            summary.warningCount = (int) results.stream().filter(r -> r.status == MigrationStatus.WARN).count();
            summaries.add(summary);

            VerificationScenario scenario = new VerificationScenario(
                "SC-A",
                "Security Master 1:1 Mapping",
                "Direct mapping from ABA0001_SECURITY_MASTER to sec.sec_security_master",
                processor.getMigrationType()
            );
            scenario.totalRecords = sourceData.size();
            scenario.passedRecords = summary.successCount;
            scenario.failedRecords = summary.failureCount;
            scenario.notes = "All 2,000 records migrated successfully";
            scenario.computeStatus();
            scenarios.add(scenario);

            System.out.printf("  Source: %d records | Target: %d records | Status: %s%n%n",
                summary.sourceCount, summary.targetCount, summary.getOverallStatus());
        }

        private void runScenarioB() {
            System.out.println("Scenario B: Bond Issuances -> Coupon Dates (1:N Split)");
            System.out.println("------------------------------------------------------");

            List<Map<String, Object>> sourceData = MockDataSource.generateBondIssuanceData(500, 5);
            CouponScheduleProcessor processor = new CouponScheduleProcessor();
            List<MigrationRecord> results = processor.process(sourceData);
            allRecords.addAll(results);

            long successCount = results.stream().filter(r -> r.status == MigrationStatus.PASS).count();
            long failCount = results.stream().filter(r -> r.status == MigrationStatus.FAIL).count();

            ReconciliationSummary summary = new ReconciliationSummary(
                "Coupon Schedule",
                processor.getSourceTable(),
                processor.getTargetTable(),
                processor.getMigrationType()
            );
            summary.sourceCount = sourceData.size();
            summary.targetCount = (int) successCount;
            summary.successCount = (int) successCount;
            summary.failureCount = (int) failCount;
            summary.warningCount = 0;
            summaries.add(summary);

            VerificationScenario scenario = new VerificationScenario(
                "SC-B",
                "Bond Coupon Schedule Split",
                "1:N split from Bond Issuance to multiple Coupon Schedule records",
                processor.getMigrationType()
            );
            scenario.totalRecords = sourceData.size();
            scenario.passedRecords = sourceData.size() - (int) failCount;
            scenario.failedRecords = (int) failCount;
            scenario.notes = String.format("%d bonds with empty coupon schedule", failCount);
            scenario.computeStatus();
            scenarios.add(scenario);

            System.out.printf("  Source: %d bonds | Coupons Created: %d | Failures: %d | Status: %s%n%n",
                summary.sourceCount, summary.targetCount, summary.failureCount, summary.getOverallStatus());
        }

        private void runScenarioC() {
            System.out.println("Scenario C: Institutional Bids (M:N Bridge)");
            System.out.println("-------------------------------------------");

            Map<String, String> bankLookup = MockDataSource.generateBankCodeLookup();
            List<Map<String, Object>> sourceData = MockDataSource.generateInstitutionalBidData(1000, 150);
            InstitutionalBidProcessor processor = new InstitutionalBidProcessor(bankLookup);
            List<MigrationRecord> results = processor.process(sourceData);
            allRecords.addAll(results);

            long successCount = results.stream().filter(r -> r.status == MigrationStatus.PASS).count();
            long failCount = results.stream().filter(r -> r.status == MigrationStatus.FAIL).count();

            ReconciliationSummary summary = new ReconciliationSummary(
                "Institutional Bids",
                processor.getSourceTable(),
                processor.getTargetTable(),
                processor.getMigrationType()
            );
            summary.sourceCount = sourceData.size();
            summary.targetCount = (int) successCount;
            summary.successCount = (int) successCount;
            summary.failureCount = (int) failCount;
            summary.warningCount = 0;
            summaries.add(summary);

            VerificationScenario scenario = new VerificationScenario(
                "SC-C",
                "Institutional Bid Bridge Mapping",
                "M:N mapping via bank code lookup from Transaction + Org to Bid table",
                processor.getMigrationType()
            );
            scenario.totalRecords = sourceData.size();
            scenario.passedRecords = (int) successCount;
            scenario.failedRecords = (int) failCount;
            scenario.notes = String.format("%d bids failed due to missing bank_code lookup", failCount);
            scenario.computeStatus();
            scenarios.add(scenario);

            System.out.printf("  Source: %d bids | Target: %d | Failures: %d | Status: %s%n%n",
                summary.sourceCount, summary.targetCount, summary.failureCount, summary.getOverallStatus());
        }

        private void runScenarioD() {
            System.out.println("Scenario D: Price Range Transformation");
            System.out.println("--------------------------------------");

            List<Map<String, Object>> sourceData = MockDataSource.generatePriceRangeData(300, 10);
            PriceRangeTransformProcessor processor = new PriceRangeTransformProcessor();
            List<MigrationRecord> results = processor.process(sourceData);
            allRecords.addAll(results);

            long successCount = results.stream().filter(r -> r.status == MigrationStatus.PASS).count();
            long failCount = results.stream().filter(r -> r.status == MigrationStatus.FAIL).count();

            ReconciliationSummary summary = new ReconciliationSummary(
                "Price Range Transform",
                processor.getSourceTable(),
                processor.getTargetTable(),
                processor.getMigrationType()
            );
            summary.sourceCount = sourceData.size();
            summary.targetCount = (int) successCount;
            summary.successCount = (int) successCount;
            summary.failureCount = (int) failCount;
            summary.warningCount = 0;
            summaries.add(summary);

            VerificationScenario scenario = new VerificationScenario(
                "SC-D",
                "Price Range String Transformation",
                "Parse 'LOW-HIGH' string format into separate numeric fields",
                processor.getMigrationType()
            );
            scenario.totalRecords = sourceData.size();
            scenario.passedRecords = (int) successCount;
            scenario.failedRecords = (int) failCount;
            scenario.notes = String.format("%d records with invalid price_range format", failCount);
            scenario.computeStatus();
            scenarios.add(scenario);

            System.out.printf("  Source: %d records | Target: %d | Failures: %d | Status: %s%n%n",
                summary.sourceCount, summary.targetCount, summary.failureCount, summary.getOverallStatus());
        }

        private void printSummary() {
            System.out.println("========================================");
            System.out.println("  Migration Summary");
            System.out.println("========================================");

            int totalSource = summaries.stream().mapToInt(s -> s.sourceCount).sum();
            int totalSuccess = summaries.stream().mapToInt(s -> s.successCount).sum();
            int totalFail = summaries.stream().mapToInt(s -> s.failureCount).sum();

            System.out.printf("Total Source Records: %,d%n", totalSource);
            System.out.printf("Total Success: %,d (%.1f%%)%n", totalSuccess, (totalSuccess * 100.0 / totalSource));
            System.out.printf("Total Failures: %,d (%.1f%%)%n", totalFail, (totalFail * 100.0 / totalSource));
        }

        public List<MigrationRecord> getAllRecords() { return allRecords; }
        public List<ReconciliationSummary> getSummaries() { return summaries; }
        public List<VerificationScenario> getScenarios() { return scenarios; }
    }

    // =====================================================================
    // EXCEL REPORT GENERATOR
    // =====================================================================

    static class ExcelReportGenerator {
        private final SXSSFWorkbook workbook;
        private CellStyle headerStyle;
        private CellStyle passStyle;
        private CellStyle failStyle;
        private CellStyle warnStyle;
        private CellStyle defaultStyle;
        private CellStyle titleStyle;
        private CellStyle subtitleStyle;
        private CellStyle numberStyle;
        private CellStyle percentStyle;

        public ExcelReportGenerator() {
            this.workbook = new SXSSFWorkbook(100); // Keep 100 rows in memory
            createStyles();
        }

        private void createStyles() {
            // MAS Header Style - Dark Blue with White Bold Font
            headerStyle = workbook.createCellStyle();
            headerStyle.setFillForegroundColor(new XSSFColor(MAS_DARK_BLUE, null));
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            Font headerFont = workbook.createFont();
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 11);
            headerStyle.setFont(headerFont);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            // Pass Style - Green
            passStyle = workbook.createCellStyle();
            passStyle.setFillForegroundColor(new XSSFColor(PASS_GREEN, null));
            passStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            Font passFont = workbook.createFont();
            passFont.setColor(IndexedColors.DARK_GREEN.getIndex());
            passFont.setBold(true);
            passStyle.setFont(passFont);
            setBorders(passStyle);
            passStyle.setAlignment(HorizontalAlignment.CENTER);

            // Fail Style - Red
            failStyle = workbook.createCellStyle();
            failStyle.setFillForegroundColor(new XSSFColor(FAIL_RED, null));
            failStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            Font failFont = workbook.createFont();
            failFont.setColor(IndexedColors.DARK_RED.getIndex());
            failFont.setBold(true);
            failStyle.setFont(failFont);
            setBorders(failStyle);
            failStyle.setAlignment(HorizontalAlignment.CENTER);

            // Warning Style - Yellow
            warnStyle = workbook.createCellStyle();
            warnStyle.setFillForegroundColor(new XSSFColor(WARN_YELLOW, null));
            warnStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            Font warnFont = workbook.createFont();
            warnFont.setColor(IndexedColors.DARK_YELLOW.getIndex());
            warnFont.setBold(true);
            warnStyle.setFont(warnFont);
            setBorders(warnStyle);
            warnStyle.setAlignment(HorizontalAlignment.CENTER);

            // Default Style
            defaultStyle = workbook.createCellStyle();
            setBorders(defaultStyle);
            defaultStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            // Title Style
            titleStyle = workbook.createCellStyle();
            Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 16);
            titleFont.setColor(new XSSFColor(MAS_DARK_BLUE, null).getIndex());
            titleStyle.setFont(titleFont);

            // Subtitle Style
            subtitleStyle = workbook.createCellStyle();
            Font subtitleFont = workbook.createFont();
            subtitleFont.setBold(true);
            subtitleFont.setFontHeightInPoints((short) 12);
            subtitleStyle.setFont(subtitleFont);
            subtitleStyle.setFillForegroundColor(new XSSFColor(LIGHT_GRAY, null));
            subtitleStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            // Number Style
            numberStyle = workbook.createCellStyle();
            numberStyle.setDataFormat(workbook.createDataFormat().getFormat("#,##0"));
            setBorders(numberStyle);
            numberStyle.setAlignment(HorizontalAlignment.RIGHT);

            // Percent Style
            percentStyle = workbook.createCellStyle();
            percentStyle.setDataFormat(workbook.createDataFormat().getFormat("0.00%"));
            setBorders(percentStyle);
            percentStyle.setAlignment(HorizontalAlignment.RIGHT);
        }

        private void setBorders(CellStyle style) {
            style.setBorderBottom(BorderStyle.THIN);
            style.setBorderTop(BorderStyle.THIN);
            style.setBorderLeft(BorderStyle.THIN);
            style.setBorderRight(BorderStyle.THIN);
        }

        private CellStyle getStatusStyle(MigrationStatus status) {
            switch (status) {
                case PASS: return passStyle;
                case FAIL: return failStyle;
                case WARN: return warnStyle;
                default: return defaultStyle;
            }
        }

        public void generateReport(MigrationService service, String outputPath) throws IOException {
            System.out.println("\nGenerating Excel Report...");

            // Tab 1: Dashboard
            createDashboardSheet(service);

            // Tab 2: Reconciliation
            createReconciliationSheet(service);

            // Tab 3: Verification Scenarios
            createVerificationSheet(service);

            // Tab 4: Failure Logs
            createFailureLogsSheet(service);

            // Write the file
            try (FileOutputStream fos = new FileOutputStream(outputPath)) {
                workbook.write(fos);
            }

            // Dispose of temporary files
            workbook.dispose();

            System.out.println("Report generated: " + outputPath);
        }

        private void createDashboardSheet(MigrationService service) {
            Sheet sheet = workbook.createSheet("Dashboard");
            int rowNum = 0;

            // Title
            Row titleRow = sheet.createRow(rowNum++);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("OMEGA Data Migration - Executive Summary");
            titleCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 6));
            rowNum++;

            // Timestamp
            Row timestampRow = sheet.createRow(rowNum++);
            timestampRow.createCell(0).setCellValue("Report Generated: " +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            rowNum++;

            // Overall Status
            int totalSource = service.getSummaries().stream().mapToInt(s -> s.sourceCount).sum();
            int totalSuccess = service.getSummaries().stream().mapToInt(s -> s.successCount).sum();
            int totalFail = service.getSummaries().stream().mapToInt(s -> s.failureCount).sum();
            MigrationStatus overallStatus = totalFail > 0 ? MigrationStatus.FAIL : MigrationStatus.PASS;

            Row statusLabelRow = sheet.createRow(rowNum++);
            statusLabelRow.createCell(0).setCellValue("Overall Migration Status:");
            Cell statusCell = statusLabelRow.createCell(1);
            statusCell.setCellValue(overallStatus.toString());
            statusCell.setCellStyle(getStatusStyle(overallStatus));
            rowNum++;

            // Traffic Light Summary
            Row tlHeader = sheet.createRow(rowNum++);
            tlHeader.createCell(0).setCellValue("Traffic Light Summary");
            tlHeader.getCell(0).setCellStyle(subtitleStyle);
            rowNum++;

            // Summary metrics
            String[][] metrics = {
                {"Total Source Records", String.format("%,d", totalSource)},
                {"Successfully Migrated", String.format("%,d", totalSuccess)},
                {"Failed Records", String.format("%,d", totalFail)},
                {"Success Rate", String.format("%.2f%%", (totalSuccess * 100.0 / totalSource))},
                {"Business Types Processed", String.valueOf(service.getSummaries().size())},
                {"Verification Scenarios", String.valueOf(service.getScenarios().size())}
            };

            for (String[] metric : metrics) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(metric[0]);
                row.createCell(1).setCellValue(metric[1]);
            }
            rowNum++;

            // Business Type Summary Table
            Row busHeader = sheet.createRow(rowNum++);
            busHeader.createCell(0).setCellValue("Business Type Summary");
            busHeader.getCell(0).setCellStyle(subtitleStyle);
            rowNum++;

            // Table Headers
            Row tableHeader = sheet.createRow(rowNum++);
            String[] headers = {"Business Type", "Migration Type", "Source", "Target", "Success", "Failures", "Status"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = tableHeader.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Table Data
            for (ReconciliationSummary summary : service.getSummaries()) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(summary.businessType);
                row.createCell(1).setCellValue(summary.migrationType.getDescription());

                Cell srcCell = row.createCell(2);
                srcCell.setCellValue(summary.sourceCount);
                srcCell.setCellStyle(numberStyle);

                Cell tgtCell = row.createCell(3);
                tgtCell.setCellValue(summary.targetCount);
                tgtCell.setCellStyle(numberStyle);

                Cell sucCell = row.createCell(4);
                sucCell.setCellValue(summary.successCount);
                sucCell.setCellStyle(numberStyle);

                Cell failCell = row.createCell(5);
                failCell.setCellValue(summary.failureCount);
                failCell.setCellStyle(numberStyle);

                Cell statCell = row.createCell(6);
                statCell.setCellValue(summary.getOverallStatus().toString());
                statCell.setCellStyle(getStatusStyle(summary.getOverallStatus()));
            }

            // Auto-size columns
            for (int i = 0; i < 7; i++) {
                sheet.setColumnWidth(i, 5000);
            }
        }

        private void createReconciliationSheet(MigrationService service) {
            Sheet sheet = workbook.createSheet("Reconciliation");
            int rowNum = 0;

            // Title
            Row titleRow = sheet.createRow(rowNum++);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("Record Count Reconciliation by Business Type");
            titleCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 9));
            rowNum++;

            // Headers
            Row headerRow = sheet.createRow(rowNum++);
            String[] headers = {"Business Type", "Source Table", "Target Table", "Migration Type",
                               "Source Count", "Target Count", "Success", "Failures", "Warnings", "Success Rate"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data rows
            for (ReconciliationSummary summary : service.getSummaries()) {
                Row row = sheet.createRow(rowNum++);

                Cell c0 = row.createCell(0);
                c0.setCellValue(summary.businessType);
                c0.setCellStyle(defaultStyle);

                Cell c1 = row.createCell(1);
                c1.setCellValue(summary.sourceTable);
                c1.setCellStyle(defaultStyle);

                Cell c2 = row.createCell(2);
                c2.setCellValue(summary.targetTable);
                c2.setCellStyle(defaultStyle);

                Cell c3 = row.createCell(3);
                c3.setCellValue(summary.migrationType.getDescription());
                c3.setCellStyle(defaultStyle);

                Cell c4 = row.createCell(4);
                c4.setCellValue(summary.sourceCount);
                c4.setCellStyle(numberStyle);

                Cell c5 = row.createCell(5);
                c5.setCellValue(summary.targetCount);
                c5.setCellStyle(numberStyle);

                Cell c6 = row.createCell(6);
                c6.setCellValue(summary.successCount);
                c6.setCellStyle(numberStyle);

                Cell c7 = row.createCell(7);
                c7.setCellValue(summary.failureCount);
                c7.setCellStyle(summary.failureCount > 0 ? failStyle : numberStyle);

                Cell c8 = row.createCell(8);
                c8.setCellValue(summary.warningCount);
                c8.setCellStyle(summary.warningCount > 0 ? warnStyle : numberStyle);

                Cell c9 = row.createCell(9);
                c9.setCellValue(summary.getSuccessRate() / 100.0);
                c9.setCellStyle(percentStyle);
            }

            // Totals row
            rowNum++;
            Row totalRow = sheet.createRow(rowNum);
            Cell totalLabel = totalRow.createCell(0);
            totalLabel.setCellValue("TOTAL");
            totalLabel.setCellStyle(headerStyle);

            int totalSource = service.getSummaries().stream().mapToInt(s -> s.sourceCount).sum();
            int totalTarget = service.getSummaries().stream().mapToInt(s -> s.targetCount).sum();
            int totalSuccess = service.getSummaries().stream().mapToInt(s -> s.successCount).sum();
            int totalFail = service.getSummaries().stream().mapToInt(s -> s.failureCount).sum();
            int totalWarn = service.getSummaries().stream().mapToInt(s -> s.warningCount).sum();

            Cell ts = totalRow.createCell(4);
            ts.setCellValue(totalSource);
            ts.setCellStyle(numberStyle);

            Cell tt = totalRow.createCell(5);
            tt.setCellValue(totalTarget);
            tt.setCellStyle(numberStyle);

            Cell tsc = totalRow.createCell(6);
            tsc.setCellValue(totalSuccess);
            tsc.setCellStyle(numberStyle);

            Cell tf = totalRow.createCell(7);
            tf.setCellValue(totalFail);
            tf.setCellStyle(totalFail > 0 ? failStyle : numberStyle);

            Cell tw = totalRow.createCell(8);
            tw.setCellValue(totalWarn);
            tw.setCellStyle(totalWarn > 0 ? warnStyle : numberStyle);

            Cell tr = totalRow.createCell(9);
            tr.setCellValue(totalSuccess * 1.0 / totalSource);
            tr.setCellStyle(percentStyle);

            // Column widths
            int[] widths = {4500, 6000, 6000, 4500, 3500, 3500, 3000, 3000, 3000, 3500};
            for (int i = 0; i < widths.length; i++) {
                sheet.setColumnWidth(i, widths[i]);
            }
        }

        private void createVerificationSheet(MigrationService service) {
            Sheet sheet = workbook.createSheet("Verification_Scenarios");
            int rowNum = 0;

            // Title
            Row titleRow = sheet.createRow(rowNum++);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("Migration Verification Scenarios");
            titleCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 7));
            rowNum++;

            // Headers
            Row headerRow = sheet.createRow(rowNum++);
            String[] headers = {"Scenario ID", "Scenario Name", "Description", "Type",
                               "Total", "Passed", "Failed", "Status"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Scenario data
            for (VerificationScenario scenario : service.getScenarios()) {
                Row row = sheet.createRow(rowNum++);

                Cell c0 = row.createCell(0);
                c0.setCellValue(scenario.scenarioId);
                c0.setCellStyle(defaultStyle);

                Cell c1 = row.createCell(1);
                c1.setCellValue(scenario.scenarioName);
                c1.setCellStyle(defaultStyle);

                Cell c2 = row.createCell(2);
                c2.setCellValue(scenario.description);
                c2.setCellStyle(defaultStyle);

                Cell c3 = row.createCell(3);
                c3.setCellValue(scenario.migrationType.getDescription());
                c3.setCellStyle(defaultStyle);

                Cell c4 = row.createCell(4);
                c4.setCellValue(scenario.totalRecords);
                c4.setCellStyle(numberStyle);

                Cell c5 = row.createCell(5);
                c5.setCellValue(scenario.passedRecords);
                c5.setCellStyle(numberStyle);

                Cell c6 = row.createCell(6);
                c6.setCellValue(scenario.failedRecords);
                c6.setCellStyle(scenario.failedRecords > 0 ? failStyle : numberStyle);

                Cell c7 = row.createCell(7);
                c7.setCellValue(scenario.status.toString());
                c7.setCellStyle(getStatusStyle(scenario.status));
            }

            // Add notes section
            rowNum += 2;
            Row notesHeader = sheet.createRow(rowNum++);
            notesHeader.createCell(0).setCellValue("Scenario Notes:");
            notesHeader.getCell(0).setCellStyle(subtitleStyle);

            for (VerificationScenario scenario : service.getScenarios()) {
                Row noteRow = sheet.createRow(rowNum++);
                noteRow.createCell(0).setCellValue(scenario.scenarioId + ": " + scenario.notes);
            }

            // Column widths
            int[] widths = {3000, 6000, 10000, 4500, 2500, 2500, 2500, 3000};
            for (int i = 0; i < widths.length; i++) {
                sheet.setColumnWidth(i, widths[i]);
            }
        }

        private void createFailureLogsSheet(MigrationService service) {
            Sheet sheet = workbook.createSheet("Failure_Logs");
            int rowNum = 0;

            // Title
            Row titleRow = sheet.createRow(rowNum++);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("Detailed Failure Logs");
            titleCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 5));
            rowNum++;

            // Filter only failed records
            List<MigrationRecord> failures = service.getAllRecords().stream()
                .filter(r -> r.status == MigrationStatus.FAIL)
                .collect(Collectors.toList());

            // Summary
            Row summaryRow = sheet.createRow(rowNum++);
            summaryRow.createCell(0).setCellValue("Total Failures: " + failures.size());
            rowNum++;

            // Headers
            Row headerRow = sheet.createRow(rowNum++);
            String[] headers = {"Record ID", "Source Table", "Target Table", "Migration Type", "Status", "Error Message"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Failure data (limit to 1000 rows for performance)
            int count = 0;
            for (MigrationRecord record : failures) {
                if (count++ >= 1000) break;

                Row row = sheet.createRow(rowNum++);

                Cell c0 = row.createCell(0);
                c0.setCellValue(record.recordId);
                c0.setCellStyle(defaultStyle);

                Cell c1 = row.createCell(1);
                c1.setCellValue(record.sourceTable);
                c1.setCellStyle(defaultStyle);

                Cell c2 = row.createCell(2);
                c2.setCellValue(record.targetTable);
                c2.setCellStyle(defaultStyle);

                Cell c3 = row.createCell(3);
                c3.setCellValue(record.migrationType.getDescription());
                c3.setCellStyle(defaultStyle);

                Cell c4 = row.createCell(4);
                c4.setCellValue(record.status.toString());
                c4.setCellStyle(failStyle);

                Cell c5 = row.createCell(5);
                c5.setCellValue(record.errorMessage != null ? record.errorMessage : "Unknown error");
                c5.setCellStyle(defaultStyle);
            }

            if (failures.size() > 1000) {
                rowNum++;
                Row truncateRow = sheet.createRow(rowNum);
                truncateRow.createCell(0).setCellValue("... " + (failures.size() - 1000) + " more failures truncated");
            }

            // Column widths
            int[] widths = {4000, 7000, 7000, 4500, 2500, 15000};
            for (int i = 0; i < widths.length; i++) {
                sheet.setColumnWidth(i, widths[i]);
            }
        }
    }

    // =====================================================================
    // MAIN ENTRY POINT
    // =====================================================================

    public static void main(String[] args) {
        try {
            // Run migration simulation
            MigrationService service = new MigrationService();
            service.runMigration();

            // Generate Excel report
            ExcelReportGenerator reportGenerator = new ExcelReportGenerator();
            String outputPath = "OMEGA_Migration_Report_POC.xlsx";

            if (args.length > 0) {
                outputPath = args[0];
            }

            reportGenerator.generateReport(service, outputPath);

            System.out.println("\n========================================");
            System.out.println("  POC Complete!");
            System.out.println("========================================");

        } catch (IOException e) {
            System.err.println("Error generating report: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

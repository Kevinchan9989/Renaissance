1. MNET (External Database) - eApps Schema
The MNET database manages external-facing data, counterparty interactions, and holds the primary source of truth for the Security Master.

MNET (External DB)
│
├── Core Hub (Primary Parent)
│   └── aba0001_security_master (PK: security_code, issue_no)
│       │
│       ├── Explicit Children (Strict Foreign Keys to aba0001)
│       │   ├── aba0004_retail_bid_trans (Retail bid metadata)
│       │   ├── aba0005_rsa_text_enc_trans (Encrypted PGP bid applications)
│       │   ├── aba0006_auction_result (Auction results for banks)
│       │   ├── aba0008_stage_security_master (Staging for post-auction updates)
│       │   ├── aba0011_daily_price (Raw daily price submissions)
│       │   ├── aba0017_final_daily_price (Final system-computed closing prices)
│       │   └── aba0022_non_benchmark (Non-benchmark issues tracking)
│       │
│       └── Implicit Children (Shared Keys, No Strict DB FK)
│           ├── aba0007_detail_auction_result (Detailed individual bid allotments)
│           └── aba0035_security_master_ctg_stg (Contingency staging for security master)
│
├── Independent Master & Configuration Parents
│   ├── aba0009_bank_master (Bank master list and auto-debit indicators)
│   │   └── aba0020_staging_bank_master (Staging table for MEPS+ bank list updates)
│   ├── aba0010_announce_text (Public announcement text/footnotes)
│   ├── aba0013_primary_dealer (Primary dealer list and repo eligibility)
│   ├── aba0015_price_spread (Validation ranges for bond/bill prices)
│   ├── aba0019_public_holiday (System holiday calendar)
│   ├── aba0021_issue_calendar (General issuance calendar details)
│   ├── aba0214_sb_cd_file_type (File type lookup configurations)
│   ├── aba0032_eapps_config (eApps system configurations)
│   └── aba0009_eauction_config (eAuction system configurations)
│
├── Identity & Access Management (IAM)
│   ├── aba0030_corp_pass_mapping (CorpPass UEN-to-Token ID mappings)
│   └── aba0502_pub_key (Public keys for encryption)
│
└── Transient / Log Tables
    ├── aba0012_dp_status (Draft lock status for daily price submissions)
    ├── aba0016_daily_extra_data (Overnight repo submissions - Obsolete)
    ├── aba0018_final_extra_price (Final repo/comm bill prices - Obsolete)
    ├── aba0023_audit_action (Audit logs for actions done in eApps)
    ├── aba0035_retailbid_file (Encrypted retail bid files tracking)
    └── aba0036_retailbid_file (Retail bid processing timestamps and acks)


2. PRI1 (Internal Database) - eAuction & Syndication Schema
The PRI1 database manages internal auction processing, bid allocations, syndication, and internal MAS user roles. It queries MNET via a DB-link but has its own internal transactional tables mapped to the security codes.

PRI1 (Internal DB)
│
├── Transactional Tables (Implicit Children of MNET's aba0001_security_master)
│   ├── aqa0002_transaction (Manual tender/bid submissions)
│   ├── aqa0006_eapps_transaction (eTender electronic forms)
│   ├── aqa0020_auction_results_report (Transaction details for generating reports)
│   │   └── aqa0021_auction_results_report_ctg_stg (Contingency staging for reports)
│   ├── aqa0012_syndication_ins_ret_dt (Institutional & Retail syndication allotments)
│   ├── aqa0013_syndication_coupon_dt (Syndication coupon and price calculations)
│   └── aqa0016_syndicated_sec_mast_dt (Computed syndication master details pending sync)
│
├── Independent Master & Configuration Parents
│   ├── aqa0004_level_action (Role-based access control level definitions)
│   └── aqa0010_action_ref (Mapping of specific modules to user actions)
│
├── Identity & Access Management (IAM)
│   └── aqa0103_PRIVATE_KEY (System private keys for decryption)
│
└── Transient / Sync / Log Indicators
    ├── aqa0005_report_counter (Daily counter for auction result files)
    ├── aqa0007_copy_sec_master_ind (Sync flag: Has PRI1 synced with MNET today?)
    ├── aqa0014_syndication_rpt_count (Daily counter for syndication reports)
    ├── aqa0015_copy_synd_sec_mast_ind (Sync flag: Has syndication data copied to MNET?)
    ├── aqa0017_auction_ind (Flags if auction engine/decrypt is actively running)
    └── aqa0018_retail_bid_proc_ind (Indicators for retail bid batch jobs)

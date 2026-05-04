---
id: g001
date: 2026-05-04
phase: 1-grounding
channel: notebooklm
notebook_url: https://notebooklm.google.com/notebook/05fa56a8-dd88-425c-a678-643a7c24d0aa
topic: "OMEGA data migration strategy overview (R1/R2, sources, cross-cutting)"
prompt: |
  Provide a comprehensive overview of the OMEGA data migration strategy as
  described in the FSDs and architecture documents. Specifically:
    (1) What is the top-down migration approach?
    (2) What are the legacy source systems being migrated (eApps, SBA,
        Syndication, ERF, MNETD, PRI1, MLOG)?
    (3) What is the rationale for splitting migration into R1 and R2 waves,
        and which source domains belong to each wave?
    (4) What are the cross-cutting concerns: master codes, sequencing
        dependencies, parent-child constraints between source tables, and
        validation expectations? Cite the specific FSDs where this guidance
        lives.
answer: |
  While a dedicated "Data Migration Strategy" document containing explicit
  definitions of the "top-down approach," MLOG/MNETD databases, and formal
  parent-child sequencing rules is not present in the provided sources, a
  comprehensive overview of the migration landscape can be constructed.

  (1) Top-down migration approach: not formally defined in the docs. The DM
  pipeline (from chat history) is AWS DMS Full Load → temp Oracle env → cloud
  → custom ETL + DB object translation → PostgreSQL OMEGA. Iterative DVT
  (Data Verification Tests) + DCT (Data Continuity Tests) by MAS users
  validate before Full Dress Rehearsal (FDR) and Go-Live Cutover.

  (2) Legacy sources identified:
    - eApps: Primary Dealer bid submissions / view results (cite 1, 2)
    - eAuction / SGSAuction: MAS FD parameter input, allotment runs (3+)
    - ERF: Enhanced Repo Facility (6)
    - SBA: Savings Bonds Online (SSB) (7)
    - Syndication: previously external + eAuction uploads (8)
    - Legacy DBs: PRI1 (internal — aba0001_security_master,
      aba0006_auction_result, etc.) and MNET (external) (9+)
    - MNETD and MLOG: NOT found in provided sources

  (3) R1 vs R2 — split by business functional boundaries for independent
  deployment, scaling, fault isolation (12):
    - R1: int_issuance_calendar, int_bills_bonds, int_ssb, int_allotment
    - R2: int_erf, int_closing_price
    - eApps only partially decommissioned in R1; OMEGA acts as interim
      middleware router for Daily Closing Prices and Securities Updates
      (13, 14)
    - Interfaces to MEPS+/FMBS/AGD involving ERF or Daily Closing Prices
      are documented "[To be implemented in R2]" (15+)

  (4) Cross-cutting concerns:
    - Master codes: consolidation into cm.cm_master_code +
      cm.cm_master_code_category. Categories include APPSRC (Application
      Source), RECERR (Record Errors), SECTYPE (Security Types), CTY
      (Country Codes) (18+). Legacy Oracle Y/N flags / NUMBER(1) standardize
      to varchar(1) Y/N.
    - FK referential integrity strictly enforced; ETL must sequence inserts
      hierarchically (top-down). Foundational parent records like
      cm.cm_counterparty and iss.iss_issuance must be migrated and assigned
      UUIDs before child transactional records (iss.iss_bid_institutional,
      iss.iss_auction_safeguard).
    - Validations: NRIC Modulus-11 checksum (22, 23), date conformance to
      YYYYMMDD (24), exact numeric precision preservation (Oracle NUMBER
      → PostgreSQL numeric(p,s)).

  Notebook flagged: independently verify exact scoping of MLOG, MNETD, and
  explicit parent-child ETL sequencing rules within internal DM Strategy
  documentation — those details are absent from FSDs.
citations:
  - source: "OMEGA architecture slides + legacy SDS (eApps, eAuction, ERF, SBA)"
    quality: high
  - source: "Interface FSDs (MEPS+, FMBS, AGD)"
    quality: high
  - source: "Master code design refs in cm schema"
    quality: high
  - source: "Validation rules (NRIC Mod-11, YYYYMMDD, numeric precision)"
    quality: high
evaluation:
  confidence: high
  contradictions: []
  gaps:
    - "MNETD database not in NotebookLM sources — user's inventory uses MNETD; need user clarification (likely MNET + 'D' suffix in local vocabulary, or maps to MNET)"
    - "MLOG database not in NotebookLM sources — only marked 'N to migrate' in inventory; verify via legacy-source channel"
    - "No explicit Data Migration Strategy document exists in NotebookLM; strategy details live in chat history / external project plan"
    - "Top-down ETL sequencing rules: only the principle (parents-before-children) is captured; specific ordered table list is not in sources"
  decision: "Use as authoritative grounding for: pipeline shape, R1/R2 module-level boundaries, master-code consolidation, validation rules. Treat MNETD/MLOG and ETL sequencing rules as requiring user clarification."
  needs_user_review: true
  user_questions:
    - "Is MNETD in your inventory the same physical DB as NotebookLM's MNET, or a separate environment (e.g., MNET-Development)?"
    - "Is MLOG out of scope across all releases (R1+R2), or just R1?"
---

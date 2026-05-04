---
id: g003
date: 2026-05-04
phase: 1-grounding
channel: notebooklm
notebook_url: https://notebooklm.google.com/notebook/05fa56a8-dd88-425c-a678-643a7c24d0aa
topic: "_t table convention + migration implications"
prompt: |
  In OMEGA's target PostgreSQL DDL, almost every base table has a twin with
  the suffix '_t' (e.g., cm.cm_counterparty and cm.cm_counterparty_t;
  iss.iss_issuance and iss.iss_issuance_t). What is the purpose of these _t
  tables? Are they audit/history tables, temporal tables, transactional
  twins, or something else? Specifically: (1) what is written to the _t
  table, (2) when, by what mechanism (trigger, app code, batch job)?
  (3) For data migration, do we populate ONLY the base table, ONLY the _t
  table, or BOTH? Cite the FSD or DDL guidance that defines this convention.
answer: |
  The _t suffix tables in OMEGA's PostgreSQL schema are Audit / History
  tables. They are not transactional twins or native PostgreSQL temporal
  tables, but dedicated historical log tables capturing every state change a
  record undergoes throughout its lifecycle.

  (1) What is written: every time a record is created, modified, or deleted
  in the base table, a complete duplicate snapshot of that row's data is
  written to the corresponding _t table. Audit metadata columns mandated by
  the DDL:
    - trans_id / trans_uuid: unique identifier for the audit snapshot
    - audit_action: flag indicating Insert / Update / Delete
    - audit_timestamp: exact system time of the change
    - is_history: 'Y' or 'N' flag denoting historical state

  This data directly powers the User Action Log report (Reports FSD), which
  lets MAS track Value Before / Value After for any modified object.

  (2) Mechanism: populated synchronously by Application Code (ORM entity
  listeners / interceptors like Hibernate Envers) — NOT database triggers.
  The provided OMEGA DDL contains zero CREATE TRIGGER or PL/pgSQL function
  statements linking base tables to _t tables. The OMEGA Java/React app tier
  is explicitly responsible for writing to _t tables during transaction
  commits.

  (3) For migration: populate ONLY the base table with the current active
  state of legacy data. Evidence: the OMEGA Active Setup Configuration Tables
  script inserts INTO the base tables exclusively (cm.cm_master_code,
  cm.cm_bank_master) and bypasses the _t tables.

  Exception: only populate _t tables if MAS Users explicitly require
  translating a legacy Oracle audit table (e.g., eApps ABA0023_AUDIT_ACTION)
  into OMEGA's row-level historical format during DVT.

  Otherwise: leave _t tables EMPTY during initial load. OMEGA application
  will populate them naturally as users start interacting with migrated data
  post-Go-Live.
citations:
  - source: "OMEGADB DDL Schema (audit metadata columns; absence of triggers)"
    quality: high
  - source: "Reports FSD (User Action Log report)"
    quality: high
  - source: "OMEGA Active Setup Configuration Tables script"
    quality: high
  - source: "Legacy reference: eApps ABA0023_AUDIT_ACTION"
    quality: medium
evaluation:
  confidence: high
  contradictions: []
  gaps:
    - "Whether ABA0023_AUDIT_ACTION specifically should be translated into _t for v0.2 — depends on MAS DVT requirements, not yet decided"
  decision: |
    For v0.2 default scope: ALL _t tables are out of scope.
    Mapping rows target base tables ONLY.
    Reduces target table surface from 129 → ~64 base tables.
    Add open question to user: 'Is MAS requesting ABA0023_AUDIT_ACTION
    translation into _t tables for v0.2?'
  needs_user_review: true
  user_questions:
    - "Is MAS requesting any legacy audit table (e.g., ABA0023_AUDIT_ACTION) to be translated into OMEGA's _t format for v0.2? Default assumption: NO."
---

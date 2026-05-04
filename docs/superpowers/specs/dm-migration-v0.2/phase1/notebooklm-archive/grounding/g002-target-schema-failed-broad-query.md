---
id: g002
date: 2026-05-04
phase: 1-grounding
channel: notebooklm
notebook_url: https://notebooklm.google.com/notebook/05fa56a8-dd88-425c-a678-643a7c24d0aa
topic: "OMEGA target schema rationale (broad query — failed)"
prompt: |
  OMEGA's target PostgreSQL schema is organized into multiple top-level schemas
  with prefixes: sec.* (security master), iss.* (issuance), cm.* (common/master
  codes), and likely others. (1) List ALL OMEGA top-level schemas and the design
  rationale for splitting data this way. (2) For each schema, list its core
  tables and what business module/domain owns them (Issuance Calendar,
  Announcements, Bid Collation, Allotment, Syndication, Singapore Savings
  Bonds, Admin/Users/Roles/Holidays, Reports, Common Functions, External Users
  portal). (3) What are the central reference / parent tables that everything
  else FKs into (e.g., cm.cm_counterparty, cm.cm_master_code,
  sec.sec_security_master, iss.iss_issuance)? (4) Are there any target schemas
  that are landing/staging zones (stg.*) versus operational tables, and how
  does data flow between them during migration?
answer: |
  The system was unable to answer.
citations: []
evaluation:
  confidence: n/a
  contradictions: []
  gaps: ["Query was too broad / multi-part; NotebookLM returned 'unable to answer'"]
  decision: "Replace with smaller, focused queries. Schema list extracted directly from omega-ddl-current.dict.json (DDL is authoritative)."
  needs_user_review: false
follow_up_strategy: |
  Schema inventory derived locally:
    - cm  (49 tables) — common/master codes/users/roles/holidays/sysparams
    - iss (43 tables) — issuance, calendar, bids, auctions, SSB, syndication, security master
    - stg (37 tables) — staging zones for AGD/eApps/FI/FMBS/MEPS+ interfaces
    - Total: 129 tables
    - Notable: NO `sec` schema (v0.01 maps to sec.sec_security_master, but
      current DDL only has iss.iss_security_master) — confirms target DDL has
      changed since v0.01.
    - Every base table has a `_t` twin (e.g., iss_issuance + iss_issuance_t).

  Open follow-up to NotebookLM (g003): _t convention + stg flow only.
---

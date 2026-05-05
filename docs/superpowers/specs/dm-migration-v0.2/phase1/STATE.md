# DM Spec v0.2 — Phase 1 Execution STATE

> **Resume guide for a fresh Claude session.** Read this file FIRST when continuing
> Phase 1 execution after a session reset or context compression. Do NOT rely on
> conversational context — it is gone. Every decision worth knowing is on disk.

---

## Read these first (in order)

1. **The spec:** `docs/superpowers/specs/dm-migration-v0.2/2026-05-04-dm-mapping-spec-design.md`
   — five-phase architecture, gate criteria, three-channel Q&A topology.
2. **The Phase 1 plan:** `docs/superpowers/specs/dm-migration-v0.2/2026-05-04-dm-mapping-spec-plan-phase1.md`
   — 17 tasks. Each task has full code + commands. **The plan was amended** (commit `a30cddd`)
   to fix Task 4's shape assumption — see "Plan amendments below.
3. **Grounding decisions:** `docs/superpowers/specs/dm-migration-v0.2/phase1/grounding-decisions.md`
   — D1–D7 (migration pipeline, R1/R2 module-level boundaries, MNETD=MNET, MLOG pending,
   `_t` audit twins out of scope, `sec.*` folded into `iss.*`, `stg.*` runtime-only).
4. **NotebookLM grounding archive:** `docs/superpowers/specs/dm-migration-v0.2/phase1/notebooklm-archive/grounding/`
   — g001 (migration strategy), g002 (failed broad query), g003 (`_t` convention).

---

## Current state (last updated: 2026-05-04)

**Plan progress:** 4 of 17 tasks complete.

**Mode of execution:** subagent-driven (`superpowers:subagent-driven-development` skill).
Fresh subagent dispatched per task with full task text inlined. Spec compliance review
(haiku) → code quality review (`superpowers:code-reviewer`) → mark complete.

**Branch:** `main` (user explicitly consented to no isolation; Phase 1 commits are on main).

**Effort level required per session:** `/effort max` at session start.

### Completed Plan Tasks (with commit SHAs)

| Plan task | What it is | Commit |
|---|---|---|
| 1 | JSON Schema for scope-relationship-map | `4d266ee` |
| 2 | Python package skeleton + pinned deps + venv | `e177e17` |
| 3 | Schema validator (TDD, 3 tests) | `6161f1e` |
| 4 | Source DDL extractor (TDD, 8 tests) | `27356ad` (initial), `74a9b92` (I-1/I-2 fix) |

### Plan amendments

| Commit | What | Why |
|---|---|---|
| `a30cddd` | Task 4 shape fix | dm-tool stores all DDL in `data.targets` regardless of file type; `data.sources` is always empty. Source vs target lives at file level via `type` field (oracle vs postgresql). Fixture, test, implementation, expected counts all corrected. |
| `57f4922` | Column-level comprehension required | User flagged: cannot confidently author Transformation cells without column-by-column understanding on both sides. Phase 1 now establishes per-column comprehension as a gate-blocking deliverable. Schema adds `comprehension_status` per column. T8 attaches status. T12 emits per-table column-batch prompts (QC-*). T17 gates on zero pending. T16 merger contract defined; implementation deferred to that task. |

### Open follow-ups (not blocking subsequent tasks)

- M-1 to M-5 from Task 4 code review (CLI argparse, broader negative tests, missing-key tests, double iteration of constraints, unused `argv`). Defer until they actually bite.
- Task 3 reviewer suggested broader test coverage for enums + tightening `pytest.raises(Exception)` to `ValidationError`. Defer to T8/T9 timeframe.

### In-flight subagents

None. Last subagent (Task 4 fix code-quality re-review) returned APPROVED.

### Next intended action

Dispatch implementer for **Plan Task 5** (Target DDL extractor — preserves explanations,
`reviewed` flag, AND emits `comprehension_status` per column per the post-`57f4922`
amendment). Sonnet model. Plan §B Task 5.

Note: Task 4 (already done at commit `74a9b92`) does NOT emit `explanation`/`possible_values`
on source columns. The combiner (T8) defaults missing fields to "" via the
`_attach_comprehension_status` helper; source columns therefore default to
`comprehension_status: "pending"`. This is acceptable — the user said source-side dm-tool
explanations are mostly empty anyway, so nothing is lost. If pre-authored source
explanations turn out to be valuable, dispatch a small Task 4 fix later.

---

## Session-resume runbook

If you (a fresh Claude session) inherit this work:

1. Run `git log --oneline -20` to see recent commits and confirm progress.
2. Run `git status` to see if there are uncommitted changes (there shouldn't be unless
   a task was interrupted mid-implementation).
3. Read this STATE.md, the spec, and the plan in that order.
4. Check the Tasks list (the harness's task tracker) for any `in_progress` task — that's
   where the prior session was. If empty/stale, default to "next intended action" above.
5. Set `/effort max` if not already set.
6. Confirm with the user which task to dispatch next (don't auto-resume; they may want
   to re-grill or change direction).
7. Use the `superpowers:subagent-driven-development` skill workflow:
   implementer subagent → spec reviewer subagent → code-reviewer agent → mark complete.
8. **Update this STATE.md after each task** before moving to the next.

---

## Key project conventions (preserved across sessions)

- **Q&A archive shape:** YAML frontmatter per spec §5.5 (`id`, `date`, `phase`, `channel`,
  `topic`, `prompt`, `answer`, `citations[]`, `evaluation`).
- **Three Q&A channels:** NotebookLM (target intent), legacy-source Claude/Cursor session
  (source-system semantics), OMEGA DB queries (volume/integrity/sample values).
- **Commit message style:** Conventional Commits — `feat(dm-phase1):`, `fix(dm-phase1):`,
  `docs(dm-phase1):` — with HEREDOC body and `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` footer.
- **`_t` tables out of scope** (per grounding D5). Mapping rows target base tables only.
- **`stg.*` schema out of scope** (per grounding D7). Runtime-only.
- **`sec.*` schema deprecated** (per grounding D7). Folded into `iss.*`. v0.2 patches
  v0.01 modules where they reference `sec.*`.

---

## Git state checkpoint commands

Run these in any new session to confirm the world is as this STATE.md describes:

```bash
# Most recent commits should include the SHAs above in chronological order
git log --oneline --grep="dm-phase1" -20

# This should show no in-flight implementation files outside scripts/dm-phase1/
git status --short docs/ scripts/ dm-tool/

# Confirm Phase 1 directory layout
ls docs/superpowers/specs/dm-migration-v0.2/phase1/
ls scripts/dm-phase1/
ls dm-tool/src/schemas/
```

---

## Anchor commits (do not rebase past these)

- `ffe838d` — design spec + grounding archive
- `3e4752e` — Phase 1 plan
- `a30cddd` — Task 4 plan amendment (data.sources/data.targets shape fix)
- `4d266ee`, `e177e17`, `6161f1e`, `27356ad`, `74a9b92` — Tasks 1–4 implementation
- `dbbde86` — STATE.md initial
- `57f4922` — comprehension amendment (column-level comprehension as Phase 1 gate)

If `git log` shows commits beyond `74a9b92` that are not listed above, this STATE.md is
stale; trust git over this file.

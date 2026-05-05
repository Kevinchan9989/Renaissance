# Phase 1 Open Questions

_Generated: 2026-05-05T06:21:42Z_  _Sources: omega-ddl-current.dict.json, script-00-BE_MNETD.json, script-04-FE_TRI1.json, inventory.json_

Each question below is ready to paste into the appropriate channel. Bring the answer back to the corresponding archive directory.

## NotebookLM channel  (42 questions)

Paste each prompt into your NotebookLM session for the OMEGA notebook (https://notebooklm.google.com/notebook/05fa56a8-dd88-425c-a678-643a7c24d0aa). Archive answers as `phase1/notebooklm-archive/q-<id>-<slug>.md` using the YAML schema from spec §5.5 (extended with `column_explanations` per §5.6a).

### QC-NLM-001
_For target table: `cm.cm_applicant`_

```
Comprehend every column on `cm.cm_applicant` (cm). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - applicant_name (VARCHAR(100), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)
  - user_action (VARCHAR(50), nullable=True, default=-)
  - status (VARCHAR(50), nullable=True, default=-)
  - cm_applicant_submission_group_uuid (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    applicant_name:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    user_action:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cm_applicant_submission_group_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-002
_For target table: `cm.cm_applicant_submission_group`_

```
Comprehend every column on `cm.cm_applicant_submission_group` (cm). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - cm_documents_uuid (VARCHAR(36), nullable=True, default=-)
  - submission_type (VARCHAR(50), nullable=True, default=-)
  - status (VARCHAR(50), nullable=True, default=-)
  - remarks (VARCHAR(4000), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)
  - user_action (VARCHAR(50), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cm_documents_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    submission_type:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    remarks:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    user_action:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-003
_For target table: `cm.cm_batch_job`_

```
Comprehend every column on `cm.cm_batch_job` (cm). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - job_id_code (VARCHAR(50), nullable=True, default=-)
  - job_name (VARCHAR(255), nullable=True, default=-)
  - job_parameter_json (TEXT, nullable=True, default=-)
  - job_handler (VARCHAR(1024), nullable=True, default=-)
  - start_datetime (TIMESTAMP, nullable=True, default=-)
  - end_datetime (TIMESTAMP, nullable=True, default=-)
  - status_code (VARCHAR(50), nullable=True, default=-)
  - job_type (VARCHAR(50), nullable=True, default=-)
  - exception_details (TEXT, nullable=True, default=-)
  - outcome (TEXT, nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    job_id_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    job_name:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    job_parameter_json:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    job_handler:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    start_datetime:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    end_datetime:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    status_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    job_type:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    exception_details:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    outcome:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-004
_For target table: `cm.cm_batch_job_detail`_

```
Comprehend every column on `cm.cm_batch_job_detail` (cm). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - cm_batch_job_uuid (VARCHAR(36), nullable=True, default=-)
  - ref_id (VARCHAR(36), nullable=True, default=-)
  - ref_table (VARCHAR(100), nullable=True, default=-)
  - status (VARCHAR(100), nullable=True, default=-)
  - txn_id (VARCHAR(100), nullable=True, default=-)
  - remark (VARCHAR(4000), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cm_batch_job_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ref_id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ref_table:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    txn_id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    remark:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-005
_For target table: `cm.cm_corppass_role_map`_

```
Comprehend every column on `cm.cm_corppass_role_map` (cm). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - corppass_role_code (VARCHAR(100), nullable=True, default=-)
  - kaizen_role_code (VARCHAR(128), nullable=True, default=-)
  - counterparty_type (VARCHAR(50), nullable=True, default=-)
  - is_active (VARCHAR(1), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    corppass_role_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    kaizen_role_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    counterparty_type:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_active:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-006
_For target table: `cm.cm_counterparty`_

```
Comprehend every column on `cm.cm_counterparty` (cm). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - counterparty_name (VARCHAR(100), nullable=True, default=-)
  - bank_code (VARCHAR(4), nullable=True, default=-)
  - short_name (VARCHAR(8), nullable=True, default=-)
  - uen (VARCHAR(10), nullable=True, default=-)
  - srs_omnibus_acc_no (VARCHAR(16), nullable=True, default=-)
  - is_retail_pd (VARCHAR(1), nullable=True, default=-)
  - is_non_retail_pd (VARCHAR(1), nullable=True, default=-)
  - is_bnd_bank (VARCHAR(1), nullable=True, default=-)
  - status (VARCHAR(50), nullable=True, default=-)
  - is_active (VARCHAR(50), nullable=True, default=-)
  - remarks (VARCHAR(4000), nullable=True, default=-)
  - is_editable (VARCHAR(1), nullable=True, default=-)
  - is_mas_user (VARCHAR(1), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)
  - user_action (VARCHAR(50), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    counterparty_name:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    bank_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    short_name:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uen:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    srs_omnibus_acc_no:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_retail_pd:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_non_retail_pd:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_bnd_bank:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_active:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    remarks:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_editable:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_mas_user:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    user_action:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-007
_For target table: `cm.cm_documents`_

```
Comprehend every column on `cm.cm_documents` (cm). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - bucket (VARCHAR(128), nullable=True, default=-)
  - path (VARCHAR(256), nullable=True, default=-)
  - file_name (VARCHAR(128), nullable=True, default=-)
  - s3_version_id (VARCHAR(1024), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    bucket:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    path:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    file_name:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    s3_version_id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-008
_For target table: `cm.cm_file_record_error`_

```
Comprehend every column on `cm.cm_file_record_error` (cm). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - cm_file_registry_uuid (VARCHAR(36), nullable=True, default=-)
  - line_number (NUMERIC(10,0), nullable=True, default=-)
  - record_error_code (VARCHAR(50), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cm_file_registry_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    line_number:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    record_error_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-009
_For target table: `cm.cm_file_registry`_

```
Comprehend every column on `cm.cm_file_registry` (cm). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - in_cm_document_uuid (VARCHAR(36), nullable=True, default=-)
  - out_cm_document_uuid (VARCHAR(36), nullable=True, default=-)
  - file_type (VARCHAR(50), nullable=True, default=-)
  - file_source (VARCHAR(50), nullable=True, default=-)
  - total_records (NUMERIC(10,0), nullable=True, default=-)
  - successful_records (NUMERIC(10,0), nullable=True, default=-)
  - failed_records (NUMERIC(10,0), nullable=True, default=-)
  - status (VARCHAR(50), nullable=True, default=-)
  - file_error_code (VARCHAR(50), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    in_cm_document_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    out_cm_document_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    file_type:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    file_source:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    total_records:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    successful_records:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    failed_records:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    file_error_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-010
_For target table: `cm.cm_internal_role_group`_

```
Comprehend every column on `cm.cm_internal_role_group` (cm). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - group_code (VARCHAR(50), nullable=True, default=-)
  - group_name (VARCHAR(128), nullable=True, default=-)
  - description (VARCHAR(255), nullable=True, default=-)
  - is_active (VARCHAR(1), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    group_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    group_name:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    description:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_active:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-011
_For target table: `cm.cm_internal_role_group_map`_

```
Comprehend every column on `cm.cm_internal_role_group_map` (cm). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - cm_internal_role_group_uuid (VARCHAR(36), nullable=True, default=-)
  - kaizen_role_code (VARCHAR(128), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cm_internal_role_group_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    kaizen_role_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-012
_For target table: `cm.cm_master_code`_

```
Comprehend every column on `cm.cm_master_code` (cm). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - master_code_key (VARCHAR(50), nullable=True, default=-)
  - mastercode_category_uuid (VARCHAR(36), nullable=True, default=-)
  - code_value (VARCHAR(512), nullable=True, default=-)
  - code_description (VARCHAR(512), nullable=True, default=-)
  - filter_value (VARCHAR(512), nullable=True, default=-)
  - sequence_no (NUMERIC, nullable=True, default=-)
  - remarks (VARCHAR(255), nullable=True, default=-)
  - status (VARCHAR(50), nullable=True, default=-)
  - effective_from (TIMESTAMP, nullable=True, default=-)
  - effective_to (TIMESTAMP, nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_editable (VARCHAR(1), nullable=True, default=-)
  - is_centrally_managed (VARCHAR(1), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    master_code_key:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    mastercode_category_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    code_value:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    code_description:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    filter_value:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    sequence_no:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    remarks:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    effective_from:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    effective_to:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_editable:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_centrally_managed:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-013
_For target table: `cm.cm_master_code_category`_

```
Comprehend every column on `cm.cm_master_code_category` (cm). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - category_description (VARCHAR(512), nullable=True, default=-)
  - is_editable (VARCHAR(1), nullable=True, default=-)
  - cate_code (VARCHAR(20), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    category_description:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_editable:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cate_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-014
_For target table: `cm.cm_public_holiday`_

```
Comprehend every column on `cm.cm_public_holiday` (cm). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - date (TIMESTAMP, nullable=True, default=-)
  - name (VARCHAR(64), nullable=True, default=-)
  - country (VARCHAR(2), nullable=True, default=-)
  - status (VARCHAR(50), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    date:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    name:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    country:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-015
_For target table: `cm.cm_report_metadata`_

```
Comprehend every column on `cm.cm_report_metadata` (cm). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - report_code (VARCHAR(50), nullable=True, default=-)
  - report_name (VARCHAR(100), nullable=True, default=-)
  - template_path (VARCHAR(255), nullable=True, default=-)
  - resource_bundle (VARCHAR(100), nullable=True, default=-)
  - data_source_type (VARCHAR(3), nullable=True, default=-)
  - data_query (TEXT, nullable=True, default=-)
  - output_formats (VARCHAR(20), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    report_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    report_name:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    template_path:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    resource_bundle:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    data_source_type:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    data_query:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    output_formats:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-016
_For target table: `cm.cm_sectype_params`_

```
Comprehend every column on `cm.cm_sectype_params` (cm). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - base_cm_sectype_uuid (VARCHAR(36), nullable=True, default=-)
  - security_type (VARCHAR(50), nullable=True, default=-)
  - bill_bond_indicator (VARCHAR(4), nullable=True, default=-)
  - currency (VARCHAR(10), nullable=True, default=-)
  - issuer (VARCHAR(255), nullable=True, default=-)
  - sale_method (VARCHAR(50), nullable=True, default=-)
  - min_denomination (NUMERIC(13,0), nullable=True, default=-)
  - coupon_payment_freq (VARCHAR(50), nullable=True, default=-)
  - source_of_funds (VARCHAR(100), nullable=True, default=-)
  - enable_reopen (VARCHAR(1), nullable=True, default=-)
  - enable_subtypes (VARCHAR(1), nullable=True, default=-)
  - enable_retail (VARCHAR(1), nullable=True, default=-)
  - enable_institutional (VARCHAR(1), nullable=True, default=-)
  - enable_comp_bids (VARCHAR(1), nullable=True, default=-)
  - enable_noncomp_bids (VARCHAR(1), nullable=True, default=-)
  - enable_negative_yields (VARCHAR(1), nullable=True, default=-)
  - enable_auction_safeguards (VARCHAR(1), nullable=True, default=-)
  - enable_underbidding (VARCHAR(1), nullable=True, default=-)
  - enable_allotment_limits (VARCHAR(1), nullable=True, default=-)
  - retail_allotment_in_omega (VARCHAR(1), nullable=True, default=-)
  - bound_offset (NUMERIC(4,0), nullable=True, default=-)
  - underbidding_percentile (NUMERIC(5,2), nullable=True, default=-)
  - overall_issue_limit_pd (NUMERIC(5,2), nullable=True, default=-)
  - overall_issue_limit_nonpd (NUMERIC(5,2), nullable=True, default=-)
  - ind_noncomp_limit_pd (NUMERIC(5,2), nullable=True, default=-)
  - ind_noncomp_limit_nonpd (NUMERIC(13,0), nullable=True, default=-)
  - overall_noncomp_limit (NUMERIC(5,2), nullable=True, default=-)
  - ssb_aggregate_limit (NUMERIC(13,0), nullable=True, default=-)
  - public_offer_issue_limit (NUMERIC(5,2), nullable=True, default=-)
  - min_tender_amount (NUMERIC(13,0), nullable=True, default=-)
  - default_mas_a_amount (NUMERIC(13,0), nullable=True, default=-)
  - mas_max_notional (NUMERIC(13,0), nullable=True, default=-)
  - mas_max_pct (NUMERIC(5,2), nullable=True, default=-)
  - max_allotment_per_issuance (NUMERIC(13,0), nullable=True, default=-)
  - calendar_freq (VARCHAR(50), nullable=True, default=-)
  - ssb_announcement_day (VARCHAR(50), nullable=True, default=-)
  - announcement_day_offset (NUMERIC(3,0), nullable=True, default=-)
  - auction_day_offset (NUMERIC(3,0), nullable=True, default=-)
  - size_announcement_day_offset (NUMERIC(3,0), nullable=True, default=-)
  - announcement_footnotes (TEXT, nullable=True, default=-)
  - footnotes_reopen_addendum (TEXT, nullable=True, default=-)
  - calendar_footnotes (TEXT, nullable=True, default=-)
  - coupon_rate_desc (VARCHAR(255), nullable=True, default=-)
  - yield_price_desc (VARCHAR(255), nullable=True, default=-)
  - comp_app_desc (VARCHAR(255), nullable=True, default=-)
  - noncomp_app_desc (VARCHAR(255), nullable=True, default=-)
  - eligible_applicants_desc (VARCHAR(255), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    base_cm_sectype_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    security_type:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    bill_bond_indicator:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    currency:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    issuer:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    sale_method:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    min_denomination:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    coupon_payment_freq:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    source_of_funds:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    enable_reopen:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    enable_subtypes:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    enable_retail:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    enable_institutional:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    enable_comp_bids:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    enable_noncomp_bids:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    enable_negative_yields:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    enable_auction_safeguards:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    enable_underbidding:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    enable_allotment_limits:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    retail_allotment_in_omega:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    bound_offset:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    underbidding_percentile:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    overall_issue_limit_pd:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    overall_issue_limit_nonpd:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ind_noncomp_limit_pd:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ind_noncomp_limit_nonpd:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    overall_noncomp_limit:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ssb_aggregate_limit:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    public_offer_issue_limit:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    min_tender_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    default_mas_a_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    mas_max_notional:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    mas_max_pct:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    max_allotment_per_issuance:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    calendar_freq:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ssb_announcement_day:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    announcement_day_offset:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    auction_day_offset:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    size_announcement_day_offset:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    announcement_footnotes:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    footnotes_reopen_addendum:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    calendar_footnotes:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    coupon_rate_desc:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    yield_price_desc:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    comp_app_desc:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    noncomp_app_desc:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    eligible_applicants_desc:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-017
_For target table: `cm.cm_status_map`_

```
Comprehend every column on `cm.cm_status_map` (cm). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - int_code_key (VARCHAR(50), nullable=True, default=-)
  - ext_code_key (VARCHAR(50), nullable=True, default=-)
  - counterparty_type (VARCHAR(50), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    int_code_key:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ext_code_key:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    counterparty_type:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-018
_For target table: `cm.cm_subtype_params`_

```
Comprehend every column on `cm.cm_subtype_params` (cm). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - cm_sectype_uuid (VARCHAR(36), nullable=True, default=-)
  - name (VARCHAR(100), nullable=True, default=-)
  - announcement_footnotes (TEXT, nullable=True, default=-)
  - issue_code_5th_char (VARCHAR(1), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cm_sectype_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    name:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    announcement_footnotes:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    issue_code_5th_char:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-019
_For target table: `cm.cm_tenor_params`_

```
Comprehend every column on `cm.cm_tenor_params` (cm). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - cm_sectype_uuid (VARCHAR(36), nullable=True, default=-)
  - tenor_value (NUMERIC(3,0), nullable=True, default=-)
  - tenor_unit (VARCHAR(1), nullable=True, default=-)
  - issue_code_prefix (VARCHAR(2), nullable=True, default=-)
  - issue_frequency (VARCHAR(50), nullable=True, default=-)
  - bucket_min_val (NUMERIC(3,0), nullable=True, default=-)
  - bucket_max_val (NUMERIC(3,0), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_active (VARCHAR(1), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cm_sectype_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    tenor_value:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    tenor_unit:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    issue_code_prefix:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    issue_frequency:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    bucket_min_val:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    bucket_max_val:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_active:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-020
_For target table: `cm.cm_user_role_group_assign`_

```
Comprehend every column on `cm.cm_user_role_group_assign` (cm). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - cm_user_tbl_uuid (VARCHAR(36), nullable=True, default=-)
  - cm_internal_role_group_uuid (VARCHAR(36), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cm_user_tbl_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cm_internal_role_group_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-021
_For target table: `cm.cm_user_tbl`_

```
Comprehend every column on `cm.cm_user_tbl` (cm). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - iam_user_id (VARCHAR(64), nullable=True, default=-)
  - user_acct_id (VARCHAR(64), nullable=True, default=-)
  - cm_counterparty_uuid (VARCHAR(36), nullable=True, default=-)
  - is_internal_user (VARCHAR(1), nullable=True, default=-)
  - uen_no (VARCHAR(10), nullable=True, default=-)
  - nric_hash (VARCHAR(255), nullable=True, default=-)
  - last_login_dt (TIMESTAMP, nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)
  - email (VARCHAR(255), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iam_user_id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    user_acct_id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cm_counterparty_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_internal_user:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uen_no:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    nric_hash:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    last_login_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    email:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-022
_For target table: `iss.iss_announcement_details`_

```
Comprehend every column on `iss.iss_announcement_details` (iss). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - iss_issuance_uuid (VARCHAR(36), nullable=True, default=-)
  - iss_calendar_data_uuid (VARCHAR(36), nullable=True, default=-)
  - security_code (VARCHAR(8), nullable=True, default=-)
  - isin_code (VARCHAR(12), nullable=True, default=-)
  - security_type (VARCHAR(50), nullable=True, default=-)
  - issuance_type (VARCHAR(50), nullable=True, default=-)
  - sgs_type (VARCHAR(50), nullable=True, default=-)
  - tenor (NUMERIC(3,0), nullable=True, default=-)
  - tenor_unit (VARCHAR(1), nullable=True, default=-)
  - new_reopen_flag (VARCHAR(1), nullable=True, default=-)
  - is_benchmark (VARCHAR(1), nullable=True, default=-)
  - announcement_dt (TIMESTAMP, nullable=True, default=-)
  - auction_dt (TIMESTAMP, nullable=True, default=-)
  - issue_dt (TIMESTAMP, nullable=True, default=-)
  - maturity_dt (TIMESTAMP, nullable=True, default=-)
  - publication_dt (TIMESTAMP, nullable=True, default=-)
  - first_coupon_payment_dt (TIMESTAMP, nullable=True, default=-)
  - next_coupon_payment_dt (TIMESTAMP, nullable=True, default=-)
  - int_date1 (TIMESTAMP, nullable=True, default=-)
  - int_date2 (TIMESTAMP, nullable=True, default=-)
  - pricing_dt (TIMESTAMP, nullable=True, default=-)
  - public_offer_start_dt (TIMESTAMP, nullable=True, default=-)
  - public_offer_end_dt (TIMESTAMP, nullable=True, default=-)
  - app_closing_dt (TIMESTAMP, nullable=True, default=-)
  - total_amount_offered (NUMERIC(13,0), nullable=True, default=-)
  - mas_intended_tender_amt (NUMERIC(13,0), nullable=True, default=-)
  - coupon_rate (VARCHAR(100), nullable=True, default=-)
  - accrued_interest_days (NUMERIC(3,0), nullable=True, default=-)
  - announcement_footnotes (TEXT, nullable=True, default=-)
  - remarks (VARCHAR(4000), nullable=True, default=-)
  - is_published_immediately (VARCHAR(1), nullable=True, default=-)
  - user_action (VARCHAR(50), nullable=True, default=-)
  - status (VARCHAR(50), nullable=True, default=-)
  - wf_process_id (VARCHAR(255), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_issuance_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_calendar_data_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    security_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    isin_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    security_type:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    issuance_type:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    sgs_type:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    tenor:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    tenor_unit:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    new_reopen_flag:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_benchmark:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    announcement_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    auction_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    issue_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    maturity_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    publication_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    first_coupon_payment_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    next_coupon_payment_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    int_date1:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    int_date2:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    pricing_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    public_offer_start_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    public_offer_end_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    app_closing_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    total_amount_offered:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    mas_intended_tender_amt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    coupon_rate:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    accrued_interest_days:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    announcement_footnotes:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    remarks:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_published_immediately:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    user_action:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    wf_process_id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-023
_For target table: `iss.iss_announcement_stepup_rates`_

```
Comprehend every column on `iss.iss_announcement_stepup_rates` (iss). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - iss_announcement_details_uuid (VARCHAR(36), nullable=True, default=-)
  - year (NUMERIC(4,0), nullable=True, default=-)
  - coupon_rate_pct (NUMERIC(5,2), nullable=True, default=-)
  - avg_annual_return_pct (NUMERIC(5,2), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_announcement_details_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    year:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    coupon_rate_pct:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    avg_annual_return_pct:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-024
_For target table: `iss.iss_auction_run`_

```
Comprehend every column on `iss.iss_auction_run` (iss). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - iss_issuance_uuid (VARCHAR(36), nullable=True, default=-)
  - run_no (NUMERIC(2,0), nullable=True, default=-)
  - status (VARCHAR(50), nullable=True, default=-)
  - underbid_detected (VARCHAR(1), nullable=True, default=-)
  - safeguard_configured (VARCHAR(1), nullable=True, default=-)
  - is_oversubscribed (VARCHAR(1), nullable=True, default=-)
  - auction_strength (VARCHAR(50), nullable=True, default=-)
  - warning_error_details (JSONB, nullable=True, default=-)
  - applied_reference_yield (NUMERIC(5,2), nullable=True, default=-)
  - applied_lower_bound_yield (NUMERIC(5,2), nullable=True, default=-)
  - applied_upper_bound_yield (NUMERIC(5,2), nullable=True, default=-)
  - pre_cut_off_yield (NUMERIC(5,2), nullable=True, default=-)
  - accepted_comp_amount (NUMERIC(13,0), nullable=True, default=-)
  - accepted_noncomp_amount (NUMERIC(13,0), nullable=True, default=-)
  - allotted_comp_amount (NUMERIC(13,0), nullable=True, default=-)
  - allotted_noncomp_amount (NUMERIC(13,0), nullable=True, default=-)
  - mas_noncomp_alloted_amt_a (NUMERIC(13,0), nullable=True, default=-)
  - mas_noncomp_alloted_amt_b (NUMERIC(13,0), nullable=True, default=-)
  - mas_comp_alloted_amt_c (NUMERIC(13,0), nullable=True, default=-)
  - total_amount_applied (NUMERIC(13,0), nullable=True, default=-)
  - total_amount_allotted (NUMERIC(13,0), nullable=True, default=-)
  - total_amount_applied_comp (NUMERIC(13,0), nullable=True, default=-)
  - total_amount_applied_noncomp (NUMERIC(13,0), nullable=True, default=-)
  - mas_amount_allotted (NUMERIC(13,0), nullable=True, default=-)
  - noncomp_amount_allotted (NUMERIC(13,0), nullable=True, default=-)
  - cutoff_yield (NUMERIC(5,2), nullable=True, default=-)
  - average_yield (NUMERIC(5,2), nullable=True, default=-)
  - median_yield (NUMERIC(5,2), nullable=True, default=-)
  - cutoff_price (NUMERIC(7,4), nullable=True, default=-)
  - average_price (NUMERIC(7,4), nullable=True, default=-)
  - median_price (NUMERIC(7,4), nullable=True, default=-)
  - closing_price (NUMERIC(9,4), nullable=True, default=-)
  - comp_cutoff_allotment_pct (NUMERIC(4,2), nullable=True, default=-)
  - noncomp_allotment_pct (NUMERIC(5,2), nullable=True, default=-)
  - bid_to_cover_ratio (NUMERIC(6,2), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_issuance_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    run_no:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    underbid_detected:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    safeguard_configured:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_oversubscribed:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    auction_strength:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    warning_error_details:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    applied_reference_yield:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    applied_lower_bound_yield:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    applied_upper_bound_yield:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    pre_cut_off_yield:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    accepted_comp_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    accepted_noncomp_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    allotted_comp_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    allotted_noncomp_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    mas_noncomp_alloted_amt_a:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    mas_noncomp_alloted_amt_b:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    mas_comp_alloted_amt_c:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    total_amount_applied:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    total_amount_allotted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    total_amount_applied_comp:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    total_amount_applied_noncomp:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    mas_amount_allotted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    noncomp_amount_allotted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cutoff_yield:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    average_yield:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    median_yield:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cutoff_price:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    average_price:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    median_price:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    closing_price:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    comp_cutoff_allotment_pct:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    noncomp_allotment_pct:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    bid_to_cover_ratio:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-025
_For target table: `iss.iss_auction_safeguard`_

```
Comprehend every column on `iss.iss_auction_safeguard` (iss). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - iss_issuance_id (VARCHAR(36), nullable=True, default=-)
  - lower_bound_yield (NUMERIC(10,6), nullable=True, default=-)
  - upper_bound_yield (NUMERIC(10,6), nullable=True, default=-)
  - reference_yield (NUMERIC(10,6), nullable=True, default=-)
  - mas_a_amt (NUMERIC(20,0), nullable=True, default=-)
  - mas_b_amt (NUMERIC(20,0), nullable=True, default=-)
  - mas_max_amt (NUMERIC(20,0), nullable=True, default=-)
  - cmdoc_ref_id (VARCHAR(36), nullable=True, default=-)
  - status (VARCHAR(50), nullable=True, default=-)
  - remarks (VARCHAR(4000), nullable=True, default=-)
  - wf_process_id (VARCHAR(255), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)
  - user_action (VARCHAR(50), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_issuance_id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    lower_bound_yield:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    upper_bound_yield:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    reference_yield:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    mas_a_amt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    mas_b_amt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    mas_max_amt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cmdoc_ref_id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    remarks:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    wf_process_id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    user_action:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-026
_For target table: `iss.iss_bid_institutional`_

```
Comprehend every column on `iss.iss_bid_institutional` (iss). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - iss_issuance_uuid (VARCHAR(36), nullable=True, default=-)
  - cm_counterparty_uuid (VARCHAR(36), nullable=True, default=-)
  - iss_bid_submission_group_uuid (VARCHAR(36), nullable=True, default=-)
  - cm_file_registry_uuid (VARCHAR(36), nullable=True, default=-)
  - iss_auction_run_uuid (VARCHAR(36), nullable=True, default=-)
  - role_group (VARCHAR(50), nullable=True, default=-)
  - user_action (VARCHAR(50), nullable=True, default=-)
  - status (VARCHAR(50), nullable=True, default=-)
  - bank_ref_no (VARCHAR(8), nullable=True, default=-)
  - applicant_name (VARCHAR(100), nullable=True, default=-)
  - type_of_applicant (VARCHAR(50), nullable=True, default=-)
  - submission_method (VARCHAR(50), nullable=True, default=-)
  - application_type (VARCHAR(50), nullable=True, default=-)
  - settlement_bank_code (VARCHAR(4), nullable=True, default=-)
  - custody_code (VARCHAR(50), nullable=True, default=-)
  - currency (VARCHAR(3), nullable=True, default=-)
  - is_competitive (VARCHAR(1), nullable=True, default=-)
  - yield_pct (NUMERIC(5,2), nullable=True, default=-)
  - price (NUMERIC(7,4), nullable=True, default=-)
  - nominal_amount (NUMERIC(13,0), nullable=True, default=-)
  - accepted_amount (NUMERIC(13,0), nullable=True, default=-)
  - allotted_amount (NUMERIC(13,0), nullable=True, default=-)
  - settlement_amount (NUMERIC(17,2), nullable=True, default=-)
  - received_dt (TIMESTAMP, nullable=True, default=-)
  - bid_status (VARCHAR(50), nullable=True, default=-)
  - bid_error_desc (VARCHAR(50), nullable=True, default=-)
  - remarks (VARCHAR(4000), nullable=True, default=-)
  - wf_process_id (VARCHAR(255), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_issuance_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cm_counterparty_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_bid_submission_group_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cm_file_registry_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_auction_run_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    role_group:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    user_action:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    bank_ref_no:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    applicant_name:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    type_of_applicant:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    submission_method:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    application_type:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    settlement_bank_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    custody_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    currency:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_competitive:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    yield_pct:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    price:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    nominal_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    accepted_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    allotted_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    settlement_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    received_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    bid_status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    bid_error_desc:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    remarks:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    wf_process_id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-027
_For target table: `iss.iss_bid_retail`_

```
Comprehend every column on `iss.iss_bid_retail` (iss). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - iss_issuance_uuid (VARCHAR(36), nullable=True, default=-)
  - cm_counterparty_uuid (VARCHAR(36), nullable=True, default=-)
  - iss_bid_submission_group_uuid (VARCHAR(36), nullable=True, default=-)
  - cm_file_registry_uuid (VARCHAR(36), nullable=True, default=-)
  - iss_auction_run_uuid (VARCHAR(36), nullable=True, default=-)
  - role_group (VARCHAR(50), nullable=True, default=-)
  - user_action (VARCHAR(50), nullable=True, default=-)
  - status (VARCHAR(50), nullable=True, default=-)
  - bank_ref_no (VARCHAR(8), nullable=True, default=-)
  - nric_passport (VARCHAR(14), nullable=True, default=-)
  - applicant_name (VARCHAR(100), nullable=True, default=-)
  - nationality (VARCHAR(50), nullable=True, default=-)
  - nation_code (VARCHAR(50), nullable=True, default=-)
  - type_of_applicant (VARCHAR(50), nullable=True, default=-)
  - submission_method (VARCHAR(50), nullable=True, default=-)
  - application_type (VARCHAR(50), nullable=True, default=-)
  - cdp_account_no (VARCHAR(16), nullable=True, default=-)
  - cpf_srs_account_no (VARCHAR(16), nullable=True, default=-)
  - cust_bank_code (VARCHAR(4), nullable=True, default=-)
  - cust_bank_bc (VARCHAR(50), nullable=True, default=-)
  - custody_code (VARCHAR(50), nullable=True, default=-)
  - currency (VARCHAR(3), nullable=True, default=-)
  - is_competitive (VARCHAR(1), nullable=True, default=-)
  - yield_pct (NUMERIC(5,2), nullable=True, default=-)
  - nominal_amount (NUMERIC(13,0), nullable=True, default=-)
  - accepted_amount (NUMERIC(13,0), nullable=True, default=-)
  - allotted_amount (NUMERIC(13,0), nullable=True, default=-)
  - settlement_amount (NUMERIC(17,2), nullable=True, default=-)
  - received_dt (TIMESTAMP, nullable=True, default=-)
  - bid_status (VARCHAR(50), nullable=True, default=-)
  - bid_error_desc (VARCHAR(50), nullable=True, default=-)
  - remarks (VARCHAR(4000), nullable=True, default=-)
  - wf_process_id (VARCHAR(255), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_issuance_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cm_counterparty_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_bid_submission_group_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cm_file_registry_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_auction_run_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    role_group:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    user_action:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    bank_ref_no:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    nric_passport:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    applicant_name:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    nationality:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    nation_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    type_of_applicant:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    submission_method:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    application_type:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cdp_account_no:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cpf_srs_account_no:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cust_bank_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cust_bank_bc:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    custody_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    currency:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_competitive:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    yield_pct:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    nominal_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    accepted_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    allotted_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    settlement_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    received_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    bid_status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    bid_error_desc:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    remarks:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    wf_process_id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-028
_For target table: `iss.iss_bid_submission_end_mapping`_

```
Comprehend every column on `iss.iss_bid_submission_end_mapping` (iss). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - iss_bid_submission_end_time_uuid (VARCHAR(36), nullable=True, default=-)
  - iss_issuance_uuid (VARCHAR(36), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_bid_submission_end_time_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_issuance_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-029
_For target table: `iss.iss_bid_submission_end_time`_

```
Comprehend every column on `iss.iss_bid_submission_end_time` (iss). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - bid_submission_end_dt (TIMESTAMP, nullable=True, default=-)
  - status (VARCHAR(50), nullable=True, default=-)
  - remarks (VARCHAR(4000), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)
  - user_action (VARCHAR(50), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    bid_submission_end_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    remarks:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    user_action:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-030
_For target table: `iss.iss_bid_submission_group`_

```
Comprehend every column on `iss.iss_bid_submission_group` (iss). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - iss_issuance_uuid (VARCHAR(36), nullable=True, default=-)
  - cm_counterparty_uuid (VARCHAR(36), nullable=True, default=-)
  - mas_internal_ref (VARCHAR(10), nullable=True, default=-)
  - submission_type (VARCHAR(50), nullable=True, default=-)
  - application_source (VARCHAR(50), nullable=True, default=-)
  - status (VARCHAR(50), nullable=True, default=-)
  - total_bids (NUMERIC(10,0), nullable=True, default=-)
  - total_amount (NUMERIC(20,2), nullable=True, default=-)
  - remarks (VARCHAR(4000), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_issuance_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cm_counterparty_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    mas_internal_ref:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    submission_type:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    application_source:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    total_bids:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    total_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    remarks:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-031
_For target table: `iss.iss_calendar_data`_

```
Comprehend every column on `iss.iss_calendar_data` (iss). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - iss_calendar_listing_uuid (VARCHAR(36), nullable=True, default=-)
  - security_code (VARCHAR(8), nullable=True, default=-)
  - isin_code (VARCHAR(12), nullable=True, default=-)
  - issuance_type (VARCHAR(50), nullable=True, default=-)
  - announcement_dt (TIMESTAMP, nullable=True, default=-)
  - auction_dt (TIMESTAMP, nullable=True, default=-)
  - issue_dt (TIMESTAMP, nullable=True, default=-)
  - maturity_dt (TIMESTAMP, nullable=True, default=-)
  - public_offer_start_dt (TIMESTAMP, nullable=True, default=-)
  - public_offer_end_dt (TIMESTAMP, nullable=True, default=-)
  - bond_announcement_dt (TIMESTAMP, nullable=True, default=-)
  - size_announcement_dt (TIMESTAMP, nullable=True, default=-)
  - app_closing_dt (TIMESTAMP, nullable=True, default=-)
  - allotment_dt (TIMESTAMP, nullable=True, default=-)
  - tenor (NUMERIC(3,0), nullable=True, default=-)
  - tenor_unit (VARCHAR(1), nullable=True, default=-)
  - new_reopen_flag (VARCHAR(1), nullable=True, default=-)
  - security_type (VARCHAR(50), nullable=True, default=-)
  - pricing_dt (TIMESTAMP, nullable=True, default=-)
  - sgs_type (VARCHAR(50), nullable=True, default=-)
  - cdp_naming_convention (VARCHAR(16), nullable=True, default=-)
  - is_provisioned_isin (VARCHAR(1), nullable=True, default=-)
  - is_benchmark (VARCHAR(1), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_calendar_listing_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    security_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    isin_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    issuance_type:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    announcement_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    auction_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    issue_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    maturity_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    public_offer_start_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    public_offer_end_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    bond_announcement_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    size_announcement_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    app_closing_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    allotment_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    tenor:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    tenor_unit:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    new_reopen_flag:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    security_type:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    pricing_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    sgs_type:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cdp_naming_convention:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_provisioned_isin:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_benchmark:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-032
_For target table: `iss.iss_calendar_listing`_

```
Comprehend every column on `iss.iss_calendar_listing` (iss). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - year (NUMERIC(4,0), nullable=True, default=-)
  - period (VARCHAR(50), nullable=True, default=-)
  - security_type (VARCHAR(50), nullable=True, default=-)
  - user_action (VARCHAR(50), nullable=True, default=-)
  - status (VARCHAR(50), nullable=True, default=-)
  - publication_dt (TIMESTAMP, nullable=True, default=-)
  - is_published_immediately (VARCHAR(1), nullable=True, default=-)
  - calendar_footnotes (TEXT, nullable=True, default=-)
  - remarks (VARCHAR(4000), nullable=True, default=-)
  - creation_method (VARCHAR(50), nullable=True, default=-)
  - cm_documents_uuid (VARCHAR(36), nullable=True, default=-)
  - wf_process_id (VARCHAR(255), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    year:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    period:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    security_type:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    user_action:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    publication_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_published_immediately:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    calendar_footnotes:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    remarks:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    creation_method:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cm_documents_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    wf_process_id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-033
_For target table: `iss.iss_issuance`_

```
Comprehend every column on `iss.iss_issuance` (iss). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - iss_security_master_uuid (VARCHAR(36), nullable=True, default=-)
  - issue_no (NUMERIC(2,0), nullable=True, default=-)
  - issuance_type (VARCHAR(50), nullable=True, default=-)
  - syndication_status (VARCHAR(50), nullable=True, default=-)
  - auction_status (VARCHAR(50), nullable=True, default=-)
  - random_seed (VARCHAR(100), nullable=True, default=-)
  - remarks (VARCHAR(4000), nullable=True, default=-)
  - new_reopen_flag (VARCHAR(1), nullable=True, default=-)
  - is_benchmark (VARCHAR(1), nullable=True, default=-)
  - int_paid_ind (VARCHAR(1), nullable=True, default=-)
  - announcement_dt (TIMESTAMP, nullable=True, default=-)
  - bid_submission_end_dt (TIMESTAMP, nullable=True, default=-)
  - auction_dt (TIMESTAMP, nullable=True, default=-)
  - issue_dt (TIMESTAMP, nullable=True, default=-)
  - pricing_dt (TIMESTAMP, nullable=True, default=-)
  - public_offer_start_dt (TIMESTAMP, nullable=True, default=-)
  - public_offer_end_dt (TIMESTAMP, nullable=True, default=-)
  - app_closing_dt (TIMESTAMP, nullable=True, default=-)
  - settlement_dt (TIMESTAMP, nullable=True, default=-)
  - maturity_dt (TIMESTAMP, nullable=True, default=-)
  - last_coupon_payment_dt (TIMESTAMP, nullable=True, default=-)
  - next_coupon_payment_dt (TIMESTAMP, nullable=True, default=-)
  - ex_int_dt (TIMESTAMP, nullable=True, default=-)
  - int_date1 (TIMESTAMP, nullable=True, default=-)
  - int_date2 (TIMESTAMP, nullable=True, default=-)
  - total_amount_offered (NUMERIC(13,0), nullable=True, default=-)
  - denomination (NUMERIC(10,0), nullable=True, default=-)
  - mas_intended_tender_amount (NUMERIC(13,0), nullable=True, default=-)
  - accrued_interest_value (NUMERIC(7,4), nullable=True, default=-)
  - accrued_interest_days (NUMERIC(3,0), nullable=True, default=-)
  - tenor_value (NUMERIC(3,0), nullable=True, default=-)
  - tenor_unit (VARCHAR(1), nullable=True, default=-)
  - meps_tenor (NUMERIC(3,0), nullable=True, default=-)
  - total_amount_applied (NUMERIC(13,0), nullable=True, default=-)
  - total_amount_allotted (NUMERIC(13,0), nullable=True, default=-)
  - bid_to_cover_ratio (NUMERIC(6,2), nullable=True, default=-)
  - total_amount_applied_comp (NUMERIC(13,0), nullable=True, default=-)
  - total_amount_applied_noncomp (NUMERIC(13,0), nullable=True, default=-)
  - mas_amount_allotted (NUMERIC(13,0), nullable=True, default=-)
  - noncomp_amount_allotted (NUMERIC(13,0), nullable=True, default=-)
  - cutoff_yield (NUMERIC(5,2), nullable=True, default=-)
  - average_yield (NUMERIC(5,2), nullable=True, default=-)
  - median_yield (NUMERIC(5,2), nullable=True, default=-)
  - cutoff_price (NUMERIC(7,4), nullable=True, default=-)
  - average_price (NUMERIC(7,4), nullable=True, default=-)
  - median_price (NUMERIC(7,4), nullable=True, default=-)
  - closing_price (NUMERIC(9,4), nullable=True, default=-)
  - comp_cutoff_allotment_pct (NUMERIC(4,2), nullable=True, default=-)
  - noncomp_allotment_pct (NUMERIC(5,2), nullable=True, default=-)
  - subscription_pct (NUMERIC(5,2), nullable=True, default=-)
  - coupon_rate (NUMERIC(7,4), nullable=True, default=-)
  - cutoff_amount (NUMERIC(13,0), nullable=True, default=-)
  - random_alloted_amount (NUMERIC(13,0), nullable=True, default=-)
  - random_alloted_pct (NUMERIC(4,2), nullable=True, default=-)
  - total_amount_rejected (NUMERIC(13,0), nullable=True, default=-)
  - total_amount_within_limit (NUMERIC(13,0), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)
  - user_action (VARCHAR(50), nullable=True, default=-)
  - wf_process_id (VARCHAR(255), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_security_master_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    issue_no:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    issuance_type:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    syndication_status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    auction_status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    random_seed:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    remarks:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    new_reopen_flag:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_benchmark:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    int_paid_ind:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    announcement_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    bid_submission_end_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    auction_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    issue_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    pricing_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    public_offer_start_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    public_offer_end_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    app_closing_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    settlement_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    maturity_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    last_coupon_payment_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    next_coupon_payment_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ex_int_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    int_date1:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    int_date2:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    total_amount_offered:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    denomination:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    mas_intended_tender_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    accrued_interest_value:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    accrued_interest_days:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    tenor_value:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    tenor_unit:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    meps_tenor:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    total_amount_applied:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    total_amount_allotted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    bid_to_cover_ratio:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    total_amount_applied_comp:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    total_amount_applied_noncomp:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    mas_amount_allotted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    noncomp_amount_allotted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cutoff_yield:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    average_yield:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    median_yield:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cutoff_price:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    average_price:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    median_price:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    closing_price:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    comp_cutoff_allotment_pct:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    noncomp_allotment_pct:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    subscription_pct:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    coupon_rate:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cutoff_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    random_alloted_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    random_alloted_pct:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    total_amount_rejected:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    total_amount_within_limit:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    user_action:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    wf_process_id:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-034
_For target table: `iss.iss_issuance_stepup_rates`_

```
Comprehend every column on `iss.iss_issuance_stepup_rates` (iss). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - iss_issuance_uuid (VARCHAR(36), nullable=True, default=-)
  - year (NUMERIC(4,0), nullable=True, default=-)
  - coupon_rate_pct (NUMERIC(5,2), nullable=True, default=-)
  - avg_annual_return_pct (NUMERIC(5,2), nullable=True, default=-)
  - coupon_no (NUMERIC(2,0), nullable=True, default=-)
  - coupon_payment_dt (TIMESTAMP, nullable=True, default=-)
  - frequency (VARCHAR(1), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_issuance_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    year:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    coupon_rate_pct:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    avg_annual_return_pct:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    coupon_no:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    coupon_payment_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    frequency:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-035
_For target table: `iss.iss_sb_allotment_run`_

```
Comprehend every column on `iss.iss_sb_allotment_run` (iss). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - iss_issuance_uuid (VARCHAR(36), nullable=True, default=-)
  - run_no (NUMERIC(2,0), nullable=True, default=-)
  - status (VARCHAR(50), nullable=True, default=-)
  - warning_error_details (JSONB, nullable=True, default=-)
  - total_amount_applied (NUMERIC(13,0), nullable=True, default=-)
  - total_amount_within_limits (NUMERIC(13,0), nullable=True, default=-)
  - total_amount_rejected (NUMERIC(13,0), nullable=True, default=-)
  - total_amount_allotted (NUMERIC(13,0), nullable=True, default=-)
  - cutoff_amount (NUMERIC(13,0), nullable=True, default=-)
  - random_alloted_amount (NUMERIC(13,0), nullable=True, default=-)
  - random_alloted_pct (NUMERIC(4,2), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_issuance_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    run_no:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    warning_error_details:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    total_amount_applied:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    total_amount_within_limits:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    total_amount_rejected:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    total_amount_allotted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cutoff_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    random_alloted_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    random_alloted_pct:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-036
_For target table: `iss.iss_sb_applicant`_

```
Comprehend every column on `iss.iss_sb_applicant` (iss). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - nric_passport (VARCHAR(14), nullable=True, default=-)
  - applicant_name (VARCHAR(100), nullable=True, default=-)
  - nationality (VARCHAR(50), nullable=True, default=-)
  - nation_code (VARCHAR(50), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    nric_passport:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    applicant_name:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    nationality:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    nation_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-037
_For target table: `iss.iss_sb_holdings`_

```
Comprehend every column on `iss.iss_sb_holdings` (iss). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - iss_security_master_uuid (VARCHAR(36), nullable=True, default=-)
  - cm_counterparty_uuid (VARCHAR(36), nullable=True, default=-)
  - iss_sb_applicant_uuid (VARCHAR(36), nullable=True, default=-)
  - holding_type (VARCHAR(50), nullable=True, default=-)
  - cdp_account_no (VARCHAR(16), nullable=True, default=-)
  - srs_account_no (VARCHAR(16), nullable=True, default=-)
  - holdings_amount (NUMERIC(13,0), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_security_master_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cm_counterparty_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_sb_applicant_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    holding_type:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cdp_account_no:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    srs_account_no:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    holdings_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-038
_For target table: `iss.iss_sb_redemption`_

```
Comprehend every column on `iss.iss_sb_redemption` (iss). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - iss_issuance_uuid (VARCHAR(36), nullable=True, default=-)
  - cm_counterparty_uuid (VARCHAR(36), nullable=True, default=-)
  - cm_file_registry_uuid (VARCHAR(36), nullable=True, default=-)
  - iss_sb_allotment_run_uuid (VARCHAR(36), nullable=True, default=-)
  - iss_sb_applicant_uuid (VARCHAR(36), nullable=True, default=-)
  - bank_ref_no (VARCHAR(16), nullable=True, default=-)
  - cust_bank_code (VARCHAR(4), nullable=True, default=-)
  - cust_bank_bc (VARCHAR(50), nullable=True, default=-)
  - type_of_applicant (VARCHAR(50), nullable=True, default=-)
  - cdp_account_no (VARCHAR(16), nullable=True, default=-)
  - cpf_srs_account_no (VARCHAR(16), nullable=True, default=-)
  - application_type (VARCHAR(50), nullable=True, default=-)
  - application_source (VARCHAR(50), nullable=True, default=-)
  - submission_method (VARCHAR(50), nullable=True, default=-)
  - custody_code (VARCHAR(50), nullable=True, default=-)
  - received_dt (TIMESTAMP, nullable=True, default=-)
  - nominal_amount (NUMERIC(13,0), nullable=True, default=-)
  - allotted_amount (NUMERIC(13,0), nullable=True, default=-)
  - interest_amount (NUMERIC(15,2), nullable=True, default=-)
  - settlement_amount (NUMERIC(15,2), nullable=True, default=-)
  - status (VARCHAR(50), nullable=True, default=-)
  - record_status (VARCHAR(50), nullable=True, default=-)
  - user_action (VARCHAR(50), nullable=True, default=-)
  - remarks (VARCHAR(4000), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_issuance_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cm_counterparty_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cm_file_registry_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_sb_allotment_run_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_sb_applicant_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    bank_ref_no:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cust_bank_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cust_bank_bc:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    type_of_applicant:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cdp_account_no:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cpf_srs_account_no:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    application_type:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    application_source:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    submission_method:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    custody_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    received_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    nominal_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    allotted_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    interest_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    settlement_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    record_status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    user_action:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    remarks:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-039
_For target table: `iss.iss_sb_subscription`_

```
Comprehend every column on `iss.iss_sb_subscription` (iss). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - iss_issuance_uuid (VARCHAR(36), nullable=True, default=-)
  - cm_file_registry_uuid (VARCHAR(36), nullable=True, default=-)
  - cm_counterparty_uuid (VARCHAR(36), nullable=True, default=-)
  - iss_security_master_uuid (VARCHAR(36), nullable=True, default=-)
  - iss_sb_applicant_uuid (VARCHAR(36), nullable=True, default=-)
  - iss_sb_allotment_run_uuid (VARCHAR(36), nullable=True, default=-)
  - type_of_applicant (VARCHAR(50), nullable=True, default=-)
  - application_source (VARCHAR(50), nullable=True, default=-)
  - cdp_account_no (VARCHAR(16), nullable=True, default=-)
  - srs_account_no (VARCHAR(16), nullable=True, default=-)
  - bank_ref_no (VARCHAR(50), nullable=True, default=-)
  - cust_bank_code (VARCHAR(4), nullable=True, default=-)
  - cust_bank_bc (VARCHAR(50), nullable=True, default=-)
  - submission_method (VARCHAR(50), nullable=True, default=-)
  - received_dt (TIMESTAMP, nullable=True, default=-)
  - nominal_amount (NUMERIC(13,0), nullable=True, default=-)
  - accepted_amount (NUMERIC(13,0), nullable=True, default=-)
  - allotted_amount (NUMERIC(13,0), nullable=True, default=-)
  - settlement_amount (NUMERIC(15,2), nullable=True, default=-)
  - currency (VARCHAR(3), nullable=True, default=-)
  - application_type (VARCHAR(50), nullable=True, default=-)
  - status (VARCHAR(50), nullable=True, default=-)
  - is_duplicate_flag (VARCHAR(1), nullable=True, default=-)
  - record_status (VARCHAR(50), nullable=True, default=-)
  - record_error_desc (VARCHAR(50), nullable=True, default=-)
  - remarks (VARCHAR(4000), nullable=True, default=-)
  - user_action (VARCHAR(50), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_issuance_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cm_file_registry_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cm_counterparty_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_security_master_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_sb_applicant_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_sb_allotment_run_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    type_of_applicant:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    application_source:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cdp_account_no:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    srs_account_no:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    bank_ref_no:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cust_bank_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cust_bank_bc:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    submission_method:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    received_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    nominal_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    accepted_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    allotted_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    settlement_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    currency:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    application_type:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_duplicate_flag:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    record_status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    record_error_desc:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    remarks:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    user_action:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-040
_For target table: `iss.iss_security_master`_

```
Comprehend every column on `iss.iss_security_master` (iss). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - security_code (VARCHAR(8), nullable=True, default=-)
  - isin_code (VARCHAR(12), nullable=True, default=-)
  - security_name (VARCHAR(30), nullable=True, default=-)
  - security_type (VARCHAR(50), nullable=True, default=-)
  - sgs_type (VARCHAR(50), nullable=True, default=-)
  - coupon_pay_frequency (VARCHAR(50), nullable=True, default=-)
  - currency (VARCHAR(3), nullable=True, default=-)
  - first_coupon_payment_dt (TIMESTAMP, nullable=True, default=-)
  - tax_status (VARCHAR(1), nullable=True, default=-)
  - etender_ind (VARCHAR(1), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    security_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    isin_code:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    security_name:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    security_type:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    sgs_type:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    coupon_pay_frequency:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    currency:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    first_coupon_payment_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    tax_status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    etender_ind:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-NLM-041
_For target table: `iss.iss_synd_allotment_run`_

```
Comprehend every column on `iss.iss_synd_allotment_run` (iss). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - id (BIGINT, nullable=True, default=-)
  - uuid (VARCHAR(36), nullable=True, default=-)
  - iss_issuance_uuid (VARCHAR(36), nullable=True, default=-)
  - run_no (NUMERIC(2,0), nullable=True, default=-)
  - status (VARCHAR(50), nullable=True, default=-)
  - warning_error_details (JSONB, nullable=True, default=-)
  - total_amount_offered (NUMERIC(13,0), nullable=True, default=-)
  - total_amount_applied (NUMERIC(13,0), nullable=True, default=-)
  - total_amount_allotted (NUMERIC(13,0), nullable=True, default=-)
  - public_offer_amount_offered (NUMERIC(13,0), nullable=True, default=-)
  - public_offer_amount_applied (NUMERIC(13,0), nullable=True, default=-)
  - public_offer_amount_within_limits (NUMERIC(13,0), nullable=True, default=-)
  - cutoff_amount (NUMERIC(13,0), nullable=True, default=-)
  - public_offer_amount_allotted (NUMERIC(13,0), nullable=True, default=-)
  - public_offer_subscription_pct (NUMERIC(5,2), nullable=True, default=-)
  - placement_amount_applied (NUMERIC(13,0), nullable=True, default=-)
  - placement_amount_allotted (NUMERIC(13,0), nullable=True, default=-)
  - placement_subscription_pct (NUMERIC(5,2), nullable=True, default=-)
  - amount_to_be_reallotted (NUMERIC(13,0), nullable=True, default=-)
  - version (NUMERIC(5,0), nullable=True, default=-)
  - is_deleted (VARCHAR(1), nullable=True, default=-)
  - is_migrated (VARCHAR(1), nullable=True, default=-)
  - created_dt (TIMESTAMP, nullable=True, default=-)
  - created_by (VARCHAR(36), nullable=True, default=-)
  - updated_dt (TIMESTAMP, nullable=True, default=-)
  - updated_by (VARCHAR(36), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    id:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    iss_issuance_uuid:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    run_no:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    status:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    warning_error_details:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    total_amount_offered:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    total_amount_applied:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    total_amount_allotted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    public_offer_amount_offered:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    public_offer_amount_applied:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    public_offer_amount_within_limits:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    cutoff_amount:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    public_offer_amount_allotted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    public_offer_subscription_pct:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    placement_amount_applied:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    placement_amount_allotted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    placement_subscription_pct:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    amount_to_be_reallotted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    version:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_deleted:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    is_migrated:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    created_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_dt:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    updated_by:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QG-003
_FSD requirement for legacy audit translation into _t_

```
Does any OMEGA FSD (Reports, Admin, or DM-related) explicitly require legacy audit data (e.g., eApps ABA0023_AUDIT_ACTION) to be translated and loaded into OMEGA's _t historical format at Go-Live? If so, which target _t tables are in scope and what is the row-level translation rule?
```

## Legacy-source channel  (158 questions)

Paste each prompt into your separate Claude/Cursor session on the legacy source codebase. Archive answers as `phase1/legacy-source-archive/q-<id>-<slug>.md`.

### QC-LEG-001
_For source table: `ABA0001_SECURITY_MASTER`_

```
Comprehend every column on `MS9ABA.ABA0001_SECURITY_MASTER` (eApps). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0001_SECURITY_CODE (CHAR(8), nullable=True, default=-)
  - ABA0001_ISSUE_NO (CHAR(1), nullable=True, default=-)
  - ABA0001_ISSUE_TYPE (CHAR(1), nullable=True, default=-)
  - ABA0001_CURR (CHAR(3), nullable=True, default=-)
  - ABA0001_SECURITY_NAME (VARCHAR2(30), nullable=False, default=-)
  - ABA0001_ISSUE_DATE (DATE, nullable=False, default=-)
  - ABA0001_TENDER_DATE (DATE, nullable=False, default=-)
  - ABA0001_ISSUE_SIZE (NUMBER(13,0), nullable=False, default=-)
  - ABA0001_QTY_APPLIED (NUMBER(13,0), nullable=True, default=-)
  - ABA0001_AVE_YIELD (NUMBER(5,2), nullable=True, default=-)
  - ABA0001_CUTOFF_YIELD (NUMBER(5,2), nullable=True, default=-)
  - ABA0001_MATURITY_DATE (DATE, nullable=False, default=-)
  - ABA0001_PERCENT_COY (NUMBER(5,2), nullable=True, default=-)
  - ABA0001_PERCENT_SUB (NUMBER(5,2), nullable=True, default=-)
  - ABA0001_INTEREST_RATE (NUMBER(7,4), nullable=True, default=-)
  - ABA0001_TAX_STATUS (CHAR(1), nullable=True, default=-)
  - ABA0001_AVE_PRICE (NUMBER(7,4), nullable=True, default=-)
  - ABA0001_COY_PRICE (NUMBER(7,4), nullable=True, default=-)
  - ABA0001_CLOSING_PRICE (NUMBER(7,4), nullable=True, default=-)
  - ABA0001_REFERENCE_NO (NUMBER(5,0), nullable=True, default=-)
  - ABA0001_ISIN_CODE (CHAR(12), nullable=True, default=-)
  - ABA0001_ANNOUNCE_DATE (DATE, nullable=True, default=-)
  - ABA0001_RESULT_LOAD_DATE (DATE, nullable=True, default=-)
  - ABA0001_LAST_INT_DATE (DATE, nullable=True, default=-)
  - ABA0001_NEXT_INT_DATE (DATE, nullable=True, default=-)
  - ABA0001_ACCRUED_INT_DAYS (NUMBER(3,0), nullable=True, default=-)
  - ABA0001_INT_DATE1 (DATE, nullable=True, default=-)
  - ABA0001_INT_DATE2 (DATE, nullable=True, default=-)
  - ABA0001_INT_PAID_IND (CHAR(1), nullable=True, default=NULL)
  - ABA0001_TENOR (NUMBER(3,0), nullable=True, default=-)
  - ABA0001_ETENDER_IND (CHAR(1), nullable=True, default=Y)
  - ABA0001_MAS_APPLIED (NUMBER(13,0), nullable=True, default=-)
  - ABA0001_MAS_ALLOTTED (NUMBER(13,0), nullable=True, default=-)
  - ABA0001_NC_PERCENT (NUMBER(5,2), nullable=True, default=-)
  - ABA0001_NC_QTY_ALLOT (NUMBER(13,0), nullable=True, default=-)
  - ABA0001_EX_INT_DATE (DATE, nullable=True, default=-)
  - ABA0001_QTY_APP_COMP (NUMBER(13,0), nullable=True, default=-)
  - ABA0001_QTY_APP_NONCOMP (NUMBER(13,0), nullable=True, default=-)
  - ABA0001_ACCRUED_INT (NUMBER(7,4), nullable=True, default=0)
  - ABA0001_ANNOUNCE_INDICATOR (CHAR(1), nullable=True, default=N)
  - ABA0001_MEDIAN_YIELD (NUMBER(5,2), nullable=True, default=-)
  - ABA0001_MEDIAN_PRICE (NUMBER(7,4), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0001_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_ISSUE_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_ISSUE_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_CURR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_SECURITY_NAME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_ISSUE_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_TENDER_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_ISSUE_SIZE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_QTY_APPLIED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_AVE_YIELD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_CUTOFF_YIELD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_MATURITY_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_PERCENT_COY:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_PERCENT_SUB:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_INTEREST_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_TAX_STATUS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_AVE_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_COY_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_CLOSING_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_REFERENCE_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_ISIN_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_ANNOUNCE_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_RESULT_LOAD_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_LAST_INT_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_NEXT_INT_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_ACCRUED_INT_DAYS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_INT_DATE1:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_INT_DATE2:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_INT_PAID_IND:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_TENOR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_ETENDER_IND:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_MAS_APPLIED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_MAS_ALLOTTED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_NC_PERCENT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_NC_QTY_ALLOT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_EX_INT_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_QTY_APP_COMP:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_QTY_APP_NONCOMP:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_ACCRUED_INT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_ANNOUNCE_INDICATOR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_MEDIAN_YIELD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0001_MEDIAN_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-002
_For source table: `ABA0007_DETAIL_AUCTION_RESULT`_

```
Comprehend every column on `MS9ABA.ABA0007_DETAIL_AUCTION_RESULT` (eApps). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0007_SECURITY_CODE (VARCHAR2(8), nullable=False, default=-)
  - ABA0007_ISSUE_NO (VARCHAR2(1), nullable=False, default=-)
  - ABA0007_REF_NO (NUMBER(5,0), nullable=True, default=-)
  - ABA0007_BANK_REF_NO (VARCHAR2(12), nullable=True, default=-)
  - ABA0007_FORM_NO (NUMBER(6,0), nullable=False, default=-)
  - ABA0007_TENDER_DATE (DATE, nullable=False, default=-)
  - ABA0007_PRI_DLR_CODE (NUMBER(4,0), nullable=False, default=-)
  - ABA0007_NAME_OF_APPLN (VARCHAR2(30), nullable=True, default=-)
  - ABA0007_NATIONALITY (VARCHAR2(1), nullable=True, default=-)
  - ABA0007_IC_PASSPORT (VARCHAR2(14), nullable=True, default=-)
  - ABA0007_COMP_NONCOMP (VARCHAR2(1), nullable=True, default=-)
  - ABA0007_BID_YIELD (NUMBER(5,2), nullable=True, default=-)
  - ABA0007_APPLIED_AMT (NUMBER(11,0), nullable=True, default=-)
  - ABA0007_ALLOTED_AMT (NUMBER(11,0), nullable=True, default=-)
  - ABA0007_SETTLEMENT_AMT (NUMBER(15,2), nullable=True, default=-)
  - ABA0007_ACCRUED_INT (NUMBER(11,2), nullable=True, default=-)
  - ABA0007_CUST_BANK_CODE (NUMBER(4,0), nullable=True, default=-)
  - ABA0007_CUST_BANK_BC (VARCHAR2(1), nullable=True, default=-)
  - ABA0007_TYPE_OF_APPLN (VARCHAR2(3), nullable=True, default=-)
  - ABA0007_CDP_ACC_NO (VARCHAR2(16), nullable=True, default=-)
  - ABA0007_SUB_MTD (CHAR(1), nullable=True, default=-)
  - ABA0007_UPDATED_DATETIME (DATE, nullable=True, default=SYSDATE)
  - ABA0007_CPF_ACNO (CHAR(16), nullable=True, default=-)
  - ABA0007_FILE_TYPE (VARCHAR2(3), nullable=False, default=AP1)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0007_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0007_ISSUE_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0007_REF_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0007_BANK_REF_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0007_FORM_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0007_TENDER_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0007_PRI_DLR_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0007_NAME_OF_APPLN:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0007_NATIONALITY:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0007_IC_PASSPORT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0007_COMP_NONCOMP:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0007_BID_YIELD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0007_APPLIED_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0007_ALLOTED_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0007_SETTLEMENT_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0007_ACCRUED_INT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0007_CUST_BANK_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0007_CUST_BANK_BC:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0007_TYPE_OF_APPLN:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0007_CDP_ACC_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0007_SUB_MTD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0007_UPDATED_DATETIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0007_CPF_ACNO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0007_FILE_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-003
_For source table: `ABA0008_STAGE_SECURITY_MASTER`_

```
Comprehend every column on `MS9ABA.ABA0008_STAGE_SECURITY_MASTER` (eApps). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0008_SECURITY_CODE (CHAR(8), nullable=True, default=-)
  - ABA0008_ISSUE_NO (CHAR(1), nullable=True, default=-)
  - ABA0008_ISSUE_TYPE (CHAR(1), nullable=True, default=-)
  - ABA0008_CURR (CHAR(3), nullable=True, default=-)
  - ABA0008_SECURITY_NAME (VARCHAR2(30), nullable=False, default=-)
  - ABA0008_ISSUE_DATE (DATE, nullable=False, default=-)
  - ABA0008_TENDER_DATE (DATE, nullable=False, default=-)
  - ABA0008_ISSUE_SIZE (NUMBER(13,0), nullable=False, default=-)
  - ABA0008_QTY_APPLIED (NUMBER(13,0), nullable=True, default=-)
  - ABA0008_AVE_YIELD (NUMBER(5,2), nullable=True, default=-)
  - ABA0008_CUTOFF_YIELD (NUMBER(5,2), nullable=True, default=-)
  - ABA0008_MATURITY_DATE (DATE, nullable=False, default=-)
  - ABA0008_PERCENT_COY (NUMBER(5,2), nullable=True, default=-)
  - ABA0008_PERCENT_SUB (NUMBER(5,2), nullable=True, default=-)
  - ABA0008_INTEREST_RATE (NUMBER(7,4), nullable=True, default=-)
  - ABA0008_TAX_STATUS (CHAR(1), nullable=True, default=-)
  - ABA0008_AVE_PRICE (NUMBER(7,4), nullable=True, default=-)
  - ABA0008_COY_PRICE (NUMBER(7,4), nullable=True, default=-)
  - ABA0008_CLOSING_PRICE (NUMBER(7,4), nullable=True, default=-)
  - ABA0008_REFERENCE_NO (NUMBER(5,0), nullable=True, default=-)
  - ABA0008_ISIN_CODE (CHAR(12), nullable=True, default=-)
  - ABA0008_ANNOUNCE_DATE (DATE, nullable=True, default=-)
  - ABA0008_RESULT_LOAD_DATE (DATE, nullable=True, default=-)
  - ABA0008_LAST_INT_DATE (DATE, nullable=True, default=-)
  - ABA0008_NEXT_INT_DATE (DATE, nullable=True, default=-)
  - ABA0008_ACCRUED_INT_DAYS (NUMBER(3,0), nullable=True, default=-)
  - ABA0008_INT_DATE1 (DATE, nullable=True, default=-)
  - ABA0008_INT_DATE2 (DATE, nullable=True, default=-)
  - ABA0008_INT_PAID_IND (CHAR(1), nullable=True, default=N)
  - ABA0008_TENOR (NUMBER(3,0), nullable=True, default=-)
  - ABA0008_ETENDER_IND (CHAR(1), nullable=True, default=Y)
  - ABA0008_MAS_APPLIED (NUMBER(13,0), nullable=True, default=-)
  - ABA0008_MAS_ALLOTTED (NUMBER(13,0), nullable=True, default=-)
  - ABA0008_NC_PERCENT (NUMBER(5,2), nullable=True, default=-)
  - ABA0008_NC_QTY_ALLOT (NUMBER(13,0), nullable=True, default=-)
  - ABA0008_EX_INT_DATE (DATE, nullable=True, default=-)
  - ABA0008_QTY_APP_COMP (NUMBER(13,0), nullable=True, default=-)
  - ABA0008_QTY_APP_NONCOMP (NUMBER(13,0), nullable=True, default=-)
  - ABA0008_ACCRUED_INT (NUMBER(7,4), nullable=True, default=0)
  - ABA0008_ANNOUNCE_INDICATOR (CHAR(1), nullable=True, default=N)
  - ABA0008_CPN_PAYM_IND (CHAR(1), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0008_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_ISSUE_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_ISSUE_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_CURR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_SECURITY_NAME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_ISSUE_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_TENDER_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_ISSUE_SIZE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_QTY_APPLIED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_AVE_YIELD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_CUTOFF_YIELD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_MATURITY_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_PERCENT_COY:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_PERCENT_SUB:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_INTEREST_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_TAX_STATUS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_AVE_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_COY_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_CLOSING_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_REFERENCE_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_ISIN_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_ANNOUNCE_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_RESULT_LOAD_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_LAST_INT_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_NEXT_INT_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_ACCRUED_INT_DAYS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_INT_DATE1:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_INT_DATE2:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_INT_PAID_IND:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_TENOR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_ETENDER_IND:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_MAS_APPLIED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_MAS_ALLOTTED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_NC_PERCENT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_NC_QTY_ALLOT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_EX_INT_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_QTY_APP_COMP:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_QTY_APP_NONCOMP:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_ACCRUED_INT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_ANNOUNCE_INDICATOR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0008_CPN_PAYM_IND:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-004
_For source table: `ABA0009_BANK_MASTER`_

```
Comprehend every column on `MS9ABA.ABA0009_BANK_MASTER` (eApps). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0009_BANK_CODE (CHAR(4), nullable=False, default=-)
  - ABA0009_BANK_NAME (VARCHAR2(40), nullable=False, default=-)
  - ABA0009_BANK_SHORTNAME (VARCHAR2(15), nullable=False, default=-)
  - ABA0009_AUTODEBIT_INDICATOR (CHAR(1), nullable=True, default=-)
  - ABA0009_PARTICIPANT_INDICATOR (CHAR(1), nullable=True, default=Y)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0009_BANK_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0009_BANK_NAME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0009_BANK_SHORTNAME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0009_AUTODEBIT_INDICATOR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0009_PARTICIPANT_INDICATOR:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-005
_For source table: `ABA0010_ANNOUNCE_TEXT`_

```
Comprehend every column on `MS9ABA.ABA0010_ANNOUNCE_TEXT` (eApps). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0010_NAME (VARCHAR2(8), nullable=False, default=-)
  - ABA0010_USED_BEFORE (DATE, nullable=True, default=01/JAN/2099)
  - ABA0010_TEXT (VARCHAR2(4000), nullable=False, default=-)
  - ABA0010_LAST_UPDATED (DATE, nullable=True, default=SYSDATE)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0010_NAME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0010_USED_BEFORE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0010_TEXT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0010_LAST_UPDATED:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-006
_For source table: `ABA0011_DAILY_PRICE`_

```
Comprehend every column on `MS9ABA.ABA0011_DAILY_PRICE` (Daily Price). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0011_SECURITY_CODE (CHAR(8), nullable=False, default=-)
  - ABA0011_ISSUE_NO (CHAR(1), nullable=False, default=-)
  - ABA0011_BANK_ACC_CODE (NUMBER(4,0), nullable=False, default=-)
  - ABA0011_SUBMISSION_DATE (DATE, nullable=False, default=-)
  - ABA0011_BID_PRICE (NUMBER(7,4), nullable=True, default=0)
  - ABA0011_OFFER_PRICE (NUMBER(7,4), nullable=True, default=0)
  - ABA0011_HIGH_PRICE (NUMBER(7,4), nullable=True, default=0)
  - ABA0011_LOW_PRICE (NUMBER(7,4), nullable=True, default=0)
  - ABA0011_VOLUME (NUMBER(13,0), nullable=True, default=0)
  - ABA0011_UPDATE_TIME (DATE, nullable=True, default=SYSDATE)
  - ABA0011_BENCH_PRICE_FLAG (VARCHAR2(1), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0011_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0011_ISSUE_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0011_BANK_ACC_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0011_SUBMISSION_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0011_BID_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0011_OFFER_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0011_HIGH_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0011_LOW_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0011_VOLUME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0011_UPDATE_TIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0011_BENCH_PRICE_FLAG:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-007
_For source table: `ABA0012_DP_STATUS`_

```
Comprehend every column on `MS9ABA.ABA0012_DP_STATUS` (Daily Price). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0012_BANK_ACC_CODE (NUMBER(4,0), nullable=False, default=-)
  - ABA0012_SUBMISSION_DATE (DATE, nullable=False, default=-)
  - ABA0012_ALLOW_EDIT_IND (CHAR(1), nullable=True, default=N)
  - ABA0012_UPDATE_TIME (DATE, nullable=True, default=SYSDATE)
  - ABA0012_USERID (VARCHAR2(8), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0012_BANK_ACC_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0012_SUBMISSION_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0012_ALLOW_EDIT_IND:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0012_UPDATE_TIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0012_USERID:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-008
_For source table: `ABA0013_PRIMARY_DEALER`_

```
Comprehend every column on `MS9ABA.ABA0013_PRIMARY_DEALER` (eApps). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0013_BANK_CODE (CHAR(4), nullable=False, default=-)
  - ABA0013_BANK_NAME (VARCHAR2(40), nullable=False, default=-)
  - ABA0013_BANK_SHORTNAME (VARCHAR2(15), nullable=False, default=-)
  - ABA0013_MASREPO_IND (CHAR(1), nullable=True, default=Y)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0013_BANK_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0013_BANK_NAME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0013_BANK_SHORTNAME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0013_MASREPO_IND:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-009
_For source table: `ABA0015_PRICE_SPREAD`_

```
Comprehend every column on `MS9ABA.ABA0015_PRICE_SPREAD` (Daily Price). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0015_TYPE (NUMBER(2,0), nullable=True, default=-)
  - ABA0015_CHECK_1 (NUMBER(3,2), nullable=True, default=-)
  - ABA0015_CHECK_2 (NUMBER(3,2), nullable=True, default=-)
  - ABA0015_CHECK_3 (NUMBER(3,2), nullable=True, default=-)
  - ABA0015_CHECK_4 (NUMBER(3,2), nullable=True, default=-)
  - ABA0015_CHECK_5 (NUMBER(3,2), nullable=True, default=-)
  - ABA0015_CHECK_6 (NUMBER(3,2), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0015_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0015_CHECK_1:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0015_CHECK_2:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0015_CHECK_3:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0015_CHECK_4:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0015_CHECK_5:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0015_CHECK_6:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-010
_For source table: `ABA0016_DAILY_EXTRA_DATA`_

```
Comprehend every column on `MS9ABA.ABA0016_DAILY_EXTRA_DATA` (Daily Price). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0016_BANK_ACC_CODE (NUMBER(4,0), nullable=False, default=-)
  - ABA0016_SUBMISSION_DATE (DATE, nullable=False, default=-)
  - ABA0016_REPO_BID_PRICE (NUMBER(7,4), nullable=True, default=0)
  - ABA0016_REPO_OFFER_PRICE (NUMBER(7,4), nullable=True, default=0)
  - ABA0016_COMM_BID_PRICE (NUMBER(7,4), nullable=True, default=0)
  - ABA0016_COMM_OFFER_PRICE (NUMBER(7,4), nullable=True, default=0)
  - ABA0016_UPDATE_TIME (DATE, nullable=True, default=SYSDATE)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0016_BANK_ACC_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0016_SUBMISSION_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0016_REPO_BID_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0016_REPO_OFFER_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0016_COMM_BID_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0016_COMM_OFFER_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0016_UPDATE_TIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-011
_For source table: `ABA0017_FINAL_DAILY_PRICE`_

```
Comprehend every column on `MS9ABA.ABA0017_FINAL_DAILY_PRICE` (Daily Price). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0017_SECURITY_CODE (CHAR(8), nullable=False, default=-)
  - ABA0017_ISSUE_NO (CHAR(1), nullable=False, default=-)
  - ABA0017_SUBMISSION_DATE (DATE, nullable=False, default=-)
  - ABA0017_HIGH_PRICE (NUMBER(7,4), nullable=True, default=0)
  - ABA0017_LOW_PRICE (NUMBER(7,4), nullable=True, default=0)
  - ABA0017_AVE_PRICE (NUMBER(7,4), nullable=True, default=0)
  - ABA0017_DIRTY_PRICE (NUMBER(7,4), nullable=True, default=0)
  - ABA0017_MLA_PRICE (NUMBER(7,4), nullable=True, default=0)
  - ABA0017_YIELD (NUMBER(7,4), nullable=True, default=0)
  - ABA0017_UPDATE_TIME (DATE, nullable=True, default=SYSDATE)
  - ABA0017_T1_DATE (DATE, nullable=True, default=-)
  - ABA0017_T1_DIRTY_PRICE (NUMBER(7,4), nullable=True, default=0)
  - ABA0017_REPOT1_DATE (DATE, nullable=True, default=-)
  - ABA0017_REPOT1_DIRTY_PRICE (NUMBER(7,4), nullable=True, default=0)
  - ABA0017_T2_DATE (DATE, nullable=True, default=-)
  - ABA0017_REPOT2_DATE (DATE, nullable=True, default=-)
  - ABA0017_REPOT2_DIRTY_PRICE (NUMBER(7,4), nullable=True, default=0)
  - ABA0017_BENCH_HIGH_PRICE (NUMBER(7,4), nullable=True, default=0)
  - ABA0017_BENCH_LOW_PRICE (NUMBER(7,4), nullable=True, default=0)
  - ABA0017_MODIFIED_DURATION (NUMBER(8,4), nullable=True, default=0)
  - ABA0017_BENCH_PRICE_FLAG (VARCHAR2(1), nullable=True, default=-)
  - ABA0017_T3_DATE_NON_US (DATE, nullable=True, default=-)
  - ABA0017_T3_DIRTY_PRICE_NON_US (NUMBER(7,4), nullable=True, default=0)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0017_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0017_ISSUE_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0017_SUBMISSION_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0017_HIGH_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0017_LOW_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0017_AVE_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0017_DIRTY_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0017_MLA_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0017_YIELD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0017_UPDATE_TIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0017_T1_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0017_T1_DIRTY_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0017_REPOT1_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0017_REPOT1_DIRTY_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0017_T2_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0017_REPOT2_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0017_REPOT2_DIRTY_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0017_BENCH_HIGH_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0017_BENCH_LOW_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0017_MODIFIED_DURATION:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0017_BENCH_PRICE_FLAG:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0017_T3_DATE_NON_US:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0017_T3_DIRTY_PRICE_NON_US:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-012
_For source table: `ABA0018_FINAL_EXTRA_PRICE`_

```
Comprehend every column on `MS9ABA.ABA0018_FINAL_EXTRA_PRICE` (Daily Price). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0018_SECURITY_TYPE (CHAR(4), nullable=False, default=-)
  - ABA0018_SUBMISSION_DATE (DATE, nullable=False, default=-)
  - ABA0018_HIGH_PRICE (NUMBER(7,4), nullable=True, default=0)
  - ABA0018_LOW_PRICE (NUMBER(7,4), nullable=True, default=0)
  - ABA0018_AVE_PRICE (NUMBER(7,4), nullable=True, default=0)
  - ABA0018_UPDATE_TIME (DATE, nullable=True, default=SYSDATE)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0018_SECURITY_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0018_SUBMISSION_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0018_HIGH_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0018_LOW_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0018_AVE_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0018_UPDATE_TIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-013
_For source table: `ABA0019_PUBLIC_HOLIDAY`_

```
Comprehend every column on `MS9ABA.ABA0019_PUBLIC_HOLIDAY` (eApps). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0019_DATE (DATE, nullable=False, default=-)
  - ABA0019_DESCRIPTION (VARCHAR2(30), nullable=True, default=-)
  - ABA0019_COUNTRY (VARCHAR2(10), nullable=True, default=SG)
  - ABA0019_UPDATE_TIME (DATE, nullable=True, default=SYSDATE)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0019_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0019_DESCRIPTION:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0019_COUNTRY:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0019_UPDATE_TIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-014
_For source table: `ABA0020_STAGING_BANK_MASTER`_

```
Comprehend every column on `MS9ABA.ABA0020_STAGING_BANK_MASTER` (eApps). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0020_BANK_CODE (CHAR(4), nullable=False, default=-)
  - ABA0020_BANK_NAME (VARCHAR2(40), nullable=False, default=-)
  - ABA0020_BANK_SHORTNAME (VARCHAR2(15), nullable=False, default=-)
  - ABA0020_AUTODEBIT_INDICATOR (CHAR(1), nullable=True, default=-)
  - ABA0020_PARTICIPANT_INDICATOR (CHAR(1), nullable=True, default=Y)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0020_BANK_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0020_BANK_NAME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0020_BANK_SHORTNAME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0020_AUTODEBIT_INDICATOR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0020_PARTICIPANT_INDICATOR:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-015
_For source table: `ABA0021_ISSUE_CALENDAR`_

```
Comprehend every column on `MS9ABA.ABA0021_ISSUE_CALENDAR` (eApps). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0021_SECURITY_CODE (VARCHAR2(8), nullable=False, default=-)
  - ABA0021_ISSUE_NO (VARCHAR2(1), nullable=False, default=-)
  - ABA0021_ISIN_CODE (VARCHAR2(12), nullable=True, default=-)
  - ABA0021_ISSUE_TYPE (VARCHAR2(1), nullable=True, default=-)
  - ABA0021_TENOR (NUMBER(3,0), nullable=True, default=-)
  - ABA0021_TENOR_UNIT (VARCHAR2(1), nullable=True, default=-)
  - ABA0021_CURR (VARCHAR2(3), nullable=True, default=-)
  - ABA0021_NEW_REOPEN (VARCHAR2(1), nullable=True, default=-)
  - ABA0021_OPEN_DATETIME (DATE, nullable=True, default=-)
  - ABA0021_CLOSE_DATETIME (DATE, nullable=True, default=-)
  - ABA0021_ISSUE_DATETIME (DATE, nullable=True, default=-)
  - ABA0021_FLAG (VARCHAR2(1), nullable=True, default=-)
  - ABA0021_PD_ISSUE_TYPE (VARCHAR2(1), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0021_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0021_ISSUE_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0021_ISIN_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0021_ISSUE_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0021_TENOR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0021_TENOR_UNIT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0021_CURR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0021_NEW_REOPEN:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0021_OPEN_DATETIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0021_CLOSE_DATETIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0021_ISSUE_DATETIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0021_FLAG:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0021_PD_ISSUE_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-016
_For source table: `ABA0022_NON_BENCHMARK`_

```
Comprehend every column on `MS9ABA.ABA0022_NON_BENCHMARK` (eApps). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0022_SECURITY_CODE (CHAR(8), nullable=False, default=-)
  - ABA0022_ISSUE_NO (CHAR(1), nullable=False, default=-)
  - ABA0022_UPDATE_TIME (DATE, nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0022_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0022_ISSUE_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0022_UPDATE_TIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-017
_For source table: `ABA0025_OUTSTANDING_SGS`_

```
Comprehend every column on `MS9ABA.ABA0025_OUTSTANDING_SGS` (Daily Price). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0025_YEAR (VARCHAR2(4), nullable=False, default=-)
  - ABA0025_MONTH (VARCHAR2(15), nullable=True, default=-)
  - ABA0025_TBILL (NUMBER(13,0), nullable=True, default=0)
  - ABA0025_BOND (NUMBER(13,0), nullable=True, default=0)
  - ABA0025_INFRA (NUMBER(13,0), nullable=True, default=0)
  - ABA0025_GREEN_INFRA (NUMBER(13,0), nullable=True, default=0)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0025_YEAR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0025_MONTH:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0025_TBILL:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0025_BOND:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0025_INFRA:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0025_GREEN_INFRA:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-018
_For source table: `ABA0026_OUTSTANDING_MAS`_

```
Comprehend every column on `MS9ABA.ABA0026_OUTSTANDING_MAS` (Daily Price). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0026_YEAR (VARCHAR2(4), nullable=False, default=-)
  - ABA0026_MONTH (VARCHAR2(15), nullable=True, default=-)
  - ABA0026_WEEK4 (NUMBER(13,0), nullable=True, default=0)
  - ABA0026_WEEK8 (NUMBER(13,0), nullable=True, default=0)
  - ABA0026_WEEK12 (NUMBER(13,0), nullable=True, default=0)
  - ABA0026_WEEK24 (NUMBER(13,0), nullable=True, default=0)
  - ABA0026_OTH (NUMBER(13,0), nullable=True, default=0)
  - ABA0026_WEEK36 (NUMBER(13,0), nullable=True, default=0)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0026_YEAR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0026_MONTH:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0026_WEEK4:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0026_WEEK8:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0026_WEEK12:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0026_WEEK24:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0026_OTH:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0026_WEEK36:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-019
_For source table: `ABA0029_SORA_RATE`_

```
Comprehend every column on `MS9ABA.ABA0029_SORA_RATE` (Daily Price). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0029_SORA_PUB_DT (DATE, nullable=False, default=-)
  - ABA0029_SORA_VALUE_DT (DATE, nullable=False, default=-)
  - ABA0029_SORA_RATE (NUMBER(7,4), nullable=False, default=-)
  - ABA0029_SORA_INDEX (NUMBER(13,10), nullable=True, default=-)
  - ABA0029_COMP_SORA_1MTH (NUMBER(7,4), nullable=True, default=-)
  - ABA0029_COMP_SORA_3MTH (NUMBER(7,4), nullable=True, default=-)
  - ABA0029_COMP_SORA_6MTH (NUMBER(7,4), nullable=True, default=-)
  - ABA0029_AGGREGATE_VOLUME (NUMBER(5,0), nullable=True, default=-)
  - ABA0029_HIGH_TRANS_RATE (NUMBER(7,4), nullable=True, default=-)
  - ABA0029_LOW_TRANS_RATE (NUMBER(7,4), nullable=True, default=-)
  - ABA0029_CALCULATION_METHOD (VARCHAR2(150), nullable=True, default=-)
  - ABA0029_LAST_PUBLISHED_DT (TIMESTAMP(6), nullable=True, default=-)
  - ABA0029_LAST_MODIFIED_DT (TIMESTAMP(6), nullable=False, default=SYSDATE)
  - ABA0029_LAST_MODIFIED_BY (VARCHAR2(8), nullable=False, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0029_SORA_PUB_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0029_SORA_VALUE_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0029_SORA_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0029_SORA_INDEX:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0029_COMP_SORA_1MTH:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0029_COMP_SORA_3MTH:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0029_COMP_SORA_6MTH:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0029_AGGREGATE_VOLUME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0029_HIGH_TRANS_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0029_LOW_TRANS_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0029_CALCULATION_METHOD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0029_LAST_PUBLISHED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0029_LAST_MODIFIED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0029_LAST_MODIFIED_BY:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-020
_For source table: `ABA0030_CORP_PASS_MAPPING`_

```
Comprehend every column on `MS9ABA.ABA0030_CORP_PASS_MAPPING` (eApps). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0030_BANK_CODE (CHAR(4), nullable=False, default=-)
  - ABA0030_CP_ENTITY_ID (VARCHAR2(10), nullable=False, default=-)
  - ABA0030_CP_UID (VARCHAR2(100), nullable=False, default=-)
  - ABA0030_TOKEN_USER_ID (VARCHAR2(8), nullable=False, default=-)
  - ABA0030_ACTIVE_IND (VARCHAR2(1), nullable=False, default=-)
  - ABA0030_LAST_LOGIN_DT (TIMESTAMP(6), nullable=True, default=-)
  - ABA0030_LAST_MODIFIED_DT (TIMESTAMP(6), nullable=False, default=SYSDATE)
  - ABA0030_UPDATED_BY (VARCHAR2(20), nullable=False, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0030_BANK_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0030_CP_ENTITY_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0030_CP_UID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0030_TOKEN_USER_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0030_ACTIVE_IND:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0030_LAST_LOGIN_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0030_LAST_MODIFIED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0030_UPDATED_BY:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-021
_For source table: `ABA0031_OUTSTANDING_FRN`_

```
Comprehend every column on `MS9ABA.ABA0031_OUTSTANDING_FRN` (Daily Price). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0031_YEAR (VARCHAR2(4), nullable=False, default=-)
  - ABA0031_MONTH (VARCHAR2(2), nullable=False, default=-)
  - ABA0031_MONTH6 (NUMBER(13,0), nullable=True, default=0)
  - ABA0031_YEAR1 (NUMBER(13,0), nullable=True, default=0)
  - ABA0031_YEAR2 (NUMBER(13,0), nullable=True, default=0)
  - ABA0031_YEAR5 (NUMBER(13,0), nullable=True, default=0)
  - ABA0031_YEAR10 (NUMBER(13,0), nullable=True, default=0)
  - ABA0031_YEAR15 (NUMBER(13,0), nullable=True, default=0)
  - ABA0031_YEAR20 (NUMBER(13,0), nullable=True, default=0)
  - ABA0031_YEAR30 (NUMBER(13,0), nullable=True, default=0)
  - ABA0031_OTH (NUMBER(13,0), nullable=True, default=0)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0031_YEAR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0031_MONTH:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0031_MONTH6:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0031_YEAR1:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0031_YEAR2:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0031_YEAR5:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0031_YEAR10:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0031_YEAR15:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0031_YEAR20:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0031_YEAR30:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0031_OTH:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-022
_For source table: `ABA0033_ISSUANCE_REDEMPT_SGS`_

```
Comprehend every column on `MS9ABA.ABA0033_ISSUANCE_REDEMPT_SGS` (Daily Price). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0033_YEAR (VARCHAR2(4), nullable=False, default=-)
  - ABA0033_MONTH (VARCHAR2(2), nullable=True, default=-)
  - ABA0033_QUARTER (VARCHAR2(2), nullable=True, default=-)
  - ABA0033_SECURITY_CATEGORY (VARCHAR2(20), nullable=True, default=0)
  - ABA0033_ISSUANCE_AMOUNT (NUMBER(20,0), nullable=True, default=0)
  - ABA0033_REDEMPTION_AMOUNT (NUMBER(20,0), nullable=True, default=0)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0033_YEAR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0033_MONTH:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0033_QUARTER:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0033_SECURITY_CATEGORY:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0033_ISSUANCE_AMOUNT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0033_REDEMPTION_AMOUNT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-023
_For source table: `ABA0036_STAGE_SORA_AMMO`_

```
Comprehend every column on `MS9ABA.ABA0036_STAGE_SORA_AMMO` (Daily Price). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0036_SORA_PUB_DT (DATE, nullable=False, default=-)
  - ABA0036_SORA_VALUE_DT (DATE, nullable=False, default=-)
  - ABA0036_SORA_RATE (NUMBER(7,4), nullable=False, default=-)
  - ABA0036_SORA_INDEX (NUMBER(13,10), nullable=True, default=-)
  - ABA0036_COMP_SORA_1MTH (NUMBER(7,4), nullable=True, default=-)
  - ABA0036_COMP_SORA_3MTH (NUMBER(7,4), nullable=True, default=-)
  - ABA0036_COMP_SORA_6MTH (NUMBER(7,4), nullable=True, default=-)
  - ABA0036_AGGREGATE_VOLUME (NUMBER(5,0), nullable=True, default=-)
  - ABA0036_HIGH_TRANS_RATE (NUMBER(7,4), nullable=True, default=-)
  - ABA0036_LOW_TRANS_RATE (NUMBER(7,4), nullable=True, default=-)
  - ABA0036_CALCULATION_METHOD (VARCHAR2(150), nullable=True, default=-)
  - ABA0036_LAST_MODIFIED_BY (VARCHAR2(8), nullable=False, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0036_SORA_PUB_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0036_SORA_VALUE_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0036_SORA_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0036_SORA_INDEX:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0036_COMP_SORA_1MTH:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0036_COMP_SORA_3MTH:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0036_COMP_SORA_6MTH:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0036_AGGREGATE_VOLUME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0036_HIGH_TRANS_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0036_LOW_TRANS_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0036_CALCULATION_METHOD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0036_LAST_MODIFIED_BY:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-024
_For source table: `ABA0101_SB_SECURITY_MASTER`_

```
Comprehend every column on `MS9ABA.ABA0101_SB_SECURITY_MASTER` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0101_SB_SECURITY_CODE (CHAR(8), nullable=False, default=-)
  - ABA0101_SB_ISSUE_NO (CHAR(1), nullable=False, default=-)
  - ABA0101_SB_ISSUE_TYPE (CHAR(1), nullable=True, default=-)
  - ABA0101_SB_CURR (CHAR(3), nullable=True, default=-)
  - ABA0101_SB_SECURITY_NAME (VARCHAR2(30), nullable=False, default=-)
  - ABA0101_SB_ISSUE_DATE (DATE, nullable=False, default=-)
  - ABA0101_SB_TENDER_DATE (DATE, nullable=False, default=-)
  - ABA0101_SB_ISSUE_SIZE (NUMBER(13,0), nullable=False, default=-)
  - ABA0101_SB_QTY_APPLIED (NUMBER(13,0), nullable=True, default=-)
  - ABA0101_SB_CUTOFF_AMT (NUMBER(13,0), nullable=True, default=-)
  - ABA0101_SB_MATURITY_DATE (DATE, nullable=False, default=-)
  - ABA0101_SB_INTEREST_RATE (NUMBER(7,4), nullable=True, default=-)
  - ABA0101_SB_TAX_STATUS (CHAR(1), nullable=True, default=-)
  - ABA0101_SB_REFERENCE_NO (NUMBER(13,0), nullable=True, default=-)
  - ABA0101_SB_ISIN_CODE (CHAR(12), nullable=True, default=-)
  - ABA0101_SB_ANNOUNCE_DATE (DATE, nullable=True, default=-)
  - ABA0101_SB_RESULT_LOAD_DATE (DATE, nullable=True, default=-)
  - ABA0101_SB_LAST_INT_DATE (DATE, nullable=True, default=-)
  - ABA0101_SB_NEXT_INT_DATE (DATE, nullable=True, default=-)
  - ABA0101_SB_INT_DATE1 (DATE, nullable=True, default=-)
  - ABA0101_SB_INT_DATE2 (DATE, nullable=True, default=-)
  - ABA0101_SB_INT_PAID_IND (CHAR(1), nullable=True, default=-)
  - ABA0101_SB_TENOR (NUMBER(3,0), nullable=True, default=-)
  - ABA0101_SB_EX_INT_DATE (DATE, nullable=True, default=-)
  - ABA0101_SB_ANNOUNCE_INDICATOR (CHAR(1), nullable=True, default=-)
  - ABA0101_SB_QTY_ALLOTTED (NUMBER(13,0), nullable=True, default=-)
  - ABA0101_SB_QTY_REJECTED (NUMBER(13,0), nullable=True, default=-)
  - ABA0101_SB_QTY_REDEEMED (NUMBER(13,0), nullable=True, default=-)
  - ABA0101_SB_RANDOM_ALLOT_AMT (NUMBER(13,0), nullable=True, default=-)
  - ABA0101_SB_RANDOM_ALLOT_RATE (NUMBER(4,2), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0101_SB_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_ISSUE_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_ISSUE_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_CURR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_SECURITY_NAME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_ISSUE_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_TENDER_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_ISSUE_SIZE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_QTY_APPLIED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_CUTOFF_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_MATURITY_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_INTEREST_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_TAX_STATUS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_REFERENCE_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_ISIN_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_ANNOUNCE_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_RESULT_LOAD_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_LAST_INT_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_NEXT_INT_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_INT_DATE1:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_INT_DATE2:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_INT_PAID_IND:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_TENOR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_EX_INT_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_ANNOUNCE_INDICATOR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_QTY_ALLOTTED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_QTY_REJECTED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_QTY_REDEEMED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_RANDOM_ALLOT_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0101_SB_RANDOM_ALLOT_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-025
_For source table: `ABA0108_SB_STAGE_SEC_MASTER`_

```
Comprehend every column on `MS9ABA.ABA0108_SB_STAGE_SEC_MASTER` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0108_SB_SECURITY_CODE (CHAR(8), nullable=False, default=-)
  - ABA0108_SB_ISSUE_NO (CHAR(1), nullable=False, default=-)
  - ABA0108_SB_ISSUE_TYPE (CHAR(1), nullable=True, default=-)
  - ABA0108_SB_CURR (CHAR(3), nullable=True, default=-)
  - ABA0108_SB_SECURITY_NAME (VARCHAR2(30), nullable=False, default=-)
  - ABA0108_SB_ISSUE_DATE (DATE, nullable=False, default=-)
  - ABA0108_SB_TENDER_DATE (DATE, nullable=False, default=-)
  - ABA0108_SB_ISSUE_SIZE (NUMBER(13,0), nullable=False, default=-)
  - ABA0108_SB_QTY_APPLIED (NUMBER(13,0), nullable=True, default=-)
  - ABA0108_SB_CUTOFF_AMT (NUMBER(13,0), nullable=True, default=-)
  - ABA0108_SB_MATURITY_DATE (DATE, nullable=False, default=-)
  - ABA0108_SB_INTEREST_RATE (NUMBER(7,4), nullable=True, default=-)
  - ABA0108_SB_TAX_STATUS (CHAR(1), nullable=True, default=-)
  - ABA0108_SB_REFERENCE_NO (NUMBER(13,0), nullable=True, default=-)
  - ABA0108_SB_ISIN_CODE (CHAR(12), nullable=True, default=-)
  - ABA0108_SB_ANNOUNCE_DATE (DATE, nullable=True, default=-)
  - ABA0108_SB_RESULT_LOAD_DATE (DATE, nullable=True, default=-)
  - ABA0108_SB_LAST_INT_DATE (DATE, nullable=True, default=-)
  - ABA0108_SB_NEXT_INT_DATE (DATE, nullable=True, default=-)
  - ABA0108_SB_INT_DATE1 (DATE, nullable=True, default=-)
  - ABA0108_SB_INT_DATE2 (DATE, nullable=True, default=-)
  - ABA0108_SB_INT_PAID_IND (CHAR(1), nullable=True, default=-)
  - ABA0108_SB_TENOR (NUMBER(3,0), nullable=True, default=-)
  - ABA0108_SB_EX_INT_DATE (DATE, nullable=True, default=-)
  - ABA0108_SB_ANNOUNCE_INDICATOR (CHAR(1), nullable=True, default=-)
  - ABA0108_SB_QTY_ALLOTTED (NUMBER(13,0), nullable=True, default=-)
  - ABA0108_SB_QTY_REJECTED (NUMBER(13,0), nullable=True, default=-)
  - ABA0108_SB_QTY_REDEEMED (NUMBER(13,0), nullable=True, default=-)
  - ABA0108_SB_RANDOM_ALLOT_AMT (NUMBER(13,0), nullable=True, default=-)
  - ABA0108_SB_RANDOM_ALLOT_RATE (NUMBER(2,0), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0108_SB_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_ISSUE_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_ISSUE_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_CURR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_SECURITY_NAME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_ISSUE_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_TENDER_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_ISSUE_SIZE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_QTY_APPLIED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_CUTOFF_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_MATURITY_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_INTEREST_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_TAX_STATUS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_REFERENCE_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_ISIN_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_ANNOUNCE_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_RESULT_LOAD_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_LAST_INT_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_NEXT_INT_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_INT_DATE1:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_INT_DATE2:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_INT_PAID_IND:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_TENOR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_EX_INT_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_ANNOUNCE_INDICATOR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_QTY_ALLOTTED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_QTY_REJECTED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_QTY_REDEEMED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_RANDOM_ALLOT_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0108_SB_RANDOM_ALLOT_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-026
_For source table: `ABA0110_SB_ANNOUNCE_TEXT`_

```
Comprehend every column on `MS9ABA.ABA0110_SB_ANNOUNCE_TEXT` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0110_NAME (VARCHAR2(8), nullable=False, default=-)
  - ABA0110_USED_BEFORE (DATE, nullable=False, default=-)
  - ABA0110_TEXT (VARCHAR2(4000), nullable=False, default=-)
  - ABA0110_LAST_UPDATED (DATE, nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0110_NAME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0110_USED_BEFORE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0110_TEXT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0110_LAST_UPDATED:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-027
_For source table: `ABA0121_SB_ISSUE_CALENDAR`_

```
Comprehend every column on `MS9ABA.ABA0121_SB_ISSUE_CALENDAR` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0121_SECURITY_CODE (VARCHAR2(8), nullable=False, default=-)
  - ABA0121_ISSUE_NO (VARCHAR2(1), nullable=False, default=-)
  - ABA0121_ISIN_CODE (VARCHAR2(12), nullable=True, default=-)
  - ABA0121_ISSUE_TYPE (VARCHAR2(1), nullable=True, default=-)
  - ABA0121_TENOR (NUMBER(3,0), nullable=True, default=-)
  - ABA0121_TENOR_UNIT (VARCHAR2(1), nullable=True, default=-)
  - ABA0121_CURR (VARCHAR2(3), nullable=True, default=-)
  - ABA0121_NEW_REOPEN (VARCHAR2(1), nullable=True, default=-)
  - ABA0121_OPEN_DATETIME (DATE, nullable=True, default=-)
  - ABA0121_CLOSE_DATETIME (DATE, nullable=True, default=-)
  - ABA0121_ISSUE_DATETIME (DATE, nullable=True, default=-)
  - ABA0121_FLAG (VARCHAR2(1), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0121_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0121_ISSUE_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0121_ISIN_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0121_ISSUE_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0121_TENOR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0121_TENOR_UNIT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0121_CURR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0121_NEW_REOPEN:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0121_OPEN_DATETIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0121_CLOSE_DATETIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0121_ISSUE_DATETIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0121_FLAG:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-028
_For source table: `ABA0124_SB_COUPON_RATE_DETAILS`_

```
Comprehend every column on `MS9ABA.ABA0124_SB_COUPON_RATE_DETAILS` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0124_ISSUE_CODE (CHAR(8), nullable=False, default=-)
  - ABA0124_YEAR_NUMBER (NUMBER(2,0), nullable=False, default=-)
  - ABA0124_COUPON_NUMBER (NUMBER(2,0), nullable=False, default=-)
  - ABA0124_COUPON_PAYMENT_DATE (DATE, nullable=True, default=-)
  - ABA0124_COUPON_RATE (NUMBER(13,5), nullable=False, default=-)
  - ABA0124_RETURN_RATE (NUMBER(13,5), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0124_ISSUE_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0124_YEAR_NUMBER:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0124_COUPON_NUMBER:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0124_COUPON_PAYMENT_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0124_COUPON_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0124_RETURN_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-029
_For source table: `ABA0125_SB_STAGE_COUPON_RATE`_

```
Comprehend every column on `MS9ABA.ABA0125_SB_STAGE_COUPON_RATE` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - COL1 (VARCHAR2(20), nullable=True, default=-)
  - COL2 (VARCHAR2(20), nullable=True, default=-)
  - COL3 (VARCHAR2(20), nullable=True, default=-)
  - COL4 (VARCHAR2(20), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    COL1:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    COL2:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    COL3:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    COL4:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-030
_For source table: `ABA0126_SB_REDEMPTION_RESULT`_

```
Comprehend every column on `MS9ABA.ABA0126_SB_REDEMPTION_RESULT` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0126_SB_REDEMPTION_DATE (DATE, nullable=False, default=-)
  - ABA0126_SB_SECURITY_CODE (CHAR(8), nullable=False, default=-)
  - ABA0126_SB_QTY_REDEEMED (NUMBER(13,0), nullable=True, default=-)
  - ABA0126_SB_QTY_OUTSTANDING (NUMBER(13,0), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0126_SB_REDEMPTION_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0126_SB_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0126_SB_QTY_REDEEMED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0126_SB_QTY_OUTSTANDING:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-031
_For source table: `ABA0127_SB_SYSTEM_CONFIG`_

```
Comprehend every column on `MS9ABA.ABA0127_SB_SYSTEM_CONFIG` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0127_SB_PROPERTY_NAME (VARCHAR2(100), nullable=False, default=-)
  - ABA0127_SB_PROPERTY_VALUE (VARCHAR2(255), nullable=False, default=-)
  - ABA0127_SB_CREATED_DT (TIMESTAMP(6), nullable=False, default=-)
  - ABA0127_SB_LAST_MODIFIED_DT (TIMESTAMP(6), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0127_SB_PROPERTY_NAME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0127_SB_PROPERTY_VALUE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0127_SB_CREATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0127_SB_LAST_MODIFIED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-032
_For source table: `ABA0212_SB_REPORT`_

```
Comprehend every column on `MS9ABA.ABA0212_SB_REPORT` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0212_SB_REPORT_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0212_SB_REPORT_NAME (VARCHAR2(255), nullable=False, default=-)
  - ABA0212_SB_REPORT_TYPE (VARCHAR2(1), nullable=False, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0212_SB_REPORT_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0212_SB_REPORT_NAME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0212_SB_REPORT_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-033
_For source table: `ABA0213_SB_REPORT_FILE`_

```
Comprehend every column on `MS9ABA.ABA0213_SB_REPORT_FILE` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0213_SB_REPORT_FILE_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0213_SB_REPORT_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0213_SB_FILE_NAME (VARCHAR2(255), nullable=False, default=-)
  - ABA0213_SB_FILE_DESC (VARCHAR2(255), nullable=False, default=-)
  - ABA0213_SB_FILE_MIMETYPE (VARCHAR2(5), nullable=False, default=-)
  - ABA0213_SB_SECURITY_CODE (VARCHAR2(8), nullable=True, default=-)
  - ABA0213_SB_PROCESS_DT (NUMBER(8,0), nullable=True, default=-)
  - ABA0213_SB_CREATED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0213_SB_REPORT_FILE_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0213_SB_REPORT_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0213_SB_FILE_NAME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0213_SB_FILE_DESC:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0213_SB_FILE_MIMETYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0213_SB_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0213_SB_PROCESS_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0213_SB_CREATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-034
_For source table: `ABA0214_SB_CD_FILE_TYPE`_

```
Comprehend every column on `MS9ABA.ABA0214_SB_CD_FILE_TYPE` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0214_SB_CD_FILE_TYPE (VARCHAR2(3), nullable=False, default=-)
  - ABA0214_SB_DESCRIPTION (VARCHAR2(100), nullable=False, default=-)
  - ABA0214_SB_TYPE_DISPLAY (VARCHAR2(100), nullable=True, default=-)
  - ABA0214_SB_OBS_IND (CHAR(1), nullable=False, default=N)
  - ABA0214_SB_TYPE_CATEGORY (VARCHAR2(25), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0214_SB_CD_FILE_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0214_SB_DESCRIPTION:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0214_SB_TYPE_DISPLAY:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0214_SB_OBS_IND:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0214_SB_TYPE_CATEGORY:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-035
_For source table: `ABA0215_SB_CD_FILE_STATUS`_

```
Comprehend every column on `MS9ABA.ABA0215_SB_CD_FILE_STATUS` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0215_SB_CD_FILE_STATUS (VARCHAR2(1), nullable=False, default=-)
  - ABA0215_SB_DESCRIPTION (VARCHAR2(100), nullable=False, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0215_SB_CD_FILE_STATUS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0215_SB_DESCRIPTION:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-036
_For source table: `ABA0216_SB_CD_RECORD_STATUS`_

```
Comprehend every column on `MS9ABA.ABA0216_SB_CD_RECORD_STATUS` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0216_SB_CD_RECORD_STATUS (VARCHAR2(1), nullable=False, default=-)
  - ABA0216_SB_DESCRIPTION (VARCHAR2(100), nullable=False, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0216_SB_CD_RECORD_STATUS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0216_SB_DESCRIPTION:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-037
_For source table: `ABA0217_SB_CD_NATION`_

```
Comprehend every column on `MS9ABA.ABA0217_SB_CD_NATION` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0217_SB_CD_NATION (VARCHAR2(1), nullable=False, default=-)
  - ABA0217_SB_DESCRIPTION (VARCHAR2(100), nullable=False, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0217_SB_CD_NATION:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0217_SB_DESCRIPTION:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-038
_For source table: `ABA0218_SB_CD_NATION_CTY`_

```
Comprehend every column on `MS9ABA.ABA0218_SB_CD_NATION_CTY` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0218_SB_CD_NATION_CTY (VARCHAR2(2), nullable=False, default=-)
  - ABA0218_SB_DESCRIPTION (VARCHAR2(100), nullable=False, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0218_SB_CD_NATION_CTY:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0218_SB_DESCRIPTION:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-039
_For source table: `ABA0219_SB_CD_FILE_ERROR_DESC`_

```
Comprehend every column on `MS9ABA.ABA0219_SB_CD_FILE_ERROR_DESC` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0219_SB_CD_FILE_ERR_DESC (VARCHAR2(3), nullable=False, default=-)
  - ABA0219_SB_DESCRIPTION (VARCHAR2(20), nullable=False, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0219_SB_CD_FILE_ERR_DESC:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0219_SB_DESCRIPTION:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-040
_For source table: `ABA0220_SB_CD_RECORD_ERR_DESC`_

```
Comprehend every column on `MS9ABA.ABA0220_SB_CD_RECORD_ERR_DESC` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0220_SB_CD_RECORD_ERR_DESC (VARCHAR2(3), nullable=False, default=-)
  - ABA0220_SB_DESCRIPTION (VARCHAR2(20), nullable=False, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0220_SB_CD_RECORD_ERR_DESC:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0220_SB_DESCRIPTION:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-041
_For source table: `ABA0221_SB_CD_BATCHJOB_STATUS`_

```
Comprehend every column on `MS9ABA.ABA0221_SB_CD_BATCHJOB_STATUS` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0221_SB_CD_BATCHJOB_STATUS (VARCHAR2(3), nullable=False, default=-)
  - ABA0221_SB_DESCRIPTION (VARCHAR2(255), nullable=False, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0221_SB_CD_BATCHJOB_STATUS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0221_SB_DESCRIPTION:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-042
_For source table: `ABA0222_SB_ORG`_

```
Comprehend every column on `MS9ABA.ABA0222_SB_ORG` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0222_SB_ORG_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0222_SB_ORG_TYPE (VARCHAR2(1), nullable=False, default=-)
  - ABA0222_SB_ORG_CODE (NUMBER(4,0), nullable=False, default=-)
  - ABA0222_SB_ORG_NAME (VARCHAR2(20), nullable=False, default=-)
  - ABA0222_SB_ORG_NAME_DESC (VARCHAR2(255), nullable=False, default=-)
  - ABA0222_SB_MEMEBER_CODE (VARCHAR2(8), nullable=False, default=-)
  - ABA0222_SB_CUSTODY_CODE (VARCHAR2(3), nullable=False, default=-)
  - ABA0222_SB_CREATED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)
  - ABA0222_SB_LAST_MODIFIED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)
  - ABA0222_SB_OMNIBUS_ACCT_NO (VARCHAR2(16), nullable=True, default=-)
  - ABA0222_SB_PGP_RECIPIENT_KEY (VARCHAR2(50), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0222_SB_ORG_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0222_SB_ORG_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0222_SB_ORG_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0222_SB_ORG_NAME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0222_SB_ORG_NAME_DESC:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0222_SB_MEMEBER_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0222_SB_CUSTODY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0222_SB_CREATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0222_SB_LAST_MODIFIED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0222_SB_OMNIBUS_ACCT_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0222_SB_PGP_RECIPIENT_KEY:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-043
_For source table: `ABA0223_SB_APPLICANT`_

```
Comprehend every column on `MS9ABA.ABA0223_SB_APPLICANT` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0223_SB_APPLICANT_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0223_SB_IC_PASSPORT (VARCHAR2(14), nullable=False, default=-)
  - ABA0223_SB_NAME_OF_APPLN (VARCHAR2(100), nullable=True, default=-)
  - ABA0223_SB_CD_NATION (VARCHAR2(1), nullable=False, default=-)
  - ABA0223_SB_CD_NATION_CTY (VARCHAR2(2), nullable=False, default=-)
  - ABA0223_SB_CREATED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)
  - ABA0223_SB_LAST_MODIFIED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0223_SB_APPLICANT_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0223_SB_IC_PASSPORT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0223_SB_NAME_OF_APPLN:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0223_SB_CD_NATION:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0223_SB_CD_NATION_CTY:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0223_SB_CREATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0223_SB_LAST_MODIFIED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-044
_For source table: `ABA0223_SB_PGP_CONFIG`_

```
Comprehend every column on `MS9ABA.ABA0223_SB_PGP_CONFIG` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0223_SB_PGP_PROPERTY_KEY (VARCHAR2(30), nullable=False, default=-)
  - ABA0223_SB_PGP_PROPERTY_VALUE (VARCHAR2(100), nullable=False, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0223_SB_PGP_PROPERTY_KEY:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0223_SB_PGP_PROPERTY_VALUE:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-045
_For source table: `ABA0224_SB_SUBSCRIPT`_

```
Comprehend every column on `MS9ABA.ABA0224_SB_SUBSCRIPT` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0224_SB_SUB_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0224_SB_BATCH_JOB_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0224_SB_ORG_ID (NUMBER(19,0), nullable=True, default=-)
  - ABA0224_SB_CD_FILE_TYPE (VARCHAR2(3), nullable=True, default=-)
  - ABA0224_SB_CD_FILE_STATUS (VARCHAR2(1), nullable=True, default=-)
  - ABA0224_SB_CD_FILE_ERROR_DESC (VARCHAR2(3), nullable=True, default=-)
  - ABA0224_SB_SECURITY_CODE (VARCHAR2(8), nullable=True, default=-)
  - ABA0224_SB_ISIN_CODE (VARCHAR2(12), nullable=True, default=-)
  - ABA0224_SB_TENDER_DT (NUMBER(8,0), nullable=True, default=-)
  - ABA0224_SB_CURR (VARCHAR2(3), nullable=True, default=-)
  - ABA0224_SB_ISSUE_DESC (VARCHAR2(30), nullable=True, default=-)
  - ABA0224_SB_PROCESS_DT (NUMBER(8,0), nullable=True, default=-)
  - ABA0224_SB_RECORD_COUNT (NUMBER(10,0), nullable=True, default=-)
  - ABA0224_SB_FILE_NAME (VARCHAR2(100), nullable=False, default=-)
  - ABA0224_SB_DELETED_DT (DATE, nullable=True, default=-)
  - ABA0224_SB_ACKNOWLEDGED_DT (DATE, nullable=True, default=-)
  - ABA0224_SB_CREATED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)
  - ABA0224_SB_LAST_MODIFIED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0224_SB_SUB_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0224_SB_BATCH_JOB_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0224_SB_ORG_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0224_SB_CD_FILE_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0224_SB_CD_FILE_STATUS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0224_SB_CD_FILE_ERROR_DESC:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0224_SB_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0224_SB_ISIN_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0224_SB_TENDER_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0224_SB_CURR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0224_SB_ISSUE_DESC:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0224_SB_PROCESS_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0224_SB_RECORD_COUNT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0224_SB_FILE_NAME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0224_SB_DELETED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0224_SB_ACKNOWLEDGED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0224_SB_CREATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0224_SB_LAST_MODIFIED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-046
_For source table: `ABA0225_SB_SUBSCRIPT_DT`_

```
Comprehend every column on `MS9ABA.ABA0225_SB_SUBSCRIPT_DT` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0225_SB_SUB_DETAIL_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0225_SB_SUB_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0225_SB_APPLICANT_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0225_SB_REFERENCE_NO (NUMBER(13,0), nullable=False, default=-)
  - ABA0225_SB_TRANS_REF (VARCHAR2(8), nullable=False, default=-)
  - ABA0225_SB_TRANS_TYPE (VARCHAR2(3), nullable=True, default=-)
  - ABA0225_SB_RECEIVED_DT (NUMBER(8,0), nullable=True, default=-)
  - ABA0225_SB_RECEIVED_TIME (NUMBER(6,0), nullable=True, default=-)
  - ABA0225_SB_NOMINAL_AMT (NUMBER(11,0), nullable=True, default=-)
  - ABA0225_SB_COMP_NOCOMP (VARCHAR2(1), nullable=True, default=-)
  - ABA0225_SB_BID_YIELD_SIGN (VARCHAR2(1), nullable=True, default=-)
  - ABA0225_SB_BID_YIELD (NUMBER(5,0), nullable=True, default=-)
  - ABA0225_SB_CDP_ACCT_NO (VARCHAR2(16), nullable=True, default=-)
  - ABA0225_SB_CPFIS_SRS_ACCT_NO (VARCHAR2(16), nullable=True, default=-)
  - ABA0225_SB_CUST_BANK_CODE (NUMBER(4,0), nullable=True, default=-)
  - ABA0225_SB_CUST_BANK_BC (VARCHAR2(1), nullable=True, default=-)
  - ABA0225_SB_CURR (VARCHAR2(3), nullable=True, default=-)
  - ABA0225_SB_TYPE_OF_APPLN (VARCHAR2(3), nullable=True, default=-)
  - ABA0225_SB_SUB_METHOD (VARCHAR2(1), nullable=False, default=-)
  - ABA0225_SB_ISSUE_DESC (VARCHAR2(30), nullable=True, default=-)
  - ABA0225_SB_FILLER (VARCHAR2(20), nullable=True, default=-)
  - ABA0225_SB_CD_RECORD_STATUS (VARCHAR2(1), nullable=True, default=-)
  - ABA0225_SB_DELETED_DT (DATE, nullable=True, default=-)
  - ABA0225_SB_LINE_NUMBER (NUMBER(8,0), nullable=True, default=-)
  - ABA0225_SB_CREATED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)
  - ABA0225_SB_LAST_MODIFIED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0225_SB_SUB_DETAIL_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_SUB_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_APPLICANT_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_REFERENCE_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_TRANS_REF:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_TRANS_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_RECEIVED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_RECEIVED_TIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_NOMINAL_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_COMP_NOCOMP:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_BID_YIELD_SIGN:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_BID_YIELD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_CDP_ACCT_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_CPFIS_SRS_ACCT_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_CUST_BANK_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_CUST_BANK_BC:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_CURR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_TYPE_OF_APPLN:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_SUB_METHOD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_ISSUE_DESC:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_FILLER:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_CD_RECORD_STATUS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_DELETED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_LINE_NUMBER:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_CREATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0225_SB_LAST_MODIFIED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-047
_For source table: `ABA0226_SB_SUBSCRIPT_DT_ERR`_

```
Comprehend every column on `MS9ABA.ABA0226_SB_SUBSCRIPT_DT_ERR` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0226_SB_SUB_DT_ERR_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0226_SB_SUB_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0226_SB_SECURITY_CODE (VARCHAR2(8), nullable=True, default=-)
  - ABA0226_SB_TRANS_REF (VARCHAR2(8), nullable=True, default=-)
  - ABA0226_SB_TRANS_TYPE (VARCHAR2(3), nullable=True, default=-)
  - ABA0226_SB_RECEIVED_DT (NUMBER(8,0), nullable=True, default=-)
  - ABA0226_SB_RECEIVED_TIME (NUMBER(6,0), nullable=True, default=-)
  - ABA0226_SB_NOMINAL_AMT (NUMBER(11,0), nullable=True, default=-)
  - ABA0226_SB_COMP_NOCOMP (VARCHAR2(1), nullable=True, default=-)
  - ABA0226_SB_BID_YIELD_SIGN (VARCHAR2(1), nullable=True, default=-)
  - ABA0226_SB_BID_YIELD (NUMBER(5,0), nullable=True, default=-)
  - ABA0226_SB_IC_PASSPORT (VARCHAR2(14), nullable=True, default=-)
  - ABA0226_SB_NAME_OF_APPLN (VARCHAR2(100), nullable=True, default=-)
  - ABA0226_SB_CD_NATION (VARCHAR2(1), nullable=True, default=-)
  - ABA0226_SB_CD_NATION_CTY (VARCHAR2(2), nullable=True, default=-)
  - ABA0226_SB_CDP_ACCT_NO (VARCHAR2(16), nullable=True, default=-)
  - ABA0226_SB_CPFIS_SRS_ACCT_NO (VARCHAR2(16), nullable=True, default=-)
  - ABA0226_SB_CUST_BANK_CODE (NUMBER(4,0), nullable=True, default=-)
  - ABA0226_SB_CUST_BANK_BC (VARCHAR2(1), nullable=True, default=-)
  - ABA0226_SB_TYPE_OF_APPLN (VARCHAR2(3), nullable=True, default=-)
  - ABA0226_SB_SUB_METHOD (VARCHAR2(1), nullable=True, default=-)
  - ABA0226_SB_FILLER (VARCHAR2(20), nullable=True, default=-)
  - ABA0226_SB_CD_RECORD_ERR_DESC (VARCHAR2(3), nullable=True, default=-)
  - ABA0226_SB_DELETED_DT (DATE, nullable=True, default=-)
  - ABA0226_SB_LINE_NUMBER (NUMBER(8,0), nullable=True, default=-)
  - ABA0226_SB_CREATED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)
  - ABA0226_SB_LAST_MODIFIED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0226_SB_SUB_DT_ERR_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_SUB_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_TRANS_REF:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_TRANS_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_RECEIVED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_RECEIVED_TIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_NOMINAL_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_COMP_NOCOMP:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_BID_YIELD_SIGN:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_BID_YIELD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_IC_PASSPORT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_NAME_OF_APPLN:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_CD_NATION:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_CD_NATION_CTY:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_CDP_ACCT_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_CPFIS_SRS_ACCT_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_CUST_BANK_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_CUST_BANK_BC:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_TYPE_OF_APPLN:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_SUB_METHOD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_FILLER:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_CD_RECORD_ERR_DESC:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_DELETED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_LINE_NUMBER:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_CREATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0226_SB_LAST_MODIFIED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-048
_For source table: `ABA0227_SB_REDEMPTION`_

```
Comprehend every column on `MS9ABA.ABA0227_SB_REDEMPTION` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0227_SB_REDEM_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0227_SB_BATCH_JOB_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0227_SB_ORG_ID (NUMBER(19,0), nullable=True, default=-)
  - ABA0227_SB_CD_FILE_TYPE (VARCHAR2(3), nullable=True, default=-)
  - ABA0227_SB_CD_FILE_STATUS (VARCHAR2(1), nullable=True, default=-)
  - ABA0227_SB_CD_FILE_ERR_DESC (VARCHAR2(3), nullable=True, default=-)
  - ABA0227_SB_RECORD_COUNT (NUMBER(8,0), nullable=True, default=-)
  - ABA0227_SB_FILE_NAME (VARCHAR2(100), nullable=False, default=-)
  - ABA0227_SB_ACKNOWLEDGED_DT (DATE, nullable=True, default=-)
  - ABA0227_SB_PROCESS_DT (NUMBER(8,0), nullable=True, default=-)
  - ABA0227_SB_DELETED_DT (DATE, nullable=True, default=-)
  - ABA0227_SB_CREATED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)
  - ABA0227_SB_LAST_MODIFIED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0227_SB_REDEM_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0227_SB_BATCH_JOB_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0227_SB_ORG_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0227_SB_CD_FILE_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0227_SB_CD_FILE_STATUS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0227_SB_CD_FILE_ERR_DESC:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0227_SB_RECORD_COUNT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0227_SB_FILE_NAME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0227_SB_ACKNOWLEDGED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0227_SB_PROCESS_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0227_SB_DELETED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0227_SB_CREATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0227_SB_LAST_MODIFIED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-049
_For source table: `ABA0228_SB_REDEMPTION_DT`_

```
Comprehend every column on `MS9ABA.ABA0228_SB_REDEMPTION_DT` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0228_SB_REDEM_DT_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0228_SB_REDEM_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0228_SB_APPLICANT_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0228_SB_ORG_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0228_SB_SECURITY_CODE (VARCHAR2(8), nullable=False, default=-)
  - ABA0228_SB_ISIN_CODE (VARCHAR2(12), nullable=False, default=-)
  - ABA0228_SB_TRANS_REF (VARCHAR2(8), nullable=False, default=-)
  - ABA0228_SB_RECEIVED_DT (NUMBER(8,0), nullable=True, default=-)
  - ABA0228_SB_RECEIVED_TIME (NUMBER(6,0), nullable=True, default=-)
  - ABA0228_SB_NOMINAL_AMT (NUMBER(11,0), nullable=True, default=-)
  - ABA0228_SB_BID_YIELD_SIGN (VARCHAR2(1), nullable=True, default=-)
  - ABA0228_SB_BID_YIELD (NUMBER(5,0), nullable=True, default=-)
  - ABA0228_SB_COMP_NOCOMP (VARCHAR2(1), nullable=True, default=-)
  - ABA0228_SB_CDP_ACCT_NO (VARCHAR2(16), nullable=True, default=-)
  - ABA0228_SB_CPFIS_SRS_ACCT_NO (VARCHAR2(16), nullable=True, default=-)
  - ABA0228_SB_CUST_BANK_BC (VARCHAR2(1), nullable=True, default=-)
  - ABA0228_SB_CUST_BANK_CODE (NUMBER(4,0), nullable=True, default=-)
  - ABA0228_SB_TYPE_OF_APPLN (VARCHAR2(3), nullable=True, default=-)
  - ABA0228_SB_SUB_METHOD (VARCHAR2(1), nullable=False, default=-)
  - ABA0228_SB_FILLER (VARCHAR2(20), nullable=True, default=-)
  - ABA0228_SB_REDEM_PROCESS_DT (DATE, nullable=True, default=-)
  - ABA0228_SB_RELEASED_DT (DATE, nullable=True, default=-)
  - ABA0228_SB_CD_RECORD_STATUS (VARCHAR2(1), nullable=True, default=-)
  - ABA0228_SB_DELETED_DT (DATE, nullable=True, default=-)
  - ABA0228_SB_LINE_NUMBER (NUMBER(10,0), nullable=False, default=-)
  - ABA0228_SB_CREATED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)
  - ABA0228_SB_LAST_MODIFIED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0228_SB_REDEM_DT_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_REDEM_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_APPLICANT_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_ORG_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_ISIN_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_TRANS_REF:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_RECEIVED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_RECEIVED_TIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_NOMINAL_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_BID_YIELD_SIGN:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_BID_YIELD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_COMP_NOCOMP:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_CDP_ACCT_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_CPFIS_SRS_ACCT_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_CUST_BANK_BC:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_CUST_BANK_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_TYPE_OF_APPLN:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_SUB_METHOD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_FILLER:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_REDEM_PROCESS_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_RELEASED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_CD_RECORD_STATUS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_DELETED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_LINE_NUMBER:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_CREATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0228_SB_LAST_MODIFIED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-050
_For source table: `ABA0229_SB_REDEMPTION_DT_ERR`_

```
Comprehend every column on `MS9ABA.ABA0229_SB_REDEMPTION_DT_ERR` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0229_SB_REDEM_DT_ERR_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0229_SB_REDEM_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0229_SB_SECURITY_CODE (VARCHAR2(8), nullable=True, default=-)
  - ABA0229_SB_ISIN_CODE (VARCHAR2(12), nullable=True, default=-)
  - ABA0229_SB_TRANS_REF (VARCHAR2(8), nullable=True, default=-)
  - ABA0229_SB_RECEIVED_DT (NUMBER(8,0), nullable=True, default=-)
  - ABA0229_SB_RECEIVED_TIME (NUMBER(6,0), nullable=True, default=-)
  - ABA0229_SB_NOMINAL_AMT (NUMBER(11,0), nullable=True, default=-)
  - ABA0229_SB_COMP_NOCOMP (VARCHAR2(1), nullable=True, default=-)
  - ABA0229_SB_BID_YIELD_SIGN (VARCHAR2(1), nullable=True, default=-)
  - ABA0229_SB_BID_YIELD (NUMBER(5,0), nullable=True, default=-)
  - ABA0229_SB_IC_PASSPORT (VARCHAR2(14), nullable=True, default=-)
  - ABA0229_SB_NAME_OF_APPLN (VARCHAR2(100), nullable=True, default=-)
  - ABA0229_SB_CD_NATION (VARCHAR2(1), nullable=True, default=-)
  - ABA0229_SB_CD_NATION_CTY (VARCHAR2(2), nullable=True, default=-)
  - ABA0229_SB_CDP_ACCT_NO (VARCHAR2(16), nullable=True, default=-)
  - ABA0229_SB_CPFIS_SRS_ACCT_NO (VARCHAR2(16), nullable=True, default=-)
  - ABA0229_SB_CUST_BANK_CODE (NUMBER(4,0), nullable=True, default=-)
  - ABA0229_SB_CUST_BANK_BC (VARCHAR2(1), nullable=True, default=-)
  - ABA0229_SB_TYPE_OF_APPLN (VARCHAR2(3), nullable=True, default=-)
  - ABA0229_SB_SUB_METHOD (VARCHAR2(1), nullable=True, default=-)
  - ABA0229_SB_FILLER (VARCHAR2(20), nullable=True, default=-)
  - ABA0229_SB_REDEM_PROCESS_DT (DATE, nullable=True, default=-)
  - ABA0229_SB_RELEASED_DT (DATE, nullable=True, default=-)
  - ABA0229_SB_CD_RECORD_ERR_DESC (VARCHAR2(3), nullable=True, default=-)
  - ABA0229_SB_DELETED_DT (DATE, nullable=True, default=-)
  - ABA0229_SB_LINE_NUMBER (NUMBER(10,0), nullable=False, default=-)
  - ABA0229_SB_CREATED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)
  - ABA0229_SB_LAST_MODIFIED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0229_SB_REDEM_DT_ERR_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_REDEM_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_ISIN_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_TRANS_REF:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_RECEIVED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_RECEIVED_TIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_NOMINAL_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_COMP_NOCOMP:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_BID_YIELD_SIGN:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_BID_YIELD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_IC_PASSPORT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_NAME_OF_APPLN:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_CD_NATION:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_CD_NATION_CTY:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_CDP_ACCT_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_CPFIS_SRS_ACCT_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_CUST_BANK_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_CUST_BANK_BC:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_TYPE_OF_APPLN:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_SUB_METHOD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_FILLER:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_REDEM_PROCESS_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_RELEASED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_CD_RECORD_ERR_DESC:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_DELETED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_LINE_NUMBER:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_CREATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0229_SB_LAST_MODIFIED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-051
_For source table: `ABA0230_SB_HLD_INFO`_

```
Comprehend every column on `MS9ABA.ABA0230_SB_HLD_INFO` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0230_SB_HLD_INFO_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0230_SB_BATCH_JOB_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0230_SB_ORG_ID (NUMBER(19,0), nullable=True, default=-)
  - ABA0230_SB_CD_FILE_TYPE (VARCHAR2(3), nullable=True, default=-)
  - ABA0230_SB_CD_FILE_STATUS (VARCHAR2(1), nullable=True, default=-)
  - ABA0230_SB_CD_FILE_ERR_DESC (VARCHAR2(3), nullable=True, default=-)
  - ABA0230_SB_FILE_NAME (VARCHAR2(100), nullable=False, default=-)
  - ABA0230_SB_HLD_TYPE (VARCHAR2(3), nullable=True, default=-)
  - ABA0230_SB_PROCESS_DT (NUMBER(8,0), nullable=True, default=-)
  - ABA0230_SB_PROCESS_TIME (NUMBER(6,0), nullable=True, default=-)
  - ABA0230_SB_RECORD_COUNT (NUMBER(8,0), nullable=True, default=-)
  - ABA0230_SB_CREATED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)
  - ABA0230_SB_LAST_MODIFIED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0230_SB_HLD_INFO_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0230_SB_BATCH_JOB_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0230_SB_ORG_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0230_SB_CD_FILE_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0230_SB_CD_FILE_STATUS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0230_SB_CD_FILE_ERR_DESC:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0230_SB_FILE_NAME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0230_SB_HLD_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0230_SB_PROCESS_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0230_SB_PROCESS_TIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0230_SB_RECORD_COUNT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0230_SB_CREATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0230_SB_LAST_MODIFIED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-052
_For source table: `ABA0231_SB_HLD_INFO_DT`_

```
Comprehend every column on `MS9ABA.ABA0231_SB_HLD_INFO_DT` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0231_SB_HLD_INFO_DT_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0231_SB_HLD_INFO_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0231_SB_APPLICANT_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0231_SB_SECURITY_CODE (VARCHAR2(8), nullable=False, default=-)
  - ABA0231_SB_ISIN_CODE (VARCHAR2(12), nullable=False, default=-)
  - ABA0231_SB_CDP_ACCT_NO (VARCHAR2(16), nullable=True, default=-)
  - ABA0231_SB_CPFIS_SRS_ACCT_NO (VARCHAR2(16), nullable=True, default=-)
  - ABA0231_SB_HLD_AMT (NUMBER(14,0), nullable=True, default=-)
  - ABA0231_SB_CREATED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)
  - ABA0231_SB_LAST_MODIFIED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0231_SB_HLD_INFO_DT_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0231_SB_HLD_INFO_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0231_SB_APPLICANT_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0231_SB_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0231_SB_ISIN_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0231_SB_CDP_ACCT_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0231_SB_CPFIS_SRS_ACCT_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0231_SB_HLD_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0231_SB_CREATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0231_SB_LAST_MODIFIED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-053
_For source table: `ABA0232_SB_ALLOTMENT_RESULT`_

```
Comprehend every column on `MS9ABA.ABA0232_SB_ALLOTMENT_RESULT` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0232_SB_ALLOT_RESULT_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0232_SB_BATCH_JOB_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0232_SB_SUB_DETAIL_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0232_SB_RELEASED_DT (DATE, nullable=True, default=-)
  - ABA0232_SB_ACCEPTED_AMT (NUMBER(11,0), nullable=True, default=-)
  - ABA0232_SB_PROCESSED_AMT (NUMBER(11,0), nullable=True, default=-)
  - ABA0232_SB_CD_RECORD_STATUS (VARCHAR2(1), nullable=True, default=-)
  - ABA0232_SB_CD_RECORD_ERR_DESC (VARCHAR2(3), nullable=True, default=-)
  - ABA0232_SB_CREATED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)
  - ABA0232_SB_LAST_MODIFIED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0232_SB_ALLOT_RESULT_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0232_SB_BATCH_JOB_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0232_SB_SUB_DETAIL_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0232_SB_RELEASED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0232_SB_ACCEPTED_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0232_SB_PROCESSED_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0232_SB_CD_RECORD_STATUS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0232_SB_CD_RECORD_ERR_DESC:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0232_SB_CREATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0232_SB_LAST_MODIFIED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-054
_For source table: `ABA0233_SB_BATCH_JOB`_

```
Comprehend every column on `MS9ABA.ABA0233_SB_BATCH_JOB` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0233_SB_JOB_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0233_SB_JOB_TYPE (VARCHAR2(100), nullable=False, default=-)
  - ABA0233_SB_JOB_INSTANCE_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0233_SB_JOB_STATUS (VARCHAR2(1), nullable=True, default=-)
  - ABA0233_SB_CREATED_DT (DATE, nullable=False, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0233_SB_JOB_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0233_SB_JOB_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0233_SB_JOB_INSTANCE_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0233_SB_JOB_STATUS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0233_SB_CREATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-055
_For source table: `ABA0234_SB_BATCH_JOB_EXECUTION`_

```
Comprehend every column on `MS9ABA.ABA0234_SB_BATCH_JOB_EXECUTION` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0234_SB_JOB_EXECUTION_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0234_SB_JOB_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0234_SB_JOB_STEP (NUMBER(10,0), nullable=False, default=-)
  - ABA0234_SB_STEP_STATUS (VARCHAR2(1), nullable=False, default=-)
  - ABA0234_SB_ORG_CODE (NUMBER(4,0), nullable=True, default=-)
  - ABA0234_SB_PROCESSED_RECORDS (NUMBER(19,0), nullable=True, default=-)
  - ABA0234_SB_REMARKS (VARCHAR2(255), nullable=True, default=-)
  - ABA0234_SB_CREATED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)
  - ABA0234_APPLICATION_TYPE (VARCHAR2(4), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0234_SB_JOB_EXECUTION_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0234_SB_JOB_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0234_SB_JOB_STEP:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0234_SB_STEP_STATUS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0234_SB_ORG_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0234_SB_PROCESSED_RECORDS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0234_SB_REMARKS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0234_SB_CREATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0234_APPLICATION_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-056
_For source table: `ABA0235_SB_SUBMISSION_SUMMARY`_

```
Comprehend every column on `MS9ABA.ABA0235_SB_SUBMISSION_SUMMARY` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0235_SB_SUBMISSION_SUM_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0235_SB_JOB_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0235_SB_ORG_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0235_SB_SECURITY_CODE (VARCHAR2(8), nullable=False, default=-)
  - ABA0235_SB_CD_FILE_TYPE (VARCHAR2(3), nullable=True, default=-)
  - ABA0235_SB_QTY_REJECTED (NUMBER(8,0), nullable=False, default=-)
  - ABA0235_SB_QTY_SUBMITTED (NUMBER(8,0), nullable=False, default=-)
  - ABA0235_SB_QTY_SUCCESS (NUMBER(8,0), nullable=False, default=-)
  - ABA0235_SB_TOTAL_AMT_SUBMIT (NUMBER(13,0), nullable=False, default=-)
  - ABA0235_SB_TOTAL_AMT_SUCCESS (NUMBER(13,0), nullable=False, default=-)
  - ABA0235_SB_CREATED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0235_SB_SUBMISSION_SUM_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0235_SB_JOB_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0235_SB_ORG_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0235_SB_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0235_SB_CD_FILE_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0235_SB_QTY_REJECTED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0235_SB_QTY_SUBMITTED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0235_SB_QTY_SUCCESS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0235_SB_TOTAL_AMT_SUBMIT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0235_SB_TOTAL_AMT_SUCCESS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0235_SB_CREATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-057
_For source table: `ABA0236_SB_HLD_INFO_DT_ERR`_

```
Comprehend every column on `MS9ABA.ABA0236_SB_HLD_INFO_DT_ERR` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0236_SB_HLD_INFO_DT_ERR_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0236_SB_HLD_INFO_ID (n, nullable=False, default=-)
  - ABA0236_SB_SECURITY_CODE (VARCHAR2(8), nullable=True, default=-)
  - ABA0236_SB_ISIN_CODE (VARCHAR2(12), nullable=True, default=-)
  - ABA0236_SB_IC_PASSPORT (VARCHAR2(14), nullable=True, default=-)
  - ABA0236_SB_NAME_OF_APPLN (VARCHAR2(100), nullable=True, default=-)
  - ABA0236_SB_CDP_ACCT_NO (VARCHAR2(16), nullable=True, default=-)
  - ABA0236_SB_CD_NATION (VARCHAR2(1), nullable=True, default=-)
  - ABA0236_SB_CD_NATION_CTY (VARCHAR2(2), nullable=True, default=-)
  - ABA0236_SB_CPFIS_SRS_ACCT_NO (VARCHAR2(16), nullable=True, default=-)
  - ABA0236_SB_HLD_AMT (NUMBER(14,0), nullable=True, default=-)
  - ABA0236_SB_CD_RECORD_ERR_DESC (VARCHAR2(3), nullable=False, default=-)
  - ABA0236_SB_CREATED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)
  - ABA0236_SB_LAST_MODIFIED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0236_SB_HLD_INFO_DT_ERR_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0236_SB_HLD_INFO_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0236_SB_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0236_SB_ISIN_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0236_SB_IC_PASSPORT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0236_SB_NAME_OF_APPLN:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0236_SB_CDP_ACCT_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0236_SB_CD_NATION:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0236_SB_CD_NATION_CTY:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0236_SB_CPFIS_SRS_ACCT_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0236_SB_HLD_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0236_SB_CD_RECORD_ERR_DESC:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0236_SB_CREATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0236_SB_LAST_MODIFIED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-058
_For source table: `ABA0237_SB_USER`_

```
Comprehend every column on `MS9ABA.ABA0237_SB_USER` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0237_SB_USER_ID (VARCHAR2(20), nullable=False, default=-)
  - ABA0237_SB_LEVEL (NUMBER(3,0), nullable=True, default=-)
  - ABA0237_SB_USER_LAST_LOGIN (DATE, nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0237_SB_USER_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0237_SB_LEVEL:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0237_SB_USER_LAST_LOGIN:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-059
_For source table: `ABA0238_SB_LEVEL_ACTION`_

```
Comprehend every column on `MS9ABA.ABA0238_SB_LEVEL_ACTION` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0238_SB_MODULE (VARCHAR2(100), nullable=False, default=-)
  - ABA0238_SB_ACTION (VARCHAR2(50), nullable=False, default=-)
  - ABA0238_SB_LEVEL (NUMBER(3,0), nullable=False, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0238_SB_MODULE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0238_SB_ACTION:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0238_SB_LEVEL:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-060
_For source table: `ABA0239_SB_ACTION_REF`_

```
Comprehend every column on `MS9ABA.ABA0239_SB_ACTION_REF` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0239_SB_MODULE (VARCHAR2(100), nullable=False, default=-)
  - ABA0239_SB_ACTION (VARCHAR2(50), nullable=False, default=-)
  - ABA0239_SB_DESC (VARCHAR2(300), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0239_SB_MODULE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0239_SB_ACTION:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0239_SB_DESC:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-061
_For source table: `ABA0240_SB_CD_SUBMISSION_TYPE`_

```
Comprehend every column on `MS9ABA.ABA0240_SB_CD_SUBMISSION_TYPE` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0240_SB_CD_SUBMIT_TYPE (VARCHAR2(1), nullable=False, default=-)
  - ABA0240_SB_DESCRIPTION (VARCHAR2(100), nullable=False, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0240_SB_CD_SUBMIT_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0240_SB_DESCRIPTION:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-062
_For source table: `ABA0241_SB_RESULT_FILE`_

```
Comprehend every column on `MS9ABA.ABA0241_SB_RESULT_FILE` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0241_SB_RESULT_FILE_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0241_SB_JOB_TYPE (VARCHAR2(100), nullable=False, default=-)
  - ABA0241_SB_FILE_NAME (VARCHAR2(50), nullable=False, default=-)
  - ABA0241_SB_FILE_PATH (VARCHAR2(255), nullable=False, default=-)
  - ABA0241_SB_REFERENCE_NAME (VARCHAR2(100), nullable=False, default=-)
  - ABA0241_SB_REFERENCE_NUMBER (NUMBER(19,0), nullable=False, default=-)
  - ABA0241_SB_CREATED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0241_SB_RESULT_FILE_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0241_SB_JOB_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0241_SB_FILE_NAME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0241_SB_FILE_PATH:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0241_SB_REFERENCE_NAME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0241_SB_REFERENCE_NUMBER:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0241_SB_CREATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-063
_For source table: `ABA0250_SB_AUDIT_LOG`_

```
Comprehend every column on `MS9ABA.ABA0250_SB_AUDIT_LOG` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0250_SB_AUDIT_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0250_SB_USER_ID (VARCHAR2(25), nullable=False, default=-)
  - ABA0250_SB_FUNCTION (VARCHAR2(100), nullable=False, default=-)
  - ABA0250_SB_DETAILS (VARCHAR2(255), nullable=False, default=-)
  - ABA0250_SB_CREATED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0250_SB_AUDIT_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0250_SB_USER_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0250_SB_FUNCTION:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0250_SB_DETAILS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0250_SB_CREATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-064
_For source table: `ABA0251_SB_CONT_MAKE_CHECK`_

```
Comprehend every column on `MS9ABA.ABA0251_SB_CONT_MAKE_CHECK` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0251_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0251_SB_BANK_CODE (NUMBER(4,0), nullable=False, default=-)
  - ABA0251_SB_BANK_REF_NO (VARCHAR2(8), nullable=True, default=-)
  - ABA0251_SB_FILE_TYPE (VARCHAR2(30), nullable=False, default=-)
  - ABA0251_SB_IC_PASSPORT (VARCHAR2(14), nullable=True, default=-)
  - ABA0251_SB_ISSUE_CODE (VARCHAR2(12), nullable=True, default=-)
  - ABA0251_SB_RECORD_ID (NUMBER(19,0), nullable=True, default=-)
  - ABA0251_SB_IDENTIFIER (NUMBER(2,0), nullable=False, default=-)
  - ABA0251_SB_PROCESS_DT (DATE, nullable=False, default=-)
  - ABA0251_SB_REQUEST_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)
  - ABA0251_SB_REQUESTOR (VARCHAR2(25), nullable=False, default=-)
  - ABA0251_SB_STATUS (VARCHAR2(3), nullable=True, default=-)
  - ABA0251_SB_LAST_MODIFIED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)
  - ABA0251_SB_APPLICATION_TYPE (VARCHAR2(5), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0251_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0251_SB_BANK_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0251_SB_BANK_REF_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0251_SB_FILE_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0251_SB_IC_PASSPORT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0251_SB_ISSUE_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0251_SB_RECORD_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0251_SB_IDENTIFIER:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0251_SB_PROCESS_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0251_SB_REQUEST_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0251_SB_REQUESTOR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0251_SB_STATUS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0251_SB_LAST_MODIFIED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0251_SB_APPLICATION_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-065
_For source table: `ABA0252_SB_SYSCONF_MAKE_CHECK`_

```
Comprehend every column on `MS9ABA.ABA0252_SB_SYSCONF_MAKE_CHECK` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0252_SB_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0252_SB_APPROVER (VARCHAR2(25), nullable=False, default=-)
  - ABA0252_SB_CREATED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)
  - ABA0252_SB_CURRENT_VALUE (VARCHAR2(25), nullable=False, default=-)
  - ABA0252_SB_LIMIT (VARCHAR2(30), nullable=False, default=-)
  - ABA0252_SB_IDENTIFIER (NUMBER(2,0), nullable=False, default=-)
  - ABA0252_SB_NEW_VALUE (VARCHAR2(25), nullable=False, default=-)
  - ABA0252_SB_REQUEST_DATE (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)
  - ABA0252_SB_REQUESTER (VARCHAR2(25), nullable=False, default=-)
  - ABA0252_SB_STATUS (VARCHAR2(3), nullable=True, default=-)
  - ABA0252_SB_TYPE (VARCHAR2(25), nullable=False, default=-)
  - ABA0252_SB_LAST_MODIFIED_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0252_SB_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0252_SB_APPROVER:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0252_SB_CREATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0252_SB_CURRENT_VALUE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0252_SB_LIMIT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0252_SB_IDENTIFIER:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0252_SB_NEW_VALUE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0252_SB_REQUEST_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0252_SB_REQUESTER:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0252_SB_STATUS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0252_SB_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0252_SB_LAST_MODIFIED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-066
_For source table: `ABA0282_SB_CD_APPLICATION_TYPE`_

```
Comprehend every column on `MS9ABA.ABA0282_SB_CD_APPLICATION_TYPE` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0282_SB_CD_APPLICATION_TYPE (VARCHAR2(5), nullable=False, default=-)
  - ABA0282_SB_DESCRIPTION (VARCHAR2(100), nullable=False, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0282_SB_CD_APPLICATION_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0282_SB_DESCRIPTION:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-067
_For source table: `ABA0283_SB_COUPON_RESULT_FILE`_

```
Comprehend every column on `MS9ABA.ABA0283_SB_COUPON_RESULT_FILE` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0283_COUPON_ID (NUMBER(19,0), nullable=True, default=-)
  - ABA0283_ISSUE_CODE (CHAR(8), nullable=True, default=-)
  - ABA0283_ISIN_CODE (CHAR(12), nullable=True, default=-)
  - ABA0283_MATURITY_DATE (DATE, nullable=False, default=-)
  - ABA0283_CPN_RATE (NUMBER, nullable=False, default=-)
  - ABA0283_NEXT_CPN_DATE (DATE, nullable=False, default=-)
  - ABA0283_REMARKS_CPN_RATE (VARCHAR2(30), nullable=True, default=-)
  - ABA0283_REDEMPTION_RATE (NUMBER, nullable=False, default=-)
  - ABA0283_REMARKS_RED_RATE (VARCHAR2(30), nullable=True, default=-)
  - ABA0283_CPN_PAYMENT_DATE (DATE, nullable=False, default=-)
  - ABA0283_REDEMPTION_DATE (DATE, nullable=False, default=-)
  - ABA0283_PROCESSING_DATE (DATE, nullable=False, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0283_COUPON_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0283_ISSUE_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0283_ISIN_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0283_MATURITY_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0283_CPN_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0283_NEXT_CPN_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0283_REMARKS_CPN_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0283_REDEMPTION_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0283_REMARKS_RED_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0283_CPN_PAYMENT_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0283_REDEMPTION_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0283_PROCESSING_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-068
_For source table: `ABA0284_SB_PORTAL_SYNC`_

```
Comprehend every column on `MS9ABA.ABA0284_SB_PORTAL_SYNC` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0284_SB_TABLE_ID (NUMBER(19,0), nullable=False, default=-)
  - ABA0284_SB_TABLE_NAME (VARCHAR2(50), nullable=False, default=-)
  - ABA0284_SB_LAST_SYNC_DT (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0284_SB_TABLE_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0284_SB_TABLE_NAME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0284_SB_LAST_SYNC_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-069
_For source table: `ABA0285_SB_USER_SESSION`_

```
Comprehend every column on `MS9ABA.ABA0285_SB_USER_SESSION` (SBA). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0285_SB_USER_ID (VARCHAR2(20), nullable=True, default=-)
  - ABA0285_SB_SESSION_ID (VARCHAR2(200), nullable=True, default=-)
  - ABA0285_SB_LAST_LOGIN_DATE (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0285_SB_USER_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0285_SB_SESSION_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0285_SB_LAST_LOGIN_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-070
_For source table: `ABA0501_ENCRYPTED_REPO_TRANS`_

```
Comprehend every column on `MS9ABA.ABA0501_ENCRYPTED_REPO_TRANS` (ERF). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0501_BANK_CODE (CHAR(4), nullable=False, default=-)
  - ABA0501_TRANS_REF_NO (CHAR(16), nullable=False, default=-)
  - ABA0501_ENCRYPTED_TRANSACTION (CLOB, nullable=True, default=-)
  - ABA0501_CHECKSUM (VARCHAR2(512), nullable=True, default=-)
  - ABA0501_STATUS_FLAG (CHAR(1), nullable=True, default=I)
  - ABA0501_UPDATED_DT (DATE, nullable=True, default=-)
  - ABA0501_RECEIVED_DT (DATE, nullable=False, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0501_BANK_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0501_TRANS_REF_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0501_ENCRYPTED_TRANSACTION:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0501_CHECKSUM:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0501_STATUS_FLAG:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0501_UPDATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0501_RECEIVED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-071
_For source table: `ABA0502_PUB_KEY`_

```
Comprehend every column on `MS9ABA.ABA0502_PUB_KEY` (ERF). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0502_PUBLIC_KEY (VARCHAR2(2048), nullable=True, default=-)
  - ABA0502_UPDATED_DT (DATE, nullable=True, default=-)
  - ABA0502_CURRENT_KEY (VARCHAR2(1), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0502_PUBLIC_KEY:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0502_UPDATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0502_CURRENT_KEY:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-072
_For source table: `ABA0503_OPEN_ISSUES`_

```
Comprehend every column on `MS9ABA.ABA0503_OPEN_ISSUES` (ERF). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0503_SECURITY_CODE (CHAR(8), nullable=False, default=-)
  - ABA0503_AMT_OFFERED (NUMBER(13,0), nullable=True, default=-)
  - ABA0503_SETTLEMENT_DT_IND (CHAR(2), nullable=True, default=-)
  - ABA0503_OPENED (CHAR(1), nullable=True, default=-)
  - ABA0503_VOIDED (CHAR(1), nullable=True, default=N)
  - ABA0503_OPENED_DT (DATE, nullable=True, default=-)
  - ABA0503_UPDATED_DT (DATE, nullable=False, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0503_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0503_AMT_OFFERED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0503_SETTLEMENT_DT_IND:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0503_OPENED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0503_VOIDED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0503_OPENED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0503_UPDATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-073
_For source table: `ABA0504_AUCTION_SUMMARY`_

```
Comprehend every column on `MS9ABA.ABA0504_AUCTION_SUMMARY` (ERF). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0504_SECURITY_CODE (CHAR(8), nullable=False, default=-)
  - ABA0504_SETTLEMENT_DATE (DATE, nullable=False, default=-)
  - ABA0504_TOT_AMT_OFFERED (NUMBER(13,0), nullable=True, default=-)
  - ABA0504_TOT_AMT_APPLIED (NUMBER(13,0), nullable=True, default=-)
  - ABA0504_TOT_AMT_ALLOTED (NUMBER(13,0), nullable=True, default=-)
  - ABA0504_AVER_REPO_RATE (NUMBER(10,7), nullable=True, default=-)
  - ABA0504_CUT_OFF_REPO_RATE (NUMBER(7,4), nullable=True, default=-)
  - ABA0504_PCT_ALLOT_CUT_OFF (NUMBER(7,4), nullable=True, default=-)
  - ABA0504_CLEAN_PRICE (NUMBER(7,4), nullable=True, default=-)
  - ABA0504_DIRTY_PRICE (NUMBER(7,4), nullable=True, default=-)
  - ABA0504_HAIRCUT (NUMBER(7,4), nullable=True, default=-)
  - ABA0504_AUCTION_DT (DATE, nullable=True, default=-)
  - ABA0504_UPDATED_DT (DATE, nullable=False, default=-)
  - ABA0504_HAIRCUT_CLEAN_PRICE (NUMBER(7,4), nullable=True, default=-)
  - ABA0504_HAIRCUT_DIRTY_PRICE (NUMBER(7,4), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0504_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0504_SETTLEMENT_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0504_TOT_AMT_OFFERED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0504_TOT_AMT_APPLIED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0504_TOT_AMT_ALLOTED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0504_AVER_REPO_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0504_CUT_OFF_REPO_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0504_PCT_ALLOT_CUT_OFF:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0504_CLEAN_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0504_DIRTY_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0504_HAIRCUT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0504_AUCTION_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0504_UPDATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0504_HAIRCUT_CLEAN_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0504_HAIRCUT_DIRTY_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-074
_For source table: `ABA0505_AUCTION_DETAILS`_

```
Comprehend every column on `MS9ABA.ABA0505_AUCTION_DETAILS` (ERF). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0505_SECURITY_CODE (CHAR(8), nullable=False, default=-)
  - ABA0505_BANK_CODE (CHAR(4), nullable=False, default=-)
  - ABA0505_SEQ_NO (CHAR(5), nullable=False, default=-)
  - ABA0505_TRANS_REF_NO (CHAR(16), nullable=False, default=-)
  - ABA0505_AMT_APPLIED (NUMBER(13,0), nullable=True, default=-)
  - ABA0505_CLEAN_PRICE (NUMBER(7,4), nullable=True, default=-)
  - ABA0505_DIRTY_PRICE (NUMBER(7,4), nullable=True, default=-)
  - ABA0505_AMT_ALLOTED (NUMBER(13,0), nullable=True, default=-)
  - ABA0505_ALLOT_STATUS (CHAR(1), nullable=True, default=-)
  - ABA0505_EXG_SEC_CODE (CHAR(8), nullable=True, default=-)
  - ABA0505_EXG_NOMINAL_AMT (NUMBER(13,0), nullable=True, default=-)
  - ABA0505_EXG_CLEAN_PRICE (NUMBER(7,4), nullable=True, default=-)
  - ABA0505_EXG_DIRTY_PRICE (NUMBER(7,4), nullable=True, default=-)
  - ABA0505_REPO_RATE (NUMBER(7,4), nullable=True, default=-)
  - ABA0505_REPO_FEE (NUMBER(13,2), nullable=True, default=-)
  - ABA0505_AUCTION_DT (DATE, nullable=True, default=-)
  - ABA0505_UPDATED_DT (TIMESTAMP(3), nullable=True, default=-)
  - ABA0505_HAIRCUT_CLEAN_PRICE (NUMBER(7,4), nullable=True, default=-)
  - ABA0505_HAIRCUT_DIRTY_PRICE (NUMBER(7,4), nullable=True, default=-)
  - ABA0505_EXG_HC_CLEAN_PRICE (NUMBER(7,4), nullable=True, default=-)
  - ABA0505_EXG_HC_DIRTY_PRICE (NUMBER(7,4), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0505_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0505_BANK_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0505_SEQ_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0505_TRANS_REF_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0505_AMT_APPLIED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0505_CLEAN_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0505_DIRTY_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0505_AMT_ALLOTED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0505_ALLOT_STATUS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0505_EXG_SEC_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0505_EXG_NOMINAL_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0505_EXG_CLEAN_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0505_EXG_DIRTY_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0505_REPO_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0505_REPO_FEE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0505_AUCTION_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0505_UPDATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0505_HAIRCUT_CLEAN_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0505_HAIRCUT_DIRTY_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0505_EXG_HC_CLEAN_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0505_EXG_HC_DIRTY_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-075
_For source table: `ABA0506_SYSTEM_PARM`_

```
Comprehend every column on `MS9ABA.ABA0506_SYSTEM_PARM` (ERF). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0506_CUT_OFF_TIME (DATE, nullable=True, default=-)
  - ABA0506_VIEW_RESULTS (CHAR(1), nullable=True, default=N)
  - ABA0506_CUTOFF_IND (CHAR(1), nullable=False, default=N)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0506_CUT_OFF_TIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0506_VIEW_RESULTS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0506_CUTOFF_IND:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-076
_For source table: `ABA0507_SPLIT_BIDS`_

```
Comprehend every column on `MS9ABA.ABA0507_SPLIT_BIDS` (ERF). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0507_TRANS_REF_NO (CHAR(16), nullable=False, default=-)
  - ABA0507_SEQ_NO (CHAR(5), nullable=False, default=-)
  - ABA0507_UNSUCCESS_AMT (NUMBER(13,0), nullable=True, default=-)
  - ABA0507_AUCTION_DT (DATE, nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0507_TRANS_REF_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0507_SEQ_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0507_UNSUCCESS_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0507_AUCTION_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-077
_For source table: `ABA0601_ENCRYPTED_REPO_TRANS`_

```
Comprehend every column on `MS9ABA.ABA0601_ENCRYPTED_REPO_TRANS` (ERF). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0601_BANK_CODE (CHAR(4), nullable=False, default=-)
  - ABA0601_TRANS_REF_NO (CHAR(16), nullable=False, default=-)
  - ABA0601_ENCRYPTED_TRANSACTION (CLOB, nullable=True, default=-)
  - ABA0601_CHECKSUM (VARCHAR2(512), nullable=True, default=-)
  - ABA0601_STATUS_FLAG (CHAR(1), nullable=True, default=I)
  - ABA0601_UPDATED_DT (DATE, nullable=True, default=-)
  - ABA0601_RECEIVED_DT (DATE, nullable=False, default=-)
  - ABA0601_WITHDRAWN_DT (DATE, nullable=True, default=-)
  - ABA0601_WITHDRAWN_BY (VARCHAR2(8), nullable=True, default=-)
  - ABA0601_SUBMITTED_BY (VARCHAR2(8), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0601_BANK_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0601_TRANS_REF_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0601_ENCRYPTED_TRANSACTION:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0601_CHECKSUM:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0601_STATUS_FLAG:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0601_UPDATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0601_RECEIVED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0601_WITHDRAWN_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0601_WITHDRAWN_BY:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0601_SUBMITTED_BY:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-078
_For source table: `ABA0603_OPEN_ISSUES`_

```
Comprehend every column on `MS9ABA.ABA0603_OPEN_ISSUES` (ERF). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0603_SECURITY_CODE (CHAR(8), nullable=False, default=-)
  - ABA0603_VOIDED (CHAR(1), nullable=True, default=N)
  - ABA0603_OPENED_DT (DATE, nullable=False, default=-)
  - ABA0603_UPDATED_DT (DATE, nullable=False, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0603_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0603_VOIDED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0603_OPENED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0603_UPDATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-079
_For source table: `ABA0605_TRADE_DETAILS`_

```
Comprehend every column on `MS9ABA.ABA0605_TRADE_DETAILS` (ERF). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0605_SECURITY_CODE (CHAR(8), nullable=False, default=-)
  - ABA0605_BANK_CODE (CHAR(4), nullable=False, default=-)
  - ABA0605_SEQ_NO (CHAR(5), nullable=False, default=-)
  - ABA0605_TRANS_REF_NO (CHAR(16), nullable=False, default=-)
  - ABA0605_AMT_APPLIED (NUMBER(13,0), nullable=True, default=-)
  - ABA0605_AMT_ALLOTTED (NUMBER(13,0), nullable=True, default=-)
  - ABA0605_CLEAN_PRICE (NUMBER(7,4), nullable=True, default=-)
  - ABA0605_HAIRCUT_CLEAN_PRICE (NUMBER(7,4), nullable=True, default=-)
  - ABA0605_DIRTY_PRICE (NUMBER(7,4), nullable=True, default=-)
  - ABA0605_HAIRCUT_DIRTY_PRICE (NUMBER(7,4), nullable=True, default=-)
  - ABA0605_LIMIT_IND (CHAR(1), nullable=True, default=-)
  - ABA0605_EXG_SEC_CODE (CHAR(8), nullable=True, default=-)
  - ABA0605_EXG_NOMINAL_AMT (NUMBER(13,0), nullable=True, default=-)
  - ABA0605_EXG_CLEAN_PRICE (NUMBER(7,4), nullable=True, default=-)
  - ABA0605_EXG_HC_CLEAN_PRICE (NUMBER(7,4), nullable=True, default=-)
  - ABA0605_EXG_DIRTY_PRICE (NUMBER(7,4), nullable=True, default=-)
  - ABA0605_EXG_HC_DIRTY_PRICE (NUMBER(7,4), nullable=True, default=-)
  - ABA0605_REPO_RATE (NUMBER(7,4), nullable=True, default=-)
  - ABA0605_REPO_FEE (NUMBER(13,2), nullable=True, default=-)
  - ABA0605_S_DURATION (NUMBER(7,4), nullable=True, default=-)
  - ABA0605_G_DURATION (NUMBER(7,4), nullable=True, default=-)
  - ABA0605_S_DOLLAR_DURATION (NUMBER(20,2), nullable=True, default=-)
  - ABA0605_G_DOLLAR_DURATION (NUMBER(20,2), nullable=True, default=-)
  - ABA0605_NET_CASH (NUMBER(20,2), nullable=True, default=-)
  - ABA0605_STATUS_FLAG (CHAR(1), nullable=True, default=N)
  - ABA0605_RECEIVED_DT (DATE, nullable=True, default=-)
  - ABA0605_UPDATED_DT (TIMESTAMP(3), nullable=True, default=-)
  - ABA0605_FMBS_REF_NO (CHAR(10), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0605_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_BANK_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_SEQ_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_TRANS_REF_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_AMT_APPLIED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_AMT_ALLOTTED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_CLEAN_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_HAIRCUT_CLEAN_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_DIRTY_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_HAIRCUT_DIRTY_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_LIMIT_IND:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_EXG_SEC_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_EXG_NOMINAL_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_EXG_CLEAN_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_EXG_HC_CLEAN_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_EXG_DIRTY_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_EXG_HC_DIRTY_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_REPO_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_REPO_FEE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_S_DURATION:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_G_DURATION:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_S_DOLLAR_DURATION:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_G_DOLLAR_DURATION:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_NET_CASH:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_STATUS_FLAG:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_RECEIVED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_UPDATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0605_FMBS_REF_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-080
_For source table: `ABA0606_SYSTEM_PARM`_

```
Comprehend every column on `MS9ABA.ABA0606_SYSTEM_PARM` (ERF). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0606_CUT_OFF_TIME (DATE, nullable=True, default=-)
  - ABA0606_VIEW_RESULTS (CHAR(1), nullable=True, default=N)
  - ABA0606_MIN_LIMIT_PER_ISSUE (NUMBER(20,0), nullable=False, default=1000000)
  - ABA0606_MAX_LIMIT_PER_ISSUE (NUMBER(20,0), nullable=False, default=50000000)
  - ABA0606_MAX_LIMIT_ALL_ISSUE (NUMBER(20,0), nullable=False, default=500000000)
  - ABA0606_MAX_LIMIT_ALL_INFRA (NUMBER(20,0), nullable=False, default=500000000)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0606_CUT_OFF_TIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0606_VIEW_RESULTS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0606_MIN_LIMIT_PER_ISSUE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0606_MAX_LIMIT_PER_ISSUE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0606_MAX_LIMIT_ALL_ISSUE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0606_MAX_LIMIT_ALL_INFRA:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-081
_For source table: `ABA0608_LEGAL_LOG`_

```
Comprehend every column on `MS9ABA.ABA0608_LEGAL_LOG` (ERF). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0608_BANK_CODE (CHAR(4), nullable=False, default=-)
  - ABA0608_RECEIVED_DT (DATE, nullable=False, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0608_BANK_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0608_RECEIVED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-082
_For source table: `ABA0610_REJECTED_ISSUES`_

```
Comprehend every column on `MS9ABA.ABA0610_REJECTED_ISSUES` (ERF). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - ABA0610_SECURITY_CODE (CHAR(8), nullable=False, default=-)
  - ABA0610_ISSUE_DATE (DATE, nullable=True, default=-)
  - ABA0610_MATURITY_DATE (DATE, nullable=True, default=-)
  - ABA0610_UPDATED_DT (DATE, nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    ABA0610_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0610_ISSUE_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0610_MATURITY_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    ABA0610_UPDATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-083
_For source table: `AQA0003_USER`_

```
Comprehend every column on `MS9ABA.AQA0003_USER` (eApps). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - AQA0003_USER_ID (VARCHAR2(20), nullable=True, default=-)
  - AQA0003_LEVEL (NUMBER(3,0), nullable=True, default=0)
  - AQA0003_USER_LAST_LOGIN (DATE, nullable=True, default=SYSDATE)
  - AQA0003_USER_ACCESS_CHANGE (DATE, nullable=True, default=SYSDATE)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    AQA0003_USER_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0003_LEVEL:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0003_USER_LAST_LOGIN:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0003_USER_ACCESS_CHANGE:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-084
_For source table: `AQA0004_LEVEL_ACTION`_

```
Comprehend every column on `MS9ABA.AQA0004_LEVEL_ACTION` (eApps). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - AQA0004_LEVEL (NUMBER(3,0), nullable=True, default=-)
  - AQA0004_MODULE (VARCHAR2(100), nullable=True, default=-)
  - AQA0004_ACTION (VARCHAR2(50), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    AQA0004_LEVEL:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0004_MODULE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0004_ACTION:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-085
_For source table: `AQA0010_ACTION_REF`_

```
Comprehend every column on `MS9ABA.AQA0010_ACTION_REF` (eApps). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - AQA0010_MODULE (VARCHAR2(100), nullable=True, default=-)
  - AQA0010_ACTION (VARCHAR2(50), nullable=True, default=-)
  - AQA0010_DESC (VARCHAR2(300), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    AQA0010_MODULE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0010_ACTION:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0010_DESC:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-086
_For source table: `AQA0012_SYNDICATION_INS_RET_DT`_

```
Comprehend every column on `MS9ABA.AQA0012_SYNDICATION_INS_RET_DT` (Syndication). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - AQA0012_SECURITY_CODE (CHAR(8), nullable=True, default=-)
  - AQA0012_ISSUE_NO (VARCHAR2(1), nullable=True, default=-)
  - AQA0012_FORM_NO (NUMBER(6,0), nullable=True, default=-)
  - AQA0012_ISIN_CODE (CHAR(12), nullable=True, default=-)
  - AQA0012_CUST_BANK_CODE (NUMBER(4,0), nullable=True, default=-)
  - AQA0012_CUSTODY_CD (CHAR(3), nullable=True, default=-)
  - AQA0012_APPLIED_AMT (NUMBER(11,0), nullable=True, default=-)
  - AQA0012_ALLOTED_AMT (NUMBER(11,0), nullable=True, default=-)
  - AQA0012_SETTLEMENT_AMT (NUMBER(15,2), nullable=True, default=-)
  - AQA0012_FILE_TYPE (VARCHAR2(3), nullable=True, default=-)
  - AQA0012_SYS_COMPUTED_ACCR_INT (NUMBER(11,2), nullable=True, default=-)
  - AQA0012_SYS_COMPUTED_SETT_AMT (NUMBER(15,2), nullable=True, default=-)
  - AQA0012_SETTLEMENT_AMT_MATCHES (VARCHAR2(3), nullable=True, default=-)
  - AQA0012_USERID (VARCHAR2(20), nullable=True, default=-)
  - AQA0012_UPLOADED_DATE (DATE, nullable=True, default=SYSDATE)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    AQA0012_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0012_ISSUE_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0012_FORM_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0012_ISIN_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0012_CUST_BANK_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0012_CUSTODY_CD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0012_APPLIED_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0012_ALLOTED_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0012_SETTLEMENT_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0012_FILE_TYPE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0012_SYS_COMPUTED_ACCR_INT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0012_SYS_COMPUTED_SETT_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0012_SETTLEMENT_AMT_MATCHES:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0012_USERID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0012_UPLOADED_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-087
_For source table: `AQA0013_SYNDICATION_COUPON_DT`_

```
Comprehend every column on `MS9ABA.AQA0013_SYNDICATION_COUPON_DT` (Syndication). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - AQA0013_SECURITY_CODE (CHAR(8), nullable=True, default=-)
  - AQA0013_ISSUE_NO (VARCHAR2(1), nullable=True, default=-)
  - AQA0013_ISIN_CODE (CHAR(12), nullable=True, default=-)
  - AQA0013_COUPON_RATE (NUMBER(7,4), nullable=True, default=-)
  - AQA0013_COY_PRICE (NUMBER(7,4), nullable=True, default=-)
  - AQA0013_CUTOFF_YIELD (NUMBER(5,2), nullable=True, default=-)
  - AQA0013_BID_TO_COVER (NUMBER(5,2), nullable=True, default=-)
  - AQA0013_SYS_COMPUTED_ACCR_INT (NUMBER(7,4), nullable=True, default=-)
  - AQA0013_SYS_COMPUTED_COY_PRICE (NUMBER(7,4), nullable=True, default=-)
  - AQA0013_COY_PRICE_MATCHES (VARCHAR2(3), nullable=True, default=-)
  - AQA0013_TOTAL_ALLOTED_AMT (NUMBER(13,0), nullable=True, default=-)
  - AQA0013_ISSUE_SIZE_MATCHES (VARCHAR2(3), nullable=True, default=-)
  - AQA0013_USERID (VARCHAR2(20), nullable=True, default=-)
  - AQA0013_UPLOADED_DATE (DATE, nullable=True, default=SYSDATE)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    AQA0013_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0013_ISSUE_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0013_ISIN_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0013_COUPON_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0013_COY_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0013_CUTOFF_YIELD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0013_BID_TO_COVER:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0013_SYS_COMPUTED_ACCR_INT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0013_SYS_COMPUTED_COY_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0013_COY_PRICE_MATCHES:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0013_TOTAL_ALLOTED_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0013_ISSUE_SIZE_MATCHES:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0013_USERID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0013_UPLOADED_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-088
_For source table: `AQA0014_SYNDICATION_RPT_COUNT`_

```
Comprehend every column on `MS9ABA.AQA0014_SYNDICATION_RPT_COUNT` (Syndication). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - AQA0014_DATE (DATE, nullable=True, default=-)
  - AQA0014_COUNT (NUMBER(3,0), nullable=True, default=-)
  - AQA0014_UPDATED_TIME (DATE, nullable=True, default=SYSDATE)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    AQA0014_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0014_COUNT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0014_UPDATED_TIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-089
_For source table: `AQA0015_COPY_SYND_SEC_MAST_IND`_

```
Comprehend every column on `MS9ABA.AQA0015_COPY_SYND_SEC_MAST_IND` (Syndication). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - AQA0015_DATA_DATE (DATE, nullable=True, default=-)
  - AQA0015_COPIED_INDICATOR (CHAR(1), nullable=True, default=-)
  - AQA0015_UPDATED_TIME (DATE, nullable=True, default=SYSDATE)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    AQA0015_DATA_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0015_COPIED_INDICATOR:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0015_UPDATED_TIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-090
_For source table: `AQA0016_SYNDICATED_SEC_MAST_DT`_

```
Comprehend every column on `MS9ABA.AQA0016_SYNDICATED_SEC_MAST_DT` (Syndication). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - AQA0016_SECURITY_CODE (CHAR(8), nullable=True, default=-)
  - AQA0016_ISSUE_NO (VARCHAR2(1), nullable=True, default=-)
  - AQA0016_ISIN_CODE (CHAR(12), nullable=True, default=-)
  - AQA0016_QTY_APP_NONCOMP (NUMBER(13,0), nullable=True, default=-)
  - AQA0016_NC_QTY_ALLOT (NUMBER(13,0), nullable=True, default=-)
  - AQA0016_NC_PERCENT (NUMBER(5,2), nullable=True, default=-)
  - AQA0016_QTY_APPLIED (NUMBER(13,0), nullable=True, default=-)
  - AQA0016_QTY_APP_COMP (NUMBER(13,0), nullable=True, default=-)
  - AQA0016_MAS_ALLOTTED (NUMBER(13,0), nullable=True, default=-)
  - AQA0016_PERCENT_SUB (NUMBER(5,2), nullable=True, default=-)
  - AQA0016_PERCENT_COY (NUMBER(5,2), nullable=True, default=-)
  - AQA0016_INTEREST_RATE (NUMBER(7,4), nullable=True, default=-)
  - AQA0016_CUTOFF_YIELD (NUMBER(5,2), nullable=True, default=-)
  - AQA0016_CLOSING_PRICE (NUMBER(7,4), nullable=True, default=-)
  - AQA0016_COY_PRICE (NUMBER(7,4), nullable=True, default=-)
  - AQA0016_AVE_YIELD (NUMBER(5,2), nullable=True, default=-)
  - AQA0016_AVE_PRICE (NUMBER(7,4), nullable=True, default=-)
  - AQA0016_MEDIAN_YIELD (NUMBER(5,2), nullable=True, default=-)
  - AQA0016_MEDIAN_PRICE (NUMBER(7,4), nullable=True, default=-)
  - AQA0016_ACCRUED_INT (NUMBER(7,4), nullable=True, default=-)
  - AQA0016_UPDATED_TIME (DATE, nullable=True, default=SYSDATE)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    AQA0016_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0016_ISSUE_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0016_ISIN_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0016_QTY_APP_NONCOMP:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0016_NC_QTY_ALLOT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0016_NC_PERCENT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0016_QTY_APPLIED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0016_QTY_APP_COMP:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0016_MAS_ALLOTTED:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0016_PERCENT_SUB:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0016_PERCENT_COY:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0016_INTEREST_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0016_CUTOFF_YIELD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0016_CLOSING_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0016_COY_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0016_AVE_YIELD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0016_AVE_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0016_MEDIAN_YIELD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0016_MEDIAN_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0016_ACCRUED_INT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0016_UPDATED_TIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-091
_For source table: `AQA0101_REPO_TRANS`_

```
Comprehend every column on `MS9ABA.AQA0101_REPO_TRANS` (ERF). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - AQA0101_BANK_CODE (CHAR(4), nullable=True, default=-)
  - AQA0101_SEQ_NO (CHAR(5), nullable=True, default=-)
  - AQA0101_TRANS_REF_NO (CHAR(16), nullable=True, default=-)
  - AQA0101_REQ_SEC_CODE (CHAR(8), nullable=True, default=-)
  - AQA0101_REQ_NOMINAL_AMT (NUMBER(13,0), nullable=True, default=-)
  - AQA0101_NOMINAL_AMT_ALLOT (NUMBER(13,0), nullable=True, default=-)
  - AQA0101_REQ_DIRTY_PRICE (NUMBER(7,4), nullable=True, default=-)
  - AQA0101_REQ_CLEAN_PRICE (NUMBER(7,4), nullable=True, default=-)
  - AQA0101_EXG_SEC_CODE (CHAR(8), nullable=True, default=-)
  - AQA0101_EXG_NOMINAL_AMT (NUMBER(13,0), nullable=True, default=-)
  - AQA0101_EXG_DIRTY_PRICE (NUMBER(7,4), nullable=True, default=-)
  - AQA0101_EXG_CLEAN_PRICE (NUMBER(7,4), nullable=True, default=-)
  - AQA0101_REPO_RATE (NUMBER(7,4), nullable=True, default=-)
  - AQA0101_REPO_FEE (NUMBER(13,2), nullable=True, default=-)
  - AQA0101_HAIRCUT (NUMBER(7,4), nullable=True, default=-)
  - AQA0101_STATUS_FLAG (CHAR(1), nullable=True, default=N)
  - AQA0101_LIMIT_IND (CHAR(1), nullable=True, default=-)
  - AQA0101_RECEIVED_DT (DATE, nullable=True, default=-)
  - AQA0101_REQ_HC_CLEAN_PRICE (NUMBER(7,4), nullable=True, default=-)
  - AQA0101_REQ_HC_DIRTY_PRICE (NUMBER(7,4), nullable=True, default=-)
  - AQA0101_EXG_HC_CLEAN_PRICE (NUMBER(7,4), nullable=True, default=-)
  - AQA0101_EXG_HC_DIRTY_PRICE (NUMBER(7,4), nullable=True, default=-)
  - AQA0101_UPDATED_DT (TIMESTAMP(3), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    AQA0101_BANK_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0101_SEQ_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0101_TRANS_REF_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0101_REQ_SEC_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0101_REQ_NOMINAL_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0101_NOMINAL_AMT_ALLOT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0101_REQ_DIRTY_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0101_REQ_CLEAN_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0101_EXG_SEC_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0101_EXG_NOMINAL_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0101_EXG_DIRTY_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0101_EXG_CLEAN_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0101_REPO_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0101_REPO_FEE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0101_HAIRCUT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0101_STATUS_FLAG:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0101_LIMIT_IND:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0101_RECEIVED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0101_REQ_HC_CLEAN_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0101_REQ_HC_DIRTY_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0101_EXG_HC_CLEAN_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0101_EXG_HC_DIRTY_PRICE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0101_UPDATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-092
_For source table: `AQA0102_USER`_

```
Comprehend every column on `MS9ABA.AQA0102_USER` (ERF). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - AQA0102_USER_ID (VARCHAR2(20), nullable=True, default=-)
  - AQA0102_LEVEL (NUMBER(1,0), nullable=True, default=-)
  - AQA0102_USER_LAST_LOGIN (DATE, nullable=True, default=-)
  - AQA0102_USER_LVL_CHANGE (DATE, nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    AQA0102_USER_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0102_LEVEL:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0102_USER_LAST_LOGIN:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0102_USER_LVL_CHANGE:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-093
_For source table: `AQA0103_PRIVATE_KEY`_

```
Comprehend every column on `MS9ABA.AQA0103_PRIVATE_KEY` (ERF). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - AQA0103_PRIVATE_KEY (VARCHAR2(4000), nullable=True, default=-)
  - AQA0103_UPDATED_DT (DATE, nullable=True, default=-)
  - AQA0103_CURRENT_KEY (VARCHAR2(1), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    AQA0103_PRIVATE_KEY:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0103_UPDATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0103_CURRENT_KEY:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-094
_For source table: `AQA0104_ERF_SYSTEM_PARM`_

```
Comprehend every column on `MS9ABA.AQA0104_ERF_SYSTEM_PARM` (ERF). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - AQA0104_DEFAULT_CUT_OFF_TIME (DATE, nullable=True, default=-)
  - AQA0104_UPDATED_DT (DATE, nullable=True, default=-)
  - AQA0104_MIN_LIMIT_PER_ISSUE (NUMBER(20,0), nullable=True, default=1000000)
  - AQA0104_MAX_LIMIT_PER_ISSUE (NUMBER(20,0), nullable=True, default=50000000)
  - AQA0104_MAX_LIMIT_ALL_ISSUE (NUMBER(20,0), nullable=True, default=500000000)
  - AQA0104_MAX_LIMIT_ALL_INFRA (NUMBER(20,0), nullable=True, default=500000000)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    AQA0104_DEFAULT_CUT_OFF_TIME:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0104_UPDATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0104_MIN_LIMIT_PER_ISSUE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0104_MAX_LIMIT_PER_ISSUE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0104_MAX_LIMIT_ALL_ISSUE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0104_MAX_LIMIT_ALL_INFRA:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-095
_For source table: `AQA0105_ERF_CYCLE`_

```
Comprehend every column on `MS9ABA.AQA0105_ERF_CYCLE` (ERF). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - AQA0105_CYCLE_DATE (DATE, nullable=True, default=-)
  - AQA0105_PRICE_DATE (DATE, nullable=True, default=-)
  - AQA0105_UPDATED_DT (DATE, nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    AQA0105_CYCLE_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0105_PRICE_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0105_UPDATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-096
_For source table: `AQA0107_ERF_AUDIT_LOG`_

```
Comprehend every column on `MS9ABA.AQA0107_ERF_AUDIT_LOG` (ERF). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - AQA0107_LOG_CD (NUMBER(2,0), nullable=True, default=-)
  - AQA0107_USER_ID (VARCHAR2(20), nullable=True, default=-)
  - AQA0107_REMARKS (VARCHAR2(100), nullable=True, default=-)
  - AQA0107_UPDATED_DT (DATE, nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    AQA0107_LOG_CD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0107_USER_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0107_REMARKS:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0107_UPDATED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-097
_For source table: `AQA0108_ERF_LOG_DETAIL`_

```
Comprehend every column on `MS9ABA.AQA0108_ERF_LOG_DETAIL` (ERF). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - AQA0108_LOG_CD (NUMBER(2,0), nullable=True, default=-)
  - AQA0108_LOG_DESC (VARCHAR2(50), nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    AQA0108_LOG_CD:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0108_LOG_DESC:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-098
_For source table: `AQA0111_CANCEL_TRADE`_

```
Comprehend every column on `MS9ABA.AQA0111_CANCEL_TRADE` (ERF). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - AQA0111_SECURITY_CODE (CHAR(8), nullable=True, default=-)
  - AQA0111_BANK_CODE (CHAR(4), nullable=True, default=-)
  - AQA0111_SEQ_NO (CHAR(5), nullable=True, default=-)
  - AQA0111_TRANS_REF_NO (CHAR(16), nullable=True, default=-)
  - AQA0111_EXG_SEC_CODE (CHAR(8), nullable=True, default=-)
  - AQA0111_ALLOTTED_AMT (NUMBER(13,0), nullable=True, default=-)
  - AQA0111_RECEIVED_DT (DATE, nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    AQA0111_SECURITY_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0111_BANK_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0111_SEQ_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0111_TRANS_REF_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0111_EXG_SEC_CODE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0111_ALLOTTED_AMT:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0111_RECEIVED_DT:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-099
_For source table: `AQA0112_DUR_RATE`_

```
Comprehend every column on `MS9ABA.AQA0112_DUR_RATE` (ERF). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - AQA0112_REF_NO (CHAR(10), nullable=True, default=-)
  - AQA0112_LOW_DURATION (NUMBER(7,4), nullable=True, default=-)
  - AQA0112_HIGH_DURATION (NUMBER(7,4), nullable=True, default=-)
  - AQA0112_REPO_RATE (NUMBER(7,4), nullable=True, default=-)
  - AQA0112_DATE_CHANGE (DATE, nullable=True, default=-)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    AQA0112_REF_NO:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0112_LOW_DURATION:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0112_HIGH_DURATION:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0112_REPO_RATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0112_DATE_CHANGE:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QC-LEG-100
_For source table: `AQA0113_USER_SESSION`_

```
Comprehend every column on `MS9ABA.AQA0113_USER_SESSION` (ERF). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - AQA0113_USER_ID (VARCHAR2(20), nullable=True, default=-)
  - AQA0113_SESSION_ID (VARCHAR2(200), nullable=True, default=-)
  - AQA0113_LAST_LOGIN_DATE (TIMESTAMP(6), nullable=True, default=CURRENT_TIMESTAMP)

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    AQA0113_USER_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0113_SESSION_ID:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    AQA0113_LAST_LOGIN_DATE:
      explanation: "..."
      possible_values: "..."
      notes: "..."

```

### QD-001
_For source table: `ABA0008_STAGE_SECURITY_MASTER`_

```
Source table `MNETD.ABA0008_STAGE_SECURITY_MASTER` (domain=eApps, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-002
_For source table: `ABA0020_STAGING_BANK_MASTER`_

```
Source table `MNETD.ABA0020_STAGING_BANK_MASTER` (domain=eApps, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-003
_For source table: `ABA0022_NON_BENCHMARK`_

```
Source table `MNETD.ABA0022_NON_BENCHMARK` (domain=eApps, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-004
_For source table: `ABA0101_SB_SECURITY_MASTER`_

```
Source table `MNETD.ABA0101_SB_SECURITY_MASTER` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-005
_For source table: `ABA0108_SB_STAGE_SEC_MASTER`_

```
Source table `MNETD.ABA0108_SB_STAGE_SEC_MASTER` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-006
_For source table: `ABA0110_SB_ANNOUNCE_TEXT`_

```
Source table `MNETD.ABA0110_SB_ANNOUNCE_TEXT` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-007
_For source table: `ABA0121_SB_ISSUE_CALENDAR`_

```
Source table `MNETD.ABA0121_SB_ISSUE_CALENDAR` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-008
_For source table: `ABA0124_SB_COUPON_RATE_DETAILS`_

```
Source table `MNETD.ABA0124_SB_COUPON_RATE_DETAILS` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-009
_For source table: `ABA0125_SB_STAGE_COUPON_RATE`_

```
Source table `MNETD.ABA0125_SB_STAGE_COUPON_RATE` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-010
_For source table: `ABA0126_SB_REDEMPTION_RESULT`_

```
Source table `MNETD.ABA0126_SB_REDEMPTION_RESULT` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-011
_For source table: `ABA0127_SB_SYSTEM_CONFIG`_

```
Source table `MNETD.ABA0127_SB_SYSTEM_CONFIG` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-012
_For source table: `ABA0212_SB_REPORT`_

```
Source table `PRI1.ABA0212_SB_REPORT` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-013
_For source table: `ABA0213_SB_REPORT_FILE`_

```
Source table `PRI1.ABA0213_SB_REPORT_FILE` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-014
_For source table: `ABA0214_SB_CD_FILE_TYPE`_

```
Source table `MNETD & PRI1.ABA0214_SB_CD_FILE_TYPE` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-015
_For source table: `ABA0215_SB_CD_FILE_STATUS`_

```
Source table `PRI1.ABA0215_SB_CD_FILE_STATUS` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-016
_For source table: `ABA0216_SB_CD_RECORD_STATUS`_

```
Source table `PRI1.ABA0216_SB_CD_RECORD_STATUS` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-017
_For source table: `ABA0217_SB_CD_NATION`_

```
Source table `PRI1.ABA0217_SB_CD_NATION` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-018
_For source table: `ABA0218_SB_CD_NATION_CTY`_

```
Source table `PRI1.ABA0218_SB_CD_NATION_CTY` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-019
_For source table: `ABA0219_SB_CD_FILE_ERROR_DESC`_

```
Source table `PRI1.ABA0219_SB_CD_FILE_ERROR_DESC` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-020
_For source table: `ABA0220_SB_CD_RECORD_ERR_DESC`_

```
Source table `PRI1.ABA0220_SB_CD_RECORD_ERR_DESC` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-021
_For source table: `ABA0221_SB_CD_BATCHJOB_STATUS`_

```
Source table `PRI1.ABA0221_SB_CD_BATCHJOB_STATUS` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-022
_For source table: `ABA0222_SB_ORG`_

```
Source table `MNETD & PRI1.ABA0222_SB_ORG` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-023
_For source table: `ABA0223_SB_APPLICANT`_

```
Source table `PRI1.ABA0223_SB_APPLICANT` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-024
_For source table: `ABA0223_SB_PGP_CONFIG`_

```
Source table `MNETD.ABA0223_SB_PGP_CONFIG` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-025
_For source table: `ABA0224_SB_SUBSCRIPT`_

```
Source table `PRI1.ABA0224_SB_SUBSCRIPT` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-026
_For source table: `ABA0225_SB_SUBSCRIPT_DT`_

```
Source table `PRI1.ABA0225_SB_SUBSCRIPT_DT` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-027
_For source table: `ABA0226_SB_SUBSCRIPT_DT_ERR`_

```
Source table `PRI1.ABA0226_SB_SUBSCRIPT_DT_ERR` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-028
_For source table: `ABA0227_SB_REDEMPTION`_

```
Source table `PRI1.ABA0227_SB_REDEMPTION` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-029
_For source table: `ABA0228_SB_REDEMPTION_DT`_

```
Source table `PRI1.ABA0228_SB_REDEMPTION_DT` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-030
_For source table: `ABA0229_SB_REDEMPTION_DT_ERR`_

```
Source table `PRI1.ABA0229_SB_REDEMPTION_DT_ERR` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-031
_For source table: `ABA0230_SB_HLD_INFO`_

```
Source table `PRI1.ABA0230_SB_HLD_INFO` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-032
_For source table: `ABA0231_SB_HLD_INFO_DT`_

```
Source table `PRI1.ABA0231_SB_HLD_INFO_DT` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-033
_For source table: `ABA0232_SB_ALLOTMENT_RESULT`_

```
Source table `PRI1.ABA0232_SB_ALLOTMENT_RESULT` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-034
_For source table: `ABA0233_SB_BATCH_JOB`_

```
Source table `PRI1.ABA0233_SB_BATCH_JOB` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-035
_For source table: `ABA0234_SB_BATCH_JOB_EXECUTION`_

```
Source table `PRI1.ABA0234_SB_BATCH_JOB_EXECUTION` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-036
_For source table: `ABA0235_SB_SUBMISSION_SUMMARY`_

```
Source table `PRI1.ABA0235_SB_SUBMISSION_SUMMARY` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-037
_For source table: `ABA0236_SB_HLD_INFO_DT_ERR`_

```
Source table `PRI1.ABA0236_SB_HLD_INFO_DT_ERR` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-038
_For source table: `ABA0237_SB_USER`_

```
Source table `PRI1.ABA0237_SB_USER` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-039
_For source table: `ABA0238_SB_LEVEL_ACTION`_

```
Source table `PRI1.ABA0238_SB_LEVEL_ACTION` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-040
_For source table: `ABA0239_SB_ACTION_REF`_

```
Source table `PRI1.ABA0239_SB_ACTION_REF` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-041
_For source table: `ABA0240_SB_CD_SUBMISSION_TYPE`_

```
Source table `PRI1.ABA0240_SB_CD_SUBMISSION_TYPE` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-042
_For source table: `ABA0241_SB_RESULT_FILE`_

```
Source table `PRI1.ABA0241_SB_RESULT_FILE` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-043
_For source table: `ABA0250_SB_AUDIT_LOG`_

```
Source table `PRI1.ABA0250_SB_AUDIT_LOG` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-044
_For source table: `ABA0251_SB_CONT_MAKE_CHECK`_

```
Source table `PRI1.ABA0251_SB_CONT_MAKE_CHECK` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-045
_For source table: `ABA0252_SB_SYSCONF_MAKE_CHECK`_

```
Source table `PRI1.ABA0252_SB_SYSCONF_MAKE_CHECK` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-046
_For source table: `ABA0280_SB_TEMP_APP_SUB_DT`_

```
Source table `PRI1.ABA0280_SB_TEMP_APP_SUB_DT` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-047
_For source table: `ABA0281_SB_TEMP_HOLDING`_

```
Source table `PRI1.ABA0281_SB_TEMP_HOLDING` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-048
_For source table: `ABA0282_SB_CD_APPLICATION_TYPE`_

```
Source table `PRI1.ABA0282_SB_CD_APPLICATION_TYPE` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-049
_For source table: `ABA0283_SB_COUPON_RESULT_FILE`_

```
Source table `PRI1.ABA0283_SB_COUPON_RESULT_FILE` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-050
_For source table: `ABA0284_SB_PORTAL_SYNC`_

```
Source table `PRI1.ABA0284_SB_PORTAL_SYNC` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-051
_For source table: `ABA0285_SB_USER_SESSION`_

```
Source table `PRI1.ABA0285_SB_USER_SESSION` (domain=SBA, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-052
_For source table: `AQA0012_SYNDICATION_INS_RET_DT`_

```
Source table `PRI1.AQA0012_SYNDICATION_INS_RET_DT` (domain=Syndication, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-053
_For source table: `AQA0013_SYNDICATION_COUPON_DT`_

```
Source table `PRI1.AQA0013_SYNDICATION_COUPON_DT` (domain=Syndication, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-054
_For source table: `AQA0014_SYNDICATION_RPT_COUNT`_

```
Source table `PRI1.AQA0014_SYNDICATION_RPT_COUNT` (domain=Syndication, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-055
_For source table: `AQA0015_COPY_SYND_SEC_MAST_IND`_

```
Source table `PRI1.AQA0015_COPY_SYND_SEC_MAST_IND` (domain=Syndication, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QD-056
_For source table: `AQA0016_SYNDICATED_SEC_MAST_DT`_

```
Source table `PRI1.AQA0016_SYNDICATED_SEC_MAST_DT` (domain=Syndication, wave=R1, draft=TBD).
Should this table migrate to OMEGA in v0.2 (R1)?
  - If YES: which target tables in cm.* / iss.* does it feed?
  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, interface-only, etc.).
Cite the OMEGA FSD or legacy SDS where this is established.
```

### QG-001
_MLOG database use-case_

```
What is the purpose of the legacy MLOG database / tables? Is it a log/audit store? Are there any operational dependencies on MLOG data post-OMEGA Go-Live? Specifically, does any R1 or R2 OMEGA module read or reference MLOG data?
```

### QG-002
_ABA0023_AUDIT_ACTION contents_

```
What does ABA0023_AUDIT_ACTION contain? What columns, what events does it log (insert/update/delete? schema changes? business actions?)? Retention period, row volume estimate. Is it consulted by any operational legacy report or job?
```

## OMEGA DB queries  (0 queries)

_No DB queries enqueued yet. Will populate after legacy-source channel surfaces FK ambiguities that need scale-validation._

## User direct  (0 questions)

_None at this time._

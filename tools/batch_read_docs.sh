#!/bin/bash
# Batch Document Reading Utility
# Processes all documents in a directory and creates text extracts

set -e

SCRIPT_DIR="$(dirname "$0")"
READ_DOC="$SCRIPT_DIR/read_doc.sh"

usage() {
    echo "Batch Document Reading Utility"
    echo ""
    echo "Usage: $0 <input_directory> <output_directory> [options]"
    echo ""
    echo "Options:"
    echo "  --info-only     Only generate file info report"
    echo "  --recursive     Process subdirectories"
    echo "  --extensions    Comma-separated list of extensions (default: docx,doc,pdf,xlsx,txt,md)"
    echo "  --help          Show this help"
    echo ""
    exit 1
}

# Main
INPUT_DIR=""
OUTPUT_DIR=""
INFO_ONLY=false
RECURSIVE=false
EXTENSIONS="docx,doc,pdf,xlsx,txt,md,rtf"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --info-only)
            INFO_ONLY=true
            shift
            ;;
        --recursive)
            RECURSIVE=true
            shift
            ;;
        --extensions)
            EXTENSIONS="$2"
            shift 2
            ;;
        --help|-h)
            usage
            ;;
        *)
            if [ -z "$INPUT_DIR" ]; then
                INPUT_DIR="$1"
            elif [ -z "$OUTPUT_DIR" ]; then
                OUTPUT_DIR="$1"
            fi
            shift
            ;;
    esac
done

if [ -z "$INPUT_DIR" ] || [ -z "$OUTPUT_DIR" ]; then
    usage
fi

if [ ! -d "$INPUT_DIR" ]; then
    echo "Error: Input directory not found: $INPUT_DIR"
    exit 1
fi

mkdir -p "$OUTPUT_DIR"

# Build find pattern
EXT_PATTERN=""
IFS=',' read -ra EXTS <<< "$EXTENSIONS"
for ext in "${EXTS[@]}"; do
    if [ -n "$EXT_PATTERN" ]; then
        EXT_PATTERN="$EXT_PATTERN -o"
    fi
    EXT_PATTERN="$EXT_PATTERN -name \"*.$ext\""
done

# Find files
if [ "$RECURSIVE" = true ]; then
    FIND_CMD="find \"$INPUT_DIR\" -type f \( $EXT_PATTERN \)"
else
    FIND_CMD="find \"$INPUT_DIR\" -maxdepth 1 -type f \( $EXT_PATTERN \)"
fi

# Generate report
REPORT_FILE="$OUTPUT_DIR/_file_inventory.txt"
echo "=========================================" > "$REPORT_FILE"
echo "DOCUMENT INVENTORY REPORT" >> "$REPORT_FILE"
echo "Generated: $(date)" >> "$REPORT_FILE"
echo "Input: $INPUT_DIR" >> "$REPORT_FILE"
echo "=========================================" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Process files
FILE_COUNT=0
PROCESSED=0
SKIPPED=0

echo "Scanning files..."
while IFS= read -r file; do
    ((FILE_COUNT++))

    filename=$(basename "$file")
    rel_path="${file#$INPUT_DIR/}"

    echo "" >> "$REPORT_FILE"
    echo "-------------------------------------------" >> "$REPORT_FILE"
    echo "[$FILE_COUNT] $rel_path" >> "$REPORT_FILE"

    # Get file info
    "$READ_DOC" "$file" --info 2>/dev/null >> "$REPORT_FILE" || echo "Error reading file" >> "$REPORT_FILE"

    if [ "$INFO_ONLY" = false ]; then
        # Create output filename
        safe_name=$(echo "$rel_path" | tr '/' '_' | sed 's/\.[^.]*$//')
        output_file="$OUTPUT_DIR/${safe_name}.txt"

        echo "Processing: $filename"
        if "$READ_DOC" "$file" --all > "$output_file" 2>/dev/null; then
            echo "  -> $output_file"
            ((PROCESSED++))
        else
            echo "  -> SKIPPED (error)"
            ((SKIPPED++))
            rm -f "$output_file"
        fi
    fi
done < <(eval $FIND_CMD 2>/dev/null)

echo "" >> "$REPORT_FILE"
echo "=========================================" >> "$REPORT_FILE"
echo "SUMMARY" >> "$REPORT_FILE"
echo "Total files found: $FILE_COUNT" >> "$REPORT_FILE"
if [ "$INFO_ONLY" = false ]; then
    echo "Successfully processed: $PROCESSED" >> "$REPORT_FILE"
    echo "Skipped/Failed: $SKIPPED" >> "$REPORT_FILE"
fi
echo "=========================================" >> "$REPORT_FILE"

echo ""
echo "========================================="
echo "BATCH PROCESSING COMPLETE"
echo "========================================="
echo "Total files: $FILE_COUNT"
if [ "$INFO_ONLY" = false ]; then
    echo "Processed: $PROCESSED"
    echo "Skipped: $SKIPPED"
fi
echo "Report: $REPORT_FILE"
echo "========================================="

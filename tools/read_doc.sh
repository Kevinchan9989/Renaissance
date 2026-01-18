#!/bin/bash
# Document Reading Utility for Claude
# Supports: .docx, .doc, .pdf, .xlsx, .txt, .md, .rtf
# Handles large files with chunking

set -e

# Configuration
MAX_LINES_PER_CHUNK=500
OUTPUT_DIR="/tmp/doc_reader_output"

# Colors for terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

usage() {
    echo "Document Reading Utility"
    echo ""
    echo "Usage: $0 <file_path> [options]"
    echo ""
    echo "Options:"
    echo "  --chunk <n>     Lines per chunk (default: 500)"
    echo "  --output <dir>  Output directory (default: /tmp/doc_reader_output)"
    echo "  --info          Show file info only, don't extract"
    echo "  --all           Output all content (no chunking)"
    echo "  --part <n>      Output only chunk n (1-indexed)"
    echo "  --help          Show this help"
    echo ""
    echo "Supported formats: .docx, .doc, .pdf, .xlsx, .txt, .md, .rtf"
    exit 1
}

# Get file extension
get_extension() {
    echo "${1##*.}" | tr '[:upper:]' '[:lower:]'
}

# Get file info
file_info() {
    local file="$1"
    local ext=$(get_extension "$file")
    local size=$(ls -lh "$file" | awk '{print $5}')
    local lines=0

    echo "=========================================="
    echo "FILE INFORMATION"
    echo "=========================================="
    echo "Path: $file"
    echo "Type: .$ext"
    echo "Size: $size"

    # Estimate lines based on file type
    case "$ext" in
        txt|md)
            lines=$(wc -l < "$file")
            ;;
        docx|doc|rtf)
            lines=$(textutil -convert txt -stdout "$file" 2>/dev/null | wc -l)
            ;;
        pdf)
            if command -v pdftotext &> /dev/null; then
                lines=$(pdftotext "$file" - 2>/dev/null | wc -l)
            else
                lines="(pdftotext not installed)"
            fi
            ;;
        xlsx)
            lines="(spreadsheet - see sheets)"
            ;;
    esac

    echo "Lines: $lines"

    if [[ "$lines" =~ ^[0-9]+$ ]]; then
        local chunks=$(( (lines + MAX_LINES_PER_CHUNK - 1) / MAX_LINES_PER_CHUNK ))
        echo "Chunks needed: $chunks (at $MAX_LINES_PER_CHUNK lines/chunk)"
    fi
    echo "=========================================="
}

# Convert document to text
convert_to_text() {
    local file="$1"
    local ext=$(get_extension "$file")
    local temp_file=$(mktemp)

    case "$ext" in
        txt|md)
            cat "$file" > "$temp_file"
            ;;
        docx|doc|rtf)
            textutil -convert txt -stdout "$file" > "$temp_file" 2>/dev/null
            ;;
        pdf)
            if command -v pdftotext &> /dev/null; then
                pdftotext -layout "$file" "$temp_file" 2>/dev/null
            else
                echo "Error: pdftotext not installed. Install with: brew install poppler" >&2
                rm "$temp_file"
                exit 1
            fi
            ;;
        xlsx)
            # Use Python for xlsx
            python3 << EOF > "$temp_file"
import sys
try:
    import openpyxl
    wb = openpyxl.load_workbook("$file", data_only=True)
    for sheet_name in wb.sheetnames:
        print(f"\n{'='*50}")
        print(f"SHEET: {sheet_name}")
        print('='*50)
        sheet = wb[sheet_name]
        for row in sheet.iter_rows(values_only=True):
            # Convert None to empty string and join with tab
            row_str = '\t'.join(str(cell) if cell is not None else '' for cell in row)
            if row_str.strip():  # Only print non-empty rows
                print(row_str)
except ImportError:
    print("Error: openpyxl not installed. Install with: pip install openpyxl", file=sys.stderr)
    sys.exit(1)
except Exception as e:
    print(f"Error reading xlsx: {e}", file=sys.stderr)
    sys.exit(1)
EOF
            ;;
        *)
            echo "Error: Unsupported file format: .$ext" >&2
            rm "$temp_file"
            exit 1
            ;;
    esac

    echo "$temp_file"
}

# Split into chunks
split_into_chunks() {
    local content_file="$1"
    local base_name="$2"
    local output_dir="$3"

    mkdir -p "$output_dir"

    local total_lines=$(wc -l < "$content_file")
    local chunk_num=1
    local start_line=1

    while [ $start_line -le $total_lines ]; do
        local chunk_file="$output_dir/${base_name}_chunk_$(printf '%03d' $chunk_num).txt"
        sed -n "${start_line},$((start_line + MAX_LINES_PER_CHUNK - 1))p" "$content_file" > "$chunk_file"

        local chunk_lines=$(wc -l < "$chunk_file")
        echo "Created: $chunk_file ($chunk_lines lines)"

        start_line=$((start_line + MAX_LINES_PER_CHUNK))
        chunk_num=$((chunk_num + 1))
    done

    echo ""
    echo "Total chunks created: $((chunk_num - 1))"
    echo "Output directory: $output_dir"
}

# Output specific chunk
output_chunk() {
    local content_file="$1"
    local chunk_num="$2"

    local start_line=$(( (chunk_num - 1) * MAX_LINES_PER_CHUNK + 1 ))
    local end_line=$(( start_line + MAX_LINES_PER_CHUNK - 1 ))

    local total_lines=$(wc -l < "$content_file")
    local total_chunks=$(( (total_lines + MAX_LINES_PER_CHUNK - 1) / MAX_LINES_PER_CHUNK ))

    echo "=========================================="
    echo "CHUNK $chunk_num of $total_chunks"
    echo "Lines $start_line - $end_line (of $total_lines total)"
    echo "=========================================="
    echo ""

    sed -n "${start_line},${end_line}p" "$content_file"
}

# Main
main() {
    local file=""
    local show_info=false
    local show_all=false
    local part=0

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --chunk)
                MAX_LINES_PER_CHUNK="$2"
                shift 2
                ;;
            --output)
                OUTPUT_DIR="$2"
                shift 2
                ;;
            --info)
                show_info=true
                shift
                ;;
            --all)
                show_all=true
                shift
                ;;
            --part)
                part="$2"
                shift 2
                ;;
            --help|-h)
                usage
                ;;
            *)
                if [ -z "$file" ]; then
                    file="$1"
                fi
                shift
                ;;
        esac
    done

    # Validate
    if [ -z "$file" ]; then
        usage
    fi

    if [ ! -f "$file" ]; then
        echo "Error: File not found: $file" >&2
        exit 1
    fi

    # Show info only
    if [ "$show_info" = true ]; then
        file_info "$file"
        exit 0
    fi

    # Convert to text
    local temp_file=$(convert_to_text "$file")

    if [ ! -s "$temp_file" ]; then
        echo "Error: Failed to extract content from file" >&2
        rm -f "$temp_file"
        exit 1
    fi

    local total_lines=$(wc -l < "$temp_file")

    # Output all
    if [ "$show_all" = true ]; then
        echo "=========================================="
        echo "FULL CONTENT"
        echo "File: $file"
        echo "Total lines: $total_lines"
        echo "=========================================="
        echo ""
        cat "$temp_file"
        rm -f "$temp_file"
        exit 0
    fi

    # Output specific part
    if [ "$part" -gt 0 ]; then
        output_chunk "$temp_file" "$part"
        rm -f "$temp_file"
        exit 0
    fi

    # Default: show info and split if needed
    local base_name=$(basename "$file" | sed 's/\.[^.]*$//')

    echo "=========================================="
    echo "DOCUMENT SUMMARY"
    echo "=========================================="
    echo "File: $file"
    echo "Total lines: $total_lines"

    if [ "$total_lines" -le "$MAX_LINES_PER_CHUNK" ]; then
        echo "Status: Small file - outputting directly"
        echo "=========================================="
        echo ""
        cat "$temp_file"
    else
        local total_chunks=$(( (total_lines + MAX_LINES_PER_CHUNK - 1) / MAX_LINES_PER_CHUNK ))
        echo "Status: Large file - $total_chunks chunks needed"
        echo ""
        echo "Options:"
        echo "  View part:  $0 \"$file\" --part <n>"
        echo "  View all:   $0 \"$file\" --all"
        echo "  Split:      $0 \"$file\" --output <dir>"
        echo "=========================================="
        echo ""
        echo "Preview (first $MAX_LINES_PER_CHUNK lines):"
        echo "------------------------------------------"
        head -n "$MAX_LINES_PER_CHUNK" "$temp_file"
        echo ""
        echo "------------------------------------------"
        echo "[... $((total_lines - MAX_LINES_PER_CHUNK)) more lines ...]"
        echo "Use --part 2, --part 3, etc. to see more"
    fi

    rm -f "$temp_file"
}

main "$@"

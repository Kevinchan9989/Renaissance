# Document Reading Tools

Utilities for reading various document formats, designed to work with Claude Code.

## Installation

The tools are ready to use. Dependencies:

```bash
# For PDF support (already installed via poppler)
brew install poppler

# For Excel support
pip3 install openpyxl
```

## Tools

### 1. `read_doc.sh` - Single Document Reader

Reads and extracts text from various document formats.

**Supported formats:** `.docx`, `.doc`, `.pdf`, `.xlsx`, `.txt`, `.md`, `.rtf`

**Usage:**

```bash
# View file info (lines, size, chunks needed)
./read_doc.sh <file> --info

# Read entire document
./read_doc.sh <file> --all

# Read specific chunk (for large files)
./read_doc.sh <file> --part 1
./read_doc.sh <file> --part 2

# Preview (auto-detects size, shows first 500 lines)
./read_doc.sh <file>

# Custom chunk size
./read_doc.sh <file> --chunk 1000 --part 1
```

**Examples:**

```bash
# Check how many chunks a large PDF needs
./read_doc.sh "large_manual.pdf" --info

# Read chunk by chunk
./read_doc.sh "large_manual.pdf" --part 1
./read_doc.sh "large_manual.pdf" --part 2

# Read small file directly
./read_doc.sh "spec.docx" --all
```

### 2. `batch_read_docs.sh` - Batch Document Processor

Processes all documents in a directory.

**Usage:**

```bash
# Generate inventory report only
./batch_read_docs.sh <input_dir> <output_dir> --info-only

# Extract all documents to text files
./batch_read_docs.sh <input_dir> <output_dir>

# Include subdirectories
./batch_read_docs.sh <input_dir> <output_dir> --recursive

# Specific extensions only
./batch_read_docs.sh <input_dir> <output_dir> --extensions "docx,pdf"
```

**Output:**
- `_file_inventory.txt` - Summary of all files with line counts
- `<filename>.txt` - Extracted text for each document

## Quick Reference for Claude

When working with documents in Claude Code:

```bash
# Shorthand alias (add to your shell profile)
alias rdoc='/Users/kevinchan/Projects/Applications/Renaissance/tools/read_doc.sh'

# Then use:
rdoc "myfile.pdf" --info     # Check file
rdoc "myfile.pdf" --part 1   # Read chunk 1
rdoc "myfile.pdf" --part 2   # Read chunk 2
```

## Handling Large Files

For files with many lines:

1. First check info: `./read_doc.sh <file> --info`
2. Note the "Chunks needed" count
3. Read chunk by chunk: `./read_doc.sh <file> --part <n>`

Default chunk size is 500 lines. Adjust with `--chunk <n>`.

## Troubleshooting

**PDF not extracting:**
```bash
brew install poppler
```

**XLSX not working:**
```bash
pip3 install openpyxl
```

**Permission denied:**
```bash
chmod +x /Users/kevinchan/Projects/Applications/Renaissance/tools/*.sh
```

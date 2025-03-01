#!/bin/bash

# Default values
OUTPUT_FILE="merged_output.txt"
PATTERN="### Ausgabe"
SEPARATOR="====================="

# Function to display help
usage() {
    echo "Usage: $0 [options] file1 [file2 ...]"
    echo
    echo "Extracts content from files until a specified pattern and merges the output."
    echo
    echo "Options:"
    echo "  -o output_file  Specify the output file (default: merged_output.txt)"
    echo "  -s separator    Specify the separator between file contents (default: '---')"
    echo "  -p pattern      Specify the pattern to extract (default: '### Ausgabe')"
    echo "  -h              Show this help message"
    echo
    echo "Example:"
    echo "  $0 -p '### Ausgabe' -o ../rating.md $(ls | grep -E '[3-9][0-9]\.md')"
    exit 1
}

# Parse command-line options
while getopts "o:p:s:h" opt; do
    case $opt in
        o) OUTPUT_FILE="$OPTARG" ;;
        p) PATTERN="$OPTARG" ;;
        s) SEPARATOR="$OPTARG" ;;
        h) usage ;;
        *) usage ;;
    esac
done
shift $((OPTIND - 1))  # Shift positional arguments

# Ensure a pattern and at least one file are provided
if [[ $# -lt 2 ]]; then
    echo "Error: Missing required arguments."
    usage
fi

PATTERN="$1"  # First argument is the pattern
shift         # Shift remaining arguments (file names)

# Clear or create the output file
> "$OUTPUT_FILE"

# Process each file
for file in "$@"; do
    if [[ -f "$file" ]]; then
        echo "Processing $file..."
        awk -v pattern="### Ausgabe" '$0 ~ pattern {exit} {print}' "$file" >> "$OUTPUT_FILE"
        echo -e "\n$SEPARATOR\n" >> "$OUTPUT_FILE"
    else
        echo "Warning: File $file not found, skipping..."
    fi
done

echo "Extraction complete. Output saved to '$OUTPUT_FILE'."
#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

const OUTPUT_PREFIX_LEN = 7;

interface JsonFormat {
    meta: {
        title: string;
        schema: string;
        pdf: string;
    },
    no: number;
    task: string;
    solution: string;
    title: string;
    lesson: string;
}

/**
 * Converts a JSON challenge to frontmatter markdown format
 * @param json - JSON object representing the challenge
 * @returns Frontmatter markdown string
 */
function convertJsonToMarkdown(json: JsonFormat): string {
    const [content, output] = json.task.split('<br />');
    const outputTable = `| ${output?.substring(OUTPUT_PREFIX_LEN).split(', ').join(' | ')} |`;
    const frontmatter = `---
title: "${json.meta.title}"
schema: "${json.meta.schema}"
pdf: "${json.meta.pdf}"
number: ${json.no}
query: |
  ${json.solution.replace(/\n/g, '\n  ')}
---

## ${json.title}

${json.lesson}

${content}

### Ausgabe

${outputTable}
`;
    return frontmatter;
}

/**
 * Converts JSON files in the input directory to markdown files in the output directory
 * @param inputDir - Directory containing JSON files
 * @param outputDir - Directory to save markdown files
 */
async function convertJsonFilesToMarkdown(inputDir: string, outputDir: string) {
    const files = await fs.readdir(inputDir);

    for (const file of files) {
        if (path.extname(file) === '.json') {
            const content = await fs.readFile(path.join(inputDir, file), 'utf-8');
            const json = JSON.parse(content);
            const markdown = convertJsonToMarkdown(json);
            const markdownFileName = path.join(outputDir, `${path.basename(file, '.json')}.md`);

            await fs.writeFile(markdownFileName, markdown);
        }
    }
}

if (process.argv.length < 4) {
    console.error('Usage: convert-json-to-markdown <inputDir> <outputDir>');
    process.exit(1);
}

const inputDir = process.argv[2];
const outputDir = process.argv[3];

// Example usage
convertJsonFilesToMarkdown(inputDir, outputDir)
    .then(() => console.log('Conversion complete'))
    .catch(err => console.error('Error during conversion:', err));

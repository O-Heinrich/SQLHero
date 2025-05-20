/**
 * SQL Hero Challenge Processing Module
 * 
 * This module handles the processing of SQL challenges, including markdown parsing,
 * code highlighting, and constants generation. It provides utilities for file checking,
 * frontmatter processing, and challenge data management.
 * 
 * @module sql-hero/challenge-processor
 */

import fs from 'fs/promises';
import matter from 'gray-matter';
import { marked } from 'marked';
import { JSDOM } from "jsdom";
import hljs from "highlight.js";
import { ShortChallenge } from '../src/lib/types';
import { randomBytes } from 'crypto'; 

/**
 * Interface for Vite plugin configuration
 */
export interface VitePlugin {
    /** Name of the Vite plugin */
    name: string;

    /**
     * Resolves the ID of a source file
     * @param source - Source file path
     * @returns Resolved ID or null if not handled
     */
    resolveId(source: string): string | null;

    /**
     * Loads the content of a file
     * @param id - File identifier
     * @returns Promise resolving to the file content
     */
    load(id: string): Promise<string | undefined>;
}

/**
 * Checks if a file exists at the specified path.
 * 
 * This utility function attempts to get file statistics and uses the success or
 * failure of that operation to determine if the file exists, without throwing
 * errors to the calling code.
 * 
 * @param {string} filePath - The path of the file to check
 * @returns {Promise<boolean>} A promise that resolves to true if the file exists, false otherwise
 * 
 * @example
 * if (await isExisting('./data/challenges/intro.md')) {
 *   console.log('Challenge file exists!');
 * } else {
 *   console.log('Challenge file not found');
 * }
 */
const isExisting: (filePath: string) => Promise<boolean> = async (
    filePath: string
): Promise<boolean> => {
    try {
        await fs.stat(filePath);
        return true;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
        return false;
    }
};

/**
 * Processes markdown content with frontmatter, separating metadata from content.
 * 
 * This function performs two key operations:
 * 1. Extracts YAML frontmatter data from the markdown using gray-matter
 * 2. Converts the remaining markdown content to HTML using marked
 * 
 * @param {string} markdown - Raw markdown content with frontmatter
 * @returns {Promise<{data: any, markup: string}>} Object containing extracted frontmatter data and HTML markup
 * 
 * @example
 * const result = await processFrontmatter(`---
 * title: SQL Joins
 * difficulty: medium
 * ---
 * # SQL Joins Tutorial
 * This tutorial covers different types of joins.`);
 * 
 * console.log(result.data.title); // "SQL Joins"
 * console.log(result.markup); // "<h1>SQL Joins Tutorial</h1><p>This tutorial covers different types of joins.</p>"
 */
async function processFrontmatter(markdown: string) {
    const { data, content } = matter(markdown);
    const markup = await marked(content);
    return {
        data,
        markup,
    };
}

/**
 * Highlights code blocks in HTML markup using highlight.js.
 * 
 * This function:
 *  1. Creates a virtual DOM from the HTML markup
 *  2. Finds all code blocks within pre tags
 *  3. Applies syntax highlighting to each code block
 *  4. Returns the updated HTML with highlighted code
 * 
 * @param {string} markup - HTML markup containing code blocks to highlight
 * @returns {string} HTML markup with syntax-highlighted code blocks
 * 
 * @example
 * const highlightedHTML = highlightCode('<pre><code>SELECT * FROM users;</code></pre>');
 * // Returns HTML with syntax highlighting classes applied to the SQL code
 */
function highlightCode(markup: string): string {
    const dom = new JSDOM(markup);
    const codeBlocks = dom.window.document.querySelectorAll('pre code');
    for (const block of codeBlocks) {
        hljs.highlightElement(block as HTMLElement);
    }

    return dom.window.document.querySelector('body')?.innerHTML ?? '';
}

/**
 * Encodes a string using XOR cipher with the given key and returns the result as base64.
 * 
 * The function applies a bitwise XOR operation between each byte of the input string
 * and the corresponding byte in the key (cycling the key as needed). The resulting
 * byte array is then base64 encoded.
 * 
 * This provides a simple form of encryption suitable for obfuscation but not for
 * cryptographic security.
 * 
 * @param {string} str - The string to encode
 * @param {string} key - The secret key used for XOR encoding
 * @returns {string} The base64-encoded result of XOR encoding
 * 
 * @example
 * const encoded = xorEncode('SELECT * FROM users', 'secretkey');
 * // Later decode with: xorDecode(encoded, 'secretkey')
 * 
 * @security This implements basic XOR encryption which is not cryptographically secure
 */
function xorEncode(str: string, key: string): string {
    const buffer = Buffer.from(str, 'utf-8');
    const keyBuffer = Buffer.from(key, 'utf-8');
    const result = Buffer.alloc(buffer.length);

    // XOR encode the buffer using the key
    for (let i = 0; i < buffer.length; i++) {
        result[i] = buffer[i] ^ keyBuffer[i % keyBuffer.length];
    }

    return result.toString('base64');
}

/**
 * Decodes a base64-encoded string using XOR cipher with the provided key.
 * 
 * This function performs the following steps:
 *  1. Decodes the base64 string to its binary representation
 *  2. Converts the binary string to a byte array
 *  3. Decodes the byte array using XOR with a cyclically applied key
 *  4. Converts the resulting bytes back to a UTF-8 string
 * 
 * This function is the counterpart to xorEncode and will restore the original text
 * when provided with the same key that was used for encoding.
 * 
 * @param {string} base64Encoded - The base64-encoded string to be decoded
 * @param {string} key - The secret key used for XOR decoding (must match the encoding key)
 * @returns {string} The decoded UTF-8 string
 * 
 * @example
 * // Decode SQL query that was previously encoded
 * const encodedQuery = challenge.query; // From challenge JSON data
 * const decodedQuery = xorDecode(encodedQuery, 'YOUR_SECRET_KEY');
 * console.log(decodedQuery); // "SELECT * FROM users WHERE id = 1"
 * 
 * @security This implements basic XOR encryption which is not cryptographically secure.
 *           It is suitable for obfuscation but not for protecting highly sensitive data.
 */
function xorDecode(base64Encoded: string, key: string): string {
    const binaryString = atob(base64Encoded);
    const encodedBytes = new Uint8Array(binaryString.length);

    // Convert binary string to byte array
    for (let i = 0; i < binaryString.length; i++) {
        encodedBytes[i] = binaryString.charCodeAt(i);
    }

    const textEncoder = new TextEncoder();
    const keyBytes = textEncoder.encode(key);
    const resultBytes = new Uint8Array(encodedBytes.length);

    // XOR decode the byte array using the key
    for (let i = 0; i < encodedBytes.length; i++) {
        resultBytes[i] = encodedBytes[i] ^ keyBytes[i % keyBytes.length];
    }

    const textDecoder = new TextDecoder('utf-8');
    return textDecoder.decode(resultBytes);
}

/**
 * Generates a TypeScript constants file with application configuration and challenge data.
 * 
 * This function creates a string containing TypeScript code that defines several
 * important application constants and utilities:
 *  - APP_NAME: The name of the application
 *  - COUNT_CHALLENGES: The total number of challenges available
 *  - BREAKPOINTS: Responsive design breakpoints as key-value pairs
 *  - CHALLENGES: An array of challenge objects sorted by their number property
 *  - K: The encryption key used for XOR encoding/decoding of challenge queries
 *  - xorDecode: The function for decoding XOR-encoded challenge queries
 * 
 * The generated code is intended to be written to a file and imported as a module
 * in the SQL Hero application. This ensures that challenge data and the decoding
 * functionality are available throughout the application.
 * 
 * @param {Object} config - Configuration options for constant generation
 * @param {[string, number][]} [config.breakpoints=[['sm', 640], ['md', 768], ['lg', 1024], ['xl', 1280]]] - 
 *        Array of breakpoint tuples containing name and pixel width
 * @param {ShortChallenge[]} config.challenges - Array of challenge objects to include in constants
 * @param {number} config.count - Total number of challenges in the application
 * @param {string} config.key - Encryption key used for XOR encoding/decoding of challenge queries
 * @returns {string} A string containing the generated TypeScript constants code
 * 
 * @example
 * const constants = generateConstants({
 *   breakpoints: [['mobile', 480], ['tablet', 768], ['desktop', 1024]],
 *   challenges: [
 *     { number: 1, title: 'SELECT Basics', difficulty: 'easy', schema: 'users' },
 *     { number: 2, title: 'JOIN Operations', difficulty: 'medium', schema: 'blog' }
 *   ],
 *   count: 2,
 *   key: 'f8e7d6c5b4a3210f8e7d6c5b4a32109'
 * });
 * 
 * // This would typically be written to a file by the Vite plugin
 * // The resulting module would export constants and the xorDecode function
 */
function generateConstants({
    breakpoints = [['sm', 640], ['md', 768], ['lg', 1024], ['xl', 1280]],
    challenges,
    count,
    key,
}: {
    breakpoints?: [string, number][];
    challenges: ShortChallenge[];
    count: number;
    key: string;
}): string {
    challenges.sort((a, b) => a.number - b.number);
    const code = [`/**
* Application constants
* Generated by sql-hero plugin
* DO NOT MODIFY
*/
export const APP_NAME = 'SQL Hero';
export const COUNT_CHALLENGES = ${count};\n
export const BREAKPOINTS = {\n`,
    ];

    for (const [name, width] of breakpoints) {
        code.push(`    '${name}': ${width},\n`);
    }

    code.push('};\n');
    code.push(`
export const CHALLENGES = [\n`
    );

    for (const challenge of challenges) {
        code.push(`${JSON.stringify(challenge, null, 4)},\n`);
    }

    code.push('];\n');
    code.push(`export const K = '${key}';\n`);
    code.push(`export ${xorDecode.toString()}`);

    return code.join('');
}

/**
 * Creates a Vite plugin for processing SQL challenge files.
 * 
 * This plugin:
 *  1. Reads markdown files from a specified directory
 *  2. Processes frontmatter and content for each file
 *  3. Highlights code blocks in the content
 *  4. Obfuscates query solutions using XOR encoding
 *  5. Generates constants including challenge metadata
 *  6. Writes processed challenge data to JSON files
 * 
 * @param {Object} options - Plugin configuration options
 * @param {string} options.path - Directory path containing markdown challenge files
 * @param {string} options.output - Directory path for output JSON files
 * @param {[string, number][]} [options.breakpoints] - Optional array of breakpoint name/width tuples
 * @returns {VitePlugin} A Vite plugin object with resolveId and load methods
 * 
 * @example
 * // In vite.config.ts
 * import { defineConfig } from 'vite';
 * import createChallenges from './challenge-processor';
 * 
 * export default defineConfig({
 *   plugins: [
 *     createChallenges({
 *       path: './challenges',
 *       output: './public/api/challenges',
 *       breakpoints: [['mobile', 480], ['desktop', 1024]]
 *     })
 *   ]
 * });
 */
export default function createChallenges({ path, output, breakpoints }: {
    path: string;
    output: string;
    breakpoints?: [string, number][];
}): VitePlugin {
    const virtualModuleId = 'virtual:sql-hero';
    const resolvedVirtualModuleId = '\0' + virtualModuleId;
    const key = randomBytes(16).toString('hex');

    return {
        name: 'create-challenges',
        resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId
            }

            return null;
        },
        async load(id: string): Promise<string | undefined> {
            if (id === resolvedVirtualModuleId) {
                let index = 0;
                const files = await fs.readdir(path);
                const challenges: ShortChallenge[] = new Array(files.length);

                if (!await isExisting(output)) {
                    await fs.mkdir(output, { recursive: true });
                }

                for (const file of files) {
                    const content = await fs.readFile(`${path}/${file}`, 'utf-8');
                    const { data, markup } = await processFrontmatter(content);
                    data.description = highlightCode(markup);
                    
                    if (data.query) {
                        data.query = xorEncode(data.query, key);
                    }

                    challenges[index++] = {
                        number: data.number,
                        title: data.title,
                        difficulty: data.difficulty,
                        schema: data.schema,
                    };

                    fs.writeFile(
                        `${output}/${file.replace('.md', '.json')}`, 
                        JSON.stringify(data).replace(/\\\\/g, '\\')
                    );
                }

                return generateConstants({ 
                    key,
                    breakpoints, 
                    challenges, 
                    count: files.length,
                });
            }
        }
    };
}
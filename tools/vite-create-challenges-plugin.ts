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
 * Checks if a file or directory exists at the specified path
 * @param filePath - Path to check for existence
 * @returns Promise resolving to true if the path exists, false otherwise
 * @throws Never throws, returns false on any file system error
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
 * Processes markdown frontmatter and content
 * @param markdown - Raw markdown content with frontmatter
 * @returns Promise resolving to an object containing parsed frontmatter data and HTML markup
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
 * Applies syntax highlighting to code blocks in HTML markup
 * @param markup - HTML markup containing code blocks
 * @returns Serialized HTML with highlighted code blocks
 */
function highlightCode(markup: string) {
    const dom = new JSDOM(markup);
    const codeBlocks = dom.window.document.querySelectorAll('pre code');
    for (const block of codeBlocks) {
        hljs.highlightElement(block as HTMLElement);
    }

    return dom.window.document.querySelector('body')?.innerHTML ?? '';
}

/**
 * Encodes a string using XOR cipher with the given key. 
 * 
 * This function performs the following steps:
 *  1. Converts the input string to a binary representation
 *  2. Converts the key to a binary representation
 *  3. XOR encodes the binary string using the key
 *  4. Converts the resulting bytes to a base64 string
 * 
 * XOR encoding works by applying the bitwise XOR operation between each byte of
 * the input string and the corresponding byte in the key (cycling the key as needed).
 * 
 * @param {string} str - The string to be encoded
 * @param {string} key - The secret key used for XOR encoding
 * @returns {string} The base64-encoded string
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
 * Decodes a base64-encoded string using XOR cipher with the given key.
 * 
 * This function performs the following steps:
 *  1. Decodes the base64 string to its binary representation
 *  2. Converts the binary string to a byte array
 *  3. Decodes the byte array using XOR with a cyclic key
 *  4. Converts the resulting bytes back to a UTF-8 string
 * 
 * XOR decoding works by applying the bitwise XOR operation between each byte of 
 * the encoded data and the corresponding byte in the key (cycling the key as needed).
 * Since XOR is a symmetric operation, the same function can be used for both encoding 
 * and decoding as long as the same key is used.
 * 
 * @param {string} base64Encoded - The base64-encoded string to be decoded
 * @param {string} key - The secret key used for XOR decoding
 * @returns {string} The decoded UTF-8 string
 * 
 * @example
 * // Decode an encoded message
 * const encodedData = "SGVsbG8sIFdvcmxkIQ=="; // Example base64-encoded data
 * const secretKey = "mySecretKey123";
 * const decodedMessage = xorDecode(encodedData, secretKey);
 * console.log(decodedMessage); // Original message
 * 
 * @throws {Error} If the base64 string is malformed or the resulting data is not valid UTF-8
 * @security This implements basic XOR encryption which is not cryptographically secure for sensitive data
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
 * Generates a TypeScript constants file with application configuration values.
 * 
 * This function creates a string containing TypeScript code that defines several
 * important application constants:
 * - APP_NAME: The name of the application
 * - COUNT_CHALLENGES: The total number of challenges available
 * - BREAKPOINTS: Responsive design breakpoints as key-value pairs
 * - CHALLENGES: An array of challenge objects sorted by their number property
 * 
 * The generated code is intended to be written to a file as part of a build process.
 * 
 * @param {Object} config - Configuration options for constant generation
 * @param {[string, number][]} [config.breakpoints=[['sm', 640], ['md', 768], ['lg', 1024], ['xl', 1280]]] - 
 *        Array of breakpoint tuples containing name and pixel width
 * @param {ShortChallenge[]} config.challenges - Array of challenge objects to include in constants
 * @param {number} config.count - Total number of challenges in the application
 * @param{string} config.key - Unique key for XOR encoding
 * @returns {string} A string containing the generated TypeScript constants code
 * 
 * @example
 * const constants = generateConstants({
 *   breakpoints: [['mobile', 480], ['tablet', 768], ['desktop', 1024]],
 *   challenges: [
 *     { id: 'intro', name: 'Introduction', number: 1 },
 *     { id: 'joins', name: 'SQL Joins', number: 2 }
 *   ],
 *   count: 2
 * });
 * 
 * // Write to file system
 * fs.writeFileSync('./src/constants.ts', constants);
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
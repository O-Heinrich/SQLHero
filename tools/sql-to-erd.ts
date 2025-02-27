#!/usr/bin/env bun
/**
 * @file tools/sql-to-erd.ts
 * @description Generate an ERD from a SQL file using sqldiagram command line tool.
 * 
 * @see @link(https://github.com/RadhiFadlillah/sqldiagram)
 * @deprecated Was implemented in order to evaluate Graphviz and sqldiagram for ERD generation.
 */
import { readableStreamToText, spawn } from 'bun';

const TEMP_FILE = "temp.sql";
const HELP: string = `
Usage: sql-to-erd [options] <path>

Options:
  --help, -h      Show this help message
  --output, -o    Output path
`;

/**
 * Parse command line arguments into an object.
 * @param args - Command line arguments
 * @returns Parsed arguments object
 */
function parseArgs(args: string[]) {
    const parsed: { [key: string]: string | boolean | string[] } = {};
    let i = 0;

    while (i < args.length) {
        const arg = args[i];

        if (arg.startsWith("--")) {
            const [key, value] = arg.slice(2).split("=");
            parsed[key] = value || true;
        } else if (arg.startsWith("-")) {
            const key = arg.slice(1);
            parsed[key] = true;
        } else {
            if (!parsed._) {
                parsed._ = [];
            }

            (parsed._ as string[]).push(arg);
        }

        i++;
    }

    return parsed;
}

/**
 * Create an ERD from a SQL file.
 * @param path - Path to the SQL file
 * @param outputPath - Path to save the ERD SVG file
 * @returns Promise resolving to void
 * @throws Error if the SQL file is not found
 * @throws Error if the ERD generation fails
 * @throws Error if the ERD SVG file cannot be saved
 * @throws Error if the temporary SQL file cannot be deleted
 * 
 * @see https://github.com/RadhiFadlillah/sqldiagram
 */
async function createErd(path: string, outputPath: string): Promise<void> {
    try {
        const sqlFile = Bun.file(path);
        if (!(await sqlFile.exists())) {
            throw new Error(`SQL file not found: ${path}`);
        }

        const buffer: string[] = [];
        let store = false;

        const lines = (await sqlFile.text()).split("\n");
        for (const line of lines) {
            if (line.trim().toLowerCase().startsWith("create table")) {
                store = true;
            }

            if (store) {
                buffer.push(line);
            }

            if (line.trim().startsWith(");")) {
                store = false;
            }
        }
        await Bun.write(TEMP_FILE, buffer.join("\n"));

        const {stdout} = spawn(["./sqldiagram/sqldiagram.exe", "mysql", TEMP_FILE]);
        const svg = await readableStreamToText(stdout);
        console.log(svg);
        await Bun.write(outputPath, svg);
        await Bun.file(TEMP_FILE).delete();
    } catch (err) {
        console.error(`Error in createErd: ${err.message}`);
        throw err;
    }
}

/**
 * Main function to generate ERD from SQL file.
 */
async function main() {
    try {
        const args = parseArgs(process.argv.slice(2));
        const outputPath = args.output || "./erd.svg";

        if (args.help) {
            console.log(HELP);
            return;
        }

        if (!Array.isArray(args._) || args._.length === 0) {
            console.error("Error: Missing path");
            console.log(HELP);
            return;
        }

        const path = args._[0];

        await createErd(path, outputPath.toString());
    } catch (err) {
        console.error(`Failed to generate ERD: ${err.message}`);
    }
}

main();
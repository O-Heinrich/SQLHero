/**
 * Script to generate challenge API files from challenges data
 * 
 * @description
 * - Generates JSON files for challenges in ./public/api/challenges/
 * - Creates directory if not existing
 * - Generates individual task JSON files including metadata
 * 
 * @requires fs/promises
 * @requires ./src/assets/challenges
 */
import { writeFile, mkdir, stat } from "node:fs/promises";

import { JSDOM } from "jsdom";
import { renderToStaticMarkup } from "react-dom/server";
import { challenges } from "../migration/challenges.tsx";

/**
 * Checks if a file/directory exists
 * @param {string} filePath - Path to check
 * @returns {Promise<boolean>} Existence status
 */
const isExisting = async (filePath) => {
    try {
        await stat(filePath);
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * Throws an error if the provided value does not match the expected type.
 *
 * @param {*} value - The value to check.
 * @param {string} type - The expected type of the value. If "array" is provided, it checks whether the value is an actual array.
 * @param {string} message - The error message to throw if the type does not match.
 * @throws {Error} Throws an error if the type of value does not match the expected type or if a non-array value is provided when "array" is expected.
 */
const throwIfTypeMismatch = (value, type, message) => {
    if (type === "string|jsdom" && typeof value !== "string" && value instanceof JSDOM === false) {
        throw new Error(message);
    }

    if (type !== "string|jsdom" && type !== "array" && typeof value !== type || type === "array" && !Array.isArray(value)) {
        throw new Error(message);
    }
};

/**
 * Removes all attributes from the specified HTML elements within a given HTML string.
 *
 * @param {string|JSDOM} html - The HTML content to be processed.
 * @param {string[]} tagNames - An array of tag names; attributes will be removed from these elements.
 * @returns {JSDOM} A JSDOM instance with the attributes removed.
 * @throws {TypeError} If the provided html is not a string or tagNames is not an array.
 */
const removeAllAttibutesFromHtml = (html, tagNames) => {
    throwIfTypeMismatch(html, "string|jsdom", "html must be a string or a JSDOM instance");
    throwIfTypeMismatch(tagNames, "array", "tagNames must be an array");

    const dom = typeof html === 'string' ? new JSDOM(html) : html;
    const { document } = dom.window;
    const elements = document.querySelectorAll(tagNames.join(", "));

    for (const element of elements) {
        for (const attr of element.attributes) {
            element.removeAttribute(attr.name);
        }
        
        if (element.tagName === 'CODE' && element.children.length > 0) {
            const childs = Array.from(element.childNodes).map(child => child.textContent).join("");
            element.innerHTML = childs;
            element.classList.add('hljs', 'language-sql');
        }

    }

    return dom;
}

/**
 * Removes Font Awesome icons from the specified HTML content.
 * 
 * @param {string|JSDOM} html - The HTML content to be processed.
 * @returns {JSDOM} A JSDOM instance with the Font Awesome icons removed.
 * @throws {TypeError} If the provided html is not a string or a JSDOM instance.
 */
const removeFontawesome = (html) => {
    const dom = html === 'string' ? new JSDOM(html) : html;
    const { document } = dom.window;
    const elements = document.querySelectorAll('i');

    for (const element of elements) {
        if (element.classList.contains('fa')) {
            if (element.parentNode.tagName === 'A') {
                element.parentNode.remove();
            } else {
                element.remove();
            }
        }
    }

    return dom;
}

/**
 * Converts a JSX element to a string.
 * 
 * @param {ReactElement} jsx - The JSX element to be converted.
 * @returns {string} The string representation of the JSX element.
 */
const jsxToMarkup = (jsx) => removeFontawesome(
    removeAllAttibutesFromHtml(
        renderToStaticMarkup(jsx),
        ['h3', 'code']
    )
).window.document.body.innerHTML;

/**
 * Main execution function for challenge file generation
 * @async
 */
(async () => {Element
    for (const [key, value] of Object.entries(challenges)) {
        try {
            // Ensure challenge directory exists
            if (!await isExisting(`./public/api/challenges`)) {
                await mkdir(`./public/api/challenges/`, { recursive: true });
            }

            const dbUrl = new URL(value.db);
            const pdfUrl = new URL(value.pdf);
            const dbLen = dbUrl.pathname.length;

            // Store metadata for challenge
            const meta = {
                title: value.titelDB,
                schema: `${dbUrl.pathname.substring(0, dbLen - 2)}sql`,
                pdf: pdfUrl.pathname,
            };

            // Write individual task files
            for (const task of value.tasks) {
                const lesson = task.lektion !== ''
                    ? jsxToMarkup(task.lektion)
                    : undefined;

                const {
                    nr,
                    titel,
                    aufgabe,
                    solution,                    
                    intro,
                    view,
                } = task;

                const taskData = {
                    meta,
                    no: nr,
                    title: titel,
                    task: aufgabe,
                    solution,
                    lesson,
                    intro,
                    view,
                };

                writeFile(
                    `./public/api/challenges/${nr}.json`,
                    JSON.stringify(taskData, null, 2)
                );
            }
        } catch (error) {
            console.error(`Error processing challenge ${key}:`, error);
        }
    }
})();
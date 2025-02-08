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
 * Main execution function for challenge file generation
 * @async
 */
(async () => {
    for (const [key, value] of Object.entries(challenges)) {
        try {
            // Ensure challenge directory exists
            if (!await isExisting(`./public/api/challenges`)) {
                await mkdir(`./public/api/challenges/`, { recursive: true });
            }

            const dbUrl = new URL(value.db);
            const pdfUrl = new URL(value.pdf);

            // Store metadata for challenge
            const meta = {
                title: value.titelDB,
                db: dbUrl.pathname,
                pdf: pdfUrl.pathname,
            };

            // Write individual task files
            for (const task of value.tasks) {
                const { 
                    nr, 
                    titel, 
                    aufgabe, 
                    solution, 
                    lektion, 
                    intro, 
                    view,
                 } = task;

                const taskData = { 
                    meta,
                    no: nr, 
                    title: titel, 
                    task: aufgabe, 
                    solution, 
                    lesson: renderToStaticMarkup(lektion), 
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
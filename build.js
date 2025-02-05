/**
 * Script to generate challenge API files from challenges data
 * 
 * @description
 * - Generates JSON files for challenges in ./public/api/challenges/
 * - Creates directory for each challenge if not existing
 * - Generates index.json with challenge metadata
 * - Generates individual task JSON files
 * 
 * @requires fs/promises
 * @requires ./src/assets/challenges
 */
import { challenges } from "./migration/challenges.tsx";
import { writeFile, mkdir, stat } from "node:fs/promises";

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
            if (!await isExisting(`./public/api/challenges/${key}`)) {
                await mkdir(`./public/api/challenges/${key}`, { recursive: true });
            }

            // Write challenge metadata
            const data = {
                title: value.titelDB,
                db: value.db,
                pdf: value.pdf,
            };
            await writeFile(`./public/api/challenges/${key}/index.json`, JSON.stringify(data, null, 2));

            // Write individual task files
            for (const task of value.tasks) {
                const { nr, titel, aufgabe, solution, lektion, intro, view } = task;
                const taskData = { nr, titel, aufgabe, solution, lektion, intro, view };
                await writeFile(`./public/api/challenges/${key}/${nr}.json`, JSON.stringify(taskData, null, 2));
            }
        } catch (error) {
            console.error(`Error processing challenge ${key}:`, error);
        }
    }
})();
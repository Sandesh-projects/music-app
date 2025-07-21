import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);

export const downloadFromYoutube = (videoURL, outputFilename) => {
    return new Promise((resolve, reject) => {
        console.log('--- Starting Download ---');

        const outputDir = path.resolve(process.cwd(), 'uploads');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // **Notice the hard-coded `.mp3` here:**
        const outputPath = path.join(outputDir, `${outputFilename}.mp3`);

        const args = [
            '-x',                         // extract audio
            '--audio-format', 'mp3',      // convert to mp3
            '--audio-quality', '0',       // best quality
            '-o', outputPath,             // direct .mp3 output
            videoURL,
        ];

        const proc = spawn('yt-dlp', args, { stdio: 'inherit' });

        proc.on('error', err => {
            console.error('Failed to start yt-dlp:', err);
            reject(err);
        });

        proc.on('close', code => {
            console.log(`yt-dlp exited with code ${code}`);
            if (code !== 0) {
                return reject(new Error(`yt-dlp failed with exit code ${code}`));
            }

            // Now we know the file _must_ be at outputPath
            if (!fs.existsSync(outputPath)) {
                return reject(new Error(`Expected MP3 at ${outputPath}, but none found.`));
            }

            // Resolve with the relative path your app expects
            resolve(`/uploads/${outputFilename}.mp3`);
        });
    });
};

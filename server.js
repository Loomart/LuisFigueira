/**
 * Backend Server for Contact Form
 * 
 * This server handles the storage of contact form submissions.
 * It saves messages to a local JSON file and implements log rotation
 * to prevent the file from becoming too large.
 * 
 * Tech Stack: Node.js, Express
 */

import express from 'express';
import fs from 'fs/promises'; // Use promise-based API for non-blocking operations
import fsSync, { existsSync, mkdirSync, writeFileSync } from 'fs'; // Sync methods only for initial setup
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

// --- Configuration ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit for log rotation

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON bodies

// --- File System Setup ---
// Directory where messages will be stored
const formsDir = path.join(__dirname, 'formularios', 'contacto');
const messagesFile = path.join(formsDir, 'mensajes.json');

// Ensure the directory exists on startup (Blocking is fine here as it runs once)
if (!existsSync(formsDir)){
    mkdirSync(formsDir, { recursive: true });
}

// Initialize the messages file if it doesn't exist
if (!existsSync(messagesFile)) {
    writeFileSync(messagesFile, JSON.stringify([], null, 2));
}

/**
 * Helper function to format dates for filenames.
 * Replaces colons and dots to make the string filesystem-safe.
 * @param {string} isoDate - ISO Date string
 * @returns {string} Safe filename string
 */
const formatDateForFilename = (isoDate) => {
    try {
        const d = new Date(isoDate);
        return d.toISOString().replace(/[:.]/g, '-');
    } catch (e) {
        return Date.now().toString();
    }
};

/**
 * POST /api/contact
 * Receives contact form data and saves it to a JSON file.
 * Handles automatic log rotation if file exceeds MAX_FILE_SIZE.
 */
app.post('/api/contact', async (req, res) => {
    try {
        const newMessage = {
            id: Date.now(),
            date: new Date().toISOString(),
            ...req.body
        };

        // 1. Check current file size
        let stats;
        try {
            stats = await fs.stat(messagesFile);
        } catch (e) {
            stats = { size: 0 };
        }

        let messages = [];
        
        // 2. Read existing messages
        try {
            if (stats.size > 0) {
                const fileContent = await fs.readFile(messagesFile, 'utf8');
                messages = JSON.parse(fileContent);
            }
        } catch (e) {
            console.warn('Error reading messages file, starting fresh array', e);
            messages = [];
        }

        // 3. Log Rotation Logic
        // If file is too big, rename it to .bkp and start a new one
        if (stats.size > MAX_FILE_SIZE && messages.length > 0) {
            const startDate = messages[0].date || new Date().toISOString();
            const endDate = messages[messages.length - 1].date || new Date().toISOString();
            
            const startStr = formatDateForFilename(startDate);
            const endStr = formatDateForFilename(endDate);
            
            const backupFilename = `mensajes_${startStr}_${endStr}.bkp`;
            const backupPath = path.join(formsDir, backupFilename);
            
            // Rename current file (Atomic operation)
            await fs.rename(messagesFile, backupPath);
            console.log(`Log rotation triggered. File archived as: ${backupFilename}`);
            
            // Reset messages array for the new file
            messages = [];
        }

        // 4. Add new message
        messages.push(newMessage);

        // 5. Write back to file (Non-blocking)
        await fs.writeFile(messagesFile, JSON.stringify(messages, null, 2));

        console.log(`New message saved from: ${newMessage.name}`);
        res.json({ success: true, message: 'Message saved successfully' });

    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Internal server error while saving message' });
    }
});

/**
 * GET /api/messages
 * Retrieves all saved messages.
 * Protected by a simple authorization check (Authorization header).
 */
app.get('/api/messages', async (req, res) => {
    // Simple authorization check
    // In a real production app, use environment variables and robust auth (JWT/Session)
    const authHeader = req.headers['authorization'];
    
    // "admin123" is the hardcoded password for this prototype
    if (!authHeader || authHeader !== 'Bearer admin123') {
        return res.status(401).json({ error: 'Unauthorized: Invalid credentials' });
    }

    try {
        if (!fsSync.existsSync(messagesFile)) {
             return res.json([]);
        }
        
        const fileContent = await fs.readFile(messagesFile, 'utf8');
        const messages = JSON.parse(fileContent);
        
        // Return messages sorted by date (newest first)
        res.json(messages.reverse());
    } catch (error) {
        console.error('Error reading messages:', error);
        res.status(500).json({ error: 'Error retrieving messages' });
    }
});

// --- Start Server ---
app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});

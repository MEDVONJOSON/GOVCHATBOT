const { spawn } = require('child_process');
const path = require('path');

const processMessage = (message, mode = 'chat') => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [path.join(__dirname, '../ai_service.py'), '--mode', mode, message], {
            env: { ...process.env }
        });

        let dataString = '';

        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python Error: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            try {
                const result = JSON.parse(dataString);
                const botResponse = result.response || "Sorry, I couldn't process that.";
                resolve(botResponse);
            } catch (e) {
                console.error('Error parsing Python output:', e);
                reject(e);
            }
        });
    });
};

const verifyMessage = (message, imageUrl = null) => {
    return new Promise((resolve, reject) => {
        const args = [path.join(__dirname, '../ai_service.py'), '--verify', message];
        if (imageUrl) {
            args.push('--image_url', imageUrl);
        }

        const pythonProcess = spawn('python', args, {
            env: { ...process.env }
        });

        let dataString = '';

        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python Error: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            try {
                // The python script returns JSON directly for verify
                const result = JSON.parse(dataString);
                resolve(result);
            } catch (e) {
                console.error('Error parsing Python output:', e);
                reject(e);
            }
        });
    });
};

module.exports = { processMessage, verifyMessage };

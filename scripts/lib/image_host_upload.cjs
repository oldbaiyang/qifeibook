const { spawn } = require('child_process');
const path = require('path');

const DEFAULT_IMAGE_HOST_UPLOAD_SCRIPT = '/Users/zcy/.codex/skills/image-host-upload/scripts/upload-image.mjs';
const IMAGE_HOST_UPLOAD_SCRIPT = process.env.IMAGE_HOST_UPLOAD_SCRIPT || DEFAULT_IMAGE_HOST_UPLOAD_SCRIPT;

function uploadToImageHost(imagePath, options = {}) {
  return new Promise((resolve, reject) => {
    const args = [IMAGE_HOST_UPLOAD_SCRIPT, path.resolve(imagePath), '--json'];

    if (options.key) {
      args.push('--key', options.key);
    }

    const child = spawn(process.execPath, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });

    child.on('error', reject);

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error((stderr || stdout || `image-host-upload exited with code ${code}`).trim()));
        return;
      }

      try {
        const payload = JSON.parse(stdout);
        if (!payload.url) {
          reject(new Error(`image-host-upload did not return a url: ${stdout.slice(0, 200)}`));
          return;
        }
        resolve(payload.url);
      } catch (error) {
        reject(new Error(`Failed to parse image-host-upload output: ${error.message}`));
      }
    });
  });
}

module.exports = {
  IMAGE_HOST_UPLOAD_SCRIPT,
  uploadToImageHost,
};

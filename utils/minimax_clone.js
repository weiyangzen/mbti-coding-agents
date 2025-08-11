#!/usr/bin/env node
/*
  JS version of minimax_clone_snowy.py
  - Reads audio_path and voice_id from ./voiceclone.config.json
  - Credentials priority: env (MINIMAX_GROUP_ID/MINIMAX_API_KEY) > ~/.claude/tts.config.json > ./voiceclone.config.json
  - Uploads audio, then clones a voice with voice_id
  - Requires Node.js 18+ (global fetch/FormData)
*/

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const PROJECT_CONFIG = path.resolve(process.cwd(), 'voiceclone.config.json');
const CRED_FILE = path.join(os.homedir(), '.claude', 'tts.config.json');

function mask(s) {
  if (!s) return '';
  const str = String(s);
  return `${str.slice(0, 2)}***${str.slice(-4)} (len=${str.length})`;
}

async function readJSONIfExists(p) {
  try {
    const txt = await fsp.readFile(p, 'utf8');
    return JSON.parse(txt);
  } catch (e) {
    return null;
  }
}

function pickCredentialFrom(obj) {
  if (!obj || typeof obj !== 'object') return {};
  // support nested like { minimax: { group_id, api_key } }
  const mm = obj.minimax || obj.minimaxi || obj.minimaxio || {};
  const group_id = obj.group_id || mm.group_id;
  const api_key = obj.api_key || mm.api_key;
  return { group_id, api_key };
}

async function loadConfigAndCreds() {
  // Project config
  const cfg = (await readJSONIfExists(PROJECT_CONFIG)) || {};

  // Env first
  let group_id = process.env.MINIMAX_GROUP_ID || '';
  let api_key = process.env.MINIMAX_API_KEY || '';

  // Then ~/.claude/tts.config.json
  if (!group_id || !api_key) {
    const credJson = await readJSONIfExists(CRED_FILE);
    const fromCred = pickCredentialFrom(credJson);
    group_id = group_id || fromCred.group_id || '';
    api_key = api_key || fromCred.api_key || '';
  }

  // Then project config
  if (!group_id || !api_key) {
    const fromCfg = pickCredentialFrom(cfg);
    group_id = group_id || fromCfg.group_id || '';
    api_key = api_key || fromCfg.api_key || '';
  }

  if (!group_id || !api_key) {
    throw new Error('Missing credentials. Please set env MINIMAX_GROUP_ID/MINIMAX_API_KEY, or provide ~/.claude/tts.config.json, or fill them in voiceclone.config.json');
  }

  if (!audio_path) {
    throw new Error('Missing audio_path. Please set it in voiceclone.config.json');
  }

  if (!voice_id) {
    throw new Error('Missing voice_id. Please set it in voiceclone.config.json');
  }

  const audio_path = cfg.audio_path;
  const voice_id = cfg.voice_id;

  console.log('Using group_id:', mask(group_id), ' api_key:', mask(api_key));
  return { cfg, group_id, api_key, audio_path, voice_id };
}

function detectContentType(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.wav') return 'audio/wav';
  if (ext === '.mp3') return 'audio/mpeg';
  if (ext === '.m4a') return 'audio/mp4';
  return 'application/octet-stream';
}

async function uploadFile(base, group_id, api_key, audio_path) {
  if (!fs.existsSync(audio_path)) {
    throw new Error(`Audio file not found: ${audio_path}`);
  }
  const url = `${base}/v1/files/upload?GroupId=${group_id}`;
  const form = new FormData();
  form.append('purpose', 'voice_clone');
  form.append('file', fs.createReadStream(audio_path), {
    filename: path.basename(audio_path),
    contentType: detectContentType(audio_path),
  });

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${api_key}`,
      // Do NOT set content-type header so fetch can set form-data boundary automatically
    },
    body: form,
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Upload failed: HTTP ${resp.status} ${text}`);
  }
  const js = await resp.json();
  const file = (js && js.file) || {};
  const file_id = file.file_id;
  if (!file_id) throw new Error(`Upload response missing file_id: ${JSON.stringify(js)}`);
  console.log('Upload succeeded, file_id =', file_id);
  return file_id;
}

async function voiceClone(base, group_id, api_key, file_id, voice_id) {
  const url = `${base}/v1/voice_clone?GroupId=${group_id}`;
  const payload = {
    file_id: Number(file_id), // int64 expected
    voice_id: String(voice_id),
  };
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${api_key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const text = await resp.text();
  console.log('Clone response:', text);
  if (!resp.ok) throw new Error(`Clone failed: HTTP ${resp.status} ${text}`);
  return JSON.parse(text);
}

async function main() {
  try {
    const { group_id, api_key, audio_path, voice_id } = await loadConfigAndCreds();

    // Try minimaxi.chat first then minimax.io
    const bases = ['https://api.minimaxi.chat', 'https://api.minimax.io'];
    let lastErr = null;

    for (const base of bases) {
      try {
        console.log('Uploading audio…', audio_path, 'via', base);
        const fid = await uploadFile(base, group_id, api_key, audio_path);
        console.log('Creating voice clone…', voice_id);
        const result = await voiceClone(base, group_id, api_key, fid, voice_id);
        console.log('Done.');
        return;
      } catch (e) {
        console.error('Attempt failed:', base, e?.message || e);
        lastErr = e;
        continue;
      }
    }
    if (lastErr) throw lastErr;
  } catch (e) {
    console.error('Execution failed:', e?.message || e);
    process.exitCode = 1;
  }
}

// Ensure Node 18+
const [major] = process.versions.node.split('.').map(Number);
if (!major || major < 18) {
  console.error('This script requires Node.js v18 or higher (for global fetch/FormData).');
  process.exit(1);
}

await main();


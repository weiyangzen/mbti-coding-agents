#!/usr/bin/env node

/**
 * Claude Code PostToolUse TTS Hook (Minimax, default voice: Sweet_Girl_2)
 *
 * Configuration is externalized to a JSON file:
 *   - Path: ~/.claude/tts.config.json
 *   - Example content:
 *     {
 *       "minimax": { "url": "https://api.minimax.io/v1/t2a_v2", "api_key": "", "group_id": "" },
 *       "gemini":  { "url": "", "api_key": "", "model": "gemini-2.5-flash", "summary_language": "en" }
 *     }
 *
 * Behavior:
 * - Reads PostToolUse JSON from STDIN when available (extracts Claude output), otherwise falls back to --text or raw stdin
 * - Calls MiniMax TTS endpoint consistent with your Python script
 * - Writes MP3 to /tmp and plays on macOS via afplay
 * - Gracefully no-ops if config/credentials are missing
 *
 * Notes:
 * - No embedded keys; English-only; voice_id = "Sweet_Girl_2"
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');

const CONFIG_PATH = path.join(os.homedir(), '.claude', 'tts.config.json');
const VOICE_ID = 'Sweet_Girl_2'; // Default voice aligned with Python (Snowy)

function loadConfig() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function readStdinRaw() {
  return new Promise(resolve => {
    let data = '';
    if (process.stdin.isTTY) return resolve('');
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => (data += chunk));
    process.stdin.on('end', () => resolve(data.trim()));
    setTimeout(() => resolve(data.trim()), 400);
  });
}

function extractFromHookJSON(raw) {
  try {
    const obj = JSON.parse(raw);
    if (obj && obj.hook_event_name && obj.hook_event_name !== 'PostToolUse') return null;
    const toolName = obj.tool_name || '';
    const toolInput = obj.tool_input || {};
    if (['Write', 'Edit', 'MultiEdit', 'str-replace-editor'].includes(toolName)) {
      return toolInput.content || toolInput.text || JSON.stringify(toolInput);
    }
    return JSON.stringify(toolInput);
  } catch {
    return null;
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const res = { text: '' };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--text' && i + 1 < args.length) {
      res.text = String(args[i + 1]);
      i++;
    }
  }
  return res;
}

function ensureFetch() {
  if (typeof fetch === 'function') return fetch;
  try {
    const { fetch: undiciFetch } = require('undici');
    return undiciFetch;
  } catch (e) {
    return null;
  }
function pickFirstString(val) {
  return Array.isArray(val) ? val.find(v => typeof v === 'string' && v.length > 0) || '' : (typeof val === 'string' ? val : '');
}

function deepFindAudioString(obj) {
  try {
    const stack = [obj];
    while (stack.length) {
      const cur = stack.pop();
      if (!cur || typeof cur !== 'object') continue;
      for (const [k, v] of Object.entries(cur)) {
        // Prefer obvious fields
        if (/^(audio|audio_url|audioUrl|url|audio_data|audioData)$/i.test(k)) {
          const s = pickFirstString(v);
          if (s) return s;
        }
        if (v && typeof v === 'object') stack.push(v);
      }
    }
  } catch {}
  return '';
}

}

function urlsafeToStdBase64(s) {
  let t = (s || '').toString().replace(/\s+/g, '');
  t = t.replace(/-/g, '+').replace(/_/g, '/');
  const pad = t.length % 4;
  if (pad) t += '='.repeat(4 - pad);
  return t;
}

async function requestTTS_MiniMax({ baseUrl, apiKey, groupId }, text, outFile) {
  const f = ensureFetch();
  if (!f) throw new Error('No fetch available. Use Node >= 18 or install undici.');

  const url = `${baseUrl}?GroupId=${encodeURIComponent(groupId)}`;
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Group-Id': groupId // some deployments require header, harmless if duplicated
  };
  const payload = {
    model: 'speech-2.5-hd-preview',
    text: text,
    stream: false,
    output_format: 'url',
    voice_setting: { voice_id: VOICE_ID, speed: 1, vol: 1, pitch: 0 },
    audio_setting: { sample_rate: 32000, bitrate: 128000, format: 'mp3', channel: 1 },
  };

  const resp = await f(url, { method: 'POST', headers, body: JSON.stringify(payload) });
  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    throw new Error(`MiniMax request failed: ${resp.status} ${resp.statusText} ${errText}`);
  }
  const j = await resp.json();
  const ok = j && j.base_resp && j.base_resp.status_code === 0;
  if (!ok) {
    const msg = (j && j.base_resp && j.base_resp.status_msg) || 'Unknown error';
    throw new Error(`MiniMax API error: ${msg}`);
  }

  const data = (j && j.data) || {};
  let audioField = [data.audio, data.audio_url, data.url, data.audioData, data.audio_data]
    .map(v => (v == null ? '' : String(v)))
    .find(v => v.length > 0) || '';
  if (!audioField) audioField = deepFindAudioString(j);

  if (!audioField) {
    const keys = Object.keys(data || {});
    throw new Error(`No audio data found in JSON response (data keys: ${keys.join(',')})`);
  }

  // URL case
  if (/^https?:\/\//i.test(audioField)) {
    const aResp = await f(audioField);
    if (!aResp.ok) throw new Error(`Failed to download audio: ${aResp.status} ${aResp.statusText}`);
    const buf = Buffer.from(await aResp.arrayBuffer());
    fs.writeFileSync(outFile, buf);
  } else {
    // Base64 case
    const std = urlsafeToStdBase64(audioField);
    const buf = Buffer.from(std, 'base64');
    fs.writeFileSync(outFile, buf);
  }

  // Minimal sanity check like in your Python script
  try {
    const size = fs.statSync(outFile).size;
    if (size < 4096) {
      try { fs.unlinkSync(outFile); } catch {}
      throw new Error(`Audio too small: ${size} bytes`);
    }
  } catch (e) {
    throw new Error(`Audio write/size check failed: ${e.message}`);
  }
}

function tryPlay(filePath) {
  if (process.platform === 'darwin') {
    execFile('afplay', [filePath], { timeout: 20000 }, () => {});
  }
}

async function summarizeWithGemini(cfg, text) {
  const g = (cfg && cfg.gemini) || {};
  const urlBase = (g.url || '').trim();
  const key = (g.api_key || '').trim();
  const model = (g.model || 'gemini-2.5-flash').trim();
  if (!urlBase || !key) return null;

  const f = ensureFetch();
  if (!f) return null;

  const url = `${urlBase.replace(/\/?$/, '')}/models/${encodeURIComponent(model)}:generateContent`;
  const headers = { 'x-goog-api-key': key, 'Content-Type': 'application/json' };

  // Language choice: en (English), zh (Chinese), ja (Japanese)
  const lang = (g.summary_language || 'en').toLowerCase();
  let instruction;
  if (lang === 'zh') {
    instruction = '用中文，口语化、俏皮的妹妹语气，将以下 Claude 输出总结为 12-20 个词（只输出台词）:';
  } else if (lang === 'ja') {
    instruction = '日本語で、口語的でやや甘える妹口調で、以下の Claude 出力を 12～20 語に要約（セリフのみ出力）:';
  } else {
    instruction = 'In English, playful and verbal younger-sister style, summarize the following Claude output into 12-20 words (output the line only):';
  }

  const payload = {
    contents: [{ role: 'user', parts: [{ text: `${instruction}\n\n${text}` }] }],
    generationConfig: { temperature: 0.3, topP: 0.8, maxOutputTokens: 500, thinkingConfig: { thinkingBudget: 0 } }
  };

  try {
    const resp = await f(url, { method: 'POST', headers, body: JSON.stringify(payload) });
    if (!resp.ok) return null;
    const j = await resp.json();
    const cands = j && j.candidates;
    const first = cands && cands[0];
    const content = first && first.content;
    const parts = content && content.parts;
    const summary = parts && parts[0] && parts[0].text ? String(parts[0].text).trim() : '';
    return summary || null;
  } catch {
    return null;
  }
}

(async () => {
  try {
    const args = parseArgs();
    const raw = await readStdinRaw();

    let text = '';
    const extracted = raw ? extractFromHookJSON(raw) : '';
    text = (extracted || args.text || raw || '').trim();

    if (!text) process.exit(0);

    const cfg = loadConfig();

    // MUST-DO: summarize with Gemini first if configured
    let summarized = await summarizeWithGemini(cfg, text);
    if (!summarized) {
      // Fallback heuristics similar to your Python fallback buckets (English lines)
      if (text.length > 100) summarized = 'Claude completed a complex task';
      else if (/错误/i.test(text) || /error/i.test(text)) summarized = 'Claude encountered an error';
      else if (/完成|成功/.test(text)) summarized = 'Claude successfully completed the task';
      else summarized = 'Claude performed a file operation';
    }

    const mm = (cfg && cfg.minimax) || {};
    const baseUrl = (mm.url || 'https://api.minimax.io/v1/t2a_v2').trim();
    const apiKey = (mm.api_key || '').trim();
    const groupId = (mm.group_id || '').trim();

    if (!apiKey || !groupId) {
      console.error('[TTS] MiniMax credentials missing in ~/.claude/tts.config.json. Skipping TTS.');
      process.exit(0);
    }

    const out = path.join(os.tmpdir(), `claude-tts-${Date.now()}.mp3`);
    await requestTTS_MiniMax({ baseUrl, apiKey, groupId }, summarized, out);
    tryPlay(out);
    console.log(`[TTS] Audio saved to: ${out}`);
  } catch (err) {
    console.error('[TTS] Error:', err.message);
    process.exit(0);
  }
})();


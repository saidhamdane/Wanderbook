#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

function loadLocalEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    let value = rawValue.trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function keyInfo(name) {
  const value = process.env[name] || '';
  return {
    exists: value.length > 0,
    prefix: value ? value.slice(0, 7) : '',
  };
}

function printKeyInfo() {
  for (const name of ['OPENAI_API_KEY', 'ANTHROPIC_API_KEY']) {
    const info = keyInfo(name);
    console.log(`${name} exists: ${info.exists ? 'yes' : 'no'}${info.prefix ? `, prefix: ${info.prefix}` : ''}`);
  }
}

function extractError(error) {
  return {
    status: error?.status || error?.response?.status || 'n/a',
    code: error?.code || error?.error?.code || 'n/a',
    type: error?.type || error?.error?.type || 'n/a',
    message: redactSecrets(error?.message || String(error)),
  };
}

function redactSecrets(value) {
  return String(value).replace(/sk-[^\s),]+/g, (match) => `${match.slice(0, 7)}[redacted]`);
}

async function testOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { provider: 'openai', ok: false, status: 'missing', message: 'OPENAI_API_KEY missing' };
  try {
    const client = new OpenAI({ apiKey, timeout: 15000, maxRetries: 0 });
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 8,
      temperature: 0,
      messages: [{ role: 'user', content: 'Reply with exactly: ok' }],
    });
    const text = response.choices[0]?.message?.content?.trim() || '';
    return { provider: 'openai', ok: true, status: 'success', message: text };
  } catch (error) {
    return { provider: 'openai', ok: false, ...extractError(error) };
  }
}

async function testAnthropic() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { provider: 'anthropic', ok: false, status: 'missing', message: 'ANTHROPIC_API_KEY missing' };
  try {
    const client = new Anthropic({ apiKey, timeout: 15000, maxRetries: 0 });
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8,
      temperature: 0,
      messages: [{ role: 'user', content: 'Reply with exactly: ok' }],
    });
    const text = response.content.find((part) => part.type === 'text')?.text?.trim() || '';
    return { provider: 'anthropic', ok: true, status: 'success', message: text };
  } catch (error) {
    return { provider: 'anthropic', ok: false, ...extractError(error) };
  }
}

function printResult(result) {
  if (result.ok) {
    console.log(`${result.provider}: success (${result.message})`);
    return;
  }
  console.log(`${result.provider}: failed`);
  console.log(`${result.provider} status: ${result.status}`);
  if (result.code) console.log(`${result.provider} code: ${result.code}`);
  if (result.type) console.log(`${result.provider} type: ${result.type}`);
  console.log(`${result.provider} message: ${result.message}`);
}

loadLocalEnv();
printKeyInfo();
const results = await Promise.all([testOpenAI(), testAnthropic()]);
for (const result of results) printResult(result);

const working = results.filter((result) => result.ok).map((result) => result.provider);
console.log(`working providers: ${working.length ? working.join(', ') : 'none'}`);

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import OpenAI from 'openai';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const PORT = process.env.PORT || 8787;
const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

function systemPrompt() {
  return [
    'You are a warm, evocative editor of a personal family travel magazine.',
    'Write short, vivid paragraphs that feel cinematic but intimate.',
    'Avoid clichés. Use sensory details. Never include emojis.',
    'Respond with ONLY valid JSON matching the schema. No prose outside JSON.'
  ].join(' ');
}

function userPrompt(payload) {
  const { destination, familyName, travelDate, templateId, photoCount } = payload;
  return [
    'Create a 10-page family travel magazine about ' + destination + ' for ' + familyName + '.',
    'Travel dates: ' + travelDate + '.',
    'Visual template: ' + templateId + '.',
    'Photo count provided by family: ' + photoCount + '.',
    '',
    'Return exactly this JSON shape (all string values, no markdown):',
    '{',
    '  "coverTitle": "max 3 words, evocative",',
    '  "subtitle": "max 8 words, italic feel",',
    '  "welcomeTitle": "starts with Welcome to",',
    '  "welcomeText": "2 short paragraphs separated by \\\\n\\\\n, total under 90 words",',
    '  "storyTitle": "max 5 words",',
    '  "storyText": "first sentence starts with G; one paragraph under 80 words",',
    '  "quote": "a single short evocative line, under 25 words",',
    '  "highlights": [{"title": "max 3 words", "text": "max 18 words"}, {...x3 total}],',
    '  "scenicTitle": "max 4 words",',
    '  "scenicText": "one italic caption sentence, under 25 words",',
    '  "foodTitle": "max 4 words referencing Canarian cuisine",',
    '  "foodText": "one paragraph under 60 words, mention specific local dishes",',
    '  "tips": [{"title": "max 3 words", "text": "max 18 words"}, {...x3 total}],',
    '  "aiMagicBefore": "Before — short phrase",',
    '  "aiMagicAfter": "After — short phrase about transformation",',
    '  "backCoverQuote": "one line under 20 words"',
    '}'
  ].join('\n');
}

app.post('/api/generate-magazine', async (req, res) => {
  if (!openai) {
    return res.status(503).json({ error: 'OPENAI_API_KEY not configured' });
  }
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt() },
        { role: 'user', content: userPrompt(req.body || {}) }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8
    });
    const raw = completion.choices[0].message.content;
    const parsed = JSON.parse(raw);
    res.json(parsed);
  } catch (err) {
    console.error('generate-magazine error', err && err.message ? err.message : err);
    res.status(500).json({ error: 'Generation failed' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, hasKey: !!apiKey });
});

app.listen(PORT, () => {
  console.log('Wanderbook server listening on http://localhost:' + PORT);
  if (!apiKey) {
    console.log('Warning: OPENAI_API_KEY is not set. /api/generate-magazine will return 503.');
  }
});

const router = require('express').Router();
const auth = require('../middleware/auth');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generate bio from profile data
router.post('/generate-bio', auth, async (req, res) => {
  try {
    const p = req.body;
    const prompt = `Write a warm, professional 3-sentence bio for a matrimonial profile.
Person: ${p.firstName} ${p.lastName}, ${p.gender}, age ${p.age || 'unknown'}, from ${p.city || 'India'}.
Works as ${p.designation || 'professional'} at ${p.currentCompany || 'a company'}, earns ₹${p.income ? (p.income / 100000).toFixed(1) + 'L' : 'undisclosed'}/yr.
Education: ${p.degree || ''} from ${p.undergraduateCollege || ''}.
Interests: ${(p.hobbies || []).join(', ') || 'not mentioned'}.
Religion: ${p.religion || ''}, Family: ${p.familyType || ''}, Diet: ${p.diet || ''}.
Write naturally, first person, avoid clichés. Max 80 words.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
    });
    res.json({ bio: completion.choices[0].message.content.trim() });
  } catch (err) {
    // Fallback
    res.json({ bio: `${req.body.firstName} is a dedicated ${req.body.designation || 'professional'} based in ${req.body.city || 'India'}. They value family, personal growth, and meaningful relationships. Looking forward to meeting someone who shares similar values and life goals.` });
  }
});

// Generate partner expectations
router.post('/generate-expectations', auth, async (req, res) => {
  try {
    const p = req.body;
    const prompt = `Write thoughtful partner expectations (3-4 sentences) for an Indian matrimonial profile.
Person: ${p.firstName}, ${p.gender}, age ${p.age || 'unknown'}, ${p.religion || ''}, from ${p.city || 'India'}.
Wants kids: ${p.wantKids}, Open to relocate: ${p.openToRelocate}, Diet: ${p.diet}.
Write naturally in first person, realistic and warm. Max 80 words.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
    });
    res.json({ expectations: completion.choices[0].message.content.trim() });
  } catch (err) {
    res.json({ expectations: `I am looking for a kind, ambitious partner who values family and personal growth. Compatibility in life goals and values matters more to me than anything else. Someone who is respectful, emotionally mature, and ready to build a life together.` });
  }
});

// Generate intro email for match
router.post('/generate-intro', auth, async (req, res) => {
  try {
    const { client, match } = req.body;
    const prompt = `Write a short, warm matchmaker intro email (3-4 sentences) introducing two people for a matrimonial match.
Person 1: ${client.firstName} ${client.lastName}, ${client.gender}, ${client.city}, works as ${client.designation} earning ₹${client.income ? (client.income / 100000).toFixed(1) : '?'}L/yr.
Person 2: ${match.firstName} ${match.lastName}, ${match.gender}, ${match.city}, works as ${match.designation}.
Compatibility score: ${match.score}/100 (${match.label}). Matching reasons: ${(match.reasons || []).join(', ')}.
Write from matchmaker perspective. Professional yet warm. Max 100 words.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
    });
    res.json({ intro: completion.choices[0].message.content.trim() });
  } catch (err) {
    res.json({ intro: `We are pleased to introduce ${client.firstName} and ${match.firstName} as a potential match. Both share complementary values and life goals. We believe this could be a wonderful connection worth exploring further.` });
  }
});

module.exports = router;

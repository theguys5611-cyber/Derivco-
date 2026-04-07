import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'

const router = Router()

const iconShapes = {
  chart: `<polyline points="14,44 26,28 36,36 50,18" fill="none" stroke="{icon}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="50" cy="18" r="3" fill="{icon}"/>`,

  book: `<rect x="16" y="12" width="28" height="36" rx="2" fill="none" stroke="{icon}" stroke-width="3"/>
    <line x1="24" y1="12" x2="24" y2="48" stroke="{icon}" stroke-width="2.5"/>
    <line x1="28" y1="20" x2="40" y2="20" stroke="{icon}" stroke-width="2"/>
    <line x1="28" y1="27" x2="40" y2="27" stroke="{icon}" stroke-width="2"/>
    <line x1="28" y1="34" x2="40" y2="34" stroke="{icon}" stroke-width="2"/>`,

  heart: `<path d="M32 48 L14 30 A12 12 0 0 1 32 16 A12 12 0 0 1 50 30 Z" fill="{icon}"/>
    <line x1="32" y1="26" x2="32" y2="38" stroke="{bg}" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="26" y1="32" x2="38" y2="32" stroke="{bg}" stroke-width="2.5" stroke-linecap="round"/>`,

  people: `<circle cx="22" cy="22" r="7" fill="{icon}"/>
    <circle cx="42" cy="22" r="7" fill="{icon}" opacity="0.8"/>
    <path d="M8 48 Q8 36 22 36 Q32 36 32 42" fill="{icon}" opacity="0.9"/>
    <path d="M32 42 Q32 36 42 36 Q56 36 56 48" fill="{icon}" opacity="0.7"/>`,

  cart: `<rect x="18" y="28" width="30" height="20" rx="3" fill="{icon}"/>
    <path d="M10 16 L18 16 L24 40" fill="none" stroke="{icon}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="26" cy="50" r="3" fill="{icon}"/>
    <circle cx="40" cy="50" r="3" fill="{icon}"/>
    <path d="M18 16 L48 16 L44 36 L22 36" fill="{icon}" opacity="0.7"/>`,

  code: `<polyline points="22,22 12,32 22,42" fill="none" stroke="{icon}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <polyline points="42,22 52,32 42,42" fill="none" stroke="{icon}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="36" y1="18" x2="28" y2="46" stroke="{icon}" stroke-width="2.5" stroke-linecap="round"/>`,

  star: `<polygon points="32,12 37,26 52,26 40,35 44,50 32,41 20,50 24,35 12,26 27,26" fill="{icon}"/>`,

  bolt: `<polygon points="36,10 24,34 32,34 28,54 40,30 32,30" fill="{icon}"/>`,

  shield: `<path d="M32 10 L50 18 L50 34 Q50 46 32 54 Q14 46 14 34 L14 18 Z" fill="{icon}" opacity="0.9"/>
    <polyline points="24,32 30,38 42,26" fill="none" stroke="{bg}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,

  grid: `<rect x="14" y="14" width="14" height="14" rx="2" fill="{icon}"/>
    <rect x="36" y="14" width="14" height="14" rx="2" fill="{icon}" opacity="0.8"/>
    <rect x="14" y="36" width="14" height="14" rx="2" fill="{icon}" opacity="0.8"/>
    <rect x="36" y="36" width="14" height="14" rx="2" fill="{icon}" opacity="0.6"/>`,
}

function buildSVG(bg, icon, shape) {
  const template = iconShapes[shape] || iconShapes.grid
  const iconSVG = template.replace(/{icon}/g, icon).replace(/{bg}/g, bg)
  return `<svg viewBox="0 0 64 64" width="64" height="64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" rx="14" fill="${bg}"/>${iconSVG}</svg>`
}

async function callGemini(prompt) {
  // Read keys here at call time, after dotenv has loaded
  const geminiKeys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
  ].filter(Boolean)

  console.log(`Trying ${geminiKeys.length} Gemini key(s)...`)

  if (geminiKeys.length === 0) {
    throw new Error('No Gemini API keys configured in .env')
  }

  let lastError = null
  for (const key of geminiKeys) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1024,
            responseMimeType: 'application/json',
            thinkingConfig: {
              thinkingLevel: 'minimal',
            },
          },
        }),
      }
    )
    const data = await response.json()
    if (data.error) {
      console.warn(`Gemini key ...${key.slice(-4)} failed: ${data.error.message}`)
      lastError = data.error.message
      continue
    }
    console.log(`Gemini key ...${key.slice(-4)} succeeded`)
    return data
  }
  throw new Error(lastError || 'All Gemini API keys failed')
}

router.post('/generate', authenticate, async (req, res) => {
  try {
    const { title, description } = req.body
    if (!title) return res.status(400).json({ error: 'Title required' })

    const prompt = `You are a logo design AI. Analyse this software project and make design decisions.

Project: "${title}"
Description: "${description || 'No description'}"

Return a JSON object matching this schema:
{
  "bg": "hex color for background - pick a vivid professional color",
  "icon": "hex color for icon - usually white #FFFFFF or light color",
  "shape": "one of: chart, book, heart, people, cart, code, star, bolt, shield, grid"
}

Rules for shape selection:
- chart: finance, analytics, data, investment, tracking
- book: education, learning, reading, courses, notes
- heart: health, wellness, charity, community, care
- people: social, networking, teams, HR, community
- cart: e-commerce, shopping, marketplace, retail
- code: developer tools, APIs, coding, tech infrastructure
- star: reviews, ratings, achievements, rewards, recognition
- bolt: speed, performance, energy, automation, real-time
- shield: security, privacy, auth, compliance, trust
- grid: general apps, dashboards, productivity, platforms`

    const data = await callGemini(prompt)

    const candidate = data.candidates?.[0]
    if (candidate?.finishReason && candidate.finishReason !== 'STOP') {
      console.warn('Unexpected finishReason:', candidate.finishReason)
    }

    let text = candidate?.content?.parts?.[0]?.text?.trim() || ''
    let design = { bg: '#4F46E5', icon: '#FFFFFF', shape: 'grid' }

    try {
      if (text) {
        const parsed = JSON.parse(text)
        if (parsed.bg && parsed.icon && parsed.shape) {
          design = parsed
        }
      }
    } catch (e) {
      console.log('JSON parse failed. Raw text was:', text)
    }

    const svg = buildSVG(design.bg, design.icon, design.shape)
    res.json({ svg, design })

  } catch (err) {
    console.error('Logo error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

export default router
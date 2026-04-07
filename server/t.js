import dotenv from 'dotenv'
dotenv.config()

const keys = [
  { name: 'GEMINI_API_KEY',   value: process.env.GEMINI_API_KEY },
  { name: 'GEMINI_API_KEY_2', value: process.env.GEMINI_API_KEY_2 },
  { name: 'GEMINI_API_KEY_3', value: process.env.GEMINI_API_KEY_3 },
]

async function testKey({ name, value }) {
  if (!value) {
    console.log(`⚪ ${name}: not set in .env`)
    return
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${value}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Reply with the word OK and nothing else.' }] }],
          generationConfig: {
            maxOutputTokens: 10,
            thinkingConfig: { thinkingLevel: 'minimal' },
          },
        }),
      }
    )

    const data = await response.json()

    if (data.error) {
      console.log(`❌ ${name} (...${value.slice(-4)}): ${data.error.message}`)
      return
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    console.log(`✅ ${name} (...${value.slice(-4)}): working — response: "${text}"`)
  } catch (err) {
    console.log(`❌ ${name} (...${value.slice(-4)}): fetch error — ${err.message}`)
  }
}

console.log('=== Gemini Key Test ===\n')
for (const key of keys) {
  await testKey(key)
}
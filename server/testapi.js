import dotenv from 'dotenv'
dotenv.config()

const key = process.env.GEMINI_API_KEY

console.log('=== Gemini API Test ===')
console.log('Key found:', key ? `YES (${key.substring(0, 8)}...)` : 'NO - missing from .env')

if (!key) {
  console.error('GEMINI_API_KEY not set in .env')
  process.exit(1)
}

console.log('\nTesting gemini-2.0-flash...')

try {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Say hello in one word.' }] }],
        generationConfig: { maxOutputTokens: 10 },
      }),
    }
  )

  const data = await response.json()

  console.log('Status:', response.status)

  if (response.status !== 200) {
    console.error('ERROR from Gemini:', JSON.stringify(data, null, 2))
    process.exit(1)
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  console.log('Response:', text)
  console.log('\n✅ Gemini API is working correctly')

} catch (err) {
  console.error('Fetch error:', err.message)
}

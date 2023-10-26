import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const question = await req.json()
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant."
          },
          {
            role: 'user',
            content: question,
          }
        ]
      }),
    })
    const data = await response.json()
    return NextResponse.json({ answer: data.choices[0].message.content })
  } catch (error) {
    return NextResponse.error()
  }
}
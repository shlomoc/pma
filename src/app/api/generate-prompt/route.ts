import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `You are an expert at creating detailed, actionable prompts for Claude Code, an AI coding assistant.
Given a task title and optional description, generate a comprehensive prompt that:
1. Clearly explains the feature to build
2. Specifies technical requirements
3. Mentions file structure if relevant
4. Includes acceptance criteria
5. Is ready to paste directly into Claude Code

Keep the prompt concise but thorough - aim for 2-5 sentences that capture the essence of the task.`

interface GeneratePromptRequest {
  title: string
  description?: string
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY environment variable is not set' },
        { status: 500 }
      )
    }

    const body: GeneratePromptRequest = await request.json()

    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      )
    }

    const userMessage = body.description
      ? `Task: ${body.title}\n\nDescription: ${body.description}`
      : `Task: ${body.title}`

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    })

    const generatedPrompt =
      response.content[0].type === 'text' ? response.content[0].text : ''

    return NextResponse.json({
      prompt: generatedPrompt,
    })
  } catch (error) {
    console.error('Error generating prompt:', error)

    if (error instanceof Anthropic.APIError) {
      console.error('Anthropic API Error:', {
        status: error.status,
        message: error.message,
      })
      return NextResponse.json(
        { error: `API Error: ${error.message}` },
        { status: error.status || 500 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Error: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate prompt' },
      { status: 500 }
    )
  }
}

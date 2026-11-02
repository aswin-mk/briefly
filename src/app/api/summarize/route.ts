import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { prompt, format, length } = await req.json();

    // prompt construction
    const input = `
      You are an expert research assistant. Distill the following text into a high-quality summary.
      
      Requirements:
      - Format: ${format}
      - Output: Use clean Markdown formatting. Do not use generic introductions like "Here is the summary".
      
      Text to summarize:
      """
      ${prompt}
      """
    `;

    const result = await streamText({
      model: google("gemini-3.8-flash"),
      prompt: input,
      temperature: 0.3,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI Streaming Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate summary" }),
      { status: 500 },
    );
  }
}

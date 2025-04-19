import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const prompt = `
      Create a list of three open-ended and engaging questions formatted as a single string. 
      Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, 
      and should be suitable for a diverse audience. Avoid personal or sensitive topics. 
      Example format: "What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?"
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ success: true, suggestions: text });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}

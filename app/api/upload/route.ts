import { NextResponse } from 'next/server';
import OpenAI from 'openai';
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = '';

    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      const parsePdf = pdfParse.default || pdfParse;
      const data = await parsePdf(buffer);
      text = data.text;
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      file.name.toLowerCase().endsWith('.docx')
    ) {
      const extractRawText = mammoth.extractRawText || mammoth.default?.extractRawText;
      const result = await extractRawText({ buffer });
      text = result.value;
    } else if (file.type.startsWith('image/') || /\.(jpe?g|png)$/i.test(file.name)) {
      const base64Image = buffer.toString('base64');
      const mimeType = file.type || 'image/jpeg';
      
      const openai = new OpenAI({ 
        apiKey: process.env.OPENROUTER_API_KEY_1 || '', 
        baseURL: 'https://openrouter.ai/api/v1',
      });

      const response = await openai.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Please extract all the text from this image precisely. If there are tables, preserve them in markdown. If it's a diagram, briefly summarize what it shows and list the key text." },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1500,
      });
      text = response.choices[0].message.content || '';
    } else if (file.type.startsWith('text/') || /\.(txt|md|csv)$/i.test(file.name)) {
      text = buffer.toString('utf-8');
    } else {
      return NextResponse.json({ error: `Unsupported file type: ${file.type || file.name}` }, { status: 400 });
    }

    return NextResponse.json({ text: text.trim() });
  } catch (error: any) {
    console.error('File Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process file' }, { status: 500 });
  }
}

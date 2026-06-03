import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const systemInstruction = `You are a highly skilled technical architect and documentation specialist.
The user provides an image of a diagram, architecture flow, or mind map from their digital whiteboard.
Your job is to analyze the image and write a clear, structured Markdown explanation of the system or concepts depicted.

Include:
- A brief high-level summary.
- A breakdown of the key components (nodes/entities).
- An explanation of the relationships or data flow between them.

Format your output in clean Markdown. Be concise but insightful.`;

export async function POST(req: NextRequest) {
    try {
        const { imageBase64 } = await req.json();

        if (!imageBase64) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        // Mocked response if no API key
        if (!apiKey) {
            console.warn("No GEMINI_API_KEY found, returning mocked Explain-Diagram response.");
            const mockMarkdown = `
# Mocked Architecture Summary

This is a mocked response because the \`GEMINI_API_KEY\` is not set in the environment variables.

### Components
- **Client App:** The frontend user interface.
- **API Gateway:** Routes incoming requests.
- **Database:** Stores persistent data.

### Data Flow
1. The user interacts with the Client App.
2. Requests are sent to the API Gateway.
3. The gateway fetches or updates data in the Database.

*Add your API key to see the real AI analysis!*
`;
            return NextResponse.json({ markdown: mockMarkdown });
        }

        const ai = new GoogleGenAI({ apiKey });

        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            inlineData: {
                                data: base64Data,
                                mimeType: "image/png"
                            }
                        },
                        {
                            text: "Explain this diagram in Markdown."
                        }
                    ]
                }
            ],
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.3,
            }
        });

        const markdown = response.text || "No explanation generated.";

        return NextResponse.json({ markdown });
    } catch (error: any) {
        console.error("Diagram OCR AI Error:", error);
        return NextResponse.json({ error: error.message || "Failed to process image" }, { status: 500 });
    }
}

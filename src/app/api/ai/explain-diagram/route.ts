import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/features/auth/config";

const systemInstruction = `You are a highly skilled technical architect and documentation specialist.
The user provides an image of a diagram, architecture flow, or mind map from their digital whiteboard.
Your job is to analyze the image and write a clear, structured Markdown explanation of the system or concepts depicted.

Include:
- A brief high-level summary.
- A breakdown of the key components (nodes/entities).
- An explanation of the relationships or data flow between them.

Format your output in clean Markdown. Be concise but insightful.`;

// F08: Max base64 image size (~4MB raw → ~5.3MB base64)
const MAX_IMAGE_BASE64_LENGTH = 6_000_000;

export async function POST(req: NextRequest) {
    try {
        // F08: Require authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { imageBase64 } = await req.json();

        if (!imageBase64 || typeof imageBase64 !== "string") {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        // F08: Bound input size
        if (imageBase64.length > MAX_IMAGE_BASE64_LENGTH) {
            return NextResponse.json({ error: "Image too large" }, { status: 413 });
        }

        // F08: Validate MIME type
        if (!imageBase64.startsWith("data:image/png;base64,") && !imageBase64.startsWith("data:image/jpeg;base64,") && !imageBase64.startsWith("data:image/webp;base64,")) {
            return NextResponse.json({ error: "Invalid image format. Only PNG, JPEG, and WebP are accepted." }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        // F08: Honest unavailable state
        if (!apiKey) {
            if (process.env.NODE_ENV === "development") {
                console.warn("No GEMINI_API_KEY found, returning mocked Explain-Diagram response (development only).");
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
                return NextResponse.json({ markdown: mockMarkdown, _mock: true });
            }
            return NextResponse.json({ error: "AI service is not configured" }, { status: 503 });
        }

        const ai = new GoogleGenAI({ apiKey });

        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const mimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : "image/png";

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            inlineData: {
                                data: base64Data,
                                mimeType: mimeType
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
    } catch (error: unknown) {
        console.error("Diagram OCR AI Error:", error instanceof Error ? error.message : error);
        return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
    }
}

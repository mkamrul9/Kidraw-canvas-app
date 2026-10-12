import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/features/auth/config";

const systemInstruction = `You are a visual design assistant for a digital whiteboard.
The user provides an image of a hand-drawn sketch from their canvas. Your job is to analyze the drawn shapes and convert them into an array of structured JSON objects representing perfect vector shapes.

The output MUST be valid JSON (do not wrap it in markdown code blocks). It should be an array of objects.

Valid shape types are: 'rectangle', 'ellipse', 'triangle', 'diamond', 'arrow', 'text'.

Each object should have:
- type (string)
- x (number, approximate relative bounding box X)
- y (number, approximate relative bounding box Y)
- width (number)
- height (number)
- fill (string, default "#ffffff")
- text (string, only if type is 'text')

Return ONLY the raw JSON array. Example:
[
  { "type": "rectangle", "x": 0, "y": 0, "width": 200, "height": 100, "fill": "#f8fafc" },
  { "type": "arrow", "x": 100, "y": 100, "width": 50, "height": 50, "fill": "#3b82f6" }
]`;

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
                console.warn("No GEMINI_API_KEY found, returning mocked Sketch-to-Vector response (development only).");
                return NextResponse.json({
                    layers: [
                        { type: "rectangle", x: 50, y: 50, width: 250, height: 150, fill: "#e0f2fe" },
                        { type: "text", x: 75, y: 100, width: 200, height: 50, fill: "#1e293b", text: "Mocked AI Result" }
                    ],
                    _mock: true
                });
            }
            return NextResponse.json({ error: "AI service is not configured" }, { status: 503 });
        }

        const ai = new GoogleGenAI({ apiKey });

        // Strip the data:image/xxx;base64, prefix
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
                            text: "Analyze this sketch and output the JSON array of shapes."
                        }
                    ]
                }
            ],
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.1,
            }
        });

        const textResponse = response.text || "[]";
        const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

        let layers;
        try {
            layers = JSON.parse(cleanJson);
        } catch {
            return NextResponse.json({ error: "AI returned malformed output" }, { status: 502 });
        }

        if (!Array.isArray(layers)) {
            return NextResponse.json({ error: "AI returned unexpected format" }, { status: 502 });
        }

        return NextResponse.json({ layers });
    } catch (error: unknown) {
        console.error("Sketch-to-Vector AI Error:", error instanceof Error ? error.message : error);
        return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

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

export async function POST(req: NextRequest) {
    try {
        const { imageBase64 } = await req.json();

        if (!imageBase64) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        // If no API key is provided, we return a mocked response
        if (!apiKey) {
            console.warn("No GEMINI_API_KEY found, returning mocked Sketch-to-Vector response.");
            return NextResponse.json({
                layers: [
                    { type: "rectangle", x: 50, y: 50, width: 250, height: 150, fill: "#e0f2fe" },
                    { type: "text", x: 75, y: 100, width: 200, height: 50, fill: "#1e293b", text: "Mocked AI Result" }
                ]
            });
        }

        const ai = new GoogleGenAI({ apiKey });

        // Strip the data:image/png;base64, prefix
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
        // Clean up potential markdown formatting if Gemini disobeys
        const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

        const layers = JSON.parse(cleanJson);

        return NextResponse.json({ layers });
    } catch (error: any) {
        console.error("Sketch-to-Vector AI Error:", error);
        return NextResponse.json({ error: error.message || "Failed to process image" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const systemInstruction = `You are a technical architecture assistant for a digital whiteboard.
The user provides a text prompt describing a flow, architecture, ERD, or diagram.
Your job is to generate a structured JSON array of nodes representing that diagram.

The output MUST be valid JSON (do not wrap it in markdown code blocks). It should be an array of objects.
Calculate approximate logical X and Y coordinates so the diagram renders beautifully out of the box (e.g., standard horizontal or vertical flow, spacing of ~200px between nodes).

Valid shape types are: 'rectangle', 'ellipse', 'diamond', 'arrow', 'text'.
For nodes, use 'rectangle' or 'ellipse', provide 'width', 'height', 'fill', and 'text'.
For edges/connections, use 'arrow', provide 'x', 'y' (start point), and 'width', 'height' (end point offset from start).

Example output:
[
  { "type": "rectangle", "id": "n1", "x": 0, "y": 0, "width": 150, "height": 60, "fill": "#f8fafc", "text": "User" },
  { "type": "rectangle", "id": "n2", "x": 250, "y": 0, "width": 150, "height": 60, "fill": "#f8fafc", "text": "API Gateway" },
  { "type": "arrow", "x": 150, "y": 30, "width": 100, "height": 0, "fill": "#94a3b8" }
]`;

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        // If no API key is provided, we return a mocked response
        if (!apiKey) {
            console.warn("No GEMINI_API_KEY found, returning mocked Text-to-Diagram response.");
            return NextResponse.json({
                layers: [
                    { type: "rectangle", x: 0, y: 0, width: 150, height: 60, fill: "#e0f2fe", text: "Mock Input" },
                    { type: "arrow", x: 150, y: 30, width: 100, height: 0, fill: "#94a3b8" },
                    { type: "rectangle", x: 250, y: 0, width: 150, "height": 60, fill: "#e0f2fe", text: "Mock Output" }
                ]
            });
        }

        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.3,
            }
        });

        const textResponse = response.text || "[]";
        const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

        const layers = JSON.parse(cleanJson);

        return NextResponse.json({ layers });
    } catch (error: any) {
        console.error("Text-to-Diagram AI Error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate diagram" }, { status: 500 });
    }
}

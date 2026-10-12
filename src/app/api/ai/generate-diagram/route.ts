import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/features/auth/config";

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

const MAX_PROMPT_LENGTH = 5000;

export async function POST(req: NextRequest) {
    try {
        // F08: Require authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { prompt } = await req.json();

        if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
            return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
        }

        // F08: Bound input size
        if (prompt.length > MAX_PROMPT_LENGTH) {
            return NextResponse.json({ error: `Prompt too long. Maximum ${MAX_PROMPT_LENGTH} characters.` }, { status: 413 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        // F08: Return honest unavailable state instead of mock results in production
        if (!apiKey) {
            if (process.env.NODE_ENV === "development") {
                console.warn("No GEMINI_API_KEY found, returning mocked Text-to-Diagram response (development only).");
                return NextResponse.json({
                    layers: [
                        { type: "rectangle", x: 0, y: 0, width: 150, height: 60, fill: "#e0f2fe", text: "Mock Input" },
                        { type: "arrow", x: 150, y: 30, width: 100, height: 0, fill: "#94a3b8" },
                        { type: "rectangle", x: 250, y: 0, width: 150, height: 60, fill: "#e0f2fe", text: "Mock Output" }
                    ],
                    _mock: true
                });
            }
            return NextResponse.json({ error: "AI service is not configured" }, { status: 503 });
        }

        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt.trim(),
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.3,
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
        console.error("Text-to-Diagram AI Error:", error instanceof Error ? error.message : error);
        return NextResponse.json({ error: "Failed to generate diagram" }, { status: 500 });
    }
}

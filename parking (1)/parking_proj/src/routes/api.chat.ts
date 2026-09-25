import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { z } from "zod";

const bodySchema = z.object({ messages: z.array(z.custom<UIMessage>()).max(30) });

export const Route = createFileRoute("/api/chat")({
  server: { handlers: { POST: async ({ request }) => {
    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ message: "Please send a shorter parking question." }, { status: 400 });
    const key = process.env['LOVABLE_API_KEY'];
    if (!key) return Response.json({ message: "Parking AI is not configured right now." }, { status: 401 });
    const lovable = createOpenAI({ baseURL: "https://ai.gateway.lovable.dev/v1", apiKey: key, headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" } });
    const result = streamText({
      model: lovable.responses("openai/gpt-6-astra"),
      system: "You are the concise parking concierge for ParkGrid One at 18 High Street, Baner, Pune. Use only these facility facts: 150 slots, 73 available, 62 occupied, 15 reserved; 3 floors; open 24/7; standard parking ₹50/hour plus 18% tax; EV bays ₹70/hour and charging ₹12/kWh; six chargers; QR entry; speed limit 8 km/h; entrance opposite High Street Food District; contact +91 20 4827 2400. If asked for private booking data, explain that account lookup is not connected in this demo. Never invent policies. Keep answers under 120 words and use helpful markdown.",
      messages: await convertToModelMessages(parsed.data.messages),
      providerOptions: { openai: { forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", store: false, include: ["reasoning.encrypted_content"] } },
    });
    return result.toUIMessageStreamResponse({ originalMessages: parsed.data.messages });
  } } },
});
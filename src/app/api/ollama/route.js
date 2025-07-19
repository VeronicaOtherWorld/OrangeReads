import clientPromise from "@/lib/mongo";
import { nanoid } from "nanoid";

export async function POST(req) {
  const {
    prompt,
    userId = "anonymous",
    bookId = null,
    context = "general",
    promptType = "user",
  } = await req.json();

  const finalPrompt = `Please answer briefly and concisely. Limit to 3 sentences.\nUser: ${prompt}`;
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "phi3:3.8b",
      prompt: finalPrompt,
      stream: false,
      num_predict: 60,
    }),
  });

  const data = await response.json();
  const aiRes = data.response;
  console.log("Ollama 返回数据：", data);

  // save to db

  try {
    const client = await clientPromise;
    const db = await client.db();
    await db.collection("AIBot").insertOne({
      id: "ai_" + nanoid(8),
      userId,
      bookId,
      prompt,
      response: aiRes,
      context,
      promptType,
      createdAt: new Date(),
    });
  } catch (error) {}
  return new Response(JSON.stringify({ response: data.response }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

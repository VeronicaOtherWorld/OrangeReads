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

  const finalPrompt = `You are a friendly book expert AI that helps users with questions about books, literature, and authors only.
If the user's question is unrelated to books or literature, politely decline to answer and remind them that you only discuss books.
Respond briefly in no more than 3 sentences.
`;

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
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

export async function OPTIONS(req) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

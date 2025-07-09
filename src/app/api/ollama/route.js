export async function POST(req) {
  const { prompt } = await req.json();

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "phi3:3.8b",
      prompt,
      stream: false,
    }),
  });

  const data = await response.json();
  console.log("Ollama 返回数据：", data);
  return new Response(JSON.stringify({ response: data.response }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

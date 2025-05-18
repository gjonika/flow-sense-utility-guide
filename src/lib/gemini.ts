export async function fetchGeminiInsights(apiKey: string, readings: any[]) {
  const prompt = `
    Based on the following utility readings, generate 3 brief insights or tips. 
    Structure your response as a bullet list. Here are the readings:
    ${JSON.stringify(readings, null, 2)}
  `;

  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No insights generated.";
}

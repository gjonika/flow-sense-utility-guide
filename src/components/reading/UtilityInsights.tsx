import { useEffect, useState } from "react";
import { fetchGeminiInsights } from "@/lib/gemini";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function UtilityInsights() {
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || "");
  const [insights, setInsights] = useState<string>("");

  // Fake readings; replace with real data from state or props
  const sampleReadings = [
    { type: "electricity", current: 210, previous: 190 },
    { type: "gas", current: 48, previous: 50 },
    { type: "water", current: 320, previous: 310 }
  ];

  useEffect(() => {
    if (apiKey) {
      fetchGeminiInsights(apiKey, sampleReadings).then(setInsights);
    }
  }, [apiKey]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Utility Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Enter Gemini API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        {insights ? (
          <pre className="text-sm whitespace-pre-wrap text-muted-foreground">{insights}</pre>
        ) : (
          <p className="text-muted-foreground text-sm">Waiting for insights...</p>
        )}
      </CardContent>
    </Card>
  );
}

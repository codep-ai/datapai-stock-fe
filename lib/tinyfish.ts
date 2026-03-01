const API_KEY = process.env.TINYFISH_API_KEY!;
const BASE_URL =
  process.env.TINYFISH_BASE_URL || "https://agent.tinyfish.ai";

export interface PageContent {
  title: string;
  text: string;
}

/**
 * Parse a TinyFish SSE stream.
 * Events arrive as "data: {...}\n\n" lines.
 * We collect all text/content chunks and the final result.
 */
async function parseSseStream(stream: ReadableStream<Uint8Array>): Promise<PageContent> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let collectedText = "";
  let title = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // Process complete SSE lines
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? ""; // keep incomplete last line

    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const jsonStr = line.slice(5).trim();
      if (!jsonStr || jsonStr === "[DONE]") continue;

      try {
        const event = JSON.parse(jsonStr);

        // Collect any text content from progress events
        if (event.type === "content" || event.type === "text") {
          collectedText += (event.content ?? event.text ?? "") + " ";
        }

        // Final result event
        if (event.type === "done" || event.result) {
          const result = event.result ?? event;
          title = result.title ?? title;
          const finalText =
            result.text ?? result.content ?? result.extracted_text ?? result.markdown ?? "";
          if (finalText) collectedText = finalText;
        }

        // Page title from metadata events
        if (event.type === "page_info" || event.title) {
          title = event.title ?? title;
        }
      } catch {
        // non-JSON SSE line, skip
      }
    }
  }

  const text = collectedText.replace(/\s+/g, " ").trim();
  return { title, text };
}

async function callTinyFish(url: string): Promise<PageContent> {
  const endpoint = `${BASE_URL}/v1/automation/run-sse`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    body: JSON.stringify({
      url,
      goal: "Extract all visible text content from this page, including news releases, press releases, headlines, dates, and any investor relations content. Return as plain text.",
      proxy_config: { enabled: false },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`TinyFish error ${res.status}: ${errBody}`);
  }

  if (!res.body) {
    throw new Error("TinyFish returned no response body");
  }

  return parseSseStream(res.body);
}

export async function fetchPageText(url: string): Promise<PageContent> {
  try {
    return await callTinyFish(url);
  } catch (err) {
    // Retry once on failure
    console.warn(`TinyFish retry for ${url}:`, err);
    return await callTinyFish(url);
  }
}

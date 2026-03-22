export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return Response.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return Response.json({ error: "Invalid URL protocol" }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: { "User-Agent": "PromptLens/1.0" },
    });

    if (!response.ok) {
      return Response.json({ error: "Failed to fetch image" }, { status: response.status });
    }

    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    if (!contentType.startsWith("image/")) {
      return Response.json({ error: "URL does not point to an image" }, { status: 400 });
    }

    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > 5 * 1024 * 1024) {
      return Response.json({ error: "Image too large. Maximum 5MB." }, { status: 413 });
    }

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return Response.json({ error: "Failed to proxy image" }, { status: 500 });
  }
}

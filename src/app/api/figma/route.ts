import { NextRequest, NextResponse } from "next/server";

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  characters?: string;
  style?: {
    fontSize?: number;
    fontWeight?: number;
    fontFamily?: string;
  };
  children?: FigmaNode[];
}

interface TextLayer {
  id: string;
  name: string;
  characters: string;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
}

function extractTextLayers(node: FigmaNode, layers: TextLayer[] = []): TextLayer[] {
  if (node.type === "TEXT" && node.characters) {
    layers.push({
      id: node.id,
      name: node.name,
      characters: node.characters,
      fontSize: node.style?.fontSize,
      fontWeight: node.style?.fontWeight,
      fontFamily: node.style?.fontFamily,
    });
  }
  if (node.children) {
    for (const child of node.children) {
      extractTextLayers(child, layers);
    }
  }
  return layers;
}

export async function POST(request: NextRequest) {
  const token = process.env.FIGMA_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json({ error: "FIGMA_ACCESS_TOKEN not configured" }, { status: 500 });
  }

  try {
    const { fileKey, nodeId } = (await request.json()) as {
      fileKey: string;
      nodeId?: string;
    };

    if (!fileKey) {
      return NextResponse.json({ error: "fileKey required" }, { status: 400 });
    }

    // Fetch file structure
    const fileUrl = nodeId
      ? `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(nodeId)}`
      : `https://api.figma.com/v1/files/${fileKey}`;

    const fileRes = await fetch(fileUrl, {
      headers: { "X-FIGMA-TOKEN": token },
    });

    if (!fileRes.ok) {
      const err = await fileRes.text();
      return NextResponse.json({ error: `Figma API error: ${err}` }, { status: fileRes.status });
    }

    const fileData = await fileRes.json();

    // Extract text layers
    const document = nodeId
      ? Object.values(fileData.nodes as Record<string, { document: FigmaNode }>)[0]?.document
      : fileData.document;

    const textLayers = document ? extractTextLayers(document) : [];

    // Get image preview
    const imageUrl = `https://api.figma.com/v1/images/${fileKey}?ids=${nodeId || Object.keys(fileData.document?.children?.[0] ? { [fileData.document.children[0].id]: true } : {})[0] || ""}&format=png&scale=2`;

    let previewUrl = "";
    try {
      const imgRes = await fetch(imageUrl, {
        headers: { "X-FIGMA-TOKEN": token },
      });
      if (imgRes.ok) {
        const imgData = await imgRes.json();
        previewUrl = Object.values(imgData.images as Record<string, string>)[0] || "";
      }
    } catch {
      // Preview optional
    }

    return NextResponse.json({
      name: fileData.name || "Untitled",
      textLayers,
      previewUrl,
    });
  } catch (error) {
    console.error("Figma API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

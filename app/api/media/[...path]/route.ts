import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || "media";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const filePath = path.join("/");
  const origin = `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${filePath}`;

  try {
    const res = await fetch(origin);
    if (!res.ok) return new NextResponse("Not found", { status: 404 });

    const contentType = res.headers.get("content-type") ?? "application/octet-stream";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Error", { status: 502 });
  }
}

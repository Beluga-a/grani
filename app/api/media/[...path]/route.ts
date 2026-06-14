import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || "media";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const filePath = path.join("/");
  const origin = `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${filePath}`;

  // Пробрасываем Range-заголовок — браузер требует его для видео (перемотка)
  const upstreamHeaders: HeadersInit = {};
  const range = req.headers.get("range");
  if (range) upstreamHeaders["Range"] = range;

  try {
    const res = await fetch(origin, { headers: upstreamHeaders });
    if (!res.ok && res.status !== 206) {
      return new NextResponse("Not found", { status: 404 });
    }

    const resHeaders: Record<string, string> = {
      "Cache-Control": "public, max-age=31536000, immutable",
    };
    for (const key of ["content-type", "content-length", "content-range", "accept-ranges"]) {
      const val = res.headers.get(key);
      if (val) resHeaders[key] = val;
    }

    // Стримим тело — не буферизуем весь файл в памяти
    return new NextResponse(res.body, { status: res.status, headers: resHeaders });
  } catch {
    return new NextResponse("Error", { status: 502 });
  }
}

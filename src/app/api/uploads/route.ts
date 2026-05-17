import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const BUCKET = "certificates";
const ALLOWED_FOLDERS = new Set(["profile", "projects", "certs", "skills"]);

const sanitizeFileName = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]/g, "_");

export async function POST(request: Request) {
  const formData = await request.formData();
  const folder = formData.get("folder");
  const file = formData.get("file");

  if (typeof folder !== "string" || !ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json({ error: "Invalid upload folder." }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required." }, { status: 400 });
  }

  const safeName = sanitizeFileName(file.name || "upload");
  const path = `${folder}/${Date.now()}_${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  let supabaseAdmin;
  try {
    supabaseAdmin = getSupabaseAdmin();
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const publicUrl = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

  return NextResponse.json({ publicUrl, path });
}

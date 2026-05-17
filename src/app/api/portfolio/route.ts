import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin() as any;

    // 1. Fetch Profile
    const { data: profiles } = await supabase
      .from("Profile")
      .select("*")
      .limit(1) as { data: any[] | null };
    const profile = profiles && profiles.length > 0 ? profiles[0] : null;
    
    // 2. Fetch Projects (ordered)
    const { data: projects } = await supabase
      .from("Project")
      .select("*")
      .order("order", { ascending: true }) as { data: any[] | null };

    // 3. Fetch Certificates (ordered)
    const { data: certificates } = await supabase
      .from("Certificate")
      .select("*")
      .order("order", { ascending: true }) as { data: any[] | null };

    // 4. Fetch Skills (ordered)
    const { data: skills } = await supabase
      .from("Skill")
      .select("*")
      .order("order", { ascending: true }) as { data: any[] | null };

    // 5. Fetch Extracurriculars (ordered)
    const { data: extracurriculars } = await supabase
      .from("Extracurricular")
      .select("*")
      .order("order", { ascending: true }) as { data: any[] | null };

    // 6. Fetch Interests (ordered)
    const { data: interests } = await supabase
      .from("Interest")
      .select("*")
      .order("order", { ascending: true }) as { data: any[] | null };

    return NextResponse.json({
      profile: profile || null,
      projects: (projects || []).map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        tech: p.technologies || [],
        githubUrl: p.github || "",
        liveUrl: p.url || "",
        imageUrl: p.image || "",
      })),
      certificates: (certificates || []).map((c) => ({
        id: c.id,
        name: c.title,
        issuer: c.issuer,
        imageUrl: c.image || "",
        fileUrl: c.url || "",
        filePath: c.url ? c.url.substring(c.url.indexOf("certs/")) : "",
      })),
      skills: (skills || []).map((s) => ({
        id: s.id,
        name: s.name,
        category: s.category || "Programming/Web",
        logoUrl: s.icon || "",
      })),
      extracurriculars: (extracurriculars || []).map((e) => ({
        id: e.id,
        text: e.text,
      })),
      interests: (interests || []).map((i) => ({
        id: i.id,
        name: i.name,
        logoUrl: i.logoUrl || "",
        domain: i.domain || "",
      })),
    });
  } catch (error) {
    console.error("GET /api/portfolio error:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin() as any;

    switch (action) {
      case "save_profile": {
        const { tagline, bio, email, githubUrl, linkedinUrl, resumeUrl, avatarUrl, phone } = data;
        const { error } = await supabase
          .from("Profile")
          .upsert({
            id: "default",
            tagline,
            bio,
            email,
            githubUrl,
            linkedinUrl,
            resumeUrl,
            avatarUrl,
            phone: phone || "",
            updatedAt: new Date().toISOString(),
          });
        if (error) throw error;
        break;
      }

      case "save_projects": {
        const projects = data || [];
        const { error: delErr } = await supabase.from("Project").delete().neq("id", "");
        if (delErr) throw delErr;

        if (projects.length > 0) {
          const formatted = projects.map((proj: any, idx: number) => ({
            id: proj.id,
            title: proj.title,
            description: proj.description,
            url: proj.liveUrl || null,
            github: proj.githubUrl || null,
            image: proj.imageUrl || null,
            technologies: proj.tech || [],
            tags: [],
            order: idx,
            updatedAt: new Date().toISOString(),
          }));
          const { error: insErr } = await supabase.from("Project").insert(formatted);
          if (insErr) throw insErr;
        }
        break;
      }

      case "save_certificates": {
        const certs = data || [];
        const { error: delErr } = await supabase.from("Certificate").delete().neq("id", "");
        if (delErr) throw delErr;

        if (certs.length > 0) {
          const formatted = certs.map((cert: any, idx: number) => ({
            id: cert.id,
            title: cert.name,
            issuer: cert.issuer,
            url: cert.fileUrl || null,
            image: cert.imageUrl || null,
            order: idx,
            updatedAt: new Date().toISOString(),
          }));
          const { error: insErr } = await supabase.from("Certificate").insert(formatted);
          if (insErr) throw insErr;
        }
        break;
      }

      case "save_skills": {
        const skills = data || [];
        const { error: delErr } = await supabase.from("Skill").delete().neq("id", "");
        if (delErr) throw delErr;

        if (skills.length > 0) {
          const formatted = skills.map((skill: any, idx: number) => ({
            id: skill.id,
            name: skill.name,
            category: skill.category,
            icon: skill.logoUrl || null,
            order: idx,
            updatedAt: new Date().toISOString(),
          }));
          const { error: insErr } = await supabase.from("Skill").insert(formatted);
          if (insErr) throw insErr;
        }
        break;
      }

      case "save_extracurriculars": {
        const extras = data || [];
        const { error: delErr } = await supabase.from("Extracurricular").delete().neq("id", "");
        if (delErr) throw delErr;

        if (extras.length > 0) {
          const formatted = extras.map((extra: any, idx: number) => ({
            id: extra.id,
            text: extra.text,
            order: idx,
            updatedAt: new Date().toISOString(),
          }));
          const { error: insErr } = await supabase.from("Extracurricular").insert(formatted);
          if (insErr) throw insErr;
        }
        break;
      }

      case "save_interests": {
        const interests = data || [];
        const { error: delErr } = await supabase.from("Interest").delete().neq("id", "");
        if (delErr) throw delErr;

        if (interests.length > 0) {
          const formatted = interests.map((int: any, idx: number) => ({
            id: int.id,
            name: int.name,
            logoUrl: int.logoUrl || null,
            domain: int.domain || null,
            order: idx,
            updatedAt: new Date().toISOString(),
          }));
          const { error: insErr } = await supabase.from("Interest").insert(formatted);
          if (insErr) throw insErr;
        }
        break;
      }

      default: {
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/portfolio error:", error);
    return NextResponse.json({ error: "Failed to save portfolio data" }, { status: 500 });
  }
}

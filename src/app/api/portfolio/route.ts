import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin() as any;

    // Run all queries in parallel for much faster loading
    const [
      { data: profiles },
      { data: admins },
      { data: educationBeads },
      { data: projects },
      { data: certificates },
      { data: skills },
      { data: extracurriculars },
      { data: interests }
    ] = await Promise.all([
      supabase.from("Profile").select("*").limit(1),
      supabase.from("Admin").select("secretTrigger, terminalPassword").limit(1),
      supabase.from("EducationBead").select("*").order("order", { ascending: true }),
      supabase.from("Project").select("*").order("order", { ascending: true }),
      supabase.from("Certificate").select("*").order("order", { ascending: true }),
      supabase.from("Skill").select("*").order("order", { ascending: true }),
      supabase.from("Extracurricular").select("*").order("order", { ascending: true }),
      supabase.from("Interest").select("*").order("order", { ascending: true })
    ]) as any[];

    const profile = profiles && profiles.length > 0 ? profiles[0] : null;
    const adminTrigger = admins && admins.length > 0 ? admins[0].secretTrigger : null;
    const terminalPassword = admins && admins.length > 0 ? admins[0].terminalPassword : null;

    let mappedProfile = null;
    if (profile) {
      let bio = profile.bio || "";
      let phone = profile.phone || "";
      let careerGoals = profile.careerGoals || "";
      let education = profile.education || "";

      if (bio.includes("\n\n[META_START]")) {
        const metaStart = bio.indexOf("\n\n[META_START]");
        const metaEnd = bio.lastIndexOf("[META_END]");
        if (metaEnd > metaStart + 14) {
          try {
            const metaStr = bio.substring(metaStart + 14, metaEnd);
            const parsed = JSON.parse(metaStr);
            if (typeof parsed.phone === "string") phone = parsed.phone;
            if (typeof parsed.careerGoals === "string") careerGoals = parsed.careerGoals;
            if (typeof parsed.education === "string") education = parsed.education;
            if (typeof parsed.name === "string") profile.name = parsed.name;
            if (typeof parsed.greeting === "string") profile.greeting = parsed.greeting;
            if (typeof parsed.email === "string") profile.email = parsed.email;
            if (typeof parsed.nameFontSize === "number") profile.nameFontSize = parsed.nameFontSize;
            if (typeof parsed.taglineFontSize === "number") profile.taglineFontSize = parsed.taglineFontSize;
            bio = bio.substring(0, metaStart); // Strip the meta block from user display
          } catch (e) {
            console.error("Failed to parse bio metadata fallback", e);
          }
        }
      }

      mappedProfile = {
        ...profile,
        bio,
        phone,
        careerGoals,
        education,
      };
    }

    return NextResponse.json({
      adminTrigger,
      terminalPassword,
      profile: mappedProfile,
      educationBeads: (educationBeads || []).map((b: any) => {
        let content = b.content || "";
        let parentId = null;
        let fileUrl = "";
        
        if (content.startsWith("[BEAD_META:")) {
          const metaEnd = content.indexOf("]META_END]");
          if (metaEnd > 11) {
            try {
              const metaStr = content.substring(11, metaEnd);
              const parsed = JSON.parse(metaStr);
              if (parsed.parentId) parentId = parsed.parentId;
              if (parsed.fileUrl) fileUrl = parsed.fileUrl;
              content = content.substring(metaEnd + 10);
            } catch(e) {
              // fallback
            }
          }
        } else if (content.startsWith("[parent:")) {
          const closeBracketIdx = content.indexOf("]");
          if (closeBracketIdx > 8) {
            parentId = content.substring(8, closeBracketIdx);
            content = content.substring(closeBracketIdx + 1);
          }
        }
        
        return {
          id: b.id,
          heading: b.heading,
          content,
          color: b.color,
          parentId,
          fileUrl,
        };
      }),
      projects: (projects || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        tech: p.technologies || [],
        githubUrl: p.github || "",
        liveUrl: p.url || "",
        imageUrl: p.image || "",
      })),
      certificates: (certificates || []).map((c: any) => ({
        id: c.id,
        name: c.title,
        issuer: c.issuer,
        imageUrl: c.image || "",
        fileUrl: c.url || "",
        filePath: c.url ? c.url.substring(c.url.indexOf("certs/")) : "",
      })),
      skills: (skills || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        category: s.category || "Programming/Web",
        logoUrl: s.icon || "",
      })),
      extracurriculars: (extracurriculars || []).map((e: any) => {
        let text = e.text || "";
        let fileUrl = e.url || "";
        
        // Try decoding URL from text if URL column is missing in DB
        if (!fileUrl && text.startsWith("[attach:")) {
          const closeBracketIdx = text.indexOf("]");
          if (closeBracketIdx > 8) {
            fileUrl = text.substring(8, closeBracketIdx);
            text = text.substring(closeBracketIdx + 1);
          }
        }
        
        return {
          id: e.id,
          text,
          fileUrl,
          filePath: fileUrl ? fileUrl.substring(fileUrl.indexOf("certs/")) : "",
        };
      }),
      interests: (interests || []).map((i: any) => ({
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
      case "save_admin_settings": {
        const { trigger, terminalPassword } = data;
        if (!trigger || typeof trigger !== "string" || !trigger.trim()) {
          return NextResponse.json({ error: "Invalid trigger" }, { status: 400 });
        }
        if (!terminalPassword || typeof terminalPassword !== "string" || !terminalPassword.trim()) {
          return NextResponse.json({ error: "Invalid terminal password" }, { status: 400 });
        }
        
        // Find existing admin or upsert
        const { data: admins } = await supabase
          .from("Admin")
          .select("*")
          .limit(1);
          
        if (admins && admins.length > 0) {
          const { error } = await supabase
            .from("Admin")
            .update({ secretTrigger: trigger.trim(), terminalPassword: terminalPassword.trim(), updatedAt: new Date().toISOString() })
            .eq("id", admins[0].id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("Admin")
            .insert({
              id: "default-admin",
              username: "admin",
              passwordHash: "$2b$10$O4eG0.XoH250b/vFsz0VjupUj2o8G1n6Y0hC4K9n1y6k/6P2V/8eW",
              secretTrigger: trigger.trim(),
              terminalPassword: terminalPassword.trim(),
              updatedAt: new Date().toISOString()
            });
          if (error) throw error;
        }
        break;
      }

      case "save_profile": {
        const { tagline, bio, email, githubUrl, linkedinUrl, resumeUrl, avatarUrl, phone, careerGoals, education, name, greeting, nameFontSize, taglineFontSize } = data;
        const payload: any = {
          id: "default",
          tagline: tagline || "",
          bio: bio || "",
          email: email || "",
          githubUrl: githubUrl || "",
          linkedinUrl: linkedinUrl || "",
          resumeUrl: resumeUrl || "",
          avatarUrl: avatarUrl || "",
          updatedAt: new Date().toISOString(),
        };

        // Try upserting with all columns first
        let { error } = await supabase
          .from("Profile")
          .upsert({
            ...payload,
            phone: phone || "",
            careerGoals: careerGoals || "",
            education: education || "",
          });

        if (error) {
          console.warn("⚠️ Full Profile upsert failed, retrying with graceful metadata encoding in bio. Error:", error.message);
          
          const meta = { phone, careerGoals, education, name, greeting, nameFontSize, taglineFontSize, email };
          const encodedBio = `${bio || ""}\n\n[META_START]${JSON.stringify(meta)}[META_END]`;
          
          let retry = await supabase.from("Profile").upsert({
            ...payload,
            bio: encodedBio,
          });
          
          error = retry.error;
        }

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
            url: extra.fileUrl || null,
            order: idx,
            updatedAt: new Date().toISOString(),
          }));
          let { error: insErr } = await supabase.from("Extracurricular").insert(formatted);
          
          if (insErr) {
            console.warn("⚠️ Extracurricular insert failed with url, retrying fallback with encoded text column. Error:", insErr.message);
            // Fallback: encode the fileUrl into the text field, e.g. [attach:https://...]Actual text
            const fallbackFormatted = formatted.map(({ id, text, url, order, updatedAt }: any) => {
              const encodedText = url ? `[attach:${url}]${text}` : text;
              return {
                id,
                text: encodedText,
                order,
                updatedAt,
              };
            });
            const retry = await supabase.from("Extracurricular").insert(fallbackFormatted);
            insErr = retry.error;
          }
          
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

      case "save_education_beads": {
        const beads = data || [];
        const { error: delErr } = await supabase.from("EducationBead").delete().neq("id", "");
        if (delErr) throw delErr;

        if (beads.length > 0) {
          const formatted = beads.map((bead: any, idx: number) => {
            const meta = { parentId: bead.parentId, fileUrl: bead.fileUrl };
            return {
              id: bead.id,
              heading: bead.heading,
              content: `[BEAD_META:${JSON.stringify(meta)}]META_END]${bead.content}`,
              color: bead.color,
              order: idx,
              updatedAt: new Date().toISOString(),
            };
          });
          const { error: insErr } = await supabase.from("EducationBead").insert(formatted);
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

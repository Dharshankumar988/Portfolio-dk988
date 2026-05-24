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

    // 1b. Fetch Admin trigger and terminal password
    const { data: admins } = await supabase
      .from("Admin")
      .select("secretTrigger, terminalPassword")
      .limit(1) as { data: any[] | null };
    const adminTrigger = admins && admins.length > 0 ? admins[0].secretTrigger : null;
    const terminalPassword = admins && admins.length > 0 ? admins[0].terminalPassword : null;
    
    // 1c. Fetch Education Beads
    const { data: educationBeads } = await supabase
      .from("EducationBead")
      .select("*")
      .order("order", { ascending: true }) as { data: any[] | null };

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

    let mappedProfile = null;
    if (profile) {
      let bio = profile.bio || "";
      let phone = profile.phone || "";
      let careerGoals = profile.careerGoals || "";
      let education = profile.education || "";

      if (bio.includes("\n\n[meta:")) {
        const metaStart = bio.indexOf("\n\n[meta:");
        const metaEnd = bio.indexOf("]", metaStart);
        if (metaEnd > metaStart + 8) {
          try {
            const metaStr = bio.substring(metaStart + 8, metaEnd);
            const parsed = JSON.parse(metaStr);
            if (!phone && parsed.phone) phone = parsed.phone;
            if (!careerGoals && parsed.careerGoals) careerGoals = parsed.careerGoals;
            if (!education && parsed.education) education = parsed.education;
            if (parsed.name) profile.name = parsed.name;
            if (parsed.greeting) profile.greeting = parsed.greeting;
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
      educationBeads: (educationBeads || []).map((b) => {
        let content = b.content || "";
        let parentId = null;
        if (content.startsWith("[parent:")) {
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
        };
      }),
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
      extracurriculars: (extracurriculars || []).map((e) => {
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
          
          const meta = { phone, careerGoals, education, name, greeting, nameFontSize, taglineFontSize };
          const encodedBio = `${bio || ""}\n\n[meta:${JSON.stringify(meta)}]`;
          
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
          const formatted = beads.map((bead: any, idx: number) => ({
            id: bead.id,
            heading: bead.heading,
            content: bead.parentId ? `[parent:${bead.parentId}]${bead.content}` : bead.content,
            color: bead.color,
            order: idx,
            updatedAt: new Date().toISOString(),
          }));
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

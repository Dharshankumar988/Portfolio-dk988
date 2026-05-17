"use client";

import { useEffect } from "react";
import {
  setStoredProfile,
  setStoredProjects,
  setStoredCertificates,
  setStoredSkills,
  setStoredExtracurriculars,
  setStoredInterests
} from "@/lib/portfolioStore";

export default function DatabaseHydrator() {
  useEffect(() => {
    const hydrate = async () => {
      try {
        const res = await fetch("/api/portfolio");
        if (!res.ok) return;
        const data = await res.json();

        if (data.profile) {
          setStoredProfile(data.profile, true);
        }
        if (data.projects && data.projects.length > 0) {
          setStoredProjects(data.projects, true);
        }
        if (data.certificates && data.certificates.length > 0) {
          setStoredCertificates(data.certificates, true);
        }
        if (data.skills && data.skills.length > 0) {
          setStoredSkills(data.skills, true);
        }
        if (data.extracurriculars && data.extracurriculars.length > 0) {
          setStoredExtracurriculars(data.extracurriculars, true);
        }
        if (data.interests && data.interests.length > 0) {
          setStoredInterests(data.interests, true);
        }
      } catch (err) {
        console.error("Database hydration error:", err);
      }
    };

    hydrate();
  }, []);

  return null;
}

-- =========================================================================
-- DHARSHAN'S PORTFOLIO - FULL SUPABASE DATABASE SETUP & DEFAULT SEED DATA
-- =========================================================================
-- INSTRUCTIONS: Copy and run this entire file in your Supabase SQL Editor.
-- It will create all necessary tables and pre-populate them with your correct data!

-- 1. DROP EXISTING TABLES IF THEY EXIST (To ensure a clean restart)
DROP TABLE IF EXISTS "Admin" CASCADE;
DROP TABLE IF EXISTS "Profile" CASCADE;
DROP TABLE IF EXISTS "Project" CASCADE;
DROP TABLE IF EXISTS "Certificate" CASCADE;
DROP TABLE IF EXISTS "Skill" CASCADE;
DROP TABLE IF EXISTS "Extracurricular" CASCADE;
DROP TABLE IF EXISTS "Interest" CASCADE;

-- 2. CREATE ADMIN TABLE
CREATE TABLE "Admin" (
  "id" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "secretTrigger" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- 3. CREATE PROFILE TABLE
CREATE TABLE "Profile" (
  "id" TEXT NOT NULL DEFAULT 'default',
  "tagline" TEXT NOT NULL,
  "bio" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "githubUrl" TEXT NOT NULL,
  "linkedinUrl" TEXT NOT NULL,
  "resumeUrl" TEXT NOT NULL,
  "avatarUrl" TEXT NOT NULL,
  "phone" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- 4. CREATE PROJECT TABLE
CREATE TABLE "Project" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "url" TEXT,
  "github" TEXT,
  "image" TEXT,
  "technologies" TEXT[] NOT NULL,
  "tags" TEXT[] NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- 5. CREATE CERTIFICATE TABLE
CREATE TABLE "Certificate" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "issuer" TEXT NOT NULL,
  "date" TIMESTAMP(3),
  "url" TEXT,
  "image" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- 6. CREATE SKILL TABLE
CREATE TABLE "Skill" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "category" TEXT,
  "icon" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- 7. CREATE EXTRACURRICULAR TABLE
CREATE TABLE "Extracurricular" (
  "id" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Extracurricular_pkey" PRIMARY KEY ("id")
);

-- 8. CREATE INTEREST TABLE
CREATE TABLE "Interest" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "logoUrl" TEXT,
  "domain" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);


-- =========================================================================
-- SEED DATA PRE-POPULATION
-- =========================================================================

-- Seed default Admin credentials
-- Username: admin | Secret Trigger: dk160106
INSERT INTO "Admin" ("id", "username", "passwordHash", "secretTrigger") VALUES (
  'default-admin',
  'admin',
  '$2b$10$O4eG0.XoH250b/vFsz0VjupUj2o8G1n6Y0hC4K9n1y6k/6P2V/8eW', -- hashed password for 'dk160106'
  'dk160106'
);

-- Seed default Profile summary
INSERT INTO "Profile" ("id", "tagline", "bio", "email", "githubUrl", "linkedinUrl", "resumeUrl", "avatarUrl", "phone") VALUES (
  'default',
  'Cybersecurity | Cloud | AI | Secure Systems',
  'Computer Science undergraduate with a keen interest in networking, cloud technologies, secure systems, and emerging AI technologies.',
  'dhars@example.com',
  'https://github.com/Dharshankumar988',
  'https://linkedin.com/in/dharshan-kumar-b',
  '',
  '',
  '+91 98765 43210'
);

-- Seed categorized skills dashboard
INSERT INTO "Skill" ("id", "name", "category", "order") VALUES
-- Security concepts
('info-sec', 'Information security (secure systems)', 'Security concepts', 1),
('crypto', 'Cryptography', 'Security concepts', 2),
('network-fund', 'Network fundamentals', 'Security concepts', 3),

-- Tools
('abuseipdb', 'AbuseIPDB', 'Tools', 4),
('alienvault', 'AlienVault OTX', 'Tools', 5),
('virustotal', 'VirusTotal', 'Tools', 6),
('wireshark', 'Wireshark', 'Tools', 7),
('nmap', 'Nmap', 'Tools', 8),
('git', 'Git', 'Tools', 9),
('vscode', 'VS Code', 'Tools', 10),
('figma', 'Figma', 'Tools', 11),

-- Programming/Web
('python', 'Python', 'Programming/Web', 12),
('c-lang', 'C', 'Programming/Web', 13),
('javascript', 'JavaScript', 'Programming/Web', 14),
('fastapi', 'FastAPI', 'Programming/Web', 15),
('nextjs', 'Next.js', 'Programming/Web', 16),
('sql', 'SQL', 'Programming/Web', 17),
('postgresql', 'PostgreSQL', 'Programming/Web', 18),
('tailwindcss', 'Tailwind CSS', 'Programming/Web', 19),

-- Emerging Tech
('blockchain', 'Blockchain (Polygon)', 'Emerging Tech', 20),
('smart-contracts', 'Smart Contracts', 'Emerging Tech', 21),
('ipfs', 'IPFS', 'Emerging Tech', 22),
('gen-ai', 'Generative AI', 'Emerging Tech', 23),
('ai-agents', 'AI Agents', 'Emerging Tech', 24);

-- Seed Extracurricular items
INSERT INTO "Extracurricular" ("id", "text", "order") VALUES
('cyber-defense-hackathon-2024', 'Participated in National Cyber Defense Hackathon 2024', 1),
('university-tech-club', 'Core member of University Tech Club', 2),
('ai-zero-trust-article', 'Published article on ''AI in Zero Trust Architecture''', 3),
('web3-awareness-seminars', 'Volunteer for Web3 Awareness Seminars', 4);

-- Seed Future Interests
INSERT INTO "Interest" ("id", "name", "logoUrl", "domain", "order") VALUES
('aws-cloud-security', 'AWS Cloud Security', 'https://logo.clearbit.com/aws.amazon.com', 'aws.amazon.com', 1),
('kubernetes-secops', 'Kubernetes SecOps', 'https://logo.clearbit.com/kubernetes.io', 'kubernetes.io', 2),
('docker-security', 'Docker Security', 'https://logo.clearbit.com/docker.com', 'docker.com', 3),
('deep-learning', 'Deep Learning', 'https://logo.clearbit.com/tensorflow.org', 'tensorflow.org', 4);

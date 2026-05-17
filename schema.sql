-- Create Profile Table
CREATE TABLE "Profile" (
  "id" TEXT NOT NULL DEFAULT 'default',
  "tagline" TEXT NOT NULL,
  "bio" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "githubUrl" TEXT NOT NULL,
  "linkedinUrl" TEXT NOT NULL,
  "resumeUrl" TEXT NOT NULL,
  "avatarUrl" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- Create Project Table
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
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- Create Certificate Table
CREATE TABLE "Certificate" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "issuer" TEXT NOT NULL,
  "date" TIMESTAMP(3),
  "url" TEXT,
  "image" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- Create Skill Table
CREATE TABLE "Skill" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "category" TEXT,
  "icon" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- Create Extracurricular Table
CREATE TABLE "Extracurricular" (
  "id" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Extracurricular_pkey" PRIMARY KEY ("id")
);

-- Create Interest Table
CREATE TABLE "Interest" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "logoUrl" TEXT,
  "domain" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);

-- Create Admin Table
CREATE TABLE "Admin" (
  "id" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "secretTrigger" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- Create Unique Constraint on Admin Username
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

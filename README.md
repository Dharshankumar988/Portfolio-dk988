# Premium Cybersecurity & Developer Portfolio

A cutting-edge, highly responsive professional developer and cybersecurity portfolio built with a state-of-the-art cyberpunk aesthetic, interactive console terminal, and secure dynamic management console.

## 🚀 Key Features

*   **Interactive Command Terminal:** A fully functional terminal emulator supporting custom shell commands, system diagnostic tools, and custom secure routing.
*   **Dynamic Skills dashboard:** A high-tech responsive skill categories tree with seamless SVG/transparent logo support.
*   **Visual Certificate Vault:** Sleek card layout highlighting professional certifications with dynamic PDF/image quick viewers.
*   **Projects Showcase:** An animated gallery showcasing active projects with repository and live deployment navigation.
*   **Holographic Cyber UI:** Beautifully crafted layout leveraging rich Glassmorphism, smooth Framer Motion transitions, custom neon scanlines, and glowing CRT-style animations.

## 🛠️ Technology Stack

*   **Core Framework:** Next.js (App Router)
*   **Styles & Theme:** Tailwind CSS & Vanilla CSS
*   **Animations:** Framer Motion
*   **Icons & Assets:** Lucide React & React Icons
*   **Backend Integrations:** Supabase Storage (Serverless Storage Bucket) & Supabase Client API

## 💻 Local Setup & Development

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and specify your serverless integration keys:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
    SUPABASE_SERVICE_ROLE_KEY=your_secret_supabase_service_role_key
    ```

3.  **Run the local development server:**
    ```bash
    npm run dev
    ```

4.  **Access the application:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

import BackgroundParticles from "@/components/BackgroundParticles";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Certificates from "@/components/Certificates";
import ExtraAndFuture from "@/components/ExtraAndFuture";
import ContactTerminal from "@/components/ContactTerminal";
import StartupAnimation from "@/components/StartupAnimation";

export default function Home() {
  return (
    <main className="relative bg-cyber-black min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <StartupAnimation />
      <BackgroundParticles />
      <section id="hero">
        <Hero />
      </section>
      {/* About has id="about" internally */}
      <About />
      <section id="skills">
        <Skills />
      </section>
      <section id="projects">
        <Projects />
      </section>
      <section id="certificates">
        <Certificates />
      </section>
      <section id="extra">
        <ExtraAndFuture />
      </section>
      <ContactTerminal />
    </main>
  );
}

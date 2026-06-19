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
      
      {/* Subtle abstract geometric background graphic */}
      <div className="fixed top-0 right-0 w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] pointer-events-none z-0 mix-blend-screen opacity-[0.03] translate-x-1/4 -translate-y-1/4">
        <div className="absolute inset-0 border border-cyber-cyan rounded-full scale-[0.6] opacity-50" />
        <div className="absolute inset-0 border border-cyber-purple rounded-full scale-[0.8] opacity-30" />
        <div className="absolute inset-0 border-[0.5px] border-white rounded-full scale-[1.0] opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.8)_0%,transparent_50%)] opacity-20" />
      </div>

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

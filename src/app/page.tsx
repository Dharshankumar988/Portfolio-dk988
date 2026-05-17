import BackgroundParticles from "@/components/BackgroundParticles";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Certificates from "@/components/Certificates";
import ExtraAndFuture from "@/components/ExtraAndFuture";
import ContactTerminal from "@/components/ContactTerminal";
import StartupAnimation from "@/components/StartupAnimation";
import DatabaseHydrator from "@/components/DatabaseHydrator";

export default function Home() {
  return (
    <main className="relative bg-cyber-black min-h-screen overflow-hidden">
      <DatabaseHydrator />
      <StartupAnimation />
      <BackgroundParticles />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Certificates />
      <ExtraAndFuture />
      <ContactTerminal />
    </main>
  );
}

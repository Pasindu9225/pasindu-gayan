"use client";

import { useState, useEffect } from "react";
import {
  Download, Github, Linkedin, ExternalLink, Send, Mail, MapPin, Loader2,
  GraduationCap, Code2, BrainCircuit
} from "lucide-react";
import ProjectModal from "../components/ProjectModal";
import CertificateModal from "../components/CertificateModal";
import ProjectCard, { Project } from "../components/ProjectCard";

// Types
type Certificate = {
  id: string;
  title: string;
  issuer: string;
  imageUrl: string;
  verifyLink?: string;
  description?: string;
  issuedAt?: string;
};

export default function Home() {
  // --- DATA STATE ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- UI STATE ---
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // --- CONTACT FORM STATE ---
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "success" | "error">("idle");

  // --- FETCH DATA (ROBUST VERSION) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 1. Fetch Projects safely
        const projRes = await fetch("/api/projects");
        if (!projRes.ok) {
          console.error("Projects API failed:", projRes.status);
          setProjects([]);
        } else {
          const text = await projRes.text();
          try {
            const data = text ? JSON.parse(text) : [];
            const formattedProjects = Array.isArray(data) ? data.map((p: any) => ({
              ...p,
              imageUrl: p.imageUrls && p.imageUrls.length > 0 ? p.imageUrls[0] : "",
              imageUrls: p.imageUrls || [],
              techStack: p.techStack || []
            })) : [];
            setProjects(formattedProjects);
          } catch (err) {
            console.error("Error parsing Projects JSON:", err);
          }
        }

        // 2. Fetch Certificates safely
        const certRes = await fetch("/api/certificates");
        if (!certRes.ok) {
          console.error("Certificates API failed:", certRes.status);
          setCertificates([]);
        } else {
          const text = await certRes.text();
          try {
            const data = text ? JSON.parse(text) : [];
            if (Array.isArray(data)) setCertificates(data);
          } catch (err) {
            console.error("Error parsing Certificates JSON:", err);
          }
        }

      } catch (error) {
        console.error("Failed to load content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- HANDLERS ---
  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };

  const handleOpenCert = (cert: Certificate) => {
    setSelectedCert(cert);
    setIsCertModalOpen(true);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSendStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });

      if (res.ok) {
        setSendStatus("success");
        setContactForm({ name: "", email: "", message: "" });
        setTimeout(() => setSendStatus("idle"), 3000);
      } else {
        setSendStatus("error");
      }
    } catch (error) {
      setSendStatus("error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-screen relative selection:bg-brand-gold/30 selection:text-brand-dark bg-stone-50/30">

      {/* --- HERO SECTION --- */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-32 pb-24 text-center">

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-gold/30 text-brand-emerald text-sm font-semibold mb-8 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold"></span>
          </span>
          Available for new opportunities
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-brand-dark tracking-tight mb-6">
          Pasindu Gayan.
        </h1>

        <p className="text-xl md:text-2xl text-stone-600 max-w-2xl mx-auto leading-relaxed mb-10">
          Full Stack Developer engineering Scalable SaaS & E-Commerce solutions.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-24">
          <a
            href="/Pasindu_Gayan_Resume.pdf"
            download="Pasindu_Gayan_Resume.pdf"
            className="flex items-center justify-center gap-2 bg-brand-emerald text-white px-8 py-4 rounded-lg font-medium hover:bg-brand-dark transition-all hover:-translate-y-1 shadow-xl shadow-brand-emerald/20 ring-1 ring-white/20"
          >
            <Download size={20} className="text-brand-gold" />
            <span>Download Resume</span>
          </a>

          <div className="flex gap-3 justify-center">
            <a href="https://github.com/Pasindu9225" target="_blank" className="p-4 bg-white border border-stone-200 text-stone-600 rounded-lg hover:border-brand-gold hover:text-brand-gold transition-all shadow-sm hover:shadow-md">
              <Github size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" className="p-4 bg-white border border-stone-200 text-stone-600 rounded-lg hover:border-brand-gold hover:text-brand-gold transition-all shadow-sm hover:shadow-md">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

      </section>

      {/* --- ABOUT ME SECTION --- */}
      <section className="w-full max-w-5xl mx-auto px-6 pb-32">
        <div className="flex items-center gap-4 mb-10">
          <h2 className="text-3xl font-bold text-brand-dark">About Me</h2>
          <div className="h-[1px] flex-grow bg-gradient-to-r from-brand-gold/50 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

          {/* Left Column: Biography & Education */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-emerald" />
              <p className="text-stone-600 text-lg leading-relaxed mb-6">
                I am an <span className="font-bold text-brand-dark">Information and Communication Technology (Hons)</span> undergraduate at the University of Sri Jayewardenepura.
              </p>
              <p className="text-stone-600 text-lg leading-relaxed">
                My passion lies in architecting scalable solutions using modern technologies like <span className="font-medium text-brand-emerald">Next.js, TypeScript, and Cloud Platforms</span>. I am eager to apply my technical skills to create meaningful digital experiences.
              </p>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white rounded-xl border border-stone-100 shadow-sm">
              <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-lg">
                <GraduationCap size={24} />
              </div>
              <div>
                <h3 className="font-bold text-brand-dark text-lg">Bachelor of ICT (Hons)</h3>
                <p className="text-stone-500 font-medium">University of Sri Jayewardenepura</p>
                <p className="text-sm text-brand-emerald mt-1">July 2023 - Present</p>
              </div>
            </div>
          </div>

          {/* Right Column: Skills & Tech Stack */}
          <div className="space-y-6">

            {/* Tech Stack */}
            <div className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Code2 className="text-brand-emerald" size={24} />
                <h3 className="font-bold text-xl text-brand-dark">Technical Arsenal</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {["JavaScript", "TypeScript", "Java", "Python", "SQL"].map(tech => (
                      <span key={tech} className="px-3 py-1 bg-stone-50 text-stone-600 text-sm font-medium rounded-md border border-stone-200">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Frameworks & Cloud</p>
                  <div className="flex flex-wrap gap-2">
                    {["React", "Next.js", "Node.js", "SpringBoot", "PostgreSQL", "MongoDB", "Azure", "Docker"].map(tech => (
                      <span key={tech} className="px-3 py-1 bg-brand-emerald/5 text-brand-emerald text-sm font-medium rounded-md border border-brand-emerald/10">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Soft Skills */}
            <div className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <BrainCircuit className="text-brand-gold" size={24} />
                <h3 className="font-bold text-xl text-brand-dark">Key Competencies</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {["Leadership", "Team Management", "Critical Thinking", "Problem Solving"].map(skill => (
                  <div key={skill} className="flex items-center gap-2 text-stone-600 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                    {skill}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- PROJECTS --- */}
      <section className="w-full max-w-5xl mx-auto px-6 pb-24 text-left">
        <div className="flex items-center gap-4 mb-10">
          <h2 className="text-3xl font-bold text-brand-dark">Selected Work</h2>
          <div className="h-[1px] flex-grow bg-gradient-to-r from-brand-gold/50 to-transparent"></div>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-stone-400">Loading projects...</div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={handleOpenProject}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-stone-50 rounded-xl border border-dashed border-stone-200 text-stone-500">No projects yet.</div>
        )}
      </section>

      {/* --- CERTIFICATES --- */}
      <section className="w-full max-w-5xl mx-auto px-6 pb-24 text-left">
        <div className="flex items-center gap-4 mb-10">
          <h2 className="text-3xl font-bold text-brand-dark">Certifications</h2>
          <div className="h-[1px] flex-grow bg-gradient-to-r from-brand-gold/50 to-transparent"></div>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-stone-400">Loading certificates...</div>
        ) : certificates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                onClick={() => handleOpenCert(cert)}
                className="group bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex items-start gap-5 hover:border-brand-gold/50 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="h-16 w-16 flex-shrink-0 bg-stone-100 rounded-lg overflow-hidden border border-stone-100 group-hover:scale-105 transition-transform">
                  <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-bold text-brand-dark text-lg leading-tight mb-1 group-hover:text-brand-emerald transition-colors">{cert.title}</div>
                  <div className="text-sm text-brand-gold font-medium mb-2">{cert.issuer}</div>
                  {cert.verifyLink && (
                    <span className="inline-flex items-center gap-1 text-xs text-stone-400 font-medium border border-stone-200 rounded-full px-2 py-1">
                      View Details <ExternalLink size={10} />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-stone-50 rounded-xl border border-dashed border-stone-200 text-stone-500">No certificates yet.</div>
        )}
      </section>

      {/* --- FOOTER --- */}
      <footer className="w-full bg-white border-t border-stone-200 py-16 sm:py-24 mt-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-emerald/5 rounded-full blur-3xl mix-blend-multiply" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-brand-gold/10 rounded-full blur-3xl mix-blend-multiply" />

        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-24 relative z-10">

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-brand-dark">Let's Connect.</h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-stone-50 border border-stone-100 rounded-lg text-brand-emerald">
                  <Mail size={20} />
                </div>
                <a href="mailto:pasindu9225@gmail.com" className="text-brand-dark font-medium hover:text-brand-emerald transition-colors">pasindu9225@gmail.com</a>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-stone-50 border border-stone-100 rounded-lg text-brand-emerald">
                  <MapPin size={20} />
                </div>
                <span className="text-brand-dark font-medium">Colombo, Sri Lanka</span>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <a href="https://github.com/Pasindu9225" target="_blank" className="p-3 bg-stone-50 border border-stone-200 text-stone-600 rounded-lg hover:border-brand-gold hover:text-brand-gold hover:shadow-sm transition-all">
                <Github size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" className="p-3 bg-stone-50 border border-stone-200 text-stone-600 rounded-lg hover:border-brand-gold hover:text-brand-gold hover:shadow-sm transition-all">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Name</label>
                <input
                  required
                  type="text"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-brand-dark focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald outline-none transition-all placeholder:text-stone-400"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Email</label>
                <input
                  required
                  type="email"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-brand-dark focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald outline-none transition-all placeholder:text-stone-400"
                  placeholder="your@email.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-brand-dark focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald outline-none transition-all resize-none placeholder:text-stone-400"
                  placeholder="What's on your mind?"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={isSending || sendStatus === "success"}
                className={`w-full py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-emerald/10 ${sendStatus === "success"
                  ? "bg-green-600 text-white cursor-default"
                  : "bg-brand-emerald text-white hover:bg-brand-dark hover:-translate-y-0.5"
                  }`}
              >
                {isSending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : sendStatus === "success" ? (
                  "Message Sent!"
                ) : (
                  <>
                    Send Message <Send size={18} />
                  </>
                )}
              </button>
              {sendStatus === "error" && (
                <p className="text-red-500 text-sm text-center mt-2 font-medium">Something went wrong. Please try again.</p>
              )}
            </form>
          </div>

        </div>

        <div className="mt-16 border-t border-stone-100 pt-8 text-center text-stone-400 text-sm">
          © {new Date().getFullYear()} Pasindu Gayan. All rights reserved.
        </div>
      </footer>

      {/* --- MODALS --- */}
      <ProjectModal
        project={selectedProject}
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />

      <CertificateModal
        certificate={selectedCert}
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />

    </main>
  );
}
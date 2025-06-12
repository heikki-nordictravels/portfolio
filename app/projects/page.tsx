"use client"

import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ParallaxLines from "../components/ParallaxLines";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SkillTag from "../components/SkillTag";

interface Project {
    title?: string;
    year?: string;
    description?: string;
    tools_used?: string[];
    image?: string;
    link?: string;
}
interface AnimatedCardProps {
  children: React.ReactNode;
  direction?: "left" | "right";
  delay?: number;
}
// Animation component that slides in from left or right
function AnimatedProjectCard({ children, direction = "left", delay = 0 }: AnimatedCardProps) {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    return (
        <motion.div
            ref={ref}
            initial={{ 
                x: direction === "left" ? -100 : 100, 
                opacity: 0 
            }}
            animate={inView ? { 
                x: 0, 
                opacity: 1 
            } : {}}
            transition={{ 
                duration: 0.6, 
                ease: "easeOut",
                delay
            }}
            className="w-full"
        >
            {children}
        </motion.div>
    );
}

export default function Projects() {
    const projects: Project[] = [
        {
            title: "This website",
            year: "2025",
            description: "Made with love using React/Next.js. I used Figma to design the page layouts before implementation.",
            tools_used: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Figma"]
        }, {
            title: "EcoMonitor",
            year: "2025",
            description: "An Android app for managing maintenance data for smart homes. I was partly responsible for programming the UI and viewmodel structure.",
            tools_used: ["Android Studio", "Jetpack Compose", "Kotlin"],
            image: "/images/ecomonitor.png"
        }, {
            title: "Zerowaste",
            year: "2024",
            description: `A rhythm sorting game made in Unity. Another school project where I:
                            • Designed a custom 3D-printed controller
                            • Created the game environment
                            • Programmed gameplay mechanics`,
            tools_used: ["C#", "Unity 3D", "Tinkercad", "Blockbench"],
            image: "/images/zerowaste.png"
        }, {
            title: "Rogue Robot",
            year: "2024",
            description: "A physics-based driving game made with Unreal Engine 5\nMade in 2 months during a summer school project, I was responsible for programming and designing most of the UI, in addition to implementing gameplay systems such as progression and score.",
            tools_used: ["Unreal 5", "Blueprint", "Blockbench"],
            image: "/images/roguerobot.png",
            link: "https://vege00.itch.io/roguerobot"
        }
    ];

    return (
        <div className="projects inspectable font-[family-name:var(--font-geist-sans)] min-h-screen">
            <ParallaxLines opacity={0.4} strokeWidth={3} zIndex={5} />
            <Header/>
            <h1 className="inspectable z-10 relative">Things I've done </h1>
            <main className="relative z-10 flex flex-col gap-16 max-w-4xl mx-auto py-12 px-4 w-full">
                
                {/*----------------------------MOBILE VIEW----------------------------*/}

                <div className="inspectable block md:hidden relative border-l-2 border-[var(--navitem-separator)] project-line-mobile pl-8">
                    {projects.map((project, idx) => (
                        <AnimatedProjectCard key={idx} direction="right" delay={idx * 0.1}>
                            <div className="mb-12 relative">
                                {/* Timeline dot */}
                                <span className="project-dot absolute -left-5 top-2 w-3 h-3 rounded-full border-2 border-[var(--navitem-separator)]"></span>
                                {/* Project content */}
                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    {/* Image (if present) */}
                                    {project.image && (
                                        <div className="w-1/2 h-1/2 flex-shrink-0 bg-[var(--foreground)] rounded-md overflow-hidden flex items-center justify-center">
                                            <Image
                                                src={project.image}
                                                alt={project.title || "Project image"}
                                                width={500}
                                                height={256}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    )}
                                    {/* Details */}
                                    <div>
                                        <div className="flex items-center gap-4 mb-1">
                                            <span className="text-lg text-title font-semibold">{project.title}</span>
                                            <span className="text-sm text-[var(--navitem-text)] opacity-70">{project.year}</span>
                                        </div>
                                        <div className="whitespace-pre-line mb-2">{project.description}</div>
                                        {project.tools_used && (
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {project.tools_used.map((tool, i) => (
                                                    <span key={i} className="bg-[var(--navitem-bg)] text-xs px-2 py-1 rounded">
                                                        {tool}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {project.link && (
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[var(--primary)] underline hover:text-[var(--navitem-text-hover)] transition"
                                            >
                                                View project →
                                            </a>
                                        )}
                                        <div className="block mt-12 mobile-project-separator"></div>
                                    </div>
                                </div>
                            </div>
                        </AnimatedProjectCard>
                    ))}
                </div>

                {/*---------------------------DESKTOP VIEW---------------------------*/}

                <div className="inspectable hidden md:block relative w-full" style={{ minHeight: `${projects.length * 180}px` }}>
                    {/* Vertical center line */}
                    <div className="inspectable absolute left-1/2 top-0 h-full w-1 bg-[var(--navitem-separator)] project-line -translate-x-1/2 z-0"></div>
                    {projects.map((project, idx) => {
                        const isLeft = idx % 2 === 0;
                        return (
                            <div
                                key={idx}
                                className="inspectable relative flex items-center"
                                style={{ minHeight: "160px" }}
                            >
                                {/* Left side (project or year) */}
                                <div className={`w-1/2 flex ${isLeft ? "justify-end pr-12" : "justify-end"}`}>
                                    {isLeft ? (
                                        // Project card with animation
                                        <AnimatedProjectCard direction="left" delay={idx * 0.1}>
                                            <div className="inspectable max-w-md rounded-lg shadow-lg p-6 flex flex-col gap-2 text-left">
                                                <div className="inspectable flex items-center gap-4 mb-1">
                                                    <span className="inspectable text-lg text-title font-semibold">{project.title}</span>
                                                </div>
                                                <div className="inspectable whitespace-pre-line mb-2">{project.description}</div>
                                                {project.tools_used && (
                                                    <div className="inspectable flex flex-wrap gap-2 mb-2">
                                                        {project.tools_used.map((tool, i) => (
                                                            <span key={i} className="inspectable bg-[var(--navitem-bg)] text-xs px-2 py-1 rounded">
                                                                {tool}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                {project.link && (
                                                    <a
                                                        href={project.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inspectable text-[var(--primary)] underline hover:text-[var(--navitem-text-hover)] transition"
                                                    >
                                                        View project →
                                                    </a>
                                                )}
                                                {project.image && (
                                                    <div className="inspectable w-full h-32 mt-2 bg-[var(--background)] rounded overflow-hidden flex items-center justify-center">
                                                        <Image
                                                            src={project.image}
                                                            alt={project.title || "Project image"}
                                                            width={500}
                                                            height={256}
                                                            className="inspectable object-cover w-full h-full"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </AnimatedProjectCard>
                                    ) : (
                                        // Year with animation
                                        <AnimatedProjectCard direction="left" delay={idx * 0.1}>
                                            <span className="inspectable project-year text-xl font-bold text-title pr-12 flex justify-end">
                                                {project.year}
                                            </span>
                                        </AnimatedProjectCard>
                                    )}
                                </div>

                                {/* Center dot */}
                                <motion.div 
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                                    initial={{ scale: 0, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: idx * 0.1 + 0.3, duration: 0.5 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                >
                                    <span className="project-dot w-5 h-5 bg-[var(--primary)] rounded-full border-2 border-[var(--navitem-separator)] block"></span>
                                </motion.div>

                                {/* Right side (project or year) */}
                                <div className={`w-1/2 flex ${isLeft ? "justify-start" : "justify-start pl-12"}`}>
                                    {!isLeft ? (
                                        // Project card with animation
                                        <AnimatedProjectCard direction="right" delay={idx * 0.1}>
                                            <div className="max-w-md rounded-lg shadow-lg p-1 flex flex-col gap-2 text-left">
                                                <div className="flex items-center gap-4 mb-1">
                                                    <span className="text-lg text-title font-semibold">{project.title}</span>
                                                </div>
                                                <div className="whitespace-pre-line mb-2">{project.description}</div>
                                                {project.tools_used && (
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {project.tools_used.map((tool, i) => (
                                                            <span key={i} className="bg-[var(--navitem-bg)] text-xs px-2 py-1 rounded">
                                                                {tool}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                {project.link && (
                                                    <a
                                                        href={project.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[var(--primary)] underline hover:text-[var(--navitem-text-hover)] transition"
                                                    >
                                                        View project →
                                                    </a>
                                                )}
                                                {project.image && (
                                                    <div className="w-full h-full mt-2 bg-[var(--background)] rounded overflow-hidden flex items-center justify-center">
                                                        <Image
                                                            src={project.image}
                                                            alt={project.title || "Project image"}
                                                            width={500}
                                                            height={256}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </AnimatedProjectCard>
                                    ) : (
                                        // Year with animation
                                        <AnimatedProjectCard direction="right" delay={idx * 0.1}>
                                            <span className="project-year text-xl font-bold text-title pl-12">
                                                {project.year}
                                            </span>
                                        </AnimatedProjectCard>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
            <Footer />
        </div>
    );
}
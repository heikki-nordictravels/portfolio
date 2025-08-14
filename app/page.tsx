"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ParallaxLines from "./components/ParallaxLines";
import RippleLink from "./components/RippleLink";
import SkillTag from "./components/SkillTag";

import { 
  FaArrowRight, FaUsers, FaPencilAlt, FaLaptopCode, FaCube,
  FaPython, FaReact, FaPhp, FaHtml5, FaDatabase,
  FaLaravel, FaUnity, FaMicrochip, FaAndroid, 
  FaMobile, FaGithub, FaCloudflare, FaCpanel
} from "react-icons/fa";
import { SiKotlin, SiTypescript, SiTailwindcss, SiUnrealengine } from "react-icons/si";
import { TbBrandCSharp } from "react-icons/tb";
import { IconType } from "react-icons";

// Define types for better type safety
type Skill = {
  id?: string;
  icon: IconType;
  label: string;
  iconSize?: string;
};

type SkillCategories = {
  professional: Skill[];
  languages: Skill[];
  technologies: Skill[];
};

type Experience = {
  id?: string;
  title: string;
  company: string;
  period: string;
  type?: 'education' | 'work';
  description?: string;
};

// Add icon mapping object for API-based icons
const iconMap: Record<string, IconType> = {
  "FaUsers": FaUsers,
  "FaPencilAlt": FaPencilAlt,
  "FaLaptopCode": FaLaptopCode,
  "FaCube": FaCube,
  "FaPython": FaPython,
  "TbBrandCSharp": TbBrandCSharp,
  "SiTypescript": SiTypescript,
  "SiKotlin": SiKotlin,
  "FaPhp": FaPhp,
  "FaHtml5": FaHtml5,
  "FaDatabase": FaDatabase,
  "FaReact": FaReact,
  "FaLaravel": FaLaravel,
  "SiTailwindcss": SiTailwindcss,
  "FaUnity": FaUnity,
  "SiUnrealengine": SiUnrealengine,
  "FaGithub": FaGithub,
  "FaMicrochip": FaMicrochip,
  "FaAndroid": FaAndroid,
  "FaMobile": FaMobile,
  "FaCloudflare": FaCloudflare,
  "FaCpanel": FaCpanel
};

// Define fallback skill categories
const defaultSkillCategories: SkillCategories = {
  professional: [
    { icon: FaUsers, label: "Collaborative Development" },
    { icon: FaPencilAlt, label: "UI/UX Design" },
    { icon: FaLaptopCode, label: "Corporate IT Support" },
    { icon: FaCube, label: "3D Modeling and Design" }
  ],
  languages: [
    { icon: TbBrandCSharp, label: "", iconSize: "text-lg" }, //only icon for C#, no text
    { icon: FaPython, label: "Python" },
    { icon: SiTypescript, label: "JavaScript/TypeScript" },
    { icon: SiKotlin, label: "Kotlin" },
    { icon: FaPhp, label: "PHP", iconSize: "text-xl" },
    { icon: FaHtml5, label: "HTML" },
    { icon: FaDatabase, label: "SQL" }
  ],
  technologies: [
    { icon: FaReact, label: "React/Next.js" },
    { icon: FaLaravel, label: "Laravel" },
    { icon: SiTailwindcss, label: "Tailwind CSS" },
    { icon: FaUnity, label: "Unity" },
    { icon: SiUnrealengine, label: "Unreal Engine" },
    { icon: FaGithub, label: "Github" },
    { icon: FaMicrochip, label: "ESP32" },
    { icon: FaAndroid, label: "Android Studio" },
    { icon: FaMobile, label: "Jetpack Compose" }
  ]
};

export default function Home() {
  const [skillCategories, setSkillCategories] = useState<SkillCategories>(defaultSkillCategories);
  const [education, setEducation] = useState<Experience[]>([
    { id: "edu-default", title: "Computer Science", company: "Lapland University of Applied Sciences", period: "2023 - Present" }
  ]);
  const [work, setWork] = useState<Experience[]>([
    { id: "work-default", title: "IT Intern", company: "Nordic Unique Travels", period: "2025" }
  ]);

  // Load data directly from JSON files for static export
  useEffect(() => {
    async function loadData() {
      try {
        // Load skills and experiences from JSON files
        const [skillsRes, experiencesRes] = await Promise.all([
          fetch('/data/skills.json'),
          fetch('/data/experiences.json')
        ]);
        
        const skillsData = await skillsRes.json();
        const experiencesData = await experiencesRes.json();
        
        // Process skills into categories
        const processedSkills: SkillCategories = {
          professional: skillsData.filter((s: { category: string }) => s.category === 'professional').map((s: { icon: string; label?: string; iconSize?: string }) => ({
            icon: iconMap[s.icon] || FaUsers,
            label: s.label || "",
            iconSize: s.iconSize
          })),
          languages: skillsData.filter((s: { category: string }) => s.category === 'languages').map((s: { icon: string; label?: string; iconSize?: string }) => ({
            icon: iconMap[s.icon] || FaPython,
            label: s.label || "",
            iconSize: s.iconSize
          })),
          technologies: skillsData.filter((s: { category: string }) => s.category === 'technologies').map((s: { icon: string; label?: string; iconSize?: string }) => ({
            icon: iconMap[s.icon] || FaReact,
            label: s.label || "",
            iconSize: s.iconSize
          })),
        };
        
        // Only update state if we actually got data
        if (processedSkills.professional.length || processedSkills.languages.length || processedSkills.technologies.length) {
          setSkillCategories(processedSkills);
        }
        
        // Process experiences into education and work
        if (Array.isArray(experiencesData)) {
          const educationData = experiencesData.filter((e: { type: string }) => e.type === 'education');
          const workData = experiencesData.filter((e: { type: string }) => e.type === 'work');
          
          if (educationData.length) setEducation(educationData);
          if (workData.length) setWork(workData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Keep default data on error
      }
    }
    
    loadData();
  }, []);

  return (
    <div className="font-[family-name:var(--font-geist-sans)] min-h-screen relative overflow-hidden">
      <ParallaxLines opacity={0.4} strokeWidth={3} zIndex={5} />

      <Header />
      <main className="relative z-15 flex flex-col gap-[32px] px-6 md:px-12 max-w-400 mx-auto mt-12">

        {/*--------------------------------------DESKTOP VIEW--------------------------------------*/}

        <div className="hidden lg:block">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left column (image) */}
            <div className="md:col-span-5 order-2 md:order-1">
              <div className="relative bg-[#071512] rounded-lg overflow-hidden">
                <div className="flex flex-col items-center justify-center h-full p-4 inspectable">
                  <div className="flex items-center justify-center text-white text-xl mb-3 inspectable">
                    <Image
                      src={"/images/tenna.gif"}
                      alt="miau"
                      width={35}
                      height={35}
                      className="inspectable unoptimized"
                    />
                  </div>
                  <div className="inspectable w-full flex justify-center">
                    <Image
                      src={"/images/eror.png"}
                      alt="Your image for experiencing technical difficulties is experiencing some technical difficulties"
                      width={150}
                      height={80}
                      className="inspectable"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column (text content) */}
            <div className="md:col-span-7 ml-15 order-1 md:order-2 inspectable">
              <h1 className="text-5xl md:text-7xl font-bold text-[var(--title)] mb-6 inspectable">
                Developer or something
              </h1>
              <div className="mt-4 inspectable">
                <h2 className="text-xl mb-2 text-[var(--navitem-text)] inspectable">Information</h2>
                <p className="text-lg mb-6 text-[var(--text-body)] inspectable">
                  I&apos;m a passionate web developer specializing in modern frontend technologies.
                  With expertise in React, Next.js, and TypeScript, I create responsive and
                  performant web applications. My focus is on clean code, intuitive UX, and
                  innovative solutions to complex problems.
                </p>
                <Link 
                  href="/projects" 
                  className="action-button mr-10 inline-flex items-center justify-between w-40 text-white py-3 px-4 rounded-md transition-all duration-300 inspectable"
                >
                  <span className="inspectable">View projects</span>
                  <FaArrowRight className="ml-2 rotate-315 inspectable" />
                </Link>
                <Link
                  href="/contact"
                  className="action-button inline-flex items-center justify-between w-40 text-white py-3 px-4 rounded-md transition-all duration-300 inspectable"
                >
                  <span className="inspectable">Reach out</span>
                  <FaArrowRight className="ml-2 rotate-315 inspectable" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Info boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 max-w-300 gap-6 mt-12">
            <div className="bg-[var(--foreground)] opacity-90 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-[var(--navitem-text-hover)]">Skills</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {skillCategories.professional.map((skill, idx) => (
                  <SkillTag key={idx} icon={skill.icon}>
                    {skill.label}
                  </SkillTag>
                ))}
              </div>
              
              <h3 className="text-lg font-bold mb-3 text-[var(--navitem-text-hover)]">Programming Languages</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {skillCategories.languages.map((skill, idx) => (
                  <SkillTag key={idx} icon={skill.icon} iconSize={skill.iconSize}>
                    {skill.label}
                  </SkillTag>
                ))}
              </div>
              
              <h3 className="text-lg font-bold mb-3 text-[var(--navitem-text-hover)]">Technologies and Frameworks</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {skillCategories.technologies.map((skill, idx) => (
                  <SkillTag key={idx} icon={skill.icon}>
                    {skill.label}
                  </SkillTag>
                ))}
              </div>
            </div>
            
            <div className="bg-[var(--foreground)] opacity-90 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-[var(--navitem-text-hover)]">Education & Experience</h3>
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="mb-4 inspectable">
                  <div className="text-lg text-[var(--title)] inspectable">{edu.title}</div>
                  <div className="text-[var(--text-body)] inspectable">{edu.company}</div>
                  <div className="text-sm text-[var(--navitem-text)] inspectable">{edu.period}</div>
                  {edu.description && (
                    <p className="text-sm mt-1 text-[var(--text-body)] inspectable">{edu.description}</p>
                  )}
                </div>
              ))}
              <h3 className="text-lg font-bold mt-6 mb-3 text-[var(--navitem-text-hover)]">Work Experience</h3>
              {work.map((job, idx) => (
                <div key={job.id || idx} className="inspectable">
                  <div className="text-lg text-[var(--title)] inspectable">{job.title}</div>
                  <div className="text-[var(--text-body)] inspectable">{job.company}</div>
                  <div className="text-sm text-[var(--navitem-text)] inspectable">{job.period}</div>
                  {job.description && (
                    <p className="text-sm mt-1 text-[var(--text-body)] inspectable">{job.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/*--------------------------------------MOBILE VIEW--------------------------------------*/}

        <div className="block lg:hidden">
          {/* Header section with image and title side-by-side */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-30 h-auto bg-[#071512] rounded-lg overflow-hidden flex-shrink-0 p-2">
              <div className="flex flex-col items-center justify-center inspectable">
                <Image
                  src={"/images/tenna.gif"}
                  alt="miau"
                  width={25}
                  height={25}
                  className="inspectable mb-2"
                />
                <Image
                  src={"/images/eror.png"}
                  alt="Technical difficulties"
                  width={80}
                  height={35}
                  className="inspectable"
                />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-[var(--title)] inspectable">
              Developer or something
            </h1>
          </div>
          
          {/* Information section */}
          <div className="mb-8 inspectable">
            <h2 className="text-lg mb-2 text-[var(--navitem-text)] inspectable">Information</h2>
            <p className="text-base mb-6 text-[var(--text-body)] inspectable">
              I&apos;m a passionate web developer specializing in modern frontend technologies.
              With expertise in React, Next.js, and TypeScript, I create responsive and
              performant web applications.
            </p>
            
            {/* Action buttons */}
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 inspectable">
              <RippleLink 
                href="/projects" 
                className="action-button inline-flex items-center justify-between w-full sm:w-40 text-white py-3 px-4 rounded-md transition-all duration-300 inspectable"
              >
                <span className="inspectable">View projects</span>
                <FaArrowRight className="ml-2 rotate-315 inspectable" />
              </RippleLink>
              
              <RippleLink
                href="/contact"
                className="action-button inline-flex items-center justify-between w-full sm:w-40 text-white py-3 px-4 rounded-md transition-all duration-300 inspectable"
              >
                <span className="inspectable">Reach out</span>
                <FaArrowRight className="ml-2 rotate-315 inspectable" />
              </RippleLink>
            </div>
          </div>
          
          {/* Skills section */}
          <div className="bg-[var(--foreground)] p-4 rounded-lg mb-6">
            <h3 className="text-lg font-bold mb-3 text-[var(--navitem-text-hover)]">Skills & Technologies</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {skillCategories.professional.map((skill, idx) => (
                <SkillTag key={idx} icon={skill.icon}>
                  {skill.label}
                </SkillTag>
              ))}
            </div>
            
            <h3 className="text-lg font-bold mt-4 mb-3 text-[var(--navitem-text-hover)]">Programming Languages</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {skillCategories.languages.slice(0, 5).map((skill, idx) => (
                <SkillTag key={idx} icon={skill.icon} iconSize={skill.iconSize}>
                  {skill.label}
                </SkillTag>
              ))}
            </div>
            
            <h3 className="text-lg font-bold mt-4 mb-3 text-[var(--navitem-text-hover)]">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {skillCategories.technologies.slice(0, 6).map((skill, idx) => (
                <SkillTag key={idx} icon={skill.icon}>
                  {skill.label}
                </SkillTag>
              ))}
            </div>
          </div>
          
          {/* Education & Experience section */}
          <div className="bg-[var(--foreground)] p-4 rounded-lg inspectable mb-5">
            <h3 className="text-lg font-bold mb-3 text-[var(--navitem-text-hover)] inspectable">Education & Experience</h3>
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="mb-4 inspectable">
                <div className="text-lg text-[var(--title)] inspectable">{edu.title}</div>
                <div className="text-[var(--text-body)] inspectable">{edu.company}</div>
                <div className="text-sm text-[var(--navitem-text)] inspectable">{edu.period}</div>
              </div>
            ))}
            {work.map((job, idx) => (
              <div key={job.id || idx} className="inspectable">
                <div className="text-lg text-[var(--title)] inspectable">{job.title}</div>
                <div className="text-[var(--text-body)] inspectable">{job.company}</div>
                <div className="text-sm text-[var(--navitem-text)] inspectable">{job.period}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

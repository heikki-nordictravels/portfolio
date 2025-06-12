"use client"

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
  FaMobile, FaGithub
} from "react-icons/fa";
import { SiKotlin, SiTypescript, SiTailwindcss, SiUnrealengine } from "react-icons/si";
import { TbBrandCSharp } from "react-icons/tb";

// Define skill categories for better organization
const skillCategories = {
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
                <p className="text-lg mb-6 text-[var(--text-body)] mb-20 inspectable">
                  I'm a passionate web developer specializing in modern frontend technologies.
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
            
            <div className="bg-[var(--foreground)] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-[var(--navitem-text-hover)]">Education & Experience</h3>
              <div className="mb-4 inspectable">
                <div className="text-lg text-[var(--title)] inspectable">Computer Science</div>
                <div className="text-[var(--text-body)] inspectable">Lapland University of Applied Sciences</div>
                <div className="text-sm text-[var(--navitem-text)] inspectable">2023 - Present</div>
              </div>
              <div className="inspectable">
                <div className="text-lg text-[var(--title)] inspectable">IT Intern</div>
                <div className="text-[var(--text-body)] inspectable">Nordic Unique Travels</div>
                <div className="text-sm text-[var(--navitem-text)] inspectable">2025</div>
              </div>
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
              I'm a passionate web developer specializing in modern frontend technologies.
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
            <div className="mb-4 inspectable">
              <div className="text-lg text-[var(--title)] inspectable">Computer Science</div>
              <div className="text-[var(--text-body)] inspectable">Lapland University of Applied Sciences</div>
              <div className="text-sm text-[var(--navitem-text)] inspectable">2023 - Present</div>
            </div>
            <div className="inspectable">
              <div className="text-lg text-[var(--title)] inspectable">IT Intern</div>
              <div className="text-[var(--text-body)] inspectable">Nordic Unique Travels</div>
              <div className="text-sm text-[var(--navitem-text)] inspectable">2025</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

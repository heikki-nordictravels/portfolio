"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [counts, setCounts] = useState({
    skills: 0,
    experiences: 0,
    projects: 0
  });

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [skillsRes, experiencesRes, projectsRes] = await Promise.all([
          fetch("/api/skills"),
          fetch("/api/experiences"),
          fetch("/api/projects")
        ]);
        
        const skills = await skillsRes.json();
        const experiences = await experiencesRes.json();
        const projects = await projectsRes.json();
        
        setCounts({
          skills: skills.length,
          experiences: experiences.length,
          projects: projects.length
        });
      } catch (error) {
        console.error("Failed to fetch data counts", error);
      }
    }
    
    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--title)]">Admin Dashboard</h1>
          <button 
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/admin/login";
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Dashboard cards */}
          <DashboardCard 
            title="Skills" 
            count={counts.skills} 
            href="/admin/skills" 
          />
          <DashboardCard 
            title="Experiences" 
            count={counts.experiences} 
            href="/admin/experiences" 
          />
          <DashboardCard 
            title="Projects" 
            count={counts.projects} 
            href="/admin/projects" 
          />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, count, href }: { title: string; count: number; href: string }) {
  return (
    <Link 
      href={href}
      className="bg-[var(--foreground)] p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
    >
      <h2 className="text-xl font-bold mb-2 text-[var(--navitem-text-hover)]">{title}</h2>
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-[var(--title)]">{count}</span>
        <span className="action-button p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
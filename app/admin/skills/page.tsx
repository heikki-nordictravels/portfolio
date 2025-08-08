// filepath: c:\Users\nordi\Documents\GitHub\portfolio\app\admin\skills\page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as IconsFA from "react-icons/fa";
import * as IconsSI from "react-icons/si";
import * as IconsTB from "react-icons/tb";

type Skill = {
  id: string;
  icon: string;
  label: string;
  category: 'professional' | 'languages' | 'technologies';
  iconSize?: string;
};

export default function SkillsManagement() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);
  const router = useRouter();

  // Fetch skills on load
  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await fetch("/api/admin/skills");
        if (!response.ok) throw new Error("Failed to fetch skills");
        const data = await response.json();
        setSkills(data.data); // Note: admin endpoint returns {data: skills, success: true}
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchSkills();
  }, []);

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentSkill) return;
    
    try {
      const response = await fetch("/api/admin/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentSkill),
      });
      
      if (!response.ok) throw new Error("Failed to save skill");
      
      // Refresh skills list
      const updatedResponse = await fetch("/api/admin/skills");
      const updatedSkills = await updatedResponse.json();
      setSkills(updatedSkills.data); // Note: admin endpoint returns {data: skills, success: true}
      
      // Reset form
      setIsEditing(false);
      setCurrentSkill(null);
    } catch (error) {
      console.error("Error saving skill:", error);
    }
  }

  // Handle skill deletion
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    
    try {
      const response = await fetch(`/api/admin/skills?id=${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete skill");
      
      // Remove from list
      setSkills(skills.filter(skill => skill.id !== id));
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  }

  // Get all available icons from react-icons
  const allIcons = {
    ...Object.entries(IconsFA).filter(([key]) => key.startsWith('Fa')).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, any>),
    ...Object.entries(IconsSI).filter(([key]) => key.startsWith('Si')).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, any>),
    ...Object.entries(IconsTB).filter(([key]) => key.startsWith('Tb')).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, any>)
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/admin/dashboard" className="text-[var(--navitem-text)] hover:text-[var(--navitem-text-hover)]">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-[var(--title)] mt-2">Manage Skills</h1>
          </div>
          <button
            onClick={() => {
              setIsEditing(true);
              setCurrentSkill({
                id: "",
                icon: "FaCode",
                label: "",
                category: "professional",
                iconSize: "text-sm",
              });
            }}
            className="action-button cursor-pointer hover:text-[var(--navitem-text-hover)] py-2 px-4 rounded text-white"
            disabled={isEditing}
          >
            Add New Skill
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-[var(--text-body)]">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <div key={skill.id} className="bg-[var(--foreground)] p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    {renderIcon(skill.icon, skill.iconSize || "text-lg")}
                    <h3 className="text-xl font-medium text-[var(--title)] ml-2">
                      {skill.label || "(Icon Only)"}
                    </h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setCurrentSkill(skill);
                      }}
                      className="p-2 cursor-pointer hover:bg-[var(--ripple-color)] rounded text-blue-500 hover:text-blue-700"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="p-2 text-red-500 cursor-pointer hover:bg-[var(--ripple-color)] rounded hover:text-red-700"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="text-sm text-[var(--text-body)]">
                  <span className="inline-block bg-[var(--background)] px-2 py-1 rounded text-xs">
                    {skill.category}
                  </span>
                  {skill.iconSize && (
                    <span className="inline-block bg-[var(--background)] px-2 py-1 rounded text-xs ml-2">
                      {skill.iconSize}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit/Create Form Modal */}
        {isEditing && currentSkill && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[var(--background)] rounded-lg p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6 text-[var(--title)]">
                {currentSkill.id ? "Edit Skill" : "Add New Skill"}
              </h2>
              
              <form onSubmit={handleSubmit}>
                {/* Icon Selection */}
                <div className="mb-4">
                  <label className="block mb-2 text-[var(--text-body)]">Icon</label>
                  <select
                    value={currentSkill.icon}
                    onChange={(e) => setCurrentSkill({...currentSkill, icon: e.target.value})}
                    className="w-full px-3 py-2 bg-[var(--foreground)] border rounded text-[var(--text-body)]"
                    required
                  >
                    {Object.keys(allIcons).map(iconName => (
                      <option key={iconName} value={iconName}>{iconName}</option>
                    ))}
                  </select>
                  <div className="mt-2 flex items-center">
                    <span>Preview: </span>
                    {renderIcon(currentSkill.icon, currentSkill.iconSize || "text-lg")}
                  </div>
                </div>
                
                {/* Label */}
                <div className="mb-4">
                  <label className="block mb-2 text-[var(--text-body)]">Label</label>
                  <input
                    type="text"
                    value={currentSkill.label}
                    onChange={(e) => setCurrentSkill({...currentSkill, label: e.target.value})}
                    className="w-full px-3 py-2 bg-[var(--foreground)] border rounded text-[var(--text-body)]"
                    placeholder="Leave empty for icon-only skill"
                  />
                </div>
                
                {/* Category */}
                <div className="mb-4">
                  <label className="block mb-2 text-[var(--text-body)]">Category</label>
                  <select
                    value={currentSkill.category}
                    onChange={(e) => setCurrentSkill({
                      ...currentSkill, 
                      category: e.target.value as 'professional' | 'languages' | 'technologies'
                    })}
                    className="w-full px-3 py-2 bg-[var(--foreground)] border rounded text-[var(--text-body)]"
                    required
                  >
                    <option value="professional">Professional</option>
                    <option value="languages">Languages</option>
                    <option value="technologies">Technologies</option>
                  </select>
                </div>
                
                {/* Icon Size */}
                <div className="mb-6">
                  <label className="block mb-2 text-[var(--text-body)]">Icon Size (optional)</label>
                  <select
                    value={currentSkill.iconSize || ""}
                    onChange={(e) => setCurrentSkill({...currentSkill, iconSize: e.target.value || undefined})}
                    className="w-full px-3 py-2 bg-[var(--foreground)] border rounded text-[var(--text-body)]"
                  >
                    <option value="">Default Size</option>
                    <option value="text-sm">Small (text-sm)</option>
                    <option value="text-lg">Large (text-lg)</option>
                    <option value="text-xl">Extra Large (text-xl)</option>
                    <option value="text-2xl">2XL (text-2xl)</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setCurrentSkill(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded text-[var(--text-body)] hover:bg-[var(--foreground)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="action-button px-4 py-2 rounded text-white"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  // Helper function to render icon from string name
  function renderIcon(iconName: string, size: string) {
    const Icon = allIcons[iconName];
    return Icon ? <Icon className={size} /> : <span>⚠️</span>;
  }
}
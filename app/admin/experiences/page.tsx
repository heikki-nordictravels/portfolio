"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Experience = {
  id: string;
  title: string;
  company: string;
  period: string;
  type: 'education' | 'work';
  description?: string;
};

export default function ExperiencesManagement() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
  const router = useRouter();

  // Fetch experiences on load
  useEffect(() => {
    async function fetchExperiences() {
      try {
        const response = await fetch("/api/admin/experiences");
        if (!response.ok) throw new Error("Failed to fetch experiences");
        const data = await response.json();
        setExperiences(data.data || []);
      } catch (error) {
        console.error("Error fetching experiences:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchExperiences();
  }, []);

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentExperience) return;
    
    try {
      const response = await fetch("/api/admin/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentExperience),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to save experience: ${errorData.error || response.statusText}`);
      }
      
      // Refresh experiences list
      const updatedResponse = await fetch("/api/admin/experiences");
      const updatedData = await updatedResponse.json();
      setExperiences(updatedData.data || []);
      
      // Reset form
      setIsEditing(false);
      setCurrentExperience(null);
    } catch (error) {
      console.error("Error saving experience:", error);
      alert(error instanceof Error ? error.message : "Failed to save experience");
    }
  }

  // Handle experience deletion
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    
    try {
      const response = await fetch(`/api/admin/experiences?id=${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete experience");
      
      // Remove from list
      setExperiences(experiences.filter(experience => experience.id !== id));
    } catch (error) {
      console.error("Error deleting experience:", error);
      alert("Failed to delete experience");
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/admin/dashboard" className="text-[var(--navitem-text)] hover:text-[var(--navitem-text-hover)]">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-[var(--title)] mt-2">Manage Experiences</h1>
          </div>
          <button
            onClick={() => {
              setIsEditing(true);
              setCurrentExperience({
                id: "",
                title: "",
                company: "",
                period: "",
                type: "work",
                description: "",
              });
            }}
            className="action-button py-2 px-4 rounded text-white"
            disabled={isEditing}
          >
            Add New Experience
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-[var(--text-body)]">Loading...</div>
        ) : (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4 text-[var(--title)]">Work Experience</h2>
              {experiences.filter(exp => exp.type === 'work').length === 0 && (
                <p className="text-[var(--text-body)] italic">No work experiences added yet.</p>
              )}
              <div className="space-y-4">
                {experiences
                  .filter(exp => exp.type === 'work')
                  .map((experience) => (
                    <ExperienceCard 
                      key={experience.id} 
                      experience={experience}
                      onEdit={() => {
                        setIsEditing(true);
                        setCurrentExperience(experience);
                      }}
                      onDelete={() => handleDelete(experience.id)}
                    />
                  ))
                }
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4 text-[var(--title)]">Education</h2>
              {experiences.filter(exp => exp.type === 'education').length === 0 && (
                <p className="text-[var(--text-body)] italic">No education experiences added yet.</p>
              )}
              <div className="space-y-4">
                {experiences
                  .filter(exp => exp.type === 'education')
                  .map((experience) => (
                    <ExperienceCard 
                      key={experience.id} 
                      experience={experience}
                      onEdit={() => {
                        setIsEditing(true);
                        setCurrentExperience(experience);
                      }}
                      onDelete={() => handleDelete(experience.id)}
                    />
                  ))
                }
              </div>
            </div>
          </div>
        )}

        {/* Edit/Create Form Modal */}
        {isEditing && currentExperience && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[var(--background)] rounded-lg p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 text-[var(--title)]">
                {currentExperience.id ? "Edit Experience" : "Add New Experience"}
              </h2>
              
              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-4">
                  <label className="block mb-2 text-[var(--text-body)]">Title</label>
                  <input
                    type="text"
                    value={currentExperience.title}
                    onChange={(e) => setCurrentExperience({...currentExperience, title: e.target.value})}
                    className="w-full px-3 py-2 bg-[var(--foreground)] border rounded text-[var(--text-body)]"
                    placeholder="Software Engineer"
                    required
                  />
                </div>
                
                {/* Company */}
                <div className="mb-4">
                  <label className="block mb-2 text-[var(--text-body)]">
                    {currentExperience.type === 'education' ? 'Institution' : 'Company'}
                  </label>
                  <input
                    type="text"
                    value={currentExperience.company}
                    onChange={(e) => setCurrentExperience({...currentExperience, company: e.target.value})}
                    className="w-full px-3 py-2 bg-[var(--foreground)] border rounded text-[var(--text-body)]"
                    placeholder={currentExperience.type === 'education' ? 'University Name' : 'Company Name'}
                    required
                  />
                </div>
                
                {/* Period */}
                <div className="mb-4">
                  <label className="block mb-2 text-[var(--text-body)]">Period</label>
                  <input
                    type="text"
                    value={currentExperience.period}
                    onChange={(e) => setCurrentExperience({...currentExperience, period: e.target.value})}
                    className="w-full px-3 py-2 bg-[var(--foreground)] border rounded text-[var(--text-body)]"
                    placeholder="2020 - Present"
                    required
                  />
                </div>
                
                {/* Type */}
                <div className="mb-4">
                  <label className="block mb-2 text-[var(--text-body)]">Type</label>
                  <select
                    value={currentExperience.type}
                    onChange={(e) => setCurrentExperience({
                      ...currentExperience, 
                      type: e.target.value as 'education' | 'work'
                    })}
                    className="w-full px-3 py-2 bg-[var(--foreground)] border rounded text-[var(--text-body)]"
                    required
                  >
                    <option value="work">Work Experience</option>
                    <option value="education">Education</option>
                  </select>
                </div>
                
                {/* Description */}
                <div className="mb-6">
                  <label className="block mb-2 text-[var(--text-body)]">Description (optional)</label>
                  <textarea
                    value={currentExperience.description || ''}
                    onChange={(e) => setCurrentExperience({...currentExperience, description: e.target.value})}
                    className="w-full px-3 py-2 bg-[var(--foreground)] border rounded text-[var(--text-body)] h-32"
                    placeholder="Describe your responsibilities or achievements"
                  />
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setCurrentExperience(null);
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
}

// Experience card component
function ExperienceCard({ 
  experience, 
  onEdit, 
  onDelete 
}: { 
  experience: Experience; 
  onEdit: () => void; 
  onDelete: () => void;
}) {
  return (
    <div className="bg-[var(--foreground)] p-6 rounded-lg shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-xl font-medium text-[var(--title)]">
            {experience.title}
          </h3>
          <p className="text-[var(--text-body)]">{experience.company}</p>
          <p className="text-sm text-[var(--text-muted)]">{experience.period}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-500 hover:text-blue-700"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-500 hover:text-red-700"
          >
            🗑️
          </button>
        </div>
      </div>
      
      {experience.description && (
        <p className="text-[var(--text-body)] mt-2 text-sm">
          {experience.description}
        </p>
      )}
    </div>
  );
}
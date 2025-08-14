"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type Project = {
  id: string;
  title: string;
  year: string;
  description: string;
  tools_used: string[];
  image?: string;
  link?: string;
  featured?: boolean;
  displayOrder?: number;
};

export default function ProjectsManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentTool, setCurrentTool] = useState("");

  // Fetch projects on load
  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/admin/projects");
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setProjects(data.data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProjects();
  }, []);

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentProject) return;
    
    try {
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentProject),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to save project: ${errorData.error || response.statusText}`);
      }
      
      // Refresh projects list
      const updatedResponse = await fetch("/api/admin/projects");
      const updatedData = await updatedResponse.json();
      setProjects(updatedData.data || []);
      
      // Reset form
      setIsEditing(false);
      setCurrentProject(null);
    } catch (error) {
      console.error("Error saving project:", error);
      alert(error instanceof Error ? error.message : "Failed to save project");
    }
  }

  // Handle project deletion
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const response = await fetch(`/api/admin/projects?id=${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete project");
      
      // Remove from list
      setProjects(projects.filter(project => project.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
    }
  }

  // Handle adding a new tool
  function handleAddTool() {
    if (!currentProject || !currentTool.trim()) return;
    
    setCurrentProject({
      ...currentProject,
      tools_used: [...(currentProject.tools_used || []), currentTool.trim()]
    });
    setCurrentTool("");
  }

  // Handle removing a tool
  function handleRemoveTool(toolToRemove: string) {
    if (!currentProject) return;
    
    setCurrentProject({
      ...currentProject,
      tools_used: currentProject.tools_used.filter(tool => tool !== toolToRemove)
    });
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/admin/dashboard" className="text-[var(--navitem-text)] hover:text-[var(--navitem-text-hover)]">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-[var(--title)] mt-2">Manage Projects</h1>
          </div>
          <button
            onClick={() => {
              setIsEditing(true);
              setCurrentProject({
                id: "",
                title: "",
                year: new Date().getFullYear().toString(),
                description: "",
                tools_used: [],
                featured: false,
                displayOrder: projects.length + 1
              });
            }}
            className="action-button cursor-pointer hover:text-[var(--navitem-text-hover)] py-2 px-4 rounded text-white"
            disabled={isEditing}
          >
           + Add New Project
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-[var(--text-body)]">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-body)]">
            <p>No projects added yet. Click &quot;Add New Project&quot; to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                onEdit={() => {
                  setIsEditing(true);
                  setCurrentProject(project);
                }}
                onDelete={() => handleDelete(project.id)}
              />
            ))}
          </div>
        )}

        {/* Edit/Create Form Modal */}
        {isEditing && currentProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[var(--background)] rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 text-[var(--title)]">
                {currentProject.id ? "Edit Project" : "Add New Project"}
              </h2>
              
              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-4">
                  <label className="block mb-2 text-[var(--text-body)]">Title</label>
                  <input
                    type="text"
                    value={currentProject.title}
                    onChange={(e) => setCurrentProject({...currentProject, title: e.target.value})}
                    className="w-full px-3 py-2 bg-[var(--foreground)] border rounded text-[var(--text-body)]"
                    placeholder="Project Title"
                    required
                  />
                </div>
                
                {/* Year */}
                <div className="mb-4">
                  <label className="block mb-2 text-[var(--text-body)]">Year</label>
                  <input
                    type="text"
                    value={currentProject.year}
                    onChange={(e) => setCurrentProject({...currentProject, year: e.target.value})}
                    className="w-full px-3 py-2 bg-[var(--foreground)] border rounded text-[var(--text-body)]"
                    placeholder="2023"
                    required
                  />
                </div>
                
                {/* Display Order */}
                <div className="mb-4">
                  <label className="block mb-2 text-[var(--text-body)]">Display Order</label>
                  <input
                    type="number"
                    value={currentProject.displayOrder || ''}
                    onChange={(e) => setCurrentProject({...currentProject, displayOrder: e.target.value ? parseInt(e.target.value) : undefined})}
                    className="w-full px-3 py-2 bg-[var(--foreground)] border rounded text-[var(--text-body)]"
                    placeholder="1"
                    min="1"
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Lower numbers appear first. Leave empty to sort by year instead.
                  </p>
                </div>
                
                {/* Description */}
                <div className="mb-4">
                  <label className="block mb-2 text-[var(--text-body)]">Description</label>
                  <textarea
                    value={currentProject.description}
                    onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})}
                    className="w-full px-3 py-2 bg-[var(--foreground)] border rounded text-[var(--text-body)] h-32"
                    placeholder="Describe the project and your role in it"
                    required
                  />
                </div>
                
                {/* Tools Used */}
                <div className="mb-4">
                  <label className="block mb-2 text-[var(--text-body)]">Tools Used</label>
                  <div className="flex mb-2">
                    <input
                      type="text"
                      value={currentTool}
                      onChange={(e) => setCurrentTool(e.target.value)}
                      className="flex-grow px-3 py-2 bg-[var(--foreground)] border rounded-l text-[var(--text-body)]"
                      placeholder="Add a tool or technology"
                    />
                    <button
                      type="button"
                      onClick={handleAddTool}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
                    >
                      Add
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentProject.tools_used.map((tool, index) => (
                      <div 
                        key={index} 
                        className="bg-[var(--foreground)] px-3 py-1 rounded-full flex items-center"
                      >
                        <span className="text-sm text-[var(--text-body)]">{tool}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTool(tool)}
                          className="ml-2 text-red-500 hover:text-red-700 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Image URL */}
                <div className="mb-4">
                  <label className="block mb-2 text-[var(--text-body)]">Image URL (optional)</label>
                  <input
                    type="text"
                    value={currentProject.image || ''}
                    onChange={(e) => setCurrentProject({...currentProject, image: e.target.value})}
                    className="w-full px-3 py-2 bg-[var(--foreground)] border rounded text-[var(--text-body)]"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                {/* Project Link */}
                <div className="mb-4">
                  <label className="block mb-2 text-[var(--text-body)]">Project Link (optional)</label>
                  <input
                    type="text"
                    value={currentProject.link || ''}
                    onChange={(e) => setCurrentProject({...currentProject, link: e.target.value})}
                    className="w-full px-3 py-2 bg-[var(--foreground)] border rounded text-[var(--text-body)]"
                    placeholder="https://example.com"
                  />
                </div>
                
                {/* Featured */}
                <div className="mb-6 flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={currentProject.featured || false}
                    onChange={(e) => setCurrentProject({...currentProject, featured: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="featured" className="text-[var(--text-body)]">
                    Featured Project (show prominently on portfolio)
                  </label>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setCurrentProject(null);
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

// Project card component
function ProjectCard({ 
  project, 
  onEdit, 
  onDelete 
}: { 
  project: Project; 
  onEdit: () => void; 
  onDelete: () => void;
}) {
  return (
    <div className={"bg-[var(--foreground)] p-6 rounded-lg shadow"}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center">
            <h3 className="text-xl font-medium text-[var(--title)]">
              {project.title}
            </h3>
            {project.featured && (
              <span className="ml-2 bg-blue-700 text-white text-xs px-2 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-[var(--text-muted)]">{project.year}</p>
            {project.displayOrder && (
              <span className="text-xs bg-[var(--background)] px-2 py-1 rounded text-[var(--text-muted)]">
                Order: {project.displayOrder}
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 cursor-pointer hover:bg-[var(--ripple-color)] rounded text-blue-500 hover:text-blue-700"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="p-2 cursor-pointer hover:bg-[var(--ripple-color)] rounded text-red-500 hover:text-red-700"
          >
            🗑️
          </button>
        </div>
      </div>
      
      {project.image && (
        <div className="relative h-48 mb-4 rounded overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded"
          />
        </div>
      )}
      
      <p className="text-[var(--text-body)] text-sm line-clamp-3 mb-4">
        {project.description}
      </p>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {project.tools_used.map((tool, index) => (
          <span 
            key={index} 
            className="bg-[var(--background)] px-2 py-1 rounded-full text-xs text-[var(--text-muted)]"
          >
            {tool}
          </span>
        ))}
      </div>
      
      {project.link && (
        <a 
          href={project.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 text-sm flex items-center mt-4"
        >
          View Project
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
  );
}
import { NextRequest, NextResponse } from "next/server";
import { getProjects, saveProjects } from "@/lib/data";
import { Project } from "@/lib/models";

// Get all projects
export async function GET() {
  const result = await getProjects();
  
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  
  return NextResponse.json({ data: result.data, success: true });
}

// Add or update a project
export async function POST(request: NextRequest) {
  try {
    const projectData = await request.json();
    
    // Validate required fields
    if (!projectData.title || !projectData.year || !projectData.description) {
      return NextResponse.json(
        { error: "Title, year, and description are required fields", success: false },
        { status: 400 }
      );
    }
    
    // Ensure tools_used is an array
    if (!Array.isArray(projectData.tools_used)) {
      return NextResponse.json(
        { error: "tools_used must be an array", success: false },
        { status: 400 }
      );
    }
    
    // Get existing projects
    const existingResult = await getProjects();
    
    if (!existingResult.success || !existingResult.data) {
      return NextResponse.json(
        { error: "Failed to retrieve existing projects", success: false },
        { status: 500 }
      );
    }
    
    const projects = existingResult.data;
    
    // Update or add the project
    if (projectData.id) {
      const index = projects.findIndex(p => p.id === projectData.id);
      
      if (index !== -1) {
        projects[index] = {
          ...projects[index],
          ...projectData
        };
      } else {
        projects.push(projectData);
      }
    } else {
      projects.push(projectData);
    }
    
    // Save the updated projects
    const saveResult = await saveProjects(projects);
    
    if (!saveResult.success) {
      return NextResponse.json(
        { error: "Failed to save projects", success: false },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error processing request: ${error.message}`, success: false },
      { status: 500 }
    );
  }
}

// Delete a project
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required", success: false },
        { status: 400 }
      );
    }
    
    // Get existing projects
    const existingResult = await getProjects();
    
    if (!existingResult.success || !existingResult.data) {
      return NextResponse.json(
        { error: "Failed to retrieve existing projects", success: false },
        { status: 500 }
      );
    }
    
    const projects = existingResult.data;
    const filteredProjects = projects.filter(proj => proj.id !== id);
    
    if (filteredProjects.length === projects.length) {
      return NextResponse.json(
        { error: "Project not found", success: false },
        { status: 404 }
      );
    }
    
    // Save the updated projects list
    const saveResult = await saveProjects(filteredProjects);
    
    if (!saveResult.success) {
      return NextResponse.json(
        { error: "Failed to save projects", success: false },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error processing request: ${error.message}`, success: false },
      { status: 500 }
    );
  }
}
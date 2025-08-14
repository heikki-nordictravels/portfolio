import { NextRequest, NextResponse } from "next/server";
import { getSkills, saveSkills } from "@/lib/data";

export const dynamic = 'force-dynamic';

// Get all skills
export async function GET() {
  const result = await getSkills();
  
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  
  return NextResponse.json({ data: result.data, success: true });
}

// Add or update a skill
export async function POST(request: NextRequest) {
  try {
    // Get the skill data from the request body
    const skillData = await request.json();
    
    // Validate required fields
    if (!skillData.icon || !skillData.category) {
      return NextResponse.json(
        { error: "Icon and category are required fields", success: false },
        { status: 400 }
      );
    }
    
    // Get existing skills
    const existingResult = await getSkills();
    
    if (!existingResult.success || !existingResult.data) {
      return NextResponse.json(
        { error: "Failed to retrieve existing skills", success: false },
        { status: 500 }
      );
    }
    
    const skills = existingResult.data;
    
    // If it has an ID, update the existing skill
    if (skillData.id) {
      const index = skills.findIndex(s => s.id === skillData.id);
      
      if (index !== -1) {
        // Update existing skill
        skills[index] = {
          ...skills[index],
          ...skillData
        };
      } else {
        // Add as a new skill with the provided ID
        skills.push(skillData);
      }
    } else {
      // Add a new skill (the saveSkills function will assign a UUID)
      skills.push(skillData);
    }
    
    // Save the updated skills
    const saveResult = await saveSkills(skills);
    
    if (!saveResult.success) {
      return NextResponse.json(
        { error: "Failed to save skills", success: false },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: `Error processing request: ${error instanceof Error ? error.message : 'Unknown error'}`, success: false },
      { status: 500 }
    );
  }
}

// Delete a skill
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "Skill ID is required", success: false },
        { status: 400 }
      );
    }
    
    // Get existing skills
    const existingResult = await getSkills();
    
    if (!existingResult.success || !existingResult.data) {
      return NextResponse.json(
        { error: "Failed to retrieve existing skills", success: false },
        { status: 500 }
      );
    }
    
    const skills = existingResult.data;
    const filteredSkills = skills.filter(skill => skill.id !== id);
    
    // If no skills were filtered out, the ID wasn't found
    if (filteredSkills.length === skills.length) {
      return NextResponse.json(
        { error: "Skill not found", success: false },
        { status: 404 }
      );
    }
    
    // Save the updated skills list
    const saveResult = await saveSkills(filteredSkills);
    
    if (!saveResult.success) {
      return NextResponse.json(
        { error: "Failed to save skills", success: false },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: `Error processing request: ${error instanceof Error ? error.message : 'Unknown error'}`, success: false },
      { status: 500 }
    );
  }
}
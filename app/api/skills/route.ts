import { NextRequest, NextResponse } from "next/server";
import { getSkills, saveSkills } from "@/lib/data";

// Public endpoint to retrieve skills for the frontend
export async function GET() {
  const result = await getSkills();
  
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  
  return NextResponse.json(result.data);
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
    
    // THIS WAS MISSING: Check and return the result of the save operation
    if (!saveResult.success) {
      return NextResponse.json(
        { error: saveResult.error || "Failed to save skill", success: false },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in POST /api/skills:", error);
    return NextResponse.json(
      { error: `Error processing request: ${error.message}`, success: false },
      { status: 500 }
    );
  }
}

// Also fix the delete method...
export async function DELETE(request: NextRequest) {
  // Similar implementation with proper error handling and returns
}
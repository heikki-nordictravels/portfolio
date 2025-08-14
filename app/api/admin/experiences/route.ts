import { NextRequest, NextResponse } from "next/server";
import { getExperiences, saveExperiences } from "@/lib/data";

export const dynamic = 'force-dynamic';

// Get all experiences for admin
export async function GET() {
  const result = await getExperiences();
  
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  
  return NextResponse.json({ data: result.data, success: true });
}

// Add or update an experience
export async function POST(request: NextRequest) {
  try {
    const experienceData = await request.json();
    
    // Validate required fields
    if (!experienceData.title || !experienceData.company || !experienceData.period || !experienceData.type) {
      return NextResponse.json(
        { error: "Title, company, period, and type are required fields", success: false },
        { status: 400 }
      );
    }
    
    // Validate type field
    if (!['education', 'work'].includes(experienceData.type)) {
      return NextResponse.json(
        { error: "Type must be either 'education' or 'work'", success: false },
        { status: 400 }
      );
    }
    
    // Get existing experiences
    const existingResult = await getExperiences();
    
    if (!existingResult.success || !existingResult.data) {
      return NextResponse.json(
        { error: "Failed to retrieve existing experiences", success: false },
        { status: 500 }
      );
    }
    
    const experiences = existingResult.data;
    
    // Update or add the experience
    if (experienceData.id) {
      const index = experiences.findIndex(e => e.id === experienceData.id);
      
      if (index !== -1) {
        experiences[index] = {
          ...experiences[index],
          ...experienceData
        };
      } else {
        experiences.push(experienceData);
      }
    } else {
      experiences.push(experienceData);
    }
    
    // Save the updated experiences
    const saveResult = await saveExperiences(experiences);
    
    if (!saveResult.success) {
      return NextResponse.json(
        { error: saveResult.error || "Failed to save experiences", success: false },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error in POST /api/admin/experiences:", error);
    return NextResponse.json(
      { error: `Error processing request: ${error instanceof Error ? error.message : 'Unknown error'}`, success: false },
      { status: 500 }
    );
  }
}

// Delete an experience
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "Experience ID is required", success: false },
        { status: 400 }
      );
    }
    
    // Get existing experiences
    const existingResult = await getExperiences();
    
    if (!existingResult.success || !existingResult.data) {
      return NextResponse.json(
        { error: "Failed to retrieve existing experiences", success: false },
        { status: 500 }
      );
    }
    
    const experiences = existingResult.data;
    const filteredExperiences = experiences.filter(exp => exp.id !== id);
    
    if (filteredExperiences.length === experiences.length) {
      return NextResponse.json(
        { error: "Experience not found", success: false },
        { status: 404 }
      );
    }
    
    // Save the updated experiences list
    const saveResult = await saveExperiences(filteredExperiences);
    
    if (!saveResult.success) {
      return NextResponse.json(
        { error: saveResult.error || "Failed to save experiences", success: false },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error in DELETE /api/admin/experiences:", error);
    return NextResponse.json(
      { error: `Error processing request: ${error instanceof Error ? error.message : 'Unknown error'}`, success: false },
      { status: 500 }
    );
  }
}
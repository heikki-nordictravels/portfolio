import { NextResponse } from "next/server";
import { getProjects } from "@/lib/data";

// Public endpoint to retrieve projects for the frontend
export async function GET() {
  const result = await getProjects();
  
  if (!result.success) {
    return NextResponse.json({ error: "Failed to retrieve projects" }, { status: 500 });
  }
  
  return NextResponse.json(result.data);
}
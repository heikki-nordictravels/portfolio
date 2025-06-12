import { NextResponse } from "next/server";
import { getExperiences } from "@/lib/data";

// Public endpoint to retrieve experiences for the frontend
export async function GET() {
  const result = await getExperiences();
  
  if (!result.success) {
    return NextResponse.json({ error: "Failed to retrieve experiences" }, { status: 500 });
  }
  
  return NextResponse.json(result.data);
}
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST() {
  // Create response object first
  const response = NextResponse.json({ success: true });
  
  // Clear the admin token cookie on the response
  response.cookies.delete("admin_token");
  
  return response;
}
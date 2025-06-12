import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Make sure the admin password is set
    if (!process.env.ADMIN_PASSWORD) {
      console.error("Warning: ADMIN_PASSWORD environment variable is not set.");
      return NextResponse.json({ 
        success: false, 
        error: "Server configuration error" 
      }, { status: 500 });
    }
    
    // Validate the password
    if (password === process.env.ADMIN_PASSWORD) {
      // Create response object first
      const response = NextResponse.json({ success: true });
      
      // Set cookie on the response object
      response.cookies.set({
        name: "admin_token",
        value: process.env.AUTH_TOKEN || "demo_token",
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
      });
      
      return response;
    }
    
    return NextResponse.json({ 
      success: false, 
      error: "Invalid password" 
    }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      error: "Authentication error: " + error.message
    }, { status: 500 });
  }
}
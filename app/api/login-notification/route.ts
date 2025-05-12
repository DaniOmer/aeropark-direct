import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  sendEmail,
  generateLoginNotificationEmail,
} from "@/utils/email-service";

export async function POST(request: NextRequest) {
  try {
    console.log("Received login notification request");

    // Parse the request body
    const body = await request.json();
    console.log("Login notification payload:", body);

    const { userEmail } = body;

    if (!userEmail) {
      console.log("Missing required parameter: userEmail");
      return NextResponse.json(
        { error: "Missing required parameter: userEmail" },
        { status: 400 }
      );
    }

    // Get all admin users
    const supabase = await createClient();
    const { data: adminUsers, error: adminUsersError } = await supabase
      .from("users")
      .select("email, first_name, last_name")
      .eq("role", "super_admin");

    if (adminUsersError) {
      console.error("Error fetching admin users:", adminUsersError);
      return NextResponse.json(
        { error: "Failed to fetch admin users" },
        { status: 500 }
      );
    }

    if (!adminUsers || adminUsers.length === 0) {
      console.log("No admin users found to notify");
      return NextResponse.json(
        { message: "No admin users found to notify" },
        { status: 200 }
      );
    }

    // Generate login notification email content
    const htmlContent = generateLoginNotificationEmail(userEmail);

    // Send notification to all admin users
    const adminEmailResult = await sendEmail({
      to: adminUsers.map((admin) => ({
        email: admin.email,
        name: `${admin.first_name} ${admin.last_name}`,
      })),
      subject: `Notification de connexion - ${userEmail}`,
      htmlContent: htmlContent,
    });

    if (!adminEmailResult.success) {
      console.error(
        "Error sending login notification to admin users:",
        adminEmailResult.error
      );
      return NextResponse.json(
        { error: "Failed to send notification emails" },
        { status: 500 }
      );
    }

    console.log("Login notification emails sent successfully to admins");

    return NextResponse.json({
      success: true,
      message: "Login notification emails sent successfully",
    });
  } catch (error: any) {
    console.error("Error processing login notification:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

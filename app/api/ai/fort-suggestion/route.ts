import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { generateFortSuggestion } from "@/modules/ai/ai.service";

export async function POST() {
  try {
    await requireAdmin();

    const suggestion = await generateFortSuggestion();

    return NextResponse.json({
      success: true,
      suggested: suggestion,
    });
  } catch (e) {
    console.error("AI error:", e);
    return NextResponse.json(
      { success: false, message: "AI generation failed" },
      { status: 500 }
    );
  }
}

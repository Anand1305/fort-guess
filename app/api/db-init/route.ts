import { NextResponse } from "next/server";
import { AppDataSource } from "@/databse/data-source";

let initialized = false;

export async function GET() {
  try {
    if (!initialized) {
      const dataSource = AppDataSource();

      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }

      initialized = true;
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized and tables synced",
    });
  } catch (error: any) {
    console.error("DB init error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database initialization failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

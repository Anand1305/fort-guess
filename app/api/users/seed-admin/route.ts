import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { AppDataSource } from "@/databse/data-source";
import { User } from "@/databse/entities/users";

export async function GET() {
  try {
    const ds = AppDataSource();
    if (!ds.isInitialized) {
      await ds.initialize();
    }

    const userRepo = ds.getRepository(User);

    const existingAdmin = await userRepo.findOne({
      where: { email: "admin@gmail.com" },
    });

    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash("Admin@123!", 10);

    const admin = userRepo.create({
      name: "Admin",
      email: "admin@gmail.com",
      password_hash: hashedPassword,
      role: "ADMIN",
    });

    await userRepo.save(admin);

    return NextResponse.json({
      success: true,
      message: "Admin created successfully",
    });
  } catch (error: any) {
    console.error("Seed admin error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed admin",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

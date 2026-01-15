import { requireAdmin } from "@/lib/auth";
import { success, error } from "@/lib/response";
import {
  createFortController,
  listFortsController,
  updateFortController,
  setFortActiveController,
} from "@/modules/forts/fort.controller";

export async function POST(req: Request) {
  try {
    console.log("=== CREATE FORT REQUEST ===");
    await requireAdmin();

    const body = await req.json();
    console.log("Fort data:", body);

    const fort = await createFortController(body);
    console.log("Fort created:", fort.id);

    return success(fort, 201);
  } catch (e: any) {
    console.error("Create fort error:", e);
    return error(
      e.message === "FORT_EXISTS" ? "Fort already exists" : "Invalid data",
      400
    );
  }
}

export async function GET() {
  try {
    console.log("=== LIST FORTS REQUEST ===");
    await requireAdmin();

    const forts = await listFortsController();
    console.log("Forts count:", forts.length);

    return success(forts);
  } catch (e: any) {
    console.error("List forts error:", e);
    return error("Unauthorized", 401);
  }
}

export async function PUT(req: Request) {
  try {
    console.log("=== TOGGLE FORT STATUS REQUEST ===");
    await requireAdmin();

    const body = await req.json();
    console.log("Toggle body:", body);

    const { id, is_active } = body;

    if (!id) {
      console.error("No ID provided");
      return error("ID required", 400);
    }

    if (typeof is_active !== "boolean") {
      console.error("is_active must be boolean");
      return error("is_active must be boolean", 400);
    }

    console.log(`Setting fort ${id} active status to:`, is_active);
    await setFortActiveController(id, is_active);
    console.log("Fort status updated successfully");

    return success({ message: "Fort status updated", id, is_active });
  } catch (e: any) {
    console.error("Toggle fort error:", e);
    console.error("Error message:", e.message);
    console.error("Error stack:", e.stack);
    return error(
      e.message === "NOT_FOUND" ? "Fort not found" : "Update failed",
      400
    );
  }
}

export async function PATCH(req: Request) {
  try {
    console.log("=== EDIT FORT REQUEST ===");
    await requireAdmin();

    const body = await req.json();
    console.log("Patch body:", body);

    const { id, ...updateData } = body;

    if (!id) {
      console.error("No ID provided");
      return error("ID required", 400);
    }

    // Partial update of fort information
    console.log(`Updating fort ${id} with data:`, updateData);
    const fort = await updateFortController(id, updateData);
    console.log("Fort updated successfully");

    return success(fort);
  } catch (e: any) {
    console.error("Edit fort error:", e);
    console.error("Error message:", e.message);
    console.error("Error stack:", e.stack);
    return error(
      e.message === "NOT_FOUND" ? "Fort not found" : "Update failed",
      400
    );
  }
}

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
    await requireAdmin();
    const body = await req.json();
    const fort = await createFortController(body);
    return success(fort, 201);
  } catch (e: any) {
    return error(
      e.message === "FORT_EXISTS" ? "Fort already exists" : "Invalid data",
      400
    );
  }
}

export async function GET() {
  try {
    await requireAdmin();
    const forts = await listFortsController();
    return success(forts);
  } catch {
    return error("Unauthorized", 401);
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();

    const { id, is_active, ...body } = await req.json();
    if (!id) return error("ID required", 400);

    // Toggle active/inactive
    if (typeof is_active === "boolean") {
      await setFortActiveController(id, is_active);
      return success("Fort status updated");
    }

    // Normal edit
    const fort = await updateFortController(id, body);
    return success(fort);
  } catch {
    return error("Update failed", 400);
  }
}

import { requireAdmin } from "@/lib/auth";
import { success, error } from "@/lib/response";
import {
  createFortController,
  listFortsController,
  updateFortController,
  deleteFortController,
} from "@/modules/forts/fort.controller";

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const fort = await createFortController(body);
    return success(fort, 201);
  } catch (e: any) {
    return error(
      e.message === "FORT_EXISTS"
        ? "Fort already exists"
        : "Unauthorized or invalid data",
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

    const { id, ...body } = await req.json();
    const fort = await updateFortController(id, body);
    return success(fort);
  } catch {
    return error("Update failed", 400);
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();

    const { id } = await req.json();
    await deleteFortController(id);
    return success("Fort disabled");
  } catch {
    return error("Delete failed", 400);
  }
}

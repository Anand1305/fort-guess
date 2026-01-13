import { registerController } from "@/modules/auth/auth.controller";
import { success, error } from "@/lib/response";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await registerController(body);
    return success(result, 201);
  } catch (e: any) {
    return error(
      e.message === "EMAIL_EXISTS" ? "Email already exists" : "Invalid data",
      400
    );
  }
}
 
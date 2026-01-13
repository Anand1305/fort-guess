import { registerSchema } from "./auth.validations";
import { registerPlayer } from "./auth.service";

export async function registerController(body: any) {
  const data = registerSchema.parse(body);
  return registerPlayer(data);
}
 
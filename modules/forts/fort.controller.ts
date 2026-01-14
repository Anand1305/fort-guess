import { createFortSchema, updateFortSchema } from "./fort.validation";
import {
  createFort,
  listForts,
  updateFort,
  setFortActive,
} from "./fort.service";

export async function createFortController(body: any) {
  const data = createFortSchema.parse(body);
  return createFort(data);
}

export async function listFortsController() {
  return listForts();
}

export async function updateFortController(id: string, body: any) {
  const data = updateFortSchema.parse(body);
  return updateFort(id, data);
}

export async function setFortActiveController(id: string, is_active: boolean) {
  return setFortActive(id, is_active);
}

import { AppDataSource } from "@/databse/data-source";
import { Fort } from "@/databse/entities/fort";

export async function createFort(data: {
  name: string;
  location: string;
  description: string;
  image_url: string;
  hints: string[];
}) {
  const ds = AppDataSource();
  if (!ds.isInitialized) await ds.initialize();

  const repo = ds.getRepository(Fort);

  const exists = await repo.findOne({ where: { name: data.name } });
  if (exists) throw new Error("FORT_EXISTS");

  const fort = repo.create({
    ...data,
    is_active: true,
  });

  return repo.save(fort);
}

export async function listForts() {
  const ds = AppDataSource();
  if (!ds.isInitialized) await ds.initialize();

  return ds.getRepository(Fort).find({
    order: { created_at: "DESC" },
  });
}

export async function updateFort(id: string, data: Partial<Fort>) {
  console.log("updateFort called with id:", id);
  console.log("Update data:", data);

  const ds = AppDataSource();
  if (!ds.isInitialized) await ds.initialize();

  const repo = ds.getRepository(Fort);
  const fort = await repo.findOne({ where: { id } });

  console.log("Fort found:", !!fort);

  if (!fort) throw new Error("NOT_FOUND");

  Object.assign(fort, data);
  console.log("Saving updated fort...");

  const saved = await repo.save(fort);
  console.log("Fort saved successfully");

  return saved;
}

export async function setFortActive(id: string, is_active: boolean) {
  console.log("setFortActive called with id:", id, "is_active:", is_active);

  const ds = AppDataSource();
  if (!ds.isInitialized) await ds.initialize();

  const result = await ds.getRepository(Fort).update({ id }, { is_active });

  console.log("Update result:", result);
  console.log("Affected rows:", result.affected);

  if (result.affected === 0) {
    console.error("No rows affected - fort not found");
    throw new Error("NOT_FOUND");
  }

  console.log("Fort active status updated successfully");
  return true;
}

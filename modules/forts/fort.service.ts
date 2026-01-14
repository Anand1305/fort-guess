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
  const ds = AppDataSource();
  if (!ds.isInitialized) await ds.initialize();

  const repo = ds.getRepository(Fort);
  const fort = await repo.findOne({ where: { id } });
  if (!fort) throw new Error("NOT_FOUND");

  Object.assign(fort, data);
  return repo.save(fort);
}

export async function setFortActive(id: string, is_active: boolean) {
  const ds = AppDataSource();
  if (!ds.isInitialized) await ds.initialize();

  const result = await ds.getRepository(Fort).update({ id }, { is_active });

  if (result.affected === 0) {
    throw new Error("NOT_FOUND");
  }

  return true;
}

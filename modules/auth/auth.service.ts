import bcrypt from "bcrypt";
import { AppDataSource } from "@/databse/data-source";
import { User } from "@/databse/entities/users";

export async function registerPlayer(data: {
  name: string;
  email: string;
  password: string;
}) {
  const ds = AppDataSource();
  if (!ds.isInitialized) await ds.initialize(); 

  const repo = ds.getRepository(User);

  const exists = await repo.findOne({ where: { email: data.email } });
  if (exists) throw new Error("EMAIL_EXISTS");

  const user = repo.create({
    name: data.name,
    email: data.email,
    password_hash: await bcrypt.hash(data.password, 10),
    role: "PLAYER",
  });

  await repo.save(user);

  return { id: user.id, email: user.email };
}

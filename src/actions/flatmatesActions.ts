"use server";
import { eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { flatmates } from "@/db/schema";

export const getData = async () => {
  const data = await db.select().from(flatmates);
  return data;
};

export const addFlatmate = async (identifier: string) => {
  await db.insert(flatmates).values({
    identifier,
    isBusy: false,
    streak: 0,
    lastCleanedDate: null,
    busyUntil: null,
  });
  revalidatePath("/");
};

export const deleteFlatmate = async (id: number) => {
  await db.delete(flatmates).where(eq(flatmates.id, id));
  revalidatePath("/");
};

export const updateFlatmate = async (id: number, updateData: object) => {
  await db.update(flatmates).set(updateData).where(eq(flatmates.id, id));
  revalidatePath("/");
};

export const toggleBusy = async (id: number) => {
  await db
    .update(flatmates)
    .set({
      isBusy: not(flatmates.isBusy),
    })
    .where(eq(flatmates.id, id));
  revalidatePath("/");
};

export const confirmCleaning = async (id: number) => {
  const currentStreak = await db
    .select({ streak: flatmates.streak })
    .from(flatmates)
    .where(eq(flatmates.id, id))
    .then((rows) => rows[0]?.streak ?? 0);

  await db
    .update(flatmates)
    .set({
      streak: currentStreak + 1,
      lastCleanedDate: new Date().toISOString(),
    })
    .where(eq(flatmates.id, id));
  revalidatePath("/");
};

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../db";
import { flatmates } from "../../schema";
import { eq } from "drizzle-orm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const allFlatmates = await db.select().from(flatmates);
    res.status(200).json(allFlatmates);
  } else if (req.method === "POST") {
    const { identifier } = req.body;
    const newFlatmate = await db
      .insert(flatmates)
      .values({ identifier })
      .returning();
    res.status(201).json(newFlatmate[0]);
  } else if (req.method === "PUT") {
    const { id, ...updateData } = req.body;
    const updatedFlatmate = await db
      .update(flatmates)
      .set(updateData)
      .where(eq(flatmates.id, id))
      .returning();
    res.status(200).json(updatedFlatmate[0]);
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    await db.delete(flatmates).where(eq(flatmates.id, id));
    res.status(204).end();
  } else {
    res.status(405).end();
  }
}

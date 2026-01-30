"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function fetchAnnoncesFromDB(){
  try {
    const annoncesFromDB = await prisma.annonce.findMany({
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return annoncesFromDB; // <--- Très important
  } catch (error) {
    console.error("Erreur d'affichage des annonces", error);
    return []; // toujours retourner un tableau
  }
}

export async function createAnnonce(
  title: string,
  content: string,
  userId: string
) {
  if (!title || !content) {
    throw new Error("Champs requis");
  }

  const annonce = await prisma.annonce.create({
    data: {
      title,
      content,
      userId,
    },
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
  });

  // Revalidation si tu affiches une liste
  revalidatePath("/");

  return annonce;
}
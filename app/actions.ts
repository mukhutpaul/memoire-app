"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function fetchAnnoncesFromDB() {
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

export async function markAnnoncesAsRead(userId: string) {
  if (!userId) throw new Error("userId requis");

  await prisma.annonceLecture.updateMany({
    where: {
      userId,
      read: false, // seulement celles non lues
    },
    data: {
      read: true,
    },
  });
}

export async function createAnnonce(
  title: string,
  content: string,
  userId: string
) {
  if (!title || !content) {
    throw new Error("Champs requis");
  }

  // 1️⃣ Création de l'annonce
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

  // 2️⃣ Récupérer tous les utilisateurs sauf le créateur
  const users = await prisma.user.findMany({
    where: { id: { not: userId } },
    select: { id: true },
  });

  // 3️⃣ Créer une entrée "AnnonceLecture" pour chaque utilisateur (non lu)
  if (users.length > 0) {
    await prisma.annonceLecture.createMany({
      data: users.map(u => ({
        annonceId: annonce.id,
        userId: u.id,
        read: false, // par défaut non lu
      })),
    });
  }

  // 4️⃣ Revalidation si tu affiches une liste
  revalidatePath("/");

  return annonce;
}

export async function getUnreadAnnoncesCount(userId: string) {
  if (!userId) return 0
  const count = await prisma.annonceLecture.count({
    where: { userId, read: false },
  })
  return count
}

export async function markAllAnnoncesAsRead(userId: string) {
  if (!userId) return
  await prisma.annonceLecture.updateMany({
    where: { userId, read: false },
    data: { read: true },
  })
}




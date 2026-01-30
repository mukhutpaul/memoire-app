"use client";

import { useEffect, useState } from "react";
import { fetchAnnoncesFromDB } from "../actions";

interface Annonce {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

export default function AnnonceList() {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // éviter les leaks si le composant se démonte

    async function fetchAnnonces() {
      try {
        const dataFromDB = await fetchAnnoncesFromDB();

        // Transformer les données côté client pour éviter le mismatch SSR
        const formattedData: Annonce[] = dataFromDB.map((a) => ({
          id: a.id,
          title: a.title,
          content: a.content,
          createdAt: new Date(a.createdAt).toISOString(), // uniforme pour SSR/Client
          user: {
            id: a.user.id,
            name: a.user.name || "Utilisateur inconnu",
          },
        }));

        if (isMounted) setAnnonces(formattedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des annonces", error);
        if (isMounted) setAnnonces([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchAnnonces();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return null; // rien côté serveur pour éviter le mismatch
  if (annonces.length === 0)
    return <p className="text-center p-4">Aucune annonce disponible</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 p-4">
      {annonces.map((annonce) => (
        <div key={annonce.id} className="card bg-base-200 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-lg font-bold">{annonce.title}</h2>
            <p className="text-sm text-gray-500 mb-2">
              Par {annonce.user.name} le{" "}
              {new Date(annonce.createdAt).toLocaleDateString("fr-FR")}
            </p>
            <div
              className="prose max-w-full"
              dangerouslySetInnerHTML={{ __html: annonce.content }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}

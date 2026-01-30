"use client";

import { useEffect, useState } from "react";
import { fetchAnnoncesFromDB } from "../actions";
import { Edit2, Trash2 } from "lucide-react"; // <-- import icônes

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

        const formattedData: Annonce[] = dataFromDB.map((a) => ({
          id: a.id,
          title: a.title,
          content: a.content,
          createdAt: new Date(a.createdAt).toISOString(),
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

  if (loading)
    return <p className="text-center p-4">Chargement des annonces...</p>;
  if (annonces.length === 0)
    return <p className="text-center p-4">Aucune annonce disponible</p>;

  const handleEdit = (id: number) => {
    console.log("Modifier annonce ID:", id);
    // ici tu peux rediriger vers une page d'édition ou ouvrir un modal
  };

  const handleDelete = (id: number) => {
    console.log("Supprimer annonce ID:", id);
    // ici tu peux appeler ton action de suppression
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 p-4">
      {annonces.map((annonce) => (
        <div key={annonce.id} className="card bg-base-200 shadow-md">
          <div className="card-body">
            <div className="flex justify-between items-start">
              <h2 className="card-title text-lg font-bold break-words">
                {annonce.title}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(annonce.id)}
                  className="btn btn-ghost btn-sm p-1"
                  title="Modifier"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(annonce.id)}
                  className="btn btn-ghost btn-sm p-1"
                  title="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-2 break-words">
              Par {annonce.user.name} le{" "}
              {new Date(annonce.createdAt).toLocaleDateString("fr-FR")}
            </p>

            <div
              className="prose max-w-full break-words overflow-x-auto [&>img]:max-w-full [&>img]:h-auto"
              dangerouslySetInnerHTML={{ __html: annonce.content }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}

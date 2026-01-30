import { prisma } from "@/lib/prisma";


export default async function LectureAn() {
  const annonces = await prisma.annonce.findMany({
    include: {
      user: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Exemple utilisateur connecté
  const userId = "";

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
 

      {annonces.map((a) => (
        <div key={a.id} className="card bg-base-100 p-4 shadow">
          <h2 className="font-bold">{a.title}</h2>
          <p className="text-sm text-gray-500">Par {a.user.name}</p>
          <div dangerouslySetInnerHTML={{ __html: a.content }} />
        </div>
      ))}
    </div>
  );
}

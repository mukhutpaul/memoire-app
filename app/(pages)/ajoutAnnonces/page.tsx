"use client"
import AnnouncementEditor from "@/app/components/Editeur"
import LectureAn from "@/app/components/ListAnnonces";
import { User } from "lucide-react"
import { useSession } from "next-auth/react";

function page() {
  const { data: session } = useSession();
  return (
    <div className="py-4 px-4 mx-[10%] flex justify-center gap-10">
      <div className="w-1/4">
        <div className="w-full h-28  py-2 px-2 m-4 rounded-sm shadow-md">
          <div className="flex items-center justify-between">
            <User className="w-10 h-10 text-accent" />

            <div className="badge badge-success">{session?.user?.name}</div>
          </div>
          <div className="flex justify-between flex-col gap-1">

             {session?.user?.email}

            <div className="badge badge-info">Rôle : {session?.user?.role}</div>
          </div>
        </div>
      </div>
      <div className="w-3/4">
      {/* <LectureAn /> */}
      {session?.user?.id && (
        <AnnouncementEditor userId={session?.user?.id} />
      )}
      </div>
    </div>
  )
}

export default page
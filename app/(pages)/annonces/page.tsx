"use client"

import AnnouncementEditor from "@/app/components/Editeur"
import AnnonceList from "@/app/components/ListAnnonces"
import { Megaphone } from "lucide-react"
import Link from "next/link"

function page() {
  return (
    <div className="py-4 px-4 mx-[10%] flex flex-col">
       
       <Link className="flex gap-1 btn btn-accent w-[20%] mx-4"
       href={"/ajoutAnnonces"}
       >
        <Megaphone size={24}  />  <p className="hidden md:flex">Nouvelle annonce</p> 
       </Link>
        
        <AnnonceList />
   
    </div>
  )
}

export default page
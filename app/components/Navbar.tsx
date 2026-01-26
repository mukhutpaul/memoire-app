"use client"
import { UserButton, useUser } from '@clerk/nextjs'
import { AudioWaveform, GlobeLock, LogOut, Menu, Server, Settings, User, X } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import ThemeSwitcher from './ThemeSwitcher'
import { usePathname } from "next/navigation";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Image from 'next/image'


const NavBar = () => {

    const [menuOpen, setMenuOpen] = useState(false)
    const [pageName, setPageName] = useState<string | null>(null)
    const { data: session } = useSession();
    const pathname = usePathname();

    type Role = "ADMIN" | "USER";
    type NavLink = {
        href: string;
        label: string;
        auth?: boolean;
        roles?: Role[];
    };


    const navLinks: NavLink[] = [

        { href: "/", label: "Accueil" },

        {
            href: "/services",
            label: "Vos services",
            auth: true,
            roles: ["USER", "ADMIN"],
        },

        {
            href: "/post_list",
            label: "Vos postes",
            auth: true,
            roles: ["USER", "ADMIN"],
        },

        {
            href: "/dashboard",
            label: "Tableau de bord",
            auth: true,
            roles: ["ADMIN"],
        },
    ]

    const filteredLinks = navLinks.filter((link) => {


        // Lien public
        if (!link.auth) return true;

        // Lien privé mais non connecté
        if (!session?.user) return false;

        // Lien avec rôles
        if (link.roles) {
            return link.roles.includes(session.user.role);
        }

        return true;
    });

    const isActiveLink = (href: string) => {
        if (href === "/") {
            return pathname === "/";
        }
        return pathname.startsWith(href);
    };


    const renderLinks = (className: string, href: string) => {


        return (
            <>
                <button className="btn btn-sm btn-accent btn-circle"
                    onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>
                    <Settings className='w-4 h-4' />
                </button>
                {
                    filteredLinks.map(({ href, label }) => (

                        <Link key={href} href={href} className={`${className} ${isActiveLink(href) ? "btn-accent text-white" : ""} btn-sm`}>
                            {label}
                        </Link>

                    ))
                }

                {pageName && (
                    <Link href={`/page/${pageName}`} className={`${className} btn-sm`}>
                        <GlobeLock className='w-4 h-4' />
                    </Link>
                )}
            </>
        )
    }

    return (
        <div className='border-b border-base-300 px-5 md:px-[10%] py-4 relative'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                    <div className='rounded-full p-2'>
                        <AudioWaveform className='w-6 h-6 text-accent' />
                    </div>
                    <span className='font-bold text-xl'>
                        A.Ouvrier
                    </span>
                    <ThemeSwitcher />
                </div>

                <button className='btn w-fit btn-sm sm:hidden'
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <Menu className='w-4' />

                </button>

                <div className='space-x-2 flex items-center hidden sm:flex'>
                    {renderLinks("btn rounded-xl")}

                    <div className="dropdown dropdown-start " >

                        {/* <div tabIndex={0} className="btn m-1 rounded-full w-10 h-10">
                            <User width={8} height={8}/>
                        </div> */}
                        {session && (
                            <button tabIndex={0} className="btn btn-sm btn-accent btn-circle">
                                <User className='w-4 h-4' />
                            </button>
                        )}
                        <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">

                            <li><a>
                                <User className='w-4 h-4' />
                                {session?.user?.email}
                            </a></li>
                             <li><a>
                                <Settings className='w-4 h-4' />
                                Paramettre
                            </a></li>

                            <li>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/login" })}
                                    className="text-red-600"
                                >
                                    <LogOut className='w-4 h-4' />
                                    Se déconnecter
                                </button>
                            </li>

                        </ul>
                    </div>

                </div>
            </div>

            <div className={`absolute top-0 w-full bg-base-100 h-screen flex flex-col gap-2 p-4 
        transition-all duration-300 sm:hidden z-50 ${menuOpen ? "left-0" : "-left-full"}`}>
                <div className='flex justify-between'>

                    <button className='btn w-fit btn-sm sm:hidden'
                        onClick={() => setMenuOpen(!menuOpen)}>
                        <X className='w-4' />
                    </button>
                    <div className="dropdown dropdown-start " >

                        {/* <div tabIndex={0} className="btn m-1 rounded-full w-10 h-10">
                            <User width={8} height={8}/>
                        </div> */}
                        {session && (
                            <button tabIndex={0} className="btn btn-sm btn-accent btn-circle">
                                <User className='w-4 h-4' />
                            </button>
                        )}
                        <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm -left-36">

                            <li>
                                <button


                                >
                                    <User className='w-4 h-4' />
                                    {session?.user?.email}
                                </button>
                            </li>
                            <li>
                                <button
                                   

                                >
                                    <Settings className='w-4 h-4' />
                                    Paramettre
                                </button>
                            </li>

                               <li>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/login" })}
                                    className="text-red-600"
                                >
                                    <LogOut className='w-4 h-4' />
                                    Se déconnecter
                                </button>
                            </li>


                        </ul>
                    </div>

                </div>
                {renderLinks("btn")}

            </div>

        </div>


    )
}

export default NavBar
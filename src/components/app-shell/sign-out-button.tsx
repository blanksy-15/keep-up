"use client";
import { useState } from "react";import { useRouter } from "next/navigation";import { authClient } from "@/auth/client";
export function SignOutButton(){const[pending,setPending]=useState(false),router=useRouter();return <button className="sign-out-button" disabled={pending} onClick={async()=>{setPending(true);await authClient.signOut();router.push("/sign-in");router.refresh();}}>{pending?"Signing out…":"Sign out"}</button>;}

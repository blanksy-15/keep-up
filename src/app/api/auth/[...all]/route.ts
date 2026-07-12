import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/auth/server";
export const {GET,POST,PATCH,PUT,DELETE}=toNextJsHandler((request)=>getAuth().handler(request));

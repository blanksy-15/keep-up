import type { AuthenticatedAccount } from "../application";
export function mapSessionUser(user:{id:string;email:string;name:string}):AuthenticatedAccount{return{ownerId:user.id,email:user.email,displayName:user.name};}

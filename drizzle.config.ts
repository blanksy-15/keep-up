import { defineConfig } from "drizzle-kit";
export default defineConfig({dialect:"postgresql",schema:"./src/database/schema/index.ts",out:"./drizzle",dbCredentials:{url:process.env.DATABASE_URL??"postgresql://configuration-required.invalid/keep_up"},strict:true,verbose:true});

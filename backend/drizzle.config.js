import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: 'postgresql',
    casing: 'snake_case',
    schema: './src/database/schema/**.js',
    dbCredentials: { url: process.env.DATABASE_URL }
})
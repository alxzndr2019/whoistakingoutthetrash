import "./drizzle/envConfig";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/app/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});

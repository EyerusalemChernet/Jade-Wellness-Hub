import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load .env from backend/.env or project-root/.env (whichever exists first)
const backendEnvPath = path.resolve(process.cwd(), ".env");
const rootEnvPath = path.resolve(process.cwd(), "..", ".env");
const envPathToUse = fs.existsSync(backendEnvPath)
  ? backendEnvPath
  : (fs.existsSync(rootEnvPath) ? rootEnvPath : undefined);

if (envPathToUse) {
  dotenv.config({ path: envPathToUse });
  console.info(`[env] Loaded environment from: ${envPathToUse}`);
} else {
  dotenv.config(); // fallback to default lookup
  console.warn("[env] No explicit .env found in backend/ or project root. Using process env only.");
}

const isProduction = (process.env.NODE_ENV || "development") === "production";

const requiredEnvVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "EMAIL_HOST",
  "EMAIL_PORT",
  "EMAIL_USER",
  "EMAIL_PASS",
];

const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

// Only hard-fail in production. In development, warn and allow start.
if (missingEnvVars.length > 0 && isProduction) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}

if (missingEnvVars.length > 0 && !isProduction) {
  console.warn(
    `[env] Missing environment variables (dev mode): ${missingEnvVars.join(", ")}. ` +
    "Some features (DB, email) may be disabled."
  );
}

export default {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5002,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET || (isProduction ? undefined : "dev-secret"),
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  COHERE_API_KEY: process.env.COHERE_API_KEY,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : undefined,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
  __MISSING: missingEnvVars,
  __IS_PROD: isProduction
};
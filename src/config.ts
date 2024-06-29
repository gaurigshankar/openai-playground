import { resolve } from "path";
import dotenv from "dotenv-safe";
const NODE_ENV = process.env.NODE_ENV;

export const getDotenvPath = () =>
  NODE_ENV === "production"
    ? "/etc/secrets/dotenv.txt"
    : resolve(process.cwd(), !!NODE_ENV ? `.env.${NODE_ENV}` : ".env");

export const loadDotenv = () =>
  dotenv.config({
    allowEmptyValues: true,
    path: getDotenvPath(),
    example: resolve(process.cwd(), `.env.example`),
  });

export const readConfig = async () => {
  await loadDotenv();
  const { OPEN_AI_API_KEY } = process.env;
  const config = {
    OPEN_AI_API_KEY
  };
  return config;
};
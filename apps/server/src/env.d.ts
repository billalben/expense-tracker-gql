declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_URI: string;
    SESSION_SECRET: string;
    CLIENT_URL: string;
    NODE_ENV?: "development" | "production" | "test";
    PORT?: string;
  }
}
import express from "express";
import type { RequestHandler } from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import { buildContext } from "graphql-passport";

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";

import { connectDB } from "./db/connectDB.js";
import { configurePassport } from "./passport/passport.config.js";
import type { IResolvers } from "@graphql-tools/utils";
import type { GraphQLContext, GraphQLContextParams } from "./types/index.js";

dotenv.config();
configurePassport(); // passport.serializeUser, passport.deserializeUser, passport.use

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";
const app = express();

if (isProduction) {
  app.set("trust proxy", 1);
}

const httpServer = http.createServer(app);

const MongoDBStore = connectMongo(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

store.on("error", (error) => console.error(error));

app.use(
  session({
    secret: process.env.SESSION_SECRET, // A secret key to sign the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true, // The cookie only accessible by the web server
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer<GraphQLContext>({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers as IResolvers<unknown, GraphQLContext>,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

const graphqlMiddleware: RequestHandler[] = [
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) =>
      buildContext({
        req,
        res,
        passport,
      } as GraphQLContextParams) as unknown as GraphQLContext,
  }) as RequestHandler,
];

// In production the client is served from this same origin, so CORS isn't
// needed. In development the Vite dev server proxies to us, but we still
// allow the configured client origin for flexibility.
if (!isProduction) {
  graphqlMiddleware.unshift(
    cors({ origin: process.env.CLIENT_URL, credentials: true })
  );
}

app.use("/graphql", ...graphqlMiddleware);

if (isProduction) {
  const clientDist = path.resolve(__dirname, "../../client/dist");
  app.use(express.static(clientDist));

  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(clientDist, "index.html"));
  });
}

const port = Number(process.env.PORT) || 4000;

// Modified server startup
await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
await connectDB();

console.log(`🚀 Server ready at http://localhost:${port}/graphql`);

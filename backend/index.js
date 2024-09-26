import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";

// import { connectDB } from "./db/connectDB";

dotenv.config();
const app = express();

const httpServer = http.createServer(app);

// const MongoDBStore = connectMongo(session);

// const store = new MongoDBStore({
//   uri: process.env.MONGO_URI,
//   collection: "sessions",
// });

// store.on("error", (error) => console.error(error));

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET, // A secret key to sign the session ID cookie
//     resave: false, // Don't save session if unmodified
//     saveUninitialized: false, // Don't create session until something stored
//     store,
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 24, // 1 day
//       httpOnly: true, // The cookie only accessible by the web server
//     },
//   })
// );

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  "/graphql",
  cors({ origin: "http://localhost:5173", credentials: true }),
  express.json(),
  expressMiddleware(server, {
    context: ({ req, res }) => ({ req, res }),
  })
);

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
// await connectDB();

console.log(`🚀 Server ready at http://localhost:4000/graphql`);

import passport from "passport";

import User from "../models/user.model.js";
import { GraphQLLocalStrategy } from "graphql-passport";
import type { AuthUser } from "../types/index.js";

export const configurePassport = () => {
  passport.serializeUser((user, done) => {
    done(null, (user as AuthUser)._id.toString());
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  passport.use(
    new GraphQLLocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username as string });
        if (!user) throw new Error("Invalid username or password");

        const passwordMatches = await user.matchPassword(password as string);

        if (!passwordMatches) throw new Error("Invalid username or password");

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
};

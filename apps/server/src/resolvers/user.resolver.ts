import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";
import type { AuthUser, GraphQLContext } from "../types/index.js";

interface SignUpInput {
  username: string;
  name: string;
  password: string;
  gender: "male" | "female";
}

interface LoginInput {
  username: string;
  password: string;
}

const userResolver = {
  Mutation: {
    signUp: async (
      _: unknown,
      { input }: { input: SignUpInput },
      context: GraphQLContext
    ) => {
      try {
        const { username, name, password, gender } = input;
        if (!username || !name || !password || !gender) {
          throw new Error("All fields are required");
        }

        const userExists = await User.findOne({ username });
        if (userExists) throw new Error("User already exists");

        // https://avatar-placeholder.iran.liara.run/
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        // Validate gender
        if (!["male", "female"].includes(gender)) {
          throw new Error("Gender must be either 'male' or 'female'");
        }

        // Create a new user
        const newUser = await User.create({
          username,
          name,
          password,
          gender,
          profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
        });

        await context.login(newUser);

        return newUser;
      } catch (error) {
        throw new Error((error as Error).message || "Internal server error");
      }
    },
    login: async (
      _: unknown,
      { input }: { input: LoginInput },
      context: GraphQLContext
    ) => {
      try {
        const { username, password } = input;
        if (!username || !password) throw new Error("All fields are required");
        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        });
        if (!user) throw new Error("Invalid username or password");

        await context.login(user);
        return user;
      } catch (error) {
        throw new Error((error as Error).message || "Internal server error");
      }
    },
    logout: async (_: unknown, __: unknown, context: GraphQLContext) => {
      try {
        await context.logout();
        context.req.session.destroy((err) => {
          if (err) throw err;
        });
        context.res?.clearCookie("connect.sid");

        return { message: "Logged out successfully" };
      } catch (error) {
        throw new Error((error as Error).message || "Internal server error");
      }
    },
  },
  Query: {
    authUser: async (_: unknown, __: unknown, context: GraphQLContext) => {
      try {
        return await context.getUser();
      } catch {
        throw new Error("Internal server error");
      }
    },
    user: async (_: unknown, { userId }: { userId: string }) => {
      try {
        return await User.findById(userId);
      } catch (error) {
        throw new Error((error as Error).message || "Error getting user");
      }
    },
  },
  User: {
    transactions: async (parent: AuthUser) => {
      try {
        return await Transaction.find({ userId: parent._id });
      } catch (error) {
        throw new Error((error as Error)?.message || "Internal server error");
      }
    },
  },
};

export default userResolver;

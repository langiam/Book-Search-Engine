import { AuthenticationError } from 'apollo-server-express';
import User from '../models';
import { signToken } from '../services/auth.js';

export const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in');
      }
      return User.findById(context.user._id);
    },
  },

  Mutation: {
    addUser: async (
      _parent: any,
      { username, email, password }: { username: string; email: string; password: string }
    ) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    login: async (
      _parent: any,
      { email, password }: { email: string; password: string }
    ) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('No user found with this email');
      }

      const valid = await user.isCorrectPassword(password);
      if (!valid) {
        throw new AuthenticationError('Incorrect password');
      }

      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (
      _parent: any,
      { input }: { input: any },
      context: any
    ) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in');
      }

      return User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: input } },
        { new: true }
      );
    },

    removeBook: async (
      _parent: any,
      { bookId }: { bookId: string },
      context: any
    ) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in');
      }

      return User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};

import { AuthenticationError } from 'apollo-server-express';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';
export const resolvers = {
    Query: {
        me: async (_parent, _args, context) => {
            if (!context.user) {
                throw new AuthenticationError('You must be logged in');
            }
            return User.findById(context.user._id);
        },
    },
    Mutation: {
        addUser: async (_parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async (_parent, { email, password }) => {
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
        saveBook: async (_parent, { input }, context) => {
            if (!context.user) {
                throw new AuthenticationError('You must be logged in');
            }
            return User.findByIdAndUpdate(context.user._id, { $addToSet: { savedBooks: input } }, { new: true });
        },
        removeBook: async (_parent, { bookId }, context) => {
            if (!context.user) {
                throw new AuthenticationError('You must be logged in');
            }
            return User.findByIdAndUpdate(context.user._id, { $pull: { savedBooks: { bookId } } }, { new: true });
        },
    },
};

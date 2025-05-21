import express, { Application, Request } from 'express';
import path from 'node:path';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schemas';
import { getUserFromToken } from './utils/auth';
import db from './config/connection.js';
import routes from './routes/index.js';

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

async function startApolloServer() {
  // Create ApolloServer instance
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: { req: Request }) => ({
      user: getUserFromToken(req),
    }),
  });

  // Start Apollo
  await server.start();

  // Apply as Express middleware
  server.applyMiddleware({ app, path: '/graphql' });

  // Mount remaining REST routes
  app.use(routes);

  // Connect DB & start server
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

startApolloServer();
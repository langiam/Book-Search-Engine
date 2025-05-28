// server/src/server.ts
import express, { Application, Request } from 'express';
import cors from 'cors';
import path from 'node:path';
import { ApolloServer } from 'apollo-server-express';
import db from './config/connection.js';
import routes from './routes/index.js';
import { typeDefs, resolvers } from './schemas/index.js';
import { getUserFromToken } from './utils/auth.js';

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all origins (you can lock this down later)
app.use(cors({ origin: '*' }));

// Parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: { req: Request }) => ({
      user: getUserFromToken(req),
    }),
  });
  await server.start();

  // Mount GraphQL on /graphql
  server.applyMiddleware({ app: app as any, path: '/graphql' });

  // Mount any legacy REST routes on /api
  app.use(routes);

  // **Now** serve your built React files (client/dist) for all other GETs
  if (process.env.NODE_ENV === 'production') {
    app.use(
      express.static(path.join(__dirname, '../../client/dist'))
    );
    // Fall back to index.html for React Router
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  // Connect to DB & start server
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
}

startApolloServer();

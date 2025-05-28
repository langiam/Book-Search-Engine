import express, { Application, Request } from 'express';
import path from 'node:path';
import { ApolloServer } from 'apollo-server-express';
import db from './config/connection.js';
import routes from './routes/index.js';
import { typeDefs, resolvers } from './schemas';
import { getUserFromToken } from './utils/auth';

const app: Application = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: { req: Request }) => {
      const user = getUserFromToken(req);
      return { user };
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  // (Optional) legacy REST routes
  app.use(routes);

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
}

startApolloServer();

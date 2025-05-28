// server/src/server.ts
import express, { Application } from 'express';
import cors from 'cors';
import { resolve } from 'node:path';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import db from './config/connection.js';
import routes from './routes/index.js';
import { typeDefs, resolvers } from './schemas/index.js';
import { getUserFromToken } from './utils/auth.js';

const app: Application = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // tell TS that req comes from Apollo's own ExpressContext
    context: ({ req }: ExpressContext) => {
      const user = getUserFromToken(req);
      return { user };
    },
  });

  await server.start();
  server.applyMiddleware({ app: app as any, path: '/graphql' });
  app.use(routes);

  if (process.env.NODE_ENV === 'production') {
    const clientDist = resolve(process.cwd(), 'client', 'dist');
    app.use(express.static(clientDist));
    app.get('*', (_req, res) => {
      res.sendFile(resolve(clientDist, 'index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
}

startApolloServer();

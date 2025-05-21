import express, { Application, Request, Response, NextFunction } from 'express';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import db from './config/connection.js';
import routes from './routes/index.js';
import { typeDefs, resolvers } from './schemas';
import { getUserFromToken } from './utils/auth';

const app: Application = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

async function startApolloServer() {
  // 1️⃣ Create ApolloServer instance
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // 2️⃣ Start Apollo
  await server.start();

  // 3️⃣ Mount Apollo middleware on /graphql
  app.use(
    '/graphql',
    express.json(),
    express.urlencoded({ extended: true }),
    expressMiddleware(server, {
      context: async ({ req }: { req: Request }) => {
        const user = getUserFromToken(req);
        return { user };
      },
    })
  );

  // 4️⃣ Mount remaining REST routes
  app.use(routes);

  // 5️⃣ Connect to MongoDB and start listening
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(
        `🚀 Server ready at http://localhost:${PORT}/graphql`
      );
    });
  });
}

startApolloServer();

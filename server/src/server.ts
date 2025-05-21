import express from 'express';
import path from 'node:path';
import { ApolloServer } from 'apollo-server-express';
import db from './config/connection.js';
import routes from './routes/index.js';
import { typeDefs, resolvers } from '../src/schemas/typeDefs';
import { authenticateToken } from '..

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

async function startApollo() {
  // 1️⃣ Create the ApolloServer instance
  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      // pull the JWT from headers, verify it, and attach the user to context
      const user = await authenticateToken(req);
      return { user };
    },
  });

  // 2️⃣ Start Apollo
  await apollo.start();

  // 3️⃣ Mount Apollo middleware at /graphql
  apollo.applyMiddleware({ app, path: '/graphql' });

  // 4️⃣ Mount any legacy REST routes (if still needed)
  app.use(routes);

  // 5️⃣ Connect DB and start listening
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${apollo.graphqlPath}`);
    });
  });
}

startApollo();

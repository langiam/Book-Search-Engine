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

// 1️⃣ Enable CORS *before* parsing bodies or applying middleware
app.use(cors({
  origin: 'https://book-search-engine-4fwj.onrender.com', // your client URL
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 2️⃣ Serve your Vite build in production (dist, not build)
if (process.env.NODE_ENV === 'production') {
  app.use(
    express.static(path.join(__dirname, '../client/dist'))
  );
}

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: { req: Request }) => ({
      user: getUserFromToken(req),
    }),
  });

  await server.start();

  // 3️⃣ Apply Apollo middleware AFTER CORS & body parsers
  server.applyMiddleware({
    app: app as any,      // workaround for express-type duplication
    path: '/graphql',
  });

  // 4️⃣ (Optional) mount legacy REST routes
  app.use(routes);

  // 5️⃣ Connect to MongoDB & start Express
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
}

startApolloServer();

# Book Search Engine (GraphQL Edition)

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Description

This repo contains a full-stack MERN book search application refactored to use a GraphQL API with Apollo Server. Users can search the Google Books API, save favorites to their account, and manage saved books. The front end is built with React and Vite; the back end is Node.js, Express, MongoDB (Mongoose), and Apollo Server.

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Tech](#tech)
- [Usage](#usage)
- [License](#license)
- [Contribution](#contribution)
- [Testing](#testing)
- [Contact](#contact)

## Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/langiam/Book-Search-Engine.git
   cd Book-Search-Engine
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**

   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment files**

   Create `.env` file in `server/` directory:

   ```plaintext
   MONGODB_URI=<Your MongoDB Atlas URI>
   JWT_SECRET_KEY=<A long, random secret>
   PORT=3001
   NODE_ENV=development
   ```

   Optionally, create `.env` file in `client/` directory:

   ```plaintext
   # e.g. VITE_GRAPHQL_URL=http://localhost:3001/graphql
   ```

## Features

- **GraphQL API**: Queries & mutations for signup, login, book search, save/remove books.
- **Authentication**: JWT-based login/signup, protected me query.
- **Responsive UI**: Search, save, and view saved books in a clean React/Vite front end.
- **Persistent State**: LocalStorage for saved book IDs and session token.
- **Full-stack MERN**: React + Vite, Apollo Client, Node.js + Express + Apollo Server, MongoDB.

## Tech

- **Frontend**: React, Vite, Apollo Client, TypeScript, Bootstrap.
- **Backend**: Node.js, Express, Apollo Server, MongoDB, Mongoose, TypeScript.
- **Authentication**: JSON Web Tokens (JWT).
- **Deployment**: Render, MongoDB Atlas.

## Usage

### Local Development

1. **Start the back end**

   ```bash
   cd server
   npm run build
   npm start
   ```

2. **Start the front end**

   ```bash
   cd ../client
   npm run dev
   ```

3. **Browse**

   - Front end: [http://localhost:5173](http://localhost:5173)
   - GraphQL Playground: [http://localhost:3001/graphql](http://localhost:3001/graphql)

## License

This project is licensed under the MIT License. See LICENSE for details.

## Contribution

Contributions are welcome!

1. **Fork the repo**
2. **Create your feature branch**

   ```bash
   git checkout -b feature/xyz
   ```

3. **Commit your changes**

   ```bash
   git commit -m "feat: add new feature"
   ```

4. **Push to your fork & open a PR to develop**

## Testing

Testomg can be done in GraphQL Studio

## Contact

- **GitHub**: [langiam](https://github.com/langiam)
- **Email**: ryan.matthew.lang@gmail.com
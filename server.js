require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers/main');

const PORT = process.env.PORT || 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => server.listen({ port: PORT }))
  .then((serverInfo) => {
    console.log(`Connected to MongoDB!`);
    console.log(`Server running on ${serverInfo.url}`);
  });

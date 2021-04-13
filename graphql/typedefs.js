const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    allPosts: [Post]!
    posts(first: Int, after: String, sortBy: String): PostConnection!
    post(id: ID!): Post!
    allUsers: [User]!
    user(username: String!): User!
  }

  type Mutation {
    register(registrationInput: RegistrationInput!): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(id: ID!): Post!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(id: ID!): Post!
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean
  }

  type PostConnection {
    pageInfo: PageInfo
    edges: [PostEdge]
  }
  type PostEdge {
    cursor: String!
    node: Post
  }

  type Post {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
    comments: [Comment]!
    likes: [Like]!
    commentCount: Int!
    likeCount: Int!
  }

  type Comment {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
  }

  type Like {
    id: ID!
    username: String!
    createdAt: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    token: String!
    createdAt: String!
  }

  input RegistrationInput {
    username: String!
    email: String!
    password: String!
    confirmedPassword: String!
  }

  enum Sort {
    asc
    desc
  }
`;

module.exports = typeDefs;

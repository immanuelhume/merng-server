const commentResolvers = require('./comment-resolvers');
const postResolvers = require('./post-resolvers');
const userResolvers = require('./user-resolvers');

const resolvers = {
  Query: {
    ...postResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
  },
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
};

module.exports = resolvers;

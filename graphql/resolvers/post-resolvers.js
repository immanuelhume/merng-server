const { AuthenticationError, UserInputError } = require('apollo-server-errors');
const Post = require('../../models/Post');
const checkAuth = require('../../utils/check-auth');

const postResolvers = {
  Query: {
    async allPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: 'desc' });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async post(parent, { id }) {
      try {
        const post = await Post.findById(id);
        if (!post) {
          throw new Error('Post not found.');
        }
        return post;
      } catch (err) {
        throw new Error(err);
      }
    },
    async posts(parent, args) {
      try {
        const first = args.first || 8;
        const after = args.after || null;
        const allPosts = await Post.find().sort({ createdAt: 'desc' });
        const offset = allPosts.findIndex((post) => post.id === after) + 1;

        const wantedPosts = allPosts.slice(offset, offset + first);
        console.log(wantedPosts);
        const lastWantedPost = wantedPosts.slice(-1)[0]._id;

        return {
          pageInfo: {
            endCursor: lastWantedPost,
            hasNextPage: offset + first < allPosts.length,
          },
          edges: wantedPosts.map((post) => ({
            cursor: post._id,
            node: post,
          })),
        };
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createPost(parent, { body }, context) {
      const user = checkAuth(context);
      if (body === '') {
        throw new UserInputError('Post cannot be empty.');
      }
      const newPost = new Post({
        body,
        username: user.username,
        createdAt: new Date().toISOString(),
      });
      const post = await newPost.save();
      return post;
    },
    async deletePost(parent, { id }, context) {
      const user = checkAuth(context);
      try {
        const postToDelete = await Post.findById(id);
        if (user.username !== postToDelete.username) {
          throw new AuthenticationError("Cannot delete another user's posts.");
        }
        await postToDelete.delete();
        return postToDelete;
      } catch (err) {
        throw new Error(err);
      }
    },
    async likePost(parent, { id }, context) {
      const { username } = checkAuth(context);
      try {
        const post = await Post.findById(id);
        if (!post) {
          throw new Error('Post not found');
        }
        const likeIndex = post.likes.findIndex(
          (like) => like.username === username
        );
        if (likeIndex > -1) {
          post.likes.splice(likeIndex, 1);
        } else {
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }
        await post.save();
        return post;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

module.exports = postResolvers;

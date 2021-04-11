const Post = require('../../models/Post');
const checkAuth = require('../../utils/check-auth');
const { UserInputError, AuthenticationError } = require('apollo-server');

const commentResolvers = {
  Mutation: {
    async createComment(parent, { postId, body }, context) {
      const user = checkAuth(context);
      if (body === '') {
        throw new UserInputError('Empty comment', {
          errors: {
            body: 'Comment cannot be empty.',
          },
        });
      }
      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new Error('Post not found.');
        }
        post.comments.unshift({
          body,
          username: user.username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } catch (err) {
        throw new UserInputError(err);
      }
    },
    async deleteComment(parent, { postId, commentId }, context) {
      const user = checkAuth(context);
      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError('Post not found');
        }
        const commentToDelete = post.comments.find(
          (comment) => comment.id === commentId
        );
        if (!commentToDelete) {
          throw new UserInputError('Comment not found');
        }
        if (commentToDelete.username !== user.username) {
          throw new AuthenticationError(
            "Invalid action - delete another user's post"
          );
        }
        post.comments = post.comments.filter(
          (comment) => comment !== commentToDelete
        );
        await post.save();
        return post;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

module.exports = commentResolvers;

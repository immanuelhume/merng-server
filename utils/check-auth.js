require('dotenv');
const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');

function checkAuth(context) {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const [_, token] = authHeader.split('Bearer ');
    if (token) {
      try {
        const user = jwt.verify(token, process.env.SECRET_KEY);
        return user;
      } catch (err) {
        throw new AuthenticationError('Invalid/expired token.');
      }
    }
    throw new Error(
      "Authorization header must be provided as 'Bearer <token>'"
    );
  }
  throw new Error('Authorization info not provided.');
}

module.exports = checkAuth;

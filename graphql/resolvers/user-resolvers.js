require('dotenv');
const { UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const { isValidRegistration, isValidLogin } = require('../../utils/validators');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.SECRET_KEY
  );
}

const userResolvers = {
  Query: {
    async allUsers() {
      try {
        const users = await User.find().sort({ createdAt: 'desc' });
        if (!users) {
          throw new Error('No users in database');
        }
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },
    async user(_, { username }) {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          throw new Error('User not found');
        }
        return user;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async login(parent, { username, password }) {
      const { errors, valid } = isValidLogin(username, password);
      if (!valid) {
        throw new UserInputError('Login error', { errors });
      }

      const user = await User.findOne({ username });
      if (!user) {
        errors.badUsername = 'User does not exist';
        throw new UserInputError('User does not exist', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.badPassword = 'Password is invalid';
        throw new UserInputError('Invalid Password', { errors });
      }

      const token = generateToken(user);
      return { ...user._doc, id: user._id, token };
    },

    async register(
      parent,
      { registrationInput: { username, email, password, confirmedPassword } }
    ) {
      const { errors, valid } = isValidRegistration(
        username,
        email,
        password,
        confirmedPassword
      );
      if (!valid) {
        throw new UserInputError('Registration error', { errors });
      }

      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError(`Username is taken`, {
          errors: {
            usernameError: `This username is taken.`,
          },
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        username,
        password: hashedPassword,
        email,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return { ...res._doc, id: res._id, token };
    },
  },
};

module.exports = userResolvers;

import UserModel from '../models/user.model.js';
import userHelper from '../helpers/user.helper.js';
import jwt from 'jsonwebtoken';
import throwCustomError, {
  ErrorTypes,
} from '../helpers/error-handler.helper.js';
import { GraphQLError } from 'graphql';
import {constant} from '../helpers/constant.js';
import { deleteUserRedis, setUserRedis } from '../cache/user.cache.js';
const userResolver = {
  Query: {
    // Destructing {total} is same sa args.total
    getUsers: async (_, { total }, contextValue) => {
      try {
        // if (!user) throw new Error('You are not authenticated!');
        const users = await UserModel.find()
          .sort({ createdAt: -1 })
          .limit(total);
        return users;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getUserById: async (_, { id }, contextValue) => {
      try {
        const user = await UserModel.findById(id);
        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },

  Mutation: {
    signup: async (_, { input }) => {
      const { email, password, fname, lname } = input;
      console.log("aaaaa");
      const isUserExists = await userHelper.isEmailAlreadyExist(email);
      if (isUserExists) {
        throwCustomError(
          'Email is already Registered',
          ErrorTypes.ALREADY_EXISTS
        );
      }
      const userToCreate = new UserModel({
        email: email,
        password: password,
        fname: fname,
        lname: lname,
      });
      const user = await userToCreate.save();
      //store user in redis
      setUserRedis(user._doc);
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_PRIVATE_KEY,
        { expiresIn: process.env.TOKEN_EXPIRY_TIME }
      );

      return {
        __typename: 'UserWithToken',
        ...user._doc,
        userJwtToken: {
          token: token,
        },
      };
    },

    login: async (_, { input: { email, password } }, context) => {
      const user = await UserModel.findOne({
        $and: [{ email: email }, { password: password },{ collectionStatus:constant.COLLECTION_STATUS[0]  }],
      });
      if (user) {
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_PRIVATE_KEY,
          { expiresIn: process.env.TOKEN_EXPIRY_TIME }
        );
        return {
          ...user._doc,
          userJwtToken: {
            token: token,
          },
        };
      }
      //if user doesn't exists
      throwCustomError(
        'Invalid email or password entered.',
        ErrorTypes.BAD_USER_INPUT
      );
    },

    updateUser: async (_, { input },context) => {
      const userId = context?.user?.userId;
      let user; 
      user = await UserModel.findByIdAndUpdate({_id:userId},input,{new:true});
      console.log("context",context);

      return {
        fname:user?.fname,
        lname:user?.lname,
        email:user?.email,
        password:user?.password,
        
      };
    },

    deleteUser: async (_, { input },context) => {
      const userId = context?.user?.userId;
      let user; 
      user = await UserModel.findByIdAndUpdate({_id:userId},{collectionStatus:constant.COLLECTION_STATUS[1]},{new:true});
      //delete from cache
      deleteUserRedis(user?._id);

      return {
        collectionStatus:user?.collectionStatus,
      };
    },
  },

  Login: {
    login: async (_, { input: { email, password } }, context) => {
      const user = await UserModel.findOne({
        $and: [{ email: email }, { password: password }],
      });
      if (user) {
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_PRIVATE_KEY,
          { expiresIn: process.env.TOKEN_EXPIRY_TIME }
        );
        return {
          ...user._doc,
          userJwtToken: {
            token: token,
          },
        };
      }
      //if user doesn't exists
      throwCustomError(
        'Invalid email or password entered.',
        ErrorTypes.BAD_USER_INPUT
      );
    },
  },

  CreateUser: {
    signup: async (_, { input }) => {
      const { email, password, fname, lname } = input;
      console.log("aaaaa");
      const isUserExists = await userHelper.isEmailAlreadyExist(email);
      if (isUserExists) {
        throwCustomError(
          'Email is already Registered',
          ErrorTypes.ALREADY_EXISTS
        );
      }
      const userToCreate = new UserModel({
        email: email,
        password: password,
        fname: fname,
        lname: lname,
      });
      const user = await userToCreate.save();
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_PRIVATE_KEY,
        { expiresIn: process.env.TOKEN_EXPIRY_TIME }
      );

      return {
        __typename: 'UserWithToken',
        ...user._doc,
        userJwtToken: {
          token: token,
        },
      };
    },

  },

  // UpdateUser: {
  //   updateUser: async (_, { input }) => {
  //     const { email, password, fname, lname } = input;
  //     console.log("aaaaa");
  //     const userToCreate =  UserModel.findByIdAndUpdate({_id:"6616bd0500db25d1ab0bea38"},input,{new:true});
  //     const user = await userToCreate.save();
  //     const token = jwt.sign(
  //       { userId: user._id, email: user.email },
  //       process.env.JWT_PRIVATE_KEY,
  //       { expiresIn: process.env.TOKEN_EXPIRY_TIME }
  //     );

  //     return {
  //       __typename: 'UserWithToken',
  //       ...user._doc,
  //       userJwtToken: {
  //         token: token,
  //       },
  //     };
  //   },

  // },

};

export default userResolver;

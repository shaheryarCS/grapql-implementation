import jwt from 'jsonwebtoken';
import throwCustomError, {
  ErrorTypes,
} from '../helpers/error-handler.helper.js';
import { getUserRedis } from '../cache/user.cache.js';

const getUser = async (token) => {
  try {
    if (token) {
      const user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      return user;
    }
    return null;
  } catch (error) {
    return null;
  }
};

const context = async ({ req, res }) => {
  if (req.body.operationName === 'IntrospectionQuery') {
    return {};
  }
  // allowing the 'CreateUser' and 'Login' queries to pass without giving the token
  if (
    req.body.operationName === 'CreateUser' ||
    req.body.operationName === 'Login'  ) {
    return {};
  }

  // get the user token from the headers
  const token = req.headers.authorization || '';

  // try to retrieve a user with the token
  const user = await getUser(token);

  if (!user) {
    throwCustomError('User is not Authenticated', ErrorTypes.UNAUTHENTICATED);
  }

  //check if user exist in cache
  const redisUser_id = await getUserRedis(user?.userId);
  if (!redisUser_id) {
    throwCustomError('User is not found', ErrorTypes.BAD_USER_INPUT);
  }

  // add the user to the context
  return { user };
};

export default context;

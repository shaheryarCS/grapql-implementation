import gql from 'graphql-tag';

const userTypeDefs = gql`
  scalar DateTime

  type User {
    _id: String
    email: String
    password: String
    fname: String
    lname: String
    createdAt: DateTime
    updatedAt: DateTime
  }
`;
export default userTypeDefs;

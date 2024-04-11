import gql from 'graphql-tag';

const userSchema = gql`
  input SignupInput {
    email: String!
    password: String!
    fname: String!
    lname: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input updateInput {
    email: String
    password: String
    fname: String
    lname: String
  }

  type Query {
    getUsers(total: Int): [User]
    getUserById(id: ID!): User!
  }

  type JwtToken {
    token: String!
  }

  type UserWithToken {
    _id: String
    email: String
    fname: String
    lname: String
    createdAt: DateTime
    updatedAt: DateTime
    userJwtToken: JwtToken
  }

  type UserWithUpdate {
    _id: String
    email: String
    fname: String
    lname: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  type UserWithDeleted {
    collectionStatus:String
  }

  

  type Mutation {
    login(input: LoginInput): UserWithToken
    signup(input: SignupInput): UserWithToken
    updateUser(input: updateInput): UserWithUpdate
    deleteUser(input: updateInput):UserWithDeleted
  }

  type Login {
    login(input: LoginInput): UserWithToken
  }

  type CreateUser {
    signup(input: SignupInput): UserWithToken
  }

  type UpdateUser {
    updateUser(input: updateInput): UserWithUpdate
  }

  type DeleteUser {
    deleteUser(input: updateInput): UserWithDeleted
  }
`;

export default userSchema;

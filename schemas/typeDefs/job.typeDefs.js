import gql from 'graphql-tag';

const jobTypeDefs = gql`
  scalar DateTime

  type Job {
    _id: String
    userId: String
    name: String
    status: String
    createdAt: DateTime
    updatedAt: DateTime
  }
`;
export default jobTypeDefs;

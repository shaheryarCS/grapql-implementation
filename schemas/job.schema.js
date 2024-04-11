import gql from 'graphql-tag';

const jobchema = gql`
    input createInput {
      name: String!
    }

    type JobType {
      _id: String
      name: String
      status:String
      createdAt: DateTime
      updatedAt: DateTime
    }

    type Mutation {
      create(input: createInput): JobType
    }
`;

export default jobchema;

import { GraphQLObjectType, GraphQLString, GraphQLFloat } from 'graphql';

export const User = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});
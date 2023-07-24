import { GraphQLObjectType, GraphQLString } from 'graphql';
import { User } from './user.js';

export const SubscribersOnAuthors: GraphQLObjectType = new GraphQLObjectType({
  name: 'SubscribersOnAuthors',
  fields: () => ({
    subscriber: { type: User },
    subscriberId: { type: GraphQLString },
    author: { type: User },
    authorId: { type: GraphQLString },
  }),
});

import { GraphQLObjectType, GraphQLString } from 'graphql';
import { User } from './user.js';
import { UUIDType } from './uuid.js';

export const Post: GraphQLObjectType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    author: { type: User},
    authorId: { type: GraphQLString },
  }),
});

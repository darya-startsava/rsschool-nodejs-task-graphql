import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLList } from 'graphql';
import { Post } from './post.js';
import { Profile } from './profile.js';

export const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: { type: Profile as GraphQLObjectType },
    posts: { type: new GraphQLList(Post) },
  }),
});

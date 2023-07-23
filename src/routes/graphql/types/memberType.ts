import { GraphQLObjectType, GraphQLFloat, GraphQLInt, GraphQLList } from 'graphql';
import { MemberTypeId } from './memberTypeId.js';
import { Profile } from './profile.js';

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: MemberTypeId },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
    profiles: { type: new GraphQLList(Profile) },
  }),
});

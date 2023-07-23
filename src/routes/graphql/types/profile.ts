import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';
import { MemberType } from './memberType.js';
import { User } from './user.js';
import { UUIDType } from './uuid.js';

export const Profile = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    user: { type: User as GraphQLObjectType },
    userId: { type: GraphQLString },
    memberType: { type: MemberType },
    memberTypeId: { type: GraphQLString },
  }),
});

import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';
import { MemberType } from './memberType.js';
import { User } from './user.js';
import { UUIDType } from './uuid.js';
import { PrismaClient } from '@prisma/client';

export const Profile: GraphQLObjectType = new GraphQLObjectType<
  { memberTypeId: string },
  { prisma: PrismaClient }
>({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    user: { type: User },
    userId: { type: GraphQLString },
    memberType: {
      type: MemberType,
      resolve: async (profile, args, { prisma }) => {
        const memberType = await prisma.memberType.findUnique({
          where: { id: profile.memberTypeId },
        });
        return memberType || null;
      },
    },
    memberTypeId: { type: GraphQLString },
  }),
});

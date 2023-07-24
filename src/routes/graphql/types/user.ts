import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLList } from 'graphql';
import { Post } from './post.js';
import { Profile } from './profile.js';
import { PrismaClient } from '@prisma/client';

export const User: GraphQLObjectType = new GraphQLObjectType<
  { id: string },
  { prisma: PrismaClient }
>({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: Profile,
      resolve: async (user, args, { prisma }) => {
        const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
        return profile || null;
      },
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: async (user, args, { prisma }) => {
        const posts = await prisma.post.findMany({
          where: {
            authorId: user.id,
          },
        });
        return posts || null;
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(User),
      resolve: async (user, args, { prisma }) => {
        const userSubscribedTo = await prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: user.id,
              },
            },
          },
        });
        return userSubscribedTo || null;
      },
    },
    subscribedToUser: {
      type: new GraphQLList(User),
      resolve: async (user, args, { prisma }) => {
        const subscribedToUser = await prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: user.id,
              },
            },
          },
        });
        return subscribedToUser || null;
      },
    },
  }),
});

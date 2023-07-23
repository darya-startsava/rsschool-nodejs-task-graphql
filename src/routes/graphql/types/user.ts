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
  }),
});

import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import { User } from './types/user.js';
import { MemberType } from './types/memberType.js';
import { MemberTypeId } from './types/memberTypeId.js';
import { Post } from './types/post.js';
import { Profile } from './types/profile.js';
import { UUIDType } from './types/uuid.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const Query = new GraphQLObjectType({
        name: 'Query',
        fields: {
          users: {
            type: new GraphQLList(User),
            description: 'Get all users',
            args: {},
            resolve: () => {
              return prisma.user.findMany();
            },
          },
          user: {
            type: User,
            description: 'Get user by id',
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, args: { id: string }) => {
              try {
                const user = await prisma.user.findUnique({
                  where: {
                    id: args.id,
                  },
                });
                return user;
              } catch {
                return null;
              }
            },
          },
          memberTypes: {
            type: new GraphQLList(MemberType),
            description: 'Get all memberTypes',
            args: {},
            resolve: () => {
              return prisma.memberType.findMany();
            },
          },
          memberType: {
            type: MemberType,
            description: 'Get memberType by id',
            args: { id: { type: new GraphQLNonNull(MemberTypeId) } },
            resolve: async (_, args: { id: string }) => {
              try {
                const memberType = await prisma.memberType.findUnique({
                  where: {
                    id: args.id,
                  },
                });
                return memberType;
              } catch {
                return null;
              }
            },
          },
          posts: {
            type: new GraphQLList(Post),
            description: 'Get all posts',
            args: {},
            resolve: () => {
              return prisma.post.findMany();
            },
          },
          post: {
            type: Post,
            description: 'Ge post by id',
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, args: { id: string }) => {
              try {
                const post = await prisma.post.findUnique({
                  where: {
                    id: args.id,
                  },
                });
                return post;
              } catch {
                return null;
              }
            },
          },
          profiles: {
            type: new GraphQLList(Profile),
            description: 'Get all profiles',
            args: {},
            resolve: () => {
              return prisma.profile.findMany();
            },
          },
          profile: {
            type: Profile,
            description: 'Get profile by id',
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, args: { id: string }) => {
              try {
                const profile = await prisma.profile.findUnique({
                  where: {
                    id: args.id,
                  },
                });
                return profile;
              } catch {
                return null;
              }
            },
          },
        },
      });

      const schema = new GraphQLSchema({ query: Query });

      const result = await graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
      });
      return result;
    },
  });
};

export default plugin;

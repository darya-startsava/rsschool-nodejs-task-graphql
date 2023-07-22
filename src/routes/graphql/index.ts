import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLObjectType, GraphQLSchema, GraphQLList } from 'graphql';
import { User } from './types/user.js';
import { MemberType } from './types/memberType.js';
import { Post } from './types/post.js';
import { Profile } from './types/profile.js';

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
            args: {},
            resolve: () => {
              return prisma.user.findMany();
            },
          },
          memberTypes: {
            type: new GraphQLList(MemberType),
            args: {},
            resolve: () => {
              return prisma.memberType.findMany();
            },
          },
          posts: {
            type: new GraphQLList(Post),
            args: {},
            resolve: () => {
              return prisma.post.findMany();
            },
          },
          profile: {
            type: new GraphQLList(Profile),
            args: {},
            resolve: () => {
              return prisma.profile.findMany();
            },
          },
        },
      });

      const schema = new GraphQLSchema({ query: Query });

      return await graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
      });
    },
  });
};

export default plugin;

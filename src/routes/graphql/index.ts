import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  graphql,
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
} from 'graphql';

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
      const User = new GraphQLObjectType({
        name: 'User',
        fields: {
          id: { type: GraphQLString },
          name: { type: GraphQLString },
          balance: { type: GraphQLFloat },
        },
      });

      const MemberType = new GraphQLObjectType({
        name: 'MemberType',
        fields: {
          id: { type: GraphQLString },
          discount: { type: GraphQLFloat },
          postsLimitPerMonth: { type: GraphQLInt },
        },
      });

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

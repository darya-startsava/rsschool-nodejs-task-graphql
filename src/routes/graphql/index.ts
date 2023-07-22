import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, buildSchema } from 'graphql';

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
      const schema = buildSchema(`
        type User {
          id: String!
          name: String
          balance: Float
        }
        type MemberType {
          id: String!
          discount: Float
          postsLimitPerMonth: Int
        }
        type Query {
          users: [User!]!
          memberTypes: [MemberType!]!
        }
        
      `);

      const rootValue = {
        users: () => {
          return prisma.user.findMany();
        },
        memberTypes: () => {
          return prisma.memberType.findMany();
        },
      };

      return await graphql({
        schema,
        source: req.body.query,
        rootValue,
        variableValues: req.body.variables,
      });
    },
  });
};

export default plugin;

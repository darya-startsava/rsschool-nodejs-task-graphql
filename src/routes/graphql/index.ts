import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLBoolean,
  GraphQLInt,
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

      const Mutation = new GraphQLObjectType({
        name: 'Mutation',
        fields: {
          createUser: {
            type: User,
            description: 'Create user',
            args: {
              dto: {
                type: new GraphQLInputObjectType({
                  name: 'CreateUserInput',
                  fields: {
                    name: { type: GraphQLString },
                    balance: { type: GraphQLFloat },
                  },
                }),
              },
            },
            resolve: (_, args: { dto: { name: string; balance: number } }) => {
              return prisma.user.create({ data: args.dto });
            },
          },
          deleteUser: {
            type: GraphQLBoolean,
            description: 'Delete user',
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, args: { id: string }) => {
              await prisma.user.delete({
                where: {
                  id: args.id,
                },
              });
            },
          },
          createPost: {
            type: Post,
            description: 'Create post',
            args: {
              dto: {
                type: new GraphQLInputObjectType({
                  name: 'CreatePostInput',
                  fields: {
                    authorId: { type: GraphQLString },
                    content: { type: UUIDType },
                    title: { type: UUIDType },
                  },
                }),
              },
            },
            resolve: (
              _,
              args: { dto: { authorId: string; content: string; title: string } },
            ) => {
              return prisma.post.create({ data: args.dto });
            },
          },
          deletePost: {
            type: GraphQLBoolean,
            description: 'Delete post',
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, args: { id: string }) => {
              await prisma.post.delete({
                where: {
                  id: args.id,
                },
              });
            },
          },
          createProfile: {
            type: Profile,
            description: 'Create profile',
            args: {
              dto: {
                type: new GraphQLInputObjectType({
                  name: 'CreateProfileInput',
                  fields: {
                    userId: { type: GraphQLString },
                    memberTypeId: { type: MemberTypeId },
                    isMale: { type: GraphQLBoolean },
                    yearOfBirth: { type: GraphQLInt },
                  },
                }),
              },
            },
            resolve: (
              _,
              args: {
                dto: {
                  userId: string;
                  memberTypeId: string;
                  isMale: boolean;
                  yearOfBirth: number;
                };
              },
            ) => {
              return prisma.profile.create({ data: args.dto });
            },
          },
          deleteProfile: {
            type: GraphQLBoolean,
            description: 'Delete profile',
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, args: { id: string }) => {
              await prisma.profile.delete({
                where: {
                  id: args.id,
                },
              });
            },
          },
        },
      });

      const schema = new GraphQLSchema({ query: Query, mutation: Mutation });

      const result = await graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: { prisma },
      });
      return result;
    },
  });
};

export default plugin;

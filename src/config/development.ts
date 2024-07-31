import ConfigInterface from './ConfigInterface';


// const config: ConfigInterface = {
//   env: 'development',
//   database: {
//     type: 'sqlite' as const,
//     cache: false,
//     database: ':memory:',
//     dropSchema: true,
//     entities: ['src/entities/*.ts'],
//     logger: 'advanced-console' as const,
//     synchronize: true,
//   },
//   graphQLPath: '/graphql',
//   resolvers: [`${__dirname}/../resolvers/**/* Resolver.ts`],
// };

const config: ConfigInterface = {
  env: 'development',
  database: {
    //@ts-ignore
    type: 'mysql' as const,
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'test',
    cache: false,
    dropSchema: true,
    entities: ['src/entities/*.ts'],
    logger: 'advanced-console' as const,
    synchronize: true,
  },
  graphQLPath: '/graphql',
  resolvers: [`${__dirname} /../resolvers/*Resolver.ts`],
};

export default config;

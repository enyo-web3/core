import type { ApolloCache } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { mergeSchemas } from '@graphql-tools/schema';
import { GraphQLSchema, DocumentNode } from 'graphql';

export interface EnyoSubgraph<Providers> {
  schema(providers: Providers): GraphQLSchema;
  typeDefs(): DocumentNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EnyoProvider = any;

export interface ProvidersWithCache {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cache: ApolloCache<any>;
}

export interface EnyoTypeDefOptions {
  extraTypeDefs?: DocumentNode;
}

// type UnionToIntersection<T> = (T extends T ? (p: T) => void : never) extends (p: infer U) => void ? U : never;

// type SubgraphProviders<T extends ReadonlyArray<EnyoSubgraph<EnyoProvider>>> = {
//   [K in keyof T]: T[K] extends EnyoSubgraph<infer V> ? V : never;
// };

// type RequiredProviders<
//   T extends SubgraphProviders<P>,
//   P extends ReadonlyArray<EnyoSubgraph<EnyoProvider>> = ReadonlyArray<EnyoSubgraph<EnyoProvider>>,
//   K extends keyof T = keyof T
// > = UnionToIntersection<T[K]>;
// type RequiredProviders<T extends ReadonlyArray<EnyoSubgraph<EnyoProvider>>> =
//   SubgraphProviders<T>[keyof SubgraphProviders<T>];

export class EnyoSupergraph<Subgraphs extends ReadonlyArray<EnyoSubgraph<EnyoProvider>>> {
  subgraphs: Subgraphs;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  providers: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(options: { subgraphs: Subgraphs; providers: any }) {
    this.providers = options.providers;
    this.subgraphs = options.subgraphs;
  }

  link(): SchemaLink {
    const schema = mergeSchemas({ schemas: this.subgraphs.map(s => s.schema(this.providers)) });

    return new SchemaLink({ schema });
  }

  typeDefs(options?: EnyoTypeDefOptions): DocumentNode {
    return options && options.extraTypeDefs
      ? mergeTypeDefs([...this.subgraphs.map(s => s.typeDefs()), options.extraTypeDefs])
      : mergeTypeDefs(this.subgraphs.map(s => s.typeDefs()));
  }
}

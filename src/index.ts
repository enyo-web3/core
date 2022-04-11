import { ApolloCache, DataProxy, ApolloClient, ApolloClientOptions } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { mergeSchemas } from '@graphql-tools/schema';
import { GraphQLSchema, DocumentNode } from 'graphql';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class EnyoSubgraph<Providers, TData = any, TVariables = any> extends EventTarget {
  abstract schema(providers: Providers): GraphQLSchema;
  abstract typeDefs(): DocumentNode;

  protected writeQuery(options: DataProxy.WriteQueryOptions<TData, TVariables>) {
    this.dispatchEvent(new CustomEvent('writeQuery', { detail: options }));
  }
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

export interface EnyoSupergraphOptions<Subgraphs, Providers> {
  subgraphs: Subgraphs;
  providers: Providers;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class EnyoSupergraph<Subgraphs extends ReadonlyArray<EnyoSubgraph<EnyoProvider>>, TData = any> {
  subgraphs: Subgraphs;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  providers: any;
  client: ApolloClient<TData>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(options: EnyoSupergraphOptions<Subgraphs, any> & ApolloClientOptions<TData>);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(options: EnyoSupergraphOptions<Subgraphs, any>, apolloClient?: ApolloClient<TData>) {
    this.providers = options.providers;
    this.subgraphs = options.subgraphs;

    for (const subgraph of this.subgraphs) {
      subgraph.addEventListener('writeQuery', this.writeQuery.bind(this));
    }

    if (apolloClient) {
      this.client = apolloClient;
    } else {
      // @ts-ignore
      // note(carlos): ignoring here because we know if `apolloClient` is missing,
      // then `options` includes the `ApolloClientOptions` parameters.
      const client = new ApolloClient<TData>({ ...options, link: this.link(), typeDefs: this.typeDefs() });
      this.client = client;
    }
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

  setClient(client: ApolloClient<TData>) {
    this.client = client;
  }

  private writeQuery(ev: Event) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const evt = ev as CustomEvent<DataProxy.WriteQueryOptions<TData, any>>;

    this.client.writeQuery(evt.detail);
  }
}

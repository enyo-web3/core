import type { ApolloCache } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import { GraphQLSchema, DocumentNode } from 'graphql';
export interface EnyoSubgraph<Providers> {
    schema(providers: Providers): GraphQLSchema;
    typeDefs(): DocumentNode;
}
export declare type EnyoProvider = any;
export interface ProvidersWithCache {
    cache: ApolloCache<any>;
}
export interface EnyoTypeDefOptions {
    extraTypeDefs?: DocumentNode;
}
export declare class EnyoSupergraph<Subgraphs extends ReadonlyArray<EnyoSubgraph<EnyoProvider>>> {
    subgraphs: Subgraphs;
    providers: any;
    constructor(options: {
        subgraphs: Subgraphs;
        providers: any;
    });
    link(): SchemaLink;
    typeDefs(options?: EnyoTypeDefOptions): DocumentNode;
}

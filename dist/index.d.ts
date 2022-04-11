import { DataProxy, ApolloClient, ApolloClientOptions } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import { GraphQLSchema, DocumentNode } from 'graphql';
export declare abstract class EnyoSubgraph<Providers, TData = any, TVariables = any> extends EventTarget {
    abstract schema(providers: Providers): GraphQLSchema;
    abstract typeDefs(): DocumentNode;
    protected writeQuery(options: DataProxy.WriteQueryOptions<TData, TVariables>): void;
}
export declare type EnyoProvider = any;
export interface EnyoTypeDefOptions {
    extraTypeDefs?: DocumentNode;
}
export interface EnyoSupergraphOptions<Subgraphs, Providers> {
    subgraphs: Subgraphs;
    providers: Providers;
}
export declare class EnyoSupergraph<Subgraphs extends ReadonlyArray<EnyoSubgraph<EnyoProvider>>, TData = any> {
    subgraphs: Subgraphs;
    providers: any;
    client: ApolloClient<TData>;
    constructor(options: EnyoSupergraphOptions<Subgraphs, any> & ApolloClientOptions<TData>);
    link(): SchemaLink;
    typeDefs(options?: EnyoTypeDefOptions): DocumentNode;
    setClient(client: ApolloClient<TData>): void;
    private writeQuery;
}

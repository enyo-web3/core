"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnyoSupergraph = exports.EnyoSubgraph = void 0;
const client_1 = require("@apollo/client");
const schema_1 = require("@apollo/client/link/schema");
const merge_1 = require("@graphql-tools/merge");
const schema_2 = require("@graphql-tools/schema");
const events_1 = require("events");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class EnyoSubgraph extends events_1.EventEmitter {
    writeQuery(options) {
        this.emit('writeQuery', options);
    }
}
exports.EnyoSubgraph = EnyoSubgraph;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class EnyoSupergraph {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(options, apolloClient) {
        this.providers = options.providers;
        this.subgraphs = options.subgraphs;
        for (const subgraph of this.subgraphs) {
            subgraph.on('writeQuery', this.writeQuery.bind(this));
        }
        if (apolloClient) {
            this.client = apolloClient;
        }
        else {
            // @ts-ignore
            // note(carlos): ignoring here because we know if `apolloClient` is missing,
            // then `options` includes the `ApolloClientOptions` parameters.
            const client = new client_1.ApolloClient(Object.assign(Object.assign({}, options), { link: this.link(), typeDefs: this.typeDefs() }));
            this.client = client;
        }
    }
    link() {
        const schema = (0, schema_2.mergeSchemas)({ schemas: this.subgraphs.map(s => s.schema(this.providers)) });
        return new schema_1.SchemaLink({ schema });
    }
    typeDefs(options) {
        return options && options.extraTypeDefs
            ? (0, merge_1.mergeTypeDefs)([...this.subgraphs.map(s => s.typeDefs()), options.extraTypeDefs])
            : (0, merge_1.mergeTypeDefs)(this.subgraphs.map(s => s.typeDefs()));
    }
    setClient(client) {
        this.client = client;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    writeQuery(options) {
        this.client.writeQuery(options);
    }
}
exports.EnyoSupergraph = EnyoSupergraph;
//# sourceMappingURL=index.js.map
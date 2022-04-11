"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnyoSupergraph = void 0;
const schema_1 = require("@apollo/client/link/schema");
const merge_1 = require("@graphql-tools/merge");
const schema_2 = require("@graphql-tools/schema");
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
class EnyoSupergraph {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(options) {
        this.providers = options.providers;
        this.subgraphs = options.subgraphs;
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
}
exports.EnyoSupergraph = EnyoSupergraph;
//# sourceMappingURL=index.js.map
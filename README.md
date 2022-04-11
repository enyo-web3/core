# Enyo
Enyo (sister to Apollo, goddess of war) is a web3 supergraph GraphQL framework built on top of [Apollo](https://www.apollographql.com/) designed to unify data from diverse web3 data sources (GraphQL services like Graph Protocol subgraphs, EVM JSON-RPC chain state via ethers, other chain state such as ARWeave, off-chain state from IPFS/Ceramic/etc.) on the client-side, wrapped in nice and easy to use GraphQL-based schemas. It is intended to optimize for ease-of-use, efficiency, and speed while keeping lookup operations at the client-side layer of decentralized applications.

**Status: Experimental**
This package, and all Enyo-related packages in this organization, are currently *highly* experimental. Their APIs are subject to change at any moment, and often do change at this time. These packages are also not published to NPM yet for this reason. At such time that the APIs become more stable, they will be published to NPM with some stability expectation.

## Install

`yarn add @enyo/core`

or

`npm install --save @enyo/core`

## Usage

```typescript
import { ApolloClient, gql } from '@apollo/client';
import { EnyoSupergraph } from '@enyo-web3/core';
import { EthersProvider, WalletSubgraph } from '@enyo-web3/ethers';
import { CeramicProvider, CeramicSubgraph } from '@enyo-web3/ceramic';
import { ERC20Subgraph } from '@enyo-web3/erc20';
import { ERC721Subgraph } from '@enyo-web3/erc721';

const supergraph = new EnyoSupergraph({
  subgraphs: [
    new WalletSubgraph(),
    new CeramicSubgraph(),
    new GraphProtocolSubgraph({ host: 'https://api.thegraph.com', name: '@metaphor-xyz/approval-protocol', schema: subgraphSchema }),
    new ERC20Subgraph(),
    new ERC721Subgraph(),
  ],
  providers: {
    ethers: new EthersProvider(),
    ceramic: new CeramicProvider({ uri: 'https://ceramic.myhost.com' }),
  },
});

const client = new ApolloClient({
  link: supergraph.link(),
  typeDefs: supergraph.typeDefs(),
});

client.query({
  query: gql`
  {
    account(id: "0x38fj...") {
      id

      erc20 {
        token(id: "0x9dfh9h....") {
          id
          name
          balanceOf
        }
      }

      erc721 {
        collection(id: "0xd09hfh...") {
          balanceOf
        }
      }
    }

    erc721 {
      token(id: "0xd89hdf", tokenId: "0xdfh0d") {
        id
        name
        description
      }
    }
  }
  `,
});
```

## Philosophy
- Enyo is primarily designed for use in decentralized web3 apps, but at its core it's just a well organized supergraph stitching system for any GraphQL schemas and could be used for other use-cases. Building such providers and subgraphs is welcome, but `@enyo/core` and all the packages in this organization will prioritize web3 use-cases and will not implement any functionality that would interfere with such uses, or add complexity to those apps.
- Enyo is designed for the browser, acting as a subgraph federation and stitching layer inside frontend applications. It could be easily used in a Server-Side Rendering environment or in an API server for federating APIs. However, `@enyo/core` and all the packages in this organization will prioritize the browser environment and will not implement functionality that would complicate purely browser-based apps. For server-side use cases, something like [Apollo Federation](https://www.apollographql.com/docs/federation/) may be more appropriate!

## Providers and Subgraphs
**Status:**
- :white_check_mark: Ready and actively Maintained
- :hammer: In development, experimental
- :warning: Not actively maintained

| Package Name | Status | Description |
| ------------ | ------ | ----------- |
| [@enyo-web3/ethers](https://github.com/enyo-web3/ethers) | :hammer: | Ethers provider and subgraph |
| [@enyo-web3/erc20](https://github.com/enyo-web3/erc20) | :hammer: | ERC20 token subgraph |
| [@enyo-web3/ens](https://github.com/enyo-web3/ens) | :hammer: | Ethereum Name Service subgraph |
| [@enyo-web3/ceramic](https://github.com/enyo-web3/ceramic) | :hammer: | Ceramic Network provider and subgraph |

## Contribution
At this early stage, Metaphor is still incubating the project internally. Pull Requests are welcome, but are not guaranteed to be addressed until the project stabilizes more!

## License
MIT License (and all dependencies)

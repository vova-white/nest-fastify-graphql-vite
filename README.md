# NestJS Fastify GraphQL Vite Starter

## Experimental [Nest](https://github.com/nestjs/nest) Fastify Vite starter with MongoDB, GraphQL, Swagger setup.

Inspired by [vite-plugin-node](https://github.com/axe-me/vite-plugin-node) 

I haven't tested it, but I think that if make small changes it will work with @nestjs/platform-express too...

<strong style="color: orange">WARNING:</strong>
[apollo-server-fastify](https://github.com/apollographql/apollo-server/tree/main/packages/apollo-server-fastify) for the moment supports Fastify v3 only. And [@nestjs/platform-fastify](https://www.npmjs.com/package/@nestjs/platform-fastify) v9 included Fastify v.4. So, to make it all work together, use NestJS v.8 and fastify plugins for v3 and get a ton of warnings about peer dependencies mismatch or depraceted plugins.

## Included

* [Vite](https://vitejs.dev/) - development server and ESM or CommonJS build for production
* [Vitest](https://vitest.dev/) - unit and e2e tests
* [Fastify](https://docs.nestjs.com/techniques/performance) - NestJS Platform Fastify
* [GraphQL](https://docs.nestjs.com/graphql/quick-start) - Code first approach with Apollo driver 
* [OpenAPI](https://docs.nestjs.com/openapi/introduction) - Swagger setup for REST API

## Installation

1. Clone the repo
2. Replace MONGO_CONNECTION_URI in .env.example with real connection uri
3. Rename or copy .env.example to .env

```bash
$ pnpm i
```

## Vite

### Development

```bash
$ pnpm dev
```

### Build and running the app

#### ESM

```bash
# build
$ pnpm build

# start the app
$ pnpm start:prod
# or
$ node dist/main.mjs
```

<span style="color: orange">WARNING:</span> When build in ESM mode, there may be problems with named imports from CommonJS npm packages at the launching stage, for example mongoose.

```javascript
import { Types } from 'mongoose';

const Id = new Types.ObjectId();
```
```bash
$ pnpm build
# build OK

$ pnpm start:prod
# ERROR
import { Types } from 'mongoose';
         ^^^^^
SyntaxError: Named export 'Types' not found. The requested module 'mongoose' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from 'mongoose';
const { Types } = pkg;
```
#### Solution 1
```javascript
// If you need some executable functions at runtime
import mongoose from 'mongoose';

const Id = new mongoose.Types.ObjectId();
// or
const { Types } = mongoose
const Id = new Types.ObjectId();

// If you only need a type definition, import it as type
import type {Types, Document} from 'mongoose'

@Schema()
export class User {
  _id: Types.ObjectId;
}
export type UserDocument = User & Document;
```
#### Solution 2
Build in CommonJS mode with Vite or Nest CLI


#### CommonJS
```bash
# build
$ pnpm build:cjs

# start the app
$ pnpm start:prod:cjs
# or
$ node dist/main
```

## Nest CLI

```bash
# development
$ pnpm start

# watch mode
$ pnpm start:dev

# build
$ pnpm build:nest

# production
$ pnpm start:prod:cjs
# or
$ node dist/main
```

## Test - Vitest

```bash
# unit tests
$ pnpm test

# e2e tests
$ npm test:e2e

# test coverage
$ npm test:cov
```

<strong>Vitest Alternatives:</strong>

* Jest with ts-jest setup. Default for Nest
* Jest setup with [@swc/jest](https://swc.rs/docs/usage/jest)
  

## Nest JS Info

### Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

### Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

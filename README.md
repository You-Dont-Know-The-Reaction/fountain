# fountain

### Features

- **Beautiful Code** thanks to the awesome annotations of the libraries from [pleerock](https://github.com/pleerock).
- **Dependency Injection** done with the nice framework from [TypeDI](https://github.com/pleerock/typedi).
- **Simplified Database Query** with the ORM [TypeORM](https://github.com/typeorm/typeorm).
- **Clear Structure** with different layers such as controllers, services, repositories, models, middlewares...
- **Easy Exception Handling** thanks to [routing-controllers](https://github.com/pleerock/routing-controllers).
- **Smart Validation** thanks to [class-validator](https://github.com/pleerock/class-validator) with some nice annotations.
- **Custom Validators** to validate your request even better and stricter. [custom-validation-classes](https://github.com/pleerock/class-validator#custom-validation-classes).
- **Basic Security Features** thanks to [Helmet](https://helmetjs.github.io/).
- **Easy event dispatching** thanks to [event-dispatch](https://github.com/pleerock/event-dispatch).
- **Fast Database Building** with simple migration from [TypeORM](https://github.com/typeorm/typeorm).

## ❯ Getting Started

### Step 1: Set up the Development Environment

You need to set up your development environment before you can do anything.

Install [Node.js and NPM](https://nodejs.org/en/download/)

- on OSX use [homebrew](http://brew.sh) `brew install node`
- on Windows use [chocolatey](https://chocolatey.org/) `choco install nodejs`

### Step 2: Serve your App

Go to the project dir and start your app with this yarn script.

```bash
npm run serve
```

## ❯ API Routes

The route prefix is `/api` by default, but you can change this in the .env file.
The swagger and the monitor route can be altered in the `.env` file.

| Route                   | Description                                                        |
| ----------------------- | ------------------------------------------------------------------ |
| **/api**                | Shows us the name, description and the version of the package.json |
| **/api/users**          | Example entity endpoint                                            |
| **/api/pets**           | Example entity endpoint                                            |
| Will come in the Future |                                                                    |
| **/graphql**            | Route to the graphql editor or your query/mutations requests       |
| **/swagger**            | This is the Swagger UI with our API documentation                  |
| **/monitor**            | Shows a small monitor page for the server                          |

## ❯ Project Structure

| Name                              | Description                                                                 |
| --------------------------------- | --------------------------------------------------------------------------- |
| **.vscode/**                      | VSCode tasks, launch configuration and some other settings                  |
| **dist/**                         | Compiled source files will be placed here                                   |
| **src/**                          | Source files                                                                |
| **src/api/controllers/**          | REST API Controllers                                                        |
| **src/api/controllers/requests**  | Request classes with validation rules if the body is not equal with a model |
| **src/api/controllers/responses** | Response classes or interfaces to type json response bodies                 |
| **src/api/errors/**               | Custom HttpErrors like 404 NotFound                                         |
| **src/api/interceptors/**         | Interceptors are used to change or replace the data returned to the client. |
| **src/api/middlewares/**          | Express Middlewares like helmet security features                           |
| **src/api/models/**               | TypeORM Models                                                              |
| **src/api/repositories/**         | Repository / DB layer                                                       |
| **src/api/services/**             | Service layer                                                               |
| **src/api/subscribers/**          | Event subscribers                                                           |
| **src/api/validators/**           | Custom validators, which can be used in the request classes                 |
| **src/auth/**                     | Authentication checkers and services                                        |
| **src/core/**                     | The core features like logger and env variables                             |
| **src/database/migrations**       | Database migration scripts                                                  |
| **src/database/seeds**            | Seeds to create some data in the database                                   |
| **src/decorators/**               | Custom decorators like @Logger & @EventDispatch                             |
| **src/public/**                   | Static assets (fonts, css, js, img).                                        |
| **src/types/** \*.d.ts            | Custom type definitions and files that aren't on DefinitelyTyped            |
| .env.example                      | Environment configurations                                                  |
| .env.test                         | Test environment configurations                                             |

## ❯ Logging

Our logger is [winston](https://github.com/winstonjs/winston). To log http request we use the express middleware [morgan](https://github.com/expressjs/morgan).
We created a simple annotation to inject the logger in your service (see example below).

```typescript
import { Logger, LoggerInterface } from '../../decorators/Logger';

@Service()
export class UserService {

    constructor(
        @Logger(__filename) private log: LoggerInterface
    ) { }

    ...
```

## ❯ Event Dispatching

We use this awesome repository [event-dispatch](https://github.com/pleerock/event-dispatch) for event dispatching.
We created a simple annotation to inject the EventDispatcher in your service (see example below). All events are listed in the `events.ts` file.

```typescript
import { events } from '../subscribers/events';
import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';

@Service()
export class UserService {

    constructor(
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface
    ) { }

    public async create(user: User): Promise<User> {
        ...
        this.eventDispatcher.dispatch(events.user.created, newUser);
        ...
    }
```

## ❯ Further Documentations

| Name & Link                                                            | Description                                                                                                                                                                       |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Express](https://expressjs.com/)                                      | Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.                                       |
| [Microframework](https://github.com/pleerock/microframework)           | Microframework is a simple tool that allows you to execute your modules in a proper order, helping you to organize bootstrap code in your application.                            |
| [TypeDI](https://github.com/pleerock/typedi)                           | Dependency Injection for TypeScript.                                                                                                                                              |
| [routing-controllers](https://github.com/pleerock/routing-controllers) | Create structured, declarative and beautifully organized class-based controllers with heavy decorators usage in Express / Koa using TypeScript and Routing Controllers Framework. |
| [TypeORM](http://typeorm.io/#/)                                        | TypeORM is highly influenced by other ORMs, such as Hibernate, Doctrine and Entity Framework.                                                                                     |
| [class-validator](https://github.com/pleerock/class-validator)         | Validation made easy using TypeScript decorators.                                                                                                                                 |
| [class-transformer](https://github.com/pleerock/class-transformer)     | Proper decorator-based transformation / serialization / deserialization of plain javascript objects to class constructors                                                         |
|  [event-dispatcher](https://github.com/pleerock/event-dispatch)        | Dispatching and listening for application events in Typescript                                                                                                                    |
|  [Helmet](https://helmetjs.github.io/)                                 | Helmet helps you secure your Express apps by setting various HTTP headers. It’s not a silver bullet, but it can help!                                                             |
|  [Auth0 API Documentation](https://auth0.com/docs/api/management/v2)   | Authentification service                                                                                                                                                          |
| [GraphQL Documentation](http://graphql.org/graphql-js/)                | A query language for your API.                                                                                                                                                    |

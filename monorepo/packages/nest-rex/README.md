# nest-rex

`nest-rex` provides Nest integration module for Rex client.

## Get started

In your Nest application update `package.json` and add the `nest-rex` package:

```json
{
  "dependencies": {
    "@dbc-tech/nest-rex": "^1.0.0"
}
```

## Register the module

You'll need to specify base url, client id & API key. The easiest way is to provide it directly during regisration in your `app.module`:

```typescript
@Module({
  imports: [
    RexModule.register({
      baseUrl: 'https://api.rexsoftware.com/v1/rex/',
      email: '<your email>',
      password: '<your password>',
    })]
})
```

However, it's more likely the base url is provided via `.env` file:

```
REX_URL: https://api.rexsoftware.com/v1/rex/
REX_EMAIL: <your email>
REX_PASSWORD: <your password>
```

In which case this can be passed via `ConfigService` using module's `registerAsync` method:

```typescript
@Module({
  imports: [
    RexModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseUrl: configService.get('REX_URL'),
        email: configService.get('REX_EMAIL'),
        password: configService.get('REX_PASSWORD'),
      }),
      inject: [ConfigService],
    })]
})
```

You may wish to register the module globally:

```typescript
@Module({
  imports: [
    RexModule.register({
      global: true
    })]
})
```

## Using RexClient service

Once the `RexModule` is registered, the `RexClient` service should be available to inject into your services:

```typescript
export default class MyService {
  constructor(private readonly api: RexClient) {}

  async getAccountUsers() {
    const result = await rex.getAccountUsers()
    const accountUsers: RexAccountUser[] = [];
    for await (const item of result) {
      accountUsers.push(item)
    }

    return accountUsers
  }
}
```

## Rex Factory module

An additional factory module `RexFactoryModule` is available for use in multi-tenancy applications. The factory module registers a factory service `RexFactory` which is used to create new `RexClient` instances by supplying the client id & api key.

## Register the module

You'll need to specify base url. The easiest way is to provide it directly during regisration in your `app.module`:

```typescript
@Module({
  imports: [
    RexFactoryModule.register({
      baseUrl: 'https://api.rexsoftware.com/v1/rex/',
    })]
})
```

However, it's more likely the base url is provided via `.env` file:

```
REX_URL: https://api.rexsoftware.com/v1/rex/
```

In which case this can be passed via `ConfigService` using module's `registerAsync` method:

```typescript
@Module({
  imports: [
    RexFactoryModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseUrl: configService.get('REX_URL'),
      }),
      inject: [ConfigService],
    })]
})
```

You may wish to register the module globally:

```typescript
@Module({
  imports: [
    RexFactoryModule.register({
      global: true
    })]
})
```

## Using RexFactory service

Once the `RexFactoryModule` is registered, the `RexFactory` service should be available to inject into your services:

```typescript
export default class MyService {
  constructor(private readonly factory: RexFactory) {}

  async getAccountUsers() {
    const api = factory.create('<my email>', '<my pass')
    return await this.api.getAccountUsers(..);
  }
}
```

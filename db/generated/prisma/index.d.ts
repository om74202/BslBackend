
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Organization
 * 
 */
export type Organization = $Result.DefaultSelection<Prisma.$OrganizationPayload>
/**
 * Model Shift
 * 
 */
export type Shift = $Result.DefaultSelection<Prisma.$ShiftPayload>
/**
 * Model CustomShift
 * 
 */
export type CustomShift = $Result.DefaultSelection<Prisma.$CustomShiftPayload>
/**
 * Model PlannedBreakCustom
 * 
 */
export type PlannedBreakCustom = $Result.DefaultSelection<Prisma.$PlannedBreakCustomPayload>
/**
 * Model PlannedBreak
 * 
 */
export type PlannedBreak = $Result.DefaultSelection<Prisma.$PlannedBreakPayload>
/**
 * Model Line
 * 
 */
export type Line = $Result.DefaultSelection<Prisma.$LinePayload>
/**
 * Model Station
 * 
 */
export type Station = $Result.DefaultSelection<Prisma.$StationPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Device
 * 
 */
export type Device = $Result.DefaultSelection<Prisma.$DevicePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const DeviceStatus: {
  Active: 'Active',
  Inactive: 'Inactive',
  Maintenance: 'Maintenance'
};

export type DeviceStatus = (typeof DeviceStatus)[keyof typeof DeviceStatus]


export const Role: {
  SuperAdmin: 'SuperAdmin',
  Admin: 'Admin',
  SuperUser: 'SuperUser',
  CheckSheetUser: 'CheckSheetUser',
  User: 'User'
};

export type Role = (typeof Role)[keyof typeof Role]


export const TypeOfBreak: {
  Construction: 'Construction',
  Maintenance: 'Maintenance'
};

export type TypeOfBreak = (typeof TypeOfBreak)[keyof typeof TypeOfBreak]


export const Status: {
  Active: 'Active',
  Inactive: 'Inactive'
};

export type Status = (typeof Status)[keyof typeof Status]

}

export type DeviceStatus = $Enums.DeviceStatus

export const DeviceStatus: typeof $Enums.DeviceStatus

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type TypeOfBreak = $Enums.TypeOfBreak

export const TypeOfBreak: typeof $Enums.TypeOfBreak

export type Status = $Enums.Status

export const Status: typeof $Enums.Status

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Organizations
 * const organizations = await prisma.organization.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Organizations
   * const organizations = await prisma.organization.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.organization`: Exposes CRUD operations for the **Organization** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Organizations
    * const organizations = await prisma.organization.findMany()
    * ```
    */
  get organization(): Prisma.OrganizationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.shift`: Exposes CRUD operations for the **Shift** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Shifts
    * const shifts = await prisma.shift.findMany()
    * ```
    */
  get shift(): Prisma.ShiftDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.customShift`: Exposes CRUD operations for the **CustomShift** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CustomShifts
    * const customShifts = await prisma.customShift.findMany()
    * ```
    */
  get customShift(): Prisma.CustomShiftDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.plannedBreakCustom`: Exposes CRUD operations for the **PlannedBreakCustom** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PlannedBreakCustoms
    * const plannedBreakCustoms = await prisma.plannedBreakCustom.findMany()
    * ```
    */
  get plannedBreakCustom(): Prisma.PlannedBreakCustomDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.plannedBreak`: Exposes CRUD operations for the **PlannedBreak** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PlannedBreaks
    * const plannedBreaks = await prisma.plannedBreak.findMany()
    * ```
    */
  get plannedBreak(): Prisma.PlannedBreakDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.line`: Exposes CRUD operations for the **Line** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Lines
    * const lines = await prisma.line.findMany()
    * ```
    */
  get line(): Prisma.LineDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.station`: Exposes CRUD operations for the **Station** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Stations
    * const stations = await prisma.station.findMany()
    * ```
    */
  get station(): Prisma.StationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.device`: Exposes CRUD operations for the **Device** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Devices
    * const devices = await prisma.device.findMany()
    * ```
    */
  get device(): Prisma.DeviceDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.7.0
   * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Organization: 'Organization',
    Shift: 'Shift',
    CustomShift: 'CustomShift',
    PlannedBreakCustom: 'PlannedBreakCustom',
    PlannedBreak: 'PlannedBreak',
    Line: 'Line',
    Station: 'Station',
    User: 'User',
    Device: 'Device'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "organization" | "shift" | "customShift" | "plannedBreakCustom" | "plannedBreak" | "line" | "station" | "user" | "device"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Organization: {
        payload: Prisma.$OrganizationPayload<ExtArgs>
        fields: Prisma.OrganizationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrganizationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrganizationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          findFirst: {
            args: Prisma.OrganizationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrganizationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          findMany: {
            args: Prisma.OrganizationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>[]
          }
          create: {
            args: Prisma.OrganizationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          createMany: {
            args: Prisma.OrganizationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrganizationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>[]
          }
          delete: {
            args: Prisma.OrganizationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          update: {
            args: Prisma.OrganizationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          deleteMany: {
            args: Prisma.OrganizationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrganizationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrganizationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>[]
          }
          upsert: {
            args: Prisma.OrganizationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          aggregate: {
            args: Prisma.OrganizationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrganization>
          }
          groupBy: {
            args: Prisma.OrganizationGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrganizationGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrganizationCountArgs<ExtArgs>
            result: $Utils.Optional<OrganizationCountAggregateOutputType> | number
          }
        }
      }
      Shift: {
        payload: Prisma.$ShiftPayload<ExtArgs>
        fields: Prisma.ShiftFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ShiftFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ShiftFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftPayload>
          }
          findFirst: {
            args: Prisma.ShiftFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ShiftFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftPayload>
          }
          findMany: {
            args: Prisma.ShiftFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftPayload>[]
          }
          create: {
            args: Prisma.ShiftCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftPayload>
          }
          createMany: {
            args: Prisma.ShiftCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ShiftCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftPayload>[]
          }
          delete: {
            args: Prisma.ShiftDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftPayload>
          }
          update: {
            args: Prisma.ShiftUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftPayload>
          }
          deleteMany: {
            args: Prisma.ShiftDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ShiftUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ShiftUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftPayload>[]
          }
          upsert: {
            args: Prisma.ShiftUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftPayload>
          }
          aggregate: {
            args: Prisma.ShiftAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateShift>
          }
          groupBy: {
            args: Prisma.ShiftGroupByArgs<ExtArgs>
            result: $Utils.Optional<ShiftGroupByOutputType>[]
          }
          count: {
            args: Prisma.ShiftCountArgs<ExtArgs>
            result: $Utils.Optional<ShiftCountAggregateOutputType> | number
          }
        }
      }
      CustomShift: {
        payload: Prisma.$CustomShiftPayload<ExtArgs>
        fields: Prisma.CustomShiftFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomShiftFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomShiftPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomShiftFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomShiftPayload>
          }
          findFirst: {
            args: Prisma.CustomShiftFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomShiftPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomShiftFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomShiftPayload>
          }
          findMany: {
            args: Prisma.CustomShiftFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomShiftPayload>[]
          }
          create: {
            args: Prisma.CustomShiftCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomShiftPayload>
          }
          createMany: {
            args: Prisma.CustomShiftCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CustomShiftCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomShiftPayload>[]
          }
          delete: {
            args: Prisma.CustomShiftDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomShiftPayload>
          }
          update: {
            args: Prisma.CustomShiftUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomShiftPayload>
          }
          deleteMany: {
            args: Prisma.CustomShiftDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomShiftUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CustomShiftUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomShiftPayload>[]
          }
          upsert: {
            args: Prisma.CustomShiftUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomShiftPayload>
          }
          aggregate: {
            args: Prisma.CustomShiftAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomShift>
          }
          groupBy: {
            args: Prisma.CustomShiftGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomShiftGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomShiftCountArgs<ExtArgs>
            result: $Utils.Optional<CustomShiftCountAggregateOutputType> | number
          }
        }
      }
      PlannedBreakCustom: {
        payload: Prisma.$PlannedBreakCustomPayload<ExtArgs>
        fields: Prisma.PlannedBreakCustomFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlannedBreakCustomFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedBreakCustomPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlannedBreakCustomFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedBreakCustomPayload>
          }
          findFirst: {
            args: Prisma.PlannedBreakCustomFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedBreakCustomPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlannedBreakCustomFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedBreakCustomPayload>
          }
          findMany: {
            args: Prisma.PlannedBreakCustomFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedBreakCustomPayload>[]
          }
          create: {
            args: Prisma.PlannedBreakCustomCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedBreakCustomPayload>
          }
          createMany: {
            args: Prisma.PlannedBreakCustomCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlannedBreakCustomCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedBreakCustomPayload>[]
          }
          delete: {
            args: Prisma.PlannedBreakCustomDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedBreakCustomPayload>
          }
          update: {
            args: Prisma.PlannedBreakCustomUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedBreakCustomPayload>
          }
          deleteMany: {
            args: Prisma.PlannedBreakCustomDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlannedBreakCustomUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PlannedBreakCustomUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedBreakCustomPayload>[]
          }
          upsert: {
            args: Prisma.PlannedBreakCustomUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedBreakCustomPayload>
          }
          aggregate: {
            args: Prisma.PlannedBreakCustomAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlannedBreakCustom>
          }
          groupBy: {
            args: Prisma.PlannedBreakCustomGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlannedBreakCustomGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlannedBreakCustomCountArgs<ExtArgs>
            result: $Utils.Optional<PlannedBreakCustomCountAggregateOutputType> | number
          }
        }
      }
      PlannedBreak: {
        payload: Prisma.$PlannedBreakPayload<ExtArgs>
        fields: Prisma.PlannedBreakFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlannedBreakFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedBreakPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlannedBreakFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedBreakPayload>
          }
          findFirst: {
            args: Prisma.PlannedBreakFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedBreakPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlannedBreakFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedBreakPayload>
          }
          findMany: {
            args: Prisma.PlannedBreakFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedBreakPayload>[]
          }
          create: {
            args: Prisma.PlannedBreakCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedBreakPayload>
          }
          createMany: {
            args: Prisma.PlannedBreakCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlannedBreakCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedBreakPayload>[]
          }
          delete: {
            args: Prisma.PlannedBreakDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedBreakPayload>
          }
          update: {
            args: Prisma.PlannedBreakUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedBreakPayload>
          }
          deleteMany: {
            args: Prisma.PlannedBreakDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlannedBreakUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PlannedBreakUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedBreakPayload>[]
          }
          upsert: {
            args: Prisma.PlannedBreakUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlannedBreakPayload>
          }
          aggregate: {
            args: Prisma.PlannedBreakAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlannedBreak>
          }
          groupBy: {
            args: Prisma.PlannedBreakGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlannedBreakGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlannedBreakCountArgs<ExtArgs>
            result: $Utils.Optional<PlannedBreakCountAggregateOutputType> | number
          }
        }
      }
      Line: {
        payload: Prisma.$LinePayload<ExtArgs>
        fields: Prisma.LineFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LineFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LineFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinePayload>
          }
          findFirst: {
            args: Prisma.LineFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LineFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinePayload>
          }
          findMany: {
            args: Prisma.LineFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinePayload>[]
          }
          create: {
            args: Prisma.LineCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinePayload>
          }
          createMany: {
            args: Prisma.LineCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LineCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinePayload>[]
          }
          delete: {
            args: Prisma.LineDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinePayload>
          }
          update: {
            args: Prisma.LineUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinePayload>
          }
          deleteMany: {
            args: Prisma.LineDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LineUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LineUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinePayload>[]
          }
          upsert: {
            args: Prisma.LineUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinePayload>
          }
          aggregate: {
            args: Prisma.LineAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLine>
          }
          groupBy: {
            args: Prisma.LineGroupByArgs<ExtArgs>
            result: $Utils.Optional<LineGroupByOutputType>[]
          }
          count: {
            args: Prisma.LineCountArgs<ExtArgs>
            result: $Utils.Optional<LineCountAggregateOutputType> | number
          }
        }
      }
      Station: {
        payload: Prisma.$StationPayload<ExtArgs>
        fields: Prisma.StationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StationPayload>
          }
          findFirst: {
            args: Prisma.StationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StationPayload>
          }
          findMany: {
            args: Prisma.StationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StationPayload>[]
          }
          create: {
            args: Prisma.StationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StationPayload>
          }
          createMany: {
            args: Prisma.StationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StationPayload>[]
          }
          delete: {
            args: Prisma.StationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StationPayload>
          }
          update: {
            args: Prisma.StationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StationPayload>
          }
          deleteMany: {
            args: Prisma.StationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StationPayload>[]
          }
          upsert: {
            args: Prisma.StationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StationPayload>
          }
          aggregate: {
            args: Prisma.StationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStation>
          }
          groupBy: {
            args: Prisma.StationGroupByArgs<ExtArgs>
            result: $Utils.Optional<StationGroupByOutputType>[]
          }
          count: {
            args: Prisma.StationCountArgs<ExtArgs>
            result: $Utils.Optional<StationCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Device: {
        payload: Prisma.$DevicePayload<ExtArgs>
        fields: Prisma.DeviceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DeviceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DeviceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          findFirst: {
            args: Prisma.DeviceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DeviceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          findMany: {
            args: Prisma.DeviceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>[]
          }
          create: {
            args: Prisma.DeviceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          createMany: {
            args: Prisma.DeviceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DeviceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>[]
          }
          delete: {
            args: Prisma.DeviceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          update: {
            args: Prisma.DeviceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          deleteMany: {
            args: Prisma.DeviceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DeviceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DeviceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>[]
          }
          upsert: {
            args: Prisma.DeviceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          aggregate: {
            args: Prisma.DeviceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDevice>
          }
          groupBy: {
            args: Prisma.DeviceGroupByArgs<ExtArgs>
            result: $Utils.Optional<DeviceGroupByOutputType>[]
          }
          count: {
            args: Prisma.DeviceCountArgs<ExtArgs>
            result: $Utils.Optional<DeviceCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    organization?: OrganizationOmit
    shift?: ShiftOmit
    customShift?: CustomShiftOmit
    plannedBreakCustom?: PlannedBreakCustomOmit
    plannedBreak?: PlannedBreakOmit
    line?: LineOmit
    station?: StationOmit
    user?: UserOmit
    device?: DeviceOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type OrganizationCountOutputType
   */

  export type OrganizationCountOutputType = {
    shifts: number
    users: number
    devices: number
    lines: number
  }

  export type OrganizationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shifts?: boolean | OrganizationCountOutputTypeCountShiftsArgs
    users?: boolean | OrganizationCountOutputTypeCountUsersArgs
    devices?: boolean | OrganizationCountOutputTypeCountDevicesArgs
    lines?: boolean | OrganizationCountOutputTypeCountLinesArgs
  }

  // Custom InputTypes
  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationCountOutputType
     */
    select?: OrganizationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeCountShiftsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShiftWhereInput
  }

  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeCountDevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeviceWhereInput
  }

  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeCountLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LineWhereInput
  }


  /**
   * Count Type ShiftCountOutputType
   */

  export type ShiftCountOutputType = {
    plannedBreaks: number
    lines: number
  }

  export type ShiftCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    plannedBreaks?: boolean | ShiftCountOutputTypeCountPlannedBreaksArgs
    lines?: boolean | ShiftCountOutputTypeCountLinesArgs
  }

  // Custom InputTypes
  /**
   * ShiftCountOutputType without action
   */
  export type ShiftCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShiftCountOutputType
     */
    select?: ShiftCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ShiftCountOutputType without action
   */
  export type ShiftCountOutputTypeCountPlannedBreaksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlannedBreakWhereInput
  }

  /**
   * ShiftCountOutputType without action
   */
  export type ShiftCountOutputTypeCountLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LineWhereInput
  }


  /**
   * Count Type CustomShiftCountOutputType
   */

  export type CustomShiftCountOutputType = {
    plannedBreaks: number
  }

  export type CustomShiftCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    plannedBreaks?: boolean | CustomShiftCountOutputTypeCountPlannedBreaksArgs
  }

  // Custom InputTypes
  /**
   * CustomShiftCountOutputType without action
   */
  export type CustomShiftCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomShiftCountOutputType
     */
    select?: CustomShiftCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CustomShiftCountOutputType without action
   */
  export type CustomShiftCountOutputTypeCountPlannedBreaksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlannedBreakCustomWhereInput
  }


  /**
   * Count Type LineCountOutputType
   */

  export type LineCountOutputType = {
    customShifts: number
    shifts: number
    stations: number
    devices: number
  }

  export type LineCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customShifts?: boolean | LineCountOutputTypeCountCustomShiftsArgs
    shifts?: boolean | LineCountOutputTypeCountShiftsArgs
    stations?: boolean | LineCountOutputTypeCountStationsArgs
    devices?: boolean | LineCountOutputTypeCountDevicesArgs
  }

  // Custom InputTypes
  /**
   * LineCountOutputType without action
   */
  export type LineCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LineCountOutputType
     */
    select?: LineCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LineCountOutputType without action
   */
  export type LineCountOutputTypeCountCustomShiftsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomShiftWhereInput
  }

  /**
   * LineCountOutputType without action
   */
  export type LineCountOutputTypeCountShiftsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShiftWhereInput
  }

  /**
   * LineCountOutputType without action
   */
  export type LineCountOutputTypeCountStationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StationWhereInput
  }

  /**
   * LineCountOutputType without action
   */
  export type LineCountOutputTypeCountDevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeviceWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    lines: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lines?: boolean | UserCountOutputTypeCountLinesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LineWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Organization
   */

  export type AggregateOrganization = {
    _count: OrganizationCountAggregateOutputType | null
    _avg: OrganizationAvgAggregateOutputType | null
    _sum: OrganizationSumAggregateOutputType | null
    _min: OrganizationMinAggregateOutputType | null
    _max: OrganizationMaxAggregateOutputType | null
  }

  export type OrganizationAvgAggregateOutputType = {
    shiftNumber: number | null
  }

  export type OrganizationSumAggregateOutputType = {
    shiftNumber: number | null
  }

  export type OrganizationMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    address: string | null
    phoneNumber: string | null
    imageUrl: string | null
    shiftNumber: number | null
    unit: string | null
    Department: string | null
    Desingation: string | null
  }

  export type OrganizationMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    address: string | null
    phoneNumber: string | null
    imageUrl: string | null
    shiftNumber: number | null
    unit: string | null
    Department: string | null
    Desingation: string | null
  }

  export type OrganizationCountAggregateOutputType = {
    id: number
    name: number
    email: number
    address: number
    phoneNumber: number
    imageUrl: number
    shiftNumber: number
    unit: number
    Department: number
    Desingation: number
    _all: number
  }


  export type OrganizationAvgAggregateInputType = {
    shiftNumber?: true
  }

  export type OrganizationSumAggregateInputType = {
    shiftNumber?: true
  }

  export type OrganizationMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    address?: true
    phoneNumber?: true
    imageUrl?: true
    shiftNumber?: true
    unit?: true
    Department?: true
    Desingation?: true
  }

  export type OrganizationMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    address?: true
    phoneNumber?: true
    imageUrl?: true
    shiftNumber?: true
    unit?: true
    Department?: true
    Desingation?: true
  }

  export type OrganizationCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    address?: true
    phoneNumber?: true
    imageUrl?: true
    shiftNumber?: true
    unit?: true
    Department?: true
    Desingation?: true
    _all?: true
  }

  export type OrganizationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Organization to aggregate.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Organizations
    **/
    _count?: true | OrganizationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrganizationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrganizationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrganizationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrganizationMaxAggregateInputType
  }

  export type GetOrganizationAggregateType<T extends OrganizationAggregateArgs> = {
        [P in keyof T & keyof AggregateOrganization]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrganization[P]>
      : GetScalarType<T[P], AggregateOrganization[P]>
  }




  export type OrganizationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrganizationWhereInput
    orderBy?: OrganizationOrderByWithAggregationInput | OrganizationOrderByWithAggregationInput[]
    by: OrganizationScalarFieldEnum[] | OrganizationScalarFieldEnum
    having?: OrganizationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrganizationCountAggregateInputType | true
    _avg?: OrganizationAvgAggregateInputType
    _sum?: OrganizationSumAggregateInputType
    _min?: OrganizationMinAggregateInputType
    _max?: OrganizationMaxAggregateInputType
  }

  export type OrganizationGroupByOutputType = {
    id: string
    name: string
    email: string
    address: string
    phoneNumber: string
    imageUrl: string | null
    shiftNumber: number
    unit: string
    Department: string
    Desingation: string
    _count: OrganizationCountAggregateOutputType | null
    _avg: OrganizationAvgAggregateOutputType | null
    _sum: OrganizationSumAggregateOutputType | null
    _min: OrganizationMinAggregateOutputType | null
    _max: OrganizationMaxAggregateOutputType | null
  }

  type GetOrganizationGroupByPayload<T extends OrganizationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrganizationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrganizationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrganizationGroupByOutputType[P]>
            : GetScalarType<T[P], OrganizationGroupByOutputType[P]>
        }
      >
    >


  export type OrganizationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    address?: boolean
    phoneNumber?: boolean
    imageUrl?: boolean
    shiftNumber?: boolean
    unit?: boolean
    Department?: boolean
    Desingation?: boolean
    shifts?: boolean | Organization$shiftsArgs<ExtArgs>
    users?: boolean | Organization$usersArgs<ExtArgs>
    devices?: boolean | Organization$devicesArgs<ExtArgs>
    lines?: boolean | Organization$linesArgs<ExtArgs>
    _count?: boolean | OrganizationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["organization"]>

  export type OrganizationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    address?: boolean
    phoneNumber?: boolean
    imageUrl?: boolean
    shiftNumber?: boolean
    unit?: boolean
    Department?: boolean
    Desingation?: boolean
  }, ExtArgs["result"]["organization"]>

  export type OrganizationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    address?: boolean
    phoneNumber?: boolean
    imageUrl?: boolean
    shiftNumber?: boolean
    unit?: boolean
    Department?: boolean
    Desingation?: boolean
  }, ExtArgs["result"]["organization"]>

  export type OrganizationSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    address?: boolean
    phoneNumber?: boolean
    imageUrl?: boolean
    shiftNumber?: boolean
    unit?: boolean
    Department?: boolean
    Desingation?: boolean
  }

  export type OrganizationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "address" | "phoneNumber" | "imageUrl" | "shiftNumber" | "unit" | "Department" | "Desingation", ExtArgs["result"]["organization"]>
  export type OrganizationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shifts?: boolean | Organization$shiftsArgs<ExtArgs>
    users?: boolean | Organization$usersArgs<ExtArgs>
    devices?: boolean | Organization$devicesArgs<ExtArgs>
    lines?: boolean | Organization$linesArgs<ExtArgs>
    _count?: boolean | OrganizationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OrganizationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type OrganizationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $OrganizationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Organization"
    objects: {
      shifts: Prisma.$ShiftPayload<ExtArgs>[]
      users: Prisma.$UserPayload<ExtArgs>[]
      devices: Prisma.$DevicePayload<ExtArgs>[]
      lines: Prisma.$LinePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      address: string
      phoneNumber: string
      imageUrl: string | null
      shiftNumber: number
      unit: string
      Department: string
      Desingation: string
    }, ExtArgs["result"]["organization"]>
    composites: {}
  }

  type OrganizationGetPayload<S extends boolean | null | undefined | OrganizationDefaultArgs> = $Result.GetResult<Prisma.$OrganizationPayload, S>

  type OrganizationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrganizationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrganizationCountAggregateInputType | true
    }

  export interface OrganizationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Organization'], meta: { name: 'Organization' } }
    /**
     * Find zero or one Organization that matches the filter.
     * @param {OrganizationFindUniqueArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrganizationFindUniqueArgs>(args: SelectSubset<T, OrganizationFindUniqueArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Organization that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrganizationFindUniqueOrThrowArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrganizationFindUniqueOrThrowArgs>(args: SelectSubset<T, OrganizationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Organization that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationFindFirstArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrganizationFindFirstArgs>(args?: SelectSubset<T, OrganizationFindFirstArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Organization that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationFindFirstOrThrowArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrganizationFindFirstOrThrowArgs>(args?: SelectSubset<T, OrganizationFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Organizations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Organizations
     * const organizations = await prisma.organization.findMany()
     * 
     * // Get first 10 Organizations
     * const organizations = await prisma.organization.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const organizationWithIdOnly = await prisma.organization.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrganizationFindManyArgs>(args?: SelectSubset<T, OrganizationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Organization.
     * @param {OrganizationCreateArgs} args - Arguments to create a Organization.
     * @example
     * // Create one Organization
     * const Organization = await prisma.organization.create({
     *   data: {
     *     // ... data to create a Organization
     *   }
     * })
     * 
     */
    create<T extends OrganizationCreateArgs>(args: SelectSubset<T, OrganizationCreateArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Organizations.
     * @param {OrganizationCreateManyArgs} args - Arguments to create many Organizations.
     * @example
     * // Create many Organizations
     * const organization = await prisma.organization.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrganizationCreateManyArgs>(args?: SelectSubset<T, OrganizationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Organizations and returns the data saved in the database.
     * @param {OrganizationCreateManyAndReturnArgs} args - Arguments to create many Organizations.
     * @example
     * // Create many Organizations
     * const organization = await prisma.organization.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Organizations and only return the `id`
     * const organizationWithIdOnly = await prisma.organization.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrganizationCreateManyAndReturnArgs>(args?: SelectSubset<T, OrganizationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Organization.
     * @param {OrganizationDeleteArgs} args - Arguments to delete one Organization.
     * @example
     * // Delete one Organization
     * const Organization = await prisma.organization.delete({
     *   where: {
     *     // ... filter to delete one Organization
     *   }
     * })
     * 
     */
    delete<T extends OrganizationDeleteArgs>(args: SelectSubset<T, OrganizationDeleteArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Organization.
     * @param {OrganizationUpdateArgs} args - Arguments to update one Organization.
     * @example
     * // Update one Organization
     * const organization = await prisma.organization.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrganizationUpdateArgs>(args: SelectSubset<T, OrganizationUpdateArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Organizations.
     * @param {OrganizationDeleteManyArgs} args - Arguments to filter Organizations to delete.
     * @example
     * // Delete a few Organizations
     * const { count } = await prisma.organization.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrganizationDeleteManyArgs>(args?: SelectSubset<T, OrganizationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Organizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Organizations
     * const organization = await prisma.organization.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrganizationUpdateManyArgs>(args: SelectSubset<T, OrganizationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Organizations and returns the data updated in the database.
     * @param {OrganizationUpdateManyAndReturnArgs} args - Arguments to update many Organizations.
     * @example
     * // Update many Organizations
     * const organization = await prisma.organization.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Organizations and only return the `id`
     * const organizationWithIdOnly = await prisma.organization.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrganizationUpdateManyAndReturnArgs>(args: SelectSubset<T, OrganizationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Organization.
     * @param {OrganizationUpsertArgs} args - Arguments to update or create a Organization.
     * @example
     * // Update or create a Organization
     * const organization = await prisma.organization.upsert({
     *   create: {
     *     // ... data to create a Organization
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Organization we want to update
     *   }
     * })
     */
    upsert<T extends OrganizationUpsertArgs>(args: SelectSubset<T, OrganizationUpsertArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Organizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationCountArgs} args - Arguments to filter Organizations to count.
     * @example
     * // Count the number of Organizations
     * const count = await prisma.organization.count({
     *   where: {
     *     // ... the filter for the Organizations we want to count
     *   }
     * })
    **/
    count<T extends OrganizationCountArgs>(
      args?: Subset<T, OrganizationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrganizationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Organization.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrganizationAggregateArgs>(args: Subset<T, OrganizationAggregateArgs>): Prisma.PrismaPromise<GetOrganizationAggregateType<T>>

    /**
     * Group by Organization.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrganizationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrganizationGroupByArgs['orderBy'] }
        : { orderBy?: OrganizationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrganizationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrganizationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Organization model
   */
  readonly fields: OrganizationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Organization.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrganizationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    shifts<T extends Organization$shiftsArgs<ExtArgs> = {}>(args?: Subset<T, Organization$shiftsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    users<T extends Organization$usersArgs<ExtArgs> = {}>(args?: Subset<T, Organization$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    devices<T extends Organization$devicesArgs<ExtArgs> = {}>(args?: Subset<T, Organization$devicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    lines<T extends Organization$linesArgs<ExtArgs> = {}>(args?: Subset<T, Organization$linesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Organization model
   */
  interface OrganizationFieldRefs {
    readonly id: FieldRef<"Organization", 'String'>
    readonly name: FieldRef<"Organization", 'String'>
    readonly email: FieldRef<"Organization", 'String'>
    readonly address: FieldRef<"Organization", 'String'>
    readonly phoneNumber: FieldRef<"Organization", 'String'>
    readonly imageUrl: FieldRef<"Organization", 'String'>
    readonly shiftNumber: FieldRef<"Organization", 'Int'>
    readonly unit: FieldRef<"Organization", 'String'>
    readonly Department: FieldRef<"Organization", 'String'>
    readonly Desingation: FieldRef<"Organization", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Organization findUnique
   */
  export type OrganizationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization findUniqueOrThrow
   */
  export type OrganizationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization findFirst
   */
  export type OrganizationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Organizations.
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Organizations.
     */
    distinct?: OrganizationScalarFieldEnum | OrganizationScalarFieldEnum[]
  }

  /**
   * Organization findFirstOrThrow
   */
  export type OrganizationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Organizations.
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Organizations.
     */
    distinct?: OrganizationScalarFieldEnum | OrganizationScalarFieldEnum[]
  }

  /**
   * Organization findMany
   */
  export type OrganizationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organizations to fetch.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Organizations.
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    distinct?: OrganizationScalarFieldEnum | OrganizationScalarFieldEnum[]
  }

  /**
   * Organization create
   */
  export type OrganizationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * The data needed to create a Organization.
     */
    data: XOR<OrganizationCreateInput, OrganizationUncheckedCreateInput>
  }

  /**
   * Organization createMany
   */
  export type OrganizationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Organizations.
     */
    data: OrganizationCreateManyInput | OrganizationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Organization createManyAndReturn
   */
  export type OrganizationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * The data used to create many Organizations.
     */
    data: OrganizationCreateManyInput | OrganizationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Organization update
   */
  export type OrganizationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * The data needed to update a Organization.
     */
    data: XOR<OrganizationUpdateInput, OrganizationUncheckedUpdateInput>
    /**
     * Choose, which Organization to update.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization updateMany
   */
  export type OrganizationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Organizations.
     */
    data: XOR<OrganizationUpdateManyMutationInput, OrganizationUncheckedUpdateManyInput>
    /**
     * Filter which Organizations to update
     */
    where?: OrganizationWhereInput
    /**
     * Limit how many Organizations to update.
     */
    limit?: number
  }

  /**
   * Organization updateManyAndReturn
   */
  export type OrganizationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * The data used to update Organizations.
     */
    data: XOR<OrganizationUpdateManyMutationInput, OrganizationUncheckedUpdateManyInput>
    /**
     * Filter which Organizations to update
     */
    where?: OrganizationWhereInput
    /**
     * Limit how many Organizations to update.
     */
    limit?: number
  }

  /**
   * Organization upsert
   */
  export type OrganizationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * The filter to search for the Organization to update in case it exists.
     */
    where: OrganizationWhereUniqueInput
    /**
     * In case the Organization found by the `where` argument doesn't exist, create a new Organization with this data.
     */
    create: XOR<OrganizationCreateInput, OrganizationUncheckedCreateInput>
    /**
     * In case the Organization was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrganizationUpdateInput, OrganizationUncheckedUpdateInput>
  }

  /**
   * Organization delete
   */
  export type OrganizationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter which Organization to delete.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization deleteMany
   */
  export type OrganizationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Organizations to delete
     */
    where?: OrganizationWhereInput
    /**
     * Limit how many Organizations to delete.
     */
    limit?: number
  }

  /**
   * Organization.shifts
   */
  export type Organization$shiftsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shift
     */
    omit?: ShiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftInclude<ExtArgs> | null
    where?: ShiftWhereInput
    orderBy?: ShiftOrderByWithRelationInput | ShiftOrderByWithRelationInput[]
    cursor?: ShiftWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ShiftScalarFieldEnum | ShiftScalarFieldEnum[]
  }

  /**
   * Organization.users
   */
  export type Organization$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Organization.devices
   */
  export type Organization$devicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    where?: DeviceWhereInput
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    cursor?: DeviceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * Organization.lines
   */
  export type Organization$linesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Line
     */
    select?: LineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Line
     */
    omit?: LineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LineInclude<ExtArgs> | null
    where?: LineWhereInput
    orderBy?: LineOrderByWithRelationInput | LineOrderByWithRelationInput[]
    cursor?: LineWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LineScalarFieldEnum | LineScalarFieldEnum[]
  }

  /**
   * Organization without action
   */
  export type OrganizationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
  }


  /**
   * Model Shift
   */

  export type AggregateShift = {
    _count: ShiftCountAggregateOutputType | null
    _min: ShiftMinAggregateOutputType | null
    _max: ShiftMaxAggregateOutputType | null
  }

  export type ShiftMinAggregateOutputType = {
    id: string | null
    start: string | null
    end: string | null
    organizationId: string | null
  }

  export type ShiftMaxAggregateOutputType = {
    id: string | null
    start: string | null
    end: string | null
    organizationId: string | null
  }

  export type ShiftCountAggregateOutputType = {
    id: number
    start: number
    end: number
    organizationId: number
    _all: number
  }


  export type ShiftMinAggregateInputType = {
    id?: true
    start?: true
    end?: true
    organizationId?: true
  }

  export type ShiftMaxAggregateInputType = {
    id?: true
    start?: true
    end?: true
    organizationId?: true
  }

  export type ShiftCountAggregateInputType = {
    id?: true
    start?: true
    end?: true
    organizationId?: true
    _all?: true
  }

  export type ShiftAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Shift to aggregate.
     */
    where?: ShiftWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shifts to fetch.
     */
    orderBy?: ShiftOrderByWithRelationInput | ShiftOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ShiftWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shifts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shifts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Shifts
    **/
    _count?: true | ShiftCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ShiftMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ShiftMaxAggregateInputType
  }

  export type GetShiftAggregateType<T extends ShiftAggregateArgs> = {
        [P in keyof T & keyof AggregateShift]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateShift[P]>
      : GetScalarType<T[P], AggregateShift[P]>
  }




  export type ShiftGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShiftWhereInput
    orderBy?: ShiftOrderByWithAggregationInput | ShiftOrderByWithAggregationInput[]
    by: ShiftScalarFieldEnum[] | ShiftScalarFieldEnum
    having?: ShiftScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ShiftCountAggregateInputType | true
    _min?: ShiftMinAggregateInputType
    _max?: ShiftMaxAggregateInputType
  }

  export type ShiftGroupByOutputType = {
    id: string
    start: string
    end: string
    organizationId: string
    _count: ShiftCountAggregateOutputType | null
    _min: ShiftMinAggregateOutputType | null
    _max: ShiftMaxAggregateOutputType | null
  }

  type GetShiftGroupByPayload<T extends ShiftGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ShiftGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ShiftGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ShiftGroupByOutputType[P]>
            : GetScalarType<T[P], ShiftGroupByOutputType[P]>
        }
      >
    >


  export type ShiftSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    start?: boolean
    end?: boolean
    organizationId?: boolean
    plannedBreaks?: boolean | Shift$plannedBreaksArgs<ExtArgs>
    lines?: boolean | Shift$linesArgs<ExtArgs>
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    _count?: boolean | ShiftCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shift"]>

  export type ShiftSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    start?: boolean
    end?: boolean
    organizationId?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shift"]>

  export type ShiftSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    start?: boolean
    end?: boolean
    organizationId?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shift"]>

  export type ShiftSelectScalar = {
    id?: boolean
    start?: boolean
    end?: boolean
    organizationId?: boolean
  }

  export type ShiftOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "start" | "end" | "organizationId", ExtArgs["result"]["shift"]>
  export type ShiftInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    plannedBreaks?: boolean | Shift$plannedBreaksArgs<ExtArgs>
    lines?: boolean | Shift$linesArgs<ExtArgs>
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    _count?: boolean | ShiftCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ShiftIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }
  export type ShiftIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }

  export type $ShiftPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Shift"
    objects: {
      plannedBreaks: Prisma.$PlannedBreakPayload<ExtArgs>[]
      lines: Prisma.$LinePayload<ExtArgs>[]
      organization: Prisma.$OrganizationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      start: string
      end: string
      organizationId: string
    }, ExtArgs["result"]["shift"]>
    composites: {}
  }

  type ShiftGetPayload<S extends boolean | null | undefined | ShiftDefaultArgs> = $Result.GetResult<Prisma.$ShiftPayload, S>

  type ShiftCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ShiftFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ShiftCountAggregateInputType | true
    }

  export interface ShiftDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Shift'], meta: { name: 'Shift' } }
    /**
     * Find zero or one Shift that matches the filter.
     * @param {ShiftFindUniqueArgs} args - Arguments to find a Shift
     * @example
     * // Get one Shift
     * const shift = await prisma.shift.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ShiftFindUniqueArgs>(args: SelectSubset<T, ShiftFindUniqueArgs<ExtArgs>>): Prisma__ShiftClient<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Shift that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ShiftFindUniqueOrThrowArgs} args - Arguments to find a Shift
     * @example
     * // Get one Shift
     * const shift = await prisma.shift.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ShiftFindUniqueOrThrowArgs>(args: SelectSubset<T, ShiftFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ShiftClient<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Shift that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShiftFindFirstArgs} args - Arguments to find a Shift
     * @example
     * // Get one Shift
     * const shift = await prisma.shift.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ShiftFindFirstArgs>(args?: SelectSubset<T, ShiftFindFirstArgs<ExtArgs>>): Prisma__ShiftClient<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Shift that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShiftFindFirstOrThrowArgs} args - Arguments to find a Shift
     * @example
     * // Get one Shift
     * const shift = await prisma.shift.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ShiftFindFirstOrThrowArgs>(args?: SelectSubset<T, ShiftFindFirstOrThrowArgs<ExtArgs>>): Prisma__ShiftClient<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Shifts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShiftFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Shifts
     * const shifts = await prisma.shift.findMany()
     * 
     * // Get first 10 Shifts
     * const shifts = await prisma.shift.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const shiftWithIdOnly = await prisma.shift.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ShiftFindManyArgs>(args?: SelectSubset<T, ShiftFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Shift.
     * @param {ShiftCreateArgs} args - Arguments to create a Shift.
     * @example
     * // Create one Shift
     * const Shift = await prisma.shift.create({
     *   data: {
     *     // ... data to create a Shift
     *   }
     * })
     * 
     */
    create<T extends ShiftCreateArgs>(args: SelectSubset<T, ShiftCreateArgs<ExtArgs>>): Prisma__ShiftClient<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Shifts.
     * @param {ShiftCreateManyArgs} args - Arguments to create many Shifts.
     * @example
     * // Create many Shifts
     * const shift = await prisma.shift.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ShiftCreateManyArgs>(args?: SelectSubset<T, ShiftCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Shifts and returns the data saved in the database.
     * @param {ShiftCreateManyAndReturnArgs} args - Arguments to create many Shifts.
     * @example
     * // Create many Shifts
     * const shift = await prisma.shift.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Shifts and only return the `id`
     * const shiftWithIdOnly = await prisma.shift.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ShiftCreateManyAndReturnArgs>(args?: SelectSubset<T, ShiftCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Shift.
     * @param {ShiftDeleteArgs} args - Arguments to delete one Shift.
     * @example
     * // Delete one Shift
     * const Shift = await prisma.shift.delete({
     *   where: {
     *     // ... filter to delete one Shift
     *   }
     * })
     * 
     */
    delete<T extends ShiftDeleteArgs>(args: SelectSubset<T, ShiftDeleteArgs<ExtArgs>>): Prisma__ShiftClient<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Shift.
     * @param {ShiftUpdateArgs} args - Arguments to update one Shift.
     * @example
     * // Update one Shift
     * const shift = await prisma.shift.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ShiftUpdateArgs>(args: SelectSubset<T, ShiftUpdateArgs<ExtArgs>>): Prisma__ShiftClient<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Shifts.
     * @param {ShiftDeleteManyArgs} args - Arguments to filter Shifts to delete.
     * @example
     * // Delete a few Shifts
     * const { count } = await prisma.shift.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ShiftDeleteManyArgs>(args?: SelectSubset<T, ShiftDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Shifts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShiftUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Shifts
     * const shift = await prisma.shift.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ShiftUpdateManyArgs>(args: SelectSubset<T, ShiftUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Shifts and returns the data updated in the database.
     * @param {ShiftUpdateManyAndReturnArgs} args - Arguments to update many Shifts.
     * @example
     * // Update many Shifts
     * const shift = await prisma.shift.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Shifts and only return the `id`
     * const shiftWithIdOnly = await prisma.shift.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ShiftUpdateManyAndReturnArgs>(args: SelectSubset<T, ShiftUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Shift.
     * @param {ShiftUpsertArgs} args - Arguments to update or create a Shift.
     * @example
     * // Update or create a Shift
     * const shift = await prisma.shift.upsert({
     *   create: {
     *     // ... data to create a Shift
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Shift we want to update
     *   }
     * })
     */
    upsert<T extends ShiftUpsertArgs>(args: SelectSubset<T, ShiftUpsertArgs<ExtArgs>>): Prisma__ShiftClient<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Shifts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShiftCountArgs} args - Arguments to filter Shifts to count.
     * @example
     * // Count the number of Shifts
     * const count = await prisma.shift.count({
     *   where: {
     *     // ... the filter for the Shifts we want to count
     *   }
     * })
    **/
    count<T extends ShiftCountArgs>(
      args?: Subset<T, ShiftCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ShiftCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Shift.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShiftAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ShiftAggregateArgs>(args: Subset<T, ShiftAggregateArgs>): Prisma.PrismaPromise<GetShiftAggregateType<T>>

    /**
     * Group by Shift.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShiftGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ShiftGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ShiftGroupByArgs['orderBy'] }
        : { orderBy?: ShiftGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ShiftGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetShiftGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Shift model
   */
  readonly fields: ShiftFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Shift.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ShiftClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    plannedBreaks<T extends Shift$plannedBreaksArgs<ExtArgs> = {}>(args?: Subset<T, Shift$plannedBreaksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlannedBreakPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    lines<T extends Shift$linesArgs<ExtArgs> = {}>(args?: Subset<T, Shift$linesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    organization<T extends OrganizationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationDefaultArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Shift model
   */
  interface ShiftFieldRefs {
    readonly id: FieldRef<"Shift", 'String'>
    readonly start: FieldRef<"Shift", 'String'>
    readonly end: FieldRef<"Shift", 'String'>
    readonly organizationId: FieldRef<"Shift", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Shift findUnique
   */
  export type ShiftFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shift
     */
    omit?: ShiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftInclude<ExtArgs> | null
    /**
     * Filter, which Shift to fetch.
     */
    where: ShiftWhereUniqueInput
  }

  /**
   * Shift findUniqueOrThrow
   */
  export type ShiftFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shift
     */
    omit?: ShiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftInclude<ExtArgs> | null
    /**
     * Filter, which Shift to fetch.
     */
    where: ShiftWhereUniqueInput
  }

  /**
   * Shift findFirst
   */
  export type ShiftFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shift
     */
    omit?: ShiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftInclude<ExtArgs> | null
    /**
     * Filter, which Shift to fetch.
     */
    where?: ShiftWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shifts to fetch.
     */
    orderBy?: ShiftOrderByWithRelationInput | ShiftOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Shifts.
     */
    cursor?: ShiftWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shifts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shifts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Shifts.
     */
    distinct?: ShiftScalarFieldEnum | ShiftScalarFieldEnum[]
  }

  /**
   * Shift findFirstOrThrow
   */
  export type ShiftFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shift
     */
    omit?: ShiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftInclude<ExtArgs> | null
    /**
     * Filter, which Shift to fetch.
     */
    where?: ShiftWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shifts to fetch.
     */
    orderBy?: ShiftOrderByWithRelationInput | ShiftOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Shifts.
     */
    cursor?: ShiftWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shifts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shifts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Shifts.
     */
    distinct?: ShiftScalarFieldEnum | ShiftScalarFieldEnum[]
  }

  /**
   * Shift findMany
   */
  export type ShiftFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shift
     */
    omit?: ShiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftInclude<ExtArgs> | null
    /**
     * Filter, which Shifts to fetch.
     */
    where?: ShiftWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shifts to fetch.
     */
    orderBy?: ShiftOrderByWithRelationInput | ShiftOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Shifts.
     */
    cursor?: ShiftWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shifts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shifts.
     */
    skip?: number
    distinct?: ShiftScalarFieldEnum | ShiftScalarFieldEnum[]
  }

  /**
   * Shift create
   */
  export type ShiftCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shift
     */
    omit?: ShiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftInclude<ExtArgs> | null
    /**
     * The data needed to create a Shift.
     */
    data: XOR<ShiftCreateInput, ShiftUncheckedCreateInput>
  }

  /**
   * Shift createMany
   */
  export type ShiftCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Shifts.
     */
    data: ShiftCreateManyInput | ShiftCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Shift createManyAndReturn
   */
  export type ShiftCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Shift
     */
    omit?: ShiftOmit<ExtArgs> | null
    /**
     * The data used to create many Shifts.
     */
    data: ShiftCreateManyInput | ShiftCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Shift update
   */
  export type ShiftUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shift
     */
    omit?: ShiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftInclude<ExtArgs> | null
    /**
     * The data needed to update a Shift.
     */
    data: XOR<ShiftUpdateInput, ShiftUncheckedUpdateInput>
    /**
     * Choose, which Shift to update.
     */
    where: ShiftWhereUniqueInput
  }

  /**
   * Shift updateMany
   */
  export type ShiftUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Shifts.
     */
    data: XOR<ShiftUpdateManyMutationInput, ShiftUncheckedUpdateManyInput>
    /**
     * Filter which Shifts to update
     */
    where?: ShiftWhereInput
    /**
     * Limit how many Shifts to update.
     */
    limit?: number
  }

  /**
   * Shift updateManyAndReturn
   */
  export type ShiftUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Shift
     */
    omit?: ShiftOmit<ExtArgs> | null
    /**
     * The data used to update Shifts.
     */
    data: XOR<ShiftUpdateManyMutationInput, ShiftUncheckedUpdateManyInput>
    /**
     * Filter which Shifts to update
     */
    where?: ShiftWhereInput
    /**
     * Limit how many Shifts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Shift upsert
   */
  export type ShiftUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shift
     */
    omit?: ShiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftInclude<ExtArgs> | null
    /**
     * The filter to search for the Shift to update in case it exists.
     */
    where: ShiftWhereUniqueInput
    /**
     * In case the Shift found by the `where` argument doesn't exist, create a new Shift with this data.
     */
    create: XOR<ShiftCreateInput, ShiftUncheckedCreateInput>
    /**
     * In case the Shift was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ShiftUpdateInput, ShiftUncheckedUpdateInput>
  }

  /**
   * Shift delete
   */
  export type ShiftDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shift
     */
    omit?: ShiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftInclude<ExtArgs> | null
    /**
     * Filter which Shift to delete.
     */
    where: ShiftWhereUniqueInput
  }

  /**
   * Shift deleteMany
   */
  export type ShiftDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Shifts to delete
     */
    where?: ShiftWhereInput
    /**
     * Limit how many Shifts to delete.
     */
    limit?: number
  }

  /**
   * Shift.plannedBreaks
   */
  export type Shift$plannedBreaksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreak
     */
    select?: PlannedBreakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreak
     */
    omit?: PlannedBreakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakInclude<ExtArgs> | null
    where?: PlannedBreakWhereInput
    orderBy?: PlannedBreakOrderByWithRelationInput | PlannedBreakOrderByWithRelationInput[]
    cursor?: PlannedBreakWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlannedBreakScalarFieldEnum | PlannedBreakScalarFieldEnum[]
  }

  /**
   * Shift.lines
   */
  export type Shift$linesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Line
     */
    select?: LineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Line
     */
    omit?: LineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LineInclude<ExtArgs> | null
    where?: LineWhereInput
    orderBy?: LineOrderByWithRelationInput | LineOrderByWithRelationInput[]
    cursor?: LineWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LineScalarFieldEnum | LineScalarFieldEnum[]
  }

  /**
   * Shift without action
   */
  export type ShiftDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shift
     */
    omit?: ShiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftInclude<ExtArgs> | null
  }


  /**
   * Model CustomShift
   */

  export type AggregateCustomShift = {
    _count: CustomShiftCountAggregateOutputType | null
    _min: CustomShiftMinAggregateOutputType | null
    _max: CustomShiftMaxAggregateOutputType | null
  }

  export type CustomShiftMinAggregateOutputType = {
    id: string | null
    start: string | null
    end: string | null
    lineId: string | null
  }

  export type CustomShiftMaxAggregateOutputType = {
    id: string | null
    start: string | null
    end: string | null
    lineId: string | null
  }

  export type CustomShiftCountAggregateOutputType = {
    id: number
    start: number
    end: number
    lineId: number
    _all: number
  }


  export type CustomShiftMinAggregateInputType = {
    id?: true
    start?: true
    end?: true
    lineId?: true
  }

  export type CustomShiftMaxAggregateInputType = {
    id?: true
    start?: true
    end?: true
    lineId?: true
  }

  export type CustomShiftCountAggregateInputType = {
    id?: true
    start?: true
    end?: true
    lineId?: true
    _all?: true
  }

  export type CustomShiftAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomShift to aggregate.
     */
    where?: CustomShiftWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomShifts to fetch.
     */
    orderBy?: CustomShiftOrderByWithRelationInput | CustomShiftOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomShiftWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomShifts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomShifts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CustomShifts
    **/
    _count?: true | CustomShiftCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomShiftMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomShiftMaxAggregateInputType
  }

  export type GetCustomShiftAggregateType<T extends CustomShiftAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomShift]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomShift[P]>
      : GetScalarType<T[P], AggregateCustomShift[P]>
  }




  export type CustomShiftGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomShiftWhereInput
    orderBy?: CustomShiftOrderByWithAggregationInput | CustomShiftOrderByWithAggregationInput[]
    by: CustomShiftScalarFieldEnum[] | CustomShiftScalarFieldEnum
    having?: CustomShiftScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomShiftCountAggregateInputType | true
    _min?: CustomShiftMinAggregateInputType
    _max?: CustomShiftMaxAggregateInputType
  }

  export type CustomShiftGroupByOutputType = {
    id: string
    start: string
    end: string
    lineId: string
    _count: CustomShiftCountAggregateOutputType | null
    _min: CustomShiftMinAggregateOutputType | null
    _max: CustomShiftMaxAggregateOutputType | null
  }

  type GetCustomShiftGroupByPayload<T extends CustomShiftGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomShiftGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomShiftGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomShiftGroupByOutputType[P]>
            : GetScalarType<T[P], CustomShiftGroupByOutputType[P]>
        }
      >
    >


  export type CustomShiftSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    start?: boolean
    end?: boolean
    lineId?: boolean
    plannedBreaks?: boolean | CustomShift$plannedBreaksArgs<ExtArgs>
    line?: boolean | LineDefaultArgs<ExtArgs>
    _count?: boolean | CustomShiftCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customShift"]>

  export type CustomShiftSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    start?: boolean
    end?: boolean
    lineId?: boolean
    line?: boolean | LineDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customShift"]>

  export type CustomShiftSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    start?: boolean
    end?: boolean
    lineId?: boolean
    line?: boolean | LineDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customShift"]>

  export type CustomShiftSelectScalar = {
    id?: boolean
    start?: boolean
    end?: boolean
    lineId?: boolean
  }

  export type CustomShiftOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "start" | "end" | "lineId", ExtArgs["result"]["customShift"]>
  export type CustomShiftInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    plannedBreaks?: boolean | CustomShift$plannedBreaksArgs<ExtArgs>
    line?: boolean | LineDefaultArgs<ExtArgs>
    _count?: boolean | CustomShiftCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CustomShiftIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    line?: boolean | LineDefaultArgs<ExtArgs>
  }
  export type CustomShiftIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    line?: boolean | LineDefaultArgs<ExtArgs>
  }

  export type $CustomShiftPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CustomShift"
    objects: {
      plannedBreaks: Prisma.$PlannedBreakCustomPayload<ExtArgs>[]
      line: Prisma.$LinePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      start: string
      end: string
      lineId: string
    }, ExtArgs["result"]["customShift"]>
    composites: {}
  }

  type CustomShiftGetPayload<S extends boolean | null | undefined | CustomShiftDefaultArgs> = $Result.GetResult<Prisma.$CustomShiftPayload, S>

  type CustomShiftCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CustomShiftFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CustomShiftCountAggregateInputType | true
    }

  export interface CustomShiftDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CustomShift'], meta: { name: 'CustomShift' } }
    /**
     * Find zero or one CustomShift that matches the filter.
     * @param {CustomShiftFindUniqueArgs} args - Arguments to find a CustomShift
     * @example
     * // Get one CustomShift
     * const customShift = await prisma.customShift.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomShiftFindUniqueArgs>(args: SelectSubset<T, CustomShiftFindUniqueArgs<ExtArgs>>): Prisma__CustomShiftClient<$Result.GetResult<Prisma.$CustomShiftPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CustomShift that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CustomShiftFindUniqueOrThrowArgs} args - Arguments to find a CustomShift
     * @example
     * // Get one CustomShift
     * const customShift = await prisma.customShift.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomShiftFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomShiftFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomShiftClient<$Result.GetResult<Prisma.$CustomShiftPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CustomShift that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomShiftFindFirstArgs} args - Arguments to find a CustomShift
     * @example
     * // Get one CustomShift
     * const customShift = await prisma.customShift.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomShiftFindFirstArgs>(args?: SelectSubset<T, CustomShiftFindFirstArgs<ExtArgs>>): Prisma__CustomShiftClient<$Result.GetResult<Prisma.$CustomShiftPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CustomShift that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomShiftFindFirstOrThrowArgs} args - Arguments to find a CustomShift
     * @example
     * // Get one CustomShift
     * const customShift = await prisma.customShift.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomShiftFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomShiftFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomShiftClient<$Result.GetResult<Prisma.$CustomShiftPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CustomShifts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomShiftFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CustomShifts
     * const customShifts = await prisma.customShift.findMany()
     * 
     * // Get first 10 CustomShifts
     * const customShifts = await prisma.customShift.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customShiftWithIdOnly = await prisma.customShift.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CustomShiftFindManyArgs>(args?: SelectSubset<T, CustomShiftFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomShiftPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CustomShift.
     * @param {CustomShiftCreateArgs} args - Arguments to create a CustomShift.
     * @example
     * // Create one CustomShift
     * const CustomShift = await prisma.customShift.create({
     *   data: {
     *     // ... data to create a CustomShift
     *   }
     * })
     * 
     */
    create<T extends CustomShiftCreateArgs>(args: SelectSubset<T, CustomShiftCreateArgs<ExtArgs>>): Prisma__CustomShiftClient<$Result.GetResult<Prisma.$CustomShiftPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CustomShifts.
     * @param {CustomShiftCreateManyArgs} args - Arguments to create many CustomShifts.
     * @example
     * // Create many CustomShifts
     * const customShift = await prisma.customShift.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomShiftCreateManyArgs>(args?: SelectSubset<T, CustomShiftCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CustomShifts and returns the data saved in the database.
     * @param {CustomShiftCreateManyAndReturnArgs} args - Arguments to create many CustomShifts.
     * @example
     * // Create many CustomShifts
     * const customShift = await prisma.customShift.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CustomShifts and only return the `id`
     * const customShiftWithIdOnly = await prisma.customShift.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CustomShiftCreateManyAndReturnArgs>(args?: SelectSubset<T, CustomShiftCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomShiftPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CustomShift.
     * @param {CustomShiftDeleteArgs} args - Arguments to delete one CustomShift.
     * @example
     * // Delete one CustomShift
     * const CustomShift = await prisma.customShift.delete({
     *   where: {
     *     // ... filter to delete one CustomShift
     *   }
     * })
     * 
     */
    delete<T extends CustomShiftDeleteArgs>(args: SelectSubset<T, CustomShiftDeleteArgs<ExtArgs>>): Prisma__CustomShiftClient<$Result.GetResult<Prisma.$CustomShiftPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CustomShift.
     * @param {CustomShiftUpdateArgs} args - Arguments to update one CustomShift.
     * @example
     * // Update one CustomShift
     * const customShift = await prisma.customShift.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomShiftUpdateArgs>(args: SelectSubset<T, CustomShiftUpdateArgs<ExtArgs>>): Prisma__CustomShiftClient<$Result.GetResult<Prisma.$CustomShiftPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CustomShifts.
     * @param {CustomShiftDeleteManyArgs} args - Arguments to filter CustomShifts to delete.
     * @example
     * // Delete a few CustomShifts
     * const { count } = await prisma.customShift.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomShiftDeleteManyArgs>(args?: SelectSubset<T, CustomShiftDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CustomShifts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomShiftUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CustomShifts
     * const customShift = await prisma.customShift.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomShiftUpdateManyArgs>(args: SelectSubset<T, CustomShiftUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CustomShifts and returns the data updated in the database.
     * @param {CustomShiftUpdateManyAndReturnArgs} args - Arguments to update many CustomShifts.
     * @example
     * // Update many CustomShifts
     * const customShift = await prisma.customShift.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CustomShifts and only return the `id`
     * const customShiftWithIdOnly = await prisma.customShift.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CustomShiftUpdateManyAndReturnArgs>(args: SelectSubset<T, CustomShiftUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomShiftPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CustomShift.
     * @param {CustomShiftUpsertArgs} args - Arguments to update or create a CustomShift.
     * @example
     * // Update or create a CustomShift
     * const customShift = await prisma.customShift.upsert({
     *   create: {
     *     // ... data to create a CustomShift
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CustomShift we want to update
     *   }
     * })
     */
    upsert<T extends CustomShiftUpsertArgs>(args: SelectSubset<T, CustomShiftUpsertArgs<ExtArgs>>): Prisma__CustomShiftClient<$Result.GetResult<Prisma.$CustomShiftPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CustomShifts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomShiftCountArgs} args - Arguments to filter CustomShifts to count.
     * @example
     * // Count the number of CustomShifts
     * const count = await prisma.customShift.count({
     *   where: {
     *     // ... the filter for the CustomShifts we want to count
     *   }
     * })
    **/
    count<T extends CustomShiftCountArgs>(
      args?: Subset<T, CustomShiftCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomShiftCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CustomShift.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomShiftAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CustomShiftAggregateArgs>(args: Subset<T, CustomShiftAggregateArgs>): Prisma.PrismaPromise<GetCustomShiftAggregateType<T>>

    /**
     * Group by CustomShift.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomShiftGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CustomShiftGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomShiftGroupByArgs['orderBy'] }
        : { orderBy?: CustomShiftGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CustomShiftGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomShiftGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CustomShift model
   */
  readonly fields: CustomShiftFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CustomShift.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomShiftClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    plannedBreaks<T extends CustomShift$plannedBreaksArgs<ExtArgs> = {}>(args?: Subset<T, CustomShift$plannedBreaksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlannedBreakCustomPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    line<T extends LineDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LineDefaultArgs<ExtArgs>>): Prisma__LineClient<$Result.GetResult<Prisma.$LinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CustomShift model
   */
  interface CustomShiftFieldRefs {
    readonly id: FieldRef<"CustomShift", 'String'>
    readonly start: FieldRef<"CustomShift", 'String'>
    readonly end: FieldRef<"CustomShift", 'String'>
    readonly lineId: FieldRef<"CustomShift", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CustomShift findUnique
   */
  export type CustomShiftFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomShift
     */
    select?: CustomShiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomShift
     */
    omit?: CustomShiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomShiftInclude<ExtArgs> | null
    /**
     * Filter, which CustomShift to fetch.
     */
    where: CustomShiftWhereUniqueInput
  }

  /**
   * CustomShift findUniqueOrThrow
   */
  export type CustomShiftFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomShift
     */
    select?: CustomShiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomShift
     */
    omit?: CustomShiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomShiftInclude<ExtArgs> | null
    /**
     * Filter, which CustomShift to fetch.
     */
    where: CustomShiftWhereUniqueInput
  }

  /**
   * CustomShift findFirst
   */
  export type CustomShiftFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomShift
     */
    select?: CustomShiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomShift
     */
    omit?: CustomShiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomShiftInclude<ExtArgs> | null
    /**
     * Filter, which CustomShift to fetch.
     */
    where?: CustomShiftWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomShifts to fetch.
     */
    orderBy?: CustomShiftOrderByWithRelationInput | CustomShiftOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomShifts.
     */
    cursor?: CustomShiftWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomShifts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomShifts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomShifts.
     */
    distinct?: CustomShiftScalarFieldEnum | CustomShiftScalarFieldEnum[]
  }

  /**
   * CustomShift findFirstOrThrow
   */
  export type CustomShiftFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomShift
     */
    select?: CustomShiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomShift
     */
    omit?: CustomShiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomShiftInclude<ExtArgs> | null
    /**
     * Filter, which CustomShift to fetch.
     */
    where?: CustomShiftWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomShifts to fetch.
     */
    orderBy?: CustomShiftOrderByWithRelationInput | CustomShiftOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomShifts.
     */
    cursor?: CustomShiftWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomShifts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomShifts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomShifts.
     */
    distinct?: CustomShiftScalarFieldEnum | CustomShiftScalarFieldEnum[]
  }

  /**
   * CustomShift findMany
   */
  export type CustomShiftFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomShift
     */
    select?: CustomShiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomShift
     */
    omit?: CustomShiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomShiftInclude<ExtArgs> | null
    /**
     * Filter, which CustomShifts to fetch.
     */
    where?: CustomShiftWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomShifts to fetch.
     */
    orderBy?: CustomShiftOrderByWithRelationInput | CustomShiftOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CustomShifts.
     */
    cursor?: CustomShiftWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomShifts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomShifts.
     */
    skip?: number
    distinct?: CustomShiftScalarFieldEnum | CustomShiftScalarFieldEnum[]
  }

  /**
   * CustomShift create
   */
  export type CustomShiftCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomShift
     */
    select?: CustomShiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomShift
     */
    omit?: CustomShiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomShiftInclude<ExtArgs> | null
    /**
     * The data needed to create a CustomShift.
     */
    data: XOR<CustomShiftCreateInput, CustomShiftUncheckedCreateInput>
  }

  /**
   * CustomShift createMany
   */
  export type CustomShiftCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CustomShifts.
     */
    data: CustomShiftCreateManyInput | CustomShiftCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CustomShift createManyAndReturn
   */
  export type CustomShiftCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomShift
     */
    select?: CustomShiftSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CustomShift
     */
    omit?: CustomShiftOmit<ExtArgs> | null
    /**
     * The data used to create many CustomShifts.
     */
    data: CustomShiftCreateManyInput | CustomShiftCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomShiftIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CustomShift update
   */
  export type CustomShiftUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomShift
     */
    select?: CustomShiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomShift
     */
    omit?: CustomShiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomShiftInclude<ExtArgs> | null
    /**
     * The data needed to update a CustomShift.
     */
    data: XOR<CustomShiftUpdateInput, CustomShiftUncheckedUpdateInput>
    /**
     * Choose, which CustomShift to update.
     */
    where: CustomShiftWhereUniqueInput
  }

  /**
   * CustomShift updateMany
   */
  export type CustomShiftUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CustomShifts.
     */
    data: XOR<CustomShiftUpdateManyMutationInput, CustomShiftUncheckedUpdateManyInput>
    /**
     * Filter which CustomShifts to update
     */
    where?: CustomShiftWhereInput
    /**
     * Limit how many CustomShifts to update.
     */
    limit?: number
  }

  /**
   * CustomShift updateManyAndReturn
   */
  export type CustomShiftUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomShift
     */
    select?: CustomShiftSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CustomShift
     */
    omit?: CustomShiftOmit<ExtArgs> | null
    /**
     * The data used to update CustomShifts.
     */
    data: XOR<CustomShiftUpdateManyMutationInput, CustomShiftUncheckedUpdateManyInput>
    /**
     * Filter which CustomShifts to update
     */
    where?: CustomShiftWhereInput
    /**
     * Limit how many CustomShifts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomShiftIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CustomShift upsert
   */
  export type CustomShiftUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomShift
     */
    select?: CustomShiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomShift
     */
    omit?: CustomShiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomShiftInclude<ExtArgs> | null
    /**
     * The filter to search for the CustomShift to update in case it exists.
     */
    where: CustomShiftWhereUniqueInput
    /**
     * In case the CustomShift found by the `where` argument doesn't exist, create a new CustomShift with this data.
     */
    create: XOR<CustomShiftCreateInput, CustomShiftUncheckedCreateInput>
    /**
     * In case the CustomShift was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomShiftUpdateInput, CustomShiftUncheckedUpdateInput>
  }

  /**
   * CustomShift delete
   */
  export type CustomShiftDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomShift
     */
    select?: CustomShiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomShift
     */
    omit?: CustomShiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomShiftInclude<ExtArgs> | null
    /**
     * Filter which CustomShift to delete.
     */
    where: CustomShiftWhereUniqueInput
  }

  /**
   * CustomShift deleteMany
   */
  export type CustomShiftDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomShifts to delete
     */
    where?: CustomShiftWhereInput
    /**
     * Limit how many CustomShifts to delete.
     */
    limit?: number
  }

  /**
   * CustomShift.plannedBreaks
   */
  export type CustomShift$plannedBreaksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreakCustom
     */
    select?: PlannedBreakCustomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreakCustom
     */
    omit?: PlannedBreakCustomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakCustomInclude<ExtArgs> | null
    where?: PlannedBreakCustomWhereInput
    orderBy?: PlannedBreakCustomOrderByWithRelationInput | PlannedBreakCustomOrderByWithRelationInput[]
    cursor?: PlannedBreakCustomWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlannedBreakCustomScalarFieldEnum | PlannedBreakCustomScalarFieldEnum[]
  }

  /**
   * CustomShift without action
   */
  export type CustomShiftDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomShift
     */
    select?: CustomShiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomShift
     */
    omit?: CustomShiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomShiftInclude<ExtArgs> | null
  }


  /**
   * Model PlannedBreakCustom
   */

  export type AggregatePlannedBreakCustom = {
    _count: PlannedBreakCustomCountAggregateOutputType | null
    _min: PlannedBreakCustomMinAggregateOutputType | null
    _max: PlannedBreakCustomMaxAggregateOutputType | null
  }

  export type PlannedBreakCustomMinAggregateOutputType = {
    id: string | null
    start: string | null
    end: string | null
    typeOfBreak: string | null
    customShiftTimingId: string | null
  }

  export type PlannedBreakCustomMaxAggregateOutputType = {
    id: string | null
    start: string | null
    end: string | null
    typeOfBreak: string | null
    customShiftTimingId: string | null
  }

  export type PlannedBreakCustomCountAggregateOutputType = {
    id: number
    start: number
    end: number
    typeOfBreak: number
    customShiftTimingId: number
    _all: number
  }


  export type PlannedBreakCustomMinAggregateInputType = {
    id?: true
    start?: true
    end?: true
    typeOfBreak?: true
    customShiftTimingId?: true
  }

  export type PlannedBreakCustomMaxAggregateInputType = {
    id?: true
    start?: true
    end?: true
    typeOfBreak?: true
    customShiftTimingId?: true
  }

  export type PlannedBreakCustomCountAggregateInputType = {
    id?: true
    start?: true
    end?: true
    typeOfBreak?: true
    customShiftTimingId?: true
    _all?: true
  }

  export type PlannedBreakCustomAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlannedBreakCustom to aggregate.
     */
    where?: PlannedBreakCustomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlannedBreakCustoms to fetch.
     */
    orderBy?: PlannedBreakCustomOrderByWithRelationInput | PlannedBreakCustomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlannedBreakCustomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlannedBreakCustoms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlannedBreakCustoms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PlannedBreakCustoms
    **/
    _count?: true | PlannedBreakCustomCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlannedBreakCustomMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlannedBreakCustomMaxAggregateInputType
  }

  export type GetPlannedBreakCustomAggregateType<T extends PlannedBreakCustomAggregateArgs> = {
        [P in keyof T & keyof AggregatePlannedBreakCustom]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlannedBreakCustom[P]>
      : GetScalarType<T[P], AggregatePlannedBreakCustom[P]>
  }




  export type PlannedBreakCustomGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlannedBreakCustomWhereInput
    orderBy?: PlannedBreakCustomOrderByWithAggregationInput | PlannedBreakCustomOrderByWithAggregationInput[]
    by: PlannedBreakCustomScalarFieldEnum[] | PlannedBreakCustomScalarFieldEnum
    having?: PlannedBreakCustomScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlannedBreakCustomCountAggregateInputType | true
    _min?: PlannedBreakCustomMinAggregateInputType
    _max?: PlannedBreakCustomMaxAggregateInputType
  }

  export type PlannedBreakCustomGroupByOutputType = {
    id: string
    start: string
    end: string
    typeOfBreak: string
    customShiftTimingId: string
    _count: PlannedBreakCustomCountAggregateOutputType | null
    _min: PlannedBreakCustomMinAggregateOutputType | null
    _max: PlannedBreakCustomMaxAggregateOutputType | null
  }

  type GetPlannedBreakCustomGroupByPayload<T extends PlannedBreakCustomGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlannedBreakCustomGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlannedBreakCustomGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlannedBreakCustomGroupByOutputType[P]>
            : GetScalarType<T[P], PlannedBreakCustomGroupByOutputType[P]>
        }
      >
    >


  export type PlannedBreakCustomSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    start?: boolean
    end?: boolean
    typeOfBreak?: boolean
    customShiftTimingId?: boolean
    customShift?: boolean | CustomShiftDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["plannedBreakCustom"]>

  export type PlannedBreakCustomSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    start?: boolean
    end?: boolean
    typeOfBreak?: boolean
    customShiftTimingId?: boolean
    customShift?: boolean | CustomShiftDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["plannedBreakCustom"]>

  export type PlannedBreakCustomSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    start?: boolean
    end?: boolean
    typeOfBreak?: boolean
    customShiftTimingId?: boolean
    customShift?: boolean | CustomShiftDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["plannedBreakCustom"]>

  export type PlannedBreakCustomSelectScalar = {
    id?: boolean
    start?: boolean
    end?: boolean
    typeOfBreak?: boolean
    customShiftTimingId?: boolean
  }

  export type PlannedBreakCustomOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "start" | "end" | "typeOfBreak" | "customShiftTimingId", ExtArgs["result"]["plannedBreakCustom"]>
  export type PlannedBreakCustomInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customShift?: boolean | CustomShiftDefaultArgs<ExtArgs>
  }
  export type PlannedBreakCustomIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customShift?: boolean | CustomShiftDefaultArgs<ExtArgs>
  }
  export type PlannedBreakCustomIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customShift?: boolean | CustomShiftDefaultArgs<ExtArgs>
  }

  export type $PlannedBreakCustomPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PlannedBreakCustom"
    objects: {
      customShift: Prisma.$CustomShiftPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      start: string
      end: string
      typeOfBreak: string
      customShiftTimingId: string
    }, ExtArgs["result"]["plannedBreakCustom"]>
    composites: {}
  }

  type PlannedBreakCustomGetPayload<S extends boolean | null | undefined | PlannedBreakCustomDefaultArgs> = $Result.GetResult<Prisma.$PlannedBreakCustomPayload, S>

  type PlannedBreakCustomCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlannedBreakCustomFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlannedBreakCustomCountAggregateInputType | true
    }

  export interface PlannedBreakCustomDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PlannedBreakCustom'], meta: { name: 'PlannedBreakCustom' } }
    /**
     * Find zero or one PlannedBreakCustom that matches the filter.
     * @param {PlannedBreakCustomFindUniqueArgs} args - Arguments to find a PlannedBreakCustom
     * @example
     * // Get one PlannedBreakCustom
     * const plannedBreakCustom = await prisma.plannedBreakCustom.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlannedBreakCustomFindUniqueArgs>(args: SelectSubset<T, PlannedBreakCustomFindUniqueArgs<ExtArgs>>): Prisma__PlannedBreakCustomClient<$Result.GetResult<Prisma.$PlannedBreakCustomPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PlannedBreakCustom that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlannedBreakCustomFindUniqueOrThrowArgs} args - Arguments to find a PlannedBreakCustom
     * @example
     * // Get one PlannedBreakCustom
     * const plannedBreakCustom = await prisma.plannedBreakCustom.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlannedBreakCustomFindUniqueOrThrowArgs>(args: SelectSubset<T, PlannedBreakCustomFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlannedBreakCustomClient<$Result.GetResult<Prisma.$PlannedBreakCustomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PlannedBreakCustom that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlannedBreakCustomFindFirstArgs} args - Arguments to find a PlannedBreakCustom
     * @example
     * // Get one PlannedBreakCustom
     * const plannedBreakCustom = await prisma.plannedBreakCustom.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlannedBreakCustomFindFirstArgs>(args?: SelectSubset<T, PlannedBreakCustomFindFirstArgs<ExtArgs>>): Prisma__PlannedBreakCustomClient<$Result.GetResult<Prisma.$PlannedBreakCustomPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PlannedBreakCustom that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlannedBreakCustomFindFirstOrThrowArgs} args - Arguments to find a PlannedBreakCustom
     * @example
     * // Get one PlannedBreakCustom
     * const plannedBreakCustom = await prisma.plannedBreakCustom.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlannedBreakCustomFindFirstOrThrowArgs>(args?: SelectSubset<T, PlannedBreakCustomFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlannedBreakCustomClient<$Result.GetResult<Prisma.$PlannedBreakCustomPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PlannedBreakCustoms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlannedBreakCustomFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PlannedBreakCustoms
     * const plannedBreakCustoms = await prisma.plannedBreakCustom.findMany()
     * 
     * // Get first 10 PlannedBreakCustoms
     * const plannedBreakCustoms = await prisma.plannedBreakCustom.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const plannedBreakCustomWithIdOnly = await prisma.plannedBreakCustom.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlannedBreakCustomFindManyArgs>(args?: SelectSubset<T, PlannedBreakCustomFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlannedBreakCustomPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PlannedBreakCustom.
     * @param {PlannedBreakCustomCreateArgs} args - Arguments to create a PlannedBreakCustom.
     * @example
     * // Create one PlannedBreakCustom
     * const PlannedBreakCustom = await prisma.plannedBreakCustom.create({
     *   data: {
     *     // ... data to create a PlannedBreakCustom
     *   }
     * })
     * 
     */
    create<T extends PlannedBreakCustomCreateArgs>(args: SelectSubset<T, PlannedBreakCustomCreateArgs<ExtArgs>>): Prisma__PlannedBreakCustomClient<$Result.GetResult<Prisma.$PlannedBreakCustomPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PlannedBreakCustoms.
     * @param {PlannedBreakCustomCreateManyArgs} args - Arguments to create many PlannedBreakCustoms.
     * @example
     * // Create many PlannedBreakCustoms
     * const plannedBreakCustom = await prisma.plannedBreakCustom.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlannedBreakCustomCreateManyArgs>(args?: SelectSubset<T, PlannedBreakCustomCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PlannedBreakCustoms and returns the data saved in the database.
     * @param {PlannedBreakCustomCreateManyAndReturnArgs} args - Arguments to create many PlannedBreakCustoms.
     * @example
     * // Create many PlannedBreakCustoms
     * const plannedBreakCustom = await prisma.plannedBreakCustom.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PlannedBreakCustoms and only return the `id`
     * const plannedBreakCustomWithIdOnly = await prisma.plannedBreakCustom.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlannedBreakCustomCreateManyAndReturnArgs>(args?: SelectSubset<T, PlannedBreakCustomCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlannedBreakCustomPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PlannedBreakCustom.
     * @param {PlannedBreakCustomDeleteArgs} args - Arguments to delete one PlannedBreakCustom.
     * @example
     * // Delete one PlannedBreakCustom
     * const PlannedBreakCustom = await prisma.plannedBreakCustom.delete({
     *   where: {
     *     // ... filter to delete one PlannedBreakCustom
     *   }
     * })
     * 
     */
    delete<T extends PlannedBreakCustomDeleteArgs>(args: SelectSubset<T, PlannedBreakCustomDeleteArgs<ExtArgs>>): Prisma__PlannedBreakCustomClient<$Result.GetResult<Prisma.$PlannedBreakCustomPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PlannedBreakCustom.
     * @param {PlannedBreakCustomUpdateArgs} args - Arguments to update one PlannedBreakCustom.
     * @example
     * // Update one PlannedBreakCustom
     * const plannedBreakCustom = await prisma.plannedBreakCustom.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlannedBreakCustomUpdateArgs>(args: SelectSubset<T, PlannedBreakCustomUpdateArgs<ExtArgs>>): Prisma__PlannedBreakCustomClient<$Result.GetResult<Prisma.$PlannedBreakCustomPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PlannedBreakCustoms.
     * @param {PlannedBreakCustomDeleteManyArgs} args - Arguments to filter PlannedBreakCustoms to delete.
     * @example
     * // Delete a few PlannedBreakCustoms
     * const { count } = await prisma.plannedBreakCustom.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlannedBreakCustomDeleteManyArgs>(args?: SelectSubset<T, PlannedBreakCustomDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PlannedBreakCustoms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlannedBreakCustomUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PlannedBreakCustoms
     * const plannedBreakCustom = await prisma.plannedBreakCustom.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlannedBreakCustomUpdateManyArgs>(args: SelectSubset<T, PlannedBreakCustomUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PlannedBreakCustoms and returns the data updated in the database.
     * @param {PlannedBreakCustomUpdateManyAndReturnArgs} args - Arguments to update many PlannedBreakCustoms.
     * @example
     * // Update many PlannedBreakCustoms
     * const plannedBreakCustom = await prisma.plannedBreakCustom.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PlannedBreakCustoms and only return the `id`
     * const plannedBreakCustomWithIdOnly = await prisma.plannedBreakCustom.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PlannedBreakCustomUpdateManyAndReturnArgs>(args: SelectSubset<T, PlannedBreakCustomUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlannedBreakCustomPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PlannedBreakCustom.
     * @param {PlannedBreakCustomUpsertArgs} args - Arguments to update or create a PlannedBreakCustom.
     * @example
     * // Update or create a PlannedBreakCustom
     * const plannedBreakCustom = await prisma.plannedBreakCustom.upsert({
     *   create: {
     *     // ... data to create a PlannedBreakCustom
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PlannedBreakCustom we want to update
     *   }
     * })
     */
    upsert<T extends PlannedBreakCustomUpsertArgs>(args: SelectSubset<T, PlannedBreakCustomUpsertArgs<ExtArgs>>): Prisma__PlannedBreakCustomClient<$Result.GetResult<Prisma.$PlannedBreakCustomPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PlannedBreakCustoms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlannedBreakCustomCountArgs} args - Arguments to filter PlannedBreakCustoms to count.
     * @example
     * // Count the number of PlannedBreakCustoms
     * const count = await prisma.plannedBreakCustom.count({
     *   where: {
     *     // ... the filter for the PlannedBreakCustoms we want to count
     *   }
     * })
    **/
    count<T extends PlannedBreakCustomCountArgs>(
      args?: Subset<T, PlannedBreakCustomCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlannedBreakCustomCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PlannedBreakCustom.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlannedBreakCustomAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlannedBreakCustomAggregateArgs>(args: Subset<T, PlannedBreakCustomAggregateArgs>): Prisma.PrismaPromise<GetPlannedBreakCustomAggregateType<T>>

    /**
     * Group by PlannedBreakCustom.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlannedBreakCustomGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlannedBreakCustomGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlannedBreakCustomGroupByArgs['orderBy'] }
        : { orderBy?: PlannedBreakCustomGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlannedBreakCustomGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlannedBreakCustomGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PlannedBreakCustom model
   */
  readonly fields: PlannedBreakCustomFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PlannedBreakCustom.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlannedBreakCustomClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customShift<T extends CustomShiftDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CustomShiftDefaultArgs<ExtArgs>>): Prisma__CustomShiftClient<$Result.GetResult<Prisma.$CustomShiftPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PlannedBreakCustom model
   */
  interface PlannedBreakCustomFieldRefs {
    readonly id: FieldRef<"PlannedBreakCustom", 'String'>
    readonly start: FieldRef<"PlannedBreakCustom", 'String'>
    readonly end: FieldRef<"PlannedBreakCustom", 'String'>
    readonly typeOfBreak: FieldRef<"PlannedBreakCustom", 'String'>
    readonly customShiftTimingId: FieldRef<"PlannedBreakCustom", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PlannedBreakCustom findUnique
   */
  export type PlannedBreakCustomFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreakCustom
     */
    select?: PlannedBreakCustomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreakCustom
     */
    omit?: PlannedBreakCustomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakCustomInclude<ExtArgs> | null
    /**
     * Filter, which PlannedBreakCustom to fetch.
     */
    where: PlannedBreakCustomWhereUniqueInput
  }

  /**
   * PlannedBreakCustom findUniqueOrThrow
   */
  export type PlannedBreakCustomFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreakCustom
     */
    select?: PlannedBreakCustomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreakCustom
     */
    omit?: PlannedBreakCustomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakCustomInclude<ExtArgs> | null
    /**
     * Filter, which PlannedBreakCustom to fetch.
     */
    where: PlannedBreakCustomWhereUniqueInput
  }

  /**
   * PlannedBreakCustom findFirst
   */
  export type PlannedBreakCustomFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreakCustom
     */
    select?: PlannedBreakCustomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreakCustom
     */
    omit?: PlannedBreakCustomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakCustomInclude<ExtArgs> | null
    /**
     * Filter, which PlannedBreakCustom to fetch.
     */
    where?: PlannedBreakCustomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlannedBreakCustoms to fetch.
     */
    orderBy?: PlannedBreakCustomOrderByWithRelationInput | PlannedBreakCustomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlannedBreakCustoms.
     */
    cursor?: PlannedBreakCustomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlannedBreakCustoms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlannedBreakCustoms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlannedBreakCustoms.
     */
    distinct?: PlannedBreakCustomScalarFieldEnum | PlannedBreakCustomScalarFieldEnum[]
  }

  /**
   * PlannedBreakCustom findFirstOrThrow
   */
  export type PlannedBreakCustomFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreakCustom
     */
    select?: PlannedBreakCustomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreakCustom
     */
    omit?: PlannedBreakCustomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakCustomInclude<ExtArgs> | null
    /**
     * Filter, which PlannedBreakCustom to fetch.
     */
    where?: PlannedBreakCustomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlannedBreakCustoms to fetch.
     */
    orderBy?: PlannedBreakCustomOrderByWithRelationInput | PlannedBreakCustomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlannedBreakCustoms.
     */
    cursor?: PlannedBreakCustomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlannedBreakCustoms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlannedBreakCustoms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlannedBreakCustoms.
     */
    distinct?: PlannedBreakCustomScalarFieldEnum | PlannedBreakCustomScalarFieldEnum[]
  }

  /**
   * PlannedBreakCustom findMany
   */
  export type PlannedBreakCustomFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreakCustom
     */
    select?: PlannedBreakCustomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreakCustom
     */
    omit?: PlannedBreakCustomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakCustomInclude<ExtArgs> | null
    /**
     * Filter, which PlannedBreakCustoms to fetch.
     */
    where?: PlannedBreakCustomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlannedBreakCustoms to fetch.
     */
    orderBy?: PlannedBreakCustomOrderByWithRelationInput | PlannedBreakCustomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PlannedBreakCustoms.
     */
    cursor?: PlannedBreakCustomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlannedBreakCustoms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlannedBreakCustoms.
     */
    skip?: number
    distinct?: PlannedBreakCustomScalarFieldEnum | PlannedBreakCustomScalarFieldEnum[]
  }

  /**
   * PlannedBreakCustom create
   */
  export type PlannedBreakCustomCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreakCustom
     */
    select?: PlannedBreakCustomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreakCustom
     */
    omit?: PlannedBreakCustomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakCustomInclude<ExtArgs> | null
    /**
     * The data needed to create a PlannedBreakCustom.
     */
    data: XOR<PlannedBreakCustomCreateInput, PlannedBreakCustomUncheckedCreateInput>
  }

  /**
   * PlannedBreakCustom createMany
   */
  export type PlannedBreakCustomCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PlannedBreakCustoms.
     */
    data: PlannedBreakCustomCreateManyInput | PlannedBreakCustomCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PlannedBreakCustom createManyAndReturn
   */
  export type PlannedBreakCustomCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreakCustom
     */
    select?: PlannedBreakCustomSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreakCustom
     */
    omit?: PlannedBreakCustomOmit<ExtArgs> | null
    /**
     * The data used to create many PlannedBreakCustoms.
     */
    data: PlannedBreakCustomCreateManyInput | PlannedBreakCustomCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakCustomIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PlannedBreakCustom update
   */
  export type PlannedBreakCustomUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreakCustom
     */
    select?: PlannedBreakCustomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreakCustom
     */
    omit?: PlannedBreakCustomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakCustomInclude<ExtArgs> | null
    /**
     * The data needed to update a PlannedBreakCustom.
     */
    data: XOR<PlannedBreakCustomUpdateInput, PlannedBreakCustomUncheckedUpdateInput>
    /**
     * Choose, which PlannedBreakCustom to update.
     */
    where: PlannedBreakCustomWhereUniqueInput
  }

  /**
   * PlannedBreakCustom updateMany
   */
  export type PlannedBreakCustomUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PlannedBreakCustoms.
     */
    data: XOR<PlannedBreakCustomUpdateManyMutationInput, PlannedBreakCustomUncheckedUpdateManyInput>
    /**
     * Filter which PlannedBreakCustoms to update
     */
    where?: PlannedBreakCustomWhereInput
    /**
     * Limit how many PlannedBreakCustoms to update.
     */
    limit?: number
  }

  /**
   * PlannedBreakCustom updateManyAndReturn
   */
  export type PlannedBreakCustomUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreakCustom
     */
    select?: PlannedBreakCustomSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreakCustom
     */
    omit?: PlannedBreakCustomOmit<ExtArgs> | null
    /**
     * The data used to update PlannedBreakCustoms.
     */
    data: XOR<PlannedBreakCustomUpdateManyMutationInput, PlannedBreakCustomUncheckedUpdateManyInput>
    /**
     * Filter which PlannedBreakCustoms to update
     */
    where?: PlannedBreakCustomWhereInput
    /**
     * Limit how many PlannedBreakCustoms to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakCustomIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PlannedBreakCustom upsert
   */
  export type PlannedBreakCustomUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreakCustom
     */
    select?: PlannedBreakCustomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreakCustom
     */
    omit?: PlannedBreakCustomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakCustomInclude<ExtArgs> | null
    /**
     * The filter to search for the PlannedBreakCustom to update in case it exists.
     */
    where: PlannedBreakCustomWhereUniqueInput
    /**
     * In case the PlannedBreakCustom found by the `where` argument doesn't exist, create a new PlannedBreakCustom with this data.
     */
    create: XOR<PlannedBreakCustomCreateInput, PlannedBreakCustomUncheckedCreateInput>
    /**
     * In case the PlannedBreakCustom was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlannedBreakCustomUpdateInput, PlannedBreakCustomUncheckedUpdateInput>
  }

  /**
   * PlannedBreakCustom delete
   */
  export type PlannedBreakCustomDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreakCustom
     */
    select?: PlannedBreakCustomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreakCustom
     */
    omit?: PlannedBreakCustomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakCustomInclude<ExtArgs> | null
    /**
     * Filter which PlannedBreakCustom to delete.
     */
    where: PlannedBreakCustomWhereUniqueInput
  }

  /**
   * PlannedBreakCustom deleteMany
   */
  export type PlannedBreakCustomDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlannedBreakCustoms to delete
     */
    where?: PlannedBreakCustomWhereInput
    /**
     * Limit how many PlannedBreakCustoms to delete.
     */
    limit?: number
  }

  /**
   * PlannedBreakCustom without action
   */
  export type PlannedBreakCustomDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreakCustom
     */
    select?: PlannedBreakCustomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreakCustom
     */
    omit?: PlannedBreakCustomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakCustomInclude<ExtArgs> | null
  }


  /**
   * Model PlannedBreak
   */

  export type AggregatePlannedBreak = {
    _count: PlannedBreakCountAggregateOutputType | null
    _min: PlannedBreakMinAggregateOutputType | null
    _max: PlannedBreakMaxAggregateOutputType | null
  }

  export type PlannedBreakMinAggregateOutputType = {
    id: string | null
    start: string | null
    end: string | null
    type: $Enums.TypeOfBreak | null
    ShiftId: string | null
  }

  export type PlannedBreakMaxAggregateOutputType = {
    id: string | null
    start: string | null
    end: string | null
    type: $Enums.TypeOfBreak | null
    ShiftId: string | null
  }

  export type PlannedBreakCountAggregateOutputType = {
    id: number
    start: number
    end: number
    type: number
    ShiftId: number
    _all: number
  }


  export type PlannedBreakMinAggregateInputType = {
    id?: true
    start?: true
    end?: true
    type?: true
    ShiftId?: true
  }

  export type PlannedBreakMaxAggregateInputType = {
    id?: true
    start?: true
    end?: true
    type?: true
    ShiftId?: true
  }

  export type PlannedBreakCountAggregateInputType = {
    id?: true
    start?: true
    end?: true
    type?: true
    ShiftId?: true
    _all?: true
  }

  export type PlannedBreakAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlannedBreak to aggregate.
     */
    where?: PlannedBreakWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlannedBreaks to fetch.
     */
    orderBy?: PlannedBreakOrderByWithRelationInput | PlannedBreakOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlannedBreakWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlannedBreaks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlannedBreaks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PlannedBreaks
    **/
    _count?: true | PlannedBreakCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlannedBreakMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlannedBreakMaxAggregateInputType
  }

  export type GetPlannedBreakAggregateType<T extends PlannedBreakAggregateArgs> = {
        [P in keyof T & keyof AggregatePlannedBreak]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlannedBreak[P]>
      : GetScalarType<T[P], AggregatePlannedBreak[P]>
  }




  export type PlannedBreakGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlannedBreakWhereInput
    orderBy?: PlannedBreakOrderByWithAggregationInput | PlannedBreakOrderByWithAggregationInput[]
    by: PlannedBreakScalarFieldEnum[] | PlannedBreakScalarFieldEnum
    having?: PlannedBreakScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlannedBreakCountAggregateInputType | true
    _min?: PlannedBreakMinAggregateInputType
    _max?: PlannedBreakMaxAggregateInputType
  }

  export type PlannedBreakGroupByOutputType = {
    id: string
    start: string
    end: string
    type: $Enums.TypeOfBreak
    ShiftId: string
    _count: PlannedBreakCountAggregateOutputType | null
    _min: PlannedBreakMinAggregateOutputType | null
    _max: PlannedBreakMaxAggregateOutputType | null
  }

  type GetPlannedBreakGroupByPayload<T extends PlannedBreakGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlannedBreakGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlannedBreakGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlannedBreakGroupByOutputType[P]>
            : GetScalarType<T[P], PlannedBreakGroupByOutputType[P]>
        }
      >
    >


  export type PlannedBreakSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    start?: boolean
    end?: boolean
    type?: boolean
    ShiftId?: boolean
    shift?: boolean | ShiftDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["plannedBreak"]>

  export type PlannedBreakSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    start?: boolean
    end?: boolean
    type?: boolean
    ShiftId?: boolean
    shift?: boolean | ShiftDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["plannedBreak"]>

  export type PlannedBreakSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    start?: boolean
    end?: boolean
    type?: boolean
    ShiftId?: boolean
    shift?: boolean | ShiftDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["plannedBreak"]>

  export type PlannedBreakSelectScalar = {
    id?: boolean
    start?: boolean
    end?: boolean
    type?: boolean
    ShiftId?: boolean
  }

  export type PlannedBreakOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "start" | "end" | "type" | "ShiftId", ExtArgs["result"]["plannedBreak"]>
  export type PlannedBreakInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shift?: boolean | ShiftDefaultArgs<ExtArgs>
  }
  export type PlannedBreakIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shift?: boolean | ShiftDefaultArgs<ExtArgs>
  }
  export type PlannedBreakIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shift?: boolean | ShiftDefaultArgs<ExtArgs>
  }

  export type $PlannedBreakPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PlannedBreak"
    objects: {
      shift: Prisma.$ShiftPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      start: string
      end: string
      type: $Enums.TypeOfBreak
      ShiftId: string
    }, ExtArgs["result"]["plannedBreak"]>
    composites: {}
  }

  type PlannedBreakGetPayload<S extends boolean | null | undefined | PlannedBreakDefaultArgs> = $Result.GetResult<Prisma.$PlannedBreakPayload, S>

  type PlannedBreakCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlannedBreakFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlannedBreakCountAggregateInputType | true
    }

  export interface PlannedBreakDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PlannedBreak'], meta: { name: 'PlannedBreak' } }
    /**
     * Find zero or one PlannedBreak that matches the filter.
     * @param {PlannedBreakFindUniqueArgs} args - Arguments to find a PlannedBreak
     * @example
     * // Get one PlannedBreak
     * const plannedBreak = await prisma.plannedBreak.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlannedBreakFindUniqueArgs>(args: SelectSubset<T, PlannedBreakFindUniqueArgs<ExtArgs>>): Prisma__PlannedBreakClient<$Result.GetResult<Prisma.$PlannedBreakPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PlannedBreak that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlannedBreakFindUniqueOrThrowArgs} args - Arguments to find a PlannedBreak
     * @example
     * // Get one PlannedBreak
     * const plannedBreak = await prisma.plannedBreak.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlannedBreakFindUniqueOrThrowArgs>(args: SelectSubset<T, PlannedBreakFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlannedBreakClient<$Result.GetResult<Prisma.$PlannedBreakPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PlannedBreak that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlannedBreakFindFirstArgs} args - Arguments to find a PlannedBreak
     * @example
     * // Get one PlannedBreak
     * const plannedBreak = await prisma.plannedBreak.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlannedBreakFindFirstArgs>(args?: SelectSubset<T, PlannedBreakFindFirstArgs<ExtArgs>>): Prisma__PlannedBreakClient<$Result.GetResult<Prisma.$PlannedBreakPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PlannedBreak that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlannedBreakFindFirstOrThrowArgs} args - Arguments to find a PlannedBreak
     * @example
     * // Get one PlannedBreak
     * const plannedBreak = await prisma.plannedBreak.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlannedBreakFindFirstOrThrowArgs>(args?: SelectSubset<T, PlannedBreakFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlannedBreakClient<$Result.GetResult<Prisma.$PlannedBreakPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PlannedBreaks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlannedBreakFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PlannedBreaks
     * const plannedBreaks = await prisma.plannedBreak.findMany()
     * 
     * // Get first 10 PlannedBreaks
     * const plannedBreaks = await prisma.plannedBreak.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const plannedBreakWithIdOnly = await prisma.plannedBreak.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlannedBreakFindManyArgs>(args?: SelectSubset<T, PlannedBreakFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlannedBreakPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PlannedBreak.
     * @param {PlannedBreakCreateArgs} args - Arguments to create a PlannedBreak.
     * @example
     * // Create one PlannedBreak
     * const PlannedBreak = await prisma.plannedBreak.create({
     *   data: {
     *     // ... data to create a PlannedBreak
     *   }
     * })
     * 
     */
    create<T extends PlannedBreakCreateArgs>(args: SelectSubset<T, PlannedBreakCreateArgs<ExtArgs>>): Prisma__PlannedBreakClient<$Result.GetResult<Prisma.$PlannedBreakPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PlannedBreaks.
     * @param {PlannedBreakCreateManyArgs} args - Arguments to create many PlannedBreaks.
     * @example
     * // Create many PlannedBreaks
     * const plannedBreak = await prisma.plannedBreak.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlannedBreakCreateManyArgs>(args?: SelectSubset<T, PlannedBreakCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PlannedBreaks and returns the data saved in the database.
     * @param {PlannedBreakCreateManyAndReturnArgs} args - Arguments to create many PlannedBreaks.
     * @example
     * // Create many PlannedBreaks
     * const plannedBreak = await prisma.plannedBreak.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PlannedBreaks and only return the `id`
     * const plannedBreakWithIdOnly = await prisma.plannedBreak.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlannedBreakCreateManyAndReturnArgs>(args?: SelectSubset<T, PlannedBreakCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlannedBreakPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PlannedBreak.
     * @param {PlannedBreakDeleteArgs} args - Arguments to delete one PlannedBreak.
     * @example
     * // Delete one PlannedBreak
     * const PlannedBreak = await prisma.plannedBreak.delete({
     *   where: {
     *     // ... filter to delete one PlannedBreak
     *   }
     * })
     * 
     */
    delete<T extends PlannedBreakDeleteArgs>(args: SelectSubset<T, PlannedBreakDeleteArgs<ExtArgs>>): Prisma__PlannedBreakClient<$Result.GetResult<Prisma.$PlannedBreakPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PlannedBreak.
     * @param {PlannedBreakUpdateArgs} args - Arguments to update one PlannedBreak.
     * @example
     * // Update one PlannedBreak
     * const plannedBreak = await prisma.plannedBreak.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlannedBreakUpdateArgs>(args: SelectSubset<T, PlannedBreakUpdateArgs<ExtArgs>>): Prisma__PlannedBreakClient<$Result.GetResult<Prisma.$PlannedBreakPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PlannedBreaks.
     * @param {PlannedBreakDeleteManyArgs} args - Arguments to filter PlannedBreaks to delete.
     * @example
     * // Delete a few PlannedBreaks
     * const { count } = await prisma.plannedBreak.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlannedBreakDeleteManyArgs>(args?: SelectSubset<T, PlannedBreakDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PlannedBreaks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlannedBreakUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PlannedBreaks
     * const plannedBreak = await prisma.plannedBreak.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlannedBreakUpdateManyArgs>(args: SelectSubset<T, PlannedBreakUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PlannedBreaks and returns the data updated in the database.
     * @param {PlannedBreakUpdateManyAndReturnArgs} args - Arguments to update many PlannedBreaks.
     * @example
     * // Update many PlannedBreaks
     * const plannedBreak = await prisma.plannedBreak.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PlannedBreaks and only return the `id`
     * const plannedBreakWithIdOnly = await prisma.plannedBreak.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PlannedBreakUpdateManyAndReturnArgs>(args: SelectSubset<T, PlannedBreakUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlannedBreakPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PlannedBreak.
     * @param {PlannedBreakUpsertArgs} args - Arguments to update or create a PlannedBreak.
     * @example
     * // Update or create a PlannedBreak
     * const plannedBreak = await prisma.plannedBreak.upsert({
     *   create: {
     *     // ... data to create a PlannedBreak
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PlannedBreak we want to update
     *   }
     * })
     */
    upsert<T extends PlannedBreakUpsertArgs>(args: SelectSubset<T, PlannedBreakUpsertArgs<ExtArgs>>): Prisma__PlannedBreakClient<$Result.GetResult<Prisma.$PlannedBreakPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PlannedBreaks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlannedBreakCountArgs} args - Arguments to filter PlannedBreaks to count.
     * @example
     * // Count the number of PlannedBreaks
     * const count = await prisma.plannedBreak.count({
     *   where: {
     *     // ... the filter for the PlannedBreaks we want to count
     *   }
     * })
    **/
    count<T extends PlannedBreakCountArgs>(
      args?: Subset<T, PlannedBreakCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlannedBreakCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PlannedBreak.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlannedBreakAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlannedBreakAggregateArgs>(args: Subset<T, PlannedBreakAggregateArgs>): Prisma.PrismaPromise<GetPlannedBreakAggregateType<T>>

    /**
     * Group by PlannedBreak.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlannedBreakGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlannedBreakGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlannedBreakGroupByArgs['orderBy'] }
        : { orderBy?: PlannedBreakGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlannedBreakGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlannedBreakGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PlannedBreak model
   */
  readonly fields: PlannedBreakFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PlannedBreak.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlannedBreakClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    shift<T extends ShiftDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ShiftDefaultArgs<ExtArgs>>): Prisma__ShiftClient<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PlannedBreak model
   */
  interface PlannedBreakFieldRefs {
    readonly id: FieldRef<"PlannedBreak", 'String'>
    readonly start: FieldRef<"PlannedBreak", 'String'>
    readonly end: FieldRef<"PlannedBreak", 'String'>
    readonly type: FieldRef<"PlannedBreak", 'TypeOfBreak'>
    readonly ShiftId: FieldRef<"PlannedBreak", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PlannedBreak findUnique
   */
  export type PlannedBreakFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreak
     */
    select?: PlannedBreakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreak
     */
    omit?: PlannedBreakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakInclude<ExtArgs> | null
    /**
     * Filter, which PlannedBreak to fetch.
     */
    where: PlannedBreakWhereUniqueInput
  }

  /**
   * PlannedBreak findUniqueOrThrow
   */
  export type PlannedBreakFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreak
     */
    select?: PlannedBreakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreak
     */
    omit?: PlannedBreakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakInclude<ExtArgs> | null
    /**
     * Filter, which PlannedBreak to fetch.
     */
    where: PlannedBreakWhereUniqueInput
  }

  /**
   * PlannedBreak findFirst
   */
  export type PlannedBreakFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreak
     */
    select?: PlannedBreakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreak
     */
    omit?: PlannedBreakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakInclude<ExtArgs> | null
    /**
     * Filter, which PlannedBreak to fetch.
     */
    where?: PlannedBreakWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlannedBreaks to fetch.
     */
    orderBy?: PlannedBreakOrderByWithRelationInput | PlannedBreakOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlannedBreaks.
     */
    cursor?: PlannedBreakWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlannedBreaks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlannedBreaks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlannedBreaks.
     */
    distinct?: PlannedBreakScalarFieldEnum | PlannedBreakScalarFieldEnum[]
  }

  /**
   * PlannedBreak findFirstOrThrow
   */
  export type PlannedBreakFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreak
     */
    select?: PlannedBreakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreak
     */
    omit?: PlannedBreakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakInclude<ExtArgs> | null
    /**
     * Filter, which PlannedBreak to fetch.
     */
    where?: PlannedBreakWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlannedBreaks to fetch.
     */
    orderBy?: PlannedBreakOrderByWithRelationInput | PlannedBreakOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlannedBreaks.
     */
    cursor?: PlannedBreakWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlannedBreaks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlannedBreaks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlannedBreaks.
     */
    distinct?: PlannedBreakScalarFieldEnum | PlannedBreakScalarFieldEnum[]
  }

  /**
   * PlannedBreak findMany
   */
  export type PlannedBreakFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreak
     */
    select?: PlannedBreakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreak
     */
    omit?: PlannedBreakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakInclude<ExtArgs> | null
    /**
     * Filter, which PlannedBreaks to fetch.
     */
    where?: PlannedBreakWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlannedBreaks to fetch.
     */
    orderBy?: PlannedBreakOrderByWithRelationInput | PlannedBreakOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PlannedBreaks.
     */
    cursor?: PlannedBreakWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlannedBreaks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlannedBreaks.
     */
    skip?: number
    distinct?: PlannedBreakScalarFieldEnum | PlannedBreakScalarFieldEnum[]
  }

  /**
   * PlannedBreak create
   */
  export type PlannedBreakCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreak
     */
    select?: PlannedBreakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreak
     */
    omit?: PlannedBreakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakInclude<ExtArgs> | null
    /**
     * The data needed to create a PlannedBreak.
     */
    data: XOR<PlannedBreakCreateInput, PlannedBreakUncheckedCreateInput>
  }

  /**
   * PlannedBreak createMany
   */
  export type PlannedBreakCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PlannedBreaks.
     */
    data: PlannedBreakCreateManyInput | PlannedBreakCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PlannedBreak createManyAndReturn
   */
  export type PlannedBreakCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreak
     */
    select?: PlannedBreakSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreak
     */
    omit?: PlannedBreakOmit<ExtArgs> | null
    /**
     * The data used to create many PlannedBreaks.
     */
    data: PlannedBreakCreateManyInput | PlannedBreakCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PlannedBreak update
   */
  export type PlannedBreakUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreak
     */
    select?: PlannedBreakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreak
     */
    omit?: PlannedBreakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakInclude<ExtArgs> | null
    /**
     * The data needed to update a PlannedBreak.
     */
    data: XOR<PlannedBreakUpdateInput, PlannedBreakUncheckedUpdateInput>
    /**
     * Choose, which PlannedBreak to update.
     */
    where: PlannedBreakWhereUniqueInput
  }

  /**
   * PlannedBreak updateMany
   */
  export type PlannedBreakUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PlannedBreaks.
     */
    data: XOR<PlannedBreakUpdateManyMutationInput, PlannedBreakUncheckedUpdateManyInput>
    /**
     * Filter which PlannedBreaks to update
     */
    where?: PlannedBreakWhereInput
    /**
     * Limit how many PlannedBreaks to update.
     */
    limit?: number
  }

  /**
   * PlannedBreak updateManyAndReturn
   */
  export type PlannedBreakUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreak
     */
    select?: PlannedBreakSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreak
     */
    omit?: PlannedBreakOmit<ExtArgs> | null
    /**
     * The data used to update PlannedBreaks.
     */
    data: XOR<PlannedBreakUpdateManyMutationInput, PlannedBreakUncheckedUpdateManyInput>
    /**
     * Filter which PlannedBreaks to update
     */
    where?: PlannedBreakWhereInput
    /**
     * Limit how many PlannedBreaks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PlannedBreak upsert
   */
  export type PlannedBreakUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreak
     */
    select?: PlannedBreakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreak
     */
    omit?: PlannedBreakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakInclude<ExtArgs> | null
    /**
     * The filter to search for the PlannedBreak to update in case it exists.
     */
    where: PlannedBreakWhereUniqueInput
    /**
     * In case the PlannedBreak found by the `where` argument doesn't exist, create a new PlannedBreak with this data.
     */
    create: XOR<PlannedBreakCreateInput, PlannedBreakUncheckedCreateInput>
    /**
     * In case the PlannedBreak was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlannedBreakUpdateInput, PlannedBreakUncheckedUpdateInput>
  }

  /**
   * PlannedBreak delete
   */
  export type PlannedBreakDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreak
     */
    select?: PlannedBreakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreak
     */
    omit?: PlannedBreakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakInclude<ExtArgs> | null
    /**
     * Filter which PlannedBreak to delete.
     */
    where: PlannedBreakWhereUniqueInput
  }

  /**
   * PlannedBreak deleteMany
   */
  export type PlannedBreakDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlannedBreaks to delete
     */
    where?: PlannedBreakWhereInput
    /**
     * Limit how many PlannedBreaks to delete.
     */
    limit?: number
  }

  /**
   * PlannedBreak without action
   */
  export type PlannedBreakDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlannedBreak
     */
    select?: PlannedBreakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlannedBreak
     */
    omit?: PlannedBreakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlannedBreakInclude<ExtArgs> | null
  }


  /**
   * Model Line
   */

  export type AggregateLine = {
    _count: LineCountAggregateOutputType | null
    _min: LineMinAggregateOutputType | null
    _max: LineMaxAggregateOutputType | null
  }

  export type LineMinAggregateOutputType = {
    id: string | null
    name: string | null
    type: string | null
    organizationId: string | null
    userId: string | null
  }

  export type LineMaxAggregateOutputType = {
    id: string | null
    name: string | null
    type: string | null
    organizationId: string | null
    userId: string | null
  }

  export type LineCountAggregateOutputType = {
    id: number
    name: number
    type: number
    organizationId: number
    userId: number
    _all: number
  }


  export type LineMinAggregateInputType = {
    id?: true
    name?: true
    type?: true
    organizationId?: true
    userId?: true
  }

  export type LineMaxAggregateInputType = {
    id?: true
    name?: true
    type?: true
    organizationId?: true
    userId?: true
  }

  export type LineCountAggregateInputType = {
    id?: true
    name?: true
    type?: true
    organizationId?: true
    userId?: true
    _all?: true
  }

  export type LineAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Line to aggregate.
     */
    where?: LineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lines to fetch.
     */
    orderBy?: LineOrderByWithRelationInput | LineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Lines
    **/
    _count?: true | LineCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LineMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LineMaxAggregateInputType
  }

  export type GetLineAggregateType<T extends LineAggregateArgs> = {
        [P in keyof T & keyof AggregateLine]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLine[P]>
      : GetScalarType<T[P], AggregateLine[P]>
  }




  export type LineGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LineWhereInput
    orderBy?: LineOrderByWithAggregationInput | LineOrderByWithAggregationInput[]
    by: LineScalarFieldEnum[] | LineScalarFieldEnum
    having?: LineScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LineCountAggregateInputType | true
    _min?: LineMinAggregateInputType
    _max?: LineMaxAggregateInputType
  }

  export type LineGroupByOutputType = {
    id: string
    name: string
    type: string
    organizationId: string
    userId: string
    _count: LineCountAggregateOutputType | null
    _min: LineMinAggregateOutputType | null
    _max: LineMaxAggregateOutputType | null
  }

  type GetLineGroupByPayload<T extends LineGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LineGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LineGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LineGroupByOutputType[P]>
            : GetScalarType<T[P], LineGroupByOutputType[P]>
        }
      >
    >


  export type LineSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    organizationId?: boolean
    userId?: boolean
    customShifts?: boolean | Line$customShiftsArgs<ExtArgs>
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    shifts?: boolean | Line$shiftsArgs<ExtArgs>
    stations?: boolean | Line$stationsArgs<ExtArgs>
    devices?: boolean | Line$devicesArgs<ExtArgs>
    _count?: boolean | LineCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["line"]>

  export type LineSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    organizationId?: boolean
    userId?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["line"]>

  export type LineSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    organizationId?: boolean
    userId?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["line"]>

  export type LineSelectScalar = {
    id?: boolean
    name?: boolean
    type?: boolean
    organizationId?: boolean
    userId?: boolean
  }

  export type LineOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "type" | "organizationId" | "userId", ExtArgs["result"]["line"]>
  export type LineInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customShifts?: boolean | Line$customShiftsArgs<ExtArgs>
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    shifts?: boolean | Line$shiftsArgs<ExtArgs>
    stations?: boolean | Line$stationsArgs<ExtArgs>
    devices?: boolean | Line$devicesArgs<ExtArgs>
    _count?: boolean | LineCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LineIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type LineIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $LinePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Line"
    objects: {
      customShifts: Prisma.$CustomShiftPayload<ExtArgs>[]
      organization: Prisma.$OrganizationPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
      shifts: Prisma.$ShiftPayload<ExtArgs>[]
      stations: Prisma.$StationPayload<ExtArgs>[]
      devices: Prisma.$DevicePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      type: string
      organizationId: string
      userId: string
    }, ExtArgs["result"]["line"]>
    composites: {}
  }

  type LineGetPayload<S extends boolean | null | undefined | LineDefaultArgs> = $Result.GetResult<Prisma.$LinePayload, S>

  type LineCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LineFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LineCountAggregateInputType | true
    }

  export interface LineDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Line'], meta: { name: 'Line' } }
    /**
     * Find zero or one Line that matches the filter.
     * @param {LineFindUniqueArgs} args - Arguments to find a Line
     * @example
     * // Get one Line
     * const line = await prisma.line.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LineFindUniqueArgs>(args: SelectSubset<T, LineFindUniqueArgs<ExtArgs>>): Prisma__LineClient<$Result.GetResult<Prisma.$LinePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Line that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LineFindUniqueOrThrowArgs} args - Arguments to find a Line
     * @example
     * // Get one Line
     * const line = await prisma.line.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LineFindUniqueOrThrowArgs>(args: SelectSubset<T, LineFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LineClient<$Result.GetResult<Prisma.$LinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Line that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LineFindFirstArgs} args - Arguments to find a Line
     * @example
     * // Get one Line
     * const line = await prisma.line.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LineFindFirstArgs>(args?: SelectSubset<T, LineFindFirstArgs<ExtArgs>>): Prisma__LineClient<$Result.GetResult<Prisma.$LinePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Line that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LineFindFirstOrThrowArgs} args - Arguments to find a Line
     * @example
     * // Get one Line
     * const line = await prisma.line.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LineFindFirstOrThrowArgs>(args?: SelectSubset<T, LineFindFirstOrThrowArgs<ExtArgs>>): Prisma__LineClient<$Result.GetResult<Prisma.$LinePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Lines that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LineFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Lines
     * const lines = await prisma.line.findMany()
     * 
     * // Get first 10 Lines
     * const lines = await prisma.line.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lineWithIdOnly = await prisma.line.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LineFindManyArgs>(args?: SelectSubset<T, LineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Line.
     * @param {LineCreateArgs} args - Arguments to create a Line.
     * @example
     * // Create one Line
     * const Line = await prisma.line.create({
     *   data: {
     *     // ... data to create a Line
     *   }
     * })
     * 
     */
    create<T extends LineCreateArgs>(args: SelectSubset<T, LineCreateArgs<ExtArgs>>): Prisma__LineClient<$Result.GetResult<Prisma.$LinePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Lines.
     * @param {LineCreateManyArgs} args - Arguments to create many Lines.
     * @example
     * // Create many Lines
     * const line = await prisma.line.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LineCreateManyArgs>(args?: SelectSubset<T, LineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Lines and returns the data saved in the database.
     * @param {LineCreateManyAndReturnArgs} args - Arguments to create many Lines.
     * @example
     * // Create many Lines
     * const line = await prisma.line.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Lines and only return the `id`
     * const lineWithIdOnly = await prisma.line.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LineCreateManyAndReturnArgs>(args?: SelectSubset<T, LineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Line.
     * @param {LineDeleteArgs} args - Arguments to delete one Line.
     * @example
     * // Delete one Line
     * const Line = await prisma.line.delete({
     *   where: {
     *     // ... filter to delete one Line
     *   }
     * })
     * 
     */
    delete<T extends LineDeleteArgs>(args: SelectSubset<T, LineDeleteArgs<ExtArgs>>): Prisma__LineClient<$Result.GetResult<Prisma.$LinePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Line.
     * @param {LineUpdateArgs} args - Arguments to update one Line.
     * @example
     * // Update one Line
     * const line = await prisma.line.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LineUpdateArgs>(args: SelectSubset<T, LineUpdateArgs<ExtArgs>>): Prisma__LineClient<$Result.GetResult<Prisma.$LinePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Lines.
     * @param {LineDeleteManyArgs} args - Arguments to filter Lines to delete.
     * @example
     * // Delete a few Lines
     * const { count } = await prisma.line.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LineDeleteManyArgs>(args?: SelectSubset<T, LineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LineUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Lines
     * const line = await prisma.line.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LineUpdateManyArgs>(args: SelectSubset<T, LineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lines and returns the data updated in the database.
     * @param {LineUpdateManyAndReturnArgs} args - Arguments to update many Lines.
     * @example
     * // Update many Lines
     * const line = await prisma.line.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Lines and only return the `id`
     * const lineWithIdOnly = await prisma.line.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LineUpdateManyAndReturnArgs>(args: SelectSubset<T, LineUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Line.
     * @param {LineUpsertArgs} args - Arguments to update or create a Line.
     * @example
     * // Update or create a Line
     * const line = await prisma.line.upsert({
     *   create: {
     *     // ... data to create a Line
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Line we want to update
     *   }
     * })
     */
    upsert<T extends LineUpsertArgs>(args: SelectSubset<T, LineUpsertArgs<ExtArgs>>): Prisma__LineClient<$Result.GetResult<Prisma.$LinePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Lines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LineCountArgs} args - Arguments to filter Lines to count.
     * @example
     * // Count the number of Lines
     * const count = await prisma.line.count({
     *   where: {
     *     // ... the filter for the Lines we want to count
     *   }
     * })
    **/
    count<T extends LineCountArgs>(
      args?: Subset<T, LineCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LineCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Line.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LineAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LineAggregateArgs>(args: Subset<T, LineAggregateArgs>): Prisma.PrismaPromise<GetLineAggregateType<T>>

    /**
     * Group by Line.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LineGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LineGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LineGroupByArgs['orderBy'] }
        : { orderBy?: LineGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Line model
   */
  readonly fields: LineFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Line.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LineClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customShifts<T extends Line$customShiftsArgs<ExtArgs> = {}>(args?: Subset<T, Line$customShiftsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomShiftPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    organization<T extends OrganizationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationDefaultArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    shifts<T extends Line$shiftsArgs<ExtArgs> = {}>(args?: Subset<T, Line$shiftsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    stations<T extends Line$stationsArgs<ExtArgs> = {}>(args?: Subset<T, Line$stationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    devices<T extends Line$devicesArgs<ExtArgs> = {}>(args?: Subset<T, Line$devicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Line model
   */
  interface LineFieldRefs {
    readonly id: FieldRef<"Line", 'String'>
    readonly name: FieldRef<"Line", 'String'>
    readonly type: FieldRef<"Line", 'String'>
    readonly organizationId: FieldRef<"Line", 'String'>
    readonly userId: FieldRef<"Line", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Line findUnique
   */
  export type LineFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Line
     */
    select?: LineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Line
     */
    omit?: LineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LineInclude<ExtArgs> | null
    /**
     * Filter, which Line to fetch.
     */
    where: LineWhereUniqueInput
  }

  /**
   * Line findUniqueOrThrow
   */
  export type LineFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Line
     */
    select?: LineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Line
     */
    omit?: LineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LineInclude<ExtArgs> | null
    /**
     * Filter, which Line to fetch.
     */
    where: LineWhereUniqueInput
  }

  /**
   * Line findFirst
   */
  export type LineFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Line
     */
    select?: LineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Line
     */
    omit?: LineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LineInclude<ExtArgs> | null
    /**
     * Filter, which Line to fetch.
     */
    where?: LineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lines to fetch.
     */
    orderBy?: LineOrderByWithRelationInput | LineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lines.
     */
    cursor?: LineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lines.
     */
    distinct?: LineScalarFieldEnum | LineScalarFieldEnum[]
  }

  /**
   * Line findFirstOrThrow
   */
  export type LineFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Line
     */
    select?: LineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Line
     */
    omit?: LineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LineInclude<ExtArgs> | null
    /**
     * Filter, which Line to fetch.
     */
    where?: LineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lines to fetch.
     */
    orderBy?: LineOrderByWithRelationInput | LineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lines.
     */
    cursor?: LineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lines.
     */
    distinct?: LineScalarFieldEnum | LineScalarFieldEnum[]
  }

  /**
   * Line findMany
   */
  export type LineFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Line
     */
    select?: LineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Line
     */
    omit?: LineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LineInclude<ExtArgs> | null
    /**
     * Filter, which Lines to fetch.
     */
    where?: LineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lines to fetch.
     */
    orderBy?: LineOrderByWithRelationInput | LineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Lines.
     */
    cursor?: LineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lines.
     */
    skip?: number
    distinct?: LineScalarFieldEnum | LineScalarFieldEnum[]
  }

  /**
   * Line create
   */
  export type LineCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Line
     */
    select?: LineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Line
     */
    omit?: LineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LineInclude<ExtArgs> | null
    /**
     * The data needed to create a Line.
     */
    data: XOR<LineCreateInput, LineUncheckedCreateInput>
  }

  /**
   * Line createMany
   */
  export type LineCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Lines.
     */
    data: LineCreateManyInput | LineCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Line createManyAndReturn
   */
  export type LineCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Line
     */
    select?: LineSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Line
     */
    omit?: LineOmit<ExtArgs> | null
    /**
     * The data used to create many Lines.
     */
    data: LineCreateManyInput | LineCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LineIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Line update
   */
  export type LineUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Line
     */
    select?: LineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Line
     */
    omit?: LineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LineInclude<ExtArgs> | null
    /**
     * The data needed to update a Line.
     */
    data: XOR<LineUpdateInput, LineUncheckedUpdateInput>
    /**
     * Choose, which Line to update.
     */
    where: LineWhereUniqueInput
  }

  /**
   * Line updateMany
   */
  export type LineUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Lines.
     */
    data: XOR<LineUpdateManyMutationInput, LineUncheckedUpdateManyInput>
    /**
     * Filter which Lines to update
     */
    where?: LineWhereInput
    /**
     * Limit how many Lines to update.
     */
    limit?: number
  }

  /**
   * Line updateManyAndReturn
   */
  export type LineUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Line
     */
    select?: LineSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Line
     */
    omit?: LineOmit<ExtArgs> | null
    /**
     * The data used to update Lines.
     */
    data: XOR<LineUpdateManyMutationInput, LineUncheckedUpdateManyInput>
    /**
     * Filter which Lines to update
     */
    where?: LineWhereInput
    /**
     * Limit how many Lines to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LineIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Line upsert
   */
  export type LineUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Line
     */
    select?: LineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Line
     */
    omit?: LineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LineInclude<ExtArgs> | null
    /**
     * The filter to search for the Line to update in case it exists.
     */
    where: LineWhereUniqueInput
    /**
     * In case the Line found by the `where` argument doesn't exist, create a new Line with this data.
     */
    create: XOR<LineCreateInput, LineUncheckedCreateInput>
    /**
     * In case the Line was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LineUpdateInput, LineUncheckedUpdateInput>
  }

  /**
   * Line delete
   */
  export type LineDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Line
     */
    select?: LineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Line
     */
    omit?: LineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LineInclude<ExtArgs> | null
    /**
     * Filter which Line to delete.
     */
    where: LineWhereUniqueInput
  }

  /**
   * Line deleteMany
   */
  export type LineDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lines to delete
     */
    where?: LineWhereInput
    /**
     * Limit how many Lines to delete.
     */
    limit?: number
  }

  /**
   * Line.customShifts
   */
  export type Line$customShiftsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomShift
     */
    select?: CustomShiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomShift
     */
    omit?: CustomShiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomShiftInclude<ExtArgs> | null
    where?: CustomShiftWhereInput
    orderBy?: CustomShiftOrderByWithRelationInput | CustomShiftOrderByWithRelationInput[]
    cursor?: CustomShiftWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CustomShiftScalarFieldEnum | CustomShiftScalarFieldEnum[]
  }

  /**
   * Line.shifts
   */
  export type Line$shiftsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shift
     */
    omit?: ShiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftInclude<ExtArgs> | null
    where?: ShiftWhereInput
    orderBy?: ShiftOrderByWithRelationInput | ShiftOrderByWithRelationInput[]
    cursor?: ShiftWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ShiftScalarFieldEnum | ShiftScalarFieldEnum[]
  }

  /**
   * Line.stations
   */
  export type Line$stationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Station
     */
    select?: StationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Station
     */
    omit?: StationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StationInclude<ExtArgs> | null
    where?: StationWhereInput
    orderBy?: StationOrderByWithRelationInput | StationOrderByWithRelationInput[]
    cursor?: StationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StationScalarFieldEnum | StationScalarFieldEnum[]
  }

  /**
   * Line.devices
   */
  export type Line$devicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    where?: DeviceWhereInput
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    cursor?: DeviceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * Line without action
   */
  export type LineDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Line
     */
    select?: LineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Line
     */
    omit?: LineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LineInclude<ExtArgs> | null
  }


  /**
   * Model Station
   */

  export type AggregateStation = {
    _count: StationCountAggregateOutputType | null
    _min: StationMinAggregateOutputType | null
    _max: StationMaxAggregateOutputType | null
  }

  export type StationMinAggregateOutputType = {
    id: string | null
    name: string | null
    isCritical: boolean | null
    lineId: string | null
  }

  export type StationMaxAggregateOutputType = {
    id: string | null
    name: string | null
    isCritical: boolean | null
    lineId: string | null
  }

  export type StationCountAggregateOutputType = {
    id: number
    name: number
    isCritical: number
    lineId: number
    _all: number
  }


  export type StationMinAggregateInputType = {
    id?: true
    name?: true
    isCritical?: true
    lineId?: true
  }

  export type StationMaxAggregateInputType = {
    id?: true
    name?: true
    isCritical?: true
    lineId?: true
  }

  export type StationCountAggregateInputType = {
    id?: true
    name?: true
    isCritical?: true
    lineId?: true
    _all?: true
  }

  export type StationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Station to aggregate.
     */
    where?: StationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stations to fetch.
     */
    orderBy?: StationOrderByWithRelationInput | StationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Stations
    **/
    _count?: true | StationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StationMaxAggregateInputType
  }

  export type GetStationAggregateType<T extends StationAggregateArgs> = {
        [P in keyof T & keyof AggregateStation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStation[P]>
      : GetScalarType<T[P], AggregateStation[P]>
  }




  export type StationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StationWhereInput
    orderBy?: StationOrderByWithAggregationInput | StationOrderByWithAggregationInput[]
    by: StationScalarFieldEnum[] | StationScalarFieldEnum
    having?: StationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StationCountAggregateInputType | true
    _min?: StationMinAggregateInputType
    _max?: StationMaxAggregateInputType
  }

  export type StationGroupByOutputType = {
    id: string
    name: string
    isCritical: boolean
    lineId: string
    _count: StationCountAggregateOutputType | null
    _min: StationMinAggregateOutputType | null
    _max: StationMaxAggregateOutputType | null
  }

  type GetStationGroupByPayload<T extends StationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StationGroupByOutputType[P]>
            : GetScalarType<T[P], StationGroupByOutputType[P]>
        }
      >
    >


  export type StationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isCritical?: boolean
    lineId?: boolean
    line?: boolean | LineDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["station"]>

  export type StationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isCritical?: boolean
    lineId?: boolean
    line?: boolean | LineDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["station"]>

  export type StationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isCritical?: boolean
    lineId?: boolean
    line?: boolean | LineDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["station"]>

  export type StationSelectScalar = {
    id?: boolean
    name?: boolean
    isCritical?: boolean
    lineId?: boolean
  }

  export type StationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "isCritical" | "lineId", ExtArgs["result"]["station"]>
  export type StationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    line?: boolean | LineDefaultArgs<ExtArgs>
  }
  export type StationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    line?: boolean | LineDefaultArgs<ExtArgs>
  }
  export type StationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    line?: boolean | LineDefaultArgs<ExtArgs>
  }

  export type $StationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Station"
    objects: {
      line: Prisma.$LinePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      isCritical: boolean
      lineId: string
    }, ExtArgs["result"]["station"]>
    composites: {}
  }

  type StationGetPayload<S extends boolean | null | undefined | StationDefaultArgs> = $Result.GetResult<Prisma.$StationPayload, S>

  type StationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StationCountAggregateInputType | true
    }

  export interface StationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Station'], meta: { name: 'Station' } }
    /**
     * Find zero or one Station that matches the filter.
     * @param {StationFindUniqueArgs} args - Arguments to find a Station
     * @example
     * // Get one Station
     * const station = await prisma.station.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StationFindUniqueArgs>(args: SelectSubset<T, StationFindUniqueArgs<ExtArgs>>): Prisma__StationClient<$Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Station that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StationFindUniqueOrThrowArgs} args - Arguments to find a Station
     * @example
     * // Get one Station
     * const station = await prisma.station.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StationFindUniqueOrThrowArgs>(args: SelectSubset<T, StationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StationClient<$Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Station that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StationFindFirstArgs} args - Arguments to find a Station
     * @example
     * // Get one Station
     * const station = await prisma.station.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StationFindFirstArgs>(args?: SelectSubset<T, StationFindFirstArgs<ExtArgs>>): Prisma__StationClient<$Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Station that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StationFindFirstOrThrowArgs} args - Arguments to find a Station
     * @example
     * // Get one Station
     * const station = await prisma.station.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StationFindFirstOrThrowArgs>(args?: SelectSubset<T, StationFindFirstOrThrowArgs<ExtArgs>>): Prisma__StationClient<$Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Stations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Stations
     * const stations = await prisma.station.findMany()
     * 
     * // Get first 10 Stations
     * const stations = await prisma.station.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const stationWithIdOnly = await prisma.station.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StationFindManyArgs>(args?: SelectSubset<T, StationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Station.
     * @param {StationCreateArgs} args - Arguments to create a Station.
     * @example
     * // Create one Station
     * const Station = await prisma.station.create({
     *   data: {
     *     // ... data to create a Station
     *   }
     * })
     * 
     */
    create<T extends StationCreateArgs>(args: SelectSubset<T, StationCreateArgs<ExtArgs>>): Prisma__StationClient<$Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Stations.
     * @param {StationCreateManyArgs} args - Arguments to create many Stations.
     * @example
     * // Create many Stations
     * const station = await prisma.station.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StationCreateManyArgs>(args?: SelectSubset<T, StationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Stations and returns the data saved in the database.
     * @param {StationCreateManyAndReturnArgs} args - Arguments to create many Stations.
     * @example
     * // Create many Stations
     * const station = await prisma.station.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Stations and only return the `id`
     * const stationWithIdOnly = await prisma.station.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StationCreateManyAndReturnArgs>(args?: SelectSubset<T, StationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Station.
     * @param {StationDeleteArgs} args - Arguments to delete one Station.
     * @example
     * // Delete one Station
     * const Station = await prisma.station.delete({
     *   where: {
     *     // ... filter to delete one Station
     *   }
     * })
     * 
     */
    delete<T extends StationDeleteArgs>(args: SelectSubset<T, StationDeleteArgs<ExtArgs>>): Prisma__StationClient<$Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Station.
     * @param {StationUpdateArgs} args - Arguments to update one Station.
     * @example
     * // Update one Station
     * const station = await prisma.station.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StationUpdateArgs>(args: SelectSubset<T, StationUpdateArgs<ExtArgs>>): Prisma__StationClient<$Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Stations.
     * @param {StationDeleteManyArgs} args - Arguments to filter Stations to delete.
     * @example
     * // Delete a few Stations
     * const { count } = await prisma.station.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StationDeleteManyArgs>(args?: SelectSubset<T, StationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Stations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Stations
     * const station = await prisma.station.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StationUpdateManyArgs>(args: SelectSubset<T, StationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Stations and returns the data updated in the database.
     * @param {StationUpdateManyAndReturnArgs} args - Arguments to update many Stations.
     * @example
     * // Update many Stations
     * const station = await prisma.station.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Stations and only return the `id`
     * const stationWithIdOnly = await prisma.station.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StationUpdateManyAndReturnArgs>(args: SelectSubset<T, StationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Station.
     * @param {StationUpsertArgs} args - Arguments to update or create a Station.
     * @example
     * // Update or create a Station
     * const station = await prisma.station.upsert({
     *   create: {
     *     // ... data to create a Station
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Station we want to update
     *   }
     * })
     */
    upsert<T extends StationUpsertArgs>(args: SelectSubset<T, StationUpsertArgs<ExtArgs>>): Prisma__StationClient<$Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Stations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StationCountArgs} args - Arguments to filter Stations to count.
     * @example
     * // Count the number of Stations
     * const count = await prisma.station.count({
     *   where: {
     *     // ... the filter for the Stations we want to count
     *   }
     * })
    **/
    count<T extends StationCountArgs>(
      args?: Subset<T, StationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Station.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StationAggregateArgs>(args: Subset<T, StationAggregateArgs>): Prisma.PrismaPromise<GetStationAggregateType<T>>

    /**
     * Group by Station.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StationGroupByArgs['orderBy'] }
        : { orderBy?: StationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Station model
   */
  readonly fields: StationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Station.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    line<T extends LineDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LineDefaultArgs<ExtArgs>>): Prisma__LineClient<$Result.GetResult<Prisma.$LinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Station model
   */
  interface StationFieldRefs {
    readonly id: FieldRef<"Station", 'String'>
    readonly name: FieldRef<"Station", 'String'>
    readonly isCritical: FieldRef<"Station", 'Boolean'>
    readonly lineId: FieldRef<"Station", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Station findUnique
   */
  export type StationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Station
     */
    select?: StationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Station
     */
    omit?: StationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StationInclude<ExtArgs> | null
    /**
     * Filter, which Station to fetch.
     */
    where: StationWhereUniqueInput
  }

  /**
   * Station findUniqueOrThrow
   */
  export type StationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Station
     */
    select?: StationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Station
     */
    omit?: StationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StationInclude<ExtArgs> | null
    /**
     * Filter, which Station to fetch.
     */
    where: StationWhereUniqueInput
  }

  /**
   * Station findFirst
   */
  export type StationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Station
     */
    select?: StationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Station
     */
    omit?: StationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StationInclude<ExtArgs> | null
    /**
     * Filter, which Station to fetch.
     */
    where?: StationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stations to fetch.
     */
    orderBy?: StationOrderByWithRelationInput | StationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Stations.
     */
    cursor?: StationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Stations.
     */
    distinct?: StationScalarFieldEnum | StationScalarFieldEnum[]
  }

  /**
   * Station findFirstOrThrow
   */
  export type StationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Station
     */
    select?: StationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Station
     */
    omit?: StationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StationInclude<ExtArgs> | null
    /**
     * Filter, which Station to fetch.
     */
    where?: StationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stations to fetch.
     */
    orderBy?: StationOrderByWithRelationInput | StationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Stations.
     */
    cursor?: StationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Stations.
     */
    distinct?: StationScalarFieldEnum | StationScalarFieldEnum[]
  }

  /**
   * Station findMany
   */
  export type StationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Station
     */
    select?: StationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Station
     */
    omit?: StationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StationInclude<ExtArgs> | null
    /**
     * Filter, which Stations to fetch.
     */
    where?: StationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stations to fetch.
     */
    orderBy?: StationOrderByWithRelationInput | StationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Stations.
     */
    cursor?: StationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stations.
     */
    skip?: number
    distinct?: StationScalarFieldEnum | StationScalarFieldEnum[]
  }

  /**
   * Station create
   */
  export type StationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Station
     */
    select?: StationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Station
     */
    omit?: StationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StationInclude<ExtArgs> | null
    /**
     * The data needed to create a Station.
     */
    data: XOR<StationCreateInput, StationUncheckedCreateInput>
  }

  /**
   * Station createMany
   */
  export type StationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Stations.
     */
    data: StationCreateManyInput | StationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Station createManyAndReturn
   */
  export type StationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Station
     */
    select?: StationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Station
     */
    omit?: StationOmit<ExtArgs> | null
    /**
     * The data used to create many Stations.
     */
    data: StationCreateManyInput | StationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Station update
   */
  export type StationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Station
     */
    select?: StationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Station
     */
    omit?: StationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StationInclude<ExtArgs> | null
    /**
     * The data needed to update a Station.
     */
    data: XOR<StationUpdateInput, StationUncheckedUpdateInput>
    /**
     * Choose, which Station to update.
     */
    where: StationWhereUniqueInput
  }

  /**
   * Station updateMany
   */
  export type StationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Stations.
     */
    data: XOR<StationUpdateManyMutationInput, StationUncheckedUpdateManyInput>
    /**
     * Filter which Stations to update
     */
    where?: StationWhereInput
    /**
     * Limit how many Stations to update.
     */
    limit?: number
  }

  /**
   * Station updateManyAndReturn
   */
  export type StationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Station
     */
    select?: StationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Station
     */
    omit?: StationOmit<ExtArgs> | null
    /**
     * The data used to update Stations.
     */
    data: XOR<StationUpdateManyMutationInput, StationUncheckedUpdateManyInput>
    /**
     * Filter which Stations to update
     */
    where?: StationWhereInput
    /**
     * Limit how many Stations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Station upsert
   */
  export type StationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Station
     */
    select?: StationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Station
     */
    omit?: StationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StationInclude<ExtArgs> | null
    /**
     * The filter to search for the Station to update in case it exists.
     */
    where: StationWhereUniqueInput
    /**
     * In case the Station found by the `where` argument doesn't exist, create a new Station with this data.
     */
    create: XOR<StationCreateInput, StationUncheckedCreateInput>
    /**
     * In case the Station was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StationUpdateInput, StationUncheckedUpdateInput>
  }

  /**
   * Station delete
   */
  export type StationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Station
     */
    select?: StationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Station
     */
    omit?: StationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StationInclude<ExtArgs> | null
    /**
     * Filter which Station to delete.
     */
    where: StationWhereUniqueInput
  }

  /**
   * Station deleteMany
   */
  export type StationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Stations to delete
     */
    where?: StationWhereInput
    /**
     * Limit how many Stations to delete.
     */
    limit?: number
  }

  /**
   * Station without action
   */
  export type StationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Station
     */
    select?: StationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Station
     */
    omit?: StationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StationInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: $Enums.Role | null
    status: $Enums.Status | null
    createdAt: Date | null
    address: string | null
    phoneNumber: string | null
    lastLogin: Date | null
    organizationId: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: $Enums.Role | null
    status: $Enums.Status | null
    createdAt: Date | null
    address: string | null
    phoneNumber: string | null
    lastLogin: Date | null
    organizationId: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    role: number
    status: number
    createdAt: number
    address: number
    phoneNumber: number
    lastLogin: number
    organizationId: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    status?: true
    createdAt?: true
    address?: true
    phoneNumber?: true
    lastLogin?: true
    organizationId?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    status?: true
    createdAt?: true
    address?: true
    phoneNumber?: true
    lastLogin?: true
    organizationId?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    status?: true
    createdAt?: true
    address?: true
    phoneNumber?: true
    lastLogin?: true
    organizationId?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    password: string
    role: $Enums.Role
    status: $Enums.Status
    createdAt: Date
    address: string
    phoneNumber: string
    lastLogin: Date | null
    organizationId: string
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    address?: boolean
    phoneNumber?: boolean
    lastLogin?: boolean
    organizationId?: boolean
    lines?: boolean | User$linesArgs<ExtArgs>
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    address?: boolean
    phoneNumber?: boolean
    lastLogin?: boolean
    organizationId?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    address?: boolean
    phoneNumber?: boolean
    lastLogin?: boolean
    organizationId?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    address?: boolean
    phoneNumber?: boolean
    lastLogin?: boolean
    organizationId?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "password" | "role" | "status" | "createdAt" | "address" | "phoneNumber" | "lastLogin" | "organizationId", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lines?: boolean | User$linesArgs<ExtArgs>
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      lines: Prisma.$LinePayload<ExtArgs>[]
      organization: Prisma.$OrganizationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      password: string
      role: $Enums.Role
      status: $Enums.Status
      createdAt: Date
      address: string
      phoneNumber: string
      lastLogin: Date | null
      organizationId: string
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lines<T extends User$linesArgs<ExtArgs> = {}>(args?: Subset<T, User$linesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    organization<T extends OrganizationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationDefaultArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly status: FieldRef<"User", 'Status'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly address: FieldRef<"User", 'String'>
    readonly phoneNumber: FieldRef<"User", 'String'>
    readonly lastLogin: FieldRef<"User", 'DateTime'>
    readonly organizationId: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.lines
   */
  export type User$linesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Line
     */
    select?: LineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Line
     */
    omit?: LineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LineInclude<ExtArgs> | null
    where?: LineWhereInput
    orderBy?: LineOrderByWithRelationInput | LineOrderByWithRelationInput[]
    cursor?: LineWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LineScalarFieldEnum | LineScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Device
   */

  export type AggregateDevice = {
    _count: DeviceCountAggregateOutputType | null
    _min: DeviceMinAggregateOutputType | null
    _max: DeviceMaxAggregateOutputType | null
  }

  export type DeviceMinAggregateOutputType = {
    id: string | null
    name: string | null
    type: string | null
    organizationId: string | null
    lineId: string | null
    status: $Enums.DeviceStatus | null
  }

  export type DeviceMaxAggregateOutputType = {
    id: string | null
    name: string | null
    type: string | null
    organizationId: string | null
    lineId: string | null
    status: $Enums.DeviceStatus | null
  }

  export type DeviceCountAggregateOutputType = {
    id: number
    name: number
    type: number
    organizationId: number
    lineId: number
    status: number
    _all: number
  }


  export type DeviceMinAggregateInputType = {
    id?: true
    name?: true
    type?: true
    organizationId?: true
    lineId?: true
    status?: true
  }

  export type DeviceMaxAggregateInputType = {
    id?: true
    name?: true
    type?: true
    organizationId?: true
    lineId?: true
    status?: true
  }

  export type DeviceCountAggregateInputType = {
    id?: true
    name?: true
    type?: true
    organizationId?: true
    lineId?: true
    status?: true
    _all?: true
  }

  export type DeviceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Device to aggregate.
     */
    where?: DeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Devices to fetch.
     */
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Devices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Devices
    **/
    _count?: true | DeviceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DeviceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DeviceMaxAggregateInputType
  }

  export type GetDeviceAggregateType<T extends DeviceAggregateArgs> = {
        [P in keyof T & keyof AggregateDevice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDevice[P]>
      : GetScalarType<T[P], AggregateDevice[P]>
  }




  export type DeviceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeviceWhereInput
    orderBy?: DeviceOrderByWithAggregationInput | DeviceOrderByWithAggregationInput[]
    by: DeviceScalarFieldEnum[] | DeviceScalarFieldEnum
    having?: DeviceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DeviceCountAggregateInputType | true
    _min?: DeviceMinAggregateInputType
    _max?: DeviceMaxAggregateInputType
  }

  export type DeviceGroupByOutputType = {
    id: string
    name: string
    type: string
    organizationId: string
    lineId: string
    status: $Enums.DeviceStatus
    _count: DeviceCountAggregateOutputType | null
    _min: DeviceMinAggregateOutputType | null
    _max: DeviceMaxAggregateOutputType | null
  }

  type GetDeviceGroupByPayload<T extends DeviceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DeviceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DeviceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DeviceGroupByOutputType[P]>
            : GetScalarType<T[P], DeviceGroupByOutputType[P]>
        }
      >
    >


  export type DeviceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    organizationId?: boolean
    lineId?: boolean
    status?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    line?: boolean | LineDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["device"]>

  export type DeviceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    organizationId?: boolean
    lineId?: boolean
    status?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    line?: boolean | LineDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["device"]>

  export type DeviceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    organizationId?: boolean
    lineId?: boolean
    status?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    line?: boolean | LineDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["device"]>

  export type DeviceSelectScalar = {
    id?: boolean
    name?: boolean
    type?: boolean
    organizationId?: boolean
    lineId?: boolean
    status?: boolean
  }

  export type DeviceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "type" | "organizationId" | "lineId" | "status", ExtArgs["result"]["device"]>
  export type DeviceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    line?: boolean | LineDefaultArgs<ExtArgs>
  }
  export type DeviceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    line?: boolean | LineDefaultArgs<ExtArgs>
  }
  export type DeviceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    line?: boolean | LineDefaultArgs<ExtArgs>
  }

  export type $DevicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Device"
    objects: {
      organization: Prisma.$OrganizationPayload<ExtArgs>
      line: Prisma.$LinePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      type: string
      organizationId: string
      lineId: string
      status: $Enums.DeviceStatus
    }, ExtArgs["result"]["device"]>
    composites: {}
  }

  type DeviceGetPayload<S extends boolean | null | undefined | DeviceDefaultArgs> = $Result.GetResult<Prisma.$DevicePayload, S>

  type DeviceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DeviceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DeviceCountAggregateInputType | true
    }

  export interface DeviceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Device'], meta: { name: 'Device' } }
    /**
     * Find zero or one Device that matches the filter.
     * @param {DeviceFindUniqueArgs} args - Arguments to find a Device
     * @example
     * // Get one Device
     * const device = await prisma.device.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DeviceFindUniqueArgs>(args: SelectSubset<T, DeviceFindUniqueArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Device that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DeviceFindUniqueOrThrowArgs} args - Arguments to find a Device
     * @example
     * // Get one Device
     * const device = await prisma.device.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DeviceFindUniqueOrThrowArgs>(args: SelectSubset<T, DeviceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Device that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceFindFirstArgs} args - Arguments to find a Device
     * @example
     * // Get one Device
     * const device = await prisma.device.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DeviceFindFirstArgs>(args?: SelectSubset<T, DeviceFindFirstArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Device that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceFindFirstOrThrowArgs} args - Arguments to find a Device
     * @example
     * // Get one Device
     * const device = await prisma.device.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DeviceFindFirstOrThrowArgs>(args?: SelectSubset<T, DeviceFindFirstOrThrowArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Devices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Devices
     * const devices = await prisma.device.findMany()
     * 
     * // Get first 10 Devices
     * const devices = await prisma.device.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const deviceWithIdOnly = await prisma.device.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DeviceFindManyArgs>(args?: SelectSubset<T, DeviceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Device.
     * @param {DeviceCreateArgs} args - Arguments to create a Device.
     * @example
     * // Create one Device
     * const Device = await prisma.device.create({
     *   data: {
     *     // ... data to create a Device
     *   }
     * })
     * 
     */
    create<T extends DeviceCreateArgs>(args: SelectSubset<T, DeviceCreateArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Devices.
     * @param {DeviceCreateManyArgs} args - Arguments to create many Devices.
     * @example
     * // Create many Devices
     * const device = await prisma.device.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DeviceCreateManyArgs>(args?: SelectSubset<T, DeviceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Devices and returns the data saved in the database.
     * @param {DeviceCreateManyAndReturnArgs} args - Arguments to create many Devices.
     * @example
     * // Create many Devices
     * const device = await prisma.device.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Devices and only return the `id`
     * const deviceWithIdOnly = await prisma.device.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DeviceCreateManyAndReturnArgs>(args?: SelectSubset<T, DeviceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Device.
     * @param {DeviceDeleteArgs} args - Arguments to delete one Device.
     * @example
     * // Delete one Device
     * const Device = await prisma.device.delete({
     *   where: {
     *     // ... filter to delete one Device
     *   }
     * })
     * 
     */
    delete<T extends DeviceDeleteArgs>(args: SelectSubset<T, DeviceDeleteArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Device.
     * @param {DeviceUpdateArgs} args - Arguments to update one Device.
     * @example
     * // Update one Device
     * const device = await prisma.device.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DeviceUpdateArgs>(args: SelectSubset<T, DeviceUpdateArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Devices.
     * @param {DeviceDeleteManyArgs} args - Arguments to filter Devices to delete.
     * @example
     * // Delete a few Devices
     * const { count } = await prisma.device.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DeviceDeleteManyArgs>(args?: SelectSubset<T, DeviceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Devices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Devices
     * const device = await prisma.device.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DeviceUpdateManyArgs>(args: SelectSubset<T, DeviceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Devices and returns the data updated in the database.
     * @param {DeviceUpdateManyAndReturnArgs} args - Arguments to update many Devices.
     * @example
     * // Update many Devices
     * const device = await prisma.device.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Devices and only return the `id`
     * const deviceWithIdOnly = await prisma.device.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DeviceUpdateManyAndReturnArgs>(args: SelectSubset<T, DeviceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Device.
     * @param {DeviceUpsertArgs} args - Arguments to update or create a Device.
     * @example
     * // Update or create a Device
     * const device = await prisma.device.upsert({
     *   create: {
     *     // ... data to create a Device
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Device we want to update
     *   }
     * })
     */
    upsert<T extends DeviceUpsertArgs>(args: SelectSubset<T, DeviceUpsertArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Devices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceCountArgs} args - Arguments to filter Devices to count.
     * @example
     * // Count the number of Devices
     * const count = await prisma.device.count({
     *   where: {
     *     // ... the filter for the Devices we want to count
     *   }
     * })
    **/
    count<T extends DeviceCountArgs>(
      args?: Subset<T, DeviceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DeviceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Device.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DeviceAggregateArgs>(args: Subset<T, DeviceAggregateArgs>): Prisma.PrismaPromise<GetDeviceAggregateType<T>>

    /**
     * Group by Device.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DeviceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DeviceGroupByArgs['orderBy'] }
        : { orderBy?: DeviceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DeviceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeviceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Device model
   */
  readonly fields: DeviceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Device.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DeviceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organization<T extends OrganizationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationDefaultArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    line<T extends LineDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LineDefaultArgs<ExtArgs>>): Prisma__LineClient<$Result.GetResult<Prisma.$LinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Device model
   */
  interface DeviceFieldRefs {
    readonly id: FieldRef<"Device", 'String'>
    readonly name: FieldRef<"Device", 'String'>
    readonly type: FieldRef<"Device", 'String'>
    readonly organizationId: FieldRef<"Device", 'String'>
    readonly lineId: FieldRef<"Device", 'String'>
    readonly status: FieldRef<"Device", 'DeviceStatus'>
  }
    

  // Custom InputTypes
  /**
   * Device findUnique
   */
  export type DeviceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Device to fetch.
     */
    where: DeviceWhereUniqueInput
  }

  /**
   * Device findUniqueOrThrow
   */
  export type DeviceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Device to fetch.
     */
    where: DeviceWhereUniqueInput
  }

  /**
   * Device findFirst
   */
  export type DeviceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Device to fetch.
     */
    where?: DeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Devices to fetch.
     */
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Devices.
     */
    cursor?: DeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Devices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Devices.
     */
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * Device findFirstOrThrow
   */
  export type DeviceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Device to fetch.
     */
    where?: DeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Devices to fetch.
     */
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Devices.
     */
    cursor?: DeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Devices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Devices.
     */
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * Device findMany
   */
  export type DeviceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Devices to fetch.
     */
    where?: DeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Devices to fetch.
     */
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Devices.
     */
    cursor?: DeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Devices.
     */
    skip?: number
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * Device create
   */
  export type DeviceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * The data needed to create a Device.
     */
    data: XOR<DeviceCreateInput, DeviceUncheckedCreateInput>
  }

  /**
   * Device createMany
   */
  export type DeviceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Devices.
     */
    data: DeviceCreateManyInput | DeviceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Device createManyAndReturn
   */
  export type DeviceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * The data used to create many Devices.
     */
    data: DeviceCreateManyInput | DeviceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Device update
   */
  export type DeviceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * The data needed to update a Device.
     */
    data: XOR<DeviceUpdateInput, DeviceUncheckedUpdateInput>
    /**
     * Choose, which Device to update.
     */
    where: DeviceWhereUniqueInput
  }

  /**
   * Device updateMany
   */
  export type DeviceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Devices.
     */
    data: XOR<DeviceUpdateManyMutationInput, DeviceUncheckedUpdateManyInput>
    /**
     * Filter which Devices to update
     */
    where?: DeviceWhereInput
    /**
     * Limit how many Devices to update.
     */
    limit?: number
  }

  /**
   * Device updateManyAndReturn
   */
  export type DeviceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * The data used to update Devices.
     */
    data: XOR<DeviceUpdateManyMutationInput, DeviceUncheckedUpdateManyInput>
    /**
     * Filter which Devices to update
     */
    where?: DeviceWhereInput
    /**
     * Limit how many Devices to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Device upsert
   */
  export type DeviceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * The filter to search for the Device to update in case it exists.
     */
    where: DeviceWhereUniqueInput
    /**
     * In case the Device found by the `where` argument doesn't exist, create a new Device with this data.
     */
    create: XOR<DeviceCreateInput, DeviceUncheckedCreateInput>
    /**
     * In case the Device was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DeviceUpdateInput, DeviceUncheckedUpdateInput>
  }

  /**
   * Device delete
   */
  export type DeviceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter which Device to delete.
     */
    where: DeviceWhereUniqueInput
  }

  /**
   * Device deleteMany
   */
  export type DeviceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Devices to delete
     */
    where?: DeviceWhereInput
    /**
     * Limit how many Devices to delete.
     */
    limit?: number
  }

  /**
   * Device without action
   */
  export type DeviceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const OrganizationScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    address: 'address',
    phoneNumber: 'phoneNumber',
    imageUrl: 'imageUrl',
    shiftNumber: 'shiftNumber',
    unit: 'unit',
    Department: 'Department',
    Desingation: 'Desingation'
  };

  export type OrganizationScalarFieldEnum = (typeof OrganizationScalarFieldEnum)[keyof typeof OrganizationScalarFieldEnum]


  export const ShiftScalarFieldEnum: {
    id: 'id',
    start: 'start',
    end: 'end',
    organizationId: 'organizationId'
  };

  export type ShiftScalarFieldEnum = (typeof ShiftScalarFieldEnum)[keyof typeof ShiftScalarFieldEnum]


  export const CustomShiftScalarFieldEnum: {
    id: 'id',
    start: 'start',
    end: 'end',
    lineId: 'lineId'
  };

  export type CustomShiftScalarFieldEnum = (typeof CustomShiftScalarFieldEnum)[keyof typeof CustomShiftScalarFieldEnum]


  export const PlannedBreakCustomScalarFieldEnum: {
    id: 'id',
    start: 'start',
    end: 'end',
    typeOfBreak: 'typeOfBreak',
    customShiftTimingId: 'customShiftTimingId'
  };

  export type PlannedBreakCustomScalarFieldEnum = (typeof PlannedBreakCustomScalarFieldEnum)[keyof typeof PlannedBreakCustomScalarFieldEnum]


  export const PlannedBreakScalarFieldEnum: {
    id: 'id',
    start: 'start',
    end: 'end',
    type: 'type',
    ShiftId: 'ShiftId'
  };

  export type PlannedBreakScalarFieldEnum = (typeof PlannedBreakScalarFieldEnum)[keyof typeof PlannedBreakScalarFieldEnum]


  export const LineScalarFieldEnum: {
    id: 'id',
    name: 'name',
    type: 'type',
    organizationId: 'organizationId',
    userId: 'userId'
  };

  export type LineScalarFieldEnum = (typeof LineScalarFieldEnum)[keyof typeof LineScalarFieldEnum]


  export const StationScalarFieldEnum: {
    id: 'id',
    name: 'name',
    isCritical: 'isCritical',
    lineId: 'lineId'
  };

  export type StationScalarFieldEnum = (typeof StationScalarFieldEnum)[keyof typeof StationScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role',
    status: 'status',
    createdAt: 'createdAt',
    address: 'address',
    phoneNumber: 'phoneNumber',
    lastLogin: 'lastLogin',
    organizationId: 'organizationId'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const DeviceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    type: 'type',
    organizationId: 'organizationId',
    lineId: 'lineId',
    status: 'status'
  };

  export type DeviceScalarFieldEnum = (typeof DeviceScalarFieldEnum)[keyof typeof DeviceScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'TypeOfBreak'
   */
  export type EnumTypeOfBreakFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TypeOfBreak'>
    


  /**
   * Reference to a field of type 'TypeOfBreak[]'
   */
  export type ListEnumTypeOfBreakFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TypeOfBreak[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'Status'
   */
  export type EnumStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Status'>
    


  /**
   * Reference to a field of type 'Status[]'
   */
  export type ListEnumStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Status[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'DeviceStatus'
   */
  export type EnumDeviceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeviceStatus'>
    


  /**
   * Reference to a field of type 'DeviceStatus[]'
   */
  export type ListEnumDeviceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeviceStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type OrganizationWhereInput = {
    AND?: OrganizationWhereInput | OrganizationWhereInput[]
    OR?: OrganizationWhereInput[]
    NOT?: OrganizationWhereInput | OrganizationWhereInput[]
    id?: StringFilter<"Organization"> | string
    name?: StringFilter<"Organization"> | string
    email?: StringFilter<"Organization"> | string
    address?: StringFilter<"Organization"> | string
    phoneNumber?: StringFilter<"Organization"> | string
    imageUrl?: StringNullableFilter<"Organization"> | string | null
    shiftNumber?: IntFilter<"Organization"> | number
    unit?: StringFilter<"Organization"> | string
    Department?: StringFilter<"Organization"> | string
    Desingation?: StringFilter<"Organization"> | string
    shifts?: ShiftListRelationFilter
    users?: UserListRelationFilter
    devices?: DeviceListRelationFilter
    lines?: LineListRelationFilter
  }

  export type OrganizationOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    address?: SortOrder
    phoneNumber?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    shiftNumber?: SortOrder
    unit?: SortOrder
    Department?: SortOrder
    Desingation?: SortOrder
    shifts?: ShiftOrderByRelationAggregateInput
    users?: UserOrderByRelationAggregateInput
    devices?: DeviceOrderByRelationAggregateInput
    lines?: LineOrderByRelationAggregateInput
  }

  export type OrganizationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: OrganizationWhereInput | OrganizationWhereInput[]
    OR?: OrganizationWhereInput[]
    NOT?: OrganizationWhereInput | OrganizationWhereInput[]
    name?: StringFilter<"Organization"> | string
    address?: StringFilter<"Organization"> | string
    phoneNumber?: StringFilter<"Organization"> | string
    imageUrl?: StringNullableFilter<"Organization"> | string | null
    shiftNumber?: IntFilter<"Organization"> | number
    unit?: StringFilter<"Organization"> | string
    Department?: StringFilter<"Organization"> | string
    Desingation?: StringFilter<"Organization"> | string
    shifts?: ShiftListRelationFilter
    users?: UserListRelationFilter
    devices?: DeviceListRelationFilter
    lines?: LineListRelationFilter
  }, "id" | "email">

  export type OrganizationOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    address?: SortOrder
    phoneNumber?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    shiftNumber?: SortOrder
    unit?: SortOrder
    Department?: SortOrder
    Desingation?: SortOrder
    _count?: OrganizationCountOrderByAggregateInput
    _avg?: OrganizationAvgOrderByAggregateInput
    _max?: OrganizationMaxOrderByAggregateInput
    _min?: OrganizationMinOrderByAggregateInput
    _sum?: OrganizationSumOrderByAggregateInput
  }

  export type OrganizationScalarWhereWithAggregatesInput = {
    AND?: OrganizationScalarWhereWithAggregatesInput | OrganizationScalarWhereWithAggregatesInput[]
    OR?: OrganizationScalarWhereWithAggregatesInput[]
    NOT?: OrganizationScalarWhereWithAggregatesInput | OrganizationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Organization"> | string
    name?: StringWithAggregatesFilter<"Organization"> | string
    email?: StringWithAggregatesFilter<"Organization"> | string
    address?: StringWithAggregatesFilter<"Organization"> | string
    phoneNumber?: StringWithAggregatesFilter<"Organization"> | string
    imageUrl?: StringNullableWithAggregatesFilter<"Organization"> | string | null
    shiftNumber?: IntWithAggregatesFilter<"Organization"> | number
    unit?: StringWithAggregatesFilter<"Organization"> | string
    Department?: StringWithAggregatesFilter<"Organization"> | string
    Desingation?: StringWithAggregatesFilter<"Organization"> | string
  }

  export type ShiftWhereInput = {
    AND?: ShiftWhereInput | ShiftWhereInput[]
    OR?: ShiftWhereInput[]
    NOT?: ShiftWhereInput | ShiftWhereInput[]
    id?: StringFilter<"Shift"> | string
    start?: StringFilter<"Shift"> | string
    end?: StringFilter<"Shift"> | string
    organizationId?: StringFilter<"Shift"> | string
    plannedBreaks?: PlannedBreakListRelationFilter
    lines?: LineListRelationFilter
    organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
  }

  export type ShiftOrderByWithRelationInput = {
    id?: SortOrder
    start?: SortOrder
    end?: SortOrder
    organizationId?: SortOrder
    plannedBreaks?: PlannedBreakOrderByRelationAggregateInput
    lines?: LineOrderByRelationAggregateInput
    organization?: OrganizationOrderByWithRelationInput
  }

  export type ShiftWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ShiftWhereInput | ShiftWhereInput[]
    OR?: ShiftWhereInput[]
    NOT?: ShiftWhereInput | ShiftWhereInput[]
    start?: StringFilter<"Shift"> | string
    end?: StringFilter<"Shift"> | string
    organizationId?: StringFilter<"Shift"> | string
    plannedBreaks?: PlannedBreakListRelationFilter
    lines?: LineListRelationFilter
    organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
  }, "id">

  export type ShiftOrderByWithAggregationInput = {
    id?: SortOrder
    start?: SortOrder
    end?: SortOrder
    organizationId?: SortOrder
    _count?: ShiftCountOrderByAggregateInput
    _max?: ShiftMaxOrderByAggregateInput
    _min?: ShiftMinOrderByAggregateInput
  }

  export type ShiftScalarWhereWithAggregatesInput = {
    AND?: ShiftScalarWhereWithAggregatesInput | ShiftScalarWhereWithAggregatesInput[]
    OR?: ShiftScalarWhereWithAggregatesInput[]
    NOT?: ShiftScalarWhereWithAggregatesInput | ShiftScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Shift"> | string
    start?: StringWithAggregatesFilter<"Shift"> | string
    end?: StringWithAggregatesFilter<"Shift"> | string
    organizationId?: StringWithAggregatesFilter<"Shift"> | string
  }

  export type CustomShiftWhereInput = {
    AND?: CustomShiftWhereInput | CustomShiftWhereInput[]
    OR?: CustomShiftWhereInput[]
    NOT?: CustomShiftWhereInput | CustomShiftWhereInput[]
    id?: StringFilter<"CustomShift"> | string
    start?: StringFilter<"CustomShift"> | string
    end?: StringFilter<"CustomShift"> | string
    lineId?: StringFilter<"CustomShift"> | string
    plannedBreaks?: PlannedBreakCustomListRelationFilter
    line?: XOR<LineScalarRelationFilter, LineWhereInput>
  }

  export type CustomShiftOrderByWithRelationInput = {
    id?: SortOrder
    start?: SortOrder
    end?: SortOrder
    lineId?: SortOrder
    plannedBreaks?: PlannedBreakCustomOrderByRelationAggregateInput
    line?: LineOrderByWithRelationInput
  }

  export type CustomShiftWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CustomShiftWhereInput | CustomShiftWhereInput[]
    OR?: CustomShiftWhereInput[]
    NOT?: CustomShiftWhereInput | CustomShiftWhereInput[]
    start?: StringFilter<"CustomShift"> | string
    end?: StringFilter<"CustomShift"> | string
    lineId?: StringFilter<"CustomShift"> | string
    plannedBreaks?: PlannedBreakCustomListRelationFilter
    line?: XOR<LineScalarRelationFilter, LineWhereInput>
  }, "id">

  export type CustomShiftOrderByWithAggregationInput = {
    id?: SortOrder
    start?: SortOrder
    end?: SortOrder
    lineId?: SortOrder
    _count?: CustomShiftCountOrderByAggregateInput
    _max?: CustomShiftMaxOrderByAggregateInput
    _min?: CustomShiftMinOrderByAggregateInput
  }

  export type CustomShiftScalarWhereWithAggregatesInput = {
    AND?: CustomShiftScalarWhereWithAggregatesInput | CustomShiftScalarWhereWithAggregatesInput[]
    OR?: CustomShiftScalarWhereWithAggregatesInput[]
    NOT?: CustomShiftScalarWhereWithAggregatesInput | CustomShiftScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CustomShift"> | string
    start?: StringWithAggregatesFilter<"CustomShift"> | string
    end?: StringWithAggregatesFilter<"CustomShift"> | string
    lineId?: StringWithAggregatesFilter<"CustomShift"> | string
  }

  export type PlannedBreakCustomWhereInput = {
    AND?: PlannedBreakCustomWhereInput | PlannedBreakCustomWhereInput[]
    OR?: PlannedBreakCustomWhereInput[]
    NOT?: PlannedBreakCustomWhereInput | PlannedBreakCustomWhereInput[]
    id?: StringFilter<"PlannedBreakCustom"> | string
    start?: StringFilter<"PlannedBreakCustom"> | string
    end?: StringFilter<"PlannedBreakCustom"> | string
    typeOfBreak?: StringFilter<"PlannedBreakCustom"> | string
    customShiftTimingId?: StringFilter<"PlannedBreakCustom"> | string
    customShift?: XOR<CustomShiftScalarRelationFilter, CustomShiftWhereInput>
  }

  export type PlannedBreakCustomOrderByWithRelationInput = {
    id?: SortOrder
    start?: SortOrder
    end?: SortOrder
    typeOfBreak?: SortOrder
    customShiftTimingId?: SortOrder
    customShift?: CustomShiftOrderByWithRelationInput
  }

  export type PlannedBreakCustomWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PlannedBreakCustomWhereInput | PlannedBreakCustomWhereInput[]
    OR?: PlannedBreakCustomWhereInput[]
    NOT?: PlannedBreakCustomWhereInput | PlannedBreakCustomWhereInput[]
    start?: StringFilter<"PlannedBreakCustom"> | string
    end?: StringFilter<"PlannedBreakCustom"> | string
    typeOfBreak?: StringFilter<"PlannedBreakCustom"> | string
    customShiftTimingId?: StringFilter<"PlannedBreakCustom"> | string
    customShift?: XOR<CustomShiftScalarRelationFilter, CustomShiftWhereInput>
  }, "id">

  export type PlannedBreakCustomOrderByWithAggregationInput = {
    id?: SortOrder
    start?: SortOrder
    end?: SortOrder
    typeOfBreak?: SortOrder
    customShiftTimingId?: SortOrder
    _count?: PlannedBreakCustomCountOrderByAggregateInput
    _max?: PlannedBreakCustomMaxOrderByAggregateInput
    _min?: PlannedBreakCustomMinOrderByAggregateInput
  }

  export type PlannedBreakCustomScalarWhereWithAggregatesInput = {
    AND?: PlannedBreakCustomScalarWhereWithAggregatesInput | PlannedBreakCustomScalarWhereWithAggregatesInput[]
    OR?: PlannedBreakCustomScalarWhereWithAggregatesInput[]
    NOT?: PlannedBreakCustomScalarWhereWithAggregatesInput | PlannedBreakCustomScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PlannedBreakCustom"> | string
    start?: StringWithAggregatesFilter<"PlannedBreakCustom"> | string
    end?: StringWithAggregatesFilter<"PlannedBreakCustom"> | string
    typeOfBreak?: StringWithAggregatesFilter<"PlannedBreakCustom"> | string
    customShiftTimingId?: StringWithAggregatesFilter<"PlannedBreakCustom"> | string
  }

  export type PlannedBreakWhereInput = {
    AND?: PlannedBreakWhereInput | PlannedBreakWhereInput[]
    OR?: PlannedBreakWhereInput[]
    NOT?: PlannedBreakWhereInput | PlannedBreakWhereInput[]
    id?: StringFilter<"PlannedBreak"> | string
    start?: StringFilter<"PlannedBreak"> | string
    end?: StringFilter<"PlannedBreak"> | string
    type?: EnumTypeOfBreakFilter<"PlannedBreak"> | $Enums.TypeOfBreak
    ShiftId?: StringFilter<"PlannedBreak"> | string
    shift?: XOR<ShiftScalarRelationFilter, ShiftWhereInput>
  }

  export type PlannedBreakOrderByWithRelationInput = {
    id?: SortOrder
    start?: SortOrder
    end?: SortOrder
    type?: SortOrder
    ShiftId?: SortOrder
    shift?: ShiftOrderByWithRelationInput
  }

  export type PlannedBreakWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PlannedBreakWhereInput | PlannedBreakWhereInput[]
    OR?: PlannedBreakWhereInput[]
    NOT?: PlannedBreakWhereInput | PlannedBreakWhereInput[]
    start?: StringFilter<"PlannedBreak"> | string
    end?: StringFilter<"PlannedBreak"> | string
    type?: EnumTypeOfBreakFilter<"PlannedBreak"> | $Enums.TypeOfBreak
    ShiftId?: StringFilter<"PlannedBreak"> | string
    shift?: XOR<ShiftScalarRelationFilter, ShiftWhereInput>
  }, "id">

  export type PlannedBreakOrderByWithAggregationInput = {
    id?: SortOrder
    start?: SortOrder
    end?: SortOrder
    type?: SortOrder
    ShiftId?: SortOrder
    _count?: PlannedBreakCountOrderByAggregateInput
    _max?: PlannedBreakMaxOrderByAggregateInput
    _min?: PlannedBreakMinOrderByAggregateInput
  }

  export type PlannedBreakScalarWhereWithAggregatesInput = {
    AND?: PlannedBreakScalarWhereWithAggregatesInput | PlannedBreakScalarWhereWithAggregatesInput[]
    OR?: PlannedBreakScalarWhereWithAggregatesInput[]
    NOT?: PlannedBreakScalarWhereWithAggregatesInput | PlannedBreakScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PlannedBreak"> | string
    start?: StringWithAggregatesFilter<"PlannedBreak"> | string
    end?: StringWithAggregatesFilter<"PlannedBreak"> | string
    type?: EnumTypeOfBreakWithAggregatesFilter<"PlannedBreak"> | $Enums.TypeOfBreak
    ShiftId?: StringWithAggregatesFilter<"PlannedBreak"> | string
  }

  export type LineWhereInput = {
    AND?: LineWhereInput | LineWhereInput[]
    OR?: LineWhereInput[]
    NOT?: LineWhereInput | LineWhereInput[]
    id?: StringFilter<"Line"> | string
    name?: StringFilter<"Line"> | string
    type?: StringFilter<"Line"> | string
    organizationId?: StringFilter<"Line"> | string
    userId?: StringFilter<"Line"> | string
    customShifts?: CustomShiftListRelationFilter
    organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    shifts?: ShiftListRelationFilter
    stations?: StationListRelationFilter
    devices?: DeviceListRelationFilter
  }

  export type LineOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    organizationId?: SortOrder
    userId?: SortOrder
    customShifts?: CustomShiftOrderByRelationAggregateInput
    organization?: OrganizationOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    shifts?: ShiftOrderByRelationAggregateInput
    stations?: StationOrderByRelationAggregateInput
    devices?: DeviceOrderByRelationAggregateInput
  }

  export type LineWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LineWhereInput | LineWhereInput[]
    OR?: LineWhereInput[]
    NOT?: LineWhereInput | LineWhereInput[]
    name?: StringFilter<"Line"> | string
    type?: StringFilter<"Line"> | string
    organizationId?: StringFilter<"Line"> | string
    userId?: StringFilter<"Line"> | string
    customShifts?: CustomShiftListRelationFilter
    organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    shifts?: ShiftListRelationFilter
    stations?: StationListRelationFilter
    devices?: DeviceListRelationFilter
  }, "id">

  export type LineOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    organizationId?: SortOrder
    userId?: SortOrder
    _count?: LineCountOrderByAggregateInput
    _max?: LineMaxOrderByAggregateInput
    _min?: LineMinOrderByAggregateInput
  }

  export type LineScalarWhereWithAggregatesInput = {
    AND?: LineScalarWhereWithAggregatesInput | LineScalarWhereWithAggregatesInput[]
    OR?: LineScalarWhereWithAggregatesInput[]
    NOT?: LineScalarWhereWithAggregatesInput | LineScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Line"> | string
    name?: StringWithAggregatesFilter<"Line"> | string
    type?: StringWithAggregatesFilter<"Line"> | string
    organizationId?: StringWithAggregatesFilter<"Line"> | string
    userId?: StringWithAggregatesFilter<"Line"> | string
  }

  export type StationWhereInput = {
    AND?: StationWhereInput | StationWhereInput[]
    OR?: StationWhereInput[]
    NOT?: StationWhereInput | StationWhereInput[]
    id?: StringFilter<"Station"> | string
    name?: StringFilter<"Station"> | string
    isCritical?: BoolFilter<"Station"> | boolean
    lineId?: StringFilter<"Station"> | string
    line?: XOR<LineScalarRelationFilter, LineWhereInput>
  }

  export type StationOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    isCritical?: SortOrder
    lineId?: SortOrder
    line?: LineOrderByWithRelationInput
  }

  export type StationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StationWhereInput | StationWhereInput[]
    OR?: StationWhereInput[]
    NOT?: StationWhereInput | StationWhereInput[]
    name?: StringFilter<"Station"> | string
    isCritical?: BoolFilter<"Station"> | boolean
    lineId?: StringFilter<"Station"> | string
    line?: XOR<LineScalarRelationFilter, LineWhereInput>
  }, "id">

  export type StationOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    isCritical?: SortOrder
    lineId?: SortOrder
    _count?: StationCountOrderByAggregateInput
    _max?: StationMaxOrderByAggregateInput
    _min?: StationMinOrderByAggregateInput
  }

  export type StationScalarWhereWithAggregatesInput = {
    AND?: StationScalarWhereWithAggregatesInput | StationScalarWhereWithAggregatesInput[]
    OR?: StationScalarWhereWithAggregatesInput[]
    NOT?: StationScalarWhereWithAggregatesInput | StationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Station"> | string
    name?: StringWithAggregatesFilter<"Station"> | string
    isCritical?: BoolWithAggregatesFilter<"Station"> | boolean
    lineId?: StringWithAggregatesFilter<"Station"> | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    status?: EnumStatusFilter<"User"> | $Enums.Status
    createdAt?: DateTimeFilter<"User"> | Date | string
    address?: StringFilter<"User"> | string
    phoneNumber?: StringFilter<"User"> | string
    lastLogin?: DateTimeNullableFilter<"User"> | Date | string | null
    organizationId?: StringFilter<"User"> | string
    lines?: LineListRelationFilter
    organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    address?: SortOrder
    phoneNumber?: SortOrder
    lastLogin?: SortOrderInput | SortOrder
    organizationId?: SortOrder
    lines?: LineOrderByRelationAggregateInput
    organization?: OrganizationOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    status?: EnumStatusFilter<"User"> | $Enums.Status
    createdAt?: DateTimeFilter<"User"> | Date | string
    address?: StringFilter<"User"> | string
    phoneNumber?: StringFilter<"User"> | string
    lastLogin?: DateTimeNullableFilter<"User"> | Date | string | null
    organizationId?: StringFilter<"User"> | string
    lines?: LineListRelationFilter
    organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    address?: SortOrder
    phoneNumber?: SortOrder
    lastLogin?: SortOrderInput | SortOrder
    organizationId?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    status?: EnumStatusWithAggregatesFilter<"User"> | $Enums.Status
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    address?: StringWithAggregatesFilter<"User"> | string
    phoneNumber?: StringWithAggregatesFilter<"User"> | string
    lastLogin?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    organizationId?: StringWithAggregatesFilter<"User"> | string
  }

  export type DeviceWhereInput = {
    AND?: DeviceWhereInput | DeviceWhereInput[]
    OR?: DeviceWhereInput[]
    NOT?: DeviceWhereInput | DeviceWhereInput[]
    id?: StringFilter<"Device"> | string
    name?: StringFilter<"Device"> | string
    type?: StringFilter<"Device"> | string
    organizationId?: StringFilter<"Device"> | string
    lineId?: StringFilter<"Device"> | string
    status?: EnumDeviceStatusFilter<"Device"> | $Enums.DeviceStatus
    organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
    line?: XOR<LineScalarRelationFilter, LineWhereInput>
  }

  export type DeviceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    organizationId?: SortOrder
    lineId?: SortOrder
    status?: SortOrder
    organization?: OrganizationOrderByWithRelationInput
    line?: LineOrderByWithRelationInput
  }

  export type DeviceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DeviceWhereInput | DeviceWhereInput[]
    OR?: DeviceWhereInput[]
    NOT?: DeviceWhereInput | DeviceWhereInput[]
    name?: StringFilter<"Device"> | string
    type?: StringFilter<"Device"> | string
    organizationId?: StringFilter<"Device"> | string
    lineId?: StringFilter<"Device"> | string
    status?: EnumDeviceStatusFilter<"Device"> | $Enums.DeviceStatus
    organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
    line?: XOR<LineScalarRelationFilter, LineWhereInput>
  }, "id">

  export type DeviceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    organizationId?: SortOrder
    lineId?: SortOrder
    status?: SortOrder
    _count?: DeviceCountOrderByAggregateInput
    _max?: DeviceMaxOrderByAggregateInput
    _min?: DeviceMinOrderByAggregateInput
  }

  export type DeviceScalarWhereWithAggregatesInput = {
    AND?: DeviceScalarWhereWithAggregatesInput | DeviceScalarWhereWithAggregatesInput[]
    OR?: DeviceScalarWhereWithAggregatesInput[]
    NOT?: DeviceScalarWhereWithAggregatesInput | DeviceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Device"> | string
    name?: StringWithAggregatesFilter<"Device"> | string
    type?: StringWithAggregatesFilter<"Device"> | string
    organizationId?: StringWithAggregatesFilter<"Device"> | string
    lineId?: StringWithAggregatesFilter<"Device"> | string
    status?: EnumDeviceStatusWithAggregatesFilter<"Device"> | $Enums.DeviceStatus
  }

  export type OrganizationCreateInput = {
    id?: string
    name: string
    email: string
    address: string
    phoneNumber: string
    imageUrl?: string | null
    shiftNumber: number
    unit: string
    Department: string
    Desingation: string
    shifts?: ShiftCreateNestedManyWithoutOrganizationInput
    users?: UserCreateNestedManyWithoutOrganizationInput
    devices?: DeviceCreateNestedManyWithoutOrganizationInput
    lines?: LineCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    address: string
    phoneNumber: string
    imageUrl?: string | null
    shiftNumber: number
    unit: string
    Department: string
    Desingation: string
    shifts?: ShiftUncheckedCreateNestedManyWithoutOrganizationInput
    users?: UserUncheckedCreateNestedManyWithoutOrganizationInput
    devices?: DeviceUncheckedCreateNestedManyWithoutOrganizationInput
    lines?: LineUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    shiftNumber?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    Department?: StringFieldUpdateOperationsInput | string
    Desingation?: StringFieldUpdateOperationsInput | string
    shifts?: ShiftUpdateManyWithoutOrganizationNestedInput
    users?: UserUpdateManyWithoutOrganizationNestedInput
    devices?: DeviceUpdateManyWithoutOrganizationNestedInput
    lines?: LineUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    shiftNumber?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    Department?: StringFieldUpdateOperationsInput | string
    Desingation?: StringFieldUpdateOperationsInput | string
    shifts?: ShiftUncheckedUpdateManyWithoutOrganizationNestedInput
    users?: UserUncheckedUpdateManyWithoutOrganizationNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutOrganizationNestedInput
    lines?: LineUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationCreateManyInput = {
    id?: string
    name: string
    email: string
    address: string
    phoneNumber: string
    imageUrl?: string | null
    shiftNumber: number
    unit: string
    Department: string
    Desingation: string
  }

  export type OrganizationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    shiftNumber?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    Department?: StringFieldUpdateOperationsInput | string
    Desingation?: StringFieldUpdateOperationsInput | string
  }

  export type OrganizationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    shiftNumber?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    Department?: StringFieldUpdateOperationsInput | string
    Desingation?: StringFieldUpdateOperationsInput | string
  }

  export type ShiftCreateInput = {
    id?: string
    start: string
    end: string
    plannedBreaks?: PlannedBreakCreateNestedManyWithoutShiftInput
    lines?: LineCreateNestedManyWithoutShiftsInput
    organization: OrganizationCreateNestedOneWithoutShiftsInput
  }

  export type ShiftUncheckedCreateInput = {
    id?: string
    start: string
    end: string
    organizationId: string
    plannedBreaks?: PlannedBreakUncheckedCreateNestedManyWithoutShiftInput
    lines?: LineUncheckedCreateNestedManyWithoutShiftsInput
  }

  export type ShiftUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    plannedBreaks?: PlannedBreakUpdateManyWithoutShiftNestedInput
    lines?: LineUpdateManyWithoutShiftsNestedInput
    organization?: OrganizationUpdateOneRequiredWithoutShiftsNestedInput
  }

  export type ShiftUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    plannedBreaks?: PlannedBreakUncheckedUpdateManyWithoutShiftNestedInput
    lines?: LineUncheckedUpdateManyWithoutShiftsNestedInput
  }

  export type ShiftCreateManyInput = {
    id?: string
    start: string
    end: string
    organizationId: string
  }

  export type ShiftUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
  }

  export type ShiftUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
  }

  export type CustomShiftCreateInput = {
    id?: string
    start: string
    end: string
    plannedBreaks?: PlannedBreakCustomCreateNestedManyWithoutCustomShiftInput
    line: LineCreateNestedOneWithoutCustomShiftsInput
  }

  export type CustomShiftUncheckedCreateInput = {
    id?: string
    start: string
    end: string
    lineId: string
    plannedBreaks?: PlannedBreakCustomUncheckedCreateNestedManyWithoutCustomShiftInput
  }

  export type CustomShiftUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    plannedBreaks?: PlannedBreakCustomUpdateManyWithoutCustomShiftNestedInput
    line?: LineUpdateOneRequiredWithoutCustomShiftsNestedInput
  }

  export type CustomShiftUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    lineId?: StringFieldUpdateOperationsInput | string
    plannedBreaks?: PlannedBreakCustomUncheckedUpdateManyWithoutCustomShiftNestedInput
  }

  export type CustomShiftCreateManyInput = {
    id?: string
    start: string
    end: string
    lineId: string
  }

  export type CustomShiftUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
  }

  export type CustomShiftUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    lineId?: StringFieldUpdateOperationsInput | string
  }

  export type PlannedBreakCustomCreateInput = {
    id?: string
    start: string
    end: string
    typeOfBreak: string
    customShift: CustomShiftCreateNestedOneWithoutPlannedBreaksInput
  }

  export type PlannedBreakCustomUncheckedCreateInput = {
    id?: string
    start: string
    end: string
    typeOfBreak: string
    customShiftTimingId: string
  }

  export type PlannedBreakCustomUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    typeOfBreak?: StringFieldUpdateOperationsInput | string
    customShift?: CustomShiftUpdateOneRequiredWithoutPlannedBreaksNestedInput
  }

  export type PlannedBreakCustomUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    typeOfBreak?: StringFieldUpdateOperationsInput | string
    customShiftTimingId?: StringFieldUpdateOperationsInput | string
  }

  export type PlannedBreakCustomCreateManyInput = {
    id?: string
    start: string
    end: string
    typeOfBreak: string
    customShiftTimingId: string
  }

  export type PlannedBreakCustomUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    typeOfBreak?: StringFieldUpdateOperationsInput | string
  }

  export type PlannedBreakCustomUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    typeOfBreak?: StringFieldUpdateOperationsInput | string
    customShiftTimingId?: StringFieldUpdateOperationsInput | string
  }

  export type PlannedBreakCreateInput = {
    id?: string
    start: string
    end: string
    type: $Enums.TypeOfBreak
    shift: ShiftCreateNestedOneWithoutPlannedBreaksInput
  }

  export type PlannedBreakUncheckedCreateInput = {
    id?: string
    start: string
    end: string
    type: $Enums.TypeOfBreak
    ShiftId: string
  }

  export type PlannedBreakUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    type?: EnumTypeOfBreakFieldUpdateOperationsInput | $Enums.TypeOfBreak
    shift?: ShiftUpdateOneRequiredWithoutPlannedBreaksNestedInput
  }

  export type PlannedBreakUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    type?: EnumTypeOfBreakFieldUpdateOperationsInput | $Enums.TypeOfBreak
    ShiftId?: StringFieldUpdateOperationsInput | string
  }

  export type PlannedBreakCreateManyInput = {
    id?: string
    start: string
    end: string
    type: $Enums.TypeOfBreak
    ShiftId: string
  }

  export type PlannedBreakUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    type?: EnumTypeOfBreakFieldUpdateOperationsInput | $Enums.TypeOfBreak
  }

  export type PlannedBreakUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    type?: EnumTypeOfBreakFieldUpdateOperationsInput | $Enums.TypeOfBreak
    ShiftId?: StringFieldUpdateOperationsInput | string
  }

  export type LineCreateInput = {
    id?: string
    name: string
    type: string
    customShifts?: CustomShiftCreateNestedManyWithoutLineInput
    organization: OrganizationCreateNestedOneWithoutLinesInput
    user: UserCreateNestedOneWithoutLinesInput
    shifts?: ShiftCreateNestedManyWithoutLinesInput
    stations?: StationCreateNestedManyWithoutLineInput
    devices?: DeviceCreateNestedManyWithoutLineInput
  }

  export type LineUncheckedCreateInput = {
    id?: string
    name: string
    type: string
    organizationId: string
    userId: string
    customShifts?: CustomShiftUncheckedCreateNestedManyWithoutLineInput
    shifts?: ShiftUncheckedCreateNestedManyWithoutLinesInput
    stations?: StationUncheckedCreateNestedManyWithoutLineInput
    devices?: DeviceUncheckedCreateNestedManyWithoutLineInput
  }

  export type LineUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    customShifts?: CustomShiftUpdateManyWithoutLineNestedInput
    organization?: OrganizationUpdateOneRequiredWithoutLinesNestedInput
    user?: UserUpdateOneRequiredWithoutLinesNestedInput
    shifts?: ShiftUpdateManyWithoutLinesNestedInput
    stations?: StationUpdateManyWithoutLineNestedInput
    devices?: DeviceUpdateManyWithoutLineNestedInput
  }

  export type LineUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    customShifts?: CustomShiftUncheckedUpdateManyWithoutLineNestedInput
    shifts?: ShiftUncheckedUpdateManyWithoutLinesNestedInput
    stations?: StationUncheckedUpdateManyWithoutLineNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutLineNestedInput
  }

  export type LineCreateManyInput = {
    id?: string
    name: string
    type: string
    organizationId: string
    userId: string
  }

  export type LineUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
  }

  export type LineUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type StationCreateInput = {
    id?: string
    name: string
    isCritical?: boolean
    line: LineCreateNestedOneWithoutStationsInput
  }

  export type StationUncheckedCreateInput = {
    id?: string
    name: string
    isCritical?: boolean
    lineId: string
  }

  export type StationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isCritical?: BoolFieldUpdateOperationsInput | boolean
    line?: LineUpdateOneRequiredWithoutStationsNestedInput
  }

  export type StationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isCritical?: BoolFieldUpdateOperationsInput | boolean
    lineId?: StringFieldUpdateOperationsInput | string
  }

  export type StationCreateManyInput = {
    id?: string
    name: string
    isCritical?: boolean
    lineId: string
  }

  export type StationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isCritical?: BoolFieldUpdateOperationsInput | boolean
  }

  export type StationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isCritical?: BoolFieldUpdateOperationsInput | boolean
    lineId?: StringFieldUpdateOperationsInput | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    role: $Enums.Role
    status?: $Enums.Status
    createdAt?: Date | string
    address: string
    phoneNumber: string
    lastLogin?: Date | string | null
    lines?: LineCreateNestedManyWithoutUserInput
    organization: OrganizationCreateNestedOneWithoutUsersInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    role: $Enums.Role
    status?: $Enums.Status
    createdAt?: Date | string
    address: string
    phoneNumber: string
    lastLogin?: Date | string | null
    organizationId: string
    lines?: LineUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lines?: LineUpdateManyWithoutUserNestedInput
    organization?: OrganizationUpdateOneRequiredWithoutUsersNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organizationId?: StringFieldUpdateOperationsInput | string
    lines?: LineUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    password: string
    role: $Enums.Role
    status?: $Enums.Status
    createdAt?: Date | string
    address: string
    phoneNumber: string
    lastLogin?: Date | string | null
    organizationId: string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organizationId?: StringFieldUpdateOperationsInput | string
  }

  export type DeviceCreateInput = {
    id?: string
    name: string
    type: string
    status: $Enums.DeviceStatus
    organization: OrganizationCreateNestedOneWithoutDevicesInput
    line: LineCreateNestedOneWithoutDevicesInput
  }

  export type DeviceUncheckedCreateInput = {
    id?: string
    name: string
    type: string
    organizationId: string
    lineId: string
    status: $Enums.DeviceStatus
  }

  export type DeviceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
    organization?: OrganizationUpdateOneRequiredWithoutDevicesNestedInput
    line?: LineUpdateOneRequiredWithoutDevicesNestedInput
  }

  export type DeviceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    lineId?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
  }

  export type DeviceCreateManyInput = {
    id?: string
    name: string
    type: string
    organizationId: string
    lineId: string
    status: $Enums.DeviceStatus
  }

  export type DeviceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
  }

  export type DeviceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    lineId?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type ShiftListRelationFilter = {
    every?: ShiftWhereInput
    some?: ShiftWhereInput
    none?: ShiftWhereInput
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type DeviceListRelationFilter = {
    every?: DeviceWhereInput
    some?: DeviceWhereInput
    none?: DeviceWhereInput
  }

  export type LineListRelationFilter = {
    every?: LineWhereInput
    some?: LineWhereInput
    none?: LineWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ShiftOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DeviceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LineOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OrganizationCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    address?: SortOrder
    phoneNumber?: SortOrder
    imageUrl?: SortOrder
    shiftNumber?: SortOrder
    unit?: SortOrder
    Department?: SortOrder
    Desingation?: SortOrder
  }

  export type OrganizationAvgOrderByAggregateInput = {
    shiftNumber?: SortOrder
  }

  export type OrganizationMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    address?: SortOrder
    phoneNumber?: SortOrder
    imageUrl?: SortOrder
    shiftNumber?: SortOrder
    unit?: SortOrder
    Department?: SortOrder
    Desingation?: SortOrder
  }

  export type OrganizationMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    address?: SortOrder
    phoneNumber?: SortOrder
    imageUrl?: SortOrder
    shiftNumber?: SortOrder
    unit?: SortOrder
    Department?: SortOrder
    Desingation?: SortOrder
  }

  export type OrganizationSumOrderByAggregateInput = {
    shiftNumber?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type PlannedBreakListRelationFilter = {
    every?: PlannedBreakWhereInput
    some?: PlannedBreakWhereInput
    none?: PlannedBreakWhereInput
  }

  export type OrganizationScalarRelationFilter = {
    is?: OrganizationWhereInput
    isNot?: OrganizationWhereInput
  }

  export type PlannedBreakOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ShiftCountOrderByAggregateInput = {
    id?: SortOrder
    start?: SortOrder
    end?: SortOrder
    organizationId?: SortOrder
  }

  export type ShiftMaxOrderByAggregateInput = {
    id?: SortOrder
    start?: SortOrder
    end?: SortOrder
    organizationId?: SortOrder
  }

  export type ShiftMinOrderByAggregateInput = {
    id?: SortOrder
    start?: SortOrder
    end?: SortOrder
    organizationId?: SortOrder
  }

  export type PlannedBreakCustomListRelationFilter = {
    every?: PlannedBreakCustomWhereInput
    some?: PlannedBreakCustomWhereInput
    none?: PlannedBreakCustomWhereInput
  }

  export type LineScalarRelationFilter = {
    is?: LineWhereInput
    isNot?: LineWhereInput
  }

  export type PlannedBreakCustomOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CustomShiftCountOrderByAggregateInput = {
    id?: SortOrder
    start?: SortOrder
    end?: SortOrder
    lineId?: SortOrder
  }

  export type CustomShiftMaxOrderByAggregateInput = {
    id?: SortOrder
    start?: SortOrder
    end?: SortOrder
    lineId?: SortOrder
  }

  export type CustomShiftMinOrderByAggregateInput = {
    id?: SortOrder
    start?: SortOrder
    end?: SortOrder
    lineId?: SortOrder
  }

  export type CustomShiftScalarRelationFilter = {
    is?: CustomShiftWhereInput
    isNot?: CustomShiftWhereInput
  }

  export type PlannedBreakCustomCountOrderByAggregateInput = {
    id?: SortOrder
    start?: SortOrder
    end?: SortOrder
    typeOfBreak?: SortOrder
    customShiftTimingId?: SortOrder
  }

  export type PlannedBreakCustomMaxOrderByAggregateInput = {
    id?: SortOrder
    start?: SortOrder
    end?: SortOrder
    typeOfBreak?: SortOrder
    customShiftTimingId?: SortOrder
  }

  export type PlannedBreakCustomMinOrderByAggregateInput = {
    id?: SortOrder
    start?: SortOrder
    end?: SortOrder
    typeOfBreak?: SortOrder
    customShiftTimingId?: SortOrder
  }

  export type EnumTypeOfBreakFilter<$PrismaModel = never> = {
    equals?: $Enums.TypeOfBreak | EnumTypeOfBreakFieldRefInput<$PrismaModel>
    in?: $Enums.TypeOfBreak[] | ListEnumTypeOfBreakFieldRefInput<$PrismaModel>
    notIn?: $Enums.TypeOfBreak[] | ListEnumTypeOfBreakFieldRefInput<$PrismaModel>
    not?: NestedEnumTypeOfBreakFilter<$PrismaModel> | $Enums.TypeOfBreak
  }

  export type ShiftScalarRelationFilter = {
    is?: ShiftWhereInput
    isNot?: ShiftWhereInput
  }

  export type PlannedBreakCountOrderByAggregateInput = {
    id?: SortOrder
    start?: SortOrder
    end?: SortOrder
    type?: SortOrder
    ShiftId?: SortOrder
  }

  export type PlannedBreakMaxOrderByAggregateInput = {
    id?: SortOrder
    start?: SortOrder
    end?: SortOrder
    type?: SortOrder
    ShiftId?: SortOrder
  }

  export type PlannedBreakMinOrderByAggregateInput = {
    id?: SortOrder
    start?: SortOrder
    end?: SortOrder
    type?: SortOrder
    ShiftId?: SortOrder
  }

  export type EnumTypeOfBreakWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TypeOfBreak | EnumTypeOfBreakFieldRefInput<$PrismaModel>
    in?: $Enums.TypeOfBreak[] | ListEnumTypeOfBreakFieldRefInput<$PrismaModel>
    notIn?: $Enums.TypeOfBreak[] | ListEnumTypeOfBreakFieldRefInput<$PrismaModel>
    not?: NestedEnumTypeOfBreakWithAggregatesFilter<$PrismaModel> | $Enums.TypeOfBreak
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTypeOfBreakFilter<$PrismaModel>
    _max?: NestedEnumTypeOfBreakFilter<$PrismaModel>
  }

  export type CustomShiftListRelationFilter = {
    every?: CustomShiftWhereInput
    some?: CustomShiftWhereInput
    none?: CustomShiftWhereInput
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type StationListRelationFilter = {
    every?: StationWhereInput
    some?: StationWhereInput
    none?: StationWhereInput
  }

  export type CustomShiftOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LineCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    organizationId?: SortOrder
    userId?: SortOrder
  }

  export type LineMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    organizationId?: SortOrder
    userId?: SortOrder
  }

  export type LineMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    organizationId?: SortOrder
    userId?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StationCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isCritical?: SortOrder
    lineId?: SortOrder
  }

  export type StationMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isCritical?: SortOrder
    lineId?: SortOrder
  }

  export type StationMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isCritical?: SortOrder
    lineId?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type EnumStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.Status | EnumStatusFieldRefInput<$PrismaModel>
    in?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusFilter<$PrismaModel> | $Enums.Status
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    address?: SortOrder
    phoneNumber?: SortOrder
    lastLogin?: SortOrder
    organizationId?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    address?: SortOrder
    phoneNumber?: SortOrder
    lastLogin?: SortOrder
    organizationId?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    address?: SortOrder
    phoneNumber?: SortOrder
    lastLogin?: SortOrder
    organizationId?: SortOrder
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type EnumStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Status | EnumStatusFieldRefInput<$PrismaModel>
    in?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusWithAggregatesFilter<$PrismaModel> | $Enums.Status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusFilter<$PrismaModel>
    _max?: NestedEnumStatusFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumDeviceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceStatus | EnumDeviceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceStatus[] | ListEnumDeviceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeviceStatus[] | ListEnumDeviceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDeviceStatusFilter<$PrismaModel> | $Enums.DeviceStatus
  }

  export type DeviceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    organizationId?: SortOrder
    lineId?: SortOrder
    status?: SortOrder
  }

  export type DeviceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    organizationId?: SortOrder
    lineId?: SortOrder
    status?: SortOrder
  }

  export type DeviceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    organizationId?: SortOrder
    lineId?: SortOrder
    status?: SortOrder
  }

  export type EnumDeviceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceStatus | EnumDeviceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceStatus[] | ListEnumDeviceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeviceStatus[] | ListEnumDeviceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDeviceStatusWithAggregatesFilter<$PrismaModel> | $Enums.DeviceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeviceStatusFilter<$PrismaModel>
    _max?: NestedEnumDeviceStatusFilter<$PrismaModel>
  }

  export type ShiftCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<ShiftCreateWithoutOrganizationInput, ShiftUncheckedCreateWithoutOrganizationInput> | ShiftCreateWithoutOrganizationInput[] | ShiftUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: ShiftCreateOrConnectWithoutOrganizationInput | ShiftCreateOrConnectWithoutOrganizationInput[]
    createMany?: ShiftCreateManyOrganizationInputEnvelope
    connect?: ShiftWhereUniqueInput | ShiftWhereUniqueInput[]
  }

  export type UserCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput> | UserCreateWithoutOrganizationInput[] | UserUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrganizationInput | UserCreateOrConnectWithoutOrganizationInput[]
    createMany?: UserCreateManyOrganizationInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type DeviceCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<DeviceCreateWithoutOrganizationInput, DeviceUncheckedCreateWithoutOrganizationInput> | DeviceCreateWithoutOrganizationInput[] | DeviceUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutOrganizationInput | DeviceCreateOrConnectWithoutOrganizationInput[]
    createMany?: DeviceCreateManyOrganizationInputEnvelope
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
  }

  export type LineCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<LineCreateWithoutOrganizationInput, LineUncheckedCreateWithoutOrganizationInput> | LineCreateWithoutOrganizationInput[] | LineUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: LineCreateOrConnectWithoutOrganizationInput | LineCreateOrConnectWithoutOrganizationInput[]
    createMany?: LineCreateManyOrganizationInputEnvelope
    connect?: LineWhereUniqueInput | LineWhereUniqueInput[]
  }

  export type ShiftUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<ShiftCreateWithoutOrganizationInput, ShiftUncheckedCreateWithoutOrganizationInput> | ShiftCreateWithoutOrganizationInput[] | ShiftUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: ShiftCreateOrConnectWithoutOrganizationInput | ShiftCreateOrConnectWithoutOrganizationInput[]
    createMany?: ShiftCreateManyOrganizationInputEnvelope
    connect?: ShiftWhereUniqueInput | ShiftWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput> | UserCreateWithoutOrganizationInput[] | UserUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrganizationInput | UserCreateOrConnectWithoutOrganizationInput[]
    createMany?: UserCreateManyOrganizationInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type DeviceUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<DeviceCreateWithoutOrganizationInput, DeviceUncheckedCreateWithoutOrganizationInput> | DeviceCreateWithoutOrganizationInput[] | DeviceUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutOrganizationInput | DeviceCreateOrConnectWithoutOrganizationInput[]
    createMany?: DeviceCreateManyOrganizationInputEnvelope
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
  }

  export type LineUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<LineCreateWithoutOrganizationInput, LineUncheckedCreateWithoutOrganizationInput> | LineCreateWithoutOrganizationInput[] | LineUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: LineCreateOrConnectWithoutOrganizationInput | LineCreateOrConnectWithoutOrganizationInput[]
    createMany?: LineCreateManyOrganizationInputEnvelope
    connect?: LineWhereUniqueInput | LineWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ShiftUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<ShiftCreateWithoutOrganizationInput, ShiftUncheckedCreateWithoutOrganizationInput> | ShiftCreateWithoutOrganizationInput[] | ShiftUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: ShiftCreateOrConnectWithoutOrganizationInput | ShiftCreateOrConnectWithoutOrganizationInput[]
    upsert?: ShiftUpsertWithWhereUniqueWithoutOrganizationInput | ShiftUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: ShiftCreateManyOrganizationInputEnvelope
    set?: ShiftWhereUniqueInput | ShiftWhereUniqueInput[]
    disconnect?: ShiftWhereUniqueInput | ShiftWhereUniqueInput[]
    delete?: ShiftWhereUniqueInput | ShiftWhereUniqueInput[]
    connect?: ShiftWhereUniqueInput | ShiftWhereUniqueInput[]
    update?: ShiftUpdateWithWhereUniqueWithoutOrganizationInput | ShiftUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: ShiftUpdateManyWithWhereWithoutOrganizationInput | ShiftUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: ShiftScalarWhereInput | ShiftScalarWhereInput[]
  }

  export type UserUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput> | UserCreateWithoutOrganizationInput[] | UserUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrganizationInput | UserCreateOrConnectWithoutOrganizationInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutOrganizationInput | UserUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: UserCreateManyOrganizationInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutOrganizationInput | UserUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: UserUpdateManyWithWhereWithoutOrganizationInput | UserUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type DeviceUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<DeviceCreateWithoutOrganizationInput, DeviceUncheckedCreateWithoutOrganizationInput> | DeviceCreateWithoutOrganizationInput[] | DeviceUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutOrganizationInput | DeviceCreateOrConnectWithoutOrganizationInput[]
    upsert?: DeviceUpsertWithWhereUniqueWithoutOrganizationInput | DeviceUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: DeviceCreateManyOrganizationInputEnvelope
    set?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    disconnect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    delete?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    update?: DeviceUpdateWithWhereUniqueWithoutOrganizationInput | DeviceUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: DeviceUpdateManyWithWhereWithoutOrganizationInput | DeviceUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: DeviceScalarWhereInput | DeviceScalarWhereInput[]
  }

  export type LineUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<LineCreateWithoutOrganizationInput, LineUncheckedCreateWithoutOrganizationInput> | LineCreateWithoutOrganizationInput[] | LineUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: LineCreateOrConnectWithoutOrganizationInput | LineCreateOrConnectWithoutOrganizationInput[]
    upsert?: LineUpsertWithWhereUniqueWithoutOrganizationInput | LineUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: LineCreateManyOrganizationInputEnvelope
    set?: LineWhereUniqueInput | LineWhereUniqueInput[]
    disconnect?: LineWhereUniqueInput | LineWhereUniqueInput[]
    delete?: LineWhereUniqueInput | LineWhereUniqueInput[]
    connect?: LineWhereUniqueInput | LineWhereUniqueInput[]
    update?: LineUpdateWithWhereUniqueWithoutOrganizationInput | LineUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: LineUpdateManyWithWhereWithoutOrganizationInput | LineUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: LineScalarWhereInput | LineScalarWhereInput[]
  }

  export type ShiftUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<ShiftCreateWithoutOrganizationInput, ShiftUncheckedCreateWithoutOrganizationInput> | ShiftCreateWithoutOrganizationInput[] | ShiftUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: ShiftCreateOrConnectWithoutOrganizationInput | ShiftCreateOrConnectWithoutOrganizationInput[]
    upsert?: ShiftUpsertWithWhereUniqueWithoutOrganizationInput | ShiftUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: ShiftCreateManyOrganizationInputEnvelope
    set?: ShiftWhereUniqueInput | ShiftWhereUniqueInput[]
    disconnect?: ShiftWhereUniqueInput | ShiftWhereUniqueInput[]
    delete?: ShiftWhereUniqueInput | ShiftWhereUniqueInput[]
    connect?: ShiftWhereUniqueInput | ShiftWhereUniqueInput[]
    update?: ShiftUpdateWithWhereUniqueWithoutOrganizationInput | ShiftUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: ShiftUpdateManyWithWhereWithoutOrganizationInput | ShiftUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: ShiftScalarWhereInput | ShiftScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput> | UserCreateWithoutOrganizationInput[] | UserUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrganizationInput | UserCreateOrConnectWithoutOrganizationInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutOrganizationInput | UserUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: UserCreateManyOrganizationInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutOrganizationInput | UserUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: UserUpdateManyWithWhereWithoutOrganizationInput | UserUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type DeviceUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<DeviceCreateWithoutOrganizationInput, DeviceUncheckedCreateWithoutOrganizationInput> | DeviceCreateWithoutOrganizationInput[] | DeviceUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutOrganizationInput | DeviceCreateOrConnectWithoutOrganizationInput[]
    upsert?: DeviceUpsertWithWhereUniqueWithoutOrganizationInput | DeviceUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: DeviceCreateManyOrganizationInputEnvelope
    set?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    disconnect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    delete?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    update?: DeviceUpdateWithWhereUniqueWithoutOrganizationInput | DeviceUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: DeviceUpdateManyWithWhereWithoutOrganizationInput | DeviceUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: DeviceScalarWhereInput | DeviceScalarWhereInput[]
  }

  export type LineUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<LineCreateWithoutOrganizationInput, LineUncheckedCreateWithoutOrganizationInput> | LineCreateWithoutOrganizationInput[] | LineUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: LineCreateOrConnectWithoutOrganizationInput | LineCreateOrConnectWithoutOrganizationInput[]
    upsert?: LineUpsertWithWhereUniqueWithoutOrganizationInput | LineUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: LineCreateManyOrganizationInputEnvelope
    set?: LineWhereUniqueInput | LineWhereUniqueInput[]
    disconnect?: LineWhereUniqueInput | LineWhereUniqueInput[]
    delete?: LineWhereUniqueInput | LineWhereUniqueInput[]
    connect?: LineWhereUniqueInput | LineWhereUniqueInput[]
    update?: LineUpdateWithWhereUniqueWithoutOrganizationInput | LineUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: LineUpdateManyWithWhereWithoutOrganizationInput | LineUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: LineScalarWhereInput | LineScalarWhereInput[]
  }

  export type PlannedBreakCreateNestedManyWithoutShiftInput = {
    create?: XOR<PlannedBreakCreateWithoutShiftInput, PlannedBreakUncheckedCreateWithoutShiftInput> | PlannedBreakCreateWithoutShiftInput[] | PlannedBreakUncheckedCreateWithoutShiftInput[]
    connectOrCreate?: PlannedBreakCreateOrConnectWithoutShiftInput | PlannedBreakCreateOrConnectWithoutShiftInput[]
    createMany?: PlannedBreakCreateManyShiftInputEnvelope
    connect?: PlannedBreakWhereUniqueInput | PlannedBreakWhereUniqueInput[]
  }

  export type LineCreateNestedManyWithoutShiftsInput = {
    create?: XOR<LineCreateWithoutShiftsInput, LineUncheckedCreateWithoutShiftsInput> | LineCreateWithoutShiftsInput[] | LineUncheckedCreateWithoutShiftsInput[]
    connectOrCreate?: LineCreateOrConnectWithoutShiftsInput | LineCreateOrConnectWithoutShiftsInput[]
    connect?: LineWhereUniqueInput | LineWhereUniqueInput[]
  }

  export type OrganizationCreateNestedOneWithoutShiftsInput = {
    create?: XOR<OrganizationCreateWithoutShiftsInput, OrganizationUncheckedCreateWithoutShiftsInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutShiftsInput
    connect?: OrganizationWhereUniqueInput
  }

  export type PlannedBreakUncheckedCreateNestedManyWithoutShiftInput = {
    create?: XOR<PlannedBreakCreateWithoutShiftInput, PlannedBreakUncheckedCreateWithoutShiftInput> | PlannedBreakCreateWithoutShiftInput[] | PlannedBreakUncheckedCreateWithoutShiftInput[]
    connectOrCreate?: PlannedBreakCreateOrConnectWithoutShiftInput | PlannedBreakCreateOrConnectWithoutShiftInput[]
    createMany?: PlannedBreakCreateManyShiftInputEnvelope
    connect?: PlannedBreakWhereUniqueInput | PlannedBreakWhereUniqueInput[]
  }

  export type LineUncheckedCreateNestedManyWithoutShiftsInput = {
    create?: XOR<LineCreateWithoutShiftsInput, LineUncheckedCreateWithoutShiftsInput> | LineCreateWithoutShiftsInput[] | LineUncheckedCreateWithoutShiftsInput[]
    connectOrCreate?: LineCreateOrConnectWithoutShiftsInput | LineCreateOrConnectWithoutShiftsInput[]
    connect?: LineWhereUniqueInput | LineWhereUniqueInput[]
  }

  export type PlannedBreakUpdateManyWithoutShiftNestedInput = {
    create?: XOR<PlannedBreakCreateWithoutShiftInput, PlannedBreakUncheckedCreateWithoutShiftInput> | PlannedBreakCreateWithoutShiftInput[] | PlannedBreakUncheckedCreateWithoutShiftInput[]
    connectOrCreate?: PlannedBreakCreateOrConnectWithoutShiftInput | PlannedBreakCreateOrConnectWithoutShiftInput[]
    upsert?: PlannedBreakUpsertWithWhereUniqueWithoutShiftInput | PlannedBreakUpsertWithWhereUniqueWithoutShiftInput[]
    createMany?: PlannedBreakCreateManyShiftInputEnvelope
    set?: PlannedBreakWhereUniqueInput | PlannedBreakWhereUniqueInput[]
    disconnect?: PlannedBreakWhereUniqueInput | PlannedBreakWhereUniqueInput[]
    delete?: PlannedBreakWhereUniqueInput | PlannedBreakWhereUniqueInput[]
    connect?: PlannedBreakWhereUniqueInput | PlannedBreakWhereUniqueInput[]
    update?: PlannedBreakUpdateWithWhereUniqueWithoutShiftInput | PlannedBreakUpdateWithWhereUniqueWithoutShiftInput[]
    updateMany?: PlannedBreakUpdateManyWithWhereWithoutShiftInput | PlannedBreakUpdateManyWithWhereWithoutShiftInput[]
    deleteMany?: PlannedBreakScalarWhereInput | PlannedBreakScalarWhereInput[]
  }

  export type LineUpdateManyWithoutShiftsNestedInput = {
    create?: XOR<LineCreateWithoutShiftsInput, LineUncheckedCreateWithoutShiftsInput> | LineCreateWithoutShiftsInput[] | LineUncheckedCreateWithoutShiftsInput[]
    connectOrCreate?: LineCreateOrConnectWithoutShiftsInput | LineCreateOrConnectWithoutShiftsInput[]
    upsert?: LineUpsertWithWhereUniqueWithoutShiftsInput | LineUpsertWithWhereUniqueWithoutShiftsInput[]
    set?: LineWhereUniqueInput | LineWhereUniqueInput[]
    disconnect?: LineWhereUniqueInput | LineWhereUniqueInput[]
    delete?: LineWhereUniqueInput | LineWhereUniqueInput[]
    connect?: LineWhereUniqueInput | LineWhereUniqueInput[]
    update?: LineUpdateWithWhereUniqueWithoutShiftsInput | LineUpdateWithWhereUniqueWithoutShiftsInput[]
    updateMany?: LineUpdateManyWithWhereWithoutShiftsInput | LineUpdateManyWithWhereWithoutShiftsInput[]
    deleteMany?: LineScalarWhereInput | LineScalarWhereInput[]
  }

  export type OrganizationUpdateOneRequiredWithoutShiftsNestedInput = {
    create?: XOR<OrganizationCreateWithoutShiftsInput, OrganizationUncheckedCreateWithoutShiftsInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutShiftsInput
    upsert?: OrganizationUpsertWithoutShiftsInput
    connect?: OrganizationWhereUniqueInput
    update?: XOR<XOR<OrganizationUpdateToOneWithWhereWithoutShiftsInput, OrganizationUpdateWithoutShiftsInput>, OrganizationUncheckedUpdateWithoutShiftsInput>
  }

  export type PlannedBreakUncheckedUpdateManyWithoutShiftNestedInput = {
    create?: XOR<PlannedBreakCreateWithoutShiftInput, PlannedBreakUncheckedCreateWithoutShiftInput> | PlannedBreakCreateWithoutShiftInput[] | PlannedBreakUncheckedCreateWithoutShiftInput[]
    connectOrCreate?: PlannedBreakCreateOrConnectWithoutShiftInput | PlannedBreakCreateOrConnectWithoutShiftInput[]
    upsert?: PlannedBreakUpsertWithWhereUniqueWithoutShiftInput | PlannedBreakUpsertWithWhereUniqueWithoutShiftInput[]
    createMany?: PlannedBreakCreateManyShiftInputEnvelope
    set?: PlannedBreakWhereUniqueInput | PlannedBreakWhereUniqueInput[]
    disconnect?: PlannedBreakWhereUniqueInput | PlannedBreakWhereUniqueInput[]
    delete?: PlannedBreakWhereUniqueInput | PlannedBreakWhereUniqueInput[]
    connect?: PlannedBreakWhereUniqueInput | PlannedBreakWhereUniqueInput[]
    update?: PlannedBreakUpdateWithWhereUniqueWithoutShiftInput | PlannedBreakUpdateWithWhereUniqueWithoutShiftInput[]
    updateMany?: PlannedBreakUpdateManyWithWhereWithoutShiftInput | PlannedBreakUpdateManyWithWhereWithoutShiftInput[]
    deleteMany?: PlannedBreakScalarWhereInput | PlannedBreakScalarWhereInput[]
  }

  export type LineUncheckedUpdateManyWithoutShiftsNestedInput = {
    create?: XOR<LineCreateWithoutShiftsInput, LineUncheckedCreateWithoutShiftsInput> | LineCreateWithoutShiftsInput[] | LineUncheckedCreateWithoutShiftsInput[]
    connectOrCreate?: LineCreateOrConnectWithoutShiftsInput | LineCreateOrConnectWithoutShiftsInput[]
    upsert?: LineUpsertWithWhereUniqueWithoutShiftsInput | LineUpsertWithWhereUniqueWithoutShiftsInput[]
    set?: LineWhereUniqueInput | LineWhereUniqueInput[]
    disconnect?: LineWhereUniqueInput | LineWhereUniqueInput[]
    delete?: LineWhereUniqueInput | LineWhereUniqueInput[]
    connect?: LineWhereUniqueInput | LineWhereUniqueInput[]
    update?: LineUpdateWithWhereUniqueWithoutShiftsInput | LineUpdateWithWhereUniqueWithoutShiftsInput[]
    updateMany?: LineUpdateManyWithWhereWithoutShiftsInput | LineUpdateManyWithWhereWithoutShiftsInput[]
    deleteMany?: LineScalarWhereInput | LineScalarWhereInput[]
  }

  export type PlannedBreakCustomCreateNestedManyWithoutCustomShiftInput = {
    create?: XOR<PlannedBreakCustomCreateWithoutCustomShiftInput, PlannedBreakCustomUncheckedCreateWithoutCustomShiftInput> | PlannedBreakCustomCreateWithoutCustomShiftInput[] | PlannedBreakCustomUncheckedCreateWithoutCustomShiftInput[]
    connectOrCreate?: PlannedBreakCustomCreateOrConnectWithoutCustomShiftInput | PlannedBreakCustomCreateOrConnectWithoutCustomShiftInput[]
    createMany?: PlannedBreakCustomCreateManyCustomShiftInputEnvelope
    connect?: PlannedBreakCustomWhereUniqueInput | PlannedBreakCustomWhereUniqueInput[]
  }

  export type LineCreateNestedOneWithoutCustomShiftsInput = {
    create?: XOR<LineCreateWithoutCustomShiftsInput, LineUncheckedCreateWithoutCustomShiftsInput>
    connectOrCreate?: LineCreateOrConnectWithoutCustomShiftsInput
    connect?: LineWhereUniqueInput
  }

  export type PlannedBreakCustomUncheckedCreateNestedManyWithoutCustomShiftInput = {
    create?: XOR<PlannedBreakCustomCreateWithoutCustomShiftInput, PlannedBreakCustomUncheckedCreateWithoutCustomShiftInput> | PlannedBreakCustomCreateWithoutCustomShiftInput[] | PlannedBreakCustomUncheckedCreateWithoutCustomShiftInput[]
    connectOrCreate?: PlannedBreakCustomCreateOrConnectWithoutCustomShiftInput | PlannedBreakCustomCreateOrConnectWithoutCustomShiftInput[]
    createMany?: PlannedBreakCustomCreateManyCustomShiftInputEnvelope
    connect?: PlannedBreakCustomWhereUniqueInput | PlannedBreakCustomWhereUniqueInput[]
  }

  export type PlannedBreakCustomUpdateManyWithoutCustomShiftNestedInput = {
    create?: XOR<PlannedBreakCustomCreateWithoutCustomShiftInput, PlannedBreakCustomUncheckedCreateWithoutCustomShiftInput> | PlannedBreakCustomCreateWithoutCustomShiftInput[] | PlannedBreakCustomUncheckedCreateWithoutCustomShiftInput[]
    connectOrCreate?: PlannedBreakCustomCreateOrConnectWithoutCustomShiftInput | PlannedBreakCustomCreateOrConnectWithoutCustomShiftInput[]
    upsert?: PlannedBreakCustomUpsertWithWhereUniqueWithoutCustomShiftInput | PlannedBreakCustomUpsertWithWhereUniqueWithoutCustomShiftInput[]
    createMany?: PlannedBreakCustomCreateManyCustomShiftInputEnvelope
    set?: PlannedBreakCustomWhereUniqueInput | PlannedBreakCustomWhereUniqueInput[]
    disconnect?: PlannedBreakCustomWhereUniqueInput | PlannedBreakCustomWhereUniqueInput[]
    delete?: PlannedBreakCustomWhereUniqueInput | PlannedBreakCustomWhereUniqueInput[]
    connect?: PlannedBreakCustomWhereUniqueInput | PlannedBreakCustomWhereUniqueInput[]
    update?: PlannedBreakCustomUpdateWithWhereUniqueWithoutCustomShiftInput | PlannedBreakCustomUpdateWithWhereUniqueWithoutCustomShiftInput[]
    updateMany?: PlannedBreakCustomUpdateManyWithWhereWithoutCustomShiftInput | PlannedBreakCustomUpdateManyWithWhereWithoutCustomShiftInput[]
    deleteMany?: PlannedBreakCustomScalarWhereInput | PlannedBreakCustomScalarWhereInput[]
  }

  export type LineUpdateOneRequiredWithoutCustomShiftsNestedInput = {
    create?: XOR<LineCreateWithoutCustomShiftsInput, LineUncheckedCreateWithoutCustomShiftsInput>
    connectOrCreate?: LineCreateOrConnectWithoutCustomShiftsInput
    upsert?: LineUpsertWithoutCustomShiftsInput
    connect?: LineWhereUniqueInput
    update?: XOR<XOR<LineUpdateToOneWithWhereWithoutCustomShiftsInput, LineUpdateWithoutCustomShiftsInput>, LineUncheckedUpdateWithoutCustomShiftsInput>
  }

  export type PlannedBreakCustomUncheckedUpdateManyWithoutCustomShiftNestedInput = {
    create?: XOR<PlannedBreakCustomCreateWithoutCustomShiftInput, PlannedBreakCustomUncheckedCreateWithoutCustomShiftInput> | PlannedBreakCustomCreateWithoutCustomShiftInput[] | PlannedBreakCustomUncheckedCreateWithoutCustomShiftInput[]
    connectOrCreate?: PlannedBreakCustomCreateOrConnectWithoutCustomShiftInput | PlannedBreakCustomCreateOrConnectWithoutCustomShiftInput[]
    upsert?: PlannedBreakCustomUpsertWithWhereUniqueWithoutCustomShiftInput | PlannedBreakCustomUpsertWithWhereUniqueWithoutCustomShiftInput[]
    createMany?: PlannedBreakCustomCreateManyCustomShiftInputEnvelope
    set?: PlannedBreakCustomWhereUniqueInput | PlannedBreakCustomWhereUniqueInput[]
    disconnect?: PlannedBreakCustomWhereUniqueInput | PlannedBreakCustomWhereUniqueInput[]
    delete?: PlannedBreakCustomWhereUniqueInput | PlannedBreakCustomWhereUniqueInput[]
    connect?: PlannedBreakCustomWhereUniqueInput | PlannedBreakCustomWhereUniqueInput[]
    update?: PlannedBreakCustomUpdateWithWhereUniqueWithoutCustomShiftInput | PlannedBreakCustomUpdateWithWhereUniqueWithoutCustomShiftInput[]
    updateMany?: PlannedBreakCustomUpdateManyWithWhereWithoutCustomShiftInput | PlannedBreakCustomUpdateManyWithWhereWithoutCustomShiftInput[]
    deleteMany?: PlannedBreakCustomScalarWhereInput | PlannedBreakCustomScalarWhereInput[]
  }

  export type CustomShiftCreateNestedOneWithoutPlannedBreaksInput = {
    create?: XOR<CustomShiftCreateWithoutPlannedBreaksInput, CustomShiftUncheckedCreateWithoutPlannedBreaksInput>
    connectOrCreate?: CustomShiftCreateOrConnectWithoutPlannedBreaksInput
    connect?: CustomShiftWhereUniqueInput
  }

  export type CustomShiftUpdateOneRequiredWithoutPlannedBreaksNestedInput = {
    create?: XOR<CustomShiftCreateWithoutPlannedBreaksInput, CustomShiftUncheckedCreateWithoutPlannedBreaksInput>
    connectOrCreate?: CustomShiftCreateOrConnectWithoutPlannedBreaksInput
    upsert?: CustomShiftUpsertWithoutPlannedBreaksInput
    connect?: CustomShiftWhereUniqueInput
    update?: XOR<XOR<CustomShiftUpdateToOneWithWhereWithoutPlannedBreaksInput, CustomShiftUpdateWithoutPlannedBreaksInput>, CustomShiftUncheckedUpdateWithoutPlannedBreaksInput>
  }

  export type ShiftCreateNestedOneWithoutPlannedBreaksInput = {
    create?: XOR<ShiftCreateWithoutPlannedBreaksInput, ShiftUncheckedCreateWithoutPlannedBreaksInput>
    connectOrCreate?: ShiftCreateOrConnectWithoutPlannedBreaksInput
    connect?: ShiftWhereUniqueInput
  }

  export type EnumTypeOfBreakFieldUpdateOperationsInput = {
    set?: $Enums.TypeOfBreak
  }

  export type ShiftUpdateOneRequiredWithoutPlannedBreaksNestedInput = {
    create?: XOR<ShiftCreateWithoutPlannedBreaksInput, ShiftUncheckedCreateWithoutPlannedBreaksInput>
    connectOrCreate?: ShiftCreateOrConnectWithoutPlannedBreaksInput
    upsert?: ShiftUpsertWithoutPlannedBreaksInput
    connect?: ShiftWhereUniqueInput
    update?: XOR<XOR<ShiftUpdateToOneWithWhereWithoutPlannedBreaksInput, ShiftUpdateWithoutPlannedBreaksInput>, ShiftUncheckedUpdateWithoutPlannedBreaksInput>
  }

  export type CustomShiftCreateNestedManyWithoutLineInput = {
    create?: XOR<CustomShiftCreateWithoutLineInput, CustomShiftUncheckedCreateWithoutLineInput> | CustomShiftCreateWithoutLineInput[] | CustomShiftUncheckedCreateWithoutLineInput[]
    connectOrCreate?: CustomShiftCreateOrConnectWithoutLineInput | CustomShiftCreateOrConnectWithoutLineInput[]
    createMany?: CustomShiftCreateManyLineInputEnvelope
    connect?: CustomShiftWhereUniqueInput | CustomShiftWhereUniqueInput[]
  }

  export type OrganizationCreateNestedOneWithoutLinesInput = {
    create?: XOR<OrganizationCreateWithoutLinesInput, OrganizationUncheckedCreateWithoutLinesInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutLinesInput
    connect?: OrganizationWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutLinesInput = {
    create?: XOR<UserCreateWithoutLinesInput, UserUncheckedCreateWithoutLinesInput>
    connectOrCreate?: UserCreateOrConnectWithoutLinesInput
    connect?: UserWhereUniqueInput
  }

  export type ShiftCreateNestedManyWithoutLinesInput = {
    create?: XOR<ShiftCreateWithoutLinesInput, ShiftUncheckedCreateWithoutLinesInput> | ShiftCreateWithoutLinesInput[] | ShiftUncheckedCreateWithoutLinesInput[]
    connectOrCreate?: ShiftCreateOrConnectWithoutLinesInput | ShiftCreateOrConnectWithoutLinesInput[]
    connect?: ShiftWhereUniqueInput | ShiftWhereUniqueInput[]
  }

  export type StationCreateNestedManyWithoutLineInput = {
    create?: XOR<StationCreateWithoutLineInput, StationUncheckedCreateWithoutLineInput> | StationCreateWithoutLineInput[] | StationUncheckedCreateWithoutLineInput[]
    connectOrCreate?: StationCreateOrConnectWithoutLineInput | StationCreateOrConnectWithoutLineInput[]
    createMany?: StationCreateManyLineInputEnvelope
    connect?: StationWhereUniqueInput | StationWhereUniqueInput[]
  }

  export type DeviceCreateNestedManyWithoutLineInput = {
    create?: XOR<DeviceCreateWithoutLineInput, DeviceUncheckedCreateWithoutLineInput> | DeviceCreateWithoutLineInput[] | DeviceUncheckedCreateWithoutLineInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutLineInput | DeviceCreateOrConnectWithoutLineInput[]
    createMany?: DeviceCreateManyLineInputEnvelope
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
  }

  export type CustomShiftUncheckedCreateNestedManyWithoutLineInput = {
    create?: XOR<CustomShiftCreateWithoutLineInput, CustomShiftUncheckedCreateWithoutLineInput> | CustomShiftCreateWithoutLineInput[] | CustomShiftUncheckedCreateWithoutLineInput[]
    connectOrCreate?: CustomShiftCreateOrConnectWithoutLineInput | CustomShiftCreateOrConnectWithoutLineInput[]
    createMany?: CustomShiftCreateManyLineInputEnvelope
    connect?: CustomShiftWhereUniqueInput | CustomShiftWhereUniqueInput[]
  }

  export type ShiftUncheckedCreateNestedManyWithoutLinesInput = {
    create?: XOR<ShiftCreateWithoutLinesInput, ShiftUncheckedCreateWithoutLinesInput> | ShiftCreateWithoutLinesInput[] | ShiftUncheckedCreateWithoutLinesInput[]
    connectOrCreate?: ShiftCreateOrConnectWithoutLinesInput | ShiftCreateOrConnectWithoutLinesInput[]
    connect?: ShiftWhereUniqueInput | ShiftWhereUniqueInput[]
  }

  export type StationUncheckedCreateNestedManyWithoutLineInput = {
    create?: XOR<StationCreateWithoutLineInput, StationUncheckedCreateWithoutLineInput> | StationCreateWithoutLineInput[] | StationUncheckedCreateWithoutLineInput[]
    connectOrCreate?: StationCreateOrConnectWithoutLineInput | StationCreateOrConnectWithoutLineInput[]
    createMany?: StationCreateManyLineInputEnvelope
    connect?: StationWhereUniqueInput | StationWhereUniqueInput[]
  }

  export type DeviceUncheckedCreateNestedManyWithoutLineInput = {
    create?: XOR<DeviceCreateWithoutLineInput, DeviceUncheckedCreateWithoutLineInput> | DeviceCreateWithoutLineInput[] | DeviceUncheckedCreateWithoutLineInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutLineInput | DeviceCreateOrConnectWithoutLineInput[]
    createMany?: DeviceCreateManyLineInputEnvelope
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
  }

  export type CustomShiftUpdateManyWithoutLineNestedInput = {
    create?: XOR<CustomShiftCreateWithoutLineInput, CustomShiftUncheckedCreateWithoutLineInput> | CustomShiftCreateWithoutLineInput[] | CustomShiftUncheckedCreateWithoutLineInput[]
    connectOrCreate?: CustomShiftCreateOrConnectWithoutLineInput | CustomShiftCreateOrConnectWithoutLineInput[]
    upsert?: CustomShiftUpsertWithWhereUniqueWithoutLineInput | CustomShiftUpsertWithWhereUniqueWithoutLineInput[]
    createMany?: CustomShiftCreateManyLineInputEnvelope
    set?: CustomShiftWhereUniqueInput | CustomShiftWhereUniqueInput[]
    disconnect?: CustomShiftWhereUniqueInput | CustomShiftWhereUniqueInput[]
    delete?: CustomShiftWhereUniqueInput | CustomShiftWhereUniqueInput[]
    connect?: CustomShiftWhereUniqueInput | CustomShiftWhereUniqueInput[]
    update?: CustomShiftUpdateWithWhereUniqueWithoutLineInput | CustomShiftUpdateWithWhereUniqueWithoutLineInput[]
    updateMany?: CustomShiftUpdateManyWithWhereWithoutLineInput | CustomShiftUpdateManyWithWhereWithoutLineInput[]
    deleteMany?: CustomShiftScalarWhereInput | CustomShiftScalarWhereInput[]
  }

  export type OrganizationUpdateOneRequiredWithoutLinesNestedInput = {
    create?: XOR<OrganizationCreateWithoutLinesInput, OrganizationUncheckedCreateWithoutLinesInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutLinesInput
    upsert?: OrganizationUpsertWithoutLinesInput
    connect?: OrganizationWhereUniqueInput
    update?: XOR<XOR<OrganizationUpdateToOneWithWhereWithoutLinesInput, OrganizationUpdateWithoutLinesInput>, OrganizationUncheckedUpdateWithoutLinesInput>
  }

  export type UserUpdateOneRequiredWithoutLinesNestedInput = {
    create?: XOR<UserCreateWithoutLinesInput, UserUncheckedCreateWithoutLinesInput>
    connectOrCreate?: UserCreateOrConnectWithoutLinesInput
    upsert?: UserUpsertWithoutLinesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLinesInput, UserUpdateWithoutLinesInput>, UserUncheckedUpdateWithoutLinesInput>
  }

  export type ShiftUpdateManyWithoutLinesNestedInput = {
    create?: XOR<ShiftCreateWithoutLinesInput, ShiftUncheckedCreateWithoutLinesInput> | ShiftCreateWithoutLinesInput[] | ShiftUncheckedCreateWithoutLinesInput[]
    connectOrCreate?: ShiftCreateOrConnectWithoutLinesInput | ShiftCreateOrConnectWithoutLinesInput[]
    upsert?: ShiftUpsertWithWhereUniqueWithoutLinesInput | ShiftUpsertWithWhereUniqueWithoutLinesInput[]
    set?: ShiftWhereUniqueInput | ShiftWhereUniqueInput[]
    disconnect?: ShiftWhereUniqueInput | ShiftWhereUniqueInput[]
    delete?: ShiftWhereUniqueInput | ShiftWhereUniqueInput[]
    connect?: ShiftWhereUniqueInput | ShiftWhereUniqueInput[]
    update?: ShiftUpdateWithWhereUniqueWithoutLinesInput | ShiftUpdateWithWhereUniqueWithoutLinesInput[]
    updateMany?: ShiftUpdateManyWithWhereWithoutLinesInput | ShiftUpdateManyWithWhereWithoutLinesInput[]
    deleteMany?: ShiftScalarWhereInput | ShiftScalarWhereInput[]
  }

  export type StationUpdateManyWithoutLineNestedInput = {
    create?: XOR<StationCreateWithoutLineInput, StationUncheckedCreateWithoutLineInput> | StationCreateWithoutLineInput[] | StationUncheckedCreateWithoutLineInput[]
    connectOrCreate?: StationCreateOrConnectWithoutLineInput | StationCreateOrConnectWithoutLineInput[]
    upsert?: StationUpsertWithWhereUniqueWithoutLineInput | StationUpsertWithWhereUniqueWithoutLineInput[]
    createMany?: StationCreateManyLineInputEnvelope
    set?: StationWhereUniqueInput | StationWhereUniqueInput[]
    disconnect?: StationWhereUniqueInput | StationWhereUniqueInput[]
    delete?: StationWhereUniqueInput | StationWhereUniqueInput[]
    connect?: StationWhereUniqueInput | StationWhereUniqueInput[]
    update?: StationUpdateWithWhereUniqueWithoutLineInput | StationUpdateWithWhereUniqueWithoutLineInput[]
    updateMany?: StationUpdateManyWithWhereWithoutLineInput | StationUpdateManyWithWhereWithoutLineInput[]
    deleteMany?: StationScalarWhereInput | StationScalarWhereInput[]
  }

  export type DeviceUpdateManyWithoutLineNestedInput = {
    create?: XOR<DeviceCreateWithoutLineInput, DeviceUncheckedCreateWithoutLineInput> | DeviceCreateWithoutLineInput[] | DeviceUncheckedCreateWithoutLineInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutLineInput | DeviceCreateOrConnectWithoutLineInput[]
    upsert?: DeviceUpsertWithWhereUniqueWithoutLineInput | DeviceUpsertWithWhereUniqueWithoutLineInput[]
    createMany?: DeviceCreateManyLineInputEnvelope
    set?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    disconnect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    delete?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    update?: DeviceUpdateWithWhereUniqueWithoutLineInput | DeviceUpdateWithWhereUniqueWithoutLineInput[]
    updateMany?: DeviceUpdateManyWithWhereWithoutLineInput | DeviceUpdateManyWithWhereWithoutLineInput[]
    deleteMany?: DeviceScalarWhereInput | DeviceScalarWhereInput[]
  }

  export type CustomShiftUncheckedUpdateManyWithoutLineNestedInput = {
    create?: XOR<CustomShiftCreateWithoutLineInput, CustomShiftUncheckedCreateWithoutLineInput> | CustomShiftCreateWithoutLineInput[] | CustomShiftUncheckedCreateWithoutLineInput[]
    connectOrCreate?: CustomShiftCreateOrConnectWithoutLineInput | CustomShiftCreateOrConnectWithoutLineInput[]
    upsert?: CustomShiftUpsertWithWhereUniqueWithoutLineInput | CustomShiftUpsertWithWhereUniqueWithoutLineInput[]
    createMany?: CustomShiftCreateManyLineInputEnvelope
    set?: CustomShiftWhereUniqueInput | CustomShiftWhereUniqueInput[]
    disconnect?: CustomShiftWhereUniqueInput | CustomShiftWhereUniqueInput[]
    delete?: CustomShiftWhereUniqueInput | CustomShiftWhereUniqueInput[]
    connect?: CustomShiftWhereUniqueInput | CustomShiftWhereUniqueInput[]
    update?: CustomShiftUpdateWithWhereUniqueWithoutLineInput | CustomShiftUpdateWithWhereUniqueWithoutLineInput[]
    updateMany?: CustomShiftUpdateManyWithWhereWithoutLineInput | CustomShiftUpdateManyWithWhereWithoutLineInput[]
    deleteMany?: CustomShiftScalarWhereInput | CustomShiftScalarWhereInput[]
  }

  export type ShiftUncheckedUpdateManyWithoutLinesNestedInput = {
    create?: XOR<ShiftCreateWithoutLinesInput, ShiftUncheckedCreateWithoutLinesInput> | ShiftCreateWithoutLinesInput[] | ShiftUncheckedCreateWithoutLinesInput[]
    connectOrCreate?: ShiftCreateOrConnectWithoutLinesInput | ShiftCreateOrConnectWithoutLinesInput[]
    upsert?: ShiftUpsertWithWhereUniqueWithoutLinesInput | ShiftUpsertWithWhereUniqueWithoutLinesInput[]
    set?: ShiftWhereUniqueInput | ShiftWhereUniqueInput[]
    disconnect?: ShiftWhereUniqueInput | ShiftWhereUniqueInput[]
    delete?: ShiftWhereUniqueInput | ShiftWhereUniqueInput[]
    connect?: ShiftWhereUniqueInput | ShiftWhereUniqueInput[]
    update?: ShiftUpdateWithWhereUniqueWithoutLinesInput | ShiftUpdateWithWhereUniqueWithoutLinesInput[]
    updateMany?: ShiftUpdateManyWithWhereWithoutLinesInput | ShiftUpdateManyWithWhereWithoutLinesInput[]
    deleteMany?: ShiftScalarWhereInput | ShiftScalarWhereInput[]
  }

  export type StationUncheckedUpdateManyWithoutLineNestedInput = {
    create?: XOR<StationCreateWithoutLineInput, StationUncheckedCreateWithoutLineInput> | StationCreateWithoutLineInput[] | StationUncheckedCreateWithoutLineInput[]
    connectOrCreate?: StationCreateOrConnectWithoutLineInput | StationCreateOrConnectWithoutLineInput[]
    upsert?: StationUpsertWithWhereUniqueWithoutLineInput | StationUpsertWithWhereUniqueWithoutLineInput[]
    createMany?: StationCreateManyLineInputEnvelope
    set?: StationWhereUniqueInput | StationWhereUniqueInput[]
    disconnect?: StationWhereUniqueInput | StationWhereUniqueInput[]
    delete?: StationWhereUniqueInput | StationWhereUniqueInput[]
    connect?: StationWhereUniqueInput | StationWhereUniqueInput[]
    update?: StationUpdateWithWhereUniqueWithoutLineInput | StationUpdateWithWhereUniqueWithoutLineInput[]
    updateMany?: StationUpdateManyWithWhereWithoutLineInput | StationUpdateManyWithWhereWithoutLineInput[]
    deleteMany?: StationScalarWhereInput | StationScalarWhereInput[]
  }

  export type DeviceUncheckedUpdateManyWithoutLineNestedInput = {
    create?: XOR<DeviceCreateWithoutLineInput, DeviceUncheckedCreateWithoutLineInput> | DeviceCreateWithoutLineInput[] | DeviceUncheckedCreateWithoutLineInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutLineInput | DeviceCreateOrConnectWithoutLineInput[]
    upsert?: DeviceUpsertWithWhereUniqueWithoutLineInput | DeviceUpsertWithWhereUniqueWithoutLineInput[]
    createMany?: DeviceCreateManyLineInputEnvelope
    set?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    disconnect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    delete?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    update?: DeviceUpdateWithWhereUniqueWithoutLineInput | DeviceUpdateWithWhereUniqueWithoutLineInput[]
    updateMany?: DeviceUpdateManyWithWhereWithoutLineInput | DeviceUpdateManyWithWhereWithoutLineInput[]
    deleteMany?: DeviceScalarWhereInput | DeviceScalarWhereInput[]
  }

  export type LineCreateNestedOneWithoutStationsInput = {
    create?: XOR<LineCreateWithoutStationsInput, LineUncheckedCreateWithoutStationsInput>
    connectOrCreate?: LineCreateOrConnectWithoutStationsInput
    connect?: LineWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type LineUpdateOneRequiredWithoutStationsNestedInput = {
    create?: XOR<LineCreateWithoutStationsInput, LineUncheckedCreateWithoutStationsInput>
    connectOrCreate?: LineCreateOrConnectWithoutStationsInput
    upsert?: LineUpsertWithoutStationsInput
    connect?: LineWhereUniqueInput
    update?: XOR<XOR<LineUpdateToOneWithWhereWithoutStationsInput, LineUpdateWithoutStationsInput>, LineUncheckedUpdateWithoutStationsInput>
  }

  export type LineCreateNestedManyWithoutUserInput = {
    create?: XOR<LineCreateWithoutUserInput, LineUncheckedCreateWithoutUserInput> | LineCreateWithoutUserInput[] | LineUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LineCreateOrConnectWithoutUserInput | LineCreateOrConnectWithoutUserInput[]
    createMany?: LineCreateManyUserInputEnvelope
    connect?: LineWhereUniqueInput | LineWhereUniqueInput[]
  }

  export type OrganizationCreateNestedOneWithoutUsersInput = {
    create?: XOR<OrganizationCreateWithoutUsersInput, OrganizationUncheckedCreateWithoutUsersInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutUsersInput
    connect?: OrganizationWhereUniqueInput
  }

  export type LineUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<LineCreateWithoutUserInput, LineUncheckedCreateWithoutUserInput> | LineCreateWithoutUserInput[] | LineUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LineCreateOrConnectWithoutUserInput | LineCreateOrConnectWithoutUserInput[]
    createMany?: LineCreateManyUserInputEnvelope
    connect?: LineWhereUniqueInput | LineWhereUniqueInput[]
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type EnumStatusFieldUpdateOperationsInput = {
    set?: $Enums.Status
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type LineUpdateManyWithoutUserNestedInput = {
    create?: XOR<LineCreateWithoutUserInput, LineUncheckedCreateWithoutUserInput> | LineCreateWithoutUserInput[] | LineUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LineCreateOrConnectWithoutUserInput | LineCreateOrConnectWithoutUserInput[]
    upsert?: LineUpsertWithWhereUniqueWithoutUserInput | LineUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LineCreateManyUserInputEnvelope
    set?: LineWhereUniqueInput | LineWhereUniqueInput[]
    disconnect?: LineWhereUniqueInput | LineWhereUniqueInput[]
    delete?: LineWhereUniqueInput | LineWhereUniqueInput[]
    connect?: LineWhereUniqueInput | LineWhereUniqueInput[]
    update?: LineUpdateWithWhereUniqueWithoutUserInput | LineUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LineUpdateManyWithWhereWithoutUserInput | LineUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LineScalarWhereInput | LineScalarWhereInput[]
  }

  export type OrganizationUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<OrganizationCreateWithoutUsersInput, OrganizationUncheckedCreateWithoutUsersInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutUsersInput
    upsert?: OrganizationUpsertWithoutUsersInput
    connect?: OrganizationWhereUniqueInput
    update?: XOR<XOR<OrganizationUpdateToOneWithWhereWithoutUsersInput, OrganizationUpdateWithoutUsersInput>, OrganizationUncheckedUpdateWithoutUsersInput>
  }

  export type LineUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<LineCreateWithoutUserInput, LineUncheckedCreateWithoutUserInput> | LineCreateWithoutUserInput[] | LineUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LineCreateOrConnectWithoutUserInput | LineCreateOrConnectWithoutUserInput[]
    upsert?: LineUpsertWithWhereUniqueWithoutUserInput | LineUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LineCreateManyUserInputEnvelope
    set?: LineWhereUniqueInput | LineWhereUniqueInput[]
    disconnect?: LineWhereUniqueInput | LineWhereUniqueInput[]
    delete?: LineWhereUniqueInput | LineWhereUniqueInput[]
    connect?: LineWhereUniqueInput | LineWhereUniqueInput[]
    update?: LineUpdateWithWhereUniqueWithoutUserInput | LineUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LineUpdateManyWithWhereWithoutUserInput | LineUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LineScalarWhereInput | LineScalarWhereInput[]
  }

  export type OrganizationCreateNestedOneWithoutDevicesInput = {
    create?: XOR<OrganizationCreateWithoutDevicesInput, OrganizationUncheckedCreateWithoutDevicesInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutDevicesInput
    connect?: OrganizationWhereUniqueInput
  }

  export type LineCreateNestedOneWithoutDevicesInput = {
    create?: XOR<LineCreateWithoutDevicesInput, LineUncheckedCreateWithoutDevicesInput>
    connectOrCreate?: LineCreateOrConnectWithoutDevicesInput
    connect?: LineWhereUniqueInput
  }

  export type EnumDeviceStatusFieldUpdateOperationsInput = {
    set?: $Enums.DeviceStatus
  }

  export type OrganizationUpdateOneRequiredWithoutDevicesNestedInput = {
    create?: XOR<OrganizationCreateWithoutDevicesInput, OrganizationUncheckedCreateWithoutDevicesInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutDevicesInput
    upsert?: OrganizationUpsertWithoutDevicesInput
    connect?: OrganizationWhereUniqueInput
    update?: XOR<XOR<OrganizationUpdateToOneWithWhereWithoutDevicesInput, OrganizationUpdateWithoutDevicesInput>, OrganizationUncheckedUpdateWithoutDevicesInput>
  }

  export type LineUpdateOneRequiredWithoutDevicesNestedInput = {
    create?: XOR<LineCreateWithoutDevicesInput, LineUncheckedCreateWithoutDevicesInput>
    connectOrCreate?: LineCreateOrConnectWithoutDevicesInput
    upsert?: LineUpsertWithoutDevicesInput
    connect?: LineWhereUniqueInput
    update?: XOR<XOR<LineUpdateToOneWithWhereWithoutDevicesInput, LineUpdateWithoutDevicesInput>, LineUncheckedUpdateWithoutDevicesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumTypeOfBreakFilter<$PrismaModel = never> = {
    equals?: $Enums.TypeOfBreak | EnumTypeOfBreakFieldRefInput<$PrismaModel>
    in?: $Enums.TypeOfBreak[] | ListEnumTypeOfBreakFieldRefInput<$PrismaModel>
    notIn?: $Enums.TypeOfBreak[] | ListEnumTypeOfBreakFieldRefInput<$PrismaModel>
    not?: NestedEnumTypeOfBreakFilter<$PrismaModel> | $Enums.TypeOfBreak
  }

  export type NestedEnumTypeOfBreakWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TypeOfBreak | EnumTypeOfBreakFieldRefInput<$PrismaModel>
    in?: $Enums.TypeOfBreak[] | ListEnumTypeOfBreakFieldRefInput<$PrismaModel>
    notIn?: $Enums.TypeOfBreak[] | ListEnumTypeOfBreakFieldRefInput<$PrismaModel>
    not?: NestedEnumTypeOfBreakWithAggregatesFilter<$PrismaModel> | $Enums.TypeOfBreak
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTypeOfBreakFilter<$PrismaModel>
    _max?: NestedEnumTypeOfBreakFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedEnumStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.Status | EnumStatusFieldRefInput<$PrismaModel>
    in?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusFilter<$PrismaModel> | $Enums.Status
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedEnumStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Status | EnumStatusFieldRefInput<$PrismaModel>
    in?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusWithAggregatesFilter<$PrismaModel> | $Enums.Status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusFilter<$PrismaModel>
    _max?: NestedEnumStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumDeviceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceStatus | EnumDeviceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceStatus[] | ListEnumDeviceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeviceStatus[] | ListEnumDeviceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDeviceStatusFilter<$PrismaModel> | $Enums.DeviceStatus
  }

  export type NestedEnumDeviceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceStatus | EnumDeviceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceStatus[] | ListEnumDeviceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeviceStatus[] | ListEnumDeviceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDeviceStatusWithAggregatesFilter<$PrismaModel> | $Enums.DeviceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeviceStatusFilter<$PrismaModel>
    _max?: NestedEnumDeviceStatusFilter<$PrismaModel>
  }

  export type ShiftCreateWithoutOrganizationInput = {
    id?: string
    start: string
    end: string
    plannedBreaks?: PlannedBreakCreateNestedManyWithoutShiftInput
    lines?: LineCreateNestedManyWithoutShiftsInput
  }

  export type ShiftUncheckedCreateWithoutOrganizationInput = {
    id?: string
    start: string
    end: string
    plannedBreaks?: PlannedBreakUncheckedCreateNestedManyWithoutShiftInput
    lines?: LineUncheckedCreateNestedManyWithoutShiftsInput
  }

  export type ShiftCreateOrConnectWithoutOrganizationInput = {
    where: ShiftWhereUniqueInput
    create: XOR<ShiftCreateWithoutOrganizationInput, ShiftUncheckedCreateWithoutOrganizationInput>
  }

  export type ShiftCreateManyOrganizationInputEnvelope = {
    data: ShiftCreateManyOrganizationInput | ShiftCreateManyOrganizationInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutOrganizationInput = {
    id?: string
    name: string
    email: string
    password: string
    role: $Enums.Role
    status?: $Enums.Status
    createdAt?: Date | string
    address: string
    phoneNumber: string
    lastLogin?: Date | string | null
    lines?: LineCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOrganizationInput = {
    id?: string
    name: string
    email: string
    password: string
    role: $Enums.Role
    status?: $Enums.Status
    createdAt?: Date | string
    address: string
    phoneNumber: string
    lastLogin?: Date | string | null
    lines?: LineUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOrganizationInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput>
  }

  export type UserCreateManyOrganizationInputEnvelope = {
    data: UserCreateManyOrganizationInput | UserCreateManyOrganizationInput[]
    skipDuplicates?: boolean
  }

  export type DeviceCreateWithoutOrganizationInput = {
    id?: string
    name: string
    type: string
    status: $Enums.DeviceStatus
    line: LineCreateNestedOneWithoutDevicesInput
  }

  export type DeviceUncheckedCreateWithoutOrganizationInput = {
    id?: string
    name: string
    type: string
    lineId: string
    status: $Enums.DeviceStatus
  }

  export type DeviceCreateOrConnectWithoutOrganizationInput = {
    where: DeviceWhereUniqueInput
    create: XOR<DeviceCreateWithoutOrganizationInput, DeviceUncheckedCreateWithoutOrganizationInput>
  }

  export type DeviceCreateManyOrganizationInputEnvelope = {
    data: DeviceCreateManyOrganizationInput | DeviceCreateManyOrganizationInput[]
    skipDuplicates?: boolean
  }

  export type LineCreateWithoutOrganizationInput = {
    id?: string
    name: string
    type: string
    customShifts?: CustomShiftCreateNestedManyWithoutLineInput
    user: UserCreateNestedOneWithoutLinesInput
    shifts?: ShiftCreateNestedManyWithoutLinesInput
    stations?: StationCreateNestedManyWithoutLineInput
    devices?: DeviceCreateNestedManyWithoutLineInput
  }

  export type LineUncheckedCreateWithoutOrganizationInput = {
    id?: string
    name: string
    type: string
    userId: string
    customShifts?: CustomShiftUncheckedCreateNestedManyWithoutLineInput
    shifts?: ShiftUncheckedCreateNestedManyWithoutLinesInput
    stations?: StationUncheckedCreateNestedManyWithoutLineInput
    devices?: DeviceUncheckedCreateNestedManyWithoutLineInput
  }

  export type LineCreateOrConnectWithoutOrganizationInput = {
    where: LineWhereUniqueInput
    create: XOR<LineCreateWithoutOrganizationInput, LineUncheckedCreateWithoutOrganizationInput>
  }

  export type LineCreateManyOrganizationInputEnvelope = {
    data: LineCreateManyOrganizationInput | LineCreateManyOrganizationInput[]
    skipDuplicates?: boolean
  }

  export type ShiftUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: ShiftWhereUniqueInput
    update: XOR<ShiftUpdateWithoutOrganizationInput, ShiftUncheckedUpdateWithoutOrganizationInput>
    create: XOR<ShiftCreateWithoutOrganizationInput, ShiftUncheckedCreateWithoutOrganizationInput>
  }

  export type ShiftUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: ShiftWhereUniqueInput
    data: XOR<ShiftUpdateWithoutOrganizationInput, ShiftUncheckedUpdateWithoutOrganizationInput>
  }

  export type ShiftUpdateManyWithWhereWithoutOrganizationInput = {
    where: ShiftScalarWhereInput
    data: XOR<ShiftUpdateManyMutationInput, ShiftUncheckedUpdateManyWithoutOrganizationInput>
  }

  export type ShiftScalarWhereInput = {
    AND?: ShiftScalarWhereInput | ShiftScalarWhereInput[]
    OR?: ShiftScalarWhereInput[]
    NOT?: ShiftScalarWhereInput | ShiftScalarWhereInput[]
    id?: StringFilter<"Shift"> | string
    start?: StringFilter<"Shift"> | string
    end?: StringFilter<"Shift"> | string
    organizationId?: StringFilter<"Shift"> | string
  }

  export type UserUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutOrganizationInput, UserUncheckedUpdateWithoutOrganizationInput>
    create: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput>
  }

  export type UserUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutOrganizationInput, UserUncheckedUpdateWithoutOrganizationInput>
  }

  export type UserUpdateManyWithWhereWithoutOrganizationInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutOrganizationInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    status?: EnumStatusFilter<"User"> | $Enums.Status
    createdAt?: DateTimeFilter<"User"> | Date | string
    address?: StringFilter<"User"> | string
    phoneNumber?: StringFilter<"User"> | string
    lastLogin?: DateTimeNullableFilter<"User"> | Date | string | null
    organizationId?: StringFilter<"User"> | string
  }

  export type DeviceUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: DeviceWhereUniqueInput
    update: XOR<DeviceUpdateWithoutOrganizationInput, DeviceUncheckedUpdateWithoutOrganizationInput>
    create: XOR<DeviceCreateWithoutOrganizationInput, DeviceUncheckedCreateWithoutOrganizationInput>
  }

  export type DeviceUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: DeviceWhereUniqueInput
    data: XOR<DeviceUpdateWithoutOrganizationInput, DeviceUncheckedUpdateWithoutOrganizationInput>
  }

  export type DeviceUpdateManyWithWhereWithoutOrganizationInput = {
    where: DeviceScalarWhereInput
    data: XOR<DeviceUpdateManyMutationInput, DeviceUncheckedUpdateManyWithoutOrganizationInput>
  }

  export type DeviceScalarWhereInput = {
    AND?: DeviceScalarWhereInput | DeviceScalarWhereInput[]
    OR?: DeviceScalarWhereInput[]
    NOT?: DeviceScalarWhereInput | DeviceScalarWhereInput[]
    id?: StringFilter<"Device"> | string
    name?: StringFilter<"Device"> | string
    type?: StringFilter<"Device"> | string
    organizationId?: StringFilter<"Device"> | string
    lineId?: StringFilter<"Device"> | string
    status?: EnumDeviceStatusFilter<"Device"> | $Enums.DeviceStatus
  }

  export type LineUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: LineWhereUniqueInput
    update: XOR<LineUpdateWithoutOrganizationInput, LineUncheckedUpdateWithoutOrganizationInput>
    create: XOR<LineCreateWithoutOrganizationInput, LineUncheckedCreateWithoutOrganizationInput>
  }

  export type LineUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: LineWhereUniqueInput
    data: XOR<LineUpdateWithoutOrganizationInput, LineUncheckedUpdateWithoutOrganizationInput>
  }

  export type LineUpdateManyWithWhereWithoutOrganizationInput = {
    where: LineScalarWhereInput
    data: XOR<LineUpdateManyMutationInput, LineUncheckedUpdateManyWithoutOrganizationInput>
  }

  export type LineScalarWhereInput = {
    AND?: LineScalarWhereInput | LineScalarWhereInput[]
    OR?: LineScalarWhereInput[]
    NOT?: LineScalarWhereInput | LineScalarWhereInput[]
    id?: StringFilter<"Line"> | string
    name?: StringFilter<"Line"> | string
    type?: StringFilter<"Line"> | string
    organizationId?: StringFilter<"Line"> | string
    userId?: StringFilter<"Line"> | string
  }

  export type PlannedBreakCreateWithoutShiftInput = {
    id?: string
    start: string
    end: string
    type: $Enums.TypeOfBreak
  }

  export type PlannedBreakUncheckedCreateWithoutShiftInput = {
    id?: string
    start: string
    end: string
    type: $Enums.TypeOfBreak
  }

  export type PlannedBreakCreateOrConnectWithoutShiftInput = {
    where: PlannedBreakWhereUniqueInput
    create: XOR<PlannedBreakCreateWithoutShiftInput, PlannedBreakUncheckedCreateWithoutShiftInput>
  }

  export type PlannedBreakCreateManyShiftInputEnvelope = {
    data: PlannedBreakCreateManyShiftInput | PlannedBreakCreateManyShiftInput[]
    skipDuplicates?: boolean
  }

  export type LineCreateWithoutShiftsInput = {
    id?: string
    name: string
    type: string
    customShifts?: CustomShiftCreateNestedManyWithoutLineInput
    organization: OrganizationCreateNestedOneWithoutLinesInput
    user: UserCreateNestedOneWithoutLinesInput
    stations?: StationCreateNestedManyWithoutLineInput
    devices?: DeviceCreateNestedManyWithoutLineInput
  }

  export type LineUncheckedCreateWithoutShiftsInput = {
    id?: string
    name: string
    type: string
    organizationId: string
    userId: string
    customShifts?: CustomShiftUncheckedCreateNestedManyWithoutLineInput
    stations?: StationUncheckedCreateNestedManyWithoutLineInput
    devices?: DeviceUncheckedCreateNestedManyWithoutLineInput
  }

  export type LineCreateOrConnectWithoutShiftsInput = {
    where: LineWhereUniqueInput
    create: XOR<LineCreateWithoutShiftsInput, LineUncheckedCreateWithoutShiftsInput>
  }

  export type OrganizationCreateWithoutShiftsInput = {
    id?: string
    name: string
    email: string
    address: string
    phoneNumber: string
    imageUrl?: string | null
    shiftNumber: number
    unit: string
    Department: string
    Desingation: string
    users?: UserCreateNestedManyWithoutOrganizationInput
    devices?: DeviceCreateNestedManyWithoutOrganizationInput
    lines?: LineCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateWithoutShiftsInput = {
    id?: string
    name: string
    email: string
    address: string
    phoneNumber: string
    imageUrl?: string | null
    shiftNumber: number
    unit: string
    Department: string
    Desingation: string
    users?: UserUncheckedCreateNestedManyWithoutOrganizationInput
    devices?: DeviceUncheckedCreateNestedManyWithoutOrganizationInput
    lines?: LineUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationCreateOrConnectWithoutShiftsInput = {
    where: OrganizationWhereUniqueInput
    create: XOR<OrganizationCreateWithoutShiftsInput, OrganizationUncheckedCreateWithoutShiftsInput>
  }

  export type PlannedBreakUpsertWithWhereUniqueWithoutShiftInput = {
    where: PlannedBreakWhereUniqueInput
    update: XOR<PlannedBreakUpdateWithoutShiftInput, PlannedBreakUncheckedUpdateWithoutShiftInput>
    create: XOR<PlannedBreakCreateWithoutShiftInput, PlannedBreakUncheckedCreateWithoutShiftInput>
  }

  export type PlannedBreakUpdateWithWhereUniqueWithoutShiftInput = {
    where: PlannedBreakWhereUniqueInput
    data: XOR<PlannedBreakUpdateWithoutShiftInput, PlannedBreakUncheckedUpdateWithoutShiftInput>
  }

  export type PlannedBreakUpdateManyWithWhereWithoutShiftInput = {
    where: PlannedBreakScalarWhereInput
    data: XOR<PlannedBreakUpdateManyMutationInput, PlannedBreakUncheckedUpdateManyWithoutShiftInput>
  }

  export type PlannedBreakScalarWhereInput = {
    AND?: PlannedBreakScalarWhereInput | PlannedBreakScalarWhereInput[]
    OR?: PlannedBreakScalarWhereInput[]
    NOT?: PlannedBreakScalarWhereInput | PlannedBreakScalarWhereInput[]
    id?: StringFilter<"PlannedBreak"> | string
    start?: StringFilter<"PlannedBreak"> | string
    end?: StringFilter<"PlannedBreak"> | string
    type?: EnumTypeOfBreakFilter<"PlannedBreak"> | $Enums.TypeOfBreak
    ShiftId?: StringFilter<"PlannedBreak"> | string
  }

  export type LineUpsertWithWhereUniqueWithoutShiftsInput = {
    where: LineWhereUniqueInput
    update: XOR<LineUpdateWithoutShiftsInput, LineUncheckedUpdateWithoutShiftsInput>
    create: XOR<LineCreateWithoutShiftsInput, LineUncheckedCreateWithoutShiftsInput>
  }

  export type LineUpdateWithWhereUniqueWithoutShiftsInput = {
    where: LineWhereUniqueInput
    data: XOR<LineUpdateWithoutShiftsInput, LineUncheckedUpdateWithoutShiftsInput>
  }

  export type LineUpdateManyWithWhereWithoutShiftsInput = {
    where: LineScalarWhereInput
    data: XOR<LineUpdateManyMutationInput, LineUncheckedUpdateManyWithoutShiftsInput>
  }

  export type OrganizationUpsertWithoutShiftsInput = {
    update: XOR<OrganizationUpdateWithoutShiftsInput, OrganizationUncheckedUpdateWithoutShiftsInput>
    create: XOR<OrganizationCreateWithoutShiftsInput, OrganizationUncheckedCreateWithoutShiftsInput>
    where?: OrganizationWhereInput
  }

  export type OrganizationUpdateToOneWithWhereWithoutShiftsInput = {
    where?: OrganizationWhereInput
    data: XOR<OrganizationUpdateWithoutShiftsInput, OrganizationUncheckedUpdateWithoutShiftsInput>
  }

  export type OrganizationUpdateWithoutShiftsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    shiftNumber?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    Department?: StringFieldUpdateOperationsInput | string
    Desingation?: StringFieldUpdateOperationsInput | string
    users?: UserUpdateManyWithoutOrganizationNestedInput
    devices?: DeviceUpdateManyWithoutOrganizationNestedInput
    lines?: LineUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateWithoutShiftsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    shiftNumber?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    Department?: StringFieldUpdateOperationsInput | string
    Desingation?: StringFieldUpdateOperationsInput | string
    users?: UserUncheckedUpdateManyWithoutOrganizationNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutOrganizationNestedInput
    lines?: LineUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type PlannedBreakCustomCreateWithoutCustomShiftInput = {
    id?: string
    start: string
    end: string
    typeOfBreak: string
  }

  export type PlannedBreakCustomUncheckedCreateWithoutCustomShiftInput = {
    id?: string
    start: string
    end: string
    typeOfBreak: string
  }

  export type PlannedBreakCustomCreateOrConnectWithoutCustomShiftInput = {
    where: PlannedBreakCustomWhereUniqueInput
    create: XOR<PlannedBreakCustomCreateWithoutCustomShiftInput, PlannedBreakCustomUncheckedCreateWithoutCustomShiftInput>
  }

  export type PlannedBreakCustomCreateManyCustomShiftInputEnvelope = {
    data: PlannedBreakCustomCreateManyCustomShiftInput | PlannedBreakCustomCreateManyCustomShiftInput[]
    skipDuplicates?: boolean
  }

  export type LineCreateWithoutCustomShiftsInput = {
    id?: string
    name: string
    type: string
    organization: OrganizationCreateNestedOneWithoutLinesInput
    user: UserCreateNestedOneWithoutLinesInput
    shifts?: ShiftCreateNestedManyWithoutLinesInput
    stations?: StationCreateNestedManyWithoutLineInput
    devices?: DeviceCreateNestedManyWithoutLineInput
  }

  export type LineUncheckedCreateWithoutCustomShiftsInput = {
    id?: string
    name: string
    type: string
    organizationId: string
    userId: string
    shifts?: ShiftUncheckedCreateNestedManyWithoutLinesInput
    stations?: StationUncheckedCreateNestedManyWithoutLineInput
    devices?: DeviceUncheckedCreateNestedManyWithoutLineInput
  }

  export type LineCreateOrConnectWithoutCustomShiftsInput = {
    where: LineWhereUniqueInput
    create: XOR<LineCreateWithoutCustomShiftsInput, LineUncheckedCreateWithoutCustomShiftsInput>
  }

  export type PlannedBreakCustomUpsertWithWhereUniqueWithoutCustomShiftInput = {
    where: PlannedBreakCustomWhereUniqueInput
    update: XOR<PlannedBreakCustomUpdateWithoutCustomShiftInput, PlannedBreakCustomUncheckedUpdateWithoutCustomShiftInput>
    create: XOR<PlannedBreakCustomCreateWithoutCustomShiftInput, PlannedBreakCustomUncheckedCreateWithoutCustomShiftInput>
  }

  export type PlannedBreakCustomUpdateWithWhereUniqueWithoutCustomShiftInput = {
    where: PlannedBreakCustomWhereUniqueInput
    data: XOR<PlannedBreakCustomUpdateWithoutCustomShiftInput, PlannedBreakCustomUncheckedUpdateWithoutCustomShiftInput>
  }

  export type PlannedBreakCustomUpdateManyWithWhereWithoutCustomShiftInput = {
    where: PlannedBreakCustomScalarWhereInput
    data: XOR<PlannedBreakCustomUpdateManyMutationInput, PlannedBreakCustomUncheckedUpdateManyWithoutCustomShiftInput>
  }

  export type PlannedBreakCustomScalarWhereInput = {
    AND?: PlannedBreakCustomScalarWhereInput | PlannedBreakCustomScalarWhereInput[]
    OR?: PlannedBreakCustomScalarWhereInput[]
    NOT?: PlannedBreakCustomScalarWhereInput | PlannedBreakCustomScalarWhereInput[]
    id?: StringFilter<"PlannedBreakCustom"> | string
    start?: StringFilter<"PlannedBreakCustom"> | string
    end?: StringFilter<"PlannedBreakCustom"> | string
    typeOfBreak?: StringFilter<"PlannedBreakCustom"> | string
    customShiftTimingId?: StringFilter<"PlannedBreakCustom"> | string
  }

  export type LineUpsertWithoutCustomShiftsInput = {
    update: XOR<LineUpdateWithoutCustomShiftsInput, LineUncheckedUpdateWithoutCustomShiftsInput>
    create: XOR<LineCreateWithoutCustomShiftsInput, LineUncheckedCreateWithoutCustomShiftsInput>
    where?: LineWhereInput
  }

  export type LineUpdateToOneWithWhereWithoutCustomShiftsInput = {
    where?: LineWhereInput
    data: XOR<LineUpdateWithoutCustomShiftsInput, LineUncheckedUpdateWithoutCustomShiftsInput>
  }

  export type LineUpdateWithoutCustomShiftsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    organization?: OrganizationUpdateOneRequiredWithoutLinesNestedInput
    user?: UserUpdateOneRequiredWithoutLinesNestedInput
    shifts?: ShiftUpdateManyWithoutLinesNestedInput
    stations?: StationUpdateManyWithoutLineNestedInput
    devices?: DeviceUpdateManyWithoutLineNestedInput
  }

  export type LineUncheckedUpdateWithoutCustomShiftsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    shifts?: ShiftUncheckedUpdateManyWithoutLinesNestedInput
    stations?: StationUncheckedUpdateManyWithoutLineNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutLineNestedInput
  }

  export type CustomShiftCreateWithoutPlannedBreaksInput = {
    id?: string
    start: string
    end: string
    line: LineCreateNestedOneWithoutCustomShiftsInput
  }

  export type CustomShiftUncheckedCreateWithoutPlannedBreaksInput = {
    id?: string
    start: string
    end: string
    lineId: string
  }

  export type CustomShiftCreateOrConnectWithoutPlannedBreaksInput = {
    where: CustomShiftWhereUniqueInput
    create: XOR<CustomShiftCreateWithoutPlannedBreaksInput, CustomShiftUncheckedCreateWithoutPlannedBreaksInput>
  }

  export type CustomShiftUpsertWithoutPlannedBreaksInput = {
    update: XOR<CustomShiftUpdateWithoutPlannedBreaksInput, CustomShiftUncheckedUpdateWithoutPlannedBreaksInput>
    create: XOR<CustomShiftCreateWithoutPlannedBreaksInput, CustomShiftUncheckedCreateWithoutPlannedBreaksInput>
    where?: CustomShiftWhereInput
  }

  export type CustomShiftUpdateToOneWithWhereWithoutPlannedBreaksInput = {
    where?: CustomShiftWhereInput
    data: XOR<CustomShiftUpdateWithoutPlannedBreaksInput, CustomShiftUncheckedUpdateWithoutPlannedBreaksInput>
  }

  export type CustomShiftUpdateWithoutPlannedBreaksInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    line?: LineUpdateOneRequiredWithoutCustomShiftsNestedInput
  }

  export type CustomShiftUncheckedUpdateWithoutPlannedBreaksInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    lineId?: StringFieldUpdateOperationsInput | string
  }

  export type ShiftCreateWithoutPlannedBreaksInput = {
    id?: string
    start: string
    end: string
    lines?: LineCreateNestedManyWithoutShiftsInput
    organization: OrganizationCreateNestedOneWithoutShiftsInput
  }

  export type ShiftUncheckedCreateWithoutPlannedBreaksInput = {
    id?: string
    start: string
    end: string
    organizationId: string
    lines?: LineUncheckedCreateNestedManyWithoutShiftsInput
  }

  export type ShiftCreateOrConnectWithoutPlannedBreaksInput = {
    where: ShiftWhereUniqueInput
    create: XOR<ShiftCreateWithoutPlannedBreaksInput, ShiftUncheckedCreateWithoutPlannedBreaksInput>
  }

  export type ShiftUpsertWithoutPlannedBreaksInput = {
    update: XOR<ShiftUpdateWithoutPlannedBreaksInput, ShiftUncheckedUpdateWithoutPlannedBreaksInput>
    create: XOR<ShiftCreateWithoutPlannedBreaksInput, ShiftUncheckedCreateWithoutPlannedBreaksInput>
    where?: ShiftWhereInput
  }

  export type ShiftUpdateToOneWithWhereWithoutPlannedBreaksInput = {
    where?: ShiftWhereInput
    data: XOR<ShiftUpdateWithoutPlannedBreaksInput, ShiftUncheckedUpdateWithoutPlannedBreaksInput>
  }

  export type ShiftUpdateWithoutPlannedBreaksInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    lines?: LineUpdateManyWithoutShiftsNestedInput
    organization?: OrganizationUpdateOneRequiredWithoutShiftsNestedInput
  }

  export type ShiftUncheckedUpdateWithoutPlannedBreaksInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    lines?: LineUncheckedUpdateManyWithoutShiftsNestedInput
  }

  export type CustomShiftCreateWithoutLineInput = {
    id?: string
    start: string
    end: string
    plannedBreaks?: PlannedBreakCustomCreateNestedManyWithoutCustomShiftInput
  }

  export type CustomShiftUncheckedCreateWithoutLineInput = {
    id?: string
    start: string
    end: string
    plannedBreaks?: PlannedBreakCustomUncheckedCreateNestedManyWithoutCustomShiftInput
  }

  export type CustomShiftCreateOrConnectWithoutLineInput = {
    where: CustomShiftWhereUniqueInput
    create: XOR<CustomShiftCreateWithoutLineInput, CustomShiftUncheckedCreateWithoutLineInput>
  }

  export type CustomShiftCreateManyLineInputEnvelope = {
    data: CustomShiftCreateManyLineInput | CustomShiftCreateManyLineInput[]
    skipDuplicates?: boolean
  }

  export type OrganizationCreateWithoutLinesInput = {
    id?: string
    name: string
    email: string
    address: string
    phoneNumber: string
    imageUrl?: string | null
    shiftNumber: number
    unit: string
    Department: string
    Desingation: string
    shifts?: ShiftCreateNestedManyWithoutOrganizationInput
    users?: UserCreateNestedManyWithoutOrganizationInput
    devices?: DeviceCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateWithoutLinesInput = {
    id?: string
    name: string
    email: string
    address: string
    phoneNumber: string
    imageUrl?: string | null
    shiftNumber: number
    unit: string
    Department: string
    Desingation: string
    shifts?: ShiftUncheckedCreateNestedManyWithoutOrganizationInput
    users?: UserUncheckedCreateNestedManyWithoutOrganizationInput
    devices?: DeviceUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationCreateOrConnectWithoutLinesInput = {
    where: OrganizationWhereUniqueInput
    create: XOR<OrganizationCreateWithoutLinesInput, OrganizationUncheckedCreateWithoutLinesInput>
  }

  export type UserCreateWithoutLinesInput = {
    id?: string
    name: string
    email: string
    password: string
    role: $Enums.Role
    status?: $Enums.Status
    createdAt?: Date | string
    address: string
    phoneNumber: string
    lastLogin?: Date | string | null
    organization: OrganizationCreateNestedOneWithoutUsersInput
  }

  export type UserUncheckedCreateWithoutLinesInput = {
    id?: string
    name: string
    email: string
    password: string
    role: $Enums.Role
    status?: $Enums.Status
    createdAt?: Date | string
    address: string
    phoneNumber: string
    lastLogin?: Date | string | null
    organizationId: string
  }

  export type UserCreateOrConnectWithoutLinesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLinesInput, UserUncheckedCreateWithoutLinesInput>
  }

  export type ShiftCreateWithoutLinesInput = {
    id?: string
    start: string
    end: string
    plannedBreaks?: PlannedBreakCreateNestedManyWithoutShiftInput
    organization: OrganizationCreateNestedOneWithoutShiftsInput
  }

  export type ShiftUncheckedCreateWithoutLinesInput = {
    id?: string
    start: string
    end: string
    organizationId: string
    plannedBreaks?: PlannedBreakUncheckedCreateNestedManyWithoutShiftInput
  }

  export type ShiftCreateOrConnectWithoutLinesInput = {
    where: ShiftWhereUniqueInput
    create: XOR<ShiftCreateWithoutLinesInput, ShiftUncheckedCreateWithoutLinesInput>
  }

  export type StationCreateWithoutLineInput = {
    id?: string
    name: string
    isCritical?: boolean
  }

  export type StationUncheckedCreateWithoutLineInput = {
    id?: string
    name: string
    isCritical?: boolean
  }

  export type StationCreateOrConnectWithoutLineInput = {
    where: StationWhereUniqueInput
    create: XOR<StationCreateWithoutLineInput, StationUncheckedCreateWithoutLineInput>
  }

  export type StationCreateManyLineInputEnvelope = {
    data: StationCreateManyLineInput | StationCreateManyLineInput[]
    skipDuplicates?: boolean
  }

  export type DeviceCreateWithoutLineInput = {
    id?: string
    name: string
    type: string
    status: $Enums.DeviceStatus
    organization: OrganizationCreateNestedOneWithoutDevicesInput
  }

  export type DeviceUncheckedCreateWithoutLineInput = {
    id?: string
    name: string
    type: string
    organizationId: string
    status: $Enums.DeviceStatus
  }

  export type DeviceCreateOrConnectWithoutLineInput = {
    where: DeviceWhereUniqueInput
    create: XOR<DeviceCreateWithoutLineInput, DeviceUncheckedCreateWithoutLineInput>
  }

  export type DeviceCreateManyLineInputEnvelope = {
    data: DeviceCreateManyLineInput | DeviceCreateManyLineInput[]
    skipDuplicates?: boolean
  }

  export type CustomShiftUpsertWithWhereUniqueWithoutLineInput = {
    where: CustomShiftWhereUniqueInput
    update: XOR<CustomShiftUpdateWithoutLineInput, CustomShiftUncheckedUpdateWithoutLineInput>
    create: XOR<CustomShiftCreateWithoutLineInput, CustomShiftUncheckedCreateWithoutLineInput>
  }

  export type CustomShiftUpdateWithWhereUniqueWithoutLineInput = {
    where: CustomShiftWhereUniqueInput
    data: XOR<CustomShiftUpdateWithoutLineInput, CustomShiftUncheckedUpdateWithoutLineInput>
  }

  export type CustomShiftUpdateManyWithWhereWithoutLineInput = {
    where: CustomShiftScalarWhereInput
    data: XOR<CustomShiftUpdateManyMutationInput, CustomShiftUncheckedUpdateManyWithoutLineInput>
  }

  export type CustomShiftScalarWhereInput = {
    AND?: CustomShiftScalarWhereInput | CustomShiftScalarWhereInput[]
    OR?: CustomShiftScalarWhereInput[]
    NOT?: CustomShiftScalarWhereInput | CustomShiftScalarWhereInput[]
    id?: StringFilter<"CustomShift"> | string
    start?: StringFilter<"CustomShift"> | string
    end?: StringFilter<"CustomShift"> | string
    lineId?: StringFilter<"CustomShift"> | string
  }

  export type OrganizationUpsertWithoutLinesInput = {
    update: XOR<OrganizationUpdateWithoutLinesInput, OrganizationUncheckedUpdateWithoutLinesInput>
    create: XOR<OrganizationCreateWithoutLinesInput, OrganizationUncheckedCreateWithoutLinesInput>
    where?: OrganizationWhereInput
  }

  export type OrganizationUpdateToOneWithWhereWithoutLinesInput = {
    where?: OrganizationWhereInput
    data: XOR<OrganizationUpdateWithoutLinesInput, OrganizationUncheckedUpdateWithoutLinesInput>
  }

  export type OrganizationUpdateWithoutLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    shiftNumber?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    Department?: StringFieldUpdateOperationsInput | string
    Desingation?: StringFieldUpdateOperationsInput | string
    shifts?: ShiftUpdateManyWithoutOrganizationNestedInput
    users?: UserUpdateManyWithoutOrganizationNestedInput
    devices?: DeviceUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateWithoutLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    shiftNumber?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    Department?: StringFieldUpdateOperationsInput | string
    Desingation?: StringFieldUpdateOperationsInput | string
    shifts?: ShiftUncheckedUpdateManyWithoutOrganizationNestedInput
    users?: UserUncheckedUpdateManyWithoutOrganizationNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type UserUpsertWithoutLinesInput = {
    update: XOR<UserUpdateWithoutLinesInput, UserUncheckedUpdateWithoutLinesInput>
    create: XOR<UserCreateWithoutLinesInput, UserUncheckedCreateWithoutLinesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLinesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLinesInput, UserUncheckedUpdateWithoutLinesInput>
  }

  export type UserUpdateWithoutLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organization?: OrganizationUpdateOneRequiredWithoutUsersNestedInput
  }

  export type UserUncheckedUpdateWithoutLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organizationId?: StringFieldUpdateOperationsInput | string
  }

  export type ShiftUpsertWithWhereUniqueWithoutLinesInput = {
    where: ShiftWhereUniqueInput
    update: XOR<ShiftUpdateWithoutLinesInput, ShiftUncheckedUpdateWithoutLinesInput>
    create: XOR<ShiftCreateWithoutLinesInput, ShiftUncheckedCreateWithoutLinesInput>
  }

  export type ShiftUpdateWithWhereUniqueWithoutLinesInput = {
    where: ShiftWhereUniqueInput
    data: XOR<ShiftUpdateWithoutLinesInput, ShiftUncheckedUpdateWithoutLinesInput>
  }

  export type ShiftUpdateManyWithWhereWithoutLinesInput = {
    where: ShiftScalarWhereInput
    data: XOR<ShiftUpdateManyMutationInput, ShiftUncheckedUpdateManyWithoutLinesInput>
  }

  export type StationUpsertWithWhereUniqueWithoutLineInput = {
    where: StationWhereUniqueInput
    update: XOR<StationUpdateWithoutLineInput, StationUncheckedUpdateWithoutLineInput>
    create: XOR<StationCreateWithoutLineInput, StationUncheckedCreateWithoutLineInput>
  }

  export type StationUpdateWithWhereUniqueWithoutLineInput = {
    where: StationWhereUniqueInput
    data: XOR<StationUpdateWithoutLineInput, StationUncheckedUpdateWithoutLineInput>
  }

  export type StationUpdateManyWithWhereWithoutLineInput = {
    where: StationScalarWhereInput
    data: XOR<StationUpdateManyMutationInput, StationUncheckedUpdateManyWithoutLineInput>
  }

  export type StationScalarWhereInput = {
    AND?: StationScalarWhereInput | StationScalarWhereInput[]
    OR?: StationScalarWhereInput[]
    NOT?: StationScalarWhereInput | StationScalarWhereInput[]
    id?: StringFilter<"Station"> | string
    name?: StringFilter<"Station"> | string
    isCritical?: BoolFilter<"Station"> | boolean
    lineId?: StringFilter<"Station"> | string
  }

  export type DeviceUpsertWithWhereUniqueWithoutLineInput = {
    where: DeviceWhereUniqueInput
    update: XOR<DeviceUpdateWithoutLineInput, DeviceUncheckedUpdateWithoutLineInput>
    create: XOR<DeviceCreateWithoutLineInput, DeviceUncheckedCreateWithoutLineInput>
  }

  export type DeviceUpdateWithWhereUniqueWithoutLineInput = {
    where: DeviceWhereUniqueInput
    data: XOR<DeviceUpdateWithoutLineInput, DeviceUncheckedUpdateWithoutLineInput>
  }

  export type DeviceUpdateManyWithWhereWithoutLineInput = {
    where: DeviceScalarWhereInput
    data: XOR<DeviceUpdateManyMutationInput, DeviceUncheckedUpdateManyWithoutLineInput>
  }

  export type LineCreateWithoutStationsInput = {
    id?: string
    name: string
    type: string
    customShifts?: CustomShiftCreateNestedManyWithoutLineInput
    organization: OrganizationCreateNestedOneWithoutLinesInput
    user: UserCreateNestedOneWithoutLinesInput
    shifts?: ShiftCreateNestedManyWithoutLinesInput
    devices?: DeviceCreateNestedManyWithoutLineInput
  }

  export type LineUncheckedCreateWithoutStationsInput = {
    id?: string
    name: string
    type: string
    organizationId: string
    userId: string
    customShifts?: CustomShiftUncheckedCreateNestedManyWithoutLineInput
    shifts?: ShiftUncheckedCreateNestedManyWithoutLinesInput
    devices?: DeviceUncheckedCreateNestedManyWithoutLineInput
  }

  export type LineCreateOrConnectWithoutStationsInput = {
    where: LineWhereUniqueInput
    create: XOR<LineCreateWithoutStationsInput, LineUncheckedCreateWithoutStationsInput>
  }

  export type LineUpsertWithoutStationsInput = {
    update: XOR<LineUpdateWithoutStationsInput, LineUncheckedUpdateWithoutStationsInput>
    create: XOR<LineCreateWithoutStationsInput, LineUncheckedCreateWithoutStationsInput>
    where?: LineWhereInput
  }

  export type LineUpdateToOneWithWhereWithoutStationsInput = {
    where?: LineWhereInput
    data: XOR<LineUpdateWithoutStationsInput, LineUncheckedUpdateWithoutStationsInput>
  }

  export type LineUpdateWithoutStationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    customShifts?: CustomShiftUpdateManyWithoutLineNestedInput
    organization?: OrganizationUpdateOneRequiredWithoutLinesNestedInput
    user?: UserUpdateOneRequiredWithoutLinesNestedInput
    shifts?: ShiftUpdateManyWithoutLinesNestedInput
    devices?: DeviceUpdateManyWithoutLineNestedInput
  }

  export type LineUncheckedUpdateWithoutStationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    customShifts?: CustomShiftUncheckedUpdateManyWithoutLineNestedInput
    shifts?: ShiftUncheckedUpdateManyWithoutLinesNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutLineNestedInput
  }

  export type LineCreateWithoutUserInput = {
    id?: string
    name: string
    type: string
    customShifts?: CustomShiftCreateNestedManyWithoutLineInput
    organization: OrganizationCreateNestedOneWithoutLinesInput
    shifts?: ShiftCreateNestedManyWithoutLinesInput
    stations?: StationCreateNestedManyWithoutLineInput
    devices?: DeviceCreateNestedManyWithoutLineInput
  }

  export type LineUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    type: string
    organizationId: string
    customShifts?: CustomShiftUncheckedCreateNestedManyWithoutLineInput
    shifts?: ShiftUncheckedCreateNestedManyWithoutLinesInput
    stations?: StationUncheckedCreateNestedManyWithoutLineInput
    devices?: DeviceUncheckedCreateNestedManyWithoutLineInput
  }

  export type LineCreateOrConnectWithoutUserInput = {
    where: LineWhereUniqueInput
    create: XOR<LineCreateWithoutUserInput, LineUncheckedCreateWithoutUserInput>
  }

  export type LineCreateManyUserInputEnvelope = {
    data: LineCreateManyUserInput | LineCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type OrganizationCreateWithoutUsersInput = {
    id?: string
    name: string
    email: string
    address: string
    phoneNumber: string
    imageUrl?: string | null
    shiftNumber: number
    unit: string
    Department: string
    Desingation: string
    shifts?: ShiftCreateNestedManyWithoutOrganizationInput
    devices?: DeviceCreateNestedManyWithoutOrganizationInput
    lines?: LineCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateWithoutUsersInput = {
    id?: string
    name: string
    email: string
    address: string
    phoneNumber: string
    imageUrl?: string | null
    shiftNumber: number
    unit: string
    Department: string
    Desingation: string
    shifts?: ShiftUncheckedCreateNestedManyWithoutOrganizationInput
    devices?: DeviceUncheckedCreateNestedManyWithoutOrganizationInput
    lines?: LineUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationCreateOrConnectWithoutUsersInput = {
    where: OrganizationWhereUniqueInput
    create: XOR<OrganizationCreateWithoutUsersInput, OrganizationUncheckedCreateWithoutUsersInput>
  }

  export type LineUpsertWithWhereUniqueWithoutUserInput = {
    where: LineWhereUniqueInput
    update: XOR<LineUpdateWithoutUserInput, LineUncheckedUpdateWithoutUserInput>
    create: XOR<LineCreateWithoutUserInput, LineUncheckedCreateWithoutUserInput>
  }

  export type LineUpdateWithWhereUniqueWithoutUserInput = {
    where: LineWhereUniqueInput
    data: XOR<LineUpdateWithoutUserInput, LineUncheckedUpdateWithoutUserInput>
  }

  export type LineUpdateManyWithWhereWithoutUserInput = {
    where: LineScalarWhereInput
    data: XOR<LineUpdateManyMutationInput, LineUncheckedUpdateManyWithoutUserInput>
  }

  export type OrganizationUpsertWithoutUsersInput = {
    update: XOR<OrganizationUpdateWithoutUsersInput, OrganizationUncheckedUpdateWithoutUsersInput>
    create: XOR<OrganizationCreateWithoutUsersInput, OrganizationUncheckedCreateWithoutUsersInput>
    where?: OrganizationWhereInput
  }

  export type OrganizationUpdateToOneWithWhereWithoutUsersInput = {
    where?: OrganizationWhereInput
    data: XOR<OrganizationUpdateWithoutUsersInput, OrganizationUncheckedUpdateWithoutUsersInput>
  }

  export type OrganizationUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    shiftNumber?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    Department?: StringFieldUpdateOperationsInput | string
    Desingation?: StringFieldUpdateOperationsInput | string
    shifts?: ShiftUpdateManyWithoutOrganizationNestedInput
    devices?: DeviceUpdateManyWithoutOrganizationNestedInput
    lines?: LineUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    shiftNumber?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    Department?: StringFieldUpdateOperationsInput | string
    Desingation?: StringFieldUpdateOperationsInput | string
    shifts?: ShiftUncheckedUpdateManyWithoutOrganizationNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutOrganizationNestedInput
    lines?: LineUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationCreateWithoutDevicesInput = {
    id?: string
    name: string
    email: string
    address: string
    phoneNumber: string
    imageUrl?: string | null
    shiftNumber: number
    unit: string
    Department: string
    Desingation: string
    shifts?: ShiftCreateNestedManyWithoutOrganizationInput
    users?: UserCreateNestedManyWithoutOrganizationInput
    lines?: LineCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateWithoutDevicesInput = {
    id?: string
    name: string
    email: string
    address: string
    phoneNumber: string
    imageUrl?: string | null
    shiftNumber: number
    unit: string
    Department: string
    Desingation: string
    shifts?: ShiftUncheckedCreateNestedManyWithoutOrganizationInput
    users?: UserUncheckedCreateNestedManyWithoutOrganizationInput
    lines?: LineUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationCreateOrConnectWithoutDevicesInput = {
    where: OrganizationWhereUniqueInput
    create: XOR<OrganizationCreateWithoutDevicesInput, OrganizationUncheckedCreateWithoutDevicesInput>
  }

  export type LineCreateWithoutDevicesInput = {
    id?: string
    name: string
    type: string
    customShifts?: CustomShiftCreateNestedManyWithoutLineInput
    organization: OrganizationCreateNestedOneWithoutLinesInput
    user: UserCreateNestedOneWithoutLinesInput
    shifts?: ShiftCreateNestedManyWithoutLinesInput
    stations?: StationCreateNestedManyWithoutLineInput
  }

  export type LineUncheckedCreateWithoutDevicesInput = {
    id?: string
    name: string
    type: string
    organizationId: string
    userId: string
    customShifts?: CustomShiftUncheckedCreateNestedManyWithoutLineInput
    shifts?: ShiftUncheckedCreateNestedManyWithoutLinesInput
    stations?: StationUncheckedCreateNestedManyWithoutLineInput
  }

  export type LineCreateOrConnectWithoutDevicesInput = {
    where: LineWhereUniqueInput
    create: XOR<LineCreateWithoutDevicesInput, LineUncheckedCreateWithoutDevicesInput>
  }

  export type OrganizationUpsertWithoutDevicesInput = {
    update: XOR<OrganizationUpdateWithoutDevicesInput, OrganizationUncheckedUpdateWithoutDevicesInput>
    create: XOR<OrganizationCreateWithoutDevicesInput, OrganizationUncheckedCreateWithoutDevicesInput>
    where?: OrganizationWhereInput
  }

  export type OrganizationUpdateToOneWithWhereWithoutDevicesInput = {
    where?: OrganizationWhereInput
    data: XOR<OrganizationUpdateWithoutDevicesInput, OrganizationUncheckedUpdateWithoutDevicesInput>
  }

  export type OrganizationUpdateWithoutDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    shiftNumber?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    Department?: StringFieldUpdateOperationsInput | string
    Desingation?: StringFieldUpdateOperationsInput | string
    shifts?: ShiftUpdateManyWithoutOrganizationNestedInput
    users?: UserUpdateManyWithoutOrganizationNestedInput
    lines?: LineUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateWithoutDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    shiftNumber?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    Department?: StringFieldUpdateOperationsInput | string
    Desingation?: StringFieldUpdateOperationsInput | string
    shifts?: ShiftUncheckedUpdateManyWithoutOrganizationNestedInput
    users?: UserUncheckedUpdateManyWithoutOrganizationNestedInput
    lines?: LineUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type LineUpsertWithoutDevicesInput = {
    update: XOR<LineUpdateWithoutDevicesInput, LineUncheckedUpdateWithoutDevicesInput>
    create: XOR<LineCreateWithoutDevicesInput, LineUncheckedCreateWithoutDevicesInput>
    where?: LineWhereInput
  }

  export type LineUpdateToOneWithWhereWithoutDevicesInput = {
    where?: LineWhereInput
    data: XOR<LineUpdateWithoutDevicesInput, LineUncheckedUpdateWithoutDevicesInput>
  }

  export type LineUpdateWithoutDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    customShifts?: CustomShiftUpdateManyWithoutLineNestedInput
    organization?: OrganizationUpdateOneRequiredWithoutLinesNestedInput
    user?: UserUpdateOneRequiredWithoutLinesNestedInput
    shifts?: ShiftUpdateManyWithoutLinesNestedInput
    stations?: StationUpdateManyWithoutLineNestedInput
  }

  export type LineUncheckedUpdateWithoutDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    customShifts?: CustomShiftUncheckedUpdateManyWithoutLineNestedInput
    shifts?: ShiftUncheckedUpdateManyWithoutLinesNestedInput
    stations?: StationUncheckedUpdateManyWithoutLineNestedInput
  }

  export type ShiftCreateManyOrganizationInput = {
    id?: string
    start: string
    end: string
  }

  export type UserCreateManyOrganizationInput = {
    id?: string
    name: string
    email: string
    password: string
    role: $Enums.Role
    status?: $Enums.Status
    createdAt?: Date | string
    address: string
    phoneNumber: string
    lastLogin?: Date | string | null
  }

  export type DeviceCreateManyOrganizationInput = {
    id?: string
    name: string
    type: string
    lineId: string
    status: $Enums.DeviceStatus
  }

  export type LineCreateManyOrganizationInput = {
    id?: string
    name: string
    type: string
    userId: string
  }

  export type ShiftUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    plannedBreaks?: PlannedBreakUpdateManyWithoutShiftNestedInput
    lines?: LineUpdateManyWithoutShiftsNestedInput
  }

  export type ShiftUncheckedUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    plannedBreaks?: PlannedBreakUncheckedUpdateManyWithoutShiftNestedInput
    lines?: LineUncheckedUpdateManyWithoutShiftsNestedInput
  }

  export type ShiftUncheckedUpdateManyWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
  }

  export type UserUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lines?: LineUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lines?: LineUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DeviceUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
    line?: LineUpdateOneRequiredWithoutDevicesNestedInput
  }

  export type DeviceUncheckedUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    lineId?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
  }

  export type DeviceUncheckedUpdateManyWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    lineId?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
  }

  export type LineUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    customShifts?: CustomShiftUpdateManyWithoutLineNestedInput
    user?: UserUpdateOneRequiredWithoutLinesNestedInput
    shifts?: ShiftUpdateManyWithoutLinesNestedInput
    stations?: StationUpdateManyWithoutLineNestedInput
    devices?: DeviceUpdateManyWithoutLineNestedInput
  }

  export type LineUncheckedUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    customShifts?: CustomShiftUncheckedUpdateManyWithoutLineNestedInput
    shifts?: ShiftUncheckedUpdateManyWithoutLinesNestedInput
    stations?: StationUncheckedUpdateManyWithoutLineNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutLineNestedInput
  }

  export type LineUncheckedUpdateManyWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type PlannedBreakCreateManyShiftInput = {
    id?: string
    start: string
    end: string
    type: $Enums.TypeOfBreak
  }

  export type PlannedBreakUpdateWithoutShiftInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    type?: EnumTypeOfBreakFieldUpdateOperationsInput | $Enums.TypeOfBreak
  }

  export type PlannedBreakUncheckedUpdateWithoutShiftInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    type?: EnumTypeOfBreakFieldUpdateOperationsInput | $Enums.TypeOfBreak
  }

  export type PlannedBreakUncheckedUpdateManyWithoutShiftInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    type?: EnumTypeOfBreakFieldUpdateOperationsInput | $Enums.TypeOfBreak
  }

  export type LineUpdateWithoutShiftsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    customShifts?: CustomShiftUpdateManyWithoutLineNestedInput
    organization?: OrganizationUpdateOneRequiredWithoutLinesNestedInput
    user?: UserUpdateOneRequiredWithoutLinesNestedInput
    stations?: StationUpdateManyWithoutLineNestedInput
    devices?: DeviceUpdateManyWithoutLineNestedInput
  }

  export type LineUncheckedUpdateWithoutShiftsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    customShifts?: CustomShiftUncheckedUpdateManyWithoutLineNestedInput
    stations?: StationUncheckedUpdateManyWithoutLineNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutLineNestedInput
  }

  export type LineUncheckedUpdateManyWithoutShiftsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type PlannedBreakCustomCreateManyCustomShiftInput = {
    id?: string
    start: string
    end: string
    typeOfBreak: string
  }

  export type PlannedBreakCustomUpdateWithoutCustomShiftInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    typeOfBreak?: StringFieldUpdateOperationsInput | string
  }

  export type PlannedBreakCustomUncheckedUpdateWithoutCustomShiftInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    typeOfBreak?: StringFieldUpdateOperationsInput | string
  }

  export type PlannedBreakCustomUncheckedUpdateManyWithoutCustomShiftInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    typeOfBreak?: StringFieldUpdateOperationsInput | string
  }

  export type CustomShiftCreateManyLineInput = {
    id?: string
    start: string
    end: string
  }

  export type StationCreateManyLineInput = {
    id?: string
    name: string
    isCritical?: boolean
  }

  export type DeviceCreateManyLineInput = {
    id?: string
    name: string
    type: string
    organizationId: string
    status: $Enums.DeviceStatus
  }

  export type CustomShiftUpdateWithoutLineInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    plannedBreaks?: PlannedBreakCustomUpdateManyWithoutCustomShiftNestedInput
  }

  export type CustomShiftUncheckedUpdateWithoutLineInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    plannedBreaks?: PlannedBreakCustomUncheckedUpdateManyWithoutCustomShiftNestedInput
  }

  export type CustomShiftUncheckedUpdateManyWithoutLineInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
  }

  export type ShiftUpdateWithoutLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    plannedBreaks?: PlannedBreakUpdateManyWithoutShiftNestedInput
    organization?: OrganizationUpdateOneRequiredWithoutShiftsNestedInput
  }

  export type ShiftUncheckedUpdateWithoutLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    plannedBreaks?: PlannedBreakUncheckedUpdateManyWithoutShiftNestedInput
  }

  export type ShiftUncheckedUpdateManyWithoutLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    start?: StringFieldUpdateOperationsInput | string
    end?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
  }

  export type StationUpdateWithoutLineInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isCritical?: BoolFieldUpdateOperationsInput | boolean
  }

  export type StationUncheckedUpdateWithoutLineInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isCritical?: BoolFieldUpdateOperationsInput | boolean
  }

  export type StationUncheckedUpdateManyWithoutLineInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isCritical?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DeviceUpdateWithoutLineInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
    organization?: OrganizationUpdateOneRequiredWithoutDevicesNestedInput
  }

  export type DeviceUncheckedUpdateWithoutLineInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
  }

  export type DeviceUncheckedUpdateManyWithoutLineInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
  }

  export type LineCreateManyUserInput = {
    id?: string
    name: string
    type: string
    organizationId: string
  }

  export type LineUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    customShifts?: CustomShiftUpdateManyWithoutLineNestedInput
    organization?: OrganizationUpdateOneRequiredWithoutLinesNestedInput
    shifts?: ShiftUpdateManyWithoutLinesNestedInput
    stations?: StationUpdateManyWithoutLineNestedInput
    devices?: DeviceUpdateManyWithoutLineNestedInput
  }

  export type LineUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    customShifts?: CustomShiftUncheckedUpdateManyWithoutLineNestedInput
    shifts?: ShiftUncheckedUpdateManyWithoutLinesNestedInput
    stations?: StationUncheckedUpdateManyWithoutLineNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutLineNestedInput
  }

  export type LineUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
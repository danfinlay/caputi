export

export type caputi = {
  generateProperties: PropertyGenerator,
  observable: ObservableGenerator,
  captpWsClient: CaptpWsClientGenerator,
  captpWsServer: CaptpWsServerGenerator,
}

export type PropertyGenerator = ({ [key: string]: any }): Properties;

export interface Properties {
  get: async (key: string): any;
  set: async (key: string, value: any): any;
  subscribe: async (key: string, listener: Listener<T>): RemoveListener;
  lock: async (key: string): Unlock;
}

export type ObservableGenerator = (value: any): Observable;

export interface Observable <T> {
  get: async (): T;
  set: async (T): T;
  subscribe: async (listener: Listener<T>): RemoveListener;
  lock: async (): Unlock;
}

type Listener <T> = async (updatedValue: T): void;
type RemoveListener = async (): void;
type Unlock = async (): void;

export type CaptpWsServerGenerator = (bootstrap: ServerBootstrap, port: number): void;

export type CaptpWsClientGenerator = (address: string): => Bootstrap;

export type ServerBootstrap = { [key:string]: () => Promise<any> };

// This does not do justice to the constraints of a server bootstrap. I'm not completely clear on what they are yet, so I'm not refining this yet:
type ServerBootstrap = Object;


// From https://github.com/Agoric/agoric-sdk/blob/master/packages/eventual-send/src/index.d.ts
// Type definitions for eventual-send
// TODO: Add jsdocs.

type Property = string | number | symbol;

interface EHandler<T> {
  get?: (p: T, name: Property) => any;
  applyMethod?: (p: T, name?: Property, args: unknown[]) => any;
}

type HandledExecutor<R> = (
  resolveHandled: (value?: R) => void,
  rejectHandled: (reason?: unknown) => void,
  resolveWithPresence: (presenceHandler: EHandler<{}>) => object,
) => void;

interface HandledPromiseConstructor {
  new<R> (executor: HandledExecutor<R>, unfulfilledHandler: EHandler<Promise<unknown>>);
  prototype: Promise<unknown>;
  applyFunction(target: unknown, args: unknown[]): Promise<unknown>;
  applyFunctionSendOnly(target: unknown, args: unknown[]): void;
  applyMethod(target: unknown, prop: Property, args: unknown[]): Promise<unknown>;
  applyMethodSendOnly(target: unknown, prop: Property, args: unknown[]): void;
  get(target: unknown, prop: Property): Promise<unknown>;
  getSendOnly(target: unknown, prop: Property): void;
  resolve(target: unknown): Promise<any>;
}

export const HandledPromise: HandledPromiseConstructor;

interface ESingleMethod<R = Promise<unknown>> {
  (...args: unknown[]) => R;
  readonly [prop: string]: (...args: unknown[]) => R;
}

interface ESingleGet<R = Promise<unknown>> {
  readonly [prop: string]: R;
}

interface ESendOnly {
  (x: unknown): ESingleMethod<void>;
  readonly G(x: unknown): ESingleGet<void>;
}

interface EProxy {
  /**
   * E(x) returns a proxy on which you can call arbitrary methods. Each of
   * these method calls returns a promise. The method will be invoked on
   * whatever 'x' designates (or resolves to) in a future turn, not this
   * one.
   *
   * @param {*} x target for method call
   * @returns {ESingleMethod} method call proxy
   */
  (x: unknown): ESingleMethod;
  /**
   * E.G(x) returns a proxy on which you can get arbitrary properties.
   * Each of these properties returns a promise for the property.  The promise
   * value will be the property fetched from whatever 'x' designates (or resolves to)
   * in a future turn, not this one.
   *
   * @param {*} x target for property get
   * @returns {ESingleGet} property get proxy
   */
  readonly G(x: unknown): ESingleGet;

  /**
   * E.when(x, res, rej) is equivalent to HandledPromise.resolve(x).then(res, rej)
   */
  readonly when(
    x: unknown,
    onfulfilled?: (value: unknown) => unknown | PromiseLike<unknown>,
    onrejected?: (reason: any) => PromiseLike<never>,
  ): Promise<unknown>;

  /**
   * E.sendOnly returns a proxy similar to E, but for which the results
   * are ignored (undefined is returned).
   */
  readonly sendOnly: ESendOnly;
}

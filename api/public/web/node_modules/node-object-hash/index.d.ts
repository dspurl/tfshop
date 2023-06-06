declare module 'node-object-hash' {
  namespace apiConstructor {
    interface HashOptions {
      coerce?: boolean,
      sort?: boolean,
      alg?: string,
      enc?: string,
    }

    interface API {
      hash(object: any, opts?: {
        alg?: string,
        enc?: string,
      }): string;
      sortObject(object: any): string;
      sort(object: any): string;
    }
  }

  function apiConstructor(options?: apiConstructor.HashOptions): apiConstructor.API;

  export = apiConstructor;
}

declare module 'node-object-hash.objectSorter' {
  function makeObjectSorter(options?: {
    coerce?: boolean,
    sort?: boolean,
  }): string;

  export = makeObjectSorter;
}

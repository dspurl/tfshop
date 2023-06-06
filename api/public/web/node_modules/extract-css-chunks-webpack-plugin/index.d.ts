declare module 'extract-css-chunks-webpack-plugin' {
  import { ChunkData, Plugin } from 'webpack';

  class ExtractCssChunksPlugin extends Plugin {
    static loader: string;

    constructor(options?: ExtractCssChunksPlugin.PluginOptions);
  }

  namespace ExtractCssChunksPlugin {
    interface PluginOptions {
      /**
       * The filename of the entry chunk.
       */
      filename?: string;
      /**
       * The filename of non-entry chunks.
       */
      chunkFilename?: string;
      /**
       * Generates a file name (or template) based on chunk data.
       */
      moduleFilename?: (chunk: ChunkData) => string;
      /**
       * Remove warnings about conflicting order.
       */
      ignoreOrder?: boolean;
      /**
       * Inserts `<link>` at the given position (https://github.com/faceyspacey/extract-css-chunks-webpack-pluginn#insert).
       */
      insert?: string | Function;
    }
  }

  export = ExtractCssChunksPlugin;
}

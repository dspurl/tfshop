const glob = require('glob-all')
const consola = require('consola')
const logger = consola.withScope('nuxt-style-resources')

/** @type {import('@nuxt/types').Module<import('../types').Options>} */
export default function nuxtStyledResources (moduleOptions) {
  const resolver = (this.nuxt.resolver || this.nuxt)

  const {
    styleResources = moduleOptions,
    build: {
      styleResources: legacyStyledResources,
      loaders: { stylus: stylusLoaderOptions }
    }
  } = this.options

  // A bit messy. Check for truthyness and keys and return
  const legacyResources = legacyStyledResources && Object.keys(legacyStyledResources).length && legacyStyledResources

  const resources = Object.assign({}, legacyResources || styleResources)
  const hoistUseStatements = resources.hoistUseStatements || false
  delete resources.hoistUseStatements

  const styleResourcesEntries = Object.entries(resources)

  if (!styleResourcesEntries.length) {
    // No resources set
    return
  }

  const retrieveStyleArrays = styleResourcesEntries =>
    styleResourcesEntries.reduce((normalizedObject, [key, value]) => {
      const wrappedValue = Array.isArray(value) ? value : [value]
      normalizedObject[key] = wrappedValue.reduce((acc, path) => {
        const possibleModulePath = resolver.resolveModule(path)
        if (possibleModulePath) {
          // Path is mapped to module
          return acc.concat(possibleModulePath)
        }
        // Try to resolve alias, if not possible join with srcDir
        path = resolver.resolveAlias(path)
        // Try to glob (if it's a glob
        path = glob.sync(path)
        // Flatten this (glob could produce an array)
        return acc.concat(path)
      }, [])
      return normalizedObject
    }, {})

  const { scss = [], sass = [], less = [], stylus = [] } = retrieveStyleArrays(styleResourcesEntries)

  if (legacyResources) {
    logger.warn('Legacy styleResources detected. Will take over but ignore all other rules. Please move the rules to the top-level styleResources key')
    this.options.build.styleResources = {}
  }

  if (sass.length) {
    this.extendBuild(extendSass({ resources: sass, hoistUseStatements }))
  }

  if (scss.length) {
    this.extendBuild(extendScss({ resources: scss, hoistUseStatements }))
  }

  if (stylus.length) {
    // Use stylus-loader for imports as he supports that :+1: ;)
    stylusLoaderOptions.import = stylusLoaderOptions.import
      ? [].concat(stylusLoaderOptions.import).concat(stylus) /* Looks like you know what you are doing! That's good */
      : stylus
  }

  if (less.length) {
    this.extendBuild(extendLess({ resources: less, hoistUseStatements }))
  }
}

const extendWithSassResourcesLoader = matchRegex => options => (config) => {
  // Yes, using sass-resources-loader is **intended here**
  // Despite it's name it can be used for less as well!
  const sassResourcesLoader = {
    loader: 'sass-resources-loader', options
  }

  // Gather all loaders that test against scss or sass files
  const matchedLoaders = config.module.rules.filter(({ test = '' }) => {
    return test.toString().match(matchRegex)
  })

  // push sass-resources-loader to each of them
  matchedLoaders.forEach((loader) => {
    loader.oneOf.forEach(rule => rule.use.push(sassResourcesLoader))
  })
}

const extendSass = extendWithSassResourcesLoader(/sass/)
const extendScss = extendWithSassResourcesLoader(/scss/)
const extendLess = extendWithSassResourcesLoader(/less/)

module.exports.meta = require('../package.json')

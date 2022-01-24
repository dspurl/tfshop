import { wrapFunctional } from './utils'

<%= options.getComponents().map(c => {
  const exp = c.pascalName === c.export ? c.pascalName : `${c.export} as ${c.pascalName}`
  return `export { ${exp} } from '../${relativeToBuild(c.filePath)}'`
}).join('\n') %>

<%= options.getComponents().map(c => {
  const exp = c.export === 'default' ? `c.default || c` : `c['${c.export}']`
  return `export const Lazy${c.pascalName} = import('../${relativeToBuild(c.filePath)}' /* webpackChunkName: "${c.chunkName}" */).then(c => wrapFunctional(${exp}))`
}).join('\n') %>

import { subjects } from './builder/utils.js'
import rdf from './rdf-ext.js'
import { createEntityWithContext } from './builder/entityBuilder.js'

function entity (cf, options) {
  const visited = rdf.termSet()
  const entities = []

  // If this clownface is pointing  to a term, render it first
  const allSubjects = cf.term
    ? [cf.term, ...subjects(cf.any()).filter(node => !node.equals(cf.term))]
    : subjects(cf.any())

  for (const subject of [...allSubjects]) {
    if (!visited.has(subject)) {
      const { entity } = createEntityWithContext(cf.node(subject), options,
        { visited })

      entities.push(entity)
    }
  }
  return entities
}

function namedCounts (cf, options) {
  const namedGraphs = rdf.termMap()
  for (const quad of cf.any().dataset) {
    if (quad.graph) {
      const count = namedGraphs.get(quad.graph)
      const newCount = count !== undefined ? (count + 1) : 1
      namedGraphs.set(quad.graph, newCount)
    }
  }
  return namedGraphs
}

export { entity, namedCounts }

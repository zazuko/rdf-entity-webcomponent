import rdf from './rdf-ext.js'
import { createEntityWithContext } from './builder/entityBuilder.js'

function getSecondary (primary, dataset) {
  const secondary = rdf.termSet()
  for (const quad of dataset) {
    if (!primary.has(quad.subject)) {
      secondary.add(quad.subject)
    }
  }
  return secondary
}

function createModel ({ dataset, terms }, options) {
  const visited = rdf.termSet()
  const entities = []

  // render the user-specified terms first
  const primary = rdf.termSet(terms || [])

  const subjects = [...terms || [], ...getSecondary(primary, dataset)]

  for (const subject of subjects) {
    if (!visited.has(subject)) {
      const singlePointer = rdf.clownface({ dataset, term: subject })

      const { entity } = createEntityWithContext(singlePointer, options,
        { visited })

      entities.push(entity)
    }
  }
  return entities
}

export { createModel }

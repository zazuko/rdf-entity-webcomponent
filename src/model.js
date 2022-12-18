import { subjects } from './builder/utils.js'
import rdf from './rdf-ext.js'
import { createEntityWithContext } from './builder/entityBuilder.js'

function entity (cf, options) {
  const visited = rdf.termSet()
  const entities = []

  // If this clownface is pointing  to a term, render it first
  const allSubjects = cf.term
    ? [
        cf.term,
        ...subjects(cf.any()).filter(node => !node.equals(cf.term))]
    : subjects(
      cf.any())

  for (const subject of [...allSubjects]) {
    if (!visited.has(subject)) {
      const { entity } = createEntityWithContext(cf.node(subject), options,
        { visited })

      entities.push(entity)
    }
  }
  return entities
}

export { entity }

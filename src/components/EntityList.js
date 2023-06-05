import { html } from 'lit'
import rdf from '../rdf-ext.js'
import { createModel } from '../model.js'
import { Entity } from './Entity.js'

function EntityList ({ dataset, terms }, options) {
  const subjects = rdf.termSet()
  for (const quad of [...dataset]) {
    subjects.add(quad.subject)
  }

  const anchorFor = rdf.termMap()
  let blankCount = 0
  for (const term of subjects) {
    if (term.termType === 'BlankNode') {
      blankCount = blankCount + 1
      anchorFor.set(term, `blank-${blankCount}`)
    } else {
      anchorFor.set(term, term.value)
    }
  }

  const model = createModel({ dataset, terms }, options)
  const list = model.map((entity) => {
    if (entity.rows && Array.isArray(entity.rows)) {
      entity.rows = entity.rows.map((row) => {
        // do not change anything for rows that are not in the expected form
        if (!row.values || !Array.isArray(row.values)) {
          return row
        }

        // check if we already saw that value (to make sure to remove duplicates coming from other graphs)
        const valuesSeen = new Set()
        row.values = row.values.filter((value) => {
          const jsonString = JSON.stringify(value)
          if (!valuesSeen.has(jsonString)) {
            valuesSeen.add(jsonString)
            return true
          }
          return false
        })
        valuesSeen.clear()

        return row
      })
    }

    return Entity(entity, options, { anchorFor })
  })

  return html`
      <div class="entities">
          ${list}
      </div>
  `
}

export { EntityList }

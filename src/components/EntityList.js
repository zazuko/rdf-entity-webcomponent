import { html } from 'lit'
import rdf from '../rdf-ext.js'
import { entity } from '../model.js'
import { Entity } from './Entity.js'

function EntityList ({ dataset, terms }, options) {
  const items = entity({ dataset, terms }, options)

  const anchorFor = rdf.termMap()
  let blankCount = 0
  for (const current of items) {
    if (current.term.termType === 'BlankNode') {
      blankCount = blankCount + 1
      anchorFor.set(current.term, `blank-${blankCount}`)
    } else {
      anchorFor.set(current.term, current.term.value)
    }
  }

  const list = items.map(entity => Entity(entity, options, { anchorFor }, true))

  return html`
      <div class="entities">
          ${list}
      </div>
  `
}

export { EntityList }

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
  const list = model.map(entity => Entity(entity, options, { anchorFor }, true))

  return html`
      <div class="entities">
          ${list}
      </div>
  `
}

export { EntityList }

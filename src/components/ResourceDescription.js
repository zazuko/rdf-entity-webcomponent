import { html } from 'lit'
import rdf from '../rdf-ext.js'
import { entity } from '../model.js'
import { Entity } from './Entity.js'
import { Metadata } from './Metadata.js'
import { Debug } from './Debug.js'

function EntityList (cf, options) {
  const items = entity(cf, options)

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

function ResourceDescription (cf, options) {
  const debug = options.debug ? Debug(cf, options) : html``
  return html`
      <div>
          ${EntityList(cf, options)}
          ${Metadata(cf, options)}
          ${debug}
      </div>
  `
}

function Empty (message) {
  return html`
      <div>${message}</div>`
}

export { ResourceDescription, Empty }

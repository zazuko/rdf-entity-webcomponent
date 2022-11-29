import { html } from 'lit'
import rdf from '../rdf-ext.js'
import { entity } from '../model.js'
import { Entity } from './Entity.js'
import { Metadata } from './Metadata.js'
import { Debug } from './Debug.js'

function EntityList (cf, options) {
  const items = entity(cf, options)
  const primaryNodes = rdf.termSet(items.map(item => item.term))

  const list = items.map(
    entity => Entity(entity, options, { primaryNodes }, true))

  return html`
      <div class="entities">
          ${list}
      </div>
  `
}

function ResourceDescription (cf, options) {
  if (options.debug) {
    return html`
        <div>
            ${EntityList(cf, options)}
            ${Metadata(cf, options)}
            ${Debug(cf, options)}
        </div>
    `
  }

  return html`
      ${EntityList(cf, options)}
      ${Metadata(cf, options)}
  `
}

function Empty (message) {
  return html`
      <div>${message}</div>`
}

export { ResourceDescription, Empty }

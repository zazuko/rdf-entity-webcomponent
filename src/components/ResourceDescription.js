import { html } from 'lit'
import rdf from '../rdf-ext.js'
import { entity } from '../model.js'
import { Entity } from './Entity.js'
import { Metadata } from './Metadata.js'
import { Debug } from './Debug.js'
import { entityBuilder } from '../builder/entityBuilder.js'

function EntityList (cf, options) {
  const builder = entityBuilder(cf)
    .embedNamed(options.embedNamed)
    .embedBlanks(options.embedBlanks)
    .embedLists(options.embedLists)
    .groupValuesByProperty(options.groupValuesByProperty)
    .groupPropertiesByValue(options.groupPropertiesByValue)
    .maxLevel(options.maxLevel)
    .withExternalLabels(options.externalLabels)
    .withPreferredLanguages(options.preferredLanguages)

  const items = entity(cf, builder)
  const primaryNodes = rdf.termSet(items.map(item => item.term))

  const list = items.map(entity => Entity(entity, options, { primaryNodes }, true))

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

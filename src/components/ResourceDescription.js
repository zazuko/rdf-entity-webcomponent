import { html } from 'lit-element'
import rdf from '../rdf-ext.js'
import { entity } from '../model.js'
import { Entity } from './Entity.js'
import { Metadata } from './Metadata.js'
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

function Debug (cf, options) {
  const list = []
  for (const quad of cf.dataset) {
    list.push(html`
        <tr>
            <td>${quad.subject.value}</td>
            <td>${quad.predicate.value}</td>
            <td>[${quad.object.termType}] ${quad.object.value}</td>
        </tr>`)
  }

  return html`
      <table class="debug">
          ${list}
      </table>
  `
}

function Empty (cf, options) {
  return html`
      <div>
          No quads
      </div>
  `
}

export { ResourceDescription, Empty }

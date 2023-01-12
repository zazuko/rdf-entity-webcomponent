import { ns } from '../namespaces.js'
import rdf from '../rdf-ext.js'
import { groupRows } from './group.js'
import { getLabel } from './labels.js'
import { sortRows } from './sort.js'
import { getTypes } from './types.js'
import { predicates } from './utils.js'

const DEFAULT_LABEL_PROPERTIES = [
  ns.foaf.name, ns.skos.prefLabel, ns.schema.name, ns.rdfs.label]

const defaultOptions = {
  labelProperties: DEFAULT_LABEL_PROPERTIES,
  externalLabels: rdf.clownface({ dataset: rdf.dataset() }),
  ignoreProperties: rdf.termSet([]),
  groupValuesByProperty: true,
  groupPropertiesByValue: true,
  embedLists: true,
  embedNamedNodes: false,
  embedBlankNodes: true,
  sortRows: true,
  maxLevel: undefined,
  preferredLanguages: ['en'],
  renderAs: (cf, options, context) => {
    if (context.incomingProperty) {
      // Adds 'Image' tag to the specified properties
      if (options.showImages) {
        for (const imageProperty of [ns.foaf.img, ns.schema.image]) {
          if (imageProperty.equals(context.incomingProperty)) {
            return 'Image'
          }
        }
      }
    }
    return undefined
  }
}

function createEntity (cf, options, context) {
  return createEntityWithContext(cf, options || {}, context || {}).entity
}

function createEntityWithContext (cf, options, context) {
  if (!cf) {
    throw Error('Requires pointer')
  }
  if (cf.datasets.length !== 1) {
    throw Error('Single pointer required')
  }

  const defaultContext = {
    level: 0,
    visited: rdf.termSet(),
    remainingEntities: [],
    incomingProperty: undefined
  }

  return getEntity(cf, { ...defaultOptions, ...options },
    { ...defaultContext, ...context })
}

function nodeWithLabels (cf, options, context) {
  const label = getLabel(cf, options)
  const renderAs = options.renderAs(cf, options, context)

  return {
    term: cf.term, ...(label && { label }), ...(renderAs && { renderAs })
  }
}

function canEmbed (options, context) {
  return term => {
    return (term.termType === 'NamedNode' || term.termType === 'BlankNode') &&
      !context.visited.has(term)
  }
}

function shouldEmbed (options, context) {
  return term => {
    if (term.termType === 'NamedNode' && !options.embedNamedNodes) {
      return false
    }
    if (term.termType === 'BlankNode' && !options.embedBlankNodes) {
      return false
    }
    return !(options.maxLevel && (context.level >= options.maxLevel))
  }
}

// @TODO this should have the option: Breadth-first in addition to Depth-first
function getRows (cf, options, context) {
  return predicates(cf)
    .filter(property => !options.ignoreProperties.has(property))
    .map(property => {
      const labeledProperty = nodeWithLabels(cf.node(property), options,
        context)
      const childContext = {
        ...context, level: context.level + 1, incomingProperty: property
      }
      const renderAsList = options.embedLists && cf.out(property).isList()
      const terms = renderAsList
        ? [...cf.out(property).list()].map(
            cf => cf.term)
        : cf.out(property).terms

      if (renderAsList) {
        // If visualization is as list, do not show the auxiliary blank nodes.
        [...cf.out(property).list()].map(cf => cf.in(ns.rdf.first).term)
          .forEach(term => {
            context.visited.add(term)
          })
      }

      const values = terms.map(term => {
        const isCanEmbed = canEmbed(options, childContext)(term)
        const isShouldEmbed = shouldEmbed(options, childContext)(term)

        if (isCanEmbed && isShouldEmbed) {
          return getEntity(cf.node(term), options, childContext).entity
        } else if (isCanEmbed && !isShouldEmbed) {
          context.remainingEntities.push({ property: labeledProperty, term })
        }
        return nodeWithLabels(cf.node(term), options, childContext)
      })
      return {
        ...(renderAsList && { renderAs: 'List' }),
        properties: [labeledProperty],
        values
      }
    })
}

function getEntity (cf, options, context) {
  context.visited.add(cf.term)
  const rows = getRows(cf, options, context)
  const grouped = groupRows(rows, options)
  sortRows(grouped, options)

  const entity = {
    ...nodeWithLabels(cf, options, context),
    ...(grouped && grouped.length &&
      { rows: grouped })
  }

  const types = getTypes(cf, options)
  if (types && types.length) {
    entity.types = types
  }

  return { entity, context }
}

export { createEntity, createEntityWithContext, DEFAULT_LABEL_PROPERTIES }

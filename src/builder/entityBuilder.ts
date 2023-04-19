import { ns } from '../namespaces'
import { rdf } from '../rdf-ext'
import { getLabel } from './labels'
import { groupRows } from './group'
import { sortRows } from './sort'
import { getTypes } from './types'
import { predicates } from './utils'
import { GraphPointer } from "clownface";
import { Entity, ExtendedOptions, Options, Row } from "../types";
import { Term } from 'rdf-js'
import NamedNodeExt from "rdf-ext/lib/NamedNode";

const DEFAULT_LABEL_PROPERTIES = [
  ns.foaf.name as unknown as NamedNodeExt, ns.skos.prefLabel, ns.schema.name as unknown as NamedNodeExt, ns.rdfs.label]

type EntityContext = {
  level:number,
  visited:any,
  incomingProperty:Term | undefined,
  remainingEntities:any
}

const defaultOptions: Options = {
  highlightLanguage: undefined,
  showImages: false,
  simplifiedMode: false,
  technicalCues: false,
  ignoreProperties: rdf.termSet([]),
  groupValuesByProperty: true,
  groupPropertiesByValue: true,
  embedLists: true,
  embedNamedNodes: false,
  embedBlankNodes: true,
  sortRows: true,
  maxLevel: undefined,
  preferredLanguages: ['en'],
}

const defaultExtended = {
  ...defaultOptions,
  externalLabels: rdf.clownface({ dataset: rdf.dataset() }),
  labelProperties: DEFAULT_LABEL_PROPERTIES,
  renderAs: (cf:GraphPointer, options:ExtendedOptions, context:EntityContext) => {
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


function createEntity (cf:GraphPointer, options:Options, context:EntityContext):Entity {
  return createEntityWithContext(cf, options , context ).entity
}

function createEntityWithContext (cf:GraphPointer, options:Options, context:EntityContext) {

  if (cf.datasets.length !== 1) {
    throw Error('Single pointer required')
  }

  return getEntity(cf, { ...defaultExtended, ...options }, context)
}

function nodeWithLabels (cf:GraphPointer, options:ExtendedOptions, context:EntityContext):Entity {
  const label = getLabel(cf, options)
  const renderAs = options.renderAs(cf, options, context)

  return {
    term: cf.term, ...(label && { label }), ...(renderAs && { renderAs })
  }
}

function canEmbed (options:ExtendedOptions, context:EntityContext) {
  return (term:Term) => {
    return (term.termType === 'NamedNode' || term.termType === 'BlankNode') &&
      !context.visited.has(term)
  }
}

function shouldEmbed (options:ExtendedOptions, context:EntityContext) {
  return (term:Term) => {
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
function getRows (cf:GraphPointer, options:ExtendedOptions, context:EntityContext) {
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
          // @ts-ignore
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

function getEntity (cf:GraphPointer, options:ExtendedOptions, context:EntityContext) {
  context.visited.add(cf.term)
  const rows:Row[] = getRows(cf, options, context)
  const grouped:Row[] = groupRows(rows, options)
  sortRows(grouped, options)

  const entity:Entity = {
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

export { createEntity, createEntityWithContext, DEFAULT_LABEL_PROPERTIES, EntityContext, defaultOptions }

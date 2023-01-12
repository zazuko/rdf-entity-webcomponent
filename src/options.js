import { DEFAULT_LABEL_PROPERTIES } from '../src/builder/entityBuilder.js'
import { ns } from './namespaces.js'
import rdf from './rdf-ext.js'

function boolean (value, defaultValue) {
  if (value === undefined) {
    return defaultValue
  } else {
    return !!value
  }
}

function getBuilderOptions (webComponent) {
  const preferredLanguages = webComponent.preferredLanguages ??
    ['en', 'fr', 'de', 'it']
  const highlightLanguage = preferredLanguages.length > 0
    ? preferredLanguages[0]
    : undefined
  return {
    technicalCues: boolean(webComponent.technicalCues, false),
    preferredLanguages,
    highlightLanguage,
    embedLists: boolean(webComponent.embedLists, false),
    embedNamedNodes: boolean(webComponent.embedNamedNodes, false),
    embedBlankNodes: boolean(webComponent.embedBlankNodes, false),
    maxLevel: webComponent.maxLevel ?? 3,
    showImages: boolean(webComponent.showImages, false),
    simplifiedMode: boolean(webComponent.simplifiedMode, false),

    // The following are specific properties not intended to be exposed by the Web component
    ignoreProperties: webComponent.simplifiedMode
      ? rdf.termSet(
        [ns.rdf.type, ...DEFAULT_LABEL_PROPERTIES])
      : rdf.termSet([]),
    groupValuesByProperty: boolean(webComponent.compactMode, false),
    groupPropertiesByValue: boolean(webComponent.compactMode, false)
  }
}

const DEFAULT_BUILDER_OPTIONS = getBuilderOptions({})

export { getBuilderOptions, DEFAULT_BUILDER_OPTIONS }

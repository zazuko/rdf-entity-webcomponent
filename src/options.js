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
  const highLightLanguage = preferredLanguages.length > 0
    ? preferredLanguages[0]
    : undefined
  return {
    technicalCues: boolean(webComponent.technicalCues, false),
    preferredLanguages,
    highLightLanguage,
    embedLists: true,
    embedNamed: boolean(webComponent.embedNamed, false),
    embedBlankNodes: boolean(webComponent.embedBlankNodes, false),
    maxLevel: webComponent.maxLevel ?? 3,
    metadata: webComponent.metadata,
    debug: boolean(webComponent.debug, false),

    // The following are shortcuts and do not correspond to the exact options of the builder
    groupValuesByProperty: boolean(webComponent.compactMode, false),
    groupPropertiesByValue: boolean(webComponent.compactMode, false),
    showNamedGraphs: boolean(webComponent.namedGraphs, false)
  }
}

const DEFAULT_BUILDER_OPTIONS = getBuilderOptions({})

export { getBuilderOptions, DEFAULT_BUILDER_OPTIONS }

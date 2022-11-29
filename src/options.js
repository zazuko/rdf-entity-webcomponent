function getBuilderOptions (webComponent) {

  const preferredLanguages = webComponent.preferredLanguages ??
    ['en', 'fr', 'de', 'it']
  const highLightLanguage = preferredLanguages.length > 0
    ? preferredLanguages[0]
    : undefined

  return {
    technicalCues: webComponent.technicalCues ?? false,
    groupValuesByProperty: webComponent.compactMode ?? false,
    groupPropertiesByValue: webComponent.compactMode ?? false,
    preferredLanguages,
    highLightLanguage,
    embedBlanks: true,
    embedLists: true,
    embedNamed: webComponent.embedNamed ?? false,
    maxLevel: webComponent.maxLevel ?? 3,
    showNamedGraphs: webComponent.showNamedGraphs ?? false,
    metadata: webComponent.metadata,
    debug: webComponent.debug ?? false
  }
}

const DEFAULT_BUILDER_OPTIONS = getBuilderOptions({})

export { getBuilderOptions, DEFAULT_BUILDER_OPTIONS }

function getBuilderOptions (webComponent) {
  return {
    technicalCues: webComponent.technicalCues ?? true,
    groupValuesByProperty: webComponent.compactMode ?? true,
    groupPropertiesByValue: webComponent.compactMode ?? true,
    preferredLanguages: webComponent.preferredLanguages ??
      ['en', 'fr', 'de', 'it'],
    highLightLanguage: undefined,
    embedBlanks: true,
    embedLists: true,
    embedNamed: webComponent.embedNamed ?? false,
    maxLevel: webComponent.maxLevel ?? 3,
    showNamedGraphs: webComponent.showNamedGraphs ?? false,
    metadata: webComponent.metadata,
    debug: false,
  }
}

const DEFAULT_BUILDER_OPTIONS = getBuilderOptions({})

export { getBuilderOptions, DEFAULT_BUILDER_OPTIONS }

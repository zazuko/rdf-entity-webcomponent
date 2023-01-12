import { splitIfVocab } from './utils.js'

function getWithLang (cf, options) {
  const terms = cf.out(options.labelProperties,
    { language: [...(options.preferredLanguages ?? []), '*'] }).terms
  if (terms.length) {
    const language = terms[0].language
    return {
      ...(language && { language }), string: terms[0].value
    }
  }
  return undefined
}

function getLabel (cf, options) {
  const term = cf.term

  if (term.termType === 'Literal') {
    const language = term.language
    const datatype = term.datatype
      ? splitIfVocab(term.datatype.value)
      : undefined
    return {
      ...(language && { language }),
      ...(datatype && { datatype }),
      string: term.value
    }
  }

  const datasetLabel = getWithLang(cf, options)
  if (datasetLabel) {
    return datasetLabel
  }

  if (options.externalLabels) {
    const externalLabelLang = options.preferredLanguages
      ? getWithLang(
        options.externalLabels.node(term), options)
      : undefined
    if (externalLabelLang) {
      return externalLabelLang
    }
    const externalLabel = getWithLang(options.externalLabels.node(term),
      options)
    if (externalLabel) {
      return externalLabel
    }
  }

  return { ...splitIfVocab(term.value), fallbackLabel: true }
}

export { getLabel }

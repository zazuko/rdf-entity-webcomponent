import { splitIfVocab } from './utils.js'

function getWithLang (cf, options) {
  for (const lang of options.preferredLanguages) {
    const terms = cf.out(options.labelProperties, { language: lang }).terms
    if (terms.length) {
      const language = terms[0].language
      return {
        ...(language && { language }), string: terms[0].value
      }
    }
  }
  return undefined
}

function getWithoutLang (cf, options) {
  const terms = cf.out(options.labelProperties).terms
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
    const datatype = term.datatype ? splitIfVocab(term.datatype.value) : undefined
    return {
      ...(language && { language }), ...(datatype && { datatype }), string: term.value
    }
  }

  // Get the first label with language tag, using preferredLanguages
  const datasetLabelLang = options.preferredLanguages ? getWithLang(cf, options) : undefined
  if (datasetLabelLang) {
    return datasetLabelLang
  }

  const datasetLabel = getWithoutLang(cf, options)
  if (datasetLabel) {
    return datasetLabel
  }

  if (options.externalLabels) {
    const externalLabelLang = options.preferredLanguages ? getWithLang(options.externalLabels.node(term), options) : undefined
    if (externalLabelLang) {
      return externalLabelLang
    }
    const externalLabel = getWithoutLang(options.externalLabels.node(term), options)
    if (externalLabel) {
      return externalLabel
    }
  }

  return { ...splitIfVocab(term.value), fallbackLabel: true }
}

export { getLabel }

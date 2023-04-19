import { splitIfVocab } from './utils'
import {ExtendedOptions, Label} from "../types";
import {GraphPointer} from "clownface";

function getWithLang (cf:GraphPointer, options:ExtendedOptions):Label {
  for (const property of options.labelProperties) {
    const terms = cf.out(property,
      { language: [...(options.preferredLanguages ?? []), '*'] }).terms
    if (terms.length) {
      const language = terms[0].language
      return {
        property,
        ...(language && { language }),
        value: terms[0].value
      }
    }
  }

  return undefined
}

function getLabel (cf:GraphPointer, options:ExtendedOptions):Label {
  const term = cf.term

  if (term.termType === 'Literal') {
    const label: Label  = {
      value: term.value
    }
    if (term.language) {
      label.language = term.language
    }
    if (term.datatype) {
      label.datatype = splitIfVocab(term.datatype.value)
    }
    return label
  }

  const withLang = getWithLang(cf, options)
  if (withLang) {
    return withLang
  }

  if (options.externalLabels) {
    const externalLabelLang = options.preferredLanguages
      ? getWithLang(
        options.externalLabels.node(term), options)
      : undefined
    if (externalLabelLang) {
      return externalLabelLang
    }
    const externalLabel = getWithLang(options.externalLabels.node(term), options)
    if (externalLabel) {
      return externalLabel
    }
  }

  return {
    ...splitIfVocab(term.value),
    fallbackLabel:true
  }
}

export { getLabel }

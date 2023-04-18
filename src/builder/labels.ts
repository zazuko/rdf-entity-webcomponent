import { splitIfVocab } from './utils'
import {ExtendedOptions, Label} from "../types";
import {GraphPointer} from "clownface";

function getWithLang (cf:GraphPointer, options:ExtendedOptions) {
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
      const {vocab,value } = splitIfVocab(term.datatype.value)
      label.datatype = {
        vocab,
        value
      }
    }

    return label
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

  const {vocab, value} = splitIfVocab(term.value)
  const result:Label = {
    value,
    fallbackLabel:true
  }
  if (vocab){
    result.vocab = vocab
  }
  return result
}

export { getLabel }

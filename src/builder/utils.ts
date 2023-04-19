import { ns } from '../namespaces'
import {rdf} from '../rdf-ext'
import {GraphPointer} from "clownface";
import {VocabValue} from "../types";

function predicates (cf:GraphPointer) {
  return [...rdf.termSet(quads(cf).map(quad => quad.predicate))]
}

function quads (cf:GraphPointer) {
  return [...cf.dataset.match(cf.term, null, null, null)]
}

function splitIfVocab (iri:string):VocabValue {
  const candidates = Array.from(Object.entries(ns)).filter(([_, value]) => {
    return iri.startsWith(value().value)
  })

  if (candidates.length) {
    candidates.sort(([, iri1], [, iri2]) => iri2.length - iri1.length)
    const found = candidates[0]

    return {
      value: iri.replace(new RegExp(`^${found[1]().value}`), ''),
      vocab: found[0]
    }
  }
  const lastSegment = iri.endsWith('/')
    ? iri.slice(0, -1).split('/').pop()
    : iri.split('/').pop()
  return {
    value: lastSegment
  }
}

export { predicates, quads, splitIfVocab }

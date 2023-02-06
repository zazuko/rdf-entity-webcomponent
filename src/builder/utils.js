import { ns } from '../namespaces.js'
import rdf from '../rdf-ext.js'

function subjects (cf) {
  return [...rdf.termSet(quads(cf).map(quad => quad.subject))]
}

function predicates (cf) {
  return [...rdf.termSet(quads(cf).map(quad => quad.predicate))]
}

function quads (cf) {
  return [...cf.dataset.match(cf.term, null, null, null, null)]
}

function splitIfVocab (iri) {
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

export { subjects, predicates, quads, splitIfVocab }

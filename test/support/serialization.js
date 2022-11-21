import { Parser } from 'n3'
import rdf from '../../src/rdf-ext.js'

const parser = new Parser()

function toQuads (str) {
  return parser.parse(str)
}

function toString (quads) {
  const dataset = rdf.dataset().addAll(quads)
  return dataset.toString()
}

export { toQuads, toString }

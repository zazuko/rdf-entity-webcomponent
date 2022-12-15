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

function toClownface (turtle, term) {
  const dataset = rdf.dataset()
  for (const quad of toQuads(turtle.toString())) {
    dataset.add(quad)
  }
  return rdf.clownface({ dataset, term })
}

export { toQuads, toString, toClownface }

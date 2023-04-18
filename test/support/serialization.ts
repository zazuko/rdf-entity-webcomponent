// @ts-ignore
import { Parser } from 'n3'
import { rdf } from '../../src/rdf-ext'
import {Quad, Term} from "rdf-js";

const parser = new Parser()

function toQuads (str:string) {
  return parser.parse(str)
}

function toString (quads:Quad[]) {
  const dataset = rdf.dataset().addAll(quads)
  return dataset.toString()
}

function toClownface (turtle:string, term:Term) {
  const dataset = rdf.dataset()
  for (const quad of toQuads(turtle.toString())) {
    dataset.add(quad)
  }
  return rdf.clownface({ dataset, term })
}

export { toQuads, toString, toClownface }

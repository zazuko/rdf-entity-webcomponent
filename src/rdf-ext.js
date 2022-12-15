import clownface from 'clownface'
import rdf from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import namespace from '@rdfjs/namespace'
import TermSet from '@rdfjs/term-set'
import TermMap from '@rdfjs/term-map'
import { Parser } from 'n3'

rdf.dataset = (arg) => datasetFactory.dataset(arg)
rdf.clownface = (arg) => clownface(arg)
rdf.namespace = (arg) => namespace(arg)
rdf.termSet = (arg) => new TermSet(arg)
rdf.termMap = (arg) => new TermMap(arg)

const parser = new Parser()

rdf.parse = (turtle) => {
  const dataset = datasetFactory.dataset()
  for (const quad of parser.parse(turtle)) {
    dataset.add(quad)
  }
  return dataset
}

export default rdf

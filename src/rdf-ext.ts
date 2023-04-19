import datasetFactory from '@rdfjs/dataset'
import namespace from '@rdfjs/namespace'
// @ts-ignore
import * as N3 from 'n3';
import rdfModel from '@rdfjs/data-model'
import clownface from 'clownface'
import TermSet from '@rdfjs/term-set'
import TermMap from '@rdfjs/term-map'

const rdf = {
    termSet:(arg) => new TermSet(arg),
    termMap:(arg) => new TermMap(arg),
    clownface,
    dataset:() => datasetFactory.dataset(),
    namespace,
    namedNode:rdfModel.namedNode,
    blankNode:rdfModel.blankNode
}

const parser = new N3.Parser();

function parse(turtle: string) {
    const dataset = datasetFactory.dataset()
    for (const quad of parser.parse(turtle)) {
        dataset.add(quad)
    }
    return dataset
}

export {
    parse, rdf
}

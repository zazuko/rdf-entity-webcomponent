import datasetFactory from '@rdfjs/dataset'
import namespace from '@rdfjs/namespace'
// @ts-ignore
import * as N3 from 'n3';
import rdf from 'rdf-ext'
import clownface from 'clownface'

const parser = new N3.Parser();

function dataset() {
    return datasetFactory.dataset()
}

function parse(turtle: string) {
    const dataset = datasetFactory.dataset()
    for (const quad of parser.parse(turtle)) {
        dataset.add(quad)
    }
    return dataset
}

export {
    dataset, clownface, namespace, parse, rdf
}

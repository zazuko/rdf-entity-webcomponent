import {rdf} from './rdf-ext'
import {createEntityWithContext, EntityContext} from './builder/entityBuilder'
import {EntityData, Options} from "./types";
import DatasetCore from '@rdfjs/dataset/DatasetCore';
import rdfjs__termSet from '@rdfjs/term-set';
import { Term, Quad } from 'rdf-js';

function getSecondary(primary: rdfjs__termSet<Term>, dataset: DatasetCore<Quad>) {
    const secondary = rdf.termSet([])
    for (const quad of dataset) {
        if (!primary.has(quad.subject)) {
            secondary.add(quad.subject)
        }
    }
    return secondary
}

function createModel({dataset, terms}:EntityData, options:Options) {
    const visited = rdf.termSet([])
    const entities = []

    // render the user-specified terms first
    const primary = rdf.termSet(terms || [])

    const subjects = [...terms || [], ...getSecondary(primary, dataset)]

    for (const subject of subjects) {
        if (!visited.has(subject)) {
            const singlePointer = rdf.clownface({dataset, term: subject})

            const context:EntityContext = {
                level: 0,
                visited: visited,
                remainingEntities: [],
                incomingProperty: undefined
            }

            const {entity} = createEntityWithContext(singlePointer, options, context)

            entities.push(entity)
        }
    }
    return entities
}

export {createModel}

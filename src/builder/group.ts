import rdfjs__termSet from '@rdfjs/term-set';
import { Term } from 'rdf-js';
import {rdf} from '../rdf-ext'
import {ExtendedOptions, Row} from "../types";

function groupRows(rows: Row[], options: ExtendedOptions):Row[] {
    // Already grouped by property. If groupValuesByProperty is false, expand.
    const byProperty = options.groupValuesByProperty ? rows : rows.map(row => row.values.map(value => {
        return {
            properties: row.properties, values: [value]
        }
    })).flat()
    return options.groupPropertiesByValue ? _groupByValue(byProperty) : byProperty
}

function _groupByValue(rows: Row[]):Row[] {
    const rowsByObject = new Map()
    const eqSet = (a: rdfjs__termSet<Term>, b: { size: any; has: (arg0: any) => unknown; }) => a.size === b.size && [...a].every(value => b.has(value))

    function hasKey(key1: rdfjs__termSet<Term>) {
        for (const [key2] of rowsByObject) {
            if (eqSet(key1, key2)) {
                return true
            }
        }
    }

    function get(key1: rdfjs__termSet<Term>) {
        for (const [key2, value] of rowsByObject) {
            if (eqSet(key1, key2)) {
                return value
            }
        }
    }

    for (const row of rows) {
        const terms = row.values.map(value => value.term)
        const objectTarget = rdf.termSet(terms)
        if (hasKey(objectTarget)) {
            const currentTarget = get(objectTarget)
            currentTarget.properties = [...currentTarget.properties, ...row.properties]
        } else {
            rowsByObject.set(objectTarget, row)
        }
    }
    return [...rowsByObject.values()]
}

export {groupRows}

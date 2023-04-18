import { ns } from '../namespaces'
import {Entity, Options, Row} from "../types";
import {Term} from "rdf-js";

function sortRows (rows:Row[], options:Options) {
  const { sortRows } = options
  if (sortRows) {
    rows.sort(_sortRows)
    for (const row of rows) {
      row.properties.sort(_sortItem)
      row.values.sort(_sortItem)
    }
  }
}

const sortStrings = (a:string, b:string) => a.toUpperCase().localeCompare(b.toUpperCase())
const sortNamed = (a:Term, b:Term) => sortStrings(a.value, b.value)

function _sortItem (a:Entity, b:Entity) {
  if (a.label && b.label) {
    return a.label.value.localeCompare(b.label.value)
  }
  return sortNamed(a.term, b.term)
}

function _sortRows (a:Row, b:Row) {
  if (!b.properties) {
    return 0
  }
  if (!a.properties) {
    return 0
  }

  if ((a.properties.length === 1) && (b.properties.length === 1)) {
    if (ns.rdf.type.equals(b.properties[0].term)) {
      return 1
    }
    if (ns.rdf.type.equals(a.properties[0].term)) {
      return -1
    }
    return sortNamed(a.properties[0].term, b.properties[0].term)
  }

  return b.properties.length - a.properties.length;
}

export { sortRows }

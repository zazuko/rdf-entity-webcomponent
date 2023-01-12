import { ns } from '../namespaces.js'

function sortRows (rows, options) {
  const { sortRows } = options
  if (sortRows) {
    rows.sort(_sortRows)
    for (const row of rows) {
      row.properties.sort(_sortItem)
      row.values.sort(_sortItem)
    }
  }
}

const sortStrings = (a, b) => a.toUpperCase().localeCompare(b.toUpperCase())
const sortNamed = (a, b) => sortStrings(a.value, b.value)

function _sortItem (a, b) {
  if (a.label && b.label) {
    return a.label.value.localeCompare(b.label.value)
  }
  return sortNamed(a, b)
}

function _sortRows (a, b) {
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

  return b.properties.length < a.properties.length
}

export { sortRows }

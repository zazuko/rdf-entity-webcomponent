import { ns } from '../namespaces.js'

const sortStrings = (a, b) => a.toUpperCase().localeCompare(b.toUpperCase())
const sortNamed = (a, b) => sortStrings(a.value, b.value)

function sortItem (a, b) {
  if (a.label && b.label) {
    return a.label.string.localeCompare(b.label.string)
  }
  return sortNamed(a, b)
}

function sortRows (a, b) {
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

export { sortRows, sortItem }

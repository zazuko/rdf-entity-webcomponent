import rdf from '../rdf-ext.js'

function groupByValue (rows) {
  const rowsByObject = new Map()
  const eqSet = (a, b) => a.size === b.size &&
    [...a].every(value => b.has(value))

  function hasKey (key1) {
    for (const [key2] of rowsByObject) {
      if (eqSet(key1, key2)) {
        return true
      }
    }
  }

  function get (key1) {
    for (const [key2, value] of rowsByObject) {
      if (eqSet(key1, key2)) {
        return value
      }
    }
  }

  for (const row of rows) {
    const objectTarget = rdf.termSet(row.values.map(value => value.term))
    if (hasKey(objectTarget)) {
      const currentTarget = get(objectTarget)
      currentTarget.properties = [
        ...currentTarget.properties, ...row.properties]
    } else {
      rowsByObject.set(objectTarget, row)
    }
  }
  return [...rowsByObject.values()]
}

export { groupByValue }

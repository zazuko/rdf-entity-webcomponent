import { ns } from '../namespaces.js'
import { getLabel } from './labels.js'

function getTypes (cf, options) {
  const terms = cf.out(ns.rdf.type).terms
  return terms.map(term => {
    return {
      term,
      label: getLabel(cf.node(term), options)
    }
  })
}

export { getTypes }

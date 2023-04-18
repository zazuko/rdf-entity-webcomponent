import { ns } from '../namespaces'
import { getLabel } from './labels'
import {GraphPointer} from "clownface";
import {ExtendedOptions, Options} from "../types";

function getTypes (cf:GraphPointer, options:ExtendedOptions) {
  const terms = cf.out(ns.rdf.type).terms
  return terms.map(term => {
    return {
      term,
      label: getLabel(cf.node(term), options)
    }
  })
}

export { getTypes }

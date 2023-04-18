import {
    schema, rdf, rdfs, skos, foaf, dash, xsd, sh, skosxl, vcard
} from '@tpluscode/rdf-ns-builders'
import {NamespaceBuilder} from "@rdfjs/namespace";

type Namespaces = {
    [key: string]: NamespaceBuilder;
}

const ns: Namespaces = {
    schema, rdf, rdfs, skos, foaf, dash, xsd, sh, skosxl, vcard
}

export {ns}

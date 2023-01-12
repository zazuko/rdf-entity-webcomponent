import rdf from '../src/rdf-ext.js'

const battery = {

  simple: [
    `
<a> <b> <c> .
`, rdf.namedNode('a')],

  literal: [
    `
<a> <b> "c" .
`, rdf.namedNode('a')],

  'groups attributes': [
    `
<a> <b> <c> ;
    <b> <d> .
`, rdf.namedNode('a')],

  'groups by value': [
    `
<a> <b> <d> ;
    <c> <d> .
`, rdf.namedNode('a')],

  'does not repeat': [
    `
<a> <b> <c> ;
    <b> <c> .
`, rdf.namedNode('a')],

  'blank node': [
    `
<a> <b> [ <c> <d> ] .
`, rdf.namedNode('a')],

  list: [
    `
<a> <b> ( <c> <d> ) .
`, rdf.namedNode('a')],

  'subject label skos': [
    `
<a> <b> <c> .
<a> <http://www.w3.org/2004/02/skos/core#prefLabel> "skos a" .
`, rdf.namedNode('a')],

  'subject label rdfs': [
    `
<a> <b> <c> .
<a> <http://www.w3.org/2000/01/rdf-schema#label> "rdfs a" .
`, rdf.namedNode('a')],

  'subject label foaf': [
    `
<a> <b> <c> .
<a> <http://xmlns.com/foaf/0.1/name> "foaf a" .
`, rdf.namedNode('a')],

  'subject label schema': [
    `
<a> <b> <c> .
<a> <http://schema.org/name> "schema a" .
`, rdf.namedNode('a')],

  'predicate label skos': [
    `
<a> <b> <c> .
<b> <http://www.w3.org/2004/02/skos/core#prefLabel> "skos b" .
`, rdf.namedNode('a')],

  'predicate label rdfs': [
    `
<a> <b> <c> .
<b> <http://www.w3.org/2000/01/rdf-schema#label> "rdfs b" .
`, rdf.namedNode('a')],

  'predicate label foaf': [
    `
<a> <b> <c> .
<b> <http://xmlns.com/foaf/0.1/name> "foaf b" .
`, rdf.namedNode('a')],

  'predicate label schema': [
    `
<a> <b> <c> .
<b> <http://schema.org/name> "schema b" .
`, rdf.namedNode('a')],

  'object label skos': [
    `
<a> <b> <c> .
<c> <http://www.w3.org/2004/02/skos/core#prefLabel> "skos c" .
`, rdf.namedNode('a')],

  'object label rdfs': [
    `
<a> <b> <c> .
<c> <http://www.w3.org/2000/01/rdf-schema#label> "rdfs c" .
`, rdf.namedNode('a')],

  'object label foaf': [
    `
<a> <b> <c> .
<c> <http://xmlns.com/foaf/0.1/name> "foaf c" .
`, rdf.namedNode('a')],

  'object label schema': [
    `
<a> <b> <c> .
<c> <http://schema.org/name> "schema c" .
`, rdf.namedNode('a')],

  'foaf image': [
    `
<a> <http://xmlns.com/foaf/0.1/img> <little-cat> .
`, rdf.namedNode('a')],

  'schema image': [
    `
<a> <http://schema.org/image> <little-cat> .
`, rdf.namedNode('a')],

  languages: [
    `
<a> <b> <c> .
<a> <http://www.w3.org/2004/02/skos/core#prefLabel> "skos a" .
<a> <http://www.w3.org/2004/02/skos/core#prefLabel> "prefered"@en .
`, rdf.namedNode('a')],
  languagesMultiple: [
    `
<a> <http://www.w3.org/2004/02/skos/core#prefLabel> "first" .
<a> <http://www.w3.org/2004/02/skos/core#prefLabel> "second" .
`, rdf.namedNode('a')],
  types: [
    `<a> a <b> .
<a> a <c> .
<c> <http://schema.org/name> "class c" .

`, rdf.namedNode('a')]

}

export { battery }

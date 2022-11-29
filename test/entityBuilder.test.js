import chai from 'chai'

import schema from 'chai-json-schema'

import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import rdf from '../src/rdf-ext.js'
import { createEntity } from '../src/builder/entityBuilder.js'
import { toQuads } from './support/serialization.js'

expect.extend({ toMatchSnapshot })

const assert = chai.assert

chai.use(schema)

function toClownface (turtle, term) {
  const dataset = rdf.dataset()
  for (const quad of toQuads(turtle.toString())) {
    dataset.add(quad)
  }

  return rdf.clownface({ dataset, term })
}

const entitySchema = {
  title: 'entity',
  type: 'object',
  properties: {
    required: ['termType', 'label'],
    termType: {
      type: 'string', enum: ['BlankNode', 'NamedNode', 'Literal']
    },
    label: {
      type: 'object',
      required: ['string'],
      properties: {
        string: {
          type: 'string'
        },
        vocab: {
          type: 'string'
        },
        language: {
          type: 'string'
        }
      }
    },
    url: {
      type: 'string'
    },
    term: {
      type: 'object',
      properties: {
        value: {
          type: 'string'
        },
        termType: {
          type: 'string'
        }
      }
    },
    rows: {
      type: 'array',
      properties: {
        title: 'row',
        required: ['properties', 'values'],
        properties: {
          renderAs: {
            type: 'string'
          },
          properties: {
            type: 'array',
            items: {
              $ref: '#'
            }
          },
          values: {
            type: 'array',
            items: {
              $ref: '#'
            }
          }
        }
      }
    }
  }
}

describe('entityBuilder', () => {
  it('should be a function', () => {
    assert.equal(typeof createEntity, 'function')
  })

  it('should create a model', () => {
    const data = '<a> <b> <c>.'
    const cf = toClownface(data, rdf.namedNode('a'))
    const result = createEntity(cf)

    assert.jsonSchema(result, entitySchema)
  })

  it('embeds blank nodes', () => {
    const data = '<a> <a> [ <a> [ <a> [ <a> [ <a> <a> ] ] ] ] .'
    const cf = toClownface(data, rdf.namedNode('a'))
    const result = createEntity(cf)

    assert.jsonSchema(result, entitySchema)
  })

  it('breaks circular references', () => {
    const data = '_:a <a> [ <b> _:a] .'
    const cf = toClownface(data, rdf.blankNode('_:a'))

    const result = createEntity(cf)
    assert.jsonSchema(result, entitySchema)
  })
})

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
`, rdf.namedNode('a')]
}

describe('default', () => {
  for (const [testName, [turtle, term]] of Object.entries(battery)) {
    it(testName, function () {
      const cf = toClownface(turtle, term)
      const result = createEntity(cf)

      expect([turtle, term, result]).toMatchSnapshot(this)

      assert.jsonSchema(result, entitySchema)
    })
  }
})

describe('ignore property', () => {
  for (const [testName, [turtle, term]] of Object.entries(battery)) {
    it(testName, function () {
      const cf = toClownface(turtle, term)

      const options = {
        embedNamedNodes: true,
        embedBlankNodes: true,
        ignoreProperties: rdf.termSet(
          [rdf.namedNode('http://www.w3.org/2000/01/rdf-schema#label')])
      }

      const result = createEntity(cf, options)

      expect([turtle, term, result]).toMatchSnapshot(this)

      assert.jsonSchema(result, entitySchema)
    })
  }
})

describe('no grouping by value or property', () => {
  for (const [testName, [turtle, term]] of Object.entries(battery)) {
    it(testName, function () {
      const cf = toClownface(turtle, term)

      const options = {
        groupValuesByProperty: false,
        groupPropertiesByValue: false,
        embedNamedNodes: true,
        embedBlankNodes: true
      }

      const result = createEntity(cf, options)

      expect([turtle, term, result]).toMatchSnapshot(this)

      assert.jsonSchema(result, entitySchema)
    })
  }
})

it('do not repeat with compactMode false', function () {
  const data = `
<a> <d> <e> ;
    <d> <e> .
<e> <b> <c>.
`
  const cf = toClownface(data, rdf.namedNode('a'))

  const options = {
    embedLists: true,
    embedNamedNodes: true,
    groupValuesByProperty: true,
    groupPropertiesByValue: true,
    externalLabels: rdf.clownface({ dataset: rdf.dataset() }),
    preferredLanguages: ['de', 'fr', 'it', 'en']
  }

  const result = createEntity(cf, options)

  expect(result).toMatchSnapshot(this)
})

it('do not repeat with compactMode true', function () {
  const data = `
<a> <d> <e> ;
    <d> <e> .
<e> <b> <c>.
`

  const cf = toClownface(data, rdf.namedNode('a'))

  const options = {
    embedLists: false,
    embedNamedNodes: true,
    groupValuesByProperty: false,
    groupPropertiesByValue: false,
    externalLabels: rdf.clownface({ dataset: rdf.dataset() }),
    preferredLanguages: ['de', 'fr', 'it', 'en']
  }
  const result = createEntity(cf, options)

  expect(result).toMatchSnapshot(this)
})

it('fetch languages', function () {
  const data = `
<a> <http://schema.org/name> "Or me" ;
    <http://schema.org/name> "Me"@de .
`
  const cf = toClownface(data, rdf.namedNode('a'))

  const options = {
    externalLabels: rdf.clownface({ dataset: rdf.dataset() }),
    preferredLanguages: ['de', 'fr', 'it', 'en']
  }
  const result = createEntity(cf, options)
  expect(result).toMatchSnapshot(this)
})

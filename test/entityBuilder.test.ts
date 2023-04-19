// @ts-ignore
import chai from 'chai'
// @ts-ignore
import schema from 'chai-json-schema'
import { expect } from 'expect'
// @ts-ignore
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { rdf } from '../src/rdf-ext'
import {createEntity, EntityContext} from '../src/builder/entityBuilder'
import { toClownface } from './support/serialization'
import { battery } from './battery'
import {defaultOptions} from '../src/builder/entityBuilder'
import {Options} from "../src/types";

expect.extend({ toMatchSnapshot })

const assert = chai.assert

chai.use(schema)

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
      required: ['value'],
      properties: {
        value: {
          type: 'string'
        },
        property: {
          type: 'object'
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

 const context:EntityContext = {
  level: 0,
  visited: rdf.termSet([]),
  remainingEntities: [],
  incomingProperty: undefined
}

describe('entityBuilder', () => {
  it('should be a function', () => {
    assert.equal(typeof createEntity, 'function')
  })

  it('should create a model', () => {
    const data = '<a> <b> <c>.'
    const cf = toClownface(data, rdf.namedNode('a'))
    const result = createEntity(cf, defaultOptions, context)
    assert.jsonSchema(result, entitySchema)
  })

  it('embeds blank nodes', () => {
    const data = '<a> <a> [ <a> [ <a> [ <a> [ <a> <a> ] ] ] ] .'
    const cf = toClownface(data, rdf.namedNode('a'))
    const result = createEntity(cf, defaultOptions, context)

    assert.jsonSchema(result, entitySchema)
  })

  it('breaks circular references', () => {
    const data = '_:a <a> [ <b> _:a] .'
    const cf = toClownface(data, rdf.blankNode('_:a'))

    const result = createEntity(cf, defaultOptions, context)
    assert.jsonSchema(result, entitySchema)
  })
})

describe('default', () => {
  for (const [testName, [turtle, term]] of Object.entries(battery)) {
    it(testName, function () {
      const cf = toClownface(turtle, term)
      const result = createEntity(cf, defaultOptions, context)
      // @ts-ignore
      expect([turtle, term, result]).toMatchSnapshot(this)
      assert.jsonSchema(result, entitySchema)
    })
  }
})

describe('ignore property', () => {
  for (const [testName, [turtle, term]] of Object.entries(battery)) {
    it(testName, function () {
      const cf = toClownface(turtle, term)

      const options:Options = {
        ...defaultOptions,
        embedNamedNodes: true,
        embedBlankNodes: true,
        ignoreProperties: rdf.termSet(
          [rdf.namedNode('http://www.w3.org/2000/01/rdf-schema#label')])
      }

      const result = createEntity(cf, options, context)
      // @ts-ignore
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
        ...defaultOptions,
        groupValuesByProperty: false,
        groupPropertiesByValue: false,
        embedNamedNodes: true,
        embedBlankNodes: true
      }

      const result = createEntity(cf, options, context)
      // @ts-ignore
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
    ...defaultOptions,
    embedLists: true,
    embedNamedNodes: true,
    groupValuesByProperty: true,
    groupPropertiesByValue: true,
    externalLabels: rdf.clownface({ dataset: rdf.dataset() }),
    preferredLanguages: ['de', 'fr', 'it', 'en']
  }

  const result = createEntity(cf, options, context)
// @ts-ignore
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
    ...defaultOptions,
    embedLists: false,
    embedNamedNodes: true,
    groupValuesByProperty: false,
    groupPropertiesByValue: false,
    externalLabels: rdf.clownface({ dataset: rdf.dataset() }),
    preferredLanguages: ['de', 'fr', 'it', 'en']
  }
  const result = createEntity(cf, options, context)
// @ts-ignore
  expect(result).toMatchSnapshot(this)
})

it('fetch languages', function () {
  const data = `
<a> <http://schema.org/name> "Or me" ;
    <http://schema.org/name> "Me"@de .
`
  const cf = toClownface(data, rdf.namedNode('a'))

  const options = {
    ...defaultOptions,
    externalLabels: rdf.clownface({ dataset: rdf.dataset() }),
    preferredLanguages: ['de', 'fr', 'it', 'en']
  }
  const result = createEntity(cf, options, context)
  // @ts-ignore
  expect(result).toMatchSnapshot(this)
})

it('show images foaf', function () {
  const data = `
<dog> <http://xmlns.com/foaf/0.1/img> <dogImg> .
`
  const cf = toClownface(data, rdf.namedNode('dog'))

  const options = {
    ...defaultOptions,
    showImages: true
  }
  const result = createEntity(cf, options, context)
  // @ts-ignore
  expect(result).toMatchSnapshot(this)
})

it('show images schema', function () {
  const data = `
<cat> <http://schema.org/image> <catImg> .
`
  const cf = toClownface(data, rdf.namedNode('cat'))

  const options = {
    ...defaultOptions,
    showImages: true
  }
  const result = createEntity(cf, options, context)
  // @ts-ignore
  expect(result).toMatchSnapshot(this)
})

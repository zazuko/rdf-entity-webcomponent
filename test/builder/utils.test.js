import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { splitIfVocab } from '../../src/builder/utils.js'

expect.extend({ toMatchSnapshot })

const entities = [
  'https://example.org/people/',
  'http://www.w3.org/2001/XMLSchema#string',
  'https://example.org/people']

describe('utils', () => {
  for (const named of entities) {
    it(`splitIfVocab ${named}`, function () {
      const result = splitIfVocab(named)
      expect(result).toMatchSnapshot(this)
    })
  }
})

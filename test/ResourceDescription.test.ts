import { expect } from 'expect'
// @ts-ignore
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'

import { battery } from './battery'
import { toClownface } from './support/serialization'
import { EntityList } from '../src/components/EntityList'
import {
  render as renderWebComponent
} from '@lit-labs/ssr/lib/render-with-global-dom-shim.js'
import {defaultOptions} from '../src/builder/entityBuilder'
import {GraphPointer} from "clownface";

expect.extend({ toMatchSnapshot })

describe('ResourceDescription', () => {
  for (const [testName, [turtle, term]] of Object.entries(battery)) {
    it(`HTML ${testName}`, function () {
      const cf:GraphPointer = toClownface(turtle, term)

      const resourceWebComponent = EntityList(cf, defaultOptions)
      const stringIterator = renderWebComponent(resourceWebComponent)
      const html = Array.from(stringIterator).join('')
      // @ts-ignore
      expect([turtle, term, html]).toMatchSnapshot(this)
    })
  }
})

import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { EntityList } from '../src/components/EntityList.js'
import { battery } from './battery.js'
import { toClownface } from './support/serialization.js'
import {
  render as renderWebComponent
} from '@lit-labs/ssr/lib/render-with-global-dom-shim.js'

expect.extend({ toMatchSnapshot })

describe('ResourceDescription', () => {
  for (const [testName, [turtle, term]] of Object.entries(battery)) {
    it(`HTML ${testName}`, function () {
      const cf = toClownface(turtle, term)

      const resourceWebComponent = EntityList(cf, {})
      const stringIterator = renderWebComponent(resourceWebComponent)
      const html = Array.from(stringIterator).join('')
      expect([turtle, term, html]).toMatchSnapshot(this)
    })
  }
})

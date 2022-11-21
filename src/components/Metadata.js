import { html } from 'lit-element'
import { namedCounts } from '../model.js'

function maybeLink (key) {
  console.log(key.termType)
  return key.termType === 'NamedNode'
    ? html`<a
          href="${key.value}">${key.value}</a>`
    : html`${key}`
}

function Metadata (cf, options) {
  const counts = namedCounts(cf, options)
  const list = []
  for (const [key, value] of counts.entries()) {
    list.push(html`<tr><td>${maybeLink(key)}</td><td>${maybeLink(value)} quads</td></tr>`)
  }

  for (const [key, value] of Object.entries(options.metadata)) {
    list.push(html`<tr><td>${maybeLink(key)}</td><td>${maybeLink(value)}</td></tr>`)
  }

  return html`
      <div class="metadata">
          <h3>Metadata</h3>
          <table>
            ${list}
          </table>
      </div>
  `
}

export { Metadata }

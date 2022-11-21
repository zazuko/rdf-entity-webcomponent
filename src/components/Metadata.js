import { html } from 'lit-element'
import { namedCounts } from '../model.js'

function maybeLink (key) {
  console.log(key.termType)
  return key.termType === 'NamedNode' ? html`<a
          href="${key.value}">${key.value}</a>` : html`${key}`
}

function Metadata (cf, options) {
  const counts = namedCounts(cf, options)
  const list = []
  for (const [key, value] of counts.entries()) {
    list.push(html`
        <div class="entry">
            <span class="key">${maybeLink(key)}</span>
            <span class="value">${value} quads</span>
        </div>`)
  }

  for (const [key, value] of Object.entries(options.metadata)) {
    list.push(html`
        <div class="entry">
            <span class="key">${maybeLink(key)}</span>
            <span class="value">${maybeLink(value)}</span>
        </div>`)
  }

  return html`
      <div class="metadata">
          <h3>Metadata</h3>
          ${list}
      </div>
  `
}

export { Metadata }

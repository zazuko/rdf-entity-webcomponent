import { html } from 'lit'
import { namedCounts } from '../model.js'
import { splitIfVocab } from '../builder/utils.js'
import rdf from '../rdf-ext.js'
import toNT from '@rdfjs/to-ntriples'

function shrink (urlStr) {
  const { vocab, string } = splitIfVocab(urlStr)
  return vocab ? `${vocab}:${string}` : `${string}`
}

function renderTerm (term) {
  if (term.termType === 'NamedNode') {
    return html`<a href="${term.value}">${shrink(term.value)}</a>`
  }
  if (term.constructor.name === 'DefaultGraph') {
    return html`Default graph`
  }
  if (term.termType) {
    return html`${toNT(term)}`
  }
  if (term.value) {
    return html`${term.value}`
  }
  return html`${term}`
}

function Metadata (cf, options) {
  const counts = options.showNamedGraphs
    ? namedCounts(cf, options)
    : rdf.termMap()
  const list = []
  for (const [key, value] of counts.entries()) {
    list.push(html`
        <tr>
            <td>${renderTerm(key)}</td>
            <td>${renderTerm(value)} quads</td>
        </tr>`)
  }

  if (options.metadata) {
    for (const [key, value] of Object.entries(options.metadata)) {
      list.push(html`
          <tr>
              <td>${renderTerm(key)}</td>
              <td>${renderTerm(value)}</td>
          </tr>`)
    }
  }

  if (list.length) {
    return html`
        <div class="metadata">
            <h3>Metadata</h3>
            <table>
                ${list}
            </table>
        </div>
    `
  } else {
    return html``
  }
}

export { Metadata, renderTerm }

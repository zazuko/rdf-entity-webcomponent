import { html } from 'lit-element'
import { namedCounts } from '../model.js'
import { ns } from '../namespaces.js'
import { splitIfVocab } from '../builder/utils.js'

function getLiteralString (literal) {
  const langChunk = ns.rdf.langString.equals(literal.datatype)
    ? `@${literal.language}`
    : ''
  const xsdChunk = ns.xsd.string.equals(literal.datatype) ? `^^${shrink(
    literal.datatype.value)}` : ''
  return `"${literal.value}"${langChunk}${xsdChunk}`
}

function shrink (urlStr) {
  const { vocab, string } = splitIfVocab(urlStr)
  return vocab ? `${vocab}:${string}` : `${string}`
}

function renderTerm (term) {

  if (term.termType === 'Literal') {
    return html`${getLiteralString(term)}`
  }

  if (term.constructor.name === 'DefaultGraph') {
    return html`Default graph`
  }

  if (term.termType === 'NamedNode') {
    return html`<a href="${term.value}">${shrink(term.value)}</a>`
  }

  return html`${term}`
}


function Metadata (cf, options) {
  const counts = namedCounts(cf, options)
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

  return html`
      <div class="metadata">
          <h3>Metadata</h3>
          <table>
              ${list}
          </table>
      </div>
  `
}

export { Metadata, renderTerm }

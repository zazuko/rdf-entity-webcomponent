import { css, html, LitElement } from 'lit'
import rdf from '../src/rdf-ext.js'
import { EntityList } from './components/EntityList.js'
import { DEFAULT_BUILDER_OPTIONS, getBuilderOptions } from './options.js'

export class RdfEntity extends LitElement {
  static styles = css`
    :host {
      --border: #d1d1d1;
      --metadata: #4f4f4f;
    }

    .entities {
      display: flex;
      flex-direction: column;
      gap: 20px;
      border-right: 1px solid var(--border);
    }

    .entity {
      display: flex;
      flex-direction: column;
      border-left: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
      border-top: 1px solid var(--border);
    }

    .rows {
      display: flex;
      flex-direction: column;
    }

    .rows > :nth-child(1n) {
      border-top: 1px solid var(--border);
    }

    .rows > :nth-child(2n) {
      border-top: 1px solid var(--border);
      background: rgba(0, 0, 0, 0.01);
    }

    .rows > .row {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    }

    /* Properties */

    .row > :nth-child(1) {
      align-self: flex-start;
      width: 35%;
      word-break: break-all;
      margin-left: 1%;
      margin-right: 1rem;
      margin-top: 1rem;
      margin-bottom: 1rem;
    }

    /* Values */

    .row > :nth-child(2) {
      wrap-option: wrap;
      width: 65%;
      word-break: break-all;
      margin-left: 1rem;
      margin-right: auto;
      margin-top: 1rem;
      margin-bottom: 1rem;
    }

    ul {
      display: flex;
      flex-direction: column;
      list-style: none;
      gap: 5px;
      justify-content: center;
      padding-left: 5px;
    }

    ol {
      display: flex;
      flex-direction: column;
      gap: 5px;
      justify-content: center;
      padding-left: 5px;
    }

    div .bringDown {
      color: var(--metadata);
    }

    .vocab {
      color: var(--metadata);
      font-size: 0.7rem;
    }

    .vocab::after {
      content: ':';
    }

    .language {
      color: var(--metadata);
      font-size: 0.7rem;
      margin-left: 4px;
    }

    .datatype {
      color: var(--metadata);
      font-size: 0.5rem;
      margin-left: 4px;
    }

    .BlankNode {
      //font-size: 10px;
    }

    .BlankNode a {
      color: var(--metadata);
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    .img-container {
      margin-left: auto;
      margin-right: auto;
    }

    .img-container img {
      max-width: 200px;
    }
  `

  constructor () {
    super()
    for (const [key, value] of Object.entries(DEFAULT_BUILDER_OPTIONS)) {
      this[key] = value
    }

    this.attachShadow({ mode: 'open' })
  }

  static get properties () {
    return {
      dataset: { type: Object, attribute: false, required: true },
      terms: { type: Object, attribute: false, required: true },
      term: {
        type: String, attribute: 'term', required: false
      },
      technicalCues: {
        type: Boolean, attribute: 'technical-cues', required: false
      },
      compactMode: {
        type: Boolean, attribute: 'compact-mode', required: false
      },
      preferredLanguages: {
        type: Array, attribute: 'preferred-languages', required: false
      },
      embedNamedNodes: {
        type: Boolean, attribute: 'embed-named-nodes', required: false
      },
      embedBlankNodes: {
        type: Boolean, attribute: 'embed-blank-nodes', required: false
      },
      embedLists: { type: Boolean, attribute: 'embed-lists', required: false },
      highlightLanguage: {
        type: Boolean, attribute: 'highlight-language', required: false
      },
      maxLevel: { type: Number, attribute: 'max-level', required: false },
      showImages: { type: Boolean, attribute: 'show-images', required: false },
      simplifiedMode: {
        type: Boolean,
        attribute: 'simplified-mode',
        required: false
      }
    }
  }

  get dataset () {
    return this._dataset
  }

  set dataset (dataset) {
    this._dataset = dataset
    this.requestUpdate()
  }

  get terms () {
    return this._terms
  }

  set terms (terms) {
    this._terms = terms
    this.requestUpdate()
  }

  render () {
    const terms = this._terms
      ? this.terms
      : this.term
        ? [
            rdf.namedNode(this.term)]
        : undefined

    if (this.textContent && this.textContent.trim().length > 0) {
      try {
        const dataset = rdf.parse(this.textContent)
        return EntityList({
          dataset, terms
        }, getBuilderOptions(this))
      } catch (error) {
        return html`${error}`
      }
    } else if (!this._dataset) {
      return html`requires a dataset`
    } else if (!this._dataset.size) {
      return html`No quads`
    } else {
      return EntityList({
        dataset: this._dataset, terms
      }, getBuilderOptions(this))
    }
  }
}

if (typeof window !== 'undefined') {
  window.customElements.define('rdf-entity', RdfEntity)
}

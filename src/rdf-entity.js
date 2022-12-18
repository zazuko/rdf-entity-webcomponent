import { LitElement, css, html } from 'lit'
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
    }

    .entity {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--border);
    }

    .main-header {
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 15px;
    }

    .main-header h2 {
      margin-top: 15px;
      margin-bottom: 15px;
      font-size: 32px;
      text-align: center;
    }

    .main-header a {
      font-size: 18px;
      text-transform: uppercase;
      text-align: center;
    }

    .header {
      font-size: 18px;
      padding-left: 10px;
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

    .rows .row {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    }

    .row > :nth-child(1) {
      align-self: flex-start;
      width: 35%;
      word-break: break-all;
      margin-top: 1rem;
      margin-left: 1%;
      margin-right: 1rem;
    }

    .row > :nth-child(2) {
      wrap-option: wrap;
      width: 65%;
      word-break: break-all;
      margin-left: 1rem;
      margin-right: auto;
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
      max-width: 100%;
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
      maxLevel: { type: Number, attribute: 'max-level', required: false }
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
    if (!this._dataset) {
      return html`requires a dataset`
    } else if (!this._dataset.size) {
      return html`No quads`
    } else {
      return EntityList({
        dataset: this._dataset, terms: this._terms
      }, getBuilderOptions(this))
    }
  }
}

window.customElements.define('rdf-entity', RdfEntity)

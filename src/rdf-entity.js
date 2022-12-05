import { LitElement, css } from 'lit-element'
import { Empty, ResourceDescription } from './components/ResourceDescription.js'
import rdf from './rdf-ext.js'

import { DEFAULT_BUILDER_OPTIONS, getBuilderOptions } from './options.js'

export class RdfEntity extends LitElement {
  static styles = css`
    :host {
      --color-primary: #ffb15e;
      --color-primary-light: #ffe38d;
      --color-secondary: #ff441c;
      --color-secondary-dark: #c30000;
      --color-text-on-primary: #000000;
      --color-text-on-secondary: #000000;
      --color-black: #000000;
      --color-grey: #4f4f4f;
      --color-white: #ffffff;
      --color-darker-white: #fcfcfc;
      --color-light-grey: #e5e5e5;
    }

    .entities {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .entity {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--color-grey);
    }

    .main-header {
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 30px;
    }
    
    .main-header h2{
      font-size: 32px;
      text-align: center;
    }

    .main-header a{
      font-size: 18px;
      color: var(--color-black);
      text-transform: uppercase;
      text-align: center;
    }
    
    .header {
      font-size: 18px;
      padding-left: 10px;
      border-bottom: 1px dashed var(--color-grey);
      //background-color: var(--color-primary);
    }

    .header a {
      color: var(--color-text-on-primary);
    }

    .rows {
      display: flex;
      flex-direction: column;
    }

    .rows > :nth-child(1n) {
      border-top: 1px solid var(--color-light-grey);
    }

    .rows > :nth-child(2n) {
      border-top: 1px solid var(--color-light-grey);
      background: rgba(0, 0, 0, 0.05);
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

    div .bringDown {
      color: var(--color-grey);
    }

    .vocab {
      color: var(--color-text-on-secondary);
      font-size: 0.7rem;
    }

    .vocab::after {
      content: ':';
    }

    .language {
      color: var(--color-text-on-secondary);
      font-size: 0.7rem;
      margin-left: 4px;
    }

    .datatype {
      color: var(--color-text-on-secondary);
      font-size: 0.5rem;
      margin-left: 4px;
    }

    .BlankNode {
      font-size: 10px;
    }

    .BlankNode a {
      color: var(--color-grey);
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    .metadata {
      border: var(--color-grey) solid 1px;
    }

    .metadata h3 {
      text-align: center;
      color: var(--color-grey);
    }

    .metadata table {
      margin-left: auto;
      margin-right: auto;
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
    this._pointer = rdf.clownface({ dataset: rdf.dataset() })

    for (const [key, value] of Object.entries(DEFAULT_BUILDER_OPTIONS)) {
      this[key] = value
    }

    this.attachShadow({ mode: 'open' })
  }

  static get properties () {
    return {
      pointer: { type: Object, attribute: false, required: true },
      technicalCues: { type: Boolean, attribute: 'technical-cues', required: false },
      compactMode: { type: Boolean, attribute: 'compact-mode', required: false },
      preferredLanguages: { type: Array, attribute: 'preferred-languages', required: false },
      embedNamedNodes: { type: Boolean, attribute: 'embed-named-nodes', required: false },
      embedBlankNodes: { type: Boolean, attribute: 'embed-blank-nodes', required: false },
      highlightLanguage: { type: Boolean, attribute: 'highlight-language', required: false },
      maxLevel: { type: Number, attribute: 'max-level', required: false },
      showNamedGraphs: { type: Boolean, attribute: 'show-named-graphs', required: false },
      metadata: { type: Object, attribute: 'metadata', required: false },
      debug: { type: Boolean, attribute: 'debug', required: false }
    }
  }

  get pointer () {
    return this._pointer
  }

  set pointer (pointer) {
    this._pointer = pointer
    this.requestUpdate()
  }

  render () {
    if (!this._pointer || !this._pointer.dataset) {
      return Empty('requires a Clownface pointer')
    } else if (!this._pointer.dataset.size) {
      return Empty('No quads')
    } else {
      return ResourceDescription(this._pointer, getBuilderOptions(this))
    }
  }
}

window.customElements.define('rdf-entity', RdfEntity)

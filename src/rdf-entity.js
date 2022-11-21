import { LitElement, css } from 'lit-element'
import { Empty, ResourceDescription } from './components/ResourceDescription.js'
import rdf from './rdf-ext.js'

const DEFAULTS = {
  groupValuesByProperty: true,
  groupPropertiesByValue: true,
  embedBlanks: true,
  technicalCues: true,
  preferredLanguages: ['en', 'fr', 'de', 'it'],
  highLightLanguage: 'en',
  embedNamed: false,
  embedLists: true,
  debug: false,
  maxLevel: 3 // externalLabels: labels.cf,
}

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

    .header {
      padding-left: 10px;
      background-color: var(--color-primary-light);
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
      margin-top: 1rem;
      margin-left: auto;
      margin-right: 1rem;
    }

    .row > :nth-child(2) {
      wrap-option: wrap;
      width: 65%;
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
      color: var(--color-secondary);
      font-size: 0.7rem;
    }

    .vocab::after {
      content: ':';
    }

    .language {
      color: var(--color-secondary);
      font-size: 0.7rem;
      margin-left: 4px;
    }

    .datatype {
      color: var(--color-secondary);
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
  `

  constructor () {
    super()
    this._pointer = rdf.clownface({ dataset: rdf.dataset() })
    this._options = DEFAULTS
    this.attachShadow({ mode: 'open' })
  }

  static get properties () {
    return {
      pointer: { type: Object, attribute: false, required: true },
      options: { type: Object, attribute: false, required: false }
    }
  }

  get pointer () {
    return this._pointer
  }

  set pointer (pointer) {
    const { dataset, term } = pointer
    this._pointer = rdf.clownface({ dataset, term })
  }

  set options (options) {
    this._options = { ...options }
    this.requestUpdate()
  }

  render () {
    if (this._pointer.dataset.size) {
      return ResourceDescription(this._pointer, this._options)
    } else {
      return Empty(this._pointer, this._options)
    }
  }
}

window.customElements.define('rdf-entity', RdfEntity)

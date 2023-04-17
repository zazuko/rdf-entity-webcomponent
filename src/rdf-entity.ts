import {customElement} from 'lit/decorators/custom-element.js';
import {property} from 'lit/decorators/property.js';
import {html, css, LitElement} from 'lit';
// @ts-ignore
import rdf from '../src/rdf-ext.js'
// @ts-ignore
import {EntityList} from './components/EntityList.js'
import DatasetExt from "rdf-ext/lib/Dataset";
// @ts-ignore
import {DEFAULT_LABEL_PROPERTIES} from './builder/entityBuilder'
// @ts-ignore
import {ns} from "./namespaces";

@customElement('rdf-entity')
export class RdfEntity extends LitElement {
    private _name: string = '';

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
      }

      .entity-header > div {
        margin: 10px;
      }

      .rows {
        display: flex;
        flex-direction: column;
      }

      /* Alternate highlighting */

      .rows > :nth-child(1n) {
        border-top: 1px solid var(--border);
      }

      /* Alternate highlighting */

      .rows > :nth-child(2n) {
        border-top: 1px solid var(--border);
        background: rgba(0, 0, 0, 0.01);
      }

      .rows > .row {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }

      .row > .property {
        align-self: flex-start;
        width: 35%;
        word-break: break-all;
        margin-left: 1%;
        margin-right: 1rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
      }

      /* Values */

      .row > .value {
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

      div .bring-down {
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

      .img-container {
        margin-left: auto;
        margin-right: auto;
      }

      .img-container img {
        max-width: 200px;
      }
    `

    constructor() {
        super()
        this.attachShadow({mode: 'open'})
    }

    @property({type: Boolean, attribute: 'technical-cues'}) public technicalCues: boolean = false;

    @property({
        type: Boolean,
        attribute: 'preferred-languages'
    }) public preferredLanguages: string[] = ['en', 'fr', 'de', 'it'];

    @property({
        type: Boolean,
        attribute: 'highlight-language'
    }) public highlightLanguage: string | undefined = this.preferredLanguages.length > 0 ? this.preferredLanguages[0] : undefined

    @property({type: Boolean, attribute: 'embed-lists'}) public embedLists: boolean = false;

    @property({type: Boolean, attribute: 'embed-named-nodes'}) public embedNamedNodes: boolean = false;

    @property({type: Boolean, attribute: 'embed-blank-nodes'}) public embedBlankNodes: boolean = false;

    @property({type: Number, attribute: 'max-level'}) public maxLevel: number = 3;

    @property({type: Boolean, attribute: 'show-images',}) public showImages: boolean = false;

    @property({type: Boolean, attribute: 'simplified-mode'}) public simplifiedMode: boolean = false;

    @property({type: Boolean, attribute: 'compact-mode'}) public compactMode: boolean = false;

    @property({type: DatasetExt}) public dataset: any = '';

    @property({type: String, attribute: 'term'}) public term: String = '';

    @property({type: Object}) public terms: any = '';


    getOptions() {
        const preferredLanguages = this.preferredLanguages ?? ['en', 'fr', 'de', 'it']
        const highlightLanguage = preferredLanguages.length > 0 ? preferredLanguages[0] : undefined
        return {
            technicalCues: this.technicalCues,
            preferredLanguages,
            highlightLanguage,
            embedLists: this.embedLists,
            embedNamedNodes: this.embedNamedNodes,
            embedBlankNodes: this.embedBlankNodes,
            maxLevel: this.maxLevel ?? 3,
            showImages: this.showImages,
            simplifiedMode: this.simplifiedMode,
            ignoreProperties: this.simplifiedMode ? rdf.termSet([ns.rdf.type, ...DEFAULT_LABEL_PROPERTIES]) : rdf.termSet([]),
            groupValuesByProperty: this.compactMode,
            groupPropertiesByValue: this.compactMode
        }
    }


    render() {
        const options = this.getOptions()
        const terms = this.terms ? this.terms : this.term ? [rdf.namedNode(this.term)] : undefined

        if (this.textContent && this.textContent.trim().length > 0) {
            try {
                const dataset = rdf.parse(this.textContent)
                return EntityList({
                    dataset, terms
                }, options)
            } catch (error) {
                return html`${error}`
            }
        } else if (!this.dataset) {
            return html`requires a dataset`
        } else if (!this.dataset.size) {
            return html`No quads`
        } else {
            return EntityList({
                dataset: this.dataset, terms
            }, options)
        }
    }
}

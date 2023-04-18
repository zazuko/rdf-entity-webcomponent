import {html} from 'lit'
import {rdf} from '../rdf-ext'
import {createModel} from '../model'
import {renderEntity} from './Entity'
import {EntityData, Options} from "../types";

function EntityList({dataset, terms}:EntityData, options:Options) {
    const subjects = rdf.termSet()
    for (const quad of [...dataset]) {
        subjects.add(quad.subject)
    }

    const anchorFor = rdf.termMap()
    let blankCount = 0
    for (const term of subjects) {
        if (term.termType === 'BlankNode') {
            blankCount = blankCount + 1
            anchorFor.set(term, `blank-${blankCount}`)
        } else {
            anchorFor.set(term, term.value)
        }
    }

    const model = createModel({dataset, terms}, options)
    const list = model.map(entity => renderEntity(entity, options, {anchorFor}))

    return html`
        <div class="entities">
            ${list}
        </div>
    `
}

export {EntityList}

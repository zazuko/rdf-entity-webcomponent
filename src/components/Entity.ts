import { html, TemplateResult } from 'lit'
import {Entity, Row, Options} from "../types";

type Context = {
  anchorFor: any;
}

function renderEntity (entity:Entity, options:Options, context:Context):TemplateResult {
  const header = renderEntityHeader(entity, options,
    context, options.simplifiedMode)
  const rows = entity.rows
    ? entity.rows.map(row => renderRow(row, options, context))
    : []

  if (entity.rows) {
    return html`
        <div id="${context.anchorFor.get(entity.term)}"
             class="entity">
            <div class="rows">
                ${header}
                ${rows}
            </div>
        </div>`
  } else {
    return renderTermWithCues(entity, options, context)
  }
}

function renderEntityHeader (entity:Entity, options:Options, context:Context, includeTypes:boolean):TemplateResult {
  if (includeTypes) {
    return html`
      <div class="row">
          <ul class="property">
              <li>
                  ${renderTermWithCues(entity, options, context)}
              </li>
          </ul>
          <ul class="value">${(entity.types ?? []).map(value => html`
              <li>${renderEntity(value, options, context)}</li>`)}
          </ul>
      </div>`
  }

  return html`
      <div class="entity-header">
          <div>
            ${renderTermWithCues(entity, options, context)}
          </div>
      </div>`
}

function renderRow (row:Row, options:Options, context:Context):TemplateResult {
  const predicatesList:TemplateResult = html`
      <ul class="property">
          ${row.properties.map(property => html`
              <li>${renderEntity(property, options, context)}</li>`)}
      </ul>`

  const valuesList = row.renderAs === 'List'
    ? html`
              <ol class="value">${row.values.map(value => html`
                  <li>${renderEntity(value, options, context)}</li>`)}
              </ol>`
    : html`
              <ul class="value">${row.values.map(value => html`
                  <li>${renderEntity(value, options, context)}</li>`)}
              </ul>`

  return html`
      <div class="row">
          ${predicatesList}
          ${valuesList}
      </div>`
}

function renderTermWithCues (entity:Entity, options:Options, context:Context):TemplateResult {
  const spans = []
  if (entity.label.vocab && options?.technicalCues) {
    spans.push(html`<span class="vocab">${entity.label.vocab}</span>`)
  }
  spans.push(renderTerm(entity, options, context))

  if (entity.label.language && options?.technicalCues) {
    spans.push(html`<span class="language">${entity.label.language}</span>`)
  }
  if (entity.label.datatype && options?.technicalCues) {
    spans.push(html`<span class="datatype">${entity.label.datatype.vocab}
        :${entity.label.datatype.value}</span>`)
  }

  if (options?.highlightLanguage && entity.label.language) {
    const isHighLight = entity.label.language === options.highlightLanguage
    return isHighLight
      ? html`
                <div>${spans}</div>`
      : html`
                <div class="bring-down">${spans}</div>`
  }

  return html`
      <div>${spans}</div>`
}

function renderTerm (entity:Entity, options:Options, context:Context):TemplateResult {
  if (entity.renderAs === 'Image') {
    return html`
        <div class="img-container"><img alt="${entity.term.value}"
                                        src="${entity.term.value}"></div>`
  }

  function maybeLink () {
    if (entity.term.termType === 'Literal') {
      return undefined
    }
    if (context.anchorFor.has(entity.term)) {
      return `#${context.anchorFor.get(entity.term)}`
    }
    if (entity.term.termType === 'NamedNode') {
      return entity.term.value
    }
    return undefined
  }
  const link = maybeLink()
  if (link) {
    return html`<a href="${link}"
                   title="${entity.term.value}">${entity.label.value}</a>`
  } else {
    return html`${entity.label.value}`
  }
}

export { renderEntity }

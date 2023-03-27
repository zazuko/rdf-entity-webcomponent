import { html } from 'lit'

function Entity (entity, options, context, renderedAsRoot) {
  const header = EntityHeader(entity, options,
    context, options.simplifiedMode)
  const rows = entity.rows
    ? entity.rows.map(row => Row(row, options, context))
    : []

  if (entity.rows) {
    return html`
        <div id="${context.anchorFor.get(entity.term)}"
             class="entity ${renderedAsRoot ? 'entity-root' : ''}">
            <div class="rows">
                ${header}
                ${rows}
            </div>
        </div>`
  } else {
    return TermWithCues(entity, options, context)
  }
}

function EntityHeader (entity, options, context, includeTypes) {
  if (includeTypes) {
    return html`
      <div class="row">
          <ul class="property">
              <li>
                  ${TermWithCues(entity, options, context)}
              </li>
          </ul>
          <ul class="value">${(entity.types ?? []).map(value => html`
              <li>${Entity(value, options, context)}</li>`)}
          </ul>
      </div>`
  }

  return html`
      <div class="entity-header">
          <div>
            ${TermWithCues(entity, options, context)}
          </div>
      </div>`
}

function Row (row, options, context) {
  const predicatesList = html`
      <ul class="property">
          ${row.properties.map(property => html`
              <li>${Entity(property, options, context)}</li>`)}
      </ul>`

  const valuesList = row.renderAs === 'List'
    ? html`
              <ol class="value">${row.values.map(value => html`
                  <li>${Entity(value, options, context)}</li>`)}
              </ol>`
    : html`
              <ul class="value">${row.values.map(value => html`
                  <li>${Entity(value, options, context)}</li>`)}
              </ul>`

  return html`
      <div class="row">
          ${predicatesList}
          ${valuesList}
      </div>`
}

function TermWithCues (entity, options, context) {
  const spans = []
  if (entity.label.vocab && options?.technicalCues) {
    spans.push(html`<span class="vocab">${entity.label.vocab}</span>`)
  }
  spans.push(Term(entity, options, context))

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

function Term (entity, options, context) {
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

export { Entity }

import { html } from 'lit'

function Term (entity, options, context) {
  if (entity.renderAs === 'Image') {
    return html`
        <div class="img-container"><img alt="${entity.term.value}"
                                        src="${entity.term.value}"></div>`
  }

  if (entity.term.termType === 'Literal') {
    return html`${entity.label.string}`
  }

  function resolveUrl () {
    if (options?.urlRewrite && options.urlRewrite(entity)) {
      return options.urlRewrite(entity)
    }
    if (context.anchorFor.has(entity.term)) {
      return `#${context.anchorFor.get(entity.term)}`
    }
    return entity.term.value
  }

  const url = resolveUrl()
  return html`<a href="${url}"
                 title="${entity.term.value}">${entity.label.string}</a>`
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
        :${entity.label.datatype.string}</span>`)
  }

  if (options?.highlightLanguage && entity.label.language) {
    const isHighLight = entity.label.language === options.highlightLanguage
    return isHighLight
      ? html`
        <div>${spans}</div>`
      : html`
        <div class="bringDown">${spans}</div>`
  }

  return html`
      <div>${spans}</div>`
}

function Row (row, options, context) {
  const predicatesList = html`
      <ul> ${row.properties.map(property => html`
          <li>${TermWithCues(property, options, context)}</li>`)}
      </ul>`

  const valuesList = row.renderAs === 'List'
    ? html`
      <ol>${row.values.map(value => html`
          <li>${Entity(value, options, context)}</li>`)}
      </ol>`
    : html`
      <ul>${row.values.map(value => html`
          <li>${Entity(value, options, context)}</li>`)}
      </ul>`

  return html`
      <div class="row">
          ${predicatesList}
          ${valuesList}
      </div>`
}

function RootHeader (entity) {
  const text = entity.label.fallbackLabel
    ? html`<h2></h2>`
    : html`<h2>
      ${entity.label.string}</h2>`

  const link = entity.term.termType === 'BlankNode'
    ? html``
    : html`<a
          href="${entity.term.value}"
          title="${entity.term.value}">${entity.term.value}</a>`

  return html`
      <div class="main-header">${text}${link}</div>
  `
}

function ItemHeader (item, options, context) {
  const text = item.label.fallbackLabel
    ? html`<span>${TermWithCues(item,
          options, context)}</span>`
    : html`<h3>
      ${TermWithCues(item, options, context)}</h3>`

  return html`
      <div class="header ${item.term.termType}">${text}</div>`
}

function Entity (item, options, context, renderedAsRoot) {
  const rows = item.rows ? item.rows.map(row => Row(row, options, context)) : []
  const header = renderedAsRoot
    ? RootHeader(item)
    : ItemHeader(item, options,
      context)

  if (item.rows) {
    return html`
        <div
                id="${context.anchorFor.get(item.term)}"
                class="entity ${renderedAsRoot ? 'entity-root' : ''}">
            ${header}
            <div class="rows">
                ${rows}
            </div>
        </div>`
  } else {
    return TermWithCues(item, options, context)
  }
}

export { Entity }

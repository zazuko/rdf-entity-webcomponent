import http from 'http'
import { Parser } from 'n3'
import { EntityList } from '../src/components/EntityList.js'
import { RdfEntity } from '../src/rdf-entity.js'
import {
  render as renderWebComponent
} from '@lit-labs/ssr/lib/render-with-global-dom-shim.js'
import rdf from '../src/rdf-ext.js'

const turtle = `@prefix schema: <http://schema.org/> .
<http://tbbt.ld/john> a schema:Person ;
                      schema:name "John Doe" ;
                      schema:knows <http://tbbt.ld/jane> .

<http://tbbt.ld/jane> schema:name "Jane" ;
                      schema:knows <http://tbbt.ld/john> .`

function body () {
  const parser = new Parser()
  const dataset = rdf.dataset()
  for (const quad of parser.parse(turtle)) {
    dataset.add(quad)
  }

  const resourceWebComponent = EntityList({ dataset, terms: [] }, {
    embedBlankNodes: true, embedNamedNodes: true, maxLevel: 3
  })
  const stringIterator = renderWebComponent(resourceWebComponent)
  return Array.from(stringIterator).join('')
}

function css () {
  return `
  body {
    --border: #d1d1d1;
    --metadata: #4f4f4f;
  }
  ${RdfEntity.styles}
  `
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(`
<!DOCTYPE html>
<head>
    <style>
        ${css()}
    </style>
</head>
    <body>
        ${body()}
    </body>
</html>
  `)
})

server.listen(3000, () => {
  console.log('Server listening on port 3000')
})

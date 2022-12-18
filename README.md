# rdf-entity-webcomponent

A clownface-based custom element that visualizes triples in tabular formats.

## Usage

The element requires a single property `pointer`. This property value corresponds to
the [clownface](https://github.com/zazuko/clownface) pointer used by the visualization. A clownface pointer consists of
a dataset and one or more terms.

If you are new to RDF and JavaScript, consider
our [Getting Started](https://zazuko.com/get-started/developers/#traverse-an-rdf-graph) guide that also covers Clownface
basics.

## Run the example

```
npm install
npm run dev
```

It will display something similar to:

![screenshot.png](./docs/screenshot.png)

See the [example](./index.html) for details

## Properties

| Property             | Attribute             | Modifiers | Type        | Default                  | Description                                                        |
|----------------------|-----------------------|-----------|-------------|--------------------------|--------------------------------------------------------------------|
| `pointer`            | false                 |           | `Clownface` | Empty clownface          | A pointer to the data to be shown.                                 |
| `technicalCues`      | `technical-cues`      |           | `Boolean`   | false                    | Display information such as languages or datatypes                 |
| `compactMode`        | `compact-mode`        |           | `Boolean`   | false                    | Group repeated properties or values for a compact visualization    |
| `preferredLanguages` | `preferred-languages` |           | `Array`     | ['en', 'fr', 'de', 'it'] | A list of the languages to show in the labels, ordered by priority |
| `embedBlankNodes`    | `embed-named-nodes`   |           | `Boolean`   | false                    | Recursively embeds any blank node positioned as an object          |
| `embedNamedNodes`    | `embed-blank-nodes`   |           | `Boolean`   | false                    | Recursively embeds any named entity positioned as an object        |
| `embedLists`         | `embed-lists`         |           | `Boolean`   | false                    | Display rdf-lists as ordered lists                                 |
| `highlightLanguage`  | `highlight-language`  |           | `Boolean`   | false                    | Highlights literals matching prefered language                     |
| `maxLevel`           | `max-level`           |           | `Number`    | 3                        | The maximum depth of the trees                                     |

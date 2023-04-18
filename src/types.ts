import TermSet from "@rdfjs/term-set";

import {Term} from 'rdf-js'
import DatasetCore from "@rdfjs/dataset/DatasetCore";
import { GraphPointer} from "clownface";
import {EntityContext} from "./builder/entityBuilder";

type Label = {
    value: string;
    property?: Term;
    vocab?: string;
    language?: string;
    fallbackLabel?: boolean;
    datatype?: Datatype;
};

type Datatype = {
    value: string;
    vocab?: string;
}

type Row = {
    properties: Entity[];
    values: Entity[];
    renderAs?: string;
};

type Entity = {
    term: Term ;
    label: Label;
    rows?: Row[];
    types?: Entity[];
    renderAs?: string;
};

type EntityData = {
    dataset: DatasetCore,
    terms: Term[]
}

type Options = {
    embedLists:boolean;
    ignoreProperties: TermSet;
    highlightLanguage: string | undefined;
    technicalCues: boolean;
    simplifiedMode: boolean;
    showImages:boolean;
    embedNamedNodes:boolean;
    embedBlankNodes:boolean;
    maxLevel:number | undefined;
    groupValuesByProperty:boolean;
    groupPropertiesByValue:boolean;
    sortRows:boolean;
    preferredLanguages:string[];
}

type ExtendedOptions = Options & {
    labelProperties: Term[];
    externalLabels:any;
    renderAs: (cf: GraphPointer, options: ExtendedOptions, context: EntityContext) => string | undefined;
};


export {Entity,Label, Row, Options, EntityData, ExtendedOptions}

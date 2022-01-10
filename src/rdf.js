import Environment from '@rdfjs/environment'
import DataFactory from '@rdfjs/environment/DataFactory'
import DatasetFactory from '@rdfjs/environment/DatasetFactory'
import TermMapSetFactory from '@rdfjs/environment/TermMapSetFactory'

const factory = new Environment([DataFactory, DatasetFactory, TermMapSetFactory])

export default factory

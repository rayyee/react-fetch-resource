// No import with webpack
// new webpack.ProvidePlugin({
//   "fetch": "isomorphic-fetch",
// })
import 'isomorphic-fetch'
import { Component, createFactory } from 'react'
import qs from 'qs'

function getForFetching(resource, queryObj) {
  const url = queryObj ? resource + qs.stringify(queryObj) : resource
  return fetch(url).then(res => {
    return res.json()
  })
}

/**
* @param fetcher is a function hook, type (resourcePath, queryObject) => Promise
*/
export function addHookWhenFetching(fetcher) {
  getForFetching = fetcher
}

export default function (
  resourceUrl
  , resourceInitialState
  , configure = {query: null, refetch: false, changeQuery: false}
) {
  const keys = Object.keys(resourceInitialState)
  const resourceName = keys[0]
  return BaseComponent => {
    const factory = createFactory(BaseComponent)
    return class extends Component {
      constructor(props) {
        super(props)
        const refetchPropName = configure.refetch
        const refetchProp = refetchPropName ? {[refetchPropName]: this.refetch} : {}
        const changeQueryPropName = configure.changeQuery
        const changeQueryProp = changeQueryPropName ? {[changeQueryPropName]: this.changeQuery} : {}
        const query = (typeof configure.query === 'function') ? configure.query(props) : configure.query
        this.state = Object.assign(
          {}
          , {...resourceInitialState}
          , {query}
          , {...refetchProp}
          , {...changeQueryProp}
        )
      }
      componentWillReceiveProps(nextProps) {
        // console.log('withResource componentWillReceiveProps ', nextProps, this.props);
        if (this.props.location && this.props.location.key !== nextProps.location.key) {
          this.fetchResource()
        }
      }
      componentDidMount() {
        this.fetchResource()
      }
      fetchResource = _ => {
        // console.log('withResource fetchResource ', resourceUrl, resourceInitialState, configure);
        getForFetching(resourceUrl, this.state.query).then(res => this.setState({[resourceName]: res.data}))
      }
      refetch = queryObj => {
        if (queryObj) this.changeQuery(queryObj, _ => this.fetchResource())
        else this.fetchResource()
      }
      changeQuery = (queryObj, callback = null) => {
        const queryState = Object.assign({}, this.state.query, queryObj)
        this.setState({query: queryState}, callback)
      }
      render() {
        return factory({...this.props, ...this.state
          // , refetch: this.refetch, changeQuery: this.changeQuery
        })
      }
    }
  }
}

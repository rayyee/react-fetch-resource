import { Component, createFactory } from 'react';
import pIsPromise from "p-is-promise";

export default function (
  getForFetching
  , resourceUrl
  , resourceInitialState
  , configure = {query: null, refetch: false, changeQuery: false, effects: false}
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
        const effectProps = {};
        if (effects) {
            const effectkeys = Object.keys(effects);
            for (let efk of effectkeys) {
                effectProps[efk] = function(data) {
                    if (typeof effects[efk] === 'function') {
                        const res = effects[efk](data);
                        if (pIsPromise(res)) {
                            res.then(x => this.setState({[resourceName]: x}));
                        } else {
                            this.setState({[resourceName]: res});
                        }
                    } else {
                        this.setState({[resourceName]: Object.assign({}, effects[efk], data)});
                    }
                };
            }
        }
        // const firstResourceName = resourceName.substr(0, 1);
        // const humpResourceName = firstResourceName.toUpperCase() + resourceName.substr(1);
        this.state = Object.assign(
          {}
          , {...resourceInitialState}
          , {query}
          , {...refetchProp}
          , {...changeQueryProp}
          , {...effectProps}
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

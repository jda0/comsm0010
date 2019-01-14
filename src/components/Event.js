import React, { Component } from 'react'
import { DateTime as DT } from 'luxon'
import { Link } from 'react-router-dom'

class Event extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: props.match.params.id,
      askAmount: 50,
      bidAmount: 50
    }

    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount () {
    fetch(`${this.props.app.API_URL}/events/${this.state.id}`, this.props.app.FETCH_PARAMS)
      .then(x => x.json())
      .then(event => {
        // console.log(x)
        this.setState({
          event
        })
      })
      .then(() => fetch(`${this.props.app.API_URL}/events/${this.state.event.id}/offers`, this.props.app.FETCH_PARAMS))
      .then(x => x.json())
      .then(offers => {
        const amounts = Object.keys(offers).map(parseFloat).sort((a, b) => a - b)
        const asks = amounts.filter(x => x > 0).reduce((a, b) => { return { ...a, [b]: offers[b] } }, {})
        const bids = amounts.filter(x => x < 0).reduce((a, b) => { return { ...a, [b]: offers[b] } }, {})

        this.setState({
          asks,
          bids
        })
      })
      .catch(x => console.error('error', x))
  }

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  render () {
    return (
      <div>
        <div className='jumbotron mb-4 mt-4 p-3 p-md-5 text-white rounded bg-dark'>
          { this.state.event && (
            <div className='col-md-12 pb-1'>
              <h1 className='display-3 my-0'>{(this.state.event.title && this.state.event.title.toTitleCase()) || '???'}</h1>
              {this.state.event.subtitle && (<h2 className='mb-0'>{this.state.event.subtitle.toTitleCase() || ''}</h2>)}
              <p className='lead mb-1 mt-5'>
                <span className='mr-3 no-wrap'>{this.state.event.location && this.state.event.location.toTitleCase()}</span>
                <wbr />
                <span className='no-wrap'>{this.state.event.datetime && DT.fromSeconds(this.state.event.datetime).toLocaleString(DT.DATETIME_MED)}</span>
              </p>
              {(this.state.event.description && <p className='mt-0 mb-1'>{this.state.event.description}</p>)}
            </div>
          )}
          { !this.state.event && (
            <div className='col-md-12'>
              <div className='spinner' />
            </div>
          )}
        </div>
        <div className='row mb-2'>
          <div className='col-md-6'>
            { this.state.event && (
              <div className='card mb-4 shadow-sm'>
                <Link to={`/events/${this.state.event.id}/ask`} className='td-n'>
                  <div className='text-danger card-body d-flex flex-column align-items-center justify-content-center'>
                    <h2 className='display-4 my-0'>Ask</h2>
                    {(!!this.state.bids && !!(Object.keys(this.state.bids)[0]) && (<span>Sell Now <em>for up to</em> £{(-(Object.keys(this.state.bids)[0] * 0.01)).toFixed(2)}</span>)) || (<span>Make an offer</span>)}
                  </div>
                </Link>
              </div>
            )}
            { !this.state.event && (
              <div className='card mb-4 shadow-sm'>
                <div className='card-body d-flex flex-column align-items-center justify-content-center'>
                  <div className='spinner' />
                </div>
              </div>
            )}
          </div>
          <div className='col-md-6'>
            { this.state.event && (
              <div className='card mb-4 shadow-sm'>
                <Link to={`/events/${this.state.event.id}/bid`} className='td-n'>
                  <div className='text-success card-body d-flex flex-column align-items-center justify-content-center'>
                    <h2 className='display-4 my-0'>Bid</h2>
                    {(!!this.state.bids && !!(Object.keys(this.state.asks)[0]) && (<span>Buy Now <em>from</em> £{(Object.keys(this.state.asks)[0] * 0.01).toFixed(2)}</span>)) || (<span>Make an offer</span>)}
                  </div>
                </Link>
              </div>
            )}
            { !this.state.event && (
              <div className='card mb-4 shadow-sm'>
                <div className='card-body d-flex flex-column align-items-center justify-content-center'>
                  <div className='spinner' />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='row mb-2'>
          <div className='col-md-6'>
          { !!this.state.bids && !!(Object.keys(this.state.bids)[0]) && (
              <div className='card mb-4 shadow-sm'>
                <ul className='list-group list-group-flush'>
                  <li className='list-group-item text-center'>
                    <h5 className='mb-0'>Current Bids</h5>
                  </li>
                  { Object.keys(this.state.bids)
                      .sort((a, b) => a - b)
                      .map(x => (
                        <li className='list-group-item text-center d-flex justify-content-around'>
                          <span>£{(-x * 0.01).toFixed(2)}</span>
                          <span>{this.state.bids[x]}</span>
                        </li>
                      ))
                  }
                </ul>
              </div>
            )}
          </div>
          <div className='col-md-6'>
            { !!this.state.asks && !!(Object.keys(this.state.asks)[0]) && (
              <div className='card mb-4 shadow-sm'>
                <ul className='list-group list-group-flush'>
                  <li className='list-group-item text-center'>
                    <h5 className='mb-0'>Current Asks</h5>
                  </li>
                  { Object.keys(this.state.asks)
                      .sort((a, b) => a - b)
                      .map(x => (
                        <li className='list-group-item d-flex justify-content-around'>
                          <span>£{(x * 0.01).toFixed(2)}</span>
                          <span>{this.state.asks[x]}</span>
                        </li>
                      ))
                  }
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Event

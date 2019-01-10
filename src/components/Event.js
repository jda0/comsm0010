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
    fetch(`https://eozp8bius7.execute-api.eu-west-1.amazonaws.com/test/events/${this.state.id}`, {
      method: 'GET',
      mode: 'cors',
      headers: { 'x-api-key': '***REMOVED***' }
    })
      .then(x => x.json().then(x => {
        // console.log(x)
        this.setState({
          event: x,
          askAmount: 50,
          bidAmount: 50
        })
      }))
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
                    <span>Sell Now <em>for up to</em> £50</span>
                  </div>
                </Link>
                <ul className='list-group list-group-flush'>
                  <li className='list-group-item'> a
                  </li>
                </ul>
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
                    <span>Buy Now <em>from</em> £59</span>
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
      </div>
    )
  }
}

export default Event

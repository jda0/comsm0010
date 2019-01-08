import React, { Component } from 'react'
import { DateTime } from 'luxon'
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
      headers: { 'x-api-key': 'wysAX36RWg5p0EJJdxi9j92DMinJ9Vl04HQEZ10Z' }
    })
      .then(x => x.json().then(x => {
        console.log(x)
        this.setState({
          event: x.Item,
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
            <div className='col-md-12'>
              <h1 className='display-3 my-0'>{(this.state.event.title && this.state.event.title.toTitleCase()) || '???'}</h1>
              <h2 className='mb-5'>{(this.state.event.subtitle && this.state.event.subtitle.toTitleCase()) || '???'}</h2>
              <p className='lead mb-1'>
                <span className='mr-3'>{this.state.event.location && this.state.event.location.toTitleCase()}</span>
                <span className='mr-3'>{this.state.event.datetime && DateTime.fromSeconds(this.state.event.datetime).toLocaleString(DateTime.DATETIME_MED)}</span>
              </p>
              <p className='mt-0 mb-2'>{this.state.event.description}</p>
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
                <Link to={`/events/${this.state.event.id}`} className='td-n'>
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
                <Link to={`/events/${this.state.event.id}`} className='td-n'>
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

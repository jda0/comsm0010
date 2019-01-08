import React, { Component } from 'react'
import { DateTime } from 'luxon'
import { Link } from 'react-router-dom'

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      events: []
    }
  }

  componentDidMount () {
    fetch('https://eozp8bius7.execute-api.eu-west-1.amazonaws.com/test/events', {
      method: 'GET',
      mode: 'cors',
      headers: { 'x-api-key': 'wysAX36RWg5p0EJJdxi9j92DMinJ9Vl04HQEZ10Z' }
    })
      .then(x => x.json().then(x => {
        console.log(x)
        this.setState({
          events: [...this.state.events, ...x.Items]
        })
      }))
      .catch(x => console.error('error', x))
  }

  render () {
    return (
      <div>
        <div className='row my-5'>
          { this.props.app.state.user && (
            <div className='col-12'>
              <h2 className='display-3 text-center'>
                Hi, {this.props.app.state.user.user}.
              </h2>
              <h3 className='text-center'>What next?</h3>
            </div>
          ) }
          { !this.props.app.state.user && (
            <div className='col-12'>
              <h2 className='display-3 text-center'>
                Buy and sell tickets.
              </h2>
            </div>
          ) }

        </div>
        <div className='row mb-2 mt-4'>
          {this.state.events.map(ev => (
            <div className='col-md-4' key={ev.id}>
              <Link to={`/events/${ev.id}`} className='td-n'>
                <div className='card flex-md-row mb-4 shadow-sm h-md-250'>
                  <div className='card-body d-flex flex-column align-items-start'>
                    <h2 className='mb-0'>{(ev.title && ev.title.toTitleCase()) || '???'}</h2>
                    <h5 className='mb-2'>{(ev.subtitle && ev.subtitle.toTitleCase()) || '???'}</h5>
                    <p className='card-text mb-auto'>
                      <span className='text-muted mr-3'>{ev.location && ev.location.toTitleCase()}</span>
                      <span className='text-muted mr-3'>{ev.datetime && DateTime.fromSeconds(ev.datetime).toLocaleString(DateTime.DATETIME_MED)}</span>
                    </p>
                    <span>
                      <span className='text-success mr-3'>BID <strong>£50</strong></span>
                      <span className='text-danger mr-3'>ASK <strong>£50</strong></span>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Home

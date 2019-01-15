import React, { Component } from 'react'
import { DateTime as DT } from 'luxon'
import { Link } from 'react-router-dom'

class User extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tickets: {}
    }
  }

  componentDidMount () {
    this.setState({ processing: true })

    fetch(`${this.props.app.API_URL}/users/me/tickets`, {
      ...this.props.app.FETCH_PARAMS,
      headers: {
        ...this.props.app.FETCH_PARAMS.headers,
        'Authorization': `Bearer ${this.props.app.state.id_token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(x => x.json())
      .then(x => {
        this.setState({
          tickets: {
            ...this.state.tickets,
            ...x.reduce((a, b) => { return { ...a, [b.id]: b } }, {})
          },
          events: {
            ...x.reduce((a, b) => { return { ...a, [b.event]: {} } }, {})
          },
          processing: undefined
        })
      })
      .then(() => Promise.all(
        Object.keys(this.state.events)
          .map(k => fetch(`${this.props.app.API_URL}/events/${k}`, this.props.app.FETCH_PARAMS)
            .then(x => x.json())
            .then(x => {
              this.setState({
                events: {
                  ...this.state.events,
                  [k]: x
                }
              })
            })
            .catch(x => console.error('error', x))
          )
      ))
      .catch(x => {
        console.error('error', x)
        this.setState({ error: x, processing: undefined })
      })
  }

  render () {
    return (
      <div>
        <div className='row my-5'>
          { this.props.app.state.user && (
            <div className='col-12'>
              <h2 className='display-3 text-center'>
                Your Tickets
              </h2>
              <h3 className='text-center'>Get ready to party, {this.props.app.state.user.username}</h3>
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
          {this.state.processing && (<div className='spinner dark' />)}
          {Object.values(this.state.tickets).map(tkt => (
            <div className='col-md-4' key={tkt.id}>
              <Link to={`/events/${tkt.event}`} className='td-n'>
                <div className='card flex-md-column mb-4 shadow-sm h-md-250'>
                  {tkt.event && this.state.events[tkt.event] && (
                    <div className='card-body d-flex flex-column align-items-start'>
                      <h2 className='mb-0'>{(this.state.events[tkt.event].title && this.state.events[tkt.event].title.toTitleCase()) || '???'}</h2>
                      {this.state.events[tkt.event].subtitle && (<h5 className='mb-2'>{this.state.events[tkt.event].subtitle.toTitleCase() || ''}</h5>)}
                      <p className='card-text mb-auto'>
                        <span className='text-muted mr-3 no-wrap'>{this.state.events[tkt.event].location && this.state.events[tkt.event].location.toTitleCase()}</span>
                        <wbr />
                        <span className='text-muted mr-3 no-wrap'>{this.state.events[tkt.event].datetime && DT.fromSeconds(this.state.events[tkt.event].datetime).toLocaleString(DT.DATETIME_MED)}</span>
                      </p>
                    </div>
                  )}
                  <ul className='list-group list-group-flush'>
                    <li className='list-group-item text-muted'>
                      #{ tkt.ticket }&emsp;£{ (parseInt(tkt.price) * 0.01).toFixed(2) }<br />
                      <small>{ tkt.id }</small>
                    </li>
                  </ul>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default User

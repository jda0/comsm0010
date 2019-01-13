import React, { Component } from 'react'
import { DateTime as DT } from 'luxon'
import { Link } from 'react-router-dom'

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      events: {}
    }
  }

  componentDidMount () {
    fetch(this.props.app.API_URL + '/events', this.props.app.FETCH_PARAMS)
      .then(x => x.json())
      .then(x => {
        console.log(x.reduce((a, b) => { return { ...a, [b.id]: b } }, {}))
        this.setState({
          events: {
            ...this.state.events,
            ...x.reduce((a, b) => { return { ...a, [b.id]: b } }, {})
          }
        })
      })
      .then(() => fetch(`${this.props.app.API_URL}/offers?eventids=${encodeURIComponent(Object.keys(this.state.events).join(','))}`, this.props.app.FETCH_PARAMS))
      .then(x => x.json())
      .then(x => {
        Object.keys(x).forEach(k => this.setState({
          events: {
            ...this.state.events,
            [k]: {
              ...this.state.events[k],
              ...x[k]
            }
          }
        }))
      })
      .catch(x => console.error('error', x))
  }

  render () {
    return (
      <div>
        <div className='row my-5'>
          { this.props.app.state.user && (
            <div className='col-12'>
              <h2 className='display-3 text-center'>
                Hi, {this.props.app.state.user.username}.
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
          {Object.values(this.state.events).map(ev => (
            <div className='col-md-4' key={ev.id}>
              <Link to={`/events/${ev.id}`} className='td-n'>
                <div className='card flex-md-column mb-4 shadow-sm h-md-250'>
                  <div className='card-body d-flex flex-column align-items-start'>
                    <h2 className='mb-0'>{(ev.title && ev.title.toTitleCase()) || '???'}</h2>
                    {ev.subtitle && (<h5 className='mb-2'>{ev.subtitle.toTitleCase() || ''}</h5>)}
                    <p className='card-text mb-auto'>
                      <span className='text-muted mr-3 no-wrap'>{ev.location && ev.location.toTitleCase()}</span>
                      <wbr />
                      <span className='text-muted mr-3 no-wrap'>{ev.datetime && DT.fromSeconds(ev.datetime).toLocaleString(DT.DATETIME_MED)}</span>
                    </p>
                  </div>
                  <ul className='list-group list-group-flush'>
                    <li className='list-group-item'>
                      { !!ev.ask && (<span className='text-success'>ASK&nbsp;<strong>£{(ev.ask * 0.01).toFixed(2)}</strong>&emsp;</span>) }
                      { !!ev.bid && (<span className='text-danger'>BID&nbsp;<strong>£{(ev.bid * 0.01).toFixed(2)}</strong></span>) }
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

export default Home

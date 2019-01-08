import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import Event from './components/Event'

const AUTH_SERVER = 'https://takon.auth.eu-west-1.amazoncognito.com/'

const CLIENT_ID = '***REMOVED***'
const REDIRECT_URI = 'https%3A%2F%2Ftakon.me%2F%3Fcallback'
const LOGOUT_URI = 'https%3A%2F%2Ftakon.me%2F%3Flogout'
const AUTH_QUERY = `?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`
const LOGOUT_ENDPOINT = `logout?client_id=${CLIENT_ID}&logout_uri=${LOGOUT_URI}`

const FETCH_PARAMS = {
  method: 'GET',
  mode: 'cors',
  headers: { 'x-api-key': '***REMOVED***' }
}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {}

    let hashes = window.location.hash.slice(1).split('&').map(x => x.split('='))
    for (const h of hashes) if (h[0] === 'id_token') this.state.id_token = h[1]
  }

  componentDidMount () {
    if (this.state.id_token) {
      // @ts-ignore
      fetch('https://eozp8bius7.execute-api.eu-west-1.amazonaws.com/test/users/me', {
        ...FETCH_PARAMS,
        headers: {
          ...FETCH_PARAMS.headers,
          'Authorization': `Bearer ${this.state.id_token}`
        }
      })
        .then(x => x.json().then(x => {
          console.log(x)
          this.setState({
            user: x
          })
        }))
        .catch(x => console.error('error', x))
    }
  }

  render () {
    return (
      <Router>
        <div className='App container'>
          <header className='blog-header py-3'>
            <div className='row flex-nowrap justify-content-between align-items-center'>
              <div className='col-4 pt-1'>
                <span className='text-muted'>The Tickets Exchange</span>
              </div>
              <div className='col-4 text-center'>
                <Link className='blog-header-logo text-dark' to='/'>takon.me</Link>
              </div>
              <div className='col-4 d-flex justify-content-end align-items-center'>
                {/* <a className='text-muted' href='#'>
                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' className='mx-3' focusable='false' role='img'><title>Search</title><circle cx='10.5' cy='10.5' r='7.5' /><line x1='21' y1='21' x2='15.8' y2='15.8' /></svg>
              </a> */}
                {
                  !this.state.id_token && (
                    <span>
                      <a className='btn btn-sm btn-link text-muted mr-1' href={AUTH_SERVER + 'login' + AUTH_QUERY}>Login</a>
                      <a className='btn btn-sm btn-outline-secondary' href={AUTH_SERVER + 'signup' + AUTH_QUERY}>Sign up</a>
                    </span>
                  )
                }
                {
                  this.state.id_token && (
                    <div className='btn-group'>
                      <button type='button' className='btn btn-sm btn-link dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                        {(this.state.user && this.state.user.user) || '🧑'}
                      </button>
                      <div className='dropdown-menu dropdown-menu-right'>
                        <Link className='dropdown-item' to='/create/event'>Create Event</Link>
                        <Link className='dropdown-item' to='/me/funds'>Add Funds&ensp;<span className='text-muted'>£50.00</span></Link>
                        <div className='dropdown-divider' />
                        <a className='dropdown-item' href={AUTH_SERVER + LOGOUT_ENDPOINT}>Log out</a>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          </header>
          <main>
            <Route exact path='/' render={props => <Home {...props} app={this} />} />
            <Route path='/events/:id' component={Event} />
          </main>
          { this.state.id_token && (<span>Authorization: Bearer {this.state.id_token}</span>) }
        </div>
      </Router>
    )
  }
}

export default App

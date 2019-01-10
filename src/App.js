import React, { Component } from 'react'
import { withCookies } from 'react-cookie'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Home from './components/Home'
import CreateEvent from './components/CreateEvent'
import CreateOffer from './components/CreateOffer'
import Event from './components/Event'
import Topup from './components/Topup'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id_token: props.cookies.get('id_token') || ''
    }

    this.AUTH_SERVER = 'https://takon.auth.eu-west-1.amazoncognito.com/'
    this.CLIENT_ID = 'sgkghjjfsd9gfkg06qe1par1v'
    this.REDIRECT_URI = 'https%3A%2F%2Ftakon.me%2F%3Fcallback'
    this.LOGOUT_URI = 'https%3A%2F%2Ftakon.me%2F%3Flogout'
    this.AUTH_QUERY = `?response_type=token&client_id=${this.CLIENT_ID}&redirect_uri=${this.REDIRECT_URI}`
    this.LOGOUT_ENDPOINT = `logout?client_id=${this.CLIENT_ID}&logout_uri=${this.LOGOUT_URI}`
    this.FETCH_PARAMS = {
      method: 'GET',
      mode: 'cors',
      headers: { 'x-api-key': 'wysAX36RWg5p0EJJdxi9j92DMinJ9Vl04HQEZ10Z' }
    }

    let hashes = window.location.hash.slice(1).split('&').map(x => x.split('='))
    for (const h of hashes) {
      switch (h[0]) {
        case 'id_token':
          this.state.id_token = h[1]
          this.props.cookies.set('id_token', h[1], {
            maxAge: 3300,
            path: '/'
          })
          break
        case 'state': this.state.urlState = h[1]; break
        default: break
      }
    }
    window.location.hash = '#'
  }

  componentDidMount () {
    if (this.state.id_token) {
      // @ts-ignore
      fetch('https://eozp8bius7.execute-api.eu-west-1.amazonaws.com/test/users/me', {
        ...this.FETCH_PARAMS,
        headers: {
          ...this.FETCH_PARAMS.headers,
          'Authorization': `Bearer ${this.state.id_token}`
        }
      })
        .then(x => x.json().then(x => {
          console.log(x)
          this.setState({
            user: {
              funds: 0,
              ...x
            }
          })
        }))
        .catch(x => {
          console.error('error', x)
          this.props.cookies.remove('id_token', {
            path: '/'
          })
          this.setState({ id_token: undefined })
        })
    }
  }

  render () {
    return (
      <Router>
        <div className='App container'>
          <Route render={props => <Header {...props} app={this} />} />
          <main>
            <Route exact path='/' render={props => <Home {...props} app={this} />} />
            <Route exact path='/topup' render={props => <Topup {...props} app={this} />} />
            <Route exact path='/create/event' render={props => <CreateEvent {...props} app={this} />} />
            <Route exact path='/events/:id' component={Event} />
            <Route exact path='/events/:id/ask' render={props => <CreateOffer {...props} app={this} type='ask' />} />
            <Route exact path='/events/:id/bid' render={props => <CreateOffer {...props} app={this} type='bid' />} />
          </main>
        </div>
      </Router>
    )
  }
}

export default withCookies(App)

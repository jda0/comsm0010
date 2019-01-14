import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'

class Header extends Component {
  render () {
    if (this.props.app.state.urlState) {
      const redirectUrl = this.props.app.state.urlState
      this.props.app.setState({ urlState: undefined })

      if (this.props.location.pathname !== this.props.app.state.urlState) {
        return (<Redirect to={redirectUrl} />)
      }
    }

    return (
      <header className='blog-header py-3'>
        <div className='row flex-nowrap justify-content-between align-items-center'>
          <div className='col-4 pt-1 d-none d-sm-block'>
            <span className='text-muted'>The Tickets Exchange</span>
          </div>
          <div className='col-4 text-center'>
            <Link className='blog-header-logo text-dark' to='/'>takon.me</Link>
          </div>
          <div className='col-sm-4 col-auto d-flex justify-content-end align-items-center text-right'>
            {/* <a className='text-muted' href='#'>
              <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' className='mx-3' focusable='false' role='img'><title>Search</title><circle cx='10.5' cy='10.5' r='7.5' /><line x1='21' y1='21' x2='15.8' y2='15.8' /></svg>
            </a> */}
            {
              !this.props.app.state.id_token && (
                <span>
                  <a className='btn btn-sm btn-link text-muted mr-1' href={this.props.app.AUTH_SERVER + 'login' + this.props.app.AUTH_QUERY + `&state=${this.props.location.pathname}`}>Login</a>
                  <a className='btn btn-sm btn-outline-secondary' href={this.props.app.AUTH_SERVER + 'signup' + this.props.app.AUTH_QUERY + `&state=${this.props.location.pathname}`}>Sign up</a>
                </span>
              )
            }
            {
              this.props.app.state.id_token && (
                <div className='btn-group'>
                  <button type='button' className='btn btn-sm btn-link dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                    {(this.props.app.state.user && this.props.app.state.user.username) || '🧑'}
                  </button>
                  <div className='dropdown-menu dropdown-menu-right'>
                    {this.props.app.state.user && (
                      <div>
                        <Link className='dropdown-item' to='/me'>My Tickets</Link>
                        <Link className='dropdown-item' to='/create/event'>Create Event</Link>
                        <Link className='dropdown-item' to='/topup'>Add Funds&ensp;<span className='text-muted'>£{(this.props.app.state.user.funds * .01).toFixed(2)}</span></Link>
                        <div className='dropdown-divider' />
                      </div>
                    )}
                    <a className='dropdown-item' href={this.props.app.AUTH_SERVER + this.props.app.LOGOUT_ENDPOINT}>Log out</a>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </header>
    )
  }
}

export default Header

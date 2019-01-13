import React, { Component } from 'react'
import { injectStripe, CardElement } from 'react-stripe-elements'

class Topup extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (event) {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    this.setState({ [event.target.id]: value })
  }

  handleSubmit (event) {
    let amount = parseFloat(this.state.priceInput)
    if (isNaN(amount)) {
      // @ts-ignore
      document.getElementById('priceInput').setCustomValidity('')
      return
    }
    amount = Math.floor(amount * 100)

    if (this.state.tcsCheck) {
      this.setState({ processing: true, error: undefined, success: undefined })
      
      this.props.stripe.createToken({ name: 'Takon.me Account Topup' })
        .then(({ token }) => {
          fetch(`${this.props.app.API_URL}/funds`, {
            ...this.props.app.FETCH_PARAMS,
            method: 'POST',
            headers: {
              ...this.props.app.FETCH_PARAMS.headers,
              'Authorization': `Bearer ${this.props.app.state.id_token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              charge: {
                amount,
                currency: 'gbp'
              },
              token: {
                id: token.id
              }
            })
          })
            .then(x => x.json().then(x => {
              console.log(x)
              if (x.errorMessage) this.setState({ processing: undefined, error: true })
              else {
                this.props.app.setState({
                  user: {
                    ...this.props.app.state.user,
                    funds: x.funds
                  }
                })
                this.setState({ processing: undefined, complete: true })
              }
            }))
            .catch(x => {
              this.setState({ processing: undefined, error: true })
              console.error('error', x)
            })
        })
        .catch(x => {
          this.setState({ processing: undefined, error: true })
          console.error('error', x)
        })
    }

    event.preventDefault()
  }

  render () {
    return (
      <div>
        <h1 className='text-center my-5'>Top Up</h1>
        { (!this.props.app.state.user && (
          <div className='alert alert-secondary'>
            You need to <a href={this.props.app.AUTH_SERVER + 'login' + this.props.app.AUTH_QUERY + `&state=${this.props.location.pathname}`}>Login</a> or <a href={this.props.app.AUTH_SERVER + 'signup' + this.props.app.AUTH_QUERY + `&state=${this.props.location.pathname}`}>Sign up</a> to top up your account funds.
          </div>
        )) || (
          <form onSubmit={this.handleSubmit}>
            <div className='form-group row'>
              <label className='col-sm-3 col-form-label'>Your Balance</label>
              <div className='col mb-4'>
                <h3>£{(this.props.app.state.user.funds * .01).toFixed(2)}</h3>
              </div>
              {/* {(this.props.app.state.user.funds > 0) && (
                <div className='col-auto mb-2'>
                  <button className='btn btn-secondary'>Withdraw</button>
                </div>
              )} */}
            </div>
            <div className='form-group row'>
              <label htmlFor='priceInput' className='col-sm-3 col-form-label'>Top up Amount</label>
              <div className='col-sm-9'>
                <div className='input-group mb-1 mr-sm-1'>
                  <div className='input-group-prepend'>
                    <div className='input-group-text'>£</div>
                  </div>
                  <input type='number' className='form-control' id='priceInput' step='0.01' placeholder='71.50' value={this.state.priceInput || ''} onChange={this.handleChange} required />
                </div>
              </div>
            </div>
            <div className='form-group row'>
              <label htmlFor='priceInput' className='col-sm-3 col-form-label'>Billing Information</label>
              <div className='col-sm-9'>
                <CardElement className='form-control' />
              </div>
            </div>
            <div className='form-group row form-check my-4'>
              <div className='col-sm-9 offset-sm-3 custom-control custom-checkbox'>
                <input type='checkbox' className='custom-control-input' id='tcsCheck' checked={this.state.tcsCheck} onChange={this.handleChange} required />
                <label className='custom-control-label' htmlFor='tcsCheck'>
                  I agree to the Terms and Conditions and Privacy Policy.
                </label>
              </div>
            </div>
            {(this.state.processing && (
              <div className='row'>
                <div className='col-sm-9 offset-sm-3'>
                  <div className='spinner dark' />
                </div>
              </div>
            )) || (
              <div className='form-group row justify-content-end'>
                { (this.state.complete && (
                  <div className='offset-sm-3 col'>
                    <div className='alert alert-success'>
                      Transaction successful.
                    </div>
                  </div>
                )) || (this.state.error && (
                  <div className='offset-sm-3 col'>
                    <div className='alert alert-danger'>
                      There was an error.
                    </div>
                  </div>
                )) }
                <div className='col-auto'>
                  <button type='submit' className='btn btn-primary'>Confirm</button>
                </div>
              </div>
            )}
          </form>
        ) }
      </div>
    )
  }
}

export default injectStripe(Topup)

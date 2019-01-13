import React, { Component } from 'react'
import { DateTime as DT } from 'luxon'

class CreateOffer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      eventid: props.match.params.id
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleReserve = this.handleReserve.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {
    fetch(`https://eozp8bius7.execute-api.eu-west-1.amazonaws.com/test/events/${this.state.eventid}`, this.props.app.FETCH_PARAMS)
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
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    this.setState({ [event.target.id]: value })
  }

  handleReserve (event) {
    console.log('reserve')
    this.setState({ reserved: {} })
    const afterTimeout = () => {
      this.setState({
        reserved: {
          pending: false,
          id: 1,
          price: 49
        },
        priceInput: 49
      })

      if (this.props.type === 'bid') {
        this.setState({
          ticketIdInput: 1
        })
      }
    }
    setTimeout(afterTimeout, 2000)
    event.preventDefault()
    event.stopPropagation()
  }

  handleSubmit (event) {
    // if (this.state.tcsCheck) {
    //   fetch(`https://eozp8bius7.execute-api.eu-west-1.amazonaws.com/test/events`, {
    //     ...this.props.app.FETCH_PARAMS,
    //     method: 'POST',
    //     headers: {
    //       ...this.props.app.FETCH_PARAMS.headers,
    //       'Authorization': `Bearer ${this.props.app.state.id_token}`
    //     }
    //   })
    //     .then(x => x.json().then(x => {
    //       console.log(x)
    //       this.setState({
    //         event: x.Item,
    //         askAmount: 50,
    //         bidAmount: 50
    //       })
    //     }))
    //     .catch(x => console.error('error', x))
    // }

    event.preventDefault()
  }

  render () {
    return (
      <div>
        <h1 className='text-center my-5'>Create {/[aeiou]/i.test(this.props.type[0]) ? 'an' : 'a'} {this.props.type.toTitleCase()}</h1>
        { (!this.props.app.state.user && (
          <div className='alert alert-secondary'>
            You need to <a href={this.props.app.AUTH_SERVER + 'login' + this.props.app.AUTH_QUERY + `&state=${this.props.location.pathname}`}>Login</a> or <a href={this.props.app.AUTH_SERVER + 'signup' + this.props.app.AUTH_QUERY + `&state=${this.props.location.pathname}`}>Sign up</a> to create an event.
          </div>
        )) || (
          <form onSubmit={this.handleSubmit}>
            <div className='form-group row'>
              <label className='col-sm-3 col-form-label'>Event</label>
              {(this.state.event && (
                <div className='col-sm-auto mb-3'>
                  <div className='card flex-md-row shadow-sm'>
                    <div className='card-body d-flex flex-column align-items-start'>
                      <h3 className='mb-0'>{(this.state.event.title && this.state.event.title.toTitleCase()) || '???'}</h3>
                      {this.state.event.subtitle && (<h5 className='mb-2'>{this.state.event.subtitle.toTitleCase() || ''}</h5>)}
                      <p className='card-text mb-auto'>
                        <span className='text-muted mr-3 no-wrap'>{this.state.event.location && this.state.event.location.toTitleCase()}</span>
                        <wbr />
                        <span className='text-muted no-wrap'>{this.state.event.datetime && DT.fromSeconds(this.state.event.datetime).toLocaleString(DT.DATETIME_MED)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )) || (<div className='col-sm-9 mb-3'><div className='spinner' /></div>)}
            </div>
            {((this.state.processing || (this.state.reserved && !this.state.reserved.id)) && (
              <div className='row'>
                <div className='col-sm-9 offset-sm-3'>
                  <div className='spinner dark' />
                </div>
              </div>
            )) || (
              <div>
                {(this.props.type.toLowerCase() !== 'bid' || this.state.reserved) && (
                  <div className='form-group row'>
                    <label htmlFor='ticketIdInput' className='col-sm-3 col-form-label'>Ticket ID</label>
                    <div className='col mb-1'>
                      <input type='text' disabled={this.props.type.toLowerCase() === 'bid'} className='form-control' id='ticketIdInput' placeholder='TICKET0001' value={this.state.ticketIdInput || ''} onChange={this.handleChange} required />
                    </div>
                  </div>
                )}
                <div className='form-group row'>
                  <label htmlFor='subtitleInput' className='col-sm-3 col-form-label'>{this.props.type.toTitleCase()}</label>
                  <div className='col'>
                    <div className='input-group mb-1 mr-sm-1'>
                      <div className='input-group-prepend'>
                        <div className='input-group-text'>£</div>
                      </div>
                      <input type='number' className='form-control' id='priceInput' step='0.01' placeholder='71.50' value={this.state.priceInput || ''} onChange={this.handleChange} required />
                    </div>
                  </div>
                  {!this.state.reserved && (<div className='col-12 col-sm-auto mb-1'>
                    <button className='btn btn-success' onClick={this.handleReserve}>Reserve Best Price</button>
                  </div>)}
                </div>
                <div className='form-group row form-check my-4'>
                  <div className='col-sm-9 offset-sm-3 custom-control custom-checkbox'>
                    <input type='checkbox' className='custom-control-input' id='tcsCheck' checked={this.state.tcsCheck} onChange={this.handleChange} required />
                    <label className='custom-control-label' htmlFor='tcsCheck'>
                      I agree to the Terms and Conditions and Privacy Policy.&nbsp;

                      { (parseFloat(this.state.priceInput) > 0) && (
                        <span className='text-muted'>
                        Once you click create, your {this.props.type.toLowerCase()} will
                        immediately be added to the market and you'll be debited £{this.props.type.toLowerCase() === 'bid' ? (parseFloat(this.state.priceInput, 2) || 71.50).toFixed(2) : `${((parseFloat(this.state.priceInput, 2) || 71.50) * 0.15).toFixed(2)}. This is necessary to prevent fraud on our platform and will be either refunded when your ask is settled, used for cancellation fees or confiscated if your ask is found to be fraudulent`}.
                        Cancellation of this {this.props.type.toLowerCase()} is subject to a fee of
                        £{((this.state.priceInput || 71.50) * 0.15).toFixed(2)}, and
                        is not possible once fulfilled by a
                        corresponding {this.props.type.toLowerCase() === 'ask' ? 'bid' : 'ask'}.
                        The {this.props.type.toLowerCase()} may be fulfilled immediately
                        if a corresponding {this.props.type.toLowerCase() === 'ask' ? 'bid' : 'ask'} already
                        exists. {this.props.type.toLowerCase() === 'ask' && `You'll receive £${((parseFloat(this.state.priceInput, 2) || 71.50) * 1.05).toFixed(2)} after processing fees when your ask is fulfilled, inclusive of your refund of £${((this.state.priceInput || 71.50) * 0.15).toFixed(2)}.`}
                        </span>
                      )}
                    </label>
                  </div>
                </div>
                <div className='form-group row justify-content-end'>
                  <div className='col-auto'>
                    <button type='submit' className='btn btn-primary'>Create</button>
                  </div>
                </div>
              </div>
            )}

          </form>
        ) }
      </div>
    )
  }
}

export default CreateOffer

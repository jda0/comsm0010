import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { DateTime as DT } from 'luxon'

class CreateEvent extends Component {
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
    event.preventDefault()

    let date = DT.fromISO(this.state.dateInput)
    let time = DT.fromISO(this.state.timeInput)
    let tickets = parseInt(this.state.ticketsInput, 10)
    let price = parseFloat(this.state.priceInput)

    if (typeof this.state.titleInput !== 'string' || this.state.titleInput === '') {
      // @ts-ignore
      document.getElementById('titleInput').setCustomValidity('')
      return
    }
    if (typeof this.state.locationInput !== 'string' || this.state.locationInput === '') {
      // @ts-ignore
      document.getElementById('locationInput').setCustomValidity('')
      return
    }
    if (!date.isValid) {
      // @ts-ignore
      document.getElementById('dateInput').setCustomValidity('Invalid ISO date.')
      return
    }
    if (!time.isValid || +(time.startOf('day')) !== +(DT.local().startOf('day'))) {
      // @ts-ignore
      document.getElementById('timeInput').setCustomValidity('Invalid time.')
      return
    }
    if (isNaN(tickets)) {
      // @ts-ignore
      document.getElementById('ticketsInput').setCustomValidity('')
      return
    }
    if (isNaN(price)) {
      // @ts-ignore
      document.getElementById('priceInput').setCustomValidity('')
      return
    }

    date = date.plus({ hours: time.hour, minutes: time.minute })

    if (this.state.tcsCheck) {
      this.setState({ processing: true, error: undefined, success: undefined })

      fetch(`${this.props.app.API_URL}/events`, {
        ...this.props.app.FETCH_PARAMS,
        method: 'POST',
        headers: {
          ...this.props.app.FETCH_PARAMS.headers,
          'Authorization': `Bearer ${this.props.app.state.id_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // @ts-ignore
          datetime: date.toSeconds(),
          title: this.state.titleInput,
          subtitle: this.state.subtitleInput || '',
          description: this.state.descriptionInput || '',
          location: this.state.locationInput,
          admins: [],
          maxOrderQty: 1,

          quantity: tickets,
          offer: Math.floor(price * 100)
        })
      })
        .then(x => x.json())
        .then(x => {
          console.log(x)

          if (x.errorMessage) {
            if (x.invoked) this.setState({ processing: undefined, error: 2 })
            else this.setState({ processing: undefined, error: 1 })

            return
          }

          this.setState({
            processing: undefined,
            success: true,
            event: x.id
          })

          setTimeout(() => this.setState({ redirect: true }), 2000)
        })
        .catch(x => console.error('error', x))
    }
  }

  render () {
    return (
      <div>
        <h1 className='text-center my-5'>Create an Event</h1>
        { this.state.redirect && this.state.event && (
          <Redirect push to={`/events/${this.state.event}`} />
        ) }
        { ((!this.props.app.state.user) && (
          <div className='alert alert-secondary mb-2'>
            You need to <a href={this.props.app.AUTH_SERVER + 'login' + this.props.app.AUTH_QUERY + `&state=${this.props.location.pathname}`}>Login</a> or <a href={this.props.app.AUTH_SERVER + 'signup' + this.props.app.AUTH_QUERY + `&state=${this.props.location.pathname}`}>Sign up</a> to create an event.
          </div>
        )) || (
          <form onSubmit={this.handleSubmit}>
            {(this.state.processing && (
              <div className='row'>
                <div className='col'>
                  <div className='spinner dark' />
                </div>
              </div>
            )) || (
              <div>
                <div className='form-group row'>
                  <label htmlFor='titleInput' className='col-sm-3 col-form-label'>Title/Artist</label>
                  <div className='col-sm-9 mb-1'>
                    <input type='text' className='form-control' id='titleInput' placeholder='A-ha' value={this.state.titleInput || ''} onChange={this.handleChange} required />
                  </div>
                </div>
                <div className='form-group row'>
                  <label htmlFor='subtitleInput' className='col-sm-3 col-form-label'>Subtitle/Tour</label>
                  <div className='col-sm-9 mb-1'>
                    <input type='text' className='form-control' id='subtitleInput' placeholder='Hunting High and Low' value={this.state.subtitleInput || ''} onChange={this.handleChange} />
                  </div>
                </div>
                <div className='form-group row'>
                  <label htmlFor='descriptionInput' className='col-sm-3 col-form-label'>Description</label>
                  <div className='col-sm-9 mb-1'>
                    <textarea className='form-control' id='descriptionInput' placeholder='Magne Furuholmen, Morten Harket and Pål Waaktaar-Savoy will be performing in An Evening With format, with an interval. For the first half of the concert, they will play new and old, familiar and less-familiar songs. Then, after returning to the stage, they will play the ten songs of their 1985 debut album Hunting High And Low in the running order of the original release.' value={this.state.descriptionInput || ''} onChange={this.handleChange} />
                  </div>
                </div>
                <div className='form-group row'>
                  <label htmlFor='locationInput' className='col-sm-3 col-form-label'>Location</label>
                  <div className='col-sm-9 mb-1'>
                    <input type='text' className='form-control' id='locationInput' placeholder='Royal Albert Hall, London' value={this.state.locationInput || ''} onChange={this.handleChange} required />
                  </div>
                </div>
                <div className='form-group row'>
                  <label htmlFor='dateInput' className='col-sm-3 col-form-label'>Date</label>
                  <div className='col-sm-5 col-7 mb-1'>
                    <input type='date' className='form-control' id='dateInput' value={this.state.dateInput || ''} onChange={this.handleChange} required />
                  </div>
                  <div className='col-sm-4 col-5 mb-1'>
                    <input type='time' className='form-control' id='timeInput' value={this.state.timeInput || ''} onChange={this.handleChange} required />
                  </div>
                </div>
                <div className='form-group row'>
                  <label htmlFor='ticketsInput' className='col-sm-3 col-form-label'>Sell Tickets</label>
                  <div className='col-sm-4'>
                    <div className='input-group mb-1 mr-sm-1'>
                      <input type='number' className='form-control' id='ticketsInput' step='1' min='1' placeholder='1' value={this.state.ticketsInput || ''} onChange={this.handleChange} required />
                      <div className='input-group-append'>
                        <div className='input-group-text'>ticket{this.state.ticketsInput > 1 && 's'}</div>
                      </div>
                    </div>
                  </div>
                  <div className='col-sm-5'>
                    <div className='input-group mb-1 mr-sm-1'>
                      <div className='input-group-prepend'>
                        <div className='input-group-text'>£</div>
                      </div>
                      <input type='number' className='form-control' id='priceInput' step='0.01' placeholder='71.50' value={this.state.priceInput || ''} onChange={this.handleChange} required />
                      <div className='input-group-append'>
                        <div className='input-group-text'>each</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='form-group row form-check my-4'>
                  <div className='col-sm-9 offset-sm-3 custom-control custom-checkbox'>
                    <input type='checkbox' className='custom-control-input' id='tcsCheck' checked={this.state.tcsCheck} onChange={this.handleChange} required />
                    <label className='custom-control-label' htmlFor='tcsCheck'>
                      I agree to the Terms and Conditions and Privacy Policy.&nbsp;
                      { (parseFloat(this.state.priceInput) > 0) && (
                        <span className='text-muted'>
                          Once you click create, your event and corresponding tickets
                          will immediately be added to the market. Cancellation of these
                          tickets is subject to a fee of £{((parseFloat(this.state.priceInput) || 0) * 0.15).toFixed(2)} each, and is not possible once purchased.
                          You'll receive a £{((parseFloat(this.state.priceInput) || 0) * 0.9).toFixed(2)} from the face value of each ticket,
                          totalling £{(Math.floor((parseFloat(this.state.priceInput) || 0) * 90) * 0.01 * (parseInt(this.state.ticketsInput, 10) || 1)).toFixed(2)} if all tickets are sold.
                        </span>
                      )}
                    </label>
                  </div>
                </div>

                <div className='form-group row justify-content-end'>
                  { this.state.error && (
                    <div className='offset-sm-3 col'>
                      <div className='alert alert-danger'>
                        There was an error{this.state.error === 2 && ' creating your tickets, but your event was created successfully.'}.
                      </div>
                    </div>
                  )}
                  { this.state.success && (
                    <div className='offset-sm-3 col'>
                      <div className='alert alert-success'>
                        Creation successful. Redirecting...
                      </div>
                    </div>
                  )}
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

export default CreateEvent

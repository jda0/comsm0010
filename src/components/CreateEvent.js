import React, { Component } from 'react'

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
        <h1 className='text-center my-5'>Create an Event</h1>
        { (!this.props.app.state.user && (
          <div className='alert alert-secondary'>
            You need to <a href={this.props.app.AUTH_SERVER + 'login' + this.props.app.AUTH_QUERY + `&state=${this.props.location.pathname}`}>Login</a> or <a href={this.props.app.AUTH_SERVER + 'signup' + this.props.app.AUTH_QUERY + `&state=${this.props.location.pathname}`}>Sign up</a> to create an event.
          </div>
        )) || (
          <form onSubmit={this.handleSubmit}>
            <div className='form-group row'>
              <label htmlFor='titleInput' className='col-sm-3 col-form-label'>Title/Artist</label>
              <div className='col-sm-9 mb-1'>
                <input type='text' className='form-control' id='titleInput' placeholder='A-ha' value={this.state.titleInput || ''} onChange={this.handleChange} required />
              </div>
            </div>
            <div className='form-group row'>
              <label htmlFor='subtitleInput' className='col-sm-3 col-form-label'>Subtitle/Tour</label>
              <div className='col-sm-9 mb-1'>
                <input type='text' className='form-control' id='subtitleInput' placeholder='Hunting High and Low' value={this.state.subtitleInput || ''} onChange={this.handleChange} required />
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
                      tickets is subject to a fee of £{((parseFloat(this.state.priceInput, 2) || 0) * 0.15).toFixed(2)} each, and is not possible once purchased.
                      You'll receive a £{((parseFloat(this.state.priceInput, 2) || 0) * 0.9).toFixed(2)} from the face value of each ticket,
                      totalling £{(Math.floor((parseFloat(this.state.priceInput, 2) || 0) * 90) * 0.01 * (parseInt(this.state.ticketsInput, 10) || 1)).toFixed(2)} if all tickets are sold.
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
          </form>
        ) }
      </div>
    )
  }
}

export default CreateEvent

import React from 'react'
import ReactDOM from 'react-dom'
import { CookiesProvider } from 'react-cookie'
import { StripeProvider } from 'react-stripe-elements'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

// @ts-ignore
String.prototype.toTitleCase = function () { return this.toLowerCase().replace(/(\s\w|^\w)/g, function (txt) { return txt.toUpperCase() }) } // eslint-disable-line no-extend-native

ReactDOM.render((
  <StripeProvider apiKey='pk_test_Wog5c2V7f1duWjDsNaelhLeo'>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </StripeProvider>
), document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()

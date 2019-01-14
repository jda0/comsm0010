exports.handler = function (event, context) {
  let AWS = require('aws-sdk')
  AWS.config.update({ region: 'eu-west-1' })
  let ddb = new AWS.DynamoDB.DocumentClient()
  // @ts-ignore
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

  const requestBody = event['body-json']

  if (!requestBody.charge || !requestBody.token) context.fail('Bad Request')

  const token = requestBody.token.id
  const amount = requestBody.charge.amount
  const currency = requestBody.charge.currency

  if (!token || !amount || !currency) context.fail('Bad Request')

  stripe.charges.create({ // Create Stripe charge with token
    amount,
    currency,
    description: 'Takon.me Account Topup',
    source: token
  })
    .then(charge => { // Success response
      addFunds(amount)
    })
    .catch(err => {
      console.log('Failed to create Stripe token', err)
      context.fail(err)
    })

  function addFunds (amount) {
    // get the user
    let user = event.context['cognito-user'] || event.context.user

    // Update the funds
    let params = {
      TableName: 'TakonUserFundsTable',
      Key: {
        'username': user
      },
      UpdateExpression: 'add funds :a',
      ExpressionAttributeValues: {
        ':a': amount // TODO how much adding
      },
      ReturnValues: 'UPDATED_NEW'
    }

    ddb.update(params, function (err, data) {
      if (err) {
        context.fail(err)
      } else {
        context.succeed(data.Attributes || data)
      }
    })
  }
}

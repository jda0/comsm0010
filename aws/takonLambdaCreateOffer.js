exports.createOffer = function (event, context) {
  var uuid = require('uuid')
  var AWS = require('aws-sdk')
  AWS.config.update({ region: 'eu-west-1' })
  var ddb = new AWS.DynamoDB.DocumentClient()
  let lambda = new AWS.Lambda()

  let bid = (event['body-json'].type === 'bid')
  let ticketIds = event['body-json'].ticketIds || []
  let eventid = (event.params && event.params.path && event.params.path.id) || event['body-json'].event
  let offer = parseInt(event['body-json'].offer) * (bid ? -1 : 1)

  let user = event.context['cognito-user'] || event.context.user

  let fee = offer * (bid ? -1 : 0.15)
  let funds = 0

  new Promise((resolve, reject) => {
    if (event['x-internal'] === '$') {
      let qty = event['body-json'].quantity || 1
      ticketIds = Array.from(Array(qty)).map((x, i) => `TICKET${'0000'.slice(Math.floor(Math.log10(i)))}${i}`)
      resolve()
    } else {
      // take fee if sufficient funds
      var params = {
        TableName: 'TakonUserFundsTable',
        ConditionExpression: 'funds > :f',
        UpdateExpression: 'ADD funds :mf',
        ExpressionAttributeValues: {
          ':f': fee,
          ':mf': -fee
        },
        Key: {
          'username': user
        },
        ReturnValues: 'UPDATED_NEW'
      }

      ddb.update(params, function (err, data) {
        if (err) {
          console.log('Not updated funds, maybe insufficient', err)
          context.fail(err)
        } else {
          funds = data.Attributes.funds
          resolve()
        }
      })
    }
  })
    .then(() => Promise.all(
      ticketIds
        .map(x => new Promise((resolve, reject) => {
          let id = uuid.v4()

          var fulfilParams = {
            FunctionName: 'takonLambdaReserveOffer',
            Payload: JSON.stringify({
              'x-internal': '$',
              'body-json': {
                'event': eventid,
                'type': event['body-json'].type,
                'limit': -offer
              },
              'context': {
                user
              }
            })
          }

          lambda.invoke(fulfilParams, (err, data) => {
            data = JSON.parse(data.Payload)
            if (err || data.errorMessage) {
              let params = {
                TableName: 'TakonOffersTable',
                Item: {
                  'id': id,
                  'eventid': eventid,
                  'offer': offer,
                  'user': user,
                  'release': event['body-json'].release || Math.floor(Date.now() * 0.001)
                }
              }
              if (x) params.Item.ticketid = x

              ddb.put(params, function (err, event) {
                if (err) reject(err)
                else resolve({ order: id })
              })
            } else {
              var delParams = {
                TableName: 'TakonOffersTable',
                Key: {
                  id: data.id
                }
              }

              var payParams = {
                TableName: 'TakonUserFundsTable',
                Key: {
                  username: (bid ? data.user : user)
                },
                UpdateExpression: 'add funds :f',
                ExpressionAttributeValues: {
                  ':f': (bid ? Math.abs(offer) : Math.abs(data.offer)) * 1.05
                }
              }

              let params = {
                TableName: 'TakonTicketsTable',
                Item: {
                  'id': uuid.v4(),
                  'event': eventid,
                  'ticket': (bid ? data.ticketid : x),
                  'user': (bid ? user : data.user),
                  'price': Math.abs(bid ? offer : data.offer)
                }
              }

              if (!bid) funds += Math.abs(data.offer) * 1.05

              ddb.delete(delParams, (err) => { if (err) console.error(err) })
              ddb.update(payParams, (err) => { if (err) console.error(err) })
              ddb.put(params, function (err, event) {
                if (err) {
                  context.fail(err)
                } else {
                  resolve({ ticket: params.Item })
                }
              })
            }
          })
        }))
    ))
    .then(x => {
      context.succeed({
        Items: x,
        user: { funds }
      })
    })
    .catch(context.fail)
}

exports.addEvent = function (event, context) {
  var uuid = require('uuid')
  var AWS = require('aws-sdk')
  AWS.config.update({ region: 'eu-west-1' })
  var ddb = new AWS.DynamoDB.DocumentClient()
  var lambda = new AWS.Lambda()

  let username = event.context['cognito-user'] || event.context.user

  var id = uuid.v4()

  var params = {
    TableName: 'TakonEventTable',
    Item: {
      'id': id,
      'datetime': event['body-json'].datetime,
      'title': event['body-json'].title,
      'location': event['body-json'].location,
      'admins': [username, ...(event['body-json'].admins || [])],
      'maxOrderQty': event['body-json'].maxOrderQty || 1
    }
  }

  if (event['body-json'].subtitle) params.Item.subtitle = event['body-json'].subtitle
  if (event['body-json'].description) params.Item.subtitle = event['body-json'].description

  // TODO create offers

  // Call DynamoDB to add the item to the table
  ddb.put(params, function (err, data) {
    if (err) {
      context.fail(err)
    } else {
      // create offers
      var offerParams = {
        FunctionName: 'takonLambdaCreateOffer',
        Payload: JSON.stringify({
          'x-internal': '$',
          'body-json': {
            'event': id,
            'offer': event['body-json'].offer,
            'quantity': event['body-json'].quantity
          },
          'context': {
            'user': username
          }
        })
      }

      lambda.invoke(offerParams, function (error, data) {
        if (error) {
          context.fail(error)
        } else {
          context.succeed({ invoked: true, id, ...JSON.parse(data.Payload) })
        }
      })
    }
  })
}

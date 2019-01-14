exports.getBestOffers = function (event, context, callback) {
  let AWS = require('aws-sdk')
  AWS.config.update({ region: 'eu-west-1' })
  let ddb = new AWS.DynamoDB.DocumentClient()

  let events = decodeURIComponent(event.params.querystring.eventids).split(',')
  let shit = {}

  Promise.all(events.map(event => {
    shit[event] = {}

    let params = {
      TableName: 'TakonOffersTable',
      IndexName: 'eventid-offer-index',
      KeyConditionExpression: 'eventid = :e and offer < :z',
      Count: 1,
      ExpressionAttributeValues: {
        ':e': event,
        ':z': 0
      }
    }

    // Call DynamoDB to scan the table
    return new Promise((resolve, reject) => {
      ddb.query(params, function (err, data) {
        if (err) {
          reject(err)
        } else {
          shit[event].bid = (data.Items && data.Items[0] && -data.Items[0].offer) || 0

          let params = {
            TableName: 'TakonOffersTable',
            IndexName: 'eventid-offer-index',
            KeyConditionExpression: 'eventid = :e and offer > :z',
            Count: 1,
            ExpressionAttributeValues: {
              ':e': event,
              ':z': 0
            }
          }

          ddb.query(params, function (err, data) {
            if (err) {
              reject(err)
            } else {
              shit[event].ask = (data.Items && data.Items[0] && data.Items[0].offer) || 0
              resolve()
            }
          })
        }
      })
    })
  }))
    .then(() => {
      context.succeed(shit)
    })
    .catch(err => {
      context.fail(err)
    })
}

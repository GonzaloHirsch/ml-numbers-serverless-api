const tf = require('@tensorflow/tfjs');

// Store the TF model outside the function so it might be shared between instances
let model;

exports.handler = async (event, _) => {
  let body = {};
  let statusCode = 200;
  // We need to define no cache so that Github doesn't cache the image
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };
  try {
    switch (`${event.httpMethod} ${event.resource}`) {
      case "POST /predict":
        // Check we have the data in the data property
        if (!event.body) throw new Error('Error/missing data parameter.');
        const bodyIn = JSON.parse(event.body);
        if (!Array.isArray(bodyIn.data) || bodyIn.data.length !== 784) throw new Error('Error/missing data parameter.');

        // Create the model if not present
        if (!model) model = await tf.loadLayersModel(process.env.MODEL_URL);

        // Populating the template
        body = JSON.stringify({
          result: model.predict(tf.tensor(bodyIn.data, [1, 28, 28, 1])).dataSync()
        });
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}".`);
    }
  } catch (err) {
    console.log(err)
    statusCode = 400;
    body = err.message;
  }

  return {
    statusCode,
    body,
    headers
  };
};

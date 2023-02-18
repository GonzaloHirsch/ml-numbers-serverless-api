import * as tf from '@tensorflow/tfjs-node';
import fs from 'fs';

// Import the custom configuration
const config = JSON.parse(fs.readFileSync('config.json'));

// Define the model
const model = tf.sequential()
config.layers.forEach(layer => {
    // No parameters defined, just a function call
    if (layer.parameters === undefined) model.add(tf.layers[layer.type]());
    else model.add(tf.layers[layer.type](layer.parameters));
})

// Define the optimizer
const optimizer = 'rmsprop';
model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
});

export default model;
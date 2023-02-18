import fs from 'fs';

// Local imports
import data from './data.js';
import model from './model.js';

// Import the custom configuration
const config = JSON.parse(fs.readFileSync('config.json'));

const run = async () => {
    // Load the data
    await data.loadData();

    // Get the images/labels for training
    const { images: trainImages, labels: trainLabels } = data.getTrainData();

    console.log('\n\n[INFO] Printing model summary... \n');
    model.summary();

    console.log('\n\n[INFO] Training the model with train data... \n');
    await model.fit(trainImages, trainLabels, {
        epochs: config.epochs,
        batchSize: config.batchSize,
        validationSplit: config.validationSplit,
    });

    console.log('\n\n[INFO] Testing the model with test data... \n');
    const { images: testImages, labels: testLabels } = data.getTestData();
    const evalOutput = model.evaluate(testImages, testLabels);

    console.log(
        `\n\n[RESULT] Evaluation result:\n` +
        `\t\tLoss = ${evalOutput[0].dataSync()[0].toFixed(3)}\n` +
        `\t\tAccuracy = ${evalOutput[1].dataSync()[0].toFixed(3)}\n`);

    console.log('\n\n[INFO] Saving the model configuration... \n');
    const path = `file://${config.savePath}`;
    await model.save(path);
    console.log(`\n\n[INFO] Saved model to path ${path} \n`);
    
    console.log('\n\n[INFO] Saving the model configuration... \n');
    const pathLatest = `file://exports/latest`;
    await model.save(pathLatest);
    console.log(`\n\n[INFO] Saved model to path ${pathLatest} \n`);
};

run();
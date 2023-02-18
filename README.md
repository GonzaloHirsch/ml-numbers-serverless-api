# Serverles Machine Learning Number Prediction

This repository is the source code for a serverless API that uses a CNN to predict hand-written numbers. The repository has 2 parts, the API and the ML model. This prediction is based on the MNIST dataset.

## Configuration

`.env` files are needed to set up environment variables on different levels. Both a `.env.production` and `.env.development` are required. The contents should be:
```
MODEL_BUCKET_NAME=NAME OF THE S3 BUCKET TO STORE THE ML MODEL
MODEL_URL=URL OF THE ML MODEL, CAN BE LOCAL OR REMOTE.
```

Note that `MODEL_URL` can be local or remote. Examples of both:
- Local --> `http://localhost:3000/latest/model.json`, meant for development, used in the `.env.development` file. Should be a local server that serves the contents.
- Remote --> `https://BUCKET_NAME.s3.amazonaws.com/model.json`, meant for production, used in the `.env.production` file.

## ML Model

The ML model is built using the `ml-model` folder. It is heavily inspired on [this](https://github.com/tensorflow/tfjs-examples/tree/1f6209de0bb9c198addc7bc13372259591aa7928/mnist-node) TF Demo, which offers great accuracy.

Note: All the following commands are within the `ml-model` folder, so you should `cd` there before running them.

### Configuration

The configuration of the model can be accessed via `ml-model/config.json`. In here one can configure the entire neural network and training.

A sample configuration is:
```json
{
    "epochs": 20,
    "batchSize": 128,
    "validationSplit": 0.15,
    "savePath": "exports/cpu-v2",
    "layers": [
        {
            "type": "conv2d",
            "parameters": {
                "inputShape": [
                    28,
                    28,
                    1
                ],
                "filters": 32,
                "kernelSize": 3,
                "activation": "relu"
            }
        },
        {
            "type": "conv2d",
            "parameters": {
                "filters": 32,
                "kernelSize": 3,
                "activation": "relu"
            }
        },
        {
            "type": "maxPooling2d",
            "parameters": {
                "poolSize": [
                    2,
                    2
                ]
            }
        },
        {
            "type": "conv2d",
            "parameters": {
                "filters": 64,
                "kernelSize": 3,
                "activation": "relu"
            }
        },
        {
            "type": "conv2d",
            "parameters": {
                "filters": 64,
                "kernelSize": 3,
                "activation": "relu"
            }
        },
        {
            "type": "maxPooling2d",
            "parameters": {
                "poolSize": [
                    2,
                    2
                ]
            }
        },
        {
            "type": "flatten"
        },
        {
            "type": "dropout",
            "parameters": {
                "rate": 0.25
            }
        },
        {
            "type": "dense",
            "parameters": {
                "units": 512,
                "activation": "relu"
            }
        },
        {
            "type": "dropout",
            "parameters": {
                "rate": 0.5
            }
        },
        {
            "type": "dense",
            "parameters": {
                "units": 10,
                "activation": "softmax"
            }
        }
    ]
}
```

The configuration above is for the deployed CNN. In fact, one could try different configurations to try different performance. The layers are defined sequentially in the order defined in the configuration file.

The schema is as follows:
```json
{
    "epochs": "INTEGER, SAME AS TF DEFINITION",
    "batchSize": "INTEGER, SAME AS TF DEFINITION",
    "validationSplit": "FLOAT, 0 to 1, SAME AS TF DEFINITION",
    "savePath": "LOCAL PATH TO THE SAVE FILE",
    "layers": [
        {
            "type": "NAME OF THE TF LAYER TYPE",
            "parameters": "OBJECT THAT IS PASSED ENTIRELY AS A PARAMETER, NOT DECLARED IF THE FUNCTION TYPE HAS NO PARAMETERS"
        }
    ]
}
```

### Training

When training the model, it will download all the MNIST dataset locally to use it. After the model finishes training, it will store the model serialization in order to easily recover it later. The stored results are located in the `ml-model/exports` folder.

To train the model, run:
```bash
npm run train
```

### Deployment

The latest saved configuration (`ml-model/exports/latest`) is uploaded to an S3 bucket to be then accessed by the serverless API.

To deploy a newer version, run:
```bash
npm run deploy
```

## API

The API portion is based on a single handler using the Serverless Framework.

### Deployment

To deploy the service, the following command can be used:
```
npm run deploy
```

### Local development

You can invoke the function locally by using the following command:

```bash
serverless invoke local --function getNumberPrediction --path test.json
```

# AWS Mechanical Turk Audio Classification
## NYU Research

This is a webpage made in order to collect data on audio samples for training AI
A Worker is presented an audio sample, and then asked whether or not a certain something is present in the audio.
Afterwards the user is either asked:
- Their answer confidence 
- Whether the user would pick a 50:50 lottery or their answer's correctness for a chance to win bonus pay.
  - If the user picks lottery, the chances are raised (e.g. 60:40) and are asked again
  - If the user picks their answer or the lottery has reached 100:0, the user proceeds to the next question
  
### nitty-gritty:
Two parameters must be passed in addition to the amazon parameters in Mechanical Turk (mturk). 
```
task_type = 1 || 2
items = [
  {
    'label': 'Thing that might be in the audio',
    'file': 'The file located in train_audio.wav'
  }
]
```
They must be added when the Hit is created. The Python3 script post_hits.py shows how this is done. 
Note, you will have to set your own [environment variables](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/configuration.html#environment-variables) to use boto3.Session()
I personally set `AWS_SHARED_CREDENTIALS_FILE=C:\someroute\to\credentials` 

It is currently set up so mturk points directly to this github site.

# Usual setup

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

# Tagger UI

A simple UI to test the IOTA tagger Microservice

Run locally:
- clone the repo
- install the dependencies with _npm install_
- set the enviromental variables
  - TAGGER_SERVICE (FQDN of the azure container instance running the microservice)
  - CONNECTION_STRING (Service Key for the IoT Hub where devices are porvisioned)

Run as a container instance:
- Build image using the Dockerfile in the repo
- Push to an azure container registry
- instantiate an instance, remember to set environmental variables as when run localy plus another for PORT=80
#!/bin/bash

# Script to install AWS CDK infrastructure dependencies

echo "Installing infrastructure dependencies..."
cd infrastructure
npm install

echo "Infrastructure dependencies installed successfully."
echo "To deploy the application, run: npm run cdk:deploy"

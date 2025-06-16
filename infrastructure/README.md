# React App Infrastructure

This directory contains the AWS CDK infrastructure code for deploying the React application to AWS. The infrastructure includes an S3 bucket for storing the application files and a CloudFront distribution for serving the application globally.

## Prerequisites

- AWS CLI configured with appropriate credentials
- Node.js and npm installed
- AWS CDK bootstrapped in your AWS account (`cdk bootstrap`)

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Build the TypeScript code:

   ```bash
   npm run build
   ```

3. Deploy the infrastructure:

   ```bash
   npm run deploy
   ```

   Using a .env file:

   Create a `.env` file in the infrastructure directory:

   ```
   CDK_ENV=prod
   CDK_DOMAIN_NAMES=example.com,www.example.com
   CDK_CERTIFICATE_ARN=arn:aws:acm:us-east-1:123456789012:certificate/abcd1234-abcd-1234-abcd-1234abcd5678
   ```

   Then run:

   ```bash
   npm run deploy
   ```

   Or using inline environment variables:

   ```bash
   CDK_ENV=prod CDK_DOMAIN_NAMES=example.com CDK_CERTIFICATE_ARN=arn:aws:acm:us-east-1:123456789012:certificate/abcd1234-abcd-1234-abcd-1234abcd5678 npm run deploy
   ```

## Available Commands

- `npm run build`: Compile TypeScript code
- `npm run watch`: Watch for file changes and compile
- `npm run cdk`: Run CDK CLI commands
- `npm run deploy`: Deploy the CDK stack
- `npm run destroy`: Remove the CDK stack
- `npm run diff`: Show differences between current infrastructure and local code
- `npm run synth`: Synthesize CloudFormation template

## Stack Configuration

The infrastructure can be configured using a `.env` file or environment variables:

### Configuration Parameters

- `CDK_ENV`: The environment name (e.g., dev, test, prod)
- `CDK_DOMAIN_NAMES`: Comma-separated list of domain names (optional)
- `CDK_CERTIFICATE_ARN`: ACM certificate ARN for custom domain (optional)

### Using a .env File

Create a `.env` file in the infrastructure directory with your configuration:

```
# Environment name
CDK_ENV=dev

# Optional: Domain names (comma-separated)
CDK_DOMAIN_NAMES=example.com,www.example.com

# Optional: ACM certificate ARN for HTTPS
CDK_CERTIFICATE_ARN=arn:aws:acm:us-east-1:123456789012:certificate/abcd1234-abcd-1234-abcd-1234abcd5678
```

## Infrastructure Components

- **S3 Bucket**: Stores the built React application files
- **CloudFront Distribution**: Delivers the application globally with low latency

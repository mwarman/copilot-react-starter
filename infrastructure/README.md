# AWS CDK Infrastructure for Task Hero

This directory contains the AWS CDK infrastructure code for deploying the React application to AWS.

## Architecture

The React application is deployed using the following AWS services:

- **S3**: Bucket for storing the built React application files
- **CloudFront**: Content delivery network for hosting the application globally

## Prerequisites

- AWS CLI configured with appropriate credentials
- Node.js and npm installed
- AWS account bootstrapped for CDK (`npm run cdk bootstrap`)

## Directory Structure

- `stacks/frontend-stack.ts` - Contains the S3 and CloudFront resource definitions
- `app.ts` - CDK app entry point
- `package.json` - Dependencies and scripts for infrastructure
- `tsconfig.json` - TypeScript configuration for infrastructure code
- `cdk.json` - AWS CDK configuration

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Synthesize the CloudFormation template:

```bash
npm run synth
```

3. Deploy the infrastructure:

```bash
npm run deploy
```

## Available Commands

- `npm run build` - Builds the TypeScript code
- `npm run watch` - Watches for changes in the TypeScript code
- `npm run cdk` - Runs CDK CLI commands
- `npm run deploy` - Deploys the infrastructure to AWS
- `npm run destroy` - Removes the infrastructure from AWS
- `npm run synth` - Synthesizes the CloudFormation template

## Customization

To customize the infrastructure, you can modify the following:

- `app.ts` - Update the stack name or add environment configuration
- `stacks/frontend-stack.ts` - Modify S3 or CloudFront configuration

For example, to add a custom domain name, uncomment and update the `domainName` property in `app.ts`.

## Security

The infrastructure is configured with security best practices:

- S3 bucket is not publicly accessible
- CloudFront uses Origin Access Control to access the S3 bucket
- HTTPS is enforced for all web traffic

## Cost Considerations

The infrastructure is designed to be cost-effective:

- CloudFront uses Price Class 100 (lowest cost tier, covering North America and Europe)
- S3 bucket objects are automatically deleted when the stack is removed

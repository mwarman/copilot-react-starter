# Requirement: AWS CDK Infrastructure

## Overview

This document outlines the requirements for deploying our React application using Infrastructure as Code (IaC) with AWS Cloud Development Kit (CDK). The infrastructure will host our React application on AWS with a cost-effective architecture.

## Architecture

The React application will be deployed using the following AWS services:

- **S3**: Bucket for storing the built React application files
- **CloudFront**: Content delivery network for hosting the application globally

## Infrastructure Requirements

### S3 Bucket

- A bucket to host the static React application files
- Configuration:
  - Must be destroyed when the CDK stack is deleted
  - Objects in the bucket should be auto-deleted when the bucket is removed
  - Should not be publicly accessible (CloudFront will be the access point)

### CloudFront Distribution

- Distribution to serve the React application
- Configuration:
  - Connect to the S3 bucket using Origin Access Control
  - Redirect HTTP to HTTPS
  - Set `index.html` as the default root object
  - Configure error responses for 403/404 to redirect to `index.html` (for SPA routing)
  - Use Price Class 100 (lowest cost option, covers North America and Europe)
  - Ensure proper cache policies for a Single Page Application

### Deployment Pipeline

- The S3 bucket deployment should deploy files from the `../dist` directory
- The CloudFront distribution should be properly invalidated on deployment

## CDK Stack Implementation

The infrastructure should be implemented in TypeScript using AWS CDK with the following guidelines:

- Create a dedicated stack for frontend resources
- Use environment variables for configurable values
- Follow AWS best practices for security
- Implement with cost-optimization in mind
- Follow the project guidelines and best practices

## Example CDK Stack Structure

```
/infrastructure
  /stacks
    frontend-stack.ts         # Stack for S3 + CloudFront
  app.ts                      # CDK app entry point

cdk.json                      # CDK configuration
package.json                  # Dependencies
```

## Deployment Instructions

The infrastructure should be deployable with standard CDK commands:

```bash
# Install dependencies
npm install

# Run CDK commands
npm run cdk
```

## Cost Considerations

- Use the most cost-effective AWS resources and configurations
- CloudFront should use Price Class 100 (lowest cost tier)
- S3 lifecycle rules should be considered for cost optimization
- Monitor and configure proper TTL settings in CloudFront to reduce origin requests

## Security Requirements

- S3 bucket should not be directly accessible from the internet
- CloudFront should use Origin Access Identity to access the S3 bucket
- HTTPS should be enforced for all web traffic
- Implement least privilege permissions

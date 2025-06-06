#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { FrontendStack } from './stacks/frontend-stack';

const app = new cdk.App();

// Define the stack environment
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

// Define tags that will be applied to all resources
const tags = {
  App: 'task-hero',
  Env: process.env.CDK_ENV || 'dev',
  OU: 'leanstacks',
  Owner: 'Matthew Warman',
};

// Create the frontend stack
new FrontendStack(app, 'TaskHeroUiStack', {
  stackName: `task-hero-ui-${process.env.CDK_ENV || 'dev'}`, // Stack name with environment suffix
  description: 'Task Hero UI Stack - Static website hosted on S3 with CloudFront',
  // You can provide a custom domain name if needed
  // domainName: 'example.com',
  env,
  tags,
});

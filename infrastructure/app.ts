#!/usr/bin/env node
import 'dotenv/config'; // Load environment variables from .env file
import * as cdk from 'aws-cdk-lib';
import { FrontendStack } from './stacks/frontend-stack';

// Load configuration from environment variables with fallbacks to context values
const environmentName = process.env.CDK_ENV || 'dev';

const domainNamesString = process.env.CDK_DOMAIN_NAMES;
const domainNames = domainNamesString ? domainNamesString.split(',') : undefined;

const certificateArn = process.env.CDK_CERTIFICATE_ARN;

// Default environment configuration
// If not set, use the CDK default account and region
// If CDK_DEFAULT_REGION is not set, default to 'us-east-1'
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
};

// Set tags for the stack
// Tags are used for resource management and cost allocation
const tags = {
  App: 'task-hero-wireframes',
  Env: environmentName,
  OU: 'leanstacks',
  Owner: 'Matthew Warman',
};

/**
 * The AWS CDK app for deploying the frontend infrastructure
 */
const app = new cdk.App();

// Create the frontend stack
new FrontendStack(app, `TaskHeroWireframes${environmentName}`, {
  // Specify the stack name using the environment name
  stackName: `task-hero-wireframes-${environmentName}`,
  description: `Task Hero Wireframes UI Stack for ${environmentName} environment`,
  // Pass the environment configuration
  env,
  // Add environment-specific tags
  tags,

  // Pass the custom environment variables to the stack
  environmentName,
  domainNames,
  certificateArn,
});

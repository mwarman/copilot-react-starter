import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfront_origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3_deployment from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export interface FrontendStackProps extends cdk.StackProps {
  /**
   * Domain name for the CloudFront distribution (optional)
   */
  domainName?: string;
}

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: FrontendStackProps) {
    super(scope, id, props);

    // Create an S3 bucket to host the static website files
    const bucket = new s3.Bucket(this, 'TaskHeroUiBucket', {
      // Remove the bucket when the stack is deleted
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      // Auto-delete objects when the bucket is removed
      autoDeleteObjects: true,
      // Block all public access - CloudFront will be the only access point
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // Create a CloudFront distribution to serve the website
    const distribution = new cloudfront.Distribution(this, 'TaskHeroUiDistribution', {
      // Set default root object
      defaultRootObject: 'index.html',
      // Use the lowest cost price class (North America and Europe)
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      // Domain names if provided
      ...(props?.domainName ? { domainNames: [props.domainName] } : {}),
      // Default behavior for the distribution
      defaultBehavior: {
        // Use the S3 bucket as the origin
        origin: cloudfront_origins.S3BucketOrigin.withOriginAccessControl(bucket),
        // Redirect HTTP to HTTPS
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        // Cache optimized for SPA
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      // Configure error responses for SPA routing
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.seconds(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.seconds(0),
        },
      ],
    });

    // Deploy the website files to the S3 bucket
    new s3_deployment.BucketDeployment(this, 'TaskHeroUiDeployment', {
      sources: [s3_deployment.Source.asset('../dist')],
      destinationBucket: bucket,
      // Invalidate CloudFront cache after deployment
      distribution,
      distributionPaths: ['/*'],
    });

    // Output the CloudFront URL
    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
      description: 'The domain name of the CloudFront distribution',
    });

    // Output the S3 bucket name
    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
      description: 'The name of the S3 bucket',
    });

    // Output the CloudFront Distribution ID
    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
      description: 'The ID of the CloudFront distribution',
    });
  }
}

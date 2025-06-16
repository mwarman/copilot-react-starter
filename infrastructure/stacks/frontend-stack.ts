import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfront_origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3_deployment from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export interface FrontendStackProps extends cdk.StackProps {
  /**
   * The environment name (e.g., dev, test, prod)
   */
  environmentName: string;

  /**
   * Domain names for the CloudFront distribution (optional)
   */
  domainNames?: string[];

  /**
   * ACM certificate ARN for custom domain (optional)
   */
  certificateArn?: string;

  /**
   * Resource tags
   */
  tags?: { [key: string]: string };
}

/**
 * Frontend infrastructure stack for hosting the React application
 * Includes S3 bucket for storage and CloudFront for content delivery
 */
export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, props);

    // Create an S3 bucket to store the React application
    const bucket = new s3.Bucket(this, 'AppBucket', {
      // Auto-delete the bucket and its contents when the stack is deleted
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,

      // Block all public access to the bucket
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // Create CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'AppDistribution', {
      // Set default behavior for CloudFront
      defaultBehavior: {
        origin: cloudfront_origins.S3BucketOrigin.withOriginAccessControl(bucket),
        // Redirect HTTP requests to HTTPS
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        // Cache settings for SPA
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      // Set index.html as the default root object
      defaultRootObject: 'index.html',
      // Use Price Class 100 (lowest cost, covers North America and Europe)
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      // Configure error responses for SPA routing
      errorResponses: [
        {
          httpStatus: 403,
          responsePagePath: '/index.html',
          responseHttpStatus: 200,
          ttl: cdk.Duration.seconds(0),
        },
        {
          httpStatus: 404,
          responsePagePath: '/index.html',
          responseHttpStatus: 200,
          ttl: cdk.Duration.seconds(0),
        },
      ],
      domainNames: props.domainNames || [],
      certificate: props.certificateArn
        ? certificatemanager.Certificate.fromCertificateArn(this, 'Certificate', props.certificateArn)
        : undefined,
    });

    // Deploy the React application to S3
    new s3_deployment.BucketDeployment(this, 'AppDeployment', {
      sources: [s3_deployment.Source.asset('../dist')],
      destinationBucket: bucket,
      // Invalidate CloudFront cache after deployment
      distribution: distribution,
      distributionPaths: ['/*'],
    });

    // Output the CloudFront distribution URL
    new cdk.CfnOutput(this, 'DistributionUrl', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'URL of the CloudFront distribution',
    });

    // Output the S3 bucket name
    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
      description: 'Name of the S3 bucket hosting the application',
    });
  }
}

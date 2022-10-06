import * as path from 'path';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as efs from 'aws-cdk-lib/aws-efs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as tr from 'aws-cdk-lib/aws-transfer';

interface IProps extends StackProps {
  vpc: ec2.IVpc;
  securityGroup: ec2.ISecurityGroup;
  fileSystem: efs.IFileSystem;
}

export class TransferEfsStack extends Stack {
  constructor(scope: Construct, id: string, props: IProps) {
    super(scope, id, props);

    const transferRole = new iam.Role(this, 'TransferRole', {
      assumedBy: new iam.ServicePrincipal('transfer.amazonaws.com'),
      managedPolicies: [
        {
          managedPolicyArn:
            'arn:aws:iam::aws:policy/service-role/AWSTransferLoggingAccess',
        },
        {
          managedPolicyArn:
            'arn:aws:iam::aws:policy/AmazonElasticFileSystemClientFullAccess',
        },
      ],
    });

    const identifier = new lambdaNodejs.NodejsFunction(this, 'Identifier', {
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: path.resolve(__dirname, '..', 'functions', 'identifier.ts'),
      environment: {
        ROLE_ARN: transferRole.roleArn,
        EFS_ID: props.fileSystem.fileSystemId,
      },
    });
    identifier.grantInvoke(new iam.ServicePrincipal('transfer.amazonaws.com'));

    new tr.CfnServer(this, `Server`, {
      domain: 'EFS',
      endpointDetails: {
        subnetIds: props.vpc.privateSubnets.map((subnet) => subnet.subnetId),
        securityGroupIds: [props.securityGroup.securityGroupId],
        vpcId: props.vpc.vpcId,
      },
      endpointType: 'VPC',
      identityProviderDetails: {
        function: identifier.functionArn,
      },
      identityProviderType: 'AWS_LAMBDA',
      loggingRole: transferRole.roleArn,
      protocols: ['SFTP', 'FTP'],
      securityPolicyName: 'TransferSecurityPolicy-2022-03',
    });
  }
}

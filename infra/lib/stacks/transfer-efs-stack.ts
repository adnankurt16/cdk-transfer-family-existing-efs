import * as path from 'path';
import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as efs from 'aws-cdk-lib/aws-efs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as tr from 'aws-cdk-lib/aws-transfer';

interface IProps extends StackProps {
  vpc: ec2.IVpc;
  fileSystem: efs.IFileSystem;
  uid: string;
  gid: string;
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
        EFS_UID: props.uid,
        EFS_GID: props.gid,
      },
    });
    identifier.grantInvoke(new iam.ServicePrincipal('transfer.amazonaws.com'));

    const transferServer = new tr.CfnServer(this, 'TransferServer', {
      domain: 'EFS',
      endpointType: 'PUBLIC',
      identityProviderDetails: {
        function: identifier.functionArn,
      },
      identityProviderType: 'AWS_LAMBDA',
      loggingRole: transferRole.roleArn,
      protocols: ['SFTP'],
      securityPolicyName: 'TransferSecurityPolicy-2022-03',
    });

    new CfnOutput(this, 'TransferEndpoint', {
      value: `sftp://${transferServer.attrServerId}.server.transfer.${this.region}.amazonaws.com`
    });
  }
}

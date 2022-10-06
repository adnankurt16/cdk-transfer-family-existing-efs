import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as efs from 'aws-cdk-lib/aws-efs';

interface IProps extends StackProps {
  vpc: ec2.IVpc;
  securityGroup: ec2.ISecurityGroup;
}

export class EfsStack extends Stack {
  public readonly fileSystem: efs.IFileSystem;

  constructor(scope: Construct, id: string, props: IProps) {
    super(scope, id, props);

    const fileSystem = new efs.FileSystem(this, `FileSystem`, {
      vpc: props.vpc,
      securityGroup: props.securityGroup,
      performanceMode: efs.PerformanceMode.GENERAL_PURPOSE,
      throughputMode: efs.ThroughputMode.BURSTING,
    });
    fileSystem.connections.allowInternally(ec2.Port.allTraffic());

    this.fileSystem = fileSystem;
  }
}

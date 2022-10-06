import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Config } from '../configs/loader';

export class VpcStack extends Stack {
  public readonly vpc: ec2.IVpc;
  public readonly taskSecurityGroup: ec2.ISecurityGroup;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.vpc = ec2.Vpc.fromLookup(this, 'Vpc', { vpcId: Config.VpcID });

    this.taskSecurityGroup = new ec2.SecurityGroup(this, 'TaskSecurityGroup', {
      securityGroupName: `${Config.Ns}TaskSecurityGroup`,
      vpc: this.vpc,
    });
  }
}

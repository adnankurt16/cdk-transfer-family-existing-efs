#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/stacks/vpc-stack';
import { EfsStack } from '../lib/stacks/efs-stack';
import { TransferEfsStack } from '../lib/stacks/transfer-efs-stack';
import { Config } from '../lib/configs/loader';

const app = new cdk.App();

const vpcStack = new VpcStack(app, `${Config.Ns}VpcStack`, {
  vpcId: Config.VpcID,
  env: {
    account: Config.AWS.Account,
    region: Config.AWS.Region,
  },
});

const efsStack = new EfsStack(app, `${Config.Ns}EfsStack`, {
  vpc: vpcStack.vpc,
  env: {
    account: Config.AWS.Account,
    region: Config.AWS.Region,
  },
});
efsStack.addDependency(vpcStack);

const transferEfsStack = new TransferEfsStack(
  app,
  `${Config.Ns}TransferEfsStack`,
  {
    vpc: vpcStack.vpc,
    fileSystem: efsStack.fileSystem,
    uid: Config.Efs.UId,
    gid: Config.Efs.GId,
    env: {
      account: Config.AWS.Account,
      region: Config.AWS.Region,
    },
  }
);
transferEfsStack.addDependency(efsStack);

const tags = cdk.Tags.of(app);
tags.add('saga:namespace', Config.Ns);
tags.add('saga:stage', Config.Stage);

app.synth();

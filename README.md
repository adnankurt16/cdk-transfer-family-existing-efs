# CDK Transfer Family with existing EFS and public FTP Endpoint

aws transfer-family-efs cdk with existing efs and public ftp endpoint example

# Prerequisites

- git
- awscli
- Nodejs 16.x
- AWS Account and locally configured AWS credential

# Installation

## Setup awscli

```bash
$ aws configure
AWS Access Key ID [****************NCHZ]:
AWS Secret Access Key [****************AwoB]:
Default region name [us-east-1]:
Default output format [json]:
```

## Install dependencies

```bash
$ cd infra
$ npm i -g aws-cdk@2.72.1
$ npm i
```

## Configuration

open [**infra/env/dev.env**](/infra/env/dev.env) and fill the blow fields

- `VPC_ID`: vpc id
- `EFS_ID`: efs id
- `EFS_UID`: efs uid (default: 0)
- `EFS_GID`: efs gid (default: 0)
- `AWS_ACCOUNT_ID`: 12 digit account id
- `AWS_REGION`: e.g. ap-northeast-2
- `FTP_USERNAME`: ftp username
- `FTP_PASSWORD`: ftp password

and copy `env/dev.env` file to project root as `.env`

```bash
$ cd infra
$ cp env/dev.env .env
```

## Deploy for dev

if you never run bootstrap on the account, bootstrap it.

```bash
$ cdk bootstrap
```

deploy infrastructure

```bash
$ cdk deploy "*" --require-approval never
```

## Error handling

ERROR: failed to solve: public.ecr.aws/sam/build-nodejs16.x: error getting credentials - err: exit status 1

```bash
$ rm -rf ~/.docker/config.json
```

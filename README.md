# CDK Transfer Family EFS

aws transfer-family-efs cdk example

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
- `EFS_UID`: efs uid
- `EFS_GID`: efs gid
- `AWS_ACCOUNT_ID`: 12 digit account id
- `AWS_REGION`: e.g. ap-northeast-2

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

import * as path from 'path';
import * as joi from 'joi';
import * as dotenv from 'dotenv';
import { VpcValidator } from './validators';
import { IConfig } from './interface';

dotenv.config({
  path: path.resolve(__dirname, '..', '..', '.env'),
});

console.log('process.env', process.env);

const schema = joi
  .object({
    NS: joi.string().required(),
    STAGE: joi.string().required(),
    AWS_ACCOUNT_ID: joi.string().required(),
    AWS_REGION: joi.string().required(),
    VPC_ID: joi.string().custom(VpcValidator).required(),
    EFS_ID: joi.string().required(),
    EFS_UID: joi.number().required(),
    EFS_GID: joi.number().required(),
    FTP_USERNAME: joi.string().required(),
    FTP_PASSWORD: joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = schema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const Config: IConfig = {
  Ns: `${envVars.NS}${envVars.STAGE}`,
  Stage: envVars.STAGE,
  AWS: {
    Account: `${envVars.AWS_ACCOUNT_ID}`,
    Region: envVars.AWS_REGION,
  },
  VpcID: envVars.VPC_ID,
  Efs: {
    ID: envVars.EFS_ID,
    UId: `${envVars.EFS_UID}`,
    GId: `${envVars.EFS_GID}`,
  },
  Ftp: {
    Username: envVars.FTP_USERNAME,
    Password: envVars.FTP_PASSWORD,
  },
  IsDev: () => Config.Stage === 'Dev',
};

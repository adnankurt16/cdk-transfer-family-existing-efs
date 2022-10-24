export interface IConfig {
  Ns: string;
  Stage: string;
  AWS: {
    Account: string;
    Region: string;
  };
  VpcID: string;
  Efs: {
    UId: string;
    GId: string;
  };
  IsDev: () => boolean;
}

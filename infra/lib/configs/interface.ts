export interface IConfig {
  Ns: string;
  Stage: string;
  AWS: {
    Account: string;
    Region: string;
  };
  VpcID: string;
  Efs: {
    ID: string;
    UId: string;
    GId: string;
  };
  Ftp: {
    Username: string;
    Password: string;
  };
  IsDev: () => boolean;
}

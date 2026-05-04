export interface IZatacEnteryHistory {
  userId: string;

  branchName: string;

  macAddress: string;
  csr: string;
  inputOtp: string;
  csrValidation: boolean;
  key_pem: string;
  sydate: Date;
  requestId: number;
  dispositionMessage: string;
  binarySecurityToken: string;
  secret: string;
}

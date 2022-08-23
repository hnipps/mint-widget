export type WAGMIError = {
  code: number;
  data: string;
  internal: {
    message: string;
    code: number;
    stack: string;
  };
  name: string;
};

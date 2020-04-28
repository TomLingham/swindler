interface IMockRequestDef {
  method: string;
  path: string;
}

interface IMockResponseDef {
  status: number;
  headers: {
    [headerName: string]: string;
  };
}

type IMockFile = {
  request: IMockRequestDef;
  response: IMockResponseDef;
  body?: string | object;
};

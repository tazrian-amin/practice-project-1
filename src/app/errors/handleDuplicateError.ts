import { TErrorSources, TGenericErrorResponse } from '../interface/error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (error: any): TGenericErrorResponse => {
  const match = error.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];

  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${extractedMessage} already exists!`,
    },
  ];
  const statusCode = 400;

  return {
    statusCode,
    message: 'Duplicate Item Error',
    errorSources,
  };
};

export default handleDuplicateError;

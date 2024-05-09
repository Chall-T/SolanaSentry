import express from "express";

type SentryError = {
  statusCode?: number;
  message?: string;
  stack?: string;
};

export const ErrorHandler = (
  err: SentryError,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || "Something went wrong";
  let error: SentryError = {
    statusCode: errStatus,
    message: errMsg,
  };
  if (process.env.NODE_ENV === "development") {
    error.stack = err.stack;
  }

  res.status(errStatus).json({
    error,
  });
};

export default ErrorHandler;

import type { Response } from "express";

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "Request successful",
  statusCode = 200
): void {
  const body: ApiResponse<T> = { success: true, message, data };
  res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  message = "Something went wrong",
  statusCode = 500,
  errors?: unknown
): void {
  const body: ApiResponse = { success: false, message, errors };
  res.status(statusCode).json(body);
}

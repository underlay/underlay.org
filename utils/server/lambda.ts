import { LambdaClient } from "@aws-sdk/client-lambda";

export const region = process.env.AWS_LAMBDA_REGION!;

export const Lambda = new LambdaClient({ region });

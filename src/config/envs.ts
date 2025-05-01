import 'dotenv/config';
import * as joi from 'joi';

interface Envs {
  PORT: number;

  // PRODUCTS_MS_HOST: string;
  // PRODUCTS_MS_PORT: number;

  DATABASE_URL: string;
  NATS_SERVERS: string[];
  JWT_SECRET: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    JWT_SECRET: joi.string().required(),

    // PRODUCTS_MS_HOST: joi.string().required(),
    // PRODUCTS_MS_PORT: joi.number().required(),

    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const validatedEnv = value as Envs;

export const envs = {
  port: validatedEnv.PORT,

  // productsMsHost: validatedEnv.PRODUCTS_MS_HOST,
  // productsMsPort: validatedEnv.PRODUCTS_MS_PORT,
  databaseUrl: validatedEnv.DATABASE_URL,
  natsServers: validatedEnv.NATS_SERVERS,

  jwtSecret: validatedEnv.JWT_SECRET,
};

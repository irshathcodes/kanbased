export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      DB_PASSWORD: string;
      DB_USER: string;
      DB_NAME: string;
      DB_PORT: string;
      DATABASE_URL: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      BE_ORIGIN: string;
      FE_ORIGIN: string;
      BE_PORT: string;
      RESEND_API_KEY: string;
      GITHUB_CLIENT_ID: string;
      GITHUB_CLIENT_SECRET: string;
      S3_ACCESS_KEY_ID: string;
      S3_SECRET_ACCESS_KEY: string;
      S3_BUCKET_NAME: string;
      S3_ENDPOINT: string;
      PUBLIC_IMAGE_DOMAIN: string;
    }
  }
}

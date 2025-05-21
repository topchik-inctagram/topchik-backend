export enum ProviderType {
  GOOGLE = 'GOOGLE',
  GIT_HUB = 'GIT_HUB',
}

export type ProviderInputType = {
  type: ProviderType;
  providerId: string;
  email: string;
};

export type Provider = {
  type: ProviderType;
  providerId: string;
  userId: number;
};

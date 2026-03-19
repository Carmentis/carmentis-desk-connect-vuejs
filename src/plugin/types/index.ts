import type { WalletRequestType } from '@cmts-dev/carmentis-sdk/client';

export type ConnectionStatus = 'unset' | 'ready' | 'connected' | 'disconnected';

export interface CarmentisPopupOptions {
  relayUrl: string;
  requestType: WalletRequestType.AUTH_BY_PUBLIC_KEY | WalletRequestType.DATA_APPROVAL;
  requestData?: any;
}

export interface CarmentisPluginOptions {
  relayUrl?: string;
}

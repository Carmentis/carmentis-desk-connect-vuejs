export type ConnectionStatus = 'unset' | 'ready' | 'connected' | 'disconnected';

export interface CarmentisPopupOptions {
  relayUrl: string;
  requestType: 'WALLET_REQUEST_AUTH_BY_PUBLIC_KEY' | 'WALLET_REQUEST_DATA_APPROVAL';
  requestData?: any;
}

export interface CarmentisPluginOptions {
  relayUrl?: string;
}

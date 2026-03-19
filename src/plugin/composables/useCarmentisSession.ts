import { ref, type Ref } from 'vue';
import { Initiator } from '@cmts-dev/carmentis-relay-client';
import type { ConnectionStatus } from '../types';

export interface CarmentisSession {
  initiator: Initiator | null;
  sessionId: Ref<string>;
  symKey: Ref<string>;
  connectionStatus: Ref<ConnectionStatus>;
  messages: Ref<any[]>;
  createSession: (relayUrl: string, onSessionReadyCallback?: () => void) => Promise<void>;
  sendRequest: (request: any) => void;
  getDeepLink: () => string;
}

export function useCarmentisSession(): CarmentisSession {
  const initiator = ref<Initiator | null>(null);
  const sessionId = ref('');
  const symKey = ref('');
  const connectionStatus = ref<ConnectionStatus>('unset');
  const messages = ref<any[]>([]);
  const relayUrl = ref('');

  const createSession = async (url: string, onSessionReadyCallback?: () => void) => {
    relayUrl.value = url;
    initiator.value = await Initiator.createSession(url);

    await initiator.value.init();
    connectionStatus.value = 'ready';
    sessionId.value = initiator.value.getSessionId();
    symKey.value = initiator.value.getKey();

    initiator.value.onMessage((message) => {
      messages.value.push(message);
    });

    initiator.value.onSessionReady(() => {
      connectionStatus.value = 'connected';
      if (onSessionReadyCallback) {
        onSessionReadyCallback();
      }
    });

    initiator.value.onClose(() => {
      connectionStatus.value = 'disconnected';
    });
  };

  const sendRequest = (request: any) => {
    if (initiator.value) {
      initiator.value.send(request);
    }
  };

  const getDeepLink = () => {
    return `cmts://connect/carmentis-relay?relay=${relayUrl.value}&sessionId=${sessionId.value}&symKey=${symKey.value}`;
  };


  return {
    // @ts-ignore
    initiator: initiator.value,
    sessionId,
    symKey,
    connectionStatus,
    messages,
    createSession,
    sendRequest,
    getDeepLink,
  };
}

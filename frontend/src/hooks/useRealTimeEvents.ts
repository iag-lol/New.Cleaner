import { useEffect, useRef } from 'react';

export type EventType = 'NEW_RECORD' | 'TASK_COMPLETED' | 'INSPECTION_CREATED' | 'CONFIG_UPDATED';

export interface SSEEvent {
  type: EventType;
  data: any;
  timestamp: string;
}

type EventCallback = (event: SSEEvent) => void;

export function useRealTimeEvents(onEvent?: EventCallback) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const subscribersRef = useRef<Map<EventType, Set<EventCallback>>>(new Map());

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const eventSource = new EventSource(`${apiUrl}/api/events/stream`);

    eventSource.onopen = () => {
      console.log('SSE connection established');
    };

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);

        if (parsedData.type === 'CONNECTED') {
          console.log('SSE connection confirmed:', parsedData.message);
          return;
        }

        const sseEvent = parsedData as SSEEvent;

        if (onEvent) {
          onEvent(sseEvent);
        }

        const typeSubscribers = subscribersRef.current.get(sseEvent.type);
        if (typeSubscribers) {
          typeSubscribers.forEach((callback) => callback(sseEvent));
        }
      } catch (error) {
        console.error('Error parsing SSE event:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      eventSource.close();

      setTimeout(() => {
        console.log('Attempting to reconnect SSE...');
        window.location.reload();
      }, 5000);
    };

    eventSourceRef.current = eventSource;

    return () => {
      console.log('Closing SSE connection');
      eventSource.close();
    };
  }, [onEvent]);

  const subscribe = (eventType: EventType, callback: EventCallback) => {
    if (!subscribersRef.current.has(eventType)) {
      subscribersRef.current.set(eventType, new Set());
    }
    subscribersRef.current.get(eventType)!.add(callback);

    return () => {
      const typeSubscribers = subscribersRef.current.get(eventType);
      if (typeSubscribers) {
        typeSubscribers.delete(callback);
      }
    };
  };

  return { subscribe };
}

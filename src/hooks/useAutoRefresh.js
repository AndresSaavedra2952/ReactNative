import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

export const useAutoRefresh = (callback, interval = 30000) => {
  const callbackRef = useRef(callback);
  const intervalRef = useRef(null);

  // Actualizar la referencia del callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // Función que ejecuta el callback actual
    const executeCallback = () => {
      callbackRef.current();
    };

    // Configurar el intervalo
    intervalRef.current = setInterval(executeCallback, interval);

    // Escuchar cambios en el estado de la app
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        // Ejecutar inmediatamente cuando la app vuelve a estar activa
        executeCallback();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Limpiar al desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      subscription?.remove();
    };
  }, [interval]);

  // Función para forzar actualización manual
  const forceRefresh = () => {
    callbackRef.current();
  };

  return { forceRefresh };
};

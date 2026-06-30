import { useCallback, useEffect, useRef, useState } from 'react';

export function useAsync(factory, dependencies = []) {
  const mountedRef = useRef(false);
  const [state, setState] = useState({ data: null, loading: true, error: null });

  const run = useCallback(async () => {
    if (mountedRef.current) {
      setState((current) => ({ ...current, loading: true, error: null }));
    }

    try {
      const data = await factory();
      if (mountedRef.current) setState({ data, loading: false, error: null });
    } catch (error) {
      if (mountedRef.current) setState({ data: null, loading: false, error: error.message });
    }
  }, dependencies);

  useEffect(() => {
    mountedRef.current = true;
    run();

    return () => {
      mountedRef.current = false;
    };
  }, [run]);

  return { ...state, reload: run };
}

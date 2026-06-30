import { useCallback, useEffect, useState } from 'react';

export function useAsync(factory, dependencies = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  const run = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const data = await factory();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error.message });
    }
  }, dependencies);

  useEffect(() => {
    run();
  }, [run]);

  return { ...state, reload: run };
}

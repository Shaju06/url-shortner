import { useCallback, useMemo, useState } from "react";

type UseFetchOptions = {
  [key: string]: any;
};

type UseFetchReturn<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  fn: (...args: any[]) => Promise<void>;
};

const useFetch = <T,>(
  cb: (options: any, ...args: any[]) => Promise<T>,
  options: UseFetchOptions = {}
): UseFetchReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const memoizedOptions = useMemo(() => options, [JSON.stringify(options)]);

  const fn = useCallback(
    async (...args: any[]): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        ("use server");
        const response = await cb(memoizedOptions, ...args);
        setData(response);
        setError(null);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [cb, memoizedOptions]
  );

  return { data, loading, error, fn };
};

export default useFetch;

import useSWR from 'swr';

interface ClientLogo {
  _id: string;
  name: string;
  logo: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useClientLogos(activeOnly: boolean = true) {
  const endpoint = activeOnly ? '/api/client-logos' : '/api/admin/client-logos';

  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: ClientLogo[] }>(
    endpoint,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 600000, // Cache for 10 minutes
    }
  );

  return {
    clientLogos: data?.data ?? [],
    isLoading,
    error,
    refetch: mutate,
  };
}

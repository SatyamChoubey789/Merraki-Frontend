'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { orderApi } from '@/lib/api/orders';
import type { OrderLookupParams } from '@/types/order.types';

export const ORDER_KEYS = {
  all: ['orders'] as const,
  lookup: (params: OrderLookupParams) => [...ORDER_KEYS.all, 'lookup', params] as const,
};

export function useOrderLookup(params: OrderLookupParams, enabled: boolean = false) {
  return useQuery({
    queryKey: ORDER_KEYS.lookup(params),
    queryFn: () => orderApi.lookup(params),
    enabled: enabled && !!(params.email || params.orderNumber),
    staleTime: 1000 * 30,
    retry: 1,
  });
}

export function useDownloadOrder() {
  return useMutation({
    mutationFn: async (orderNumber: string) => {
      const blob = await orderApi.downloadFile(orderNumber);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `merraki-order-${orderNumber}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
  });
}
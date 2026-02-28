import type { Metadata } from 'next';
import { OrderTrackingClient } from '@/components/sections/orderTracking/OrderTrackingClient';

export const metadata: Metadata = {
  title: 'Order Tracking',
  description: 'Track your Merraki Solutions order status and download your templates.',
};

export default function OrderTrackingPage() {
  return <OrderTrackingClient />;
}
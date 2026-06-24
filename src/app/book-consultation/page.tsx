import type { Metadata } from 'next';
import { BookConsultationClient } from '@/components/sections/consultation/BookConsultationClient';

export const metadata: Metadata = {
  title: 'Book a Free Consultation',
  description:
    'Book a free 30-minute strategy call with Parag or Khyati. Get a personalised financial roadmap for your business.',
};

export default function BookConsultationPage() {
  return <BookConsultationClient />;
}
import type { Metadata } from 'next';
import { TestResultsClient } from '@/components/sections/founderTest/TestResultsClient';

interface Props {
  params: { testNumber: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Your Financial Personality Report — ${params.testNumber}`,
    description:
      'View your personalised founder financial personality report from Merraki Solutions.',
    robots: { index: false, follow: false },
  };
}

export default function TestResultsPage({ params }: Props) {
  return <TestResultsClient testNumber={params.testNumber} />;
}
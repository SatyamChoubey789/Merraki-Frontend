import { PageWrapper } from '@/components/layout';

export default function PaymentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageWrapper noHeader noFooter>
      {children}
    </PageWrapper>
  );
}
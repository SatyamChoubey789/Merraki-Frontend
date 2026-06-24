import type { Metadata } from 'next';
import CareersClient from '@/components/sections/careers/Careerspageclient';

export const metadata: Metadata = {
    title: 'Careers',
    description: 'Explore exciting career opportunities at Merraki Solutions and join our dynamic team.',
};

export default function CareersPage() {
    return <CareersClient />;
}
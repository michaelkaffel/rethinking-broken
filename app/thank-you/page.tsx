import { Suspense } from 'react';
import ThankYouContent from './ThankYouContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    robots: { index: false, follow: false },
}

const LoadingFallback = () => (
    <main className='min-h-screen bg-bg-deep flex items-center justify-center'>
        <div className='text-center'>
            <div className='w-12 h-12 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4'/>
            <p className='font-lato text-text-muted'>Confirming your order...</p>
        </div>
    </main>
)

const ThankYouPage = () => (
    <Suspense fallback={<LoadingFallback />}>
        <ThankYouContent />
    </Suspense>
)

export default ThankYouPage;
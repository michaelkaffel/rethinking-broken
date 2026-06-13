import type { Metadata } from 'next';

export const metadata: Metadata = {
    robots: { index: false, follow: false },
}

const AdminLayout = ({ children }: { children: React.ReactNode }) => <>{children}</>

export default AdminLayout;
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/lib/toast-context';

export const metadata: Metadata = {
  title: 'CasePilot – AI-Powered Cybercrime Complaint Portal',
  description: 'File and track cybercrime complaints with AI assistance. Secure, fast, and official.',
  keywords: 'cybercrime, complaint, NCRP, UPI fraud, phishing, India police',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

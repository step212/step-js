import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import AuthProvider from '@/providers/AuthProvider'
import AntdProvider from '@/providers/AntdProvider'
import "@/app/globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }];
}

async function getMessages(locale: string) {
  try {
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(error);
    notFound();
  }
}

// Metadata can be generated dynamically per locale
export async function generateMetadata({ params }: LayoutProps) {
  const { locale } = await params;
  const messages = await getMessages(locale);

  return {
    title: messages.Index.title,
    description: messages.Index.description,
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body style={{ 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <AuthProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <AntdProvider>
              <Header />
              <main className="pb-16">
                {children}
              </main>
              <Footer />
            </AntdProvider>
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 
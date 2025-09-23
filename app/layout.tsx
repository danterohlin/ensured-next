import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { AppContextProvider } from './context/AppContext';
import { AIChatProvider } from './context/AIChatContext';
import { LogoutModalProvider } from './context/LogoutModalContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { SettingsProvider } from './context/SettingsContext';
import { ProfileProvider } from './context/ProfileContext';
import { ScrollProvider } from './context/ScrollContext';
import AIChatWrapper from './components/AIChatWrapper';
import LogoutModalWrapper from './components/LogoutModalWrapper';
import NotificationsWrapper from './components/NotificationsWrapper';
import SettingsWrapper from './components/SettingsWrapper';
import ProfileWrapper from './components/ProfileWrapper';
import Navbar from './components/Navbar';
import SideBar from './components/SideBar';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Ensured',
  description: 'Ensured NextJS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans`}>
        <AppContextProvider>
          <AIChatProvider>
            <LogoutModalProvider>
              <NotificationsProvider>
                <SettingsProvider>
                  <ProfileProvider>
                    <ScrollProvider>
                      <Navbar />
                      <SideBar />
                      {children}
                      <AIChatWrapper />
                      <LogoutModalWrapper />
                      <NotificationsWrapper />
                      <SettingsWrapper />
                      <ProfileWrapper />
                    </ScrollProvider>
                  </ProfileProvider>
                </SettingsProvider>
              </NotificationsProvider>
            </LogoutModalProvider>
          </AIChatProvider>
        </AppContextProvider>
      </body>
    </html>
  );
}

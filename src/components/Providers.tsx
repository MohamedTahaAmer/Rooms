'use client';

import { ThemeProvider } from '@/providers/theme-provider';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { FC, ReactNode } from 'react';

interface LayoutProps {
	children: ReactNode;
}

const queryClient = new QueryClient();

const Providers: FC<LayoutProps> = ({ children }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider>
				<ThemeProvider attribute='class' defaultTheme='light' enableSystem>
					{children}
				</ThemeProvider>
			</SessionProvider>
		</QueryClientProvider>
	);
};

export default Providers;

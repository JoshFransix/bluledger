"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { LazyMotion, domAnimation } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange={false}
      >
        <LazyMotion features={domAnimation} strict>
          {children}
        </LazyMotion>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}

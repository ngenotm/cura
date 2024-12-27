"use client";

import React from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface Props {
    children: React.ReactNode;
}

const client = new QueryClient();

const Providers = ({ children }: Props) => {
    return (
        <QueryClientProvider client={client} >
            <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
                {children}
            </ClerkProvider>
        </QueryClientProvider>
    );
};

export default Providers

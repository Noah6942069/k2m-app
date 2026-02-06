'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export function ProgressProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <ProgressBar
                height="4px"
                color="#7c3aed" // Violet-600 to match theme
                options={{ showSpinner: false }}
                shallowRouting
            />
        </>
    );
}

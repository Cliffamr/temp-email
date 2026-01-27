'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginForm() {
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    );

    const router = useRouter();

    // Redirect if login is successful (though the server action redirect should handle this)
    useEffect(() => {
        // Optional: add logic if needed
    }, []);

    return (
        <form action={formAction} className="card">
            <div style={{ padding: '10px' }}>
                <h2 style={{ marginBottom: '20px', fontSize: '1.25rem' }}>
                    Please log in to continue.
                </h2>
                <div>
                    <div className="input-group">
                        <label
                            className="input-label"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <div>
                            <input
                                className="input"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                required
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <label
                            className="input-label"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div>
                            <input
                                className="input"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>
                </div>
                <div
                    aria-live="polite"
                    aria-atomic="true"
                    style={{ minHeight: '32px' }}
                >
                    {errorMessage && (
                        <p className="alert alert-error" style={{ padding: '8px', fontSize: '0.875rem' }}>{errorMessage}</p>
                    )}
                </div>
                <Button className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} aria-disabled={isPending}>
                    Log in
                </Button>
            </div>
        </form>
    );
}

function Button({ children, className, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...rest}
            className={className}
        >
            {children}
        </button>
    );
}

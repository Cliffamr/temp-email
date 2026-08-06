import Header from '@/components/Header';
import TwoFactorAuthenticator from '@/components/TwoFactorAuthenticator';

export default async function TwoFactorAuthPage({ params }: { params: Promise<{ secret: string }> }) {
    const { secret } = await params;
    return (
        <main className="main-container">
            <Header />
            <div className="container" style={{ paddingTop: 40, paddingBottom: 40 }}>
                <TwoFactorAuthenticator defaultSecret={secret} />
            </div>
        </main>
    );
}

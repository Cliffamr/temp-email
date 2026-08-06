import Header from '@/components/Header';
import TwoFactorAuthenticator from '@/components/TwoFactorAuthenticator';

export default function TwoFactorAuthPage({ params }: { params: { secret: string } }) {
    return (
        <main className="main-container">
            <Header />
            <div className="container" style={{ paddingTop: 40, paddingBottom: 40 }}>
                <TwoFactorAuthenticator defaultSecret={params.secret} />
            </div>
        </main>
    );
}

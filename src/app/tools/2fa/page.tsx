import Header from '@/components/Header';
import TwoFactorAuthenticator from '@/components/TwoFactorAuthenticator';

export default function TwoFactorAuthPage() {
    return (
        <main className="main-container">
            <Header />
            <div className="container" style={{ paddingTop: 40, paddingBottom: 40 }}>
                <TwoFactorAuthenticator />
            </div>
        </main>
    );
}

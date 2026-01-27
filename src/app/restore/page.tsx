import Header from '@/components/Header';
import RestoreInboxForm from '@/components/RestoreInboxForm';

export default function RestorePage() {
    return (
        <>
            <Header />
            <main>
                <section className="page-hero">
                    <div className="container">
                        <h1>Restore Your Inbox</h1>
                        <p>
                            Enter your email address to restore access to your temporary inbox.
                        </p>
                    </div>
                </section>
                <section className="page-content">
                    <div className="container">
                        <RestoreInboxForm />
                    </div>
                </section>
            </main>
        </>
    );
}

import Header from '@/components/Header';
import CreateInboxForm from '@/components/CreateInboxForm';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero">
          <div className="container">
            <h1>Temporary Email Inbox</h1>
            <p>
              Create an instant disposable email address. No registration required.
              Perfect for testing, signups, and protecting your privacy.
            </p>
          </div>
        </section>
        <section className="page-content">
          <div className="container">
            <CreateInboxForm />
          </div>
        </section>
      </main>
    </>
  );
}

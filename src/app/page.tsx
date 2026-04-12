import Header from '@/components/Header';
import CreateInboxForm from '@/components/CreateInboxForm';
import { Mail, Shield, Clock, Zap, Globe, Lock, ChevronDown } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="page-hero">
          <div className="container">
            <div className="hero-badge">
              <Zap size={14} />
              <span>Instant & Free — No Registration Required</span>
            </div>
            <h1>Disposable Email<br />In Seconds</h1>
            <p>
              Create a temporary email address instantly. Receive emails in real-time.
              Perfect for signups, testing, and protecting your real inbox from spam.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="page-content" style={{ paddingTop: 0 }}>
          <div className="container">
            <CreateInboxForm />
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <h2 className="section-title">Why Use TempMail?</h2>
            <p className="section-subtitle">Everything you need for disposable email, nothing you don&apos;t.</p>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <Zap size={24} />
                </div>
                <h3>Instant Creation</h3>
                <p>Generate a working email address in one click. No forms, no waiting, no verification.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <Clock size={24} />
                </div>
                <h3>Auto-Expiring</h3>
                <p>Inboxes automatically expire after 24 hours. Your data is cleaned up, no traces left behind.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <Shield size={24} />
                </div>
                <h3>Privacy First</h3>
                <p>No personal information required. No tracking, no cookies, no logs of your activity.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <Mail size={24} />
                </div>
                <h3>Real-Time Inbox</h3>
                <p>Emails appear instantly with auto-refresh. View both HTML and plain text formats.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <Globe size={24} />
                </div>
                <h3>Multiple Domains</h3>
                <p>Choose from several domain options to create your temporary address. More domains, more flexibility.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <Lock size={24} />
                </div>
                <h3>Token Recovery</h3>
                <p>Get a unique access token to restore your inbox anytime, even on a different device or browser.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-it-works-section">
          <div className="container">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Three simple steps to a disposable email.</p>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>Create</h3>
                <p>Type an alias or click Random to generate one. Pick a domain and hit Create.</p>
              </div>
              <div className="step-connector">
                <div className="connector-line"></div>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3>Receive</h3>
                <p>Use the address for signups or testing. Incoming emails appear in real-time.</p>
              </div>
              <div className="step-connector">
                <div className="connector-line"></div>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3>Done</h3>
                <p>Read your emails, grab what you need, and walk away. The inbox auto-expires.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="container">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="faq-grid">
              <details className="faq-item">
                <summary>
                  <span>How long does an inbox last?</span>
                  <ChevronDown size={18} className="faq-chevron" />
                </summary>
                <p>Each inbox has a public access window of 24 hours from creation. After that, public access expires. You can still restore it using your access token.</p>
              </details>
              <details className="faq-item">
                <summary>
                  <span>Is it really free?</span>
                  <ChevronDown size={18} className="faq-chevron" />
                </summary>
                <p>Yes, completely free with no hidden fees, no ads, and no premium tiers. We run on efficient infrastructure to keep costs minimal.</p>
              </details>
              <details className="faq-item">
                <summary>
                  <span>Can I send emails from here?</span>
                  <ChevronDown size={18} className="faq-chevron" />
                </summary>
                <p>No. TempMail is a receive-only service. You can only receive incoming emails to your temporary address.</p>
              </details>
              <details className="faq-item">
                <summary>
                  <span>What is the access token for?</span>
                  <ChevronDown size={18} className="faq-chevron" />
                </summary>
                <p>The access token lets you restore access to your inbox from any device or browser. It&apos;s shown only once at creation — save it somewhere safe if you need it later.</p>
              </details>
              <details className="faq-item">
                <summary>
                  <span>Is my data private?</span>
                  <ChevronDown size={18} className="faq-chevron" />
                </summary>
                <p>We don&apos;t track, log, or sell any data. Emails are stored temporarily and deleted when the inbox expires. No personal information is collected.</p>
              </details>
              <details className="faq-item">
                <summary>
                  <span>Can I use this for important accounts?</span>
                  <ChevronDown size={18} className="faq-chevron" />
                </summary>
                <p>We strongly advise against it. Temporary emails are meant for testing, signups on untrusted sites, and avoiding spam. Don&apos;t use them for bank accounts or critical services.</p>
              </details>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="site-footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-brand">
                <div className="footer-logo">
                  <Mail size={20} />
                  <span>TempMail</span>
                </div>
                <p>Free disposable email service. No registration, no spam, no hassle.</p>
              </div>
              <div className="footer-links">
                <div className="footer-col">
                  <h4>Service</h4>
                  <a href="/">Create Inbox</a>
                  <a href="/restore">Restore Inbox</a>
                  <a href="/tools/2fa">2FA Tool</a>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} TempMail. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

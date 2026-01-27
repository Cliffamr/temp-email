import LoginForm from '@/components/admin/LoginForm';

export default function LoginPage() {
    return (
        <main className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <div style={{ width: '100%', maxWidth: '400px' }}>
                <div className="card" style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0' }}>Admin Portal</h1>
                </div>
                <LoginForm />
            </div>
        </main>
    );
}

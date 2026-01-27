import Header from '@/components/Header';
import MessageList from '@/components/MessageList';

interface PageProps {
    params: Promise<{
        inboxId: string;
    }>;
}

export default async function InboxPage({ params }: PageProps) {
    const { inboxId } = await params;

    return (
        <>
            <Header />
            <main>
                <section className="page-content">
                    <div className="container">
                        <MessageList inboxId={inboxId} />
                    </div>
                </section>
            </main>
        </>
    );
}

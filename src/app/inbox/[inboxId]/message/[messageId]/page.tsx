import Header from '@/components/Header';
import MessageDetail from '@/components/MessageDetail';

interface PageProps {
    params: Promise<{
        inboxId: string;
        messageId: string;
    }>;
}

export default async function MessagePage({ params }: PageProps) {
    const { inboxId, messageId } = await params;

    return (
        <>
            <Header />
            <main>
                <section className="page-content">
                    <div className="container">
                        <MessageDetail inboxId={inboxId} messageId={messageId} />
                    </div>
                </section>
            </main>
        </>
    );
}

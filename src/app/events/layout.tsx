import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";

export default function EventsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SiteHeader />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}

import Hero from "@/components/Hero";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import JoinCTA from "@/components/JoinCTA";
import CommunityPillars from "@/components/CommunityPillars";
import ContactSection from "@/components/ContactSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "techKoodaram | Grassroots Tech Community in South Tamil Nadu",
    description: "Welcome to techKoodaram, a grassroots tech community for developers, students, and tech enthusiasts in South Tamil Nadu. Learn, Build, and Share with us.",
    alternates: {
        canonical: "https://www.techkoodaram.in/",
    },
};

const Index = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SiteHeader />
            <main className="flex-grow">
                <Hero />
                <CommunityPillars />
                <ContactSection />
                <JoinCTA />
            </main>
            <Footer />
        </div>
    );
};

export default Index;

import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { BuildDaySlider } from "@/components/BuildDaySlider";

export const metadata: Metadata = {
    title: "techkoodaram Build Day | Collaborative Innovation",
    description: "Build real solutions in a single day at techkoodaram Build Day. Connect ideas with execution, form teams, and create something meaningful.",
    alternates: {
        canonical: "https://www.techkoodaram.in/techkoodaram-build-day",
    },
};

const BuildDayPage = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SiteHeader />
            <main className="flex-grow pt-24 pb-16">
                <article className="container mx-auto px-4 max-w-4xl">
                    <header className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                            techkoodaram Build Day
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            A collaborative innovation event where people come together to build real solutions in a single day.
                        </p>
                    </header>

                    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground">
                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4">What is techkoodaram Build Day?</h2>
                            <p>
                                Some participants arrive with ideas. Some arrive with skills but no specific idea.
                                By the end of the event, they form teams, build something meaningful, and present it.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <div className="p-4 bg-muted/50 rounded-lg border border-border/50 text-center">
                                    <span className="font-semibold block text-primary">Practical</span>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg border border-border/50 text-center">
                                    <span className="font-semibold block text-primary">Collaborative</span>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg border border-border/50 text-center">
                                    <span className="font-semibold block text-primary">Execution-focused</span>
                                </div>
                            </div>
                        </section>

                        <section className="mb-12 border-l-4 border-primary pl-6 py-2">
                            <h2 className="text-3xl font-bold mb-4">Why Build Day Exists</h2>
                            <p className="mb-4">Many people have ideas but no team, skills but no direction, or passion but no platform. Build Day connects ideas with execution.</p>
                            <p>It creates a space where:</p>
                            <ul className="list-disc ml-6 space-y-2">
                                <li>Builders meet thinkers</li>
                                <li>Designers meet problem-solvers</li>
                                <li>Developers meet domain experts</li>
                            </ul>
                            <p className="mt-4 font-medium italic">Instead of waiting for the “perfect time,” participants build now.</p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-6">How Build Day Operates</h2>
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-2xl font-bold mb-3 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
                                        Open Gathering
                                    </h3>
                                    <p className="mb-4">Participants join in two ways:</p>
                                    <ul className="list-disc ml-6 space-y-2">
                                        <li><strong>Idea Participants</strong> – Come with a problem or startup idea.</li>
                                        <li><strong>Skill Participants</strong> – Come with skills (development, design, marketing, research, operations, etc.) but no fixed idea.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold mb-3 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
                                        Team Formation
                                    </h3>
                                    <p>Idea holders pitch their problem statements briefly. Skill participants choose ideas that interest them. Teams are formed organically based on interest, complementary skills, and shared enthusiasm.</p>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold mb-3 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">3</span>
                                        Build Session
                                    </h3>
                                    <p className="mb-4">Teams work together to refine the problem, define target users, structure the solution, build a prototype, or prepare a presentation.</p>
                                    <p>Mentors and organizers move around to guide, question, and support throughout the session.</p>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold mb-3 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">4</span>
                                        Final Presentation & Q&A
                                    </h3>
                                    <p>Every team presents their solution followed by a structured Q&A session. The focus is not perfection — it is clarity and progress.</p>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold mb-3 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">5</span>
                                        Community Recognition
                                    </h3>
                                    <p>Selected projects and solutions are featured on techkoodaram’s LinkedIn and community platforms, giving participants visibility and recognition for their work.</p>
                                </div>
                            </div>
                        </section>

                        <BuildDaySlider />

                        <section className="mb-12 bg-accent/5 p-8 rounded-2xl border border-accent/20">
                            <h2 className="text-3xl font-bold mb-6">Who Should Participate?</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div className="p-3 bg-background rounded-lg shadow-sm border border-border/50">Students</div>
                                <div className="p-3 bg-background rounded-lg shadow-sm border border-border/50">Developers</div>
                                <div className="p-3 bg-background rounded-lg shadow-sm border border-border/50">Designers</div>
                                <div className="p-3 bg-background rounded-lg shadow-sm border border-border/50">Marketers</div>
                                <div className="p-3 bg-background rounded-lg shadow-sm border border-border/50">Founders</div>
                                <div className="p-3 bg-background rounded-lg shadow-sm border border-border/50">Professionals</div>
                                <div className="p-3 bg-background rounded-lg col-span-2 shadow-sm border border-border/50 font-medium">Anyone who wants to build</div>
                            </div>
                            <p className="mt-6 text-center italic font-medium">You don’t need a full startup plan. You just need the willingness to collaborate and create.</p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4">How Participants Benefit</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <h4 className="font-bold text-lg text-primary">Real Team Experience</h4>
                                    <p className="text-sm">Learn how to collaborate with diverse skill sets in a fast-paced environment.</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-lg text-primary">Practical Execution</h4>
                                    <p className="text-sm">Experience building under time constraints instead of just reading theory.</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-lg text-primary">Public Presentation Skills</h4>
                                    <p className="text-sm">Presenting and answering Q&A builds confidence and clarity of thought.</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-lg text-primary">Visibility & Network</h4>
                                    <p className="text-sm">Showcase work on LinkedIn and become part of a growing builder ecosystem.</p>
                                </div>
                            </div>
                        </section>

                        <section className="mb-12 text-center py-12 border-y border-border/50">
                            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                            <p className="max-w-2xl mx-auto text-xl">
                                To create a community where people don’t wait for opportunities — they build them.
                            </p>
                            <p className="mt-4 font-bold text-primary text-2xl">
                                techkoodaram Build Day is not just an event. It is a platform for action.
                            </p>
                        </section>

                        <section className="text-center mt-16">
                            <p className="mt-12 text-3xl font-bold text-accent">Let’s build together.</p>
                        </section>
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
};

export default BuildDayPage;

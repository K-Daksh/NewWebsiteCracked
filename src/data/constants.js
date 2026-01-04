// Shared event data to avoid duplication
export const EVENTS_DATA = [
    {
        id: 1,
        title: "CyberSec Summit",
        date: "Oct 2023",
        type: "Past",
        description: "An intensive deep dive into modern cybersecurity threats and defense mechanisms. Over 200 attendees participated in live CTF challenges and workshops led by industry experts.",
        images: [
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1614064641938-3e8529437060?auto=format&fit=crop&q=80&w=800"
        ]
    },
    {
        id: 2,
        title: "AI & The Future",
        date: "Dec 2023",
        type: "Past",
        description: "Exploring the frontiers of Generative AI. We hosted speakers from top tech firms to discuss the ethical implications and future capabilities of LLMs.",
        images: [
            "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1676299081847-5c46b54a4086?auto=format&fit=crop&q=80&w=800"
        ]
    },
    {
        id: 3,
        title: "React Native Workshop",
        date: "Jan 2024",
        type: "Past",
        description: "A hands-on coding bootcamp where students built a fully functional mobile app from scratch in under 6 hours. Code reviews and mentorship were provided live.",
        images: [
            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800"
        ]
    },
    {
        id: 5,
        title: "DevSprint 2024",
        date: "Live Now",
        type: "Ongoing",
        description: "A month-long open source contribution sprint. Join now to contribute to curated repositories and earn swag.",
        images: [
            "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&q=80&w=800", // Coding close up
            "https://images.unsplash.com/photo-1607799275518-d58665d099db?auto=format&fit=crop&q=80&w=800", // Matrix style code
            "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800"  // Code editor
        ]
    },
    {
        id: 4,
        title: "Cracked Hackathon v2",
        date: "Coming Soon",
        type: "Upcoming",
        description: "Our biggest event yet. 48 hours of coding, caffeine, and creation. Join us to build the next unicorn and win prizes worth over $5000.",
        images: [
            "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800"
        ]
    },
];

// Shared testimonials data
export const TESTIMONIALS_DATA = [
    {
        id: 1,
        name: "Priya Sharma",
        role: "Senior Frontend Developer",
        company: "TechNova",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
        text: "Cracked Digital transformed my career trajectory. The networking opportunities here are unmatched in Central India. I found my co-founder at the last summit."
    },
    {
        id: 2,
        name: "Rahul Verma",
        role: "CTO",
        company: "InnovateX",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
        text: "The quality of talent we hired through Cracked is exceptional. They aren't just coders; they are problem solvers. The 4% flat fee is just the icing on the cake."
    },
    {
        id: 3,
        name: "Ananya Singh",
        role: "Product Designer",
        company: "Freelance",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        text: "Finally, a community that understands design as much as code. The events are curated perfectly, and the mentorship I received was invaluable."
    }
];

// FAQ data
export const FAQ_DATA = [
    { q: "What is Cracked Digital?", a: "We are Central India's premier tech community connecting talent with opportunity through high-impact events, hackathons, and mentorship." },
    { q: "How can I join the community?", a: "It's simple. Click the 'Join Now' button to enter our exclusive WhatsApp network where all the action happens." },
    { q: "Is membership free?", a: "Yes, joining Cracked Digital as a community member is completely free for students, developers, and designers." },
    { q: "Do you offer job placements?", a: "We bridge the gap between talent and recruiters. Our 'Hire' portal helps top performers get placed with leading tech companies." },
    { q: "Who organizes these events?", a: "Events are managed by our Core Team of industry experts, senior developers, and passionate community leaders." },
    { q: "Can I become a Core Team member?", a: "We open recruitment drives periodically. Keep an eye on our community announcements if you want to lead." },
    { q: "Are events beginner-friendly?", a: "Absolutely. From 'Hello World' workshops to advanced cybersecurity summits, we have something for every skill level." },
    { q: "How do I sponsor an event?", a: "We love partners! Reach out through our 'Hire' page or contact us directly to discuss sponsorship packages." },
    { q: "Is this community only for coders?", a: "While code is our core, we welcome UI/UX designers, product managers, and founders. Tech needs everyone." },
    { q: "Where are you located?", a: "Our roots are in Indore, Madhya Pradesh, but we operate as a global-first digital collective." }
];

// Stats data
export const STATS_DATA = [
    { label: "Growth (100 days)", value: "700%", icon: "TrendingUp" },
    { label: "Active Members", value: "600+", icon: "Users" },
    { label: "Organic Reach", value: "20k+", icon: "Globe" },
    { label: "Core Members", value: "15+", icon: "Star" },
];

// Milestones data
export const MILESTONES_DATA = [
    { year: "Genesis", title: "Community Founded", desc: "Started with 5 developers in a coffee shop." },
    { year: "Growth", title: "Cyber Police MP Partnership", desc: "Official collaboration to train cadets in cybersecurity basics." },
    { year: "Expansion", title: "7+ College Partners", desc: "Established student chapters across the state." },
    { year: "Now", title: "3+ Strategic Sponsors", desc: "Fueling the next generation of hackathons." },
];

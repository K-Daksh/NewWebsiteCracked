/**
 * Seed Script
 * 
 * This script initializes the database with:
 * 1. An admin account (from .env or defaults)
 * 2. Sample data from the original constants.js
 * 
 * Usage: npm run seed
 */

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db, collections } from '../config/firebase.js';

// Sample data from original constants.js
const EVENTS_DATA = [
    {
        title: "CyberSec Summit",
        date: "Oct 2023",
        type: "Past",
        description: "An intensive deep dive into modern cybersecurity threats and defense mechanisms. Over 200 attendees participated in live CTF challenges and workshops led by industry experts.",
        images: [
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1614064641938-3e8529437060?auto=format&fit=crop&q=80&w=800"
        ],
        location: "Tech Park Auditorium, Indore",
        capacity: 250,
        order: 0,
    },
    {
        title: "AI & The Future",
        date: "Dec 2023",
        type: "Past",
        description: "Exploring the frontiers of Generative AI. We hosted speakers from top tech firms to discuss the ethical implications and future capabilities of LLMs.",
        images: [
            "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1676299081847-5c46b54a4086?auto=format&fit=crop&q=80&w=800"
        ],
        location: "Innovation Hub, Indore",
        capacity: 200,
        order: 1,
    },
    {
        title: "React Native Workshop",
        date: "Jan 2024",
        type: "Past",
        description: "A hands-on coding bootcamp where students built a fully functional mobile app from scratch in under 6 hours. Code reviews and mentorship were provided live.",
        images: [
            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800"
        ],
        location: "Co-working Space, Indore",
        capacity: 50,
        order: 2,
    },
    {
        title: "DevSprint 2024",
        date: "Live Now",
        type: "Ongoing",
        description: "A month-long open source contribution sprint. Join now to contribute to curated repositories and earn swag.",
        images: [
            "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1607799275518-d58665d099db?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800"
        ],
        location: "Online",
        order: 3,
    },
    {
        title: "Cracked Hackathon v2",
        date: "Coming Soon",
        type: "Upcoming",
        description: "Our biggest event yet. 48 hours of coding, caffeine, and creation. Join us to build the next unicorn and win prizes worth over $5000.",
        images: [
            "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800"
        ],
        location: "TBA",
        capacity: 500,
        registrationUrl: "https://crackeddigital.com/hackathon",
        order: 4,
    },
];

const STATS_DATA = [
    { label: "Growth (100 days)", value: "700%", numericValue: 700, suffix: "%", icon: "TrendingUp", order: 0 },
    { label: "Active Members", value: "600+", numericValue: 600, suffix: "+", icon: "Users", order: 1 },
    { label: "Organic Reach", value: "20k+", numericValue: 20, suffix: "k+", icon: "Globe", order: 2 },
    { label: "Core Members", value: "15+", numericValue: 15, suffix: "+", icon: "Star", order: 3 },
];

const TESTIMONIALS_DATA = [
    {
        name: "Priya Sharma",
        role: "Senior Frontend Developer",
        company: "TechNova",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
        text: "Cracked Digital transformed my career trajectory. The networking opportunities here are unmatched in Central India. I found my co-founder at the last summit.",
        order: 0,
        isActive: true,
    },
    {
        name: "Rahul Verma",
        role: "CTO",
        company: "InnovateX",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
        text: "The quality of talent we hired through Cracked is exceptional. They aren't just coders; they are problem solvers. The 4% flat fee is just the icing on the cake.",
        order: 1,
        isActive: true,
    },
    {
        name: "Ananya Singh",
        role: "Product Designer",
        company: "Freelance",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        text: "Finally, a community that understands design as much as code. The events are curated perfectly, and the mentorship I received was invaluable.",
        order: 2,
        isActive: true,
    },
];

const FAQ_DATA = [
    { question: "What is Cracked Digital?", answer: "We are Central India's premier tech community connecting talent with opportunity through high-impact events, hackathons, and mentorship.", order: 0, isActive: true },
    { question: "How can I join the community?", answer: "It's simple. Click the 'Join Now' button to enter our exclusive WhatsApp network where all the action happens.", order: 1, isActive: true },
    { question: "Is membership free?", answer: "Yes, joining Cracked Digital as a community member is completely free for students, developers, and designers.", order: 2, isActive: true },
    { question: "Do you offer job placements?", answer: "We bridge the gap between talent and recruiters. Our 'Hire' portal helps top performers get placed with leading tech companies.", order: 3, isActive: true },
    { question: "Who organizes these events?", answer: "Events are managed by our Core Team of industry experts, senior developers, and passionate community leaders.", order: 4, isActive: true },
    { question: "Can I become a Core Team member?", answer: "We open recruitment drives periodically. Keep an eye on our community announcements if you want to lead.", order: 5, isActive: true },
    { question: "Are events beginner-friendly?", answer: "Absolutely. From 'Hello World' workshops to advanced cybersecurity summits, we have something for every skill level.", order: 6, isActive: true },
    { question: "How do I sponsor an event?", answer: "We love partners! Reach out through our 'Hire' page or contact us directly to discuss sponsorship packages.", order: 7, isActive: true },
    { question: "Is this community only for coders?", answer: "While code is our core, we welcome UI/UX designers, product managers, and founders. Tech needs everyone.", order: 8, isActive: true },
    { question: "Where are you located?", answer: "Our roots are in Indore, Madhya Pradesh, but we operate as a global-first digital collective.", order: 9, isActive: true },
];

const MILESTONES_DATA = [
    { year: "Genesis", title: "Community Founded", description: "Started with 5 developers in a coffee shop.", order: 0 },
    { year: "Growth", title: "Cyber Police MP Partnership", description: "Official collaboration to train cadets in cybersecurity basics.", order: 1 },
    { year: "Expansion", title: "7+ College Partners", description: "Established student chapters across the state.", order: 2 },
    { year: "Now", title: "3+ Strategic Sponsors", description: "Fueling the next generation of hackathons.", order: 3 },
];

const TEAM_DATA = [
    {
        name: "SARAH CHEN",
        role: "CO-FOUNDER & CEO",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
        linkedin: "https://linkedin.com",
        email: "sarah@crackeddigital.com",
        order: 0
    },
    {
        name: "MICHAEL RODRIGUEZ",
        role: "CTO",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
        linkedin: "https://linkedin.com",
        email: "michael@crackeddigital.com",
        order: 1
    },
    {
        name: "EMILY JOHNSON",
        role: "HEAD OF DESIGN",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
        linkedin: "https://linkedin.com",
        email: "emily@crackeddigital.com",
        order: 2
    },
    {
        name: "DAVID PARK",
        role: "LEAD DEVELOPER",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
        linkedin: "https://linkedin.com",
        email: "david@crackeddigital.com",
        order: 3
    },
    {
        name: "PRIYA SHARMA",
        role: "MARKETING DIRECTOR",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
        linkedin: "https://linkedin.com",
        email: "priya@crackeddigital.com",
        order: 4
    },
    {
        name: "JAMES WILSON",
        role: "PRODUCT MANAGER",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
        linkedin: "https://linkedin.com",
        email: "james@crackeddigital.com",
        order: 5
    },
    {
        name: "SOPHIA MARTINEZ",
        role: "DATA SCIENTIST",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
        linkedin: "https://linkedin.com",
        email: "sophia@crackeddigital.com",
        order: 6
    },
    {
        name: "ALEX THOMPSON",
        role: "COMMUNITY LEAD",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
        linkedin: "https://linkedin.com",
        email: "alex@crackeddigital.com",
        order: 7
    },
    {
        name: "OLIVIA BROWN",
        role: "CONTENT STRATEGIST",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
        linkedin: "https://linkedin.com",
        email: "olivia@crackeddigital.com",
        order: 8
    },
    {
        name: "ETHAN DAVIS",
        role: "OPERATIONS MANAGER",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
        linkedin: "https://linkedin.com",
        email: "ethan@crackeddigital.com",
        order: 9
    }
];

const SETTINGS_DATA = {
    heroTagline: "Central India's Premier Community",
    heroTitle1: "Cracked",
    heroTitle2: "Digital.",
    heroDescription: "We are the fastest growing tech collective bridging the gap between talent and opportunity.",
    whatsappLink: "https://chat.whatsapp.com/your-link",
    instagramLink: "https://instagram.com/crackeddigital",
    linkedinLink: "https://linkedin.com/company/crackeddigital",
    email: "contact@crackeddigital.com",
    phone: "+91 1234567890",
    address: "Indore, Madhya Pradesh, India",
    footerTagline: "Central India's Premier Tech Community",
    joinCta: "Join Now",
};

async function seed() {
    console.log('🌱 Starting database seed...\n');

    try {
        // 1. Create admin account
        console.log('👤 Creating admin account...');
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@crackeddigital.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'CrackedAdmin2024!';

        // Check if admin already exists
        const existingAdmin = await collections.admins.where('email', '==', adminEmail).get();

        if (existingAdmin.empty) {
            const passwordHash = await bcrypt.hash(adminPassword, 12);
            await collections.admins.add({
                email: adminEmail,
                passwordHash,
                role: 'admin',
                createdAt: new Date(),
                lastLogin: null,
            });
            console.log(`   ✅ Admin created: ${adminEmail}`);
        } else {
            console.log(`   ⚠️  Admin already exists: ${adminEmail}`);
        }

        // 2. Seed Events
        console.log('\n📅 Seeding events...');
        const existingEvents = await collections.events.limit(1).get();
        if (existingEvents.empty) {
            for (const event of EVENTS_DATA) {
                await collections.events.add({
                    ...event,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }
            console.log(`   ✅ Added ${EVENTS_DATA.length} events`);
        } else {
            console.log('   ⚠️  Events already exist, skipping...');
        }

        // 3. Seed Stats
        console.log('\n📊 Seeding stats...');
        const existingStats = await collections.stats.limit(1).get();
        if (existingStats.empty) {
            for (const stat of STATS_DATA) {
                await collections.stats.add({
                    ...stat,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }
            console.log(`   ✅ Added ${STATS_DATA.length} stats`);
        } else {
            console.log('   ⚠️  Stats already exist, skipping...');
        }

        // 4. Seed Testimonials
        console.log('\n💬 Seeding testimonials...');
        const existingTestimonials = await collections.testimonials.limit(1).get();
        if (existingTestimonials.empty) {
            for (const testimonial of TESTIMONIALS_DATA) {
                await collections.testimonials.add({
                    ...testimonial,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }
            console.log(`   ✅ Added ${TESTIMONIALS_DATA.length} testimonials`);
        } else {
            console.log('   ⚠️  Testimonials already exist, skipping...');
        }

        // 5. Seed FAQs
        console.log('\n❓ Seeding FAQs...');
        const existingFaqs = await collections.faqs.limit(1).get();
        if (existingFaqs.empty) {
            for (const faq of FAQ_DATA) {
                await collections.faqs.add({
                    ...faq,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }
            console.log(`   ✅ Added ${FAQ_DATA.length} FAQs`);
        } else {
            console.log('   ⚠️  FAQs already exist, skipping...');
        }

        // 6. Seed Milestones
        console.log('\n🏆 Seeding milestones...');
        const existingMilestones = await collections.milestones.limit(1).get();
        if (existingMilestones.empty) {
            for (const milestone of MILESTONES_DATA) {
                await collections.milestones.add({
                    ...milestone,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }
            console.log(`   ✅ Added ${MILESTONES_DATA.length} milestones`);
        } else {
            console.log('   ⚠️  Milestones already exist, skipping...');
        }

        // 7. Seed Settings
        console.log('\n⚙️  Seeding settings...');
        const settingsDoc = await collections.settings.doc('site_settings').get();
        if (!settingsDoc.exists) {
            await collections.settings.doc('site_settings').set({
                ...SETTINGS_DATA,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log('   ✅ Settings created');
        } else {
            console.log('   ⚠️  Settings already exist, skipping...');
        }

        // 8. Seed Team Members
        console.log('\n👥 Seeding team members...');
        const existingTeam = await collections.team.limit(1).get();
        if (existingTeam.empty) {
            for (const member of TEAM_DATA) {
                await collections.team.add({
                    ...member,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }
            console.log(`   ✅ Added ${TEAM_DATA.length} team members`);
        } else {
            console.log('   ⚠️  Team members already exist, skipping...');
        }

        console.log('\n═══════════════════════════════════════════════════');
        console.log('✅ Database seeding completed successfully!');
        console.log('═══════════════════════════════════════════════════');
        console.log(`\n📧 Admin Login: ${adminEmail}`);
        console.log(`🔑 Password: ${adminPassword}`);
        console.log('\n⚠️  IMPORTANT: Change the admin password after first login!\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Seed error:', error);
        process.exit(1);
    }
}

seed();

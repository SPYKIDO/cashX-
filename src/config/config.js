// Centralized Configuration for Shotdevs Discord Bot
require('dotenv').config();

const CONFIG = {
    // Bot Information
    bot: {
        name: "Shotdevs AI Assistant",
        version: "1.0.0",
        description: "AI-powered Discord bot for Shotdevs custom Discord bots and web development services",
        activity: "Shotdevs AI",
        activityType: "PLAYING"
    },

    // Discord Configuration
    discord: {
        intents: [
            "Guilds",
            "GuildMessages", 
            "MessageContent",
            "DirectMessages"
        ],
        partials: ["Channel"],
        adminRoleId: "1284000550538448952",
        supportChannelId: process.env.SUPPORT_CHANNEL_ID,
        channels: {
            rules: "https://discord.com/channels/1105742461566988328/1154453096664158239",
            announcements: "https://discord.com/channels/1105742461566988328/1425753249490927627",
            support: "https://discord.com/channels/1105742461566988328/1426041902024757338",
            interoom: "https://discord.com/channels/1105742461566988328/1425486471288197221"
        }
    },

    // Company Information
    company: {
        name: "Shotdevs",
        description: "A custom discord bot and website development service for your community. We provide tailor-made bots to automate tasks, engage users, and enhance your server, plus modern, responsive websites and dashboards.",
        website: "https://shotdevs.live",
        contact: {
            email: "shotxd@shotdevs.live",
            discord: "https://discord.gg/wzfx5b8jHY"
        },
        support: {
            email: "shotxd@shotdevs.live",
            website: "https://shotdevs.live",
            discord: "https://discord.gg/wzfx5b8jHY",
            billing: {
                portal: "https://shotdevs.com/",
                ticket: "https://discord.com/channels/1105742461566988328/1426041902024757338"
            }
        },
        statusPage: "https://shotdevs.live/status",
        pricing: {
            discord_bot: {
                id: "discord_bot",
                title: "Discord Bot Development",
                description: "Custom Discord bots tailored to your community's needs with automation, engagement, and management features.",
                plans: [
                    { 
                        id: "basic", 
                        name: "Basic Bot", 
                        price: "₹40", 
                        billing: "one-time", 
                        description: "Ideal for small servers and essential tasks",
                        features: ["Basic Commands", "Welcome Messages", "Moderation Tools"],
                        ideal_for: ["Small communities", "Essential automation"]
                    },
                    { 
                        id: "advanced", 
                        name: "Advanced Bot", 
                        price: "₹80", 
                        billing: "one-time", 
                        description: "For growing communities needing custom features",
                        features: ["Custom Commands", "API Integrations", "Logging & Analytics"],
                        ideal_for: ["Growing communities", "Custom features"]
                    },
                    { 
                        id: "premium", 
                        name: "Premium Bot", 
                        price: "₹150", 
                        billing: "one-time", 
                        description: "A fully-loaded, custom solution",
                        features: ["All Advanced Features", "Custom Dashboard", "Priority Support"],
                        ideal_for: ["Large communities", "Complex requirements"]
                    }
                ]
            },
            website: {
                id: "website",
                title: "Website Development",
                description: "Modern, responsive websites and dashboards for your community or business.",
                plans: [
                    { 
                        id: "static", 
                        name: "Static Website", 
                        price: "₹50", 
                        billing: "one-time", 
                        description: "A professional, responsive online presence",
                        features: ["Up to 5 Pages", "Responsive Design", "Contact Form"],
                        ideal_for: ["Portfolio sites", "Small businesses"]
                    },
                    { 
                        id: "dynamic", 
                        name: "Dynamic Website", 
                        price: "₹150", 
                        billing: "one-time", 
                        description: "Interactive sites with a backend server",
                        features: ["All Static Features", "Database Integration", "Admin Panel"],
                        ideal_for: ["E-commerce", "Content management"]
                    },
                    { 
                        id: "fullstack", 
                        name: "Full Stack Application", 
                        price: "₹450", 
                        billing: "one-time", 
                        description: "A complete, feature-rich web platform",
                        features: ["All Dynamic Features", "User Authentication", "Custom API"],
                        ideal_for: ["Complex applications", "Multi-user platforms"]
                    }
                ]
            },
            custom: {
                id: "custom",
                title: "Custom Build",
                description: "Have a unique idea or specific requirements? We can build a custom solution tailored just for you.",
                plans: [
                    { 
                        id: "quote", 
                        name: "Request a Quote", 
                        price: "Contact Us", 
                        billing: "custom", 
                        description: "Custom solutions for unique requirements",
                        features: ["Complex Discord bots", "Full-featured web applications", "Custom integrations"],
                        ideal_for: ["Unique projects", "Specific requirements"]
                    }
                ]
            }
        },
        faq: {
            discord_bot: [
                { question: "How long does it take to develop a bot?", answer: "Basic bots typically take 1-3 days, advanced bots 3-7 days, and premium bots 1-2 weeks depending on complexity." },
                { question: "Do you provide ongoing support?", answer: "Yes! All our bots come with 30 days of free support, and we offer ongoing maintenance packages." }
            ],
            website: [
                { question: "What technologies do you use?", answer: "We use modern technologies like React, Node.js, Python, and various databases depending on your project requirements." },
                { question: "Do you provide hosting?", answer: "Yes, we can provide hosting solutions or help you deploy to your preferred platform." }
            ],
            general: [
                { question: "How do I get started?", answer: "Join our Discord server or contact us at hello@shotdevs.com to discuss your project requirements." },
                { question: "Do you offer custom solutions?", answer: "Absolutely! We specialize in custom Discord bots and web applications tailored to your specific needs." }
            ]
        }
    },

    // AI Configuration
    ai: {
        name: "Shotdevs AI",
        apiKey: process.env.api_key,
        model: "gemini-2.0-flash",
        apiUrl: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        features: {
            chat: {
                description: "AI-powered chat support",
                capabilities: [
                    "24/7 automated support for Discord bot and web development",
                    "Instant responses to development questions",
                    "Multi-language support",
                    "Context-aware conversations",
                    "Friendly and helpful interactions",
                    "Technical guidance and recommendations"
                ],
                personality: {
                    tone: "Friendly and approachable",
                    style: "Conversational and helpful",
                    traits: [
                        "Always positive and encouraging",
                        "Patient and understanding",
                        "Clear and concise explanations",
                        "Proactive in offering help"
                    ]
                }
            },
            moderation: {
                description: "AI-powered moderation",
                capabilities: [
                    "Automated content filtering",
                    "Spam detection",
                    "Language detection",
                    "Toxicity monitoring",
                    "Friendly rule enforcement"
                ]
            },
            analytics: {
                description: "AI-powered analytics",
                capabilities: [
                    "User behavior analysis",
                    "Trend detection",
                    "Support ticket categorization",
                    "Performance monitoring",
                    "User satisfaction tracking"
                ]
            }
        },
        limitations: [
            "Cannot access external websites or APIs",
            "Limited to information provided in training",
            "May occasionally provide incorrect information",
            "Cannot perform actions outside Discord"
        ],
        best_practices: [
            "Be specific in your questions",
            "Provide context when needed",
            "Use appropriate commands",
            "Report any incorrect responses"
        ]
    },

    // Response Templates
    responses: {
        greeting: [
            "Hello! 👋 How can I assist you with your Discord bot or web development needs today?",
            "Welcome! I'm here to help you with any questions about our custom Discord bots and web development services.",
            "Hi there! Need help with Discord bot development or web projects? I'm here to assist!"
        ],
        thinking: [
            ":zap:"
        ],
        error: [
            "I apologize, but I'm having trouble accessing that information right now.",
            "I'm sorry, I couldn't retrieve that specific information at the moment.",
            "I apologize for the inconvenience, but I'm unable to process that request right now."
        ],
        wrong_channel: [
            "I can only respond in the support channel. Please ask your question in the support channel.",
            "For support questions, please use our dedicated support channel.",
            "Please ask your question in the support channel for assistance."
        ],
        success: "Great! I'm happy to help! 😊",
        redirect: "I think you might find this more helpful: ",
        support: "Need more help? Feel free to create a support ticket! 🎫"
    },

    // Discord Server Rules
    rules: {
        points_to_remember: [
            "Respectful Interactions: Do not argue publicly. Take disputes to Direct Messages. Respectful debate is allowed, but do not demean others based on their beliefs or opinions.",
            "No Trolling or Controversy: Avoid trolling, promoting toxicity, or discussing controversial topics.",
            "Content Restrictions: Do not send suggestive content or harmful imagery.",
            "No Scamming: Scamming is strictly forbidden and will result in a ban.",
            "No Discrimination: Discrimination, hate speech, racism, sexism, or harassment will not be tolerated. Treat everyone with respect.",
            "Proper Staff Interaction: Do not ping staff members without a valid reason."
        ],
        project_guidelines: [
            "Project Discussions: Keep project discussions relevant and constructive.",
            "Code Sharing: When sharing code, ensure it's appropriate and not malicious.",
            "Respect Intellectual Property: Do not share copyrighted material or others' proprietary code."
        ],
        spamming: [
            "Spam Definition: Spam includes copy-pasted texts, false information, and dares. Sending 4 or more repeated messages is considered spam.",
            "Flooding: Do not flood channels with repetitive or irrelevant messages."
        ],
        support: [
            "Support Requests: Use appropriate channels for support requests and be specific about your needs.",
            "Patience: Our team will respond as quickly as possible. Please be patient during busy periods."
        ]
    },

    // Bot Features
    features: {
        memory: {
            maxMessages: 3,
            enabled: true
        },
        imageAnalysis: {
            enabled: true
        },
        slashCommands: {
            enabled: true
        },
        prefixCommands: {
            enabled: true,
            prefix: "-"
        },
        autoCleanup: {
            enabled: true,
            interval: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
        }
    },

    // Slash Commands Configuration
    slashCommands: [
        {
            name: 'events',
            description: 'List current events',
            options: []
        },
        {
            name: 'event',
            description: 'Get details for a specific event',
            options: [
                { name: 'id', type: 3, description: 'Event id', required: true }
            ]
        },
        {
            name: 'add-event',
            description: 'Add a special event (restricted to staff)',
            options: [
                { name: 'name', type: 3, description: 'Event name', required: true },
                { name: 'features', type: 3, description: 'Semicolon-separated features', required: false },
                { name: 'price', type: 3, description: 'Price (e.g., ₹10)', required: false },
                { name: 'start', type: 3, description: 'Starting date (YYYY-MM-DD)', required: false },
                { name: 'end', type: 3, description: 'Ending date (YYYY-MM-DD)', required: false },
                { name: 'extras', type: 3, description: 'Any extra notes', required: false }
            ]
        },
        {
            name: 'remove-event',
            description: 'Remove an event by id (restricted to staff)',
            options: [
                { name: 'id', type: 3, description: 'Event id', required: true }
            ]
        },
        {
            name: 'auto-delete-events',
            description: 'Run cleanup of expired events (restricted to staff)',
            options: []
        },
        {
            name: 'ping',
            description: 'Check bot latency',
            options: []
        },
        {
            name: 'services',
            description: 'View our Discord bot and web development services',
            options: []
        },
        {
            name: 'pricing',
            description: 'View our pricing for Discord bots and web development',
            options: []
        },
        {
            name: 'quote',
            description: 'Request a quote for custom Discord bot or web development',
            options: [
                { name: 'project_type', type: 3, description: 'Type of project (discord-bot, website, full-stack)', required: true },
                { name: 'description', type: 3, description: 'Brief description of your project requirements', required: true },
                { name: 'budget', type: 3, description: 'Your budget range (optional)', required: false }
            ]
        }
    ],

    // Prefix Commands
    prefixCommands: [
        'help', 'status', 'plans', 'ticket', 'ping', 'optimize', 'error', 'rules', 'channels', 'ai',
        'services', 'pricing', 'bot', 'web', 'add (event)', 'events', 'event', 'rm-event', 'auto-delete'
    ],

    // Utility Functions
    utils: {
        getRandomResponse(type) {
            const responses = CONFIG.responses[type];
            if (!responses || !Array.isArray(responses)) return "I'm here to help!";
            return responses[Math.floor(Math.random() * responses.length)];
        },

        getPlan(serviceId, planId) {
            const service = CONFIG.company.pricing[serviceId];
            if (!service || !Array.isArray(service.plans)) return null;
            return service.plans.find(p => p.id === planId || p.name.toLowerCase() === String(planId).toLowerCase()) || null;
        },

        listPlans(serviceId) {
            const service = CONFIG.company.pricing[serviceId];
            if (!service || !Array.isArray(service.plans)) return [];
            return service.plans.map(p => ({ id: p.id, name: p.name, price: p.price }));
        }
    }
};

module.exports = CONFIG;

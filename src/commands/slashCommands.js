const CONFIG = require('../config/config');
const { listEvents, addEvent, getEvent, deleteEvent, deleteExpiredEvents } = require('../data/events');
const AIHandler = require('../handlers/aiHandler');

class SlashCommandHandler {
    constructor() {
        this.aiHandler = new AIHandler();
    }

    /**
     * Handle all slash command interactions
     * @param {Object} interaction - Discord interaction object
     */
    async handleInteraction(interaction) {
        const { commandName } = interaction;

        try {
            switch (commandName) {
                case 'events':
                    await this.handleEventsCommand(interaction);
                    break;
                case 'event':
                    await this.handleEventCommand(interaction);
                    break;
                case 'add-event':
                    await this.handleAddEventCommand(interaction);
                    break;
                case 'remove-event':
                    await this.handleRemoveEventCommand(interaction);
                    break;
                case 'auto-delete-events':
                    await this.handleAutoDeleteEventsCommand(interaction);
                    break;
                case 'ping':
                    await this.handlePingCommand(interaction);
                    break;
                case 'services':
                    await this.handleServicesCommand(interaction);
                    break;
                case 'pricing':
                    await this.handlePricingCommand(interaction);
                    break;
                case 'quote':
                    await this.handleQuoteCommand(interaction);
                    break;
                default:
                    await interaction.reply({ content: 'Unknown command.', ephemeral: true });
            }
        } catch (error) {
            console.error(`Error handling slash command ${commandName}:`, error);
            await interaction.reply({ content: 'An error occurred while processing the command.', ephemeral: true });
        }
    }

    /**
     * Handle /events command
     */
    async handleEventsCommand(interaction) {
        const events = listEvents();
        if (!events.length) {
            await interaction.reply({ 
                content: `No upcoming events right now. Keep an eye on ${CONFIG.discord.channels.announcements} for updates!`, 
                ephemeral: true 
            });
            return;
        }

        const lines = events.map(e => {
            const when = e.start || 'TBD';
            const until = e.end ? ` until ${e.end}` : '';
            const price = e.price || 'Free';
            const features = Array.isArray(e.features) ? e.features.join(', ') : e.features || '';
            return `**${e.name}** — ${price} — ${when}${until}\nFeatures: ${features}`;
        });

        await interaction.reply({ 
            content: `Here are the current events:\n\n${lines.join('\n\n')}`, 
            ephemeral: false 
        });
    }

    /**
     * Handle /event command
     */
    async handleEventCommand(interaction) {
        const id = interaction.options.getString('id');
        const event = getEvent(id);
        if (!event) {
            await interaction.reply({ content: 'Event not found.', ephemeral: true });
            return;
        }
        
        const reply = `Event ${event.id}: ${event.name}\nFeatures: ${Array.isArray(event.features) ? event.features.join(', ') : event.features}\nPrice: ${event.price || 'Free'}\nStart: ${event.start || 'TBD'}\nEnd: ${event.end || 'TBD'}`;
        await interaction.reply({ content: reply, ephemeral: false });
    }

    /**
     * Handle /add-event command
     */
    async handleAddEventCommand(interaction) {
        const member = interaction.member;
        if (!member.roles.cache.has(CONFIG.discord.adminRoleId)) {
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return;
        }

        const name = interaction.options.getString('name');
        const featuresRaw = interaction.options.getString('features') || '';
        const price = interaction.options.getString('price') || '';
        const start = interaction.options.getString('start') || '';
        const end = interaction.options.getString('end') || '';
        const extras = interaction.options.getString('extras') || '';

        const features = featuresRaw ? featuresRaw.split(';').map(f => f.trim()).filter(Boolean) : [];
        const event = addEvent({ name, features, price, start, end, extras });

        // Generate AI announcement
        const aiMsg = await this.aiHandler.processMessage(`A new event was created: ${JSON.stringify(event)}. Create a short friendly announcement message.`);
        
        await interaction.reply({ 
            content: `Event created: ${event.name} (id: ${event.id})\n\nAnnouncement:\n${aiMsg}`, 
            ephemeral: false 
        });
    }

    /**
     * Handle /remove-event command
     */
    async handleRemoveEventCommand(interaction) {
        const member = interaction.member;
        if (!member.roles.cache.has(CONFIG.discord.adminRoleId)) {
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return;
        }

        let id = interaction.options.getString('id');
        if (!id) {
            const events = listEvents();
            if (!events || !events.length) {
                await interaction.reply({ content: 'No events available to remove.', ephemeral: true });
                return;
            }
            events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            id = events[0].id;
        }

        const deleted = deleteEvent(id);
        if (!deleted) {
            await interaction.reply({ content: 'Event not found or could not be deleted.', ephemeral: true });
            return;
        }
        
        await interaction.reply({ content: `Event ${id} deleted.`, ephemeral: false });
    }

    /**
     * Handle /auto-delete-events command
     */
    async handleAutoDeleteEventsCommand(interaction) {
        const member = interaction.member;
        if (!member.roles.cache.has(CONFIG.discord.adminRoleId)) {
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return;
        }

        const deletedIds = deleteExpiredEvents();
        if (!deletedIds || !deletedIds.length) {
            await interaction.reply({ content: 'No expired events found.', ephemeral: true });
            return;
        }
        
        await interaction.reply({ content: `Deleted expired events: ${deletedIds.join(', ')}`, ephemeral: false });
    }

    /**
     * Handle /ping command
     */
    async handlePingCommand(interaction) {
        await interaction.reply({ 
            content: `Pong! 🏓 Latency: ${interaction.client.ws.ping}ms`, 
            ephemeral: false 
        });
    }

    /**
     * Handle /services command
     */
    async handleServicesCommand(interaction) {
        const servicesEmbed = {
            title: "🚀 Shotdevs Services",
            description: "We offer comprehensive Discord bot and web development services",
            color: 0x00D4AA,
            fields: [
                {
                    name: "🤖 Discord Bot Development",
                    value: "Custom bots tailored to your community's needs\n• Basic Commands & Moderation\n• Welcome Systems & Auto-moderation\n• Music & Entertainment Features\n• Economy & Leveling Systems\n• Custom Integrations",
                    inline: false
                },
                {
                    name: "🌐 Web Development",
                    value: "Modern, responsive websites and applications\n• Static Websites\n• Dynamic Web Applications\n• Full-Stack Solutions\n• Database Integration\n• User Authentication & APIs",
                    inline: false
                },
                {
                    name: "💻 Custom Solutions",
                    value: "Unique projects tailored to your specific requirements\n• Complex Discord bots\n• Full-featured web applications\n• Custom integrations\n• Ongoing support & maintenance",
                    inline: false
                }
            ],
            footer: {
                text: "Contact us to discuss your project requirements!"
            }
        };

        await interaction.reply({ embeds: [servicesEmbed], ephemeral: false });
    }

    /**
     * Handle /pricing command
     */
    async handlePricingCommand(interaction) {
        const pricingEmbed = {
            title: "💰 Shotdevs Pricing",
            description: "Affordable, transparent pricing for every need",
            color: 0x00D4AA,
            fields: [
                {
                    name: "🤖 Discord Bot Development",
                    value: "**Basic Bot** - ₹40\n• Basic Commands\n• Welcome Messages\n• Moderation Tools\n\n**Advanced Bot** - ₹80\n• Custom Commands\n• API Integrations\n• Logging & Analytics\n\n**Premium Bot** - ₹150\n• All Advanced Features\n• Custom Dashboard\n• Priority Support",
                    inline: true
                },
                {
                    name: "🌐 Website Development",
                    value: "**Static Website** - ₹50\n• Up to 5 Pages\n• Responsive Design\n• Contact Form\n\n**Dynamic Website** - ₹150\n• All Static Features\n• Database Integration\n• Admin Panel\n\n**Full Stack App** - ₹450\n• All Dynamic Features\n• User Authentication\n• Custom API",
                    inline: true
                },
                {
                    name: "💡 Custom Projects",
                    value: "Have a unique idea? We can build custom solutions tailored just for you!\n\n**Request a Quote** for:\n• Complex Discord bots\n• Full-featured web applications\n• Custom integrations\n• Ongoing support packages",
                    inline: false
                }
            ],
            footer: {
                text: "All prices are one-time payments. Contact us for custom quotes!"
            }
        };

        await interaction.reply({ embeds: [pricingEmbed], ephemeral: false });
    }

    /**
     * Handle /quote command
     */
    async handleQuoteCommand(interaction) {
        const projectType = interaction.options.getString('project_type');
        const description = interaction.options.getString('description');
        const budget = interaction.options.getString('budget') || 'Not specified';

        const quoteEmbed = {
            title: "📋 Quote Request Received",
            description: "Thank you for your interest! We'll review your requirements and get back to you soon.",
            color: 0x00D4AA,
            fields: [
                {
                    name: "Project Type",
                    value: projectType,
                    inline: true
                },
                {
                    name: "Budget Range",
                    value: budget,
                    inline: true
                },
                {
                    name: "Description",
                    value: description,
                    inline: false
                }
            ],
            footer: {
                text: "We'll contact you within 24 hours to discuss your project!"
            }
        };

        // Generate AI response for the quote
        const aiResponse = await this.aiHandler.processMessage(
            `A new quote request was received:\nProject Type: ${projectType}\nDescription: ${description}\nBudget: ${budget}\n\nCreate a brief, friendly response acknowledging the request and mentioning next steps.`
        );

        await interaction.reply({ 
            content: aiResponse,
            embeds: [quoteEmbed], 
            ephemeral: false 
        });
    }
}

module.exports = SlashCommandHandler;
const AIHandler = require('./aiHandler');
const { addToMemory, getMemory, formatMemory, formatResponse } = require('../utils/messageHandler');
const { analyzeImage } = require('../utils/imageAnalyzer');
const CONFIG = require('../config/config');

class MessageHandler {
    constructor() {
        this.aiHandler = new AIHandler();
    }

    /**
     * Handle all incoming messages
     * @param {Object} message - Discord message object
     * @param {Object} client - Discord client object
     */
    async handleMessage(message, client) {
        // Check if message should be processed
        if (!this.aiHandler.shouldProcessMessage(message)) {
            return;
        }

        // Handle wrong channel mentions
        if (message.channelId !== CONFIG.discord.supportChannelId) {
            if (message.mentions.has(client.user)) {
                await message.reply(this.aiHandler.getRandomResponse('wrong_channel'));
            }
            return;
        }

        // Handle prefix commands
        if (message.content.startsWith(CONFIG.features.prefixCommands.prefix)) {
            await this.handlePrefixCommand(message, client);
            return;
        }

        // Check for image attachments
        const hasImage = message.attachments.size > 0 && 
            message.attachments.first().contentType?.startsWith('image/');

        // Extract message content (remove bot mention if present)
        const content = message.mentions.has(client.user) 
            ? message.content.replace(`<@${client.user.id}>`, '').trim()
            : message.content.trim();

        if (!content && !hasImage) {
            await message.reply(this.aiHandler.getRandomResponse('greeting'));
            return;
        }

        // Handle event queries with quick response
        if (this.isEventQuery(content)) {
            await this.handleEventQuery(message);
            return;
        }

        // Process with AI
        await this.processWithAI(message, content, hasImage);
    }

    /**
     * Handle prefix commands
     * @param {Object} message - Discord message object
     * @param {Object} client - Discord client object
     */
    async handlePrefixCommand(message, client) {
        const [command, ...args] = message.content.slice(1).split(' ');
        const response = await this.executeCommand(message, command, args, client);
        await message.reply(response);
    }

    /**
     * Execute a prefix command
     * @param {Object} message - Discord message object
     * @param {string} command - Command name
     * @param {Array} args - Command arguments
     * @param {Object} client - Discord client object
     * @returns {Promise<string>} Command response
     */
    async executeCommand(message, command, args, client) {
        const cmd = command.toLowerCase();

        switch (cmd) {
            case 'help':
                return `Available commands:\n${CONFIG.prefixCommands.map(cmd => `-${cmd}`).join(', ')}`;
            
            case 'status':
                return `You can view live status here: ${CONFIG.company.statusPage}`;
            
            case 'plans':
                return `View all our Discord bot and web development plans at: ${CONFIG.company.support.billing.portal}`;
            
            case 'ticket':
                return `To create a support ticket or discuss your project, please visit: ${CONFIG.company.support.billing.ticket}`;
            
            case 'services':
                return `We offer:\n🤖 **Discord Bot Development** - Custom bots from ₹40\n🌐 **Web Development** - Static sites from ₹50\n💻 **Full Stack Applications** - Complete solutions from ₹450\n\nContact us for custom projects!`;
            
            case 'pricing':
                return `**Discord Bots:**\n• Basic: ₹40 (Basic commands, welcome messages, moderation)\n• Advanced: ₹80 (Custom commands, API integrations, analytics)\n• Premium: ₹150 (All features, custom dashboard, priority support)\n\n**Web Development:**\n• Static: ₹50 (Up to 5 pages, responsive design)\n• Dynamic: ₹150 (Database integration, admin panel)\n• Full Stack: ₹450 (User auth, custom API)\n\nCustom projects available! Contact us for a quote.`;
            
            case 'ping':
                return `Pong! 🏓 Latency: ${client.ws.ping}ms`;
            
            case 'optimize':
                return `Here are some general optimization tips for Discord bots and web applications:\n1. Use efficient code and avoid memory leaks\n2. Implement proper error handling\n3. Use caching where appropriate\n4. Regular maintenance and updates\n5. Monitor performance metrics`;
            
            case 'error':
                return `Sorry, I don't have specific information about that error. Please create a support ticket for assistance with your Discord bot or web development issue.`;
            
            case 'bot':
                return `We specialize in custom Discord bot development! Our bots can include:\n• Moderation tools\n• Custom commands\n• Welcome systems\n• Music features\n• Economy systems\n• And much more!\n\nContact us to discuss your bot requirements!`;
            
            case 'web':
                return `We offer comprehensive web development services:\n• Static websites\n• Dynamic web applications\n• Full-stack solutions\n• Database integration\n• User authentication\n• Custom APIs\n\nLet's build something amazing together!`;
            
            case 'rules':
                return `Please review the rules: ${CONFIG.discord.channels.rules}`;
            
            case 'channels':
                return `Important channels: ${Object.values(CONFIG.discord.channels).join(', ')}`;
            
            case 'ai':
                // Forward to AI with context
                const prompt = args.join(' ') || message.content.replace(/^-/, '');
                const memoryText = formatMemory(getMemory(message.author.id));
                return await this.aiHandler.processMessage(prompt, { memoryText });
            
            default:
                return `Unknown command. Use -help to see available commands.`;
        }
    }

    /**
     * Check if message is asking about events
     * @param {string} content - Message content
     * @returns {boolean} Whether it's an event query
     */
    isEventQuery(content) {
        const lower = content.toLowerCase();
        return /\b(event|events|new event|new events|any events|any new events)\b/.test(lower);
    }

    /**
     * Handle event queries with quick response
     * @param {Object} message - Discord message object
     */
    async handleEventQuery(message) {
        const { listEvents } = require('../data/events');
        const events = listEvents();
        
        if (!events || events.length === 0) {
            await message.reply(`No upcoming events right now. Keep an eye on ${CONFIG.discord.channels.announcements} for updates!\nNeed more help? Create a support ticket here: ${CONFIG.company.support.billing.ticket}`);
            return;
        }

        // Format events list
        const lines = events.map(e => {
            const when = e.start || 'TBD';
            const until = e.end ? ` until ${e.end}` : '';
            const price = e.price || 'Free';
            const features = Array.isArray(e.features) ? e.features.join(', ') : e.features || '';
            return `**${e.name}** — ${price} — ${when}${until}\nFeatures: ${features}`;
        });
        
        const reply = `Here are the current events:\n\n${lines.join('\n\n')}\n\nFor details or to join, open a support ticket: ${CONFIG.company.support.billing.ticket}`;
        await message.reply(reply);
    }

    /**
     * Process message with AI
     * @param {Object} message - Discord message object
     * @param {string} content - Message content
     * @param {boolean} hasImage - Whether message has image
     */
    async processWithAI(message, content, hasImage) {
        // Add message to memory
        addToMemory(message.author.id, content);

        const thinkingMsg = await message.reply(this.aiHandler.getRandomResponse('thinking'));

        try {
            // Build context for AI
            const memoryText = formatMemory(getMemory(message.author.id));
            let imageAnalysis = '';
            
            if (hasImage) {
                const imageUrl = message.attachments.first().url;
                imageAnalysis = await analyzeImage(imageUrl, CONFIG.ai.apiKey);
            }

            // Process with AI
            const aiResponse = await this.aiHandler.processMessage(content, { 
                memoryText, 
                imageAnalysis 
            });

            if (!aiResponse) {
                await thinkingMsg.delete().catch(console.error);
                await message.reply(this.aiHandler.getRandomResponse('error'));
            } else {
                await thinkingMsg.delete().catch(console.error);
                const messages = formatResponse(aiResponse, CONFIG.company.support.billing.ticket);
                
                for (const msg of messages) {
                    await message.reply(msg);
                }
            }
        } catch (error) {
            console.error('Error processing message with AI:', error);
            await thinkingMsg.delete().catch(console.error);
            await message.reply(this.aiHandler.getRandomResponse('error'));
        }
    }
}

module.exports = MessageHandler;
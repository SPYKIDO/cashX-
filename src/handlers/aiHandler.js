const fetch = require('node-fetch');
const CONFIG = require('../config/config');
const { listEvents } = require('../data/events');
const { formatMemory } = require('../utils/messageHandler');

class AIHandler {
    constructor() {
        this.apiKey = CONFIG.ai.apiKey;
        this.apiUrl = CONFIG.ai.apiUrl;
    }

    /**
     * Process any message through AI and return a response
     * @param {string} userMessage - The user's message
     * @param {Object} options - Additional options
     * @param {string} options.memoryText - Previous conversation context
     * @param {string} options.imageAnalysis - Image analysis results
     * @returns {Promise<string>} AI response
     */
    async processMessage(userMessage, options = {}) {
        if (!this.apiKey) {
            return "I'm unable to access the AI service right now. Please try again later.";
        }

        // Quick shortcuts for common queries
        const lower = (userMessage || '').toLowerCase();
        if (lower.includes('status') || lower.includes('shotdevs stats') || 
            lower.includes('shotdevs status') || lower.includes('shot devs status')) {
            return `You can view live status here: ${CONFIG.company.statusPage}`;
        }

        const memoryText = options.memoryText || '';
        const imageAnalysis = options.imageAnalysis || '';

        // Include current events in the AI prompt
        let eventsText = 'No current events.';
        try {
            const events = listEvents();
            if (events && events.length) {
                eventsText = events.map(e => {
                    const when = e.start || 'TBD';
                    const until = e.end ? ` until ${e.end}` : '';
                    const price = e.price || 'Free';
                    const features = Array.isArray(e.features) ? e.features.join('; ') : (e.features || '');
                    return `${e.name} | ${price} | ${when}${until} | Features: ${features}`;
                }).join('\n');
            }
        } catch (err) {
            console.error('Could not read events for AI prompt:', err && err.message);
        }

        // Build comprehensive prompt
        const prompt = this.buildPrompt(userMessage, {
            memoryText,
            imageAnalysis,
            eventsText
        });

        try {
            const response = await this.callAI(prompt);
            return response;
        } catch (error) {
            console.error('AI processing error:', error);
            return CONFIG.utils.getRandomResponse('error');
        }
    }

    /**
     * Build the AI prompt with all context
     * @param {string} userMessage - User's message
     * @param {Object} context - Additional context
     * @returns {string} Formatted prompt
     */
    buildPrompt(userMessage, context) {
        const { memoryText, imageAnalysis, eventsText } = context;

        return `You are a friendly and helpful AI assistant for Shotdevs, a custom Discord bot and web development service company.

COMPANY INFORMATION:
${JSON.stringify(CONFIG.company, null, 2)}

AI CAPABILITIES AND PERSONALITY:
${JSON.stringify(CONFIG.ai, null, 2)}

DISCORD SERVER RULES (enforce and explain these):
${JSON.stringify(CONFIG.rules, null, 2)}

CURRENT EVENTS:
${eventsText}

PREVIOUS CONVERSATION CONTEXT:
${memoryText}

${imageAnalysis ? `IMAGE ANALYSIS:\n${imageAnalysis}\n\n` : ''}

USER MESSAGE: ${userMessage}

INSTRUCTIONS:
- Keep responses friendly, concise, and helpful
- Use emojis occasionally but not excessively
- Always end with an offer for further assistance
- If asked about events, reference the current events listed above
- If asked about pricing, reference the company pricing information
- If asked about support, direct them to the appropriate channels
- Be encouraging and positive in tone
- Focus on Discord bot development and web development services
- If you don't know something, admit it and suggest contacting support
- Emphasize our expertise in custom Discord bots and web development
- Mention our affordable pricing and reliable support

RESPONSE:`;
    }

    /**
     * Call the AI API
     * @param {string} prompt - The prompt to send
     * @returns {Promise<string>} AI response
     */
    async callAI(prompt) {
        try {
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            if (!response.ok) {
                console.error('AI request failed', response.status);
                return "I'm having trouble reaching the AI service. Please try again later.";
            }

            const json = await response.json();
            if (json.candidates && json.candidates.length > 0) {
                return json.candidates[0].content.parts[0].text;
            }
            return "I couldn't generate a helpful response. Please try rephrasing your question.";
        } catch (error) {
            console.error('AI API call error:', error);
            return "An error occurred while generating a response.";
        }
    }

    /**
     * Check if a message should be processed by AI
     * @param {Object} message - Discord message object
     * @returns {boolean} Whether to process with AI
     */
    shouldProcessMessage(message) {
        // Don't process bot messages
        if (message.author.bot) return false;

        // Check if message is in support channel or mentions the bot
        const isInSupportChannel = message.channelId === CONFIG.discord.supportChannelId;
        const mentionsBot = message.mentions.has(message.client.user);

        return isInSupportChannel || mentionsBot;
    }

    /**
     * Get a random response for a given type
     * @param {string} type - Response type (greeting, thinking, error, etc.)
     * @returns {string} Random response
     */
    getRandomResponse(type) {
        return CONFIG.utils.getRandomResponse(type);
    }
}

module.exports = AIHandler;
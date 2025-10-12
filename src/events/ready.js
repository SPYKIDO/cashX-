const CONFIG = require('../config/config');
const { deleteExpiredEvents } = require('../data/events');

class ReadyEventHandler {
    constructor(client) {
        this.client = client;
    }

    /**
     * Handle bot ready event
     */
    async handle() {
        console.log('BOT ONLINE');
        console.log('Logged in as: ' + this.client.user.tag);
        this.client.user.setActivity(CONFIG.bot.activity, { type: CONFIG.bot.activityType });

        // Register slash commands
        if (CONFIG.features.slashCommands.enabled) {
            await this.registerSlashCommands();
        }

        // Setup auto cleanup
        if (CONFIG.features.autoCleanup.enabled) {
            this.setupAutoCleanup();
        }
    }

    /**
     * Register slash commands for all guilds
     */
    async registerSlashCommands() {
        try {
            for (const [guildId, guild] of this.client.guilds.cache) {
                try {
                    for (const command of CONFIG.slashCommands) {
                        await guild.commands.create(command);
                    }
                    console.log(`Registered commands for guild ${guildId}`);
                } catch (err) {
                    console.error(`Failed to register commands for guild ${guildId}:`, err.message);
                }
            }
        } catch (err) {
            console.error('Error registering slash commands:', err);
        }
    }

    /**
     * Setup automatic cleanup of expired events
     */
    setupAutoCleanup() {
        setInterval(async () => {
            try {
                const deleted = deleteExpiredEvents();
                if (deleted && deleted.length) {
                    console.log('Auto-removed expired events:', deleted.join(', '));
                    
                    // Announce in support channel if available
                    const supportChannelId = CONFIG.discord.supportChannelId;
                    if (supportChannelId) {
                        const channel = await this.client.channels.fetch(supportChannelId).catch(() => null);
                        if (channel) {
                            await channel.send(`The following expired events were removed: ${deleted.join(', ')}`);
                        }
                    }
                }
            } catch (err) {
                console.error('Error running daily event cleanup:', err);
            }
        }, CONFIG.features.autoCleanup.interval);
    }
}

module.exports = ReadyEventHandler;
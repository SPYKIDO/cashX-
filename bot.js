require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');

// Import centralized configuration
const CONFIG = require('./src/config/config');

// Import handlers
const MessageHandler = require('./src/handlers/messageHandler');
const SlashCommandHandler = require('./src/commands/slashCommands');
const ReadyEventHandler = require('./src/events/ready');

// Initialize Discord client with configuration
const client = new Client({
    intents: CONFIG.discord.intents.map(intent => GatewayIntentBits[intent]),
    partials: CONFIG.discord.partials.map(partial => Partials[partial])
});

// Initialize handlers
const messageHandler = new MessageHandler();
const slashCommandHandler = new SlashCommandHandler();
const readyEventHandler = new ReadyEventHandler(client);

// Startup sequence
(async () => {
    console.log('🚀 Shotdevs AI Bot Starting...');
    console.log('📋 Loading configuration files...');
    console.log('🔗 Initializing Discord client...');
    console.log('⚙️ Checking features...');
    console.log('✨ Almost ready...');
    
    // Feature status
    const features = [
        { name: 'Command Handling', enabled: true },
        { name: 'Image Analysis', enabled: CONFIG.features.imageAnalysis.enabled },
        { name: 'Memory', enabled: CONFIG.features.memory.enabled },
        { name: 'AI Integration', enabled: true },
        { name: 'Slash Commands', enabled: CONFIG.features.slashCommands.enabled },
        { name: 'Auto Cleanup', enabled: CONFIG.features.autoCleanup.enabled }
    ];
    
    console.log('\nFeature Status:');
    for (const feat of features) {
        const status = feat.enabled ? 'ENABLED' : 'DISABLED';
        const symbol = feat.enabled ? '✔' : '✖';
        console.log(`  ${symbol} ${feat.name}: ${status}`);
    }
    
    console.log('\nSlash commands available:');
    CONFIG.slashCommands.forEach(cmd => {
        console.log(`  - /${cmd.name}`);
    });
    
    // Bot ready event
    client.once('ready', async () => {
        await readyEventHandler.handle();
    });

    // Message handler - all messages go through AI
    client.on('messageCreate', async message => {
        await messageHandler.handleMessage(message, client);
    });

    // Slash command handler
    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;
        await slashCommandHandler.handleInteraction(interaction);
    });

    // Login
    client.login(process.env.DISCORD_TOKEN);
})();

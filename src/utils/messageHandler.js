// Message memory system
const messageMemory = new Map();
const MAX_MEMORY = 3; // Store last 3 messages per user

function addToMemory(userId, message) {
    if (!messageMemory.has(userId)) {
        messageMemory.set(userId, []);
    }
    
    const userMemory = messageMemory.get(userId);
    userMemory.push({
        content: message,
        timestamp: Date.now()
    });
    
    // Keep only the last MAX_MEMORY messages
    if (userMemory.length > MAX_MEMORY) {
        userMemory.shift();
    }
}

function getMemory(userId) {
    return messageMemory.get(userId) || [];
}

function formatMemory(memory) {
    return memory.map((msg, index) => 
        `Previous message ${index + 1}: ${msg.content}`
    ).join('\n');
}

function splitMessage(text, maxLength = 1900) {
    const messages = [];
    while (text.length > 0) {
        let chunk = text.slice(0, maxLength);
        if (text.length > maxLength) {
            const lastSpace = chunk.lastIndexOf(' ');
            if (lastSpace !== -1) {
                chunk = chunk.slice(0, lastSpace);
                text = text.slice(lastSpace + 1);
            } else {
                text = text.slice(maxLength);
            }
        } else {
            text = '';
        }
        messages.push(chunk);
    }
    return messages;
}

function formatResponse(text, supportTicketUrl) {
    const supportFooter = `\n\nNeed more help? Create a support ticket here: ${supportTicketUrl} 🎫`;
    const messages = splitMessage(text);
    
    if (messages.length > 0) {
        messages[messages.length - 1] += supportFooter;
    }
    
    return messages;
}

function getRandomResponse(type, responseTemplates) {
    const responses = responseTemplates[type];
    return responses[Math.floor(Math.random() * responses.length)];
}

module.exports = {
    addToMemory,
    getMemory,
    formatMemory,
    splitMessage,
    formatResponse,
    getRandomResponse
}; 
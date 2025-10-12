const fs = require('fs');
const path = require('path');

const EVENTS_FILE = path.resolve(__dirname, '..', '..', 'data', 'events.json');

function readEvents() {
    try {
        const raw = fs.readFileSync(EVENTS_FILE, 'utf8');
        return JSON.parse(raw || '[]');
    } catch (e) {
        return [];
    }
}

function writeEvents(events) {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2), 'utf8');
}

function listEvents() {
    return readEvents();
}

function addEvent(event) {
    const events = readEvents();
    // basic id
    event.id = event.id || `evt_${Date.now()}`;
    event.createdAt = new Date().toISOString();
    events.push(event);
    writeEvents(events);
    return event;
}

function getEvent(id) {
    const events = readEvents();
    return events.find(e => e.id === id) || null;
}

function deleteEvent(id) {
    let events = readEvents();
    const before = events.length;
    events = events.filter(e => e.id !== id);
    writeEvents(events);
    return events.length < before;
}

function daysRemaining(event) {
    if (!event || !event.end) return null;
    const end = new Date(event.end);
    const now = new Date();
    const diff = end - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function deleteExpiredEvents() {
    const events = readEvents();
    const now = new Date();
    const toDelete = events.filter(e => e.end && new Date(e.end) < now).map(e => e.id);
    if (!toDelete.length) return [];
    let remaining = events.filter(e => !toDelete.includes(e.id));
    writeEvents(remaining);
    return toDelete;
}

module.exports = { listEvents, addEvent, getEvent, deleteEvent, daysRemaining, deleteExpiredEvents };

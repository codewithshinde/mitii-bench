const streams = new Map();

export function appendEvent(streamId, eventType, data) {
  if (!streams.has(streamId)) streams.set(streamId, []);
  const events = streams.get(streamId);
  const event = { version: events.length + 1, type: eventType, data, at: new Date().toISOString() };
  events.push(event);
  return event;
}

export function getStream(streamId) {
  return [...(streams.get(streamId) ?? [])];
}

export function replay(streamId, reducer, initial = {}) {
  return getStream(streamId).reduce((state, ev) => reducer(state, ev), initial);
}

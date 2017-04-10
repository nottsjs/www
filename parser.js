"use strict";
const fs = require("fs");
const Handlebars = require('handlebars');
const eventsData = JSON.parse(fs.readFileSync("events.json"));

const templateSource = String(fs.readFileSync("templates/template.html"));
const eventSource = String(fs.readFileSync("templates/event.html"));
const profileSource = String(fs.readFileSync("templates/profile.html"));
const nextEvent = eventsData.events[eventsData.nextEvent];

function eventMunge(event) {
  const eventDate = new Date(event.time);
  event.time = eventDate.toLocaleString("en-GB", {weekday: "long", year: "numeric", month: "long", day: "numeric"});
  if (event.description) {
    event.description = event.description.replace(/[<]p[>]/gm, `<p class="flow-text">`);
  }
  const monthName = eventDate.toLocaleString("en-GB", {year: "numeric", month: "long"});
  const eventStart = eventDate.toISOString().replace(/[-:]/, "");
  const endDate = eventDate;
  endDate.setHours(endDate.getHours() + 3);
  const eventEnd = eventDate.toISOString().replace(/[-:]/, "");
  event.calendar = `https://calendar.google.com/calendar/event?action=TEMPLATE&text=NottsJS+${monthName.replace(/\s/, "+")}&amp;dates=${eventStart}/${eventEnd}&amp;location=JH,+34a+Stoney+Street,+Nottingham,+NG1+1NB`;
  event.name = event.name.replace(/^[a-z]+\s*20[0-9]{2}\s*[-]?\s*/i, "");
  return event;
}

const events = Object.keys(eventsData.events).map((eventId) => {
  return eventsData.events[eventId];
}).filter((event) => {
  if (event.id !== nextEvent.id) {
    return true;
  }
  return false;
}).sort((eventA, eventB) => {
  if (eventA.time < eventB.time) {
    return 1;
  }
  if (eventA.time > eventB.time) {
    return -1;
  }
  return 0;
}).map((event) => {
  return eventMunge(event);
});

Handlebars.registerPartial("event", eventSource);
Handlebars.registerPartial("profile", profileSource);

const template = Handlebars.compile(templateSource);
const context = {
  nextEvent: eventMunge(nextEvent),
  events
};

fs.writeFile("output.html", template(context));

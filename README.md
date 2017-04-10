# NottsJS Website

This repo contains the NottsJS Website and assets.

https://nottsjs.org

[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/nottsjs/discuss)


## Building

```
npm install
```

Create a file `.auth_key` with just the key found at: https://secure.meetup.com/meetup_api/key/

To grab the latest changes from Meetup run:

```
npm run sync
```

This will create a directory of events at `/events` where you will need to create a matching speaker file: `events/{{event.id}}/speakers.json` for the event as Meetup doesn't have this.

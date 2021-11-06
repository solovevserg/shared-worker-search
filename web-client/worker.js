// let connected = false;
const LIMIT = 20;
const SEARCH_TEXT = Symbol('Search text');
async function main() {

  const usersPromise = fetch("/api/users").then(r => r.json()).then(users => users.map(user => {
    user[SEARCH_TEXT] = JSON.stringify(user).toLowerCase();
    return user;
  }));

  const cache = new Map()
  async function search(query) {
    query = query.toLowerCase();
    const users = await usersPromise;
    const searched = users.filter(user => user[SEARCH_TEXT].includes(query));
    return searched;
  }

  self.addEventListener(
    "connect",
    (e) => {
      e.source.addEventListener(
        "message",
        async (ev) => {
            // e.source.postMessage('hi');
            let {method, args: [query]} = ev.data;
            query = query.toLowerCase();
            if(cache.has(query)) {
                e.source.postMessage(cache.get(query));
                return;
            }    
            const searched = await search(query)
            const result = {count: searched.length, items: searched.slice(0, LIMIT)};
            e.source.postMessage(result);
            cache.set(query, {...result, cached: new Date()});
        
          // if (ev.data === "start") {
          //   if (connected === false) {
          //     e.source.postMessage('worker init');
          //     connected = true;
          //   } else {
          //     e.source.postMessage('worker already inited');
          //   }
          // }
        },
        false
      );
      e.source.start();
    },
    false
  );
}

main();

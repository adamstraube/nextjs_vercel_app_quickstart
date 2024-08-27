import { SessionStore, SessionStorePayload, initAuth0 } from '@auth0/nextjs-auth0';

class Store implements SessionStore {
  private store: KeyValueStoreLikeRedis<SessionStorePayload>;
  constructor() {
    // If you set the expiry accross the whole store use the session config,
    // for example `min(config.session.rollingDuration, config.session.absoluteDuration)`
    // the default is 24 hrs
    this.store = new KeyValueStoreLikeRedis();
  }
  async get(id) {
    const val = await this.store.get(id);
    return val;
  }
  async set(id, val) {
    // To set the expiry per item, use `val.header.exp` (in secs)
    const expiryMs = val.header.exp * 1000;
    // Example for Redis: redis.set(id, val, { pxat: expiryMs });
    await this.store.set(id, val);
  }
  async delete(id) {
    await this.store.delete(id);
  }
}

export default initAuth0({
  session: {
    store: new Store()
  }
});

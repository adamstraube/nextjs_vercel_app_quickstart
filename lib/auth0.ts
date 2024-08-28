import { Redis } from '@upstash/redis';
import { SessionStore, SessionStorePayload, initAuth0, Auth0Server } from '@auth0/nextjs-auth0';

class Store implements SessionStore {
  private redis: Redis;
  constructor() {
    // If you set the expiry accross the whole store use the session config,
    // for example `min(config.session.rollingDuration, config.session.absoluteDuration)`
    // the default is 24 hrs
    this.redis = Redis.fromEnv();
  }
  async get(id: string) {
    const val = await this.redis.get<SessionStorePayload>(id);
    return val;
  }
  async set(id: string, val: SessionStorePayload) {
    // To set the expiry per item, use `val.header.exp` (in secs)
    const expiryMs = val.header.exp * 1000;
    // Example for Redis: redis.set(id, val, { pxat: expiryMs });
    await this.redis.set(id, val);
  }
    async delete(id: string) {
    await this.redis.del(id);
  }
}

let _auth0: Auth0Server;

export default function auth0() {
  const config = {
    session: {
      store: new Store(),
    },
    backchannelLogout: true
  }

  if (!_auth0) {
    _auth0 = initAuth0(config);
  }
  return _auth0;
};

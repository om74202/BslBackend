// utils/mqttPublisher.js
const mqtt = require("mqtt");

const MQTT_URL = "mqtt://20.197.46.212:1883";
const MQTT_USERNAME = "opsight";
const MQTT_PASSWORD = "Devops@opsight1";

let client;
let isReady = false;
let connectPromise;

// keep track of active subscriptions so we can re-subscribe on reconnect
const activeSubs = new Map(); // topic -> { handler, options }

const createConnectPromise = () => {
  if (!client) return null;

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      client.off("connect", onConnect);
      client.off("error", onError);
    };

    const onConnect = () => {
      cleanup();
      resolve(client);
    };

    const onError = (err) => {
      cleanup();
      reject(err);
    };

    client.once("connect", onConnect);
    client.once("error", onError);
  });
};

const getMqttClient = () => {
  if (client) return client;

  client = mqtt.connect(MQTT_URL, {
    // username: MQTT_USERNAME,
    // password: MQTT_PASSWORD,
    reconnectPeriod: 2000,
    connectTimeout: 10_000,
    clean: true,
  });

  connectPromise = createConnectPromise();

  client.on("connect", () => {
    isReady = true;
    console.log("[MQTT] connected:", MQTT_URL);

    // ✅ re-subscribe on connect (clean session)
    for (const [topic, sub] of activeSubs.entries()) {
      client.subscribe(topic, sub.options || { qos: 1 }, (err) => {
        if (err) console.error(`[MQTT] resubscribe error (${topic}):`, err?.message || err);
        else console.log(`[MQTT] resubscribed: ${topic}`);
      });
    }
  });

  client.on("reconnect", () => {
    isReady = false;
    connectPromise = createConnectPromise();
    console.log("[MQTT] reconnecting...");
  });

  client.on("close", () => {
    isReady = false;
    connectPromise = createConnectPromise();
    console.log("[MQTT] connection closed");
  });

  client.on("error", (err) => {
    isReady = false;
    connectPromise = createConnectPromise();
    console.error("[MQTT] error:", err?.message || err);
  });

  return client;
};

const waitForConnection = async (timeoutMs = 5000) => {
  const c = getMqttClient();

  if (isReady && c?.connected) return c;
  if (!connectPromise) connectPromise = createConnectPromise();
  if (!connectPromise) return null;

  try {
    await Promise.race([
      connectPromise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("MQTT connection timeout")), timeoutMs)
      ),
    ]);
    return client;
  } catch (err) {
    console.error("[MQTT] failed to connect:", err?.message || err);
    return null;
  }
};

const publishToTopic = async (topic, payload, options = { qos: 1, retain: false }) => {
  try {
    if (!topic || payload === undefined || payload === null) return;

    const c = await waitForConnection();
    if (!c?.connected || !isReady) {
      console.warn(`[MQTT] not connected; skipped publish to ${topic}`);
      return;
    }

    const message =
      typeof payload === "string" || Buffer.isBuffer(payload) ? payload : JSON.stringify(payload);

    c.publish(topic, message, options, (err) => {
      if (err) console.error("[MQTT] publish error:", err?.message || err);
    });
	  console.log("published successfully")
  } catch (e) {
    console.error("[MQTT] publishToTopic failed:", e?.message || e);
  }
};

const publishMessage = async (topic, data, opts = {}) => {
  const {
    qos = 1,
    retain = false,
    timeoutMs = 5000,
    pretty = false,
    addMeta = false,
  } = opts;

  try {
    if (!topic) throw new Error("Topic is required");
    if (data === undefined || data === null) throw new Error("Data is required");

    const c = await waitForConnection(timeoutMs);
    if (!c?.connected || !isReady) {
      console.warn(`[MQTT] not connected; skipped publish to ${topic}`);
      return false;
    }

    const payloadToSend = addMeta ? { ts: new Date().toISOString(), data } : data;

    const message =
      typeof payloadToSend === "string" || Buffer.isBuffer(payloadToSend)
        ? payloadToSend
        : JSON.stringify(payloadToSend, null, pretty ? 2 : 0);

    return await new Promise((resolve) => {
      c.publish(topic, message, { qos, retain }, (err) => {
        if (err) {
          console.error("[MQTT] publish error:", err?.message || err);
          return resolve(false);
        }
        resolve(true);
      });
    });
  } catch (e) {
    console.error("[MQTT] publishMessage failed:", e?.message || e);
    return false;
  }
};

/**
 * ✅ General subscribe helper
 * @param {string} topic
 * @param {(payload:any, meta:{topic:string, packet:any, raw:Buffer})=>void} handler
 * @param {{qos?:number, json?:boolean, timeoutMs?:number}} opts
 * @returns {Promise<() => void>} unsubscribe function
 */
const subscribeToTopic = async (topic, handler, opts = {}) => {
  const { qos = 1, json = true, timeoutMs = 5000 } = opts;

  if (!topic) throw new Error("Topic is required");
  if (typeof handler !== "function") throw new Error("Handler must be a function");

  const c = await waitForConnection(timeoutMs);
  if (!c?.connected || !isReady) {
    throw new Error("MQTT not connected");
  }

  // store for reconnect resubscribe
  activeSubs.set(topic, { handler, options: { qos } });

  // one global message router (safe to attach once)
  if (!c.__hasGlobalMessageRouter) {
    c.__hasGlobalMessageRouter = true;

    c.on("message", (t, buf, packet) => {
      const sub = activeSubs.get(t);
      if (!sub?.handler) return;

      let payload = buf;
      if (json) {
        try {
          payload = JSON.parse(buf.toString("utf8"));
        } catch {
          payload = buf.toString("utf8");
        }
      } else {
        payload = buf;
      }

      try {
        sub.handler(payload, { topic: t, packet, raw: buf });
      } catch (e) {
        console.error(`[MQTT] subscriber handler error (${t}):`, e?.message || e);
      }
    });
  }

  // subscribe now
  await new Promise((resolve, reject) => {
    c.subscribe(topic, { qos }, (err) => {
      if (err) return reject(err);
      console.log(`[MQTT] subscribed: ${topic}`);
      resolve();
    });
  });

  // return unsubscribe
  return () => {
    try {
      activeSubs.delete(topic);
      if (c?.connected) {
        c.unsubscribe(topic, (err) => {
          if (err) console.error(`[MQTT] unsubscribe error (${topic}):`, err?.message || err);
          else console.log(`[MQTT] unsubscribed: ${topic}`);
        });
      }
    } catch (e) {
      console.error("[MQTT] unsubscribe failed:", e?.message || e);
    }
  };
};

const publishJphSet = async (payloadArray) => {
  if (!Array.isArray(payloadArray) || payloadArray.length === 0) return;
	console.log(payloadArray)
  await publishToTopic("jph.set", payloadArray);
};

const publishBrake = async (payload) => {
  await publishToTopic("brake", payload);
};

module.exports = {
  getMqttClient,
  publishMessage,
  publishJphSet,
  publishBrake,
  subscribeToTopic, // ✅ export
};


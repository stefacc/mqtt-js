# mqtt-js

Minimal **MQTT over TLS** client in Node.js with **client-certificate authentication**
(mutual TLS). Handy to quickly test a broker or a device certificate: it connects,
subscribes to a topic, publishes one test message and prints everything it receives.

Works with any MQTT broker on port 8883 with mTLS, for example
**AWS IoT Core** or **Mosquitto** with `require_certificate true`.

## Setup

```
npm install
cp .env.example .env
```

Put your certificates in `certs/` (or anywhere, and point the variables to them):

| Variable | Default | Content |
|---|---|---|
| `MQTT_HOST` | - (required) | broker host, e.g. `xxxxxxxx-ats.iot.eu-central-1.amazonaws.com` |
| `MQTT_PORT` | `8883` | |
| `MQTT_TOPIC` | `test/topic` | topic to subscribe and publish to |
| `MQTT_CLIENT_ID` | random | AWS IoT policies often require a specific client ID |
| `MQTT_KEY` | `./certs/client.key` | device private key |
| `MQTT_CERT` | `./certs/client.crt` | device certificate |
| `MQTT_CA` | `./certs/ca.pem` | CA that signed the broker certificate (AWS: Amazon Root CA 1) |
| `MQTT_INSECURE` | `false` | `true` skips the broker certificate check (self-signed tests only) |

## Run

```
npm start
```

```
[2026-01-01T10:00:00.000Z] connected to broker.example.com:8883 as mqtt-js-3f2a9c1b
[2026-01-01T10:00:00.050Z] subscribed to test/topic
[2026-01-01T10:00:00.060Z] published test message to test/topic
[2026-01-01T10:00:00.120Z] message received from test/topic: { message: 'hello from mqtt-js', ... }
```

It stays connected and logs any other message on the topic. Ctrl+C to quit.

`.env` and the certificate files are git-ignored: never commit private keys.

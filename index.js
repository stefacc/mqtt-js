// Minimal MQTT over TLS client with client-certificate authentication
// (works with AWS IoT Core, Mosquitto with require_certificate, ...).
// It subscribes to a topic, publishes one test message and logs everything it receives.
const mqtt = require('mqtt')
const fs = require('fs')
require('log-timestamp')
require('dotenv').config()

const env = (name, fallback) => {
  const v = process.env[name] ?? fallback
  if (v === undefined) {
    console.error(`Missing ${name} (see .env.example)`)
    process.exit(1)
  }
  return v
}

const HOST = env('MQTT_HOST')
const PORT = Number(env('MQTT_PORT', 8883))
const TOPIC = env('MQTT_TOPIC', 'test/topic')
const CLIENT_ID = env('MQTT_CLIENT_ID', 'mqtt-js-' + Math.random().toString(16).slice(2, 10))

const options = {
  host: HOST,
  port: PORT,
  protocol: 'mqtts',
  clientId: CLIENT_ID,
  key: fs.readFileSync(env('MQTT_KEY', './certs/client.key')),
  cert: fs.readFileSync(env('MQTT_CERT', './certs/client.crt')),
  ca: [fs.readFileSync(env('MQTT_CA', './certs/ca.pem'))],
  // verify the broker certificate unless explicitly disabled (only for self-signed tests)
  rejectUnauthorized: env('MQTT_INSECURE', 'false') !== 'true'
}

const client = mqtt.connect(options)

client.on('connect', () => {
  console.log(`connected to ${HOST}:${PORT} as ${CLIENT_ID}`)
  client.subscribe(TOPIC, (err) => {
    if (err) return console.log('subscribe error:', err)
    console.log('subscribed to', TOPIC)
    const payload = { message: 'hello from mqtt-js', timestamp: new Date().toISOString() }
    client.publish(TOPIC, JSON.stringify(payload), (errpub) => {
      if (errpub) console.log('publish error:', errpub)
      else console.log('published test message to', TOPIC)
    })
  })
})

client.on('message', (topic, message) => {
  const text = message.toString()
  let body
  try {
    body = JSON.parse(text)
  } catch {
    body = text
  }
  console.log('message received from', topic + ':', body)
})

client.on('reconnect', () => console.log('reconnecting...'))
client.on('close', () => console.log('connection closed'))
client.on('error', (err) => console.log('error:', err.message))

process.on('SIGINT', () => client.end(false, () => process.exit(0)))

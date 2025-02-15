import test from 'ava'
import secp from 'noise-handshake/dh.js'
import { secp256k1 } from 'noise-curve-tiny-secp'
import { createHandshake, generateChallenge } from '../src/crypto.js'
import { createAuth } from '../src/authenticator.js'
import { decodePayload } from '../src/messages.js'
import { PROLOGUE } from '../src/constants.js'
import bint from 'bint8array'

test('should throw an error if the remotePK length does not match the handshake curve', (t) => {
  const keypair = secp256k1.generateKeyPair()
  const { initiator } = createAuth(keypair)

  const remotePK = secp.generateKeyPair().publicKey
  const challenge = generateChallenge()

  t.throws(() => initiator.respond(remotePK, challenge), {
    message: 'Invalid publicKey size for curve: secp256k1',
    instanceOf: Error
  })
})

test('should not throw an error for valid remote public key', (t) => {
  const keypair = secp256k1.generateKeyPair()
  const { initiator } = createAuth(keypair)

  const remotePK = secp256k1.generateKeyPair().publicKey
  const challenge = generateChallenge()

  t.notThrows(() => initiator.respond(remotePK, challenge))
})

test('should correctly signt the challenge and return an encoded attestation', (t) => {
  const keypair = secp256k1.generateKeyPair()
  const { initiator } = createAuth(keypair)

  const remoteKeypair = secp256k1.generateKeyPair()
  const challenge = generateChallenge()

  const { attestation } = initiator.respond(remoteKeypair.publicKey, challenge)

  const handshake = createHandshake(false, remoteKeypair, {
    curve: secp256k1
  })

  handshake.initialise(PROLOGUE)
  const payload = handshake.recv(attestation)

  const { metadata, rest: decodedChallenge } = decodePayload(payload)

  t.deepEqual(
    bint.toString(decodedChallenge, 'hex'),
    bint.toString(challenge, 'hex')
  )
  t.deepEqual(new TextDecoder().decode(metadata), '')
})

test('should correctly sign the challenge and return an encoded attestation with metdata', (t) => {
  const keypair = secp256k1.generateKeyPair()
  const { initiator } = createAuth(keypair, { metadata: { foo: 'bar' } })

  const remoteKeypair = secp256k1.generateKeyPair()
  const challenge = generateChallenge()

  const { attestation } = initiator.respond(remoteKeypair.publicKey, challenge)

  const handshake = createHandshake(false, remoteKeypair, {
    curve: secp256k1
  })

  handshake.initialise(PROLOGUE)
  const payload = handshake.recv(attestation)

  const { metadata, rest: decodedChallenge } = decodePayload(payload)

  t.deepEqual(
    bint.toString(decodedChallenge, 'hex'),
    bint.toString(challenge, 'hex')
  )
  t.deepEqual(
    new TextDecoder().decode(metadata),
    JSON.stringify({ foo: 'bar' })
  )
})

test('should override global metadata for one time attestation', (t) => {
  const keypair = secp256k1.generateKeyPair()
  const { initiator } = createAuth(keypair, { metadata: { foo: 'bar' } })

  const remoteKeypair = secp256k1.generateKeyPair()
  const challenge = generateChallenge()

  const { attestation } = initiator.respond(
    remoteKeypair.publicKey,
    challenge,
    { foo: 'zar' }
  )

  const handshake = createHandshake(false, remoteKeypair, {
    curve: secp256k1
  })

  handshake.initialise(PROLOGUE)
  const payload = handshake.recv(attestation)

  const { metadata, rest: decodedChallenge } = decodePayload(payload)

  t.deepEqual(
    bint.toString(decodedChallenge, 'hex'),
    bint.toString(challenge, 'hex')
  )
  t.deepEqual(
    new TextDecoder().decode(metadata),
    JSON.stringify({ foo: 'zar' })
  )
})

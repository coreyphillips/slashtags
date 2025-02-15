import Noise from 'noise-handshake'
import { randomBytes } from 'crypto'
import { DEFAULT_CHALLENGE_LENGTH } from './constants.js'

/**
 * Generate new random challenge
 * @param {number} challengeLength
 * @returns {Buffer}
 */
export const generateChallenge = (challengeLength = DEFAULT_CHALLENGE_LENGTH) =>
  randomBytes(challengeLength)

/**
 * A wrapper around noise-handshake
 * @param {boolean} initiator
 * @param {KeyPair} staticKeypair
 * @param {{curve: Curve}} opts
 * @returns {Noise}
 */
export const createHandshake = (initiator, staticKeypair, opts) => {
  return new Noise('IK', initiator, staticKeypair, opts)
}

/**
 * Checks if a publicKey (and secretKey if available) is valid for a given elliptic curve
 * @param {Curve} curve
 * @param {Uint8Array} publicKey
 * @param {Uint8Array} [secretKey]
 * @throws {Error}
 * @returns {boolean}
 */
export const validateKeyForCurve = (curve, publicKey, secretKey) => {
  if (publicKey && curve.PKLEN !== publicKey.byteLength) {
    throw new Error('Invalid publicKey size for curve: ' + curve.ALG)
  }

  if (secretKey && curve.SKLEN !== secretKey.byteLength) {
    throw new Error('Invalid secretKey size for curve: ' + curve.ALG)
  }

  return true
}

/** @typedef {import('./interfaces').KeyPair} KeyPair */
/** @typedef {import('./interfaces').Curve} Curve */

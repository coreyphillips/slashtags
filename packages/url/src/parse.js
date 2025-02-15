import * as DocID from '@synonymdev/slashtags-docid'
import { base64url } from 'multiformats/bases/base64'
import * as json from 'multiformats/codecs/json'
import { varint } from '@synonymdev/slashtags-common'
import { PROTOCOL_NAME } from './constants/index.js'
import { validate } from './validate.js'

/**
 *
 * @param {string} url
 * @param {boolean} [throwInvalid=false] Throw error on invalid payload
 * @throws {Error} Throws erros for invalid payload
 * @returns {SlashtagsURL}
 */
export const parse = (url, throwInvalid = false) => {
  const parsed = new URL(url)
  const protocol = parsed.protocol.slice(0, parsed.protocol.length - 1)

  if (protocol !== PROTOCOL_NAME) {
    throw new Error('Protocol should be ' + PROTOCOL_NAME)
  }

  const isAction = !parsed.hostname

  const docIDStr = isAction ? parsed.pathname.split('/')[0] : parsed.hostname
  const docID = DocID.parse(docIDStr)

  /** @type {SlashtagsURL} */
  const slashtagsURL = { ...parsed, docID, protocol }

  if (isAction) {
    const baseFree = base64url.decode(parsed.hash.substring(1))
    const payload = json.decode(varint.split(baseFree)[1])

    const validated = validate(docIDStr, payload, throwInvalid)

    slashtagsURL.actionID = DocID.toString(docID)
    slashtagsURL.payload = validated
  }

  return slashtagsURL
}

/** @typedef {import('./interfaces').DocID} DocID */
/** @typedef {import('./interfaces').SlashtagsURL} SlashtagsURL */

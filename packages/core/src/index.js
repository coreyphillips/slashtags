import { JsonRpcEngine } from 'json-rpc-engine'
import { listen as _listen } from './rpc/server/index.js'
import { request as _request } from './rpc/client/index.js'

// TODO: Use Hyperswarm for browser server

/**
 * Create a new instance of Slashtags node.
 * @returns {SlashtagsAPI}
 */
export const Core = () => {
  const engine = new JsonRpcEngine()
  const openWebSockets = new Map()

  return {
    use: (middleware) => engine.push(middleware),
    listen: (server) => _listen(engine, server),
    request: (address, method, params) => _request(address, method, params, openWebSockets),
    _openWebSockets: openWebSockets
  }
}

/** @typedef {import ('./interfaces').SlashtagsAPI} SlashtagsAPI */
/** @typedef {import('json-rpc-engine').JsonRpcMiddleware<any,any>} JsonRpcMiddleware */
/** @typedef {import('isomorphic-ws').Server} WebsocketServer */

interface ShouleBeObjectResult {
  res: boolean;
  msg?: string;
}

interface GetParameterErrorOption {
  correct: string;
  wrong: any;
}

function upperCaseFirstLetter (string: string): string {
  return string.replace(/^./, match => match.toUpperCase())
}

export function getParameterError ({ correct, wrong }: GetParameterErrorOption): string {
  const parameter = 'parameter'
  const errorType = upperCaseFirstLetter(wrong === null ? 'Null' : typeof wrong)
  return `fail parameter error: ${parameter} should be ${correct} instead of ${errorType}`
}

export function shouleBeObject (target: unknown): ShouleBeObjectResult {
  if (target && typeof target === 'object') return { res: true }
  return {
    res: false,
    msg: getParameterError({
      correct: 'Object',
      wrong: target
    })
  }
}

export function successHandler (success?: (res: Taro.General.CallbackResult) => void, complete?: (res: Taro.General.CallbackResult) => void) {
  return function (res: Taro.General.CallbackResult): Promise<any> {
    success && success(res)
    complete && complete(res)
    return Promise.resolve(res)
  }
}

export function errorHandler (fail?: (res: Taro.General.CallbackResult) => void, complete?: (res: Taro.General.CallbackResult) => void) {
  return function (res: Taro.General.CallbackResult): Promise<any> {
    fail && fail(res)
    complete && complete(res)
    return Promise.reject(res)
  }
}

/**
 * RegExps.
 * A URL must match #1 and then at least one of #2/#3.
 * Use two levels of REs to avoid REDOS.
 */

const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/

const localhostDomainRE = /^localhost[:?\d]*(?:[^:?\d]\S*)?$/
const nonLocalhostDomainRE = /^[^\s.]+\.\S{2,}$/

/**
 * Loosely validate a URL `string`.
 *
 * @param {String} string
 * @return {Boolean}
 */
export function isUrl (string: string): boolean {
  if (typeof string !== 'string') {
    return false
  }

  const match = string.match(protocolAndDomainRE)
  if (!match) {
    return false
  }

  const everythingAfterProtocol = match[1]
  if (!everythingAfterProtocol) {
    return false
  }

  if (localhostDomainRE.test(everythingAfterProtocol) ||
    nonLocalhostDomainRE.test(everythingAfterProtocol)) {
    return true
  }

  return false
}

export * from './callbackManager'

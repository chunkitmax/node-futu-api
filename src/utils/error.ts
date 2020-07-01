export class ParameterError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ParameterError"
  }
}

export class SystemError extends Error {
  constructor(message: string, err?: Error) {
    super(`${message} ${err? `(Error: ${err.message})` : ''}`)
    this.name = "SystemError"
    this.stack = err && err.stack
  }
}

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "TimeoutError"
  }
}

export class FutuError extends Error {
  constructor(message: string, err?: Error) {
    super(`${message} ${err? `(Error: ${err.message})` : ''}`)
    this.name = "FutuError"
  }
}
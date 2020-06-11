
export default class InitPromise {

  private p: Promise<void>
  private resolveFunc: undefined|((value?: void | PromiseLike<void> | undefined) => void)
  private rejectFunc: undefined|((value?: void | PromiseLike<void> | undefined) => void)

  constructor() {
    this.p = this.reset()
  }

  public get isReady(): Promise<void> {
    return this.p
  }

  public async resolve() {
    if (this.resolveFunc) {
      this.resolveFunc()
    }
    if (this.p) await this.p
  }

  public async reject() {
    if (this.rejectFunc) {
      this.rejectFunc()
    }
    if (this.p) await this.p
  }

  public async reset(): Promise<void> {
    if (this.rejectFunc) {
      this.rejectFunc()
    }
    if (this.p) {
      try {
        await this.p
      } catch (err) {}
    }
    return this.p = new Promise((resolve, reject) => {
      this.resolveFunc = resolve
      this.rejectFunc = reject
    })
  }

}

export default class InitPromise {

  private isInit: boolean = false
  private resolveFunc: ((_any?: any) => void)[] = []
  private rejectFunc: ((_any?: any) => void)[] = []

  public reset() {
    this.isInit = false
    try {
      this.rejectFunc.forEach(reject => reject('reset'))
    } catch {}
    this.resolveFunc = []
    this.rejectFunc = []
  }

  public get isReady(): Promise<void> {
    if (this.isInit) return Promise.resolve()
    else return new Promise((resolve, reject) => {
      let timeoutTimer = setTimeout(() => reject('timeout'), 5000)
      this.resolveFunc.push(() => {
        clearTimeout(timeoutTimer)
        resolve()
      })
      this.rejectFunc.push((any: any) => reject(any))
    })
  }

  public async resolve() {
    this.isInit = true
    try {
      this.resolveFunc.forEach(resolve => resolve())
    } catch {}
    this.resolveFunc = []
    this.rejectFunc = []
  }

  public async reject(_any: any) {
    this.isInit = false
    try {
      this.rejectFunc.forEach(reject => reject(_any))
    } catch {}
    this.resolveFunc = []
    this.rejectFunc = []
  }

}
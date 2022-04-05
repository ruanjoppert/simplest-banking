export class DeferredPromise {
  private promise: Promise<any>

  public resolve!: any
  public reject!: any
  public then: any
  public catch: any

  constructor () {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })

    this.then = this.promise.then.bind(this.promise)
    this.catch = this.promise.catch.bind(this.promise)
  }
}

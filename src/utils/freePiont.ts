/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-23 14:09:21
 * @LastEditTime: 2019-08-23 14:20:27
 * @LastEditors: Please set LastEditors
 */
interface IFunc {
  (...arg:any[]): any;
}
const R = {
  currying(fn:IFunc, ...args:any[]) {
    if (args.length >= fn.length) {
      return fn(...args)
    }
    return (...args2:any) => {
      return this.currying(fn, ...args, ...args2)
    }
  },
  compose(...args:any[]) {
    return (result:any) => {
      return args.reduceRight((result, fn) => {
        return fn(result)
      }, result)
    }
  },
  pipe(...args:any[]) {
    return (result:any) => {
      return args.reduce((result, fn) => {
        return fn(result)
      }, result)
    }
  }

}
export default R

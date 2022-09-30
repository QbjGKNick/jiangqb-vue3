export class ReactiveEffect {
  constructor(public fn: any) {} // 你传递的fn我会默认帮你放到this上，等价于如下写法
  // public fn: any
  // constructor(fn: any) {
  //    this.fn = fn
  // }
  run() {
    this.fn();
  }
}

export function effect(fn: any) {
  // 将用户传递函数变成响应式的 effect

  const _effect = new ReactiveEffect(fn);
  _effect.run();
}

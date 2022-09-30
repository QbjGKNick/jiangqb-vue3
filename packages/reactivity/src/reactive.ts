import { isObject } from "@jiangqb-vue3/shared";

const reactiveMap = new WeakMap(); // key必须是对象，弱引用
// v8的垃圾回收机制  标记删除  引用计数

const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}
export function reactive(target: any) {
  if (!isObject(target)) return target;

  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }

  const existing = reactiveMap.get(target);
  if (existing) return existing;
  // es6 中的proxy
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      if (key === ReactiveFlags.IS_REACTIVE) {
        return true;
      }
      console.log("这里可以记录这个属性使用了哪个effect");
      return Reflect.get(target, key, receiver);
      // return target[key];
    },
    set(target, key, receiver, value) {
      console.log("这里可以通知effect重新执行");
      // target[key] = value;
      return Reflect.set(target, key, value, receiver);
    },
  });
  reactiveMap.set(target, proxy);
  return proxy;
}
// 一个对象已经被代理过了，就不要再次被代理了

// 使用 proxy 要搭配 Reflect 来使用 obj -> proxy
// 下次你传入的是proxy，我去这个对象上取值可以命中proxy的get方法

let person = {
  name: "nick",
  get aliasName() {
    // 属性访问器
    return this.name + "jg";
  },
};

/*
const proxy = new Proxy(person, {
  get(target, key, receiver) {
    console.log("这里可以记录这个属性使用了哪个effect");
    console.log(key);
    // return target[key];
    return Reflect.get(target, key, receiver); // 将person中get里的this指向receiver而非person
  },
  set(target, key, receiver, value) {
    console.log("这里可以通知effect重新执行");
    // target[key] = value;
    return Reflect.set(target, key, value, receiver);
  },
});

// 原因是因为我去 proxy上去取aliasName，这个时候会执行get方法，但是aliasName 是基于name属性 原则上应该去name 上取值
// 然而this.name 并没有触发proxy的get，也就意味着稍后我们修改name属性的时候，就不会导致页面重新渲染
proxy.aliasName;

*/

/*
 * 轻量版响应式系统 (仅支持对象、数组基本场景)
 */
export type Dep = Set<ReactiveEffect>;

export let activeEffect: ReactiveEffect | null = null;
const targetMap = new WeakMap<object, Map<PropertyKey, Dep>>();

export class ReactiveEffect {
  private _fn: () => any;
  constructor(fn: () => any) {
    this._fn = fn;
  }
  run() {
    const prev = activeEffect;
    activeEffect = this;
    try {
      return this._fn();
    } finally {
      activeEffect = prev;
    }
  }
}

function track(target: object, key: PropertyKey) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  dep.add(activeEffect);
}

function trigger(target: object, key: PropertyKey) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const dep = depsMap.get(key);
  if (!dep) return;
  dep.forEach((effect) => effect.run());
}

export function reactive<T extends object>(target: T): T {
  return new Proxy(target, {
    get(t, key, receiver) {
      const res = Reflect.get(t, key, receiver);
      track(t, key);
      return res;
    },
    set(t, key, value, receiver) {
      const oldVal = (t as any)[key];
      const result = Reflect.set(t, key, value, receiver);
      if (oldVal !== value) {
        trigger(t, key);
      }
      return result;
    },
  });
}

export function effect(fn: () => any) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
  return _effect.run.bind(_effect);
}

export function computed<T>(getter: () => T) {
  let cached: T;
  let dirty = true;
  const runner = effect(() => {
    cached = getter();
  });
  return {
    get value() {
      if (dirty) {
        runner();
        dirty = false;
      }
      return cached!;
    },
  } as { readonly value: T };
} 
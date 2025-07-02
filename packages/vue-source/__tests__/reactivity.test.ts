import { describe, expect, it } from 'vitest';
import { reactive, effect, computed } from '../src';

describe('reactivity', () => {
  it('should track and trigger', () => {
    const state = reactive({ count: 0 });
    let dummy = 0;
    effect(() => {
      dummy = state.count;
    });
    expect(dummy).toBe(0);
    state.count++;
    expect(dummy).toBe(1);
  });

  it('computed works', () => {
    const state = reactive({ count: 1 });
    const plusOne = computed(() => state.count + 1);
    expect(plusOne.value).toBe(2);
    state.count = 3;
    // 重新取值时会更新
    expect(plusOne.value).toBe(4);
  });
}); 
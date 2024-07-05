import { describe, expect, it } from 'vitest'
import {
  StringParser,
  Some,
  None,
} from '../src'

describe('should construct valid string parser', () => {
  it('string parser with const length of 3', () => {
    const parser = new StringParser(3, "010101");
    expect(parser.next()).toEqual(Some(1n));
    expect(parser.next()).toEqual(Some(1n));
    expect(parser.next()).toEqual(Some(1n));
    expect(parser.next()).toEqual(None());
  })
})


export class Result<V, E> {
    v: V | null = null;
    e: E | null = null;
    constructor(
        v: V | null,
        e: E | null,
    ) {
        this.v = v;
        this.e = e;
    }

    isErr(): boolean {
        return this.e !== null;
    }

    isOk(): boolean {
        return this.v !== null;
    }

    ok(): Option<V> {
        if (this.isOk()) {
            return new Option(this.v);
        }
        return None();
    }

    unwrap(): V {
        if (!this.isOk() && this.isErr()) {
            throw this.e;
        }
        return this.v!;
    }
}

export function Ok<V, E>(v: V) : Result<V, E> {
    return new Result<V, E>(v, null);
}

export function Err<V, E>(e: E) : Result<V, E> {
    return new Result<V, E>(null, e);
}

export class Option<V> {
    v: V | null = null;
    constructor(v: V | null) {
        this.v = v;
    }

    isSome(): boolean {
        return this.v !== null;
    }

    map<U>(cb: (v: V) => U): Option<U> {
        if (this.isSome()) {
            const r = cb(this.v!);
            return Some(r);
        }
        return None()
    }

    ok_or<E>(e: E): Result<V, E> {
        if (this.isSome()) {
            return new Result<V, E>(this.v, null);
        }
        return new Result(this.v, e);
    }
}

export function Some<V>(v: V) : Option<V> {
    return new Option<V>(v);
}

export function None<V>() : Option<V> {
    return new Option<V>(null);
}

export function isValidRange(s: string, start: number, end: number): boolean {
    return !(s.length === 0) && start < end && end <= s.length;
}

export function parseRadix16(s: string): Result<BigInt, string> {
    try {
        let r = BigInt('0x' + s);
        if (r > 0x7FFFFFFFFFFFFFFFn) {
            return Err(`integer overflow`);
        }
        return Ok(r);
    } catch (error) {
        return Err('' + error);
    }
}

export function parseRadix16Slice(s: string, start: number, end: number): Result<BigInt, string> {
    return parseRadix16(s.slice(start, end));
}

export const HEX_CHARS: string[] = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',
];
export const insertAt = (str: string, sub: string, pos: number) => `${str.slice(0, pos)}${sub}${str.slice(pos + sub.length)}`;

export class StringWriter {
    it: BigInt[];

    constructor(it: BigInt[]) {
        this.it = it;
    }

    toString(): string {
        let r = '';
        let idx: number;
        for (let i = 0; i < this.it.length; i++) {
            idx = r.length;
            r += `0${this.it[i].toString(16).toUpperCase()}`;
            let l = r.length;
            r = insertAt(r, HEX_CHARS[l - (idx + 2)], idx);
        }
        return r;
    }
}

export class StringParser {
    count: number = 0;
    start: number = 0;
    end: number = 1;
    hasObjectIdAtEnd: boolean = false;
    n: number;
    s: string;

    constructor(n: number, s: string) {
        this.n = n;
        this.s = s;
    }

    withObjectId(): StringParser {
        this.hasObjectIdAtEnd = true;
        return this;
    }

    next(): Option<BigInt> {
        if (this.count >= this.n) {
            return None();
        }
        if (!isValidRange(this.s, this.start, this.end)) {
            return None();
        }
        const l1 = parseRadix16Slice(this.s, this.start, this.end);
        if (l1.isErr()) {
            return None();
        }
        this.start = this.end;
        this.end = this.start + Number(l1.unwrap()) + 1;
        if (!isValidRange(this.s, this.start, this.end)) {
            return None();
        }
        let s = this.s.slice(this.start, this.end);
        let result = parseRadix16(s).ok()
        this.start = this.end;
        this.end = this.start + 1;
        this.count += 1;
        const l2 = this.s.length;
        if (this.hasObjectIdAtEnd) {
            if (this.count === this.n && this.end + 23 !== l2) {
                return None();
            }
        } else if (this.count === this.n && this.end !== (l2 + 1)) {
            return None();
        }
        return result;
    }
}
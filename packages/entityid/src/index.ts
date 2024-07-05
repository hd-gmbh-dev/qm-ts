import { Ok, Err, Result, StringWriter, StringParser } from '@qmrs/utils'

export enum IdType {
    CustomerId = 'V',
    CustomerResourceId = 'U',
    OrganizationId = 'T',
    OrganizationResourceId = 'S',
    InstitutionId = 'R',
    InstitutionResourceId = 'Q',
    InstitutionUnitId = 'P',
    InstitutionUnitResourceId = 'O',
    CustomerUnitId = 'N',
    CustomerUnitResourceId = 'M'
}

function idToString(ty: IdType, it: BigInt[]): string {
    return  `${ty}${new StringWriter(it).toString()}`;
}

// The 12-byte ObjectId consists of:
// A 4-byte timestamp, representing the ObjectId's creation, measured in seconds since the Unix epoch.
// A 5-byte random value generated once per process. This random value is unique to the machine and process.
// A 3-byte incrementing counter, initialized to a random value.

export class ObjectId {
    t: number;
    r: bigint;
    s: string;

    constructor(
        t: number,
        r: bigint,
        s?: string,
    ) {
        this.t = t;
        this.r = r;
        if (s !== undefined) {
            this.s = s;
        } else {
            this.s = t.toString(16) + r.toString(16);
        }
    }

    static parse(s: string): Result<ObjectId, string> {
        if (s.length !== 24) {
            return Err('invalid length, expected 24 characters (12 bytes)');
        }
        const t = parseInt(s.slice(0, 8), 16);
        if (Number.isNaN(t)) {
            return Err('invalid timestamp');
        }
        let r: bigint;
        try {
            r = BigInt(`0x${s.slice(8)}`);
        } catch (error) {
            return Err('' + error);
        }
        return Ok(new ObjectId(t, r, s))
    }
}

abstract class EntityId {
    _idType: IdType;
    constructor(idType: IdType) {
        this._idType = idType;
    }

    toArray(): BigInt[] {
        return []
    }

    toString(): string {
        return idToString(this._idType, this.toArray());
    }

    static validate<V>(idType: IdType, s: string): Result<V, string> {
        if (s[0] !== idType) {
            return Err(`invalid prefix`);
        }
        return Ok(0 as V);
    }
}

export class CustomerId extends EntityId {
    static _ty: IdType = IdType.CustomerId;
    _id: BigInt;
    constructor(id: BigInt) {
        super(CustomerId._ty);
        this._id = id;
    }

    toArray(): BigInt[] {
        return [this._id]
    }

    static parse(s: string): Result<CustomerId, string> {
        const e = super.validate(CustomerId._ty, s);
        if (e.isErr()) {
            return e as Result<CustomerId, string>;
        }
        return new StringParser(1, s.slice(1))
            .next()
            .map(n => new CustomerId(n))
            .ok_or(`unable to parse '${s}' into CustomerId`);
    }
}

export class CustomerResourceId extends EntityId {
    static _ty: IdType = IdType.CustomerResourceId;
    _cid: BigInt;
    _id: ObjectId;

    constructor(cid: BigInt, id: ObjectId) {
        super(CustomerResourceId._ty);
        this._cid = cid;
        this._id = id;
    }

    toArray(): BigInt[] {
        return [this._cid]
    }

    toString(): string {
        return super.toString() + this._id.s;
    }

    root(): CustomerId {
        return new CustomerId(this._cid);
    }

    parent(): CustomerId {
        return new CustomerId(this._cid);
    }

    objectId(): ObjectId {
        return this._id;
    }

    static parse(s: string): Result<CustomerResourceId, string> {
        const e = super.validate(CustomerResourceId._ty, s);
        if (e.isErr()) {
            return e as Result<CustomerResourceId, string>;
        }
        const id = ObjectId.parse(s.slice(-24));
        if (id.isErr()) {
            return Err<CustomerResourceId, string>(id.e!);
        }
        return new StringParser(1, s.slice(1))
            .withObjectId()
            .next()
            .map(n => new CustomerResourceId(n, id.unwrap()))
            .ok_or(`unable to parse '${s}' into CustomerResourceId`);
    }
}

export class OrganizationId extends EntityId {
    static _ty: IdType = IdType.OrganizationId;
    _cid: BigInt;
    _id: BigInt;

    constructor(cid: BigInt, id: BigInt) {
        super(OrganizationId._ty);
        this._cid = cid;
        this._id = id;
    }

    toArray(): BigInt[] {
        return [this._cid, this._id]
    }

    root(): CustomerId {
        return new CustomerId(this._cid);
    }

    parent(): CustomerId {
        return new CustomerId(this._cid);
    }

    static parse(s: string): Result<OrganizationId, string> {
        const e = super.validate(OrganizationId._ty, s);
        if (e.isErr()) {
            return e as Result<OrganizationId, string>;
        }
        const parser = new StringParser(2, s.slice(1));
        const cid = parser
            .next()
            .ok_or(`unable to parse '${s}' into OrganizationId .. missing cid`);
        if (cid.isErr()) {
            return cid as any as Result<OrganizationId, string>;
        }
        const id = parser
            .next()
            .ok_or(`unable to parse '${s}' into OrganizationId .. missing id`);
        if (id.isErr()) {
            return id as any as Result<OrganizationId, string>;
        }
        return Ok(new OrganizationId(cid.unwrap(), id.unwrap()));
    }
}

export class OrganizationResourceId extends EntityId {
    static _ty: IdType = IdType.OrganizationResourceId;
    _cid: BigInt;
    _oid: BigInt;
    _id: ObjectId;

    constructor(cid: BigInt, oid: BigInt, id: ObjectId) {
        super(OrganizationResourceId._ty);
        this._cid = cid;
        this._oid = oid;
        this._id = id;
    }

    toArray(): BigInt[] {
        return [this._cid, this._oid]
    }

    toString(): string {
        return super.toString() + this._id.s;
    }

    root(): CustomerId {
        return new CustomerId(this._cid);
    }

    parent(): OrganizationId {
        return new OrganizationId(this._cid, this._oid);
    }

    objectId(): ObjectId {
        return this._id;
    }

    static parse(s: string): Result<OrganizationResourceId, string> {
        const e = super.validate(OrganizationResourceId._ty, s);
        if (e.isErr()) {
            return e as Result<OrganizationResourceId, string>;
        }
        const id = ObjectId.parse(s.slice(-24));
        if (id.isErr()) {
            return Err<OrganizationResourceId, string>(id.e!);
        }
        const parser = new StringParser(2, s.slice(1)).withObjectId();
        const cid = parser
            .next()
            .ok_or(`unable to parse '${s}' into OrganizationResourceId .. missing cid`);
        if (cid.isErr()) {
            return cid as any as Result<OrganizationResourceId, string>;
        }
        const oid = parser
            .next()
            .ok_or(`unable to parse '${s}' into OrganizationResourceId .. missing oid`);
        if (oid.isErr()) {
            return oid as any as Result<OrganizationResourceId, string>;
        }
        return Ok(new OrganizationResourceId(cid.unwrap(), oid.unwrap(), id.unwrap()));
    }
}


export class InstitutionId extends EntityId {
    static _ty: IdType = IdType.InstitutionId;
    _cid: BigInt;
    _oid: BigInt;
    _id: BigInt;

    constructor(cid: BigInt, oid: BigInt, id: BigInt) {
        super(InstitutionId._ty);
        this._cid = cid;
        this._oid = oid;
        this._id = id;
    }

    toArray(): BigInt[] {
        return [this._cid, this._oid, this._id]
    }

    root(): CustomerId {
        return new CustomerId(this._cid);
    }

    parent(): OrganizationId {
        return new OrganizationId(this._cid, this._oid);
    }

    static parse(s: string): Result<InstitutionId, string> {
        const e = super.validate(InstitutionId._ty, s);
        if (e.isErr()) {
            return e as Result<InstitutionId, string>;
        }
        const parser = new StringParser(3, s.slice(1));
        const cid = parser
            .next()
            .ok_or(`unable to parse '${s}' into InstitutionId .. missing cid`);
        if (cid.isErr()) {
            return cid as any as Result<InstitutionId, string>;
        }
        const oid = parser
            .next()
            .ok_or(`unable to parse '${s}' into InstitutionId .. missing oid`);
        if (oid.isErr()) {
            return oid as any as Result<InstitutionId, string>;
        }
        const id = parser
            .next()
            .ok_or(`unable to parse '${s}' into InstitutionId .. missing id`);
        if (id.isErr()) {
            return id as any as Result<InstitutionId, string>;
        }
        return Ok(new InstitutionId(cid.unwrap(), oid.unwrap(), id.unwrap()));
    }
}

export class InstitutionResourceId extends EntityId {
    static _ty: IdType = IdType.InstitutionResourceId;
    _cid: BigInt;
    _oid: BigInt;
    _iid: BigInt;
    _id: ObjectId;

    constructor(cid: BigInt, oid: BigInt, iid: BigInt, id: ObjectId) {
        super(InstitutionResourceId._ty);
        this._cid = cid;
        this._oid = oid;
        this._iid = iid;
        this._id = id;
    }

    toArray(): BigInt[] {
        return [this._cid, this._oid, this._iid]
    }

    toString(): string {
        return super.toString() + this._id.s;
    }

    root(): CustomerId {
        return new CustomerId(this._cid);
    }

    parent(): InstitutionId {
        return new InstitutionId(this._cid, this._oid, this._iid);
    }

    objectId(): ObjectId {
        return this._id;
    }

    static parse(s: string): Result<InstitutionResourceId, string> {
        const e = super.validate(InstitutionResourceId._ty, s);
        if (e.isErr()) {
            return e as Result<InstitutionResourceId, string>;
        }
        const id = ObjectId.parse(s.slice(-24));
        if (id.isErr()) {
            return Err<InstitutionResourceId, string>(id.e!);
        }
        const parser = new StringParser(3, s.slice(1)).withObjectId();
        const cid = parser
            .next()
            .ok_or(`unable to parse '${s}' into InstitutionResourceId .. missing cid`);
        if (cid.isErr()) {
            return cid as any as Result<InstitutionResourceId, string>;
        }
        const oid = parser
            .next()
            .ok_or(`unable to parse '${s}' into InstitutionResourceId .. missing oid`);
        if (oid.isErr()) {
            return oid as any as Result<InstitutionResourceId, string>;
        }
        const iid = parser
            .next()
            .ok_or(`unable to parse '${s}' into InstitutionResourceId .. missing iid`);
        if (iid.isErr()) {
            return iid as any as Result<InstitutionResourceId, string>;
        }
        return Ok(new InstitutionResourceId(cid.unwrap(), oid.unwrap(), iid.unwrap(), id.unwrap()));
    }
}

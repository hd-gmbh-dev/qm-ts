import { describe, expect, it } from 'vitest'
import {
  ObjectId,
  CustomerId,
  CustomerResourceId,
  OrganizationId,
  OrganizationResourceId,
  InstitutionId,
  InstitutionResourceId,
} from '../src'
import { None } from '@qm/utils'

describe('should parse ids correctly', () => {
  it('parse customer ids', () => {
    const id1 = CustomerId.parse("V01").unwrap();
    const id2 = CustomerId.parse("V120").unwrap();
    const id3 = CustomerId.parse("V2500").unwrap();
    const id4 = CustomerId.parse("V36000").unwrap();
    const id5 = CustomerId.parse("V48000F").unwrap();
    const id6 = CustomerId.parse("V5AF000F").unwrap();
    const id7 = CustomerId.parse("V6B5F000F").unwrap();
    const id8 = CustomerId.parse("VF7FFFFFFFFFFFFFFF").unwrap();
    expect(id1).toEqual(new CustomerId(0x1n));
    expect(id2).toEqual(new CustomerId(0x20n));
    expect(id3).toEqual(new CustomerId(0x500n));
    expect(id4).toEqual(new CustomerId(0x6000n));
    expect(id5).toEqual(new CustomerId(0x8000Fn));
    expect(id6).toEqual(new CustomerId(0xAF000Fn));
    expect(id7).toEqual(new CustomerId(0xB5F000Fn));
    expect(id8).toEqual(new CustomerId(0x7FFFFFFFFFFFFFFFn));
    expect(id1.toString()).toEqual("V01");
    expect(id2.toString()).toEqual("V120");
    expect(id3.toString()).toEqual("V2500");
    expect(id4.toString()).toEqual("V36000");
    expect(id5.toString()).toEqual("V48000F");
    expect(id6.toString()).toEqual("V5AF000F");
    expect(id7.toString()).toEqual("V6B5F000F");
    expect(id8.toString()).toEqual("VF7FFFFFFFFFFFFFFF");
    expect(None()).toEqual(CustomerId.parse("VF8FFFFFFFFFFFFFFF").ok());
    expect(None()).toEqual(CustomerId.parse("VVV").ok());
    expect(None()).toEqual(CustomerId.parse("V0ABC").ok());
    expect(id1.toArray()).toEqual([1n]);
  })

  it('parse customer resource ids', () => {
    let oid1 = ObjectId.parse("6603f7b32b1753f84a719e01").unwrap();
    let oid2 = ObjectId.parse("6603f7b32b1753f84a719e02").unwrap();
    let oid3 = ObjectId.parse("6603f7b32b1753f84a719e03").unwrap();
    let oid4 = ObjectId.parse("6603f7b32b1753f84a719e04").unwrap();
    let id1 = CustomerResourceId.parse("U016603f7b32b1753f84a719e01").unwrap();
    let id2 = CustomerResourceId.parse("U1206603f7b32b1753f84a719e02").unwrap();
    let id3 = CustomerResourceId.parse("U25006603f7b32b1753f84a719e03").unwrap();
    let id4 = CustomerResourceId.parse("U360006603f7b32b1753f84a719e04").unwrap();
    let id5 = CustomerResourceId.parse("U48000F6603f7b32b1753f84a719e01").unwrap();
    let id6 = CustomerResourceId.parse("U5AF000F6603f7b32b1753f84a719e02").unwrap();
    let id7 = CustomerResourceId.parse("U6B5F000F6603f7b32b1753f84a719e03").unwrap();
    let id8 = CustomerResourceId.parse("UF7FFFFFFFFFFFFFFF6603f7b32b1753f84a719e04").unwrap();
    expect(new CustomerResourceId(1n, oid1)).toEqual(id1);
    expect(new CustomerResourceId(0x20n, oid2)).toEqual(id2);
    expect(new CustomerResourceId(0x500n, oid3)).toEqual(id3);
    expect(new CustomerResourceId(0x6000n, oid4)).toEqual(id4);
    expect(new CustomerResourceId(0x8000Fn, oid1)).toEqual(id5);
    expect(new CustomerResourceId(0xAF000Fn, oid2)).toEqual(id6);
    expect(new CustomerResourceId(0xB5F000Fn, oid3)).toEqual(id7);
    expect(new CustomerResourceId(0x7FFFFFFFFFFFFFFFn, oid4)).toEqual(id8);
    expect(id1.toString()).toEqual("U016603f7b32b1753f84a719e01");
    expect(id2.toString()).toEqual("U1206603f7b32b1753f84a719e02");
    expect(id3.toString()).toEqual("U25006603f7b32b1753f84a719e03");
    expect(id4.toString()).toEqual("U360006603f7b32b1753f84a719e04");
    expect(id5.toString()).toEqual("U48000F6603f7b32b1753f84a719e01");
    expect(id6.toString()).toEqual("U5AF000F6603f7b32b1753f84a719e02");
    expect(id7.toString()).toEqual("U6B5F000F6603f7b32b1753f84a719e03");
    expect(id8.toString()).toEqual("UF7FFFFFFFFFFFFFFF6603f7b32b1753f84a719e04");
    expect(None()).toEqual(CustomerResourceId.parse("UF8FFFFFFFFFFFFFFF6603f7b32b1753f84a719e01").ok());
    expect(None()).toEqual(CustomerResourceId.parse("UF9FFFFFFFFFFFFFFF6603f7b32b1753f84a719e02").ok());
    expect(None()).toEqual(CustomerResourceId.parse("UFAFFFFFFFFFFFFFFF6603f7b32b1753f84a719e03").ok());
    expect(None()).toEqual(CustomerResourceId.parse("UFBFFFFFFFFFFFFFFF6603f7b32b1753f84a719e04").ok());
    expect(None()).toEqual(CustomerResourceId.parse("UFCFFFFFFFFFFFFFFF6603f7b32b1753f84a719e01").ok());
    expect(None()).toEqual(CustomerResourceId.parse("UFDFFFFFFFFFFFFFFF6603f7b32b1753f84a719e02").ok());
    expect(None()).toEqual(CustomerResourceId.parse("UFEFFFFFFFFFFFFFFF6603f7b32b1753f84a719e03").ok());
    expect(None()).toEqual(CustomerResourceId.parse("UFFFFFFFFFFFFFFFFF6603f7b32b1753f84a719e04").ok());
    expect(None()).toEqual(CustomerResourceId.parse("UVV6603f7b32b1753f84a719e04").ok());
    expect(None()).toEqual(CustomerResourceId.parse("U0ABC6603f7b32b1753f84a719e04").ok());
    expect(id1.toArray()).toEqual([1n]);
    expect(id1.root()).toEqual(new CustomerId(1n));
    expect(id1.parent()).toEqual(new CustomerId(1n));
    expect(id1.objectId()).toEqual(oid1);
  })

  it('parse organization ids', () => {
    let id1 = OrganizationId.parse("T0101").unwrap();
    let id2 = OrganizationId.parse("T120120").unwrap();
    let id3 = OrganizationId.parse("T25002500").unwrap();
    let id4 = OrganizationId.parse("T3600036000").unwrap();
    let id5 = OrganizationId.parse("T48000F48000F").unwrap();
    let id6 = OrganizationId.parse("T5AF000F5AF000F").unwrap();
    let id7 = OrganizationId.parse("T6B5F000F6B5F000F").unwrap();
    let id8 = OrganizationId.parse("TF7FFFFFFFFFFFFFFFF7FFFFFFFFFFFFFFF").unwrap();
    expect(new OrganizationId(1n, 1n)).toEqual(id1);
    expect(new OrganizationId(0x20n, 0x20n)).toEqual(id2);
    expect(new OrganizationId(0x500n, 0x500n)).toEqual(id3);
    expect(new OrganizationId(0x6000n, 0x6000n)).toEqual(id4);
    expect(new OrganizationId(0x8000Fn, 0x8000Fn)).toEqual(id5);
    expect(new OrganizationId(0xAF000Fn, 0xAF000Fn)).toEqual(id6);
    expect(new OrganizationId(0xB5F000Fn, 0xB5F000Fn)).toEqual(id7);
    expect(new OrganizationId(0x7FFFFFFFFFFFFFFFn, 0x7FFFFFFFFFFFFFFFn)).toEqual(id8);
    expect(id1.toString(), "T0101");
    expect(id2.toString(), "T120120");
    expect(id3.toString(), "T25002500");
    expect(id4.toString(), "T3600036000");
    expect(id5.toString(), "T48000F48000F");
    expect(id6.toString(), "T5AF000F5AF000F");
    expect(id7.toString(), "T6B5F000F6B5F000F");
    expect(id8.toString(), "TF7FFFFFFFFFFFFFFFF7FFFFFFFFFFFFFFF");
    expect(None()).toEqual(OrganizationId.parse("TF8FFFFFFFFFFFFFFF8FFFFFFFFFFFFFFF").ok());
    expect(None()).toEqual(OrganizationId.parse("TF9FFFFFFFFFFFFFFF9FFFFFFFFFFFFFFF").ok());
    expect(None()).toEqual(OrganizationId.parse("TFAFFFFFFFFFFFFFFFAFFFFFFFFFFFFFFF").ok());
    expect(None()).toEqual(OrganizationId.parse("TFBFFFFFFFFFFFFFFFBFFFFFFFFFFFFFFF").ok());
    expect(None()).toEqual(OrganizationId.parse("TFCFFFFFFFFFFFFFFFCFFFFFFFFFFFFFFF").ok());
    expect(None()).toEqual(OrganizationId.parse("TFDFFFFFFFFFFFFFFFDFFFFFFFFFFFFFFF").ok());
    expect(None()).toEqual(OrganizationId.parse("TFEFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFF").ok());
    expect(None()).toEqual(OrganizationId.parse("TFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF").ok());
    expect(None()).toEqual(OrganizationId.parse("TVVVU").ok());
    expect(None()).toEqual(OrganizationId.parse("TFABC1C").ok());
    expect(id1.root()).toEqual(new CustomerId(1n));
    expect(id1.parent()).toEqual(new CustomerId(1n));
    expect(id1.toArray()).toEqual([1n, 1n]);
  })

  it('parse organization resource ids', () => {
      let oid1 = ObjectId.parse("6603f7b32b1753f84a719e01").unwrap();
      let oid2 = ObjectId.parse("6603f7b32b1753f84a719e02").unwrap();
      let oid3 = ObjectId.parse("6603f7b32b1753f84a719e03").unwrap();
      let oid4 = ObjectId.parse("6603f7b32b1753f84a719e04").unwrap();
      let id1 = OrganizationResourceId.parse("S01016603f7b32b1753f84a719e01").unwrap();
      let id2 = OrganizationResourceId.parse("S1201206603f7b32b1753f84a719e02").unwrap();
      let id3 = OrganizationResourceId.parse("S250025006603f7b32b1753f84a719e03").unwrap();
      let id4 = OrganizationResourceId.parse("S36000360006603f7b32b1753f84a719e04").unwrap();
      let id5 = OrganizationResourceId.parse("S48000F48000F6603f7b32b1753f84a719e01").unwrap();
      let id6 = OrganizationResourceId.parse("S5AF000F5AF000F6603f7b32b1753f84a719e02").unwrap();
      let id7 = OrganizationResourceId.parse("S6B5F000F6B5F000F6603f7b32b1753f84a719e03").unwrap();
      let id8 = OrganizationResourceId.parse("SF7FFFFFFFFFFFFFFFF7FFFFFFFFFFFFFFF6603f7b32b1753f84a719e04").unwrap();
      expect(new OrganizationResourceId(1n, 1n, oid1)).toEqual(id1);
      expect(new OrganizationResourceId(0x20n, 0x20n, oid2)).toEqual(id2);
      expect(new OrganizationResourceId(0x500n, 0x500n, oid3)).toEqual(id3);
      expect(new OrganizationResourceId(0x6000n, 0x6000n, oid4)).toEqual(id4);
      expect(new OrganizationResourceId(0x8000Fn, 0x8000Fn, oid1)).toEqual(id5);
      expect(new OrganizationResourceId(0xAF000Fn, 0xAF000Fn, oid2)).toEqual(id6);
      expect(new OrganizationResourceId(0xB5F000Fn, 0xB5F000Fn, oid3)).toEqual(id7);
      expect(new OrganizationResourceId(0x7FFFFFFFFFFFFFFFn, 0x7FFFFFFFFFFFFFFFn, oid4)).toEqual(id8);
      expect(id1.toString()).toEqual("S01016603f7b32b1753f84a719e01");
      expect(id2.toString()).toEqual("S1201206603f7b32b1753f84a719e02");
      expect(id3.toString()).toEqual("S250025006603f7b32b1753f84a719e03");
      expect(id4.toString()).toEqual("S36000360006603f7b32b1753f84a719e04");
      expect(id5.toString()).toEqual("S48000F48000F6603f7b32b1753f84a719e01");
      expect(id6.toString()).toEqual("S5AF000F5AF000F6603f7b32b1753f84a719e02");
      expect(id7.toString()).toEqual("S6B5F000F6B5F000F6603f7b32b1753f84a719e03");
      expect(id8.toString()).toEqual("SF7FFFFFFFFFFFFFFFF7FFFFFFFFFFFFFFF6603f7b32b1753f84a719e04");
      expect(None()).toEqual(OrganizationResourceId.parse("SF8FFFFFFFFFFFFFFFF8FFFFFFFFFFFFFFF6603f7b32b1753f84a719e01").ok());
      expect(None()).toEqual(OrganizationResourceId.parse("SF9FFFFFFFFFFFFFFFF9FFFFFFFFFFFFFFF6603f7b32b1753f84a719e02").ok());
      expect(None()).toEqual(OrganizationResourceId.parse("SFAFFFFFFFFFFFFFFFFAFFFFFFFFFFFFFFF6603f7b32b1753f84a719e03").ok());
      expect(None()).toEqual(OrganizationResourceId.parse("SFBFFFFFFFFFFFFFFFFBFFFFFFFFFFFFFFF6603f7b32b1753f84a719e04").ok());
      expect(None()).toEqual(OrganizationResourceId.parse("SFCFFFFFFFFFFFFFFFFCFFFFFFFFFFFFFFF6603f7b32b1753f84a719e01").ok());
      expect(None()).toEqual(OrganizationResourceId.parse("SFDFFFFFFFFFFFFFFFFDFFFFFFFFFFFFFFF6603f7b32b1753f84a719e02").ok());
      expect(None()).toEqual(OrganizationResourceId.parse("SFEFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFF6603f7b32b1753f84a719e03").ok());
      expect(None()).toEqual(OrganizationResourceId.parse("SFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF6603f7b32b1753f84a719e04").ok());
      expect(None()).toEqual(OrganizationResourceId.parse("SVV6603f7b32b1753f84a719e04").ok());
      expect(None()).toEqual(OrganizationResourceId.parse("S0A0A0A0A0A0ABC6603f7b32b1753f84a719e04").ok());
      expect(id1.root()).toEqual(new CustomerId(1n));
      expect(id1.parent()).toEqual(new OrganizationId(1n, 1n));
      expect(id1.toArray()).toEqual([1n, 1n]);
      expect(id1.objectId()).toEqual(oid1);
  })

  it('parse institution ids', () => {
    let id1 = InstitutionId.parse("R010101").unwrap();
    let id2 = InstitutionId.parse("R120120120").unwrap();
    let id3 = InstitutionId.parse("R250025002500").unwrap();
    let id4 = InstitutionId.parse("R360003600036000").unwrap();
    let id5 = InstitutionId.parse("R48000F48000F48000F").unwrap();
    let id6 = InstitutionId.parse("R5AF000F5AF000F5AF000F").unwrap();
    let id7 = InstitutionId.parse("R6B5F000F6B5F000F6B5F000F").unwrap();
    let id8 = InstitutionId.parse("RF7FFFFFFFFFFFFFFFF7FFFFFFFFFFFFFFFF7FFFFFFFFFFFFFFF").unwrap();
    expect(new InstitutionId(1n, 1n, 1n)).toEqual(id1);
    expect(new InstitutionId(0x20n, 0x20n, 0x20n)).toEqual(id2);
    expect(new InstitutionId(0x500n, 0x500n, 0x500n)).toEqual(id3);
    expect(new InstitutionId(0x6000n, 0x6000n, 0x6000n)).toEqual(id4);
    expect(new InstitutionId(0x8000Fn, 0x8000Fn, 0x8000Fn)).toEqual(id5);
    expect(new InstitutionId(0xAF000Fn, 0xAF000Fn, 0xAF000Fn)).toEqual(id6);
    expect(new InstitutionId(0xB5F000Fn, 0xB5F000Fn, 0xB5F000Fn)).toEqual(id7);
    expect(new InstitutionId(0x7FFFFFFFFFFFFFFFn, 0x7FFFFFFFFFFFFFFFn, 0x7FFFFFFFFFFFFFFFn)).toEqual(id8);
    expect(id1.toString()).toEqual("R010101");
    expect(id2.toString()).toEqual("R120120120");
    expect(id3.toString()).toEqual("R250025002500");
    expect(id4.toString()).toEqual("R360003600036000");
    expect(id5.toString()).toEqual("R48000F48000F48000F");
    expect(id6.toString()).toEqual("R5AF000F5AF000F5AF000F");
    expect(id7.toString()).toEqual("R6B5F000F6B5F000F6B5F000F");
    expect(id8.toString()).toEqual("RF7FFFFFFFFFFFFFFFF7FFFFFFFFFFFFFFFF7FFFFFFFFFFFFFFF");
    expect(None()).toEqual(InstitutionId.parse("RF8FFFFFFFFFFFFFFF8FFFFFFFFFFFFFFF8FFFFFFFFFFFFFFF").ok());
    expect(None()).toEqual(InstitutionId.parse("RF9FFFFFFFFFFFFFFF9FFFFFFFFFFFFFFF9FFFFFFFFFFFFFFF").ok());
    expect(None()).toEqual(InstitutionId.parse("RFAFFFFFFFFFFFFFFFAFFFFFFFFFFFFFFFAFFFFFFFFFFFFFFF").ok());
    expect(None()).toEqual(InstitutionId.parse("RFBFFFFFFFFFFFFFFFBFFFFFFFFFFFFFFFBFFFFFFFFFFFFFFF").ok());
    expect(None()).toEqual(InstitutionId.parse("RFCFFFFFFFFFFFFFFFCFFFFFFFFFFFFFFFCFFFFFFFFFFFFFFF").ok());
    expect(None()).toEqual(InstitutionId.parse("RFDFFFFFFFFFFFFFFFDFFFFFFFFFFFFFFFDFFFFFFFFFFFFFFF").ok());
    expect(None()).toEqual(InstitutionId.parse("RFEFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFF").ok());
    expect(None()).toEqual(InstitutionId.parse("RFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF").ok());
    expect(None()).toEqual(InstitutionId.parse("R0FF").ok());
    expect(None()).toEqual(InstitutionId.parse("RF0").ok());
    expect(id1.root()).toEqual(new CustomerId(1n));
    expect(id1.parent()).toEqual(new OrganizationId(1n, 1n));
    expect(id1.toArray()).toEqual([1n, 1n, 1n]);
  })

  it('parse institution resource ids', () => {
    let oid1 = ObjectId.parse("6603f7b32b1753f84a719e01").unwrap();
    let oid2 = ObjectId.parse("6603f7b32b1753f84a719e02").unwrap();
    let oid3 = ObjectId.parse("6603f7b32b1753f84a719e03").unwrap();
    let oid4 = ObjectId.parse("6603f7b32b1753f84a719e04").unwrap();
    let id1 = InstitutionResourceId.parse("Q0101016603f7b32b1753f84a719e01").unwrap();
    let id2 = InstitutionResourceId.parse("Q1201201206603f7b32b1753f84a719e02").unwrap();
    let id3 = InstitutionResourceId.parse("Q2500250025006603f7b32b1753f84a719e03").unwrap();
    let id4 = InstitutionResourceId.parse("Q3600036000360006603f7b32b1753f84a719e04").unwrap();
    let id5 = InstitutionResourceId.parse("Q48000F48000F48000F6603f7b32b1753f84a719e01").unwrap();
    let id6 = InstitutionResourceId.parse("Q5AF000F5AF000F5AF000F6603f7b32b1753f84a719e02").unwrap();
    let id7 = InstitutionResourceId.parse("Q6B5F000F6B5F000F6B5F000F6603f7b32b1753f84a719e03").unwrap();
    let id8 = InstitutionResourceId.parse("QF7FFFFFFFFFFFFFFFF7FFFFFFFFFFFFFFFF7FFFFFFFFFFFFFFF6603f7b32b1753f84a719e04").unwrap();
    expect(new InstitutionResourceId(1n, 1n, 1n, oid1)).toEqual(id1);
    expect(new InstitutionResourceId(0x20n, 0x20n, 0x20n, oid2)).toEqual(id2);
    expect(new InstitutionResourceId(0x500n, 0x500n, 0x500n, oid3)).toEqual(id3);
    expect(new InstitutionResourceId(0x6000n, 0x6000n, 0x6000n, oid4)).toEqual(id4);
    expect(new InstitutionResourceId(0x8000Fn, 0x8000Fn, 0x8000Fn, oid1)).toEqual(id5);
    expect(new InstitutionResourceId(0xAF000Fn, 0xAF000Fn, 0xAF000Fn, oid2)).toEqual(id6);
    expect(new InstitutionResourceId(0xB5F000Fn, 0xB5F000Fn, 0xB5F000Fn, oid3)).toEqual(id7);
    expect(new InstitutionResourceId(0x7FFFFFFFFFFFFFFFn, 0x7FFFFFFFFFFFFFFFn, 0x7FFFFFFFFFFFFFFFn, oid4)).toEqual(id8);
    expect(id1.toString()).toEqual("Q0101016603f7b32b1753f84a719e01");
    expect(id2.toString()).toEqual("Q1201201206603f7b32b1753f84a719e02");
    expect(id3.toString()).toEqual("Q2500250025006603f7b32b1753f84a719e03");
    expect(id4.toString()).toEqual("Q3600036000360006603f7b32b1753f84a719e04");
    expect(id5.toString()).toEqual("Q48000F48000F48000F6603f7b32b1753f84a719e01");
    expect(id6.toString()).toEqual("Q5AF000F5AF000F5AF000F6603f7b32b1753f84a719e02");
    expect(id7.toString()).toEqual("Q6B5F000F6B5F000F6B5F000F6603f7b32b1753f84a719e03");
    expect(id8.toString()).toEqual("QF7FFFFFFFFFFFFFFFF7FFFFFFFFFFFFFFFF7FFFFFFFFFFFFFFF6603f7b32b1753f84a719e04");
    expect(None()).toEqual(InstitutionResourceId.parse("QF8FFFFFFFFFFFFFFFF8FFFFFFFFFFFFFFF8FFFFFFFFFFFFFFF6603f7b32b1753f84a719e01").ok());
    expect(None()).toEqual(InstitutionResourceId.parse("QF9FFFFFFFFFFFFFFFF9FFFFFFFFFFFFFFF9FFFFFFFFFFFFFFF6603f7b32b1753f84a719e02").ok());
    expect(None()).toEqual(InstitutionResourceId.parse("QFAFFFFFFFFFFFFFFFFAFFFFFFFFFFFFFFFAFFFFFFFFFFFFFFF6603f7b32b1753f84a719e03").ok());
    expect(None()).toEqual(InstitutionResourceId.parse("QFBFFFFFFFFFFFFFFFFBFFFFFFFFFFFFFFFBFFFFFFFFFFFFFFF6603f7b32b1753f84a719e04").ok());
    expect(None()).toEqual(InstitutionResourceId.parse("QFCFFFFFFFFFFFFFFFFCFFFFFFFFFFFFFFFCFFFFFFFFFFFFFFF6603f7b32b1753f84a719e01").ok());
    expect(None()).toEqual(InstitutionResourceId.parse("QFDFFFFFFFFFFFFFFFFDFFFFFFFFFFFFFFFDFFFFFFFFFFFFFFF6603f7b32b1753f84a719e02").ok());
    expect(None()).toEqual(InstitutionResourceId.parse("QFEFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFF6603f7b32b1753f84a719e03").ok());
    expect(None()).toEqual(InstitutionResourceId.parse("QFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF6603f7b32b1753f84a719e04").ok());
    expect(None()).toEqual(InstitutionResourceId.parse("QVV6603f7b32b1753f84a719e04").ok());
    expect(None()).toEqual(InstitutionResourceId.parse("Q0A0A0A0A0A0ABC6603f7b32b1753f84a719e04").ok());
    expect(id1.root()).toEqual(new CustomerId(1n));
    expect(id1.parent()).toEqual(new InstitutionId(1n, 1n, 1n));
    expect(id1.toArray()).toEqual([1n, 1n, 1n]);
    expect(id1.objectId()).toEqual(oid1);
  })
})

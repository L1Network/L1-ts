import type {Action, AssetType, ExtendedAssetType, NameType, UInt64Type} from '@wharfkit/antelope'
import {
    ABI,
    Asset,
    Blob,
    ExtendedAsset,
    Name,
    Struct,
    TimePointSec,
    UInt64,
} from '@wharfkit/antelope'
import type {ActionOptions, ContractArgs, PartialBy, Table} from '@wharfkit/contract'
import {Contract as BaseContract} from '@wharfkit/contract'
export const abiBlob = Blob.from(
    'DmVvc2lvOjphYmkvMS4yADkQYWRkX2NyeXB0b190b2tlbgAHBXRva2VuD2V4dGVuZGVkX3N5bWJvbA9taW5faGVkZ2VfbGltaXQOZXh0ZW5kZWRfYXNzZXQMaGVkZ2VfYW1vdW50DmV4dGVuZGVkX2Fzc2V0EGRlbHBoaV91c2Rfc2NvcGUEbmFtZQhsb2FuX2ZlZQVhc3NldBJ3aXRoZHJhd19lcXVhbF9mZWUOZXh0ZW5kZWRfYXNzZXQPaXNfc3RhYmxlX3Rva2VuBGJvb2wOYWRkX2ZvcmV4X3BhaXIABApiYXNlX3Rva2VuD2V4dGVuZGVkX3N5bWJvbAtxdW90ZV90b2tlbg9leHRlbmRlZF9zeW1ib2wMZGVscGhpX3Njb3BlBG5hbWUMZXhjaGFuZ2VfZmVlBWFzc2V0CGFkZF9wYWlyAAUMY3J5cHRvX3Rva2VuD2V4dGVuZGVkX3N5bWJvbAxzdGFibGVfdG9rZW4PZXh0ZW5kZWRfc3ltYm9sDGRlbHBoaV9zY29wZQRuYW1lC2RlcG9zaXRfZmVlBWFzc2V0DGV4Y2hhbmdlX2ZlZQVhc3NldBBhZGRfc3RhYmxlX3Rva2VuAAEFdG9rZW4PZXh0ZW5kZWRfc3ltYm9sB2J1eV9nZW0AAgVidXllcgRuYW1lCHF1YW50aXR5DmV4dGVuZGVkX2Fzc2V0DmNhbmNlbF9idXlfZ2VtAAIFYnV5ZXIEbmFtZQJpZAZ1aW50NjQKY2FuY2VsX3AycAACBnNlbGxlcgRuYW1lAmlkBnVpbnQ2NA9jYW5jZWxfc2VsbF9nZW0AAgZzZWxsZXIEbmFtZQJpZAZ1aW50NjQKY29uZmlnX3JvdwAEE3RvdGFsX2RlcG9zaXRfbGltaXQOZXh0ZW5kZWRfYXNzZXQVYWNjb3VudF9kZXBvc2l0X2xpbWl0DmV4dGVuZGVkX2Fzc2V0EWN1cnJlbnRfbHR2X2xldmVsBnVpbnQ2NAlpc19wYXVzZWQEYm9vbAtjb25maXJtX3AycAADBnNlbGxlcgRuYW1lBWJ1eWVyBG5hbWUCaWQGdWludDY0DGNyeXB0b190b2tlbgAJAmlkBnVpbnQ2NAp0b3RhbF9zcG90DmV4dGVuZGVkX2Fzc2V0D21pbl9oZWRnZV9saW1pdA5leHRlbmRlZF9hc3NldAxoZWRnZV9hbW91bnQOZXh0ZW5kZWRfYXNzZXQQZGVscGhpX3VzZF9zY29wZQRuYW1lCGxvYW5fZmVlBWFzc2V0EndpdGhkcmF3X2VxdWFsX2ZlZQ5leHRlbmRlZF9hc3NldA9pc19zdGFibGVfdG9rZW4EYm9vbBJpc193aXRoZHJhd19wYXVzZWQEYm9vbA9jcnlwdG9fdHJhbnNmZXIABQRmcm9tBG5hbWUCdG8EbmFtZQdwYWlyX2lkBnVpbnQ2NAhxdWFudGl0eQ5leHRlbmRlZF9hc3NldARtZW1vBnN0cmluZxNjcnlwdG9fd2l0aGRyYXdfbG9nAAQHYWNjb3VudARuYW1lB3BhaXJfaWQGdWludDY0CHF1YW50aXR5DmV4dGVuZGVkX2Fzc2V0A2ZlZQ5leHRlbmRlZF9hc3NldAtkZXBvc2l0X2xvZwAEBGZyb20EbmFtZQ9jcnlwdG9fcXVhbnRpdHkOZXh0ZW5kZWRfYXNzZXQEbWVtbwZzdHJpbmcQYml0Y2FzaF9xdWFudGl0eQ5leHRlbmRlZF9hc3NldA9leHRlbmRlZF9zeW1ib2wAAgNzeW0Gc3ltYm9sCGNvbnRyYWN0BG5hbWUMZmlsbF9idXlfZ2VtAAIFYnV5ZXIEbmFtZQJpZAZ1aW50NjQNZmlsbF9zZWxsX2dlbQACBnNlbGxlcgRuYW1lAmlkBnVpbnQ2NApmb3JleF9wYWlyAAYCaWQGdWludDY0CmJhc2VfdG9rZW4PZXh0ZW5kZWRfc3ltYm9sC3F1b3RlX3Rva2VuD2V4dGVuZGVkX3N5bWJvbAxkZWxwaGlfc2NvcGUEbmFtZQxleGNoYW5nZV9mZWUFYXNzZXQRaXNfdHJhZGluZ19wYXVzZWQEYm9vbAtmb3JleF90cmFkZQADB2FjY291bnQEbmFtZQdwYWlyX2lkBnVpbnQ2NAhxdWFudGl0eQ5leHRlbmRlZF9hc3NldA9mb3JleF90cmFkZV9sb2cABgdhY2NvdW50BG5hbWUHcGFpcl9pZAZ1aW50NjQJYW1vdW50X2luDmV4dGVuZGVkX2Fzc2V0CmFtb3VudF9vdXQOZXh0ZW5kZWRfYXNzZXQKdW5pdF9wcmljZQ5leHRlbmRlZF9hc3NldANmZWUOZXh0ZW5kZWRfYXNzZXQJZ2VtX29yZGVyAAICaWQGdWludDY0CHF1YW50aXR5DmV4dGVuZGVkX2Fzc2V0Bmdsb2JhbAACAmlkBnVpbnQ2NAV0b3RhbA5leHRlbmRlZF9hc3NldBFnbG9iYWxfcGFpcl92YWx1ZQADB3BhaXJfaWQGdWludDY0DmNyeXB0b19iYWxhbmNlDmV4dGVuZGVkX2Fzc2V0DnN0YWJsZV9iYWxhbmNlDmV4dGVuZGVkX2Fzc2V0Cmdsb2JhbF9yb3cAAQV0b3RhbA5leHRlbmRlZF9hc3NldAVsaW1pdAADCW1heF9yYW5nZQ5leHRlbmRlZF9hc3NldAltYXhfdmFsdWUOZXh0ZW5kZWRfYXNzZXQDZmVlDmV4dGVuZGVkX2Fzc2V0DmxvbmdfdHJhZGVfbG9nAAMHYWNjb3VudARuYW1lCHF1YW50aXR5DmV4dGVuZGVkX2Fzc2V0BXByaWNlDmV4dGVuZGVkX2Fzc2V0CWx0dl9sZXZlbAAFBWxldmVsBnVpbnQ2NA5tYXhfdXNlcl9yYXRpbwVhc3NldBF0YXJnZXRfdXNlcl9yYXRpbwVhc3NldBBtaW5fZ2xvYmFsX3JhdGlvBWFzc2V0EG1heF9nbG9iYWxfcmF0aW8FYXNzZXQNbHR2X3Jvd19lbnRyeQADAmlkBnVpbnQ2NAlsdHZfcmF0aW8FYXNzZXQEZGF0ZQ50aW1lX3BvaW50X3NlYw1sdHZfcm93X2V2ZW50AAMCaWQGdWludDY0Cm5leHRfbGV2ZWwGdWludDY0BGRhdGUOdGltZV9wb2ludF9zZWMSbWlncmF0ZV9zcG90X3BhaXJzAAAWbWlncmF0ZV9zcG90X3Bvc2l0aW9ucwABB2FjY291bnQEbmFtZRVtaWdyYXRlX3N0YWJsZV90b2tlbnMAABNtb2RpZnlfY3J5cHRvX3Rva2VuAAUFdG9rZW4PZXh0ZW5kZWRfc3ltYm9sEGRlbHBoaV91c2Rfc2NvcGUEbmFtZQhsb2FuX2ZlZQVhc3NldBJ3aXRoZHJhd19lcXVhbF9mZWUOZXh0ZW5kZWRfYXNzZXQSaXNfd2l0aGRyYXdfcGF1c2VkBGJvb2wRbW9kaWZ5X2ZvcmV4X3BhaXIABApiYXNlX3Rva2VuD2V4dGVuZGVkX3N5bWJvbAtxdW90ZV90b2tlbg9leHRlbmRlZF9zeW1ib2wMZXhjaGFuZ2VfZmVlBWFzc2V0EWlzX3RyYWRpbmdfcGF1c2VkBGJvb2wLbW9kaWZ5X3BhaXIABgxjcnlwdG9fdG9rZW4PZXh0ZW5kZWRfc3ltYm9sDHN0YWJsZV90b2tlbg9leHRlbmRlZF9zeW1ib2wLZGVwb3NpdF9mZWUFYXNzZXQMZXhjaGFuZ2VfZmVlBWFzc2V0EWlzX2RlcG9zaXRfcGF1c2VkBGJvb2wRaXNfdHJhZGluZ19wYXVzZWQEYm9vbAVvcmRlcgADAmlkBnVpbnQ2NAhxdWFudGl0eQ5leHRlbmRlZF9hc3NldANmZWUOZXh0ZW5kZWRfYXNzZXQEcGFpcgAHAmlkBnVpbnQ2NAxjcnlwdG9fdG9rZW4PZXh0ZW5kZWRfc3ltYm9sDHN0YWJsZV90b2tlbg9leHRlbmRlZF9zeW1ib2wMZGVscGhpX3Njb3BlBG5hbWUMZXhjaGFuZ2VfZmVlBWFzc2V0EWlzX2RlcG9zaXRfcGF1c2VkBGJvb2wRaXNfdHJhZGluZ19wYXVzZWQEYm9vbAVwYXVzZQAACHBvc2l0aW9uAAQHcGFpcl9pZAZ1aW50NjQHYmFsYW5jZQ5leHRlbmRlZF9hc3NldA9iYWxhbmNlX2Jsb2NrZWQOZXh0ZW5kZWRfYXNzZXQSbGFzdF93aXRoZHJhd19kYXRlDnRpbWVfcG9pbnRfc2VjD3Bvc2l0aW9uX3YyX3JvdwADB3BhaXJfaWQGdWludDY0B2JhbGFuY2UOZXh0ZW5kZWRfYXNzZXQPYmFsYW5jZV9ibG9ja2VkDmV4dGVuZGVkX2Fzc2V0CHNlbGxfZ2VtAAIGc2VsbGVyBG5hbWUIcXVhbnRpdHkOZXh0ZW5kZWRfYXNzZXQIc2VsbF9wMnAAAwZzZWxsZXIEbmFtZQhxdWFudGl0eQ5leHRlbmRlZF9hc3NldANmZWUOZXh0ZW5kZWRfYXNzZXQMc2VsbF9wMnBfbG9nAAQGc2VsbGVyBG5hbWUIcXVhbnRpdHkOZXh0ZW5kZWRfYXNzZXQDZmVlDmV4dGVuZGVkX2Fzc2V0AmlkBnVpbnQ2NApzZXRfY29uZmlnAAITdG90YWxfZGVwb3NpdF9saW1pdA5leHRlbmRlZF9hc3NldBVhY2NvdW50X2RlcG9zaXRfbGltaXQOZXh0ZW5kZWRfYXNzZXQNc2V0X2x0dl9sZXZlbAAFBWxldmVsBnVpbnQ2NA5tYXhfdXNlcl9yYXRpbwVhc3NldBF0YXJnZXRfdXNlcl9yYXRpbwVhc3NldBBtaW5fZ2xvYmFsX3JhdGlvBWFzc2V0EG1heF9nbG9iYWxfcmF0aW8FYXNzZXQSc2V0X3dpdGhkcmF3X2xpbWl0AAMJbWF4X3JhbmdlDmV4dGVuZGVkX2Fzc2V0CW1heF92YWx1ZQ5leHRlbmRlZF9hc3NldANmZWUOZXh0ZW5kZWRfYXNzZXQPc2hvcnRfdHJhZGVfbG9nAAMHYWNjb3VudARuYW1lCHF1YW50aXR5DmV4dGVuZGVkX2Fzc2V0BXByaWNlDmV4dGVuZGVkX2Fzc2V0EHNwb3RfcGFpcl92Ml9yb3cACAJpZAZ1aW50NjQMY3J5cHRvX3Rva2VuD2V4dGVuZGVkX3N5bWJvbAxzdGFibGVfdG9rZW4PZXh0ZW5kZWRfc3ltYm9sDGRlbHBoaV9zY29wZQRuYW1lC2RlcG9zaXRfZmVlBWFzc2V0DGV4Y2hhbmdlX2ZlZQVhc3NldBFpc19kZXBvc2l0X3BhdXNlZARib29sEWlzX3RyYWRpbmdfcGF1c2VkBGJvb2wUc3BvdF9zdGFibGVfcG9zaXRpb24AAgJpZAZ1aW50NjQHYmFsYW5jZQ5leHRlbmRlZF9hc3NldBdzcG90X3N0YWJsZV9wb3NpdGlvbl92MgACB2JhbGFuY2UOZXh0ZW5kZWRfYXNzZXQPYmFsYW5jZV9ibG9ja2VkDmV4dGVuZGVkX2Fzc2V0DHN0YWJsZV90b2tlbgACAmlkBnVpbnQ2NAp0b3RhbF9zcG90DmV4dGVuZGVkX2Fzc2V0D3N0YWJsZV90cmFuc2ZlcgAEBGZyb20EbmFtZQJ0bwRuYW1lCHF1YW50aXR5DmV4dGVuZGVkX2Fzc2V0BG1lbW8Gc3RyaW5nE3N0YWJsZV93aXRoZHJhd19sb2cABAdhY2NvdW50BG5hbWUIcXVhbnRpdHkOZXh0ZW5kZWRfYXNzZXQDZmVlDmV4dGVuZGVkX2Fzc2V0EHJlY2VpdmVfcXVhbnRpdHkOZXh0ZW5kZWRfYXNzZXQHdW5wYXVzZQAACHdpdGhkcmF3AAMHYWNjb3VudARuYW1lB3BhaXJfaWQGdWludDY0CHF1YW50aXR5DmV4dGVuZGVkX2Fzc2V0D3dpdGhkcmF3X3BlcmlvZAACB2FjY291bnQEbmFtZQp1cGRhdGVkX2F0DnRpbWVfcG9pbnRfc2VjD3dpdGhkcmF3X3N0YWJsZQACB2FjY291bnQEbmFtZQhxdWFudGl0eQ5leHRlbmRlZF9hc3NldCQApoI014tSMhBhZGRfY3J5cHRvX3Rva2VuAHCdqV1dulIyDmFkZF9mb3JleF9wYWlyAAAAAOA6U1MyCGFkZF9wYWlyAACmgjSfjFMyEGFkZF9zdGFibGVfdG9rZW4AAAAAAEjFvD4HYnV5X2dlbQAAAKiiRoWmQQpjYW5jZWxfcDJwAAAAkIp5feJEDmNhbmNlbF9idXlfZ2VtAACAVCxGheNED2NhbmNlbF9zZWxsX2dlbQAAQBVVXrcmRQtjb25maXJtX3AycAAArlp4mpvrRQ9jcnlwdG9fdHJhbnNmZXIAAABgNMbE60UTY3J5cHRvX3dpdGhkcmF3X2xvZwAAAKMxO0yrSgtkZXBvc2l0X2xvZwAAgFTM6xOjWwxmaWxsX2J1eV9nZW0AAKRiMSoco1sNZmlsbF9zZWxsX2dlbQAAgErm5q4uXQtmb3JleF90cmFkZQAAAACMxnRzXw9mb3JleF90cmFkZV9sb2cAAACjMd3MJo0ObG9uZ190cmFkZV9sb2cAAKaCNNeLVpITbW9kaWZ5X2NyeXB0b190b2tlbgBwnaldXbpWkhFtb2RpZnlfZm9yZXhfcGFpcgAAAADgOlNXkgttb2RpZnlfcGFpcgCArzM104ovkxJtaWdyYXRlX3Nwb3RfcGFpcnMAAACmNdOKL5MWbWlncmF0ZV9zcG90X3Bvc2l0aW9ucwAAAJ4wn4wvkxVtaWdyYXRlX3N0YWJsZV90b2tlbnMAAAAAAACFtakFcGF1c2UAAAAAQCoWo8IIc2VsbF9nZW0AAAAAoIoao8IIc2VsbF9wMnAAAACjsYoao8IMc2VsbF9wMnBfbG9nAAAAYG5NirLCCnNldF9jb25maWcAAKLaKu4cs8INc2V0X2x0dl9sZXZlbAAAAABZxsSzwhJzZXRfd2l0aGRyYXdfbGltaXQAABiN6eZ8acMPc2hvcnRfdHJhZGVfbG9nAACuWniam0/GD3N0YWJsZV90cmFuc2ZlcgAAAGA0xsRPxhNzdGFibGVfd2l0aGRyYXdfbG9nAAAAAEBhberUB3VucGF1c2UAAAAA3NzUsuMId2l0aGRyYXcAEE/G3NzUsuMPd2l0aGRyYXdfc3RhYmxlABsAcLoUS8W8PgNpNjQAAAlnZW1fb3JkZXIAAAAAMLcmRQNpNjQAAApjb25maWdfcm93gKeCNNNc/UUDaTY0AAAMY3J5cHRvX3Rva2VuAAC+ztSuLl0DaTY0AAAKZm9yZXhfcGFpcgBipOg6U09kA2k2NAAAEWdsb2JhbF9wYWlyX3ZhbHVlAKah8TpTT2QDaTY0AAARZ2xvYmFsX3BhaXJfdmFsdWUQI0XRZJpPZANpNjQAAAZnbG9iYWwwDY3RZJpPZANpNjQAAAZnbG9iYWwgdowUxZxPZANpNjQAAApnbG9iYWxfcm93IPY0NMacT2QDaTY0AAAKZ2xvYmFsX3JvdwAAAADg7KSLA2k2NAAABWxpbWl0AAAAPjqTdo4DaTY0AAANbHR2X3Jvd19lbnRyeQAAAHmqrXaOA2k2NAAADWx0dl9yb3dfZXZlbnQAAPDxatp2jgNpNjQAAA1sdHZfcm93X2VudHJ5AADAUW0Vd44DaTY0AAAJbHR2X2xldmVsAAAAYk/HrpEDaTY0AAAPcG9zaXRpb25fdjJfcm93AADAV6VLq6gDaTY0AAAFb3JkZXIAAAAAAHydqQNpNjQAAARwYWlygNOlWCoWo8IDaTY0AAAJZ2VtX29yZGVyAAAAAACQacUDaTY0AAAIcG9zaXRpb24AxMbXmZppxQNpNjQAABBzcG90X3BhaXJfdjJfcm93AAAAAIidacUDaTY0AAAPcG9zaXRpb25fdjJfcm93AAAAAKh4TMYDaTY0AAAUc3BvdF9zdGFibGVfcG9zaXRpb26Ap4I0q3hMxgNpNjQAAAxzdGFibGVfdG9rZW4AAABiq3hMxgNpNjQAABdzcG90X3N0YWJsZV9wb3NpdGlvbl92MiA2ngrSHE/GA2k2NAAACmdsb2JhbF9yb3cAAE7UXVVj4gNpNjQAAA93aXRoZHJhd19wZXJpb2QAAAAAAA=='
)
export const abi = ABI.from(abiBlob)
export namespace Types {
    @Struct.type('extended_symbol')
    export class extended_symbol extends Struct {
        @Struct.field(Asset.Symbol)
        declare sym: Asset.Symbol
        @Struct.field(Name)
        declare contract: Name
    }
    @Struct.type('add_crypto_token')
    export class add_crypto_token extends Struct {
        @Struct.field(extended_symbol)
        declare token: extended_symbol
        @Struct.field(ExtendedAsset)
        declare min_hedge_limit: ExtendedAsset
        @Struct.field(ExtendedAsset)
        declare hedge_amount: ExtendedAsset
        @Struct.field(Name)
        declare delphi_usd_scope: Name
        @Struct.field(Asset)
        declare loan_fee: Asset
        @Struct.field(ExtendedAsset)
        declare withdraw_equal_fee: ExtendedAsset
        @Struct.field('bool')
        declare is_stable_token: boolean
    }
    @Struct.type('add_forex_pair')
    export class add_forex_pair extends Struct {
        @Struct.field(extended_symbol)
        declare base_token: extended_symbol
        @Struct.field(extended_symbol)
        declare quote_token: extended_symbol
        @Struct.field(Name)
        declare delphi_scope: Name
        @Struct.field(Asset)
        declare exchange_fee: Asset
    }
    @Struct.type('add_pair')
    export class add_pair extends Struct {
        @Struct.field(extended_symbol)
        declare crypto_token: extended_symbol
        @Struct.field(extended_symbol)
        declare stable_token: extended_symbol
        @Struct.field(Name)
        declare delphi_scope: Name
        @Struct.field(Asset)
        declare deposit_fee: Asset
        @Struct.field(Asset)
        declare exchange_fee: Asset
    }
    @Struct.type('add_stable_token')
    export class add_stable_token extends Struct {
        @Struct.field(extended_symbol)
        declare token: extended_symbol
    }
    @Struct.type('buy_gem')
    export class buy_gem extends Struct {
        @Struct.field(Name)
        declare buyer: Name
        @Struct.field(ExtendedAsset)
        declare quantity: ExtendedAsset
    }
    @Struct.type('cancel_buy_gem')
    export class cancel_buy_gem extends Struct {
        @Struct.field(Name)
        declare buyer: Name
        @Struct.field(UInt64)
        declare id: UInt64
    }
    @Struct.type('cancel_p2p')
    export class cancel_p2p extends Struct {
        @Struct.field(Name)
        declare seller: Name
        @Struct.field(UInt64)
        declare id: UInt64
    }
    @Struct.type('cancel_sell_gem')
    export class cancel_sell_gem extends Struct {
        @Struct.field(Name)
        declare seller: Name
        @Struct.field(UInt64)
        declare id: UInt64
    }
    @Struct.type('config_row')
    export class config_row extends Struct {
        @Struct.field(ExtendedAsset)
        declare total_deposit_limit: ExtendedAsset
        @Struct.field(ExtendedAsset)
        declare account_deposit_limit: ExtendedAsset
        @Struct.field(UInt64)
        declare current_ltv_level: UInt64
        @Struct.field('bool')
        declare is_paused: boolean
    }
    @Struct.type('confirm_p2p')
    export class confirm_p2p extends Struct {
        @Struct.field(Name)
        declare seller: Name
        @Struct.field(Name)
        declare buyer: Name
        @Struct.field(UInt64)
        declare id: UInt64
    }
    @Struct.type('crypto_token')
    export class crypto_token extends Struct {
        @Struct.field(UInt64)
        declare id: UInt64
        @Struct.field(ExtendedAsset)
        declare total_spot: ExtendedAsset
        @Struct.field(ExtendedAsset)
        declare min_hedge_limit: ExtendedAsset
        @Struct.field(ExtendedAsset)
        declare hedge_amount: ExtendedAsset
        @Struct.field(Name)
        declare delphi_usd_scope: Name
        @Struct.field(Asset)
        declare loan_fee: Asset
        @Struct.field(ExtendedAsset)
        declare withdraw_equal_fee: ExtendedAsset
        @Struct.field('bool')
        declare is_stable_token: boolean
        @Struct.field('bool')
        declare is_withdraw_paused: boolean
    }
    @Struct.type('crypto_transfer')
    export class crypto_transfer extends Struct {
        @Struct.field(Name)
        declare from: Name
        @Struct.field(Name)
        declare to: Name
        @Struct.field(UInt64)
        declare pair_id: UInt64
        @Struct.field(ExtendedAsset)
        declare quantity: ExtendedAsset
        @Struct.field('string')
        declare memo: string
    }
    @Struct.type('crypto_withdraw_log')
    export class crypto_withdraw_log extends Struct {
        @Struct.field(Name)
        declare account: Name
        @Struct.field(UInt64)
        declare pair_id: UInt64
        @Struct.field(ExtendedAsset)
        declare quantity: ExtendedAsset
        @Struct.field(ExtendedAsset)
        declare fee: ExtendedAsset
    }
    @Struct.type('deposit_log')
    export class deposit_log extends Struct {
        @Struct.field(Name)
        declare from: Name
        @Struct.field(ExtendedAsset)
        declare crypto_quantity: ExtendedAsset
        @Struct.field('string')
        declare memo: string
        @Struct.field(ExtendedAsset)
        declare bitcash_quantity: ExtendedAsset
    }
    @Struct.type('fill_buy_gem')
    export class fill_buy_gem extends Struct {
        @Struct.field(Name)
        declare buyer: Name
        @Struct.field(UInt64)
        declare id: UInt64
    }
    @Struct.type('fill_sell_gem')
    export class fill_sell_gem extends Struct {
        @Struct.field(Name)
        declare seller: Name
        @Struct.field(UInt64)
        declare id: UInt64
    }
    @Struct.type('forex_pair')
    export class forex_pair extends Struct {
        @Struct.field(UInt64)
        declare id: UInt64
        @Struct.field(extended_symbol)
        declare base_token: extended_symbol
        @Struct.field(extended_symbol)
        declare quote_token: extended_symbol
        @Struct.field(Name)
        declare delphi_scope: Name
        @Struct.field(Asset)
        declare exchange_fee: Asset
        @Struct.field('bool')
        declare is_trading_paused: boolean
    }
    @Struct.type('forex_trade')
    export class forex_trade extends Struct {
        @Struct.field(Name)
        declare account: Name
        @Struct.field(UInt64)
        declare pair_id: UInt64
        @Struct.field(ExtendedAsset)
        declare quantity: ExtendedAsset
    }
    @Struct.type('forex_trade_log')
    export class forex_trade_log extends Struct {
        @Struct.field(Name)
        declare account: Name
        @Struct.field(UInt64)
        declare pair_id: UInt64
        @Struct.field(ExtendedAsset)
        declare amount_in: ExtendedAsset
        @Struct.field(ExtendedAsset)
        declare amount_out: ExtendedAsset
        @Struct.field(ExtendedAsset)
        declare unit_price: ExtendedAsset
        @Struct.field(ExtendedAsset)
        declare fee: ExtendedAsset
    }
    @Struct.type('gem_order')
    export class gem_order extends Struct {
        @Struct.field(UInt64)
        declare id: UInt64
        @Struct.field(ExtendedAsset)
        declare quantity: ExtendedAsset
    }
    @Struct.type('global')
    export class global extends Struct {
        @Struct.field(UInt64)
        declare id: UInt64
        @Struct.field(ExtendedAsset)
        declare total: ExtendedAsset
    }
    @Struct.type('global_pair_value')
    export class global_pair_value extends Struct {
        @Struct.field(UInt64)
        declare pair_id: UInt64
        @Struct.field(ExtendedAsset)
        declare crypto_balance: ExtendedAsset
        @Struct.field(ExtendedAsset)
        declare stable_balance: ExtendedAsset
    }
    @Struct.type('global_row')
    export class global_row extends Struct {
        @Struct.field(ExtendedAsset)
        declare total: ExtendedAsset
    }
    @Struct.type('limit')
    export class limit extends Struct {
        @Struct.field(ExtendedAsset)
        declare max_range: ExtendedAsset
        @Struct.field(ExtendedAsset)
        declare max_value: ExtendedAsset
        @Struct.field(ExtendedAsset)
        declare fee: ExtendedAsset
    }
    @Struct.type('long_trade_log')
    export class long_trade_log extends Struct {
        @Struct.field(Name)
        declare account: Name
        @Struct.field(ExtendedAsset)
        declare quantity: ExtendedAsset
        @Struct.field(ExtendedAsset)
        declare price: ExtendedAsset
    }
    @Struct.type('ltv_level')
    export class ltv_level extends Struct {
        @Struct.field(UInt64)
        declare level: UInt64
        @Struct.field(Asset)
        declare max_user_ratio: Asset
        @Struct.field(Asset)
        declare target_user_ratio: Asset
        @Struct.field(Asset)
        declare min_global_ratio: Asset
        @Struct.field(Asset)
        declare max_global_ratio: Asset
    }
    @Struct.type('ltv_row_entry')
    export class ltv_row_entry extends Struct {
        @Struct.field(UInt64)
        declare id: UInt64
        @Struct.field(Asset)
        declare ltv_ratio: Asset
        @Struct.field(TimePointSec)
        declare date: TimePointSec
    }
    @Struct.type('ltv_row_event')
    export class ltv_row_event extends Struct {
        @Struct.field(UInt64)
        declare id: UInt64
        @Struct.field(UInt64)
        declare next_level: UInt64
        @Struct.field(TimePointSec)
        declare date: TimePointSec
    }
    @Struct.type('migrate_spot_pairs')
    export class migrate_spot_pairs extends Struct {}
    @Struct.type('migrate_spot_positions')
    export class migrate_spot_positions extends Struct {
        @Struct.field(Name)
        declare account: Name
    }
    @Struct.type('migrate_stable_tokens')
    export class migrate_stable_tokens extends Struct {}
    @Struct.type('modify_crypto_token')
    export class modify_crypto_token extends Struct {
        @Struct.field(extended_symbol)
        declare token: extended_symbol
        @Struct.field(Name)
        declare delphi_usd_scope: Name
        @Struct.field(Asset)
        declare loan_fee: Asset
        @Struct.field(ExtendedAsset)
        declare withdraw_equal_fee: ExtendedAsset
        @Struct.field('bool')
        declare is_withdraw_paused: boolean
    }
    @Struct.type('modify_forex_pair')
    export class modify_forex_pair extends Struct {
        @Struct.field(extended_symbol)
        declare base_token: extended_symbol
        @Struct.field(extended_symbol)
        declare quote_token: extended_symbol
        @Struct.field(Asset)
        declare exchange_fee: Asset
        @Struct.field('bool')
        declare is_trading_paused: boolean
    }
    @Struct.type('modify_pair')
    export class modify_pair extends Struct {
        @Struct.field(extended_symbol)
        declare crypto_token: extended_symbol
        @Struct.field(extended_symbol)
        declare stable_token: extended_symbol
        @Struct.field(Asset)
        declare deposit_fee: Asset
        @Struct.field(Asset)
        declare exchange_fee: Asset
        @Struct.field('bool')
        declare is_deposit_paused: boolean
        @Struct.field('bool')
        declare is_trading_paused: boolean
    }
    @Struct.type('order')
    export class order extends Struct {
        @Struct.field(UInt64)
        declare id: UInt64
        @Struct.field(ExtendedAsset)
        declare quantity: ExtendedAsset
        @Struct.field(ExtendedAsset)
        declare fee: ExtendedAsset
    }
    @Struct.type('pair')
    export class pair extends Struct {
        @Struct.field(UInt64)
        declare id: UInt64
        @Struct.field(extended_symbol)
        declare crypto_token: extended_symbol
        @Struct.field(extended_symbol)
        declare stable_token: extended_symbol
        @Struct.field(Name)
        declare delphi_scope: Name
        @Struct.field(Asset)
        declare exchange_fee: Asset
        @Struct.field('bool')
        declare is_deposit_paused: boolean
        @Struct.field('bool')
        declare is_trading_paused: boolean
    }
    @Struct.type('pause')
    export class pause extends Struct {}
    @Struct.type('position')
    export class position extends Struct {
        @Struct.field(UInt64)
        declare pair_id: UInt64
        @Struct.field(ExtendedAsset)
        declare balance: ExtendedAsset
        @Struct.field(ExtendedAsset)
        declare balance_blocked: ExtendedAsset
        @Struct.field(TimePointSec)
        declare last_withdraw_date: TimePointSec
    }
    @Struct.type('position_v2_row')
    export class position_v2_row extends Struct {
        @Struct.field(UInt64)
        declare pair_id: UInt64
        @Struct.field(ExtendedAsset)
        declare balance: ExtendedAsset
        @Struct.field(ExtendedAsset)
        declare balance_blocked: ExtendedAsset
    }
    @Struct.type('sell_gem')
    export class sell_gem extends Struct {
        @Struct.field(Name)
        declare seller: Name
        @Struct.field(ExtendedAsset)
        declare quantity: ExtendedAsset
    }
    @Struct.type('sell_p2p')
    export class sell_p2p extends Struct {
        @Struct.field(Name)
        declare seller: Name
        @Struct.field(ExtendedAsset)
        declare quantity: ExtendedAsset
        @Struct.field(ExtendedAsset)
        declare fee: ExtendedAsset
    }
    @Struct.type('sell_p2p_log')
    export class sell_p2p_log extends Struct {
        @Struct.field(Name)
        declare seller: Name
        @Struct.field(ExtendedAsset)
        declare quantity: ExtendedAsset
        @Struct.field(ExtendedAsset)
        declare fee: ExtendedAsset
        @Struct.field(UInt64)
        declare id: UInt64
    }
    @Struct.type('set_config')
    export class set_config extends Struct {
        @Struct.field(ExtendedAsset)
        declare total_deposit_limit: ExtendedAsset
        @Struct.field(ExtendedAsset)
        declare account_deposit_limit: ExtendedAsset
    }
    @Struct.type('set_ltv_level')
    export class set_ltv_level extends Struct {
        @Struct.field(UInt64)
        declare level: UInt64
        @Struct.field(Asset)
        declare max_user_ratio: Asset
        @Struct.field(Asset)
        declare target_user_ratio: Asset
        @Struct.field(Asset)
        declare min_global_ratio: Asset
        @Struct.field(Asset)
        declare max_global_ratio: Asset
    }
    @Struct.type('set_withdraw_limit')
    export class set_withdraw_limit extends Struct {
        @Struct.field(ExtendedAsset)
        declare max_range: ExtendedAsset
        @Struct.field(ExtendedAsset)
        declare max_value: ExtendedAsset
        @Struct.field(ExtendedAsset)
        declare fee: ExtendedAsset
    }
    @Struct.type('short_trade_log')
    export class short_trade_log extends Struct {
        @Struct.field(Name)
        declare account: Name
        @Struct.field(ExtendedAsset)
        declare quantity: ExtendedAsset
        @Struct.field(ExtendedAsset)
        declare price: ExtendedAsset
    }
    @Struct.type('spot_pair_v2_row')
    export class spot_pair_v2_row extends Struct {
        @Struct.field(UInt64)
        declare id: UInt64
        @Struct.field(extended_symbol)
        declare crypto_token: extended_symbol
        @Struct.field(extended_symbol)
        declare stable_token: extended_symbol
        @Struct.field(Name)
        declare delphi_scope: Name
        @Struct.field(Asset)
        declare deposit_fee: Asset
        @Struct.field(Asset)
        declare exchange_fee: Asset
        @Struct.field('bool')
        declare is_deposit_paused: boolean
        @Struct.field('bool')
        declare is_trading_paused: boolean
    }
    @Struct.type('spot_stable_position')
    export class spot_stable_position extends Struct {
        @Struct.field(UInt64)
        declare id: UInt64
        @Struct.field(ExtendedAsset)
        declare balance: ExtendedAsset
    }
    @Struct.type('spot_stable_position_v2')
    export class spot_stable_position_v2 extends Struct {
        @Struct.field(ExtendedAsset)
        declare balance: ExtendedAsset
        @Struct.field(ExtendedAsset)
        declare balance_blocked: ExtendedAsset
    }
    @Struct.type('stable_token')
    export class stable_token extends Struct {
        @Struct.field(UInt64)
        declare id: UInt64
        @Struct.field(ExtendedAsset)
        declare total_spot: ExtendedAsset
    }
    @Struct.type('stable_transfer')
    export class stable_transfer extends Struct {
        @Struct.field(Name)
        declare from: Name
        @Struct.field(Name)
        declare to: Name
        @Struct.field(ExtendedAsset)
        declare quantity: ExtendedAsset
        @Struct.field('string')
        declare memo: string
    }
    @Struct.type('stable_withdraw_log')
    export class stable_withdraw_log extends Struct {
        @Struct.field(Name)
        declare account: Name
        @Struct.field(ExtendedAsset)
        declare quantity: ExtendedAsset
        @Struct.field(ExtendedAsset)
        declare fee: ExtendedAsset
        @Struct.field(ExtendedAsset)
        declare receive_quantity: ExtendedAsset
    }
    @Struct.type('unpause')
    export class unpause extends Struct {}
    @Struct.type('withdraw')
    export class withdraw extends Struct {
        @Struct.field(Name)
        declare account: Name
        @Struct.field(UInt64)
        declare pair_id: UInt64
        @Struct.field(ExtendedAsset)
        declare quantity: ExtendedAsset
    }
    @Struct.type('withdraw_period')
    export class withdraw_period extends Struct {
        @Struct.field(Name)
        declare account: Name
        @Struct.field(TimePointSec)
        declare updated_at: TimePointSec
    }
    @Struct.type('withdraw_stable')
    export class withdraw_stable extends Struct {
        @Struct.field(Name)
        declare account: Name
        @Struct.field(ExtendedAsset)
        declare quantity: ExtendedAsset
    }
}
export const TableMap = {
    buygemsords: Types.gem_order,
    config: Types.config_row,
    cryptotokens: Types.crypto_token,
    forexpairs: Types.forex_pair,
    glbpaircoll: Types.global_pair_value,
    glbpairloan: Types.global_pair_value,
    glbtotalcoll: Types.global,
    glbtotalloan: Types.global,
    glbttlcollv2: Types.global_row,
    glbttlloanv2: Types.global_row,
    limits: Types.limit,
    ltvdaily: Types.ltv_row_entry,
    ltvevent: Types.ltv_row_event,
    ltvhourly: Types.ltv_row_entry,
    ltvlevels: Types.ltv_level,
    marginv2: Types.position_v2_row,
    p2porders: Types.order,
    pairs: Types.pair,
    sellgemsords: Types.gem_order,
    spot: Types.position,
    spotpairsv2: Types.spot_pair_v2_row,
    spotv2: Types.position_v2_row,
    stable: Types.spot_stable_position,
    stabletokens: Types.stable_token,
    stablev2: Types.spot_stable_position_v2,
    stbltokensv2: Types.global_row,
    wdlperiods: Types.withdraw_period,
}
export interface TableTypes {
    buygemsords: Types.gem_order
    config: Types.config_row
    cryptotokens: Types.crypto_token
    forexpairs: Types.forex_pair
    glbpaircoll: Types.global_pair_value
    glbpairloan: Types.global_pair_value
    glbtotalcoll: Types.global
    glbtotalloan: Types.global
    glbttlcollv2: Types.global_row
    glbttlloanv2: Types.global_row
    limits: Types.limit
    ltvdaily: Types.ltv_row_entry
    ltvevent: Types.ltv_row_event
    ltvhourly: Types.ltv_row_entry
    ltvlevels: Types.ltv_level
    marginv2: Types.position_v2_row
    p2porders: Types.order
    pairs: Types.pair
    sellgemsords: Types.gem_order
    spot: Types.position
    spotpairsv2: Types.spot_pair_v2_row
    spotv2: Types.position_v2_row
    stable: Types.spot_stable_position
    stabletokens: Types.stable_token
    stablev2: Types.spot_stable_position_v2
    stbltokensv2: Types.global_row
    wdlperiods: Types.withdraw_period
}
export type RowType<T> = T extends keyof TableTypes ? TableTypes[T] : any
export type TableNames = keyof TableTypes
export namespace ActionParams {
    export namespace Type {
        export interface extended_symbol {
            sym: Asset.SymbolType
            contract: NameType
        }
    }
    export interface add_crypto_token {
        token: Type.extended_symbol
        min_hedge_limit: ExtendedAssetType
        hedge_amount: ExtendedAssetType
        delphi_usd_scope: NameType
        loan_fee: AssetType
        withdraw_equal_fee: ExtendedAssetType
        is_stable_token: boolean
    }
    export interface add_forex_pair {
        base_token: Type.extended_symbol
        quote_token: Type.extended_symbol
        delphi_scope: NameType
        exchange_fee: AssetType
    }
    export interface add_pair {
        crypto_token: Type.extended_symbol
        stable_token: Type.extended_symbol
        delphi_scope: NameType
        deposit_fee: AssetType
        exchange_fee: AssetType
    }
    export interface add_stable_token {
        token: Type.extended_symbol
    }
    export interface buy_gem {
        buyer: NameType
        quantity: ExtendedAssetType
    }
    export interface cancel_p2p {
        seller: NameType
        id: UInt64Type
    }
    export interface cancel_buy_gem {
        buyer: NameType
        id: UInt64Type
    }
    export interface cancel_sell_gem {
        seller: NameType
        id: UInt64Type
    }
    export interface confirm_p2p {
        seller: NameType
        buyer: NameType
        id: UInt64Type
    }
    export interface crypto_transfer {
        from: NameType
        to: NameType
        pair_id: UInt64Type
        quantity: ExtendedAssetType
        memo: string
    }
    export interface crypto_withdraw_log {
        account: NameType
        pair_id: UInt64Type
        quantity: ExtendedAssetType
        fee: ExtendedAssetType
    }
    export interface deposit_log {
        from: NameType
        crypto_quantity: ExtendedAssetType
        memo: string
        bitcash_quantity: ExtendedAssetType
    }
    export interface fill_buy_gem {
        buyer: NameType
        id: UInt64Type
    }
    export interface fill_sell_gem {
        seller: NameType
        id: UInt64Type
    }
    export interface forex_trade {
        account: NameType
        pair_id: UInt64Type
        quantity: ExtendedAssetType
    }
    export interface forex_trade_log {
        account: NameType
        pair_id: UInt64Type
        amount_in: ExtendedAssetType
        amount_out: ExtendedAssetType
        unit_price: ExtendedAssetType
        fee: ExtendedAssetType
    }
    export interface long_trade_log {
        account: NameType
        quantity: ExtendedAssetType
        price: ExtendedAssetType
    }
    export interface modify_crypto_token {
        token: Type.extended_symbol
        delphi_usd_scope: NameType
        loan_fee: AssetType
        withdraw_equal_fee: ExtendedAssetType
        is_withdraw_paused: boolean
    }
    export interface modify_forex_pair {
        base_token: Type.extended_symbol
        quote_token: Type.extended_symbol
        exchange_fee: AssetType
        is_trading_paused: boolean
    }
    export interface modify_pair {
        crypto_token: Type.extended_symbol
        stable_token: Type.extended_symbol
        deposit_fee: AssetType
        exchange_fee: AssetType
        is_deposit_paused: boolean
        is_trading_paused: boolean
    }
    export interface migrate_spot_pairs {}
    export interface migrate_spot_positions {
        account: NameType
    }
    export interface migrate_stable_tokens {}
    export interface pause {}
    export interface sell_gem {
        seller: NameType
        quantity: ExtendedAssetType
    }
    export interface sell_p2p {
        seller: NameType
        quantity: ExtendedAssetType
        fee: ExtendedAssetType
    }
    export interface sell_p2p_log {
        seller: NameType
        quantity: ExtendedAssetType
        fee: ExtendedAssetType
        id: UInt64Type
    }
    export interface set_config {
        total_deposit_limit: ExtendedAssetType
        account_deposit_limit: ExtendedAssetType
    }
    export interface set_ltv_level {
        level: UInt64Type
        max_user_ratio: AssetType
        target_user_ratio: AssetType
        min_global_ratio: AssetType
        max_global_ratio: AssetType
    }
    export interface set_withdraw_limit {
        max_range: ExtendedAssetType
        max_value: ExtendedAssetType
        fee: ExtendedAssetType
    }
    export interface short_trade_log {
        account: NameType
        quantity: ExtendedAssetType
        price: ExtendedAssetType
    }
    export interface stable_transfer {
        from: NameType
        to: NameType
        quantity: ExtendedAssetType
        memo: string
    }
    export interface stable_withdraw_log {
        account: NameType
        quantity: ExtendedAssetType
        fee: ExtendedAssetType
        receive_quantity: ExtendedAssetType
    }
    export interface unpause {}
    export interface withdraw {
        account: NameType
        pair_id: UInt64Type
        quantity: ExtendedAssetType
    }
    export interface withdraw_stable {
        account: NameType
        quantity: ExtendedAssetType
    }
}
export interface ActionNameParams {
    addcrptoken: ActionParams.addcrptoken
    addforexpair: ActionParams.addforexpair
    addpair: ActionParams.addpair
    addstbtoken: ActionParams.addstbtoken
    buygem: ActionParams.buygem
    cancelp2p: ActionParams.cancelp2p
    cnlbuygem: ActionParams.cnlbuygem
    cnlsellgem: ActionParams.cnlsellgem
    confirmp2p: ActionParams.confirmp2p
    crptransfer: ActionParams.crptransfer
    crpwdllog: ActionParams.crpwdllog
    depositlog: ActionParams.depositlog
    fillbuygem: ActionParams.fillbuygem
    fillsellgem: ActionParams.fillsellgem
    forextrade: ActionParams.forextrade
    fxtrdlog: ActionParams.fxtrdlog
    longtrdlog: ActionParams.longtrdlog
    mdfcrptoken: ActionParams.mdfcrptoken
    mdfforexpair: ActionParams.mdfforexpair
    mdfpair: ActionParams.mdfpair
    mgrspotpairs: ActionParams.mgrspotpairs
    mgrspotpos: ActionParams.mgrspotpos
    mgrstbtkns: ActionParams.mgrstbtkns
    pause: ActionParams.pause
    sellgem: ActionParams.sellgem
    sellp2p: ActionParams.sellp2p
    sellp2plog: ActionParams.sellp2plog
    setconfig: ActionParams.setconfig
    setltvlevel: ActionParams.setltvlevel
    setwdlmt: ActionParams.setwdlmt
    shorttrdlog: ActionParams.shorttrdlog
    stbtransfer: ActionParams.stbtransfer
    stbwdllog: ActionParams.stbwdllog
    unpause: ActionParams.unpause
    withdraw: ActionParams.withdraw
    withdrawstbl: ActionParams.withdrawstbl
}
export type ActionNames = keyof ActionNameParams
export class Contract extends BaseContract {
    constructor(args: PartialBy<ContractArgs, 'abi' | 'account'>) {
        super({
            client: args.client,
            abi: abi,
            account: args.account || Name.from('bank.bk'),
        })
    }
    action<T extends ActionNames>(
        name: T,
        data: ActionNameParams[T],
        options?: ActionOptions
    ): Action {
        return super.action(name, data, options)
    }
    table<T extends TableNames>(name: T, scope?: NameType): Table<RowType<T>> {
        return super.table(name, scope, TableMap[name])
    }
}

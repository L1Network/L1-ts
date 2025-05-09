import type {
    Action,
    AssetType,
    Checksum256Type,
    NameType,
    UInt16Type,
    UInt64Type,
} from '@wharfkit/antelope'
import {
    ABI,
    Asset,
    Blob,
    Checksum256,
    Float64,
    Int64,
    Name,
    PublicKey,
    Struct,
    TimePoint,
    UInt16,
    UInt32,
    UInt64,
} from '@wharfkit/antelope'
import type {ActionOptions, ContractArgs, PartialBy, Table} from '@wharfkit/contract'
import {Contract as BaseContract} from '@wharfkit/contract'
export const abiBlob = Blob.from(
    'DmVvc2lvOjphYmkvMS4yAQphc3NldF90eXBlBnVpbnQxNiQHYWJ1c2VycwACBG5hbWUEbmFtZQV2b3RlcwZ1aW50NjQMYWRkY3VzdG9kaWFuAAEEbmFtZQRuYW1lBGJhcnMABQJpZAZ1aW50NjQEaGlnaAZ1aW50NjQDbG93BnVpbnQ2NAZtZWRpYW4GdWludDY0CXRpbWVzdGFtcAp0aW1lX3BvaW50DGNhbmNlbGJvdW50eQACBG5hbWUEbmFtZQZyZWFzb24Gc3RyaW5nBWNsYWltAAEFb3duZXIEbmFtZQVjbGVhcgABBHBhaXIEbmFtZQljb25maWd1cmUAAQFnC2dsb2JhbGlucHV0CmN1c3RvZGlhbnMAAQRuYW1lBG5hbWUKZGF0YXBvaW50cwAFAmlkBnVpbnQ2NAVvd25lcgRuYW1lBXZhbHVlBnVpbnQ2NAZtZWRpYW4GdWludDY0CXRpbWVzdGFtcAp0aW1lX3BvaW50DGRlbGN1c3RvZGlhbgABBG5hbWUEbmFtZQpkZWxldGVwYWlyAAIEbmFtZQRuYW1lBnJlYXNvbgZzdHJpbmcJZG9uYXRpb25zAAUCaWQGdWludDY0B2RvbmF0b3IEbmFtZQRwYWlyBG5hbWUJdGltZXN0YW1wCnRpbWVfcG9pbnQGYW1vdW50BWFzc2V0CmVkaXRib3VudHkAAgRuYW1lBG5hbWUEcGFpcglwYWlyaW5wdXQIZWRpdHBhaXIAAQRwYWlyBXBhaXJzC2ZvcmZlaXRoYXNoAAEFb3duZXIEbmFtZQZnbG9iYWwADgJpZAZ1aW50NjQWdG90YWxfZGF0YXBvaW50c19jb3VudAZ1aW50NjQNdG90YWxfY2xhaW1lZAVhc3NldBlkYXRhcG9pbnRzX3Blcl9pbnN0cnVtZW50BnVpbnQ2NBNiYXJzX3Blcl9pbnN0cnVtZW50BnVpbnQ2NA12b3RlX2ludGVydmFsBnVpbnQ2NA53cml0ZV9jb29sZG93bgZ1aW50NjQSYXBwcm92ZXJfdGhyZXNob2xkBnVpbnQ2NBthcHByb3Zpbmdfb3JhY2xlc190aHJlc2hvbGQGdWludDY0HmFwcHJvdmluZ19jdXN0b2RpYW5zX3RocmVzaG9sZAZ1aW50NjQMbWluaW11bV9yYW5rBnVpbnQ2NARwYWlkBnVpbnQ2NBBtaW5fYm91bnR5X2RlbGF5BnVpbnQ2NBBuZXdfYm91bnR5X2RlbGF5BnVpbnQ2NAtnbG9iYWxpbnB1dAALGWRhdGFwb2ludHNfcGVyX2luc3RydW1lbnQGdWludDY0E2JhcnNfcGVyX2luc3RydW1lbnQGdWludDY0DXZvdGVfaW50ZXJ2YWwGdWludDY0DndyaXRlX2Nvb2xkb3duBnVpbnQ2NBJhcHByb3Zlcl90aHJlc2hvbGQGdWludDY0G2FwcHJvdmluZ19vcmFjbGVzX3RocmVzaG9sZAZ1aW50NjQeYXBwcm92aW5nX2N1c3RvZGlhbnNfdGhyZXNob2xkBnVpbnQ2NAxtaW5pbXVtX3JhbmsGdWludDY0BHBhaWQGdWludDY0EG1pbl9ib3VudHlfZGVsYXkGdWludDY0EG5ld19ib3VudHlfZGVsYXkGdWludDY0Bmhhc2hlcwAGAmlkBnVpbnQ2NAVvd25lcgRuYW1lCm11bHRpcGFydHkLY2hlY2tzdW0yNTYEaGFzaAtjaGVja3N1bTI1NgZyZXZlYWwGc3RyaW5nCXRpbWVzdGFtcAp0aW1lX3BvaW50C21pZ3JhdGVkYXRhAAAIbmV0d29ya3MAAQRuYW1lBG5hbWUJbmV3Ym91bnR5AAIIcHJvcG9zZXIEbmFtZQRwYWlyCXBhaXJpbnB1dAdvZ2xvYmFsAAICaWQGdWludDY0FnRvdGFsX2RhdGFwb2ludHNfY291bnQGdWludDY0CXBhaXJpbnB1dAAIBG5hbWUEbmFtZQtiYXNlX3N5bWJvbAZzeW1ib2wJYmFzZV90eXBlCmFzc2V0X3R5cGUNYmFzZV9jb250cmFjdARuYW1lDHF1b3RlX3N5bWJvbAZzeW1ib2wKcXVvdGVfdHlwZQphc3NldF90eXBlDnF1b3RlX2NvbnRyYWN0BG5hbWUQcXVvdGVkX3ByZWNpc2lvbgZ1aW50NjQFcGFpcnMADwZhY3RpdmUEYm9vbA5ib3VudHlfYXdhcmRlZARib29sG2JvdW50eV9lZGl0ZWRfYnlfY3VzdG9kaWFucwRib29sCHByb3Bvc2VyBG5hbWUEbmFtZQRuYW1lDWJvdW50eV9hbW91bnQFYXNzZXQUYXBwcm92aW5nX2N1c3RvZGlhbnMGbmFtZVtdEWFwcHJvdmluZ19vcmFjbGVzBm5hbWVbXQtiYXNlX3N5bWJvbAZzeW1ib2wJYmFzZV90eXBlCmFzc2V0X3R5cGUNYmFzZV9jb250cmFjdARuYW1lDHF1b3RlX3N5bWJvbAZzeW1ib2wKcXVvdGVfdHlwZQphc3NldF90eXBlDnF1b3RlX2NvbnRyYWN0BG5hbWUQcXVvdGVkX3ByZWNpc2lvbgZ1aW50NjQNcHJvZHVjZXJfaW5mbwAIBW93bmVyBG5hbWULdG90YWxfdm90ZXMHZmxvYXQ2NAxwcm9kdWNlcl9rZXkKcHVibGljX2tleQlpc19hY3RpdmUEYm9vbAN1cmwGc3RyaW5nDXVucGFpZF9ibG9ja3MGdWludDMyD2xhc3RfY2xhaW1fdGltZQp0aW1lX3BvaW50CGxvY2F0aW9uBnVpbnQxNgVxdW90ZQACBXZhbHVlBnVpbnQ2NARwYWlyBG5hbWUHcmVndXNlcgABBW93bmVyBG5hbWUFc3RhdHMABQVvd25lcgRuYW1lCXRpbWVzdGFtcAp0aW1lX3BvaW50BWNvdW50BnVpbnQ2NApsYXN0X2NsYWltCnRpbWVfcG9pbnQHYmFsYW5jZQVhc3NldAx1bnZvdGVib3VudHkAAgVvd25lcgRuYW1lBmJvdW50eQRuYW1lC3VwZGF0ZXVzZXJzAAAFdXNlcnMABARuYW1lBG5hbWUMY29udHJpYnV0aW9uBWFzc2V0BXNjb3JlBnVpbnQ2NBJjcmVhdGlvbl90aW1lc3RhbXAKdGltZV9wb2ludAp2b3RlYWJ1c2VyAAIFb3duZXIEbmFtZQZhYnVzZXIEbmFtZQp2b3RlYm91bnR5AAIFb3duZXIEbmFtZQZib3VudHkEbmFtZQp2b3Rlcl9pbmZvAAoFb3duZXIEbmFtZQVwcm94eQRuYW1lCXByb2R1Y2VycwZuYW1lW10Gc3Rha2VkBWludDY0EGxhc3Rfdm90ZV93ZWlnaHQHZmxvYXQ2NBNwcm94aWVkX3ZvdGVfd2VpZ2h0B2Zsb2F0NjQIaXNfcHJveHkEYm9vbAZmbGFnczEGdWludDMyCXJlc2VydmVkMgZ1aW50MzIJcmVzZXJ2ZWQzBWFzc2V0BXdyaXRlAAIFb3duZXIEbmFtZQZxdW90ZXMHcXVvdGVbXQl3cml0ZWhhc2gAAwVvd25lcgRuYW1lBGhhc2gLY2hlY2tzdW0yNTYGcmV2ZWFsBnN0cmluZxMwjUs0Y41SMgxhZGRjdXN0b2RpYW4A4PPU9ESFpkEMY2FuY2VsYm91bnR5AAAAAAAA6UxEBWNsYWltAAAAAACAa1REBWNsZWFyAAAAUFcztyZFCWNvbmZpZ3VyZQAwjUs0Y42iSgxkZWxjdXN0b2RpYW4AAMB1pqqsokoKZGVsZXRlcGFpcgAAgM9T05NdUgplZGl0Ym91bnR5AAAAANeZml1SCGVkaXRwYWlyAAAaNi07tS5dC2ZvcmZlaXRoYXNoAABMNkllc5mTC21pZ3JhdGVkYXRhAAAA8HlqeriaCW5ld2JvdW50eQAAAADgKqyZugdyZWd1c2VyAODz1PSoTPfUDHVudm90ZWJvdW50eQAA8FVYq2xS1Qt1cGRhdGV1c2VycwAAwFVYH6My3Qp2b3RlYWJ1c2VyAACAz1PTozLdCnZvdGVib3VudHkAAAAAAACV3eUFd3JpdGUAAABo2DSV3eUJd3JpdGVoYXNoAA8AAAAAX4X1MQNpNjQAAAdhYnVzZXJzAAAAAACArzkDaTY0AAAEYmFycwAAnsYlmrFGA2k2NAAACmN1c3RvZGlhbnMAAM7T0WqySQNpNjQAAApkYXRhcG9pbnRzAADAk7psJk0DaTY0AAAJZG9uYXRpb25zAAAAAERzaGQDaTY0AAAGZ2xvYmFsAAAAAGDVsGkDaTY0AAAGaGFzaGVzAAAAGF7Ks5oDaTY0AAAIbmV0d29ya3MAAAAA4OtMnQNpNjQAAAVwYWlycwAAACCaQyOjA2k2NAAAB29nbG9iYWwAAAAAAHydqQNpNjQAAAVwYWlycwAAwFchneitA2k2NAAADXByb2R1Y2VyX2luZm8AAAAAAJxNxgNpNjQAAAVzdGF0cwAAAAAAfBXWA2k2NAAABXVzZXJzAAAAAOCrMt0DaTY0AAAKdm90ZXJfaW5mbwAAAAAA'
)
export const abi = ABI.from(abiBlob)
export namespace Types {
    @Struct.type('abusers')
    export class abusers extends Struct {
        @Struct.field(Name)
        declare name: Name
        @Struct.field(UInt64)
        declare votes: UInt64
    }
    @Struct.type('addcustodian')
    export class addcustodian extends Struct {
        @Struct.field(Name)
        declare name: Name
    }
    @Struct.type('bars')
    export class bars extends Struct {
        @Struct.field(UInt64)
        declare id: UInt64
        @Struct.field(UInt64)
        declare high: UInt64
        @Struct.field(UInt64)
        declare low: UInt64
        @Struct.field(UInt64)
        declare median: UInt64
        @Struct.field(TimePoint)
        declare timestamp: TimePoint
    }
    @Struct.type('cancelbounty')
    export class cancelbounty extends Struct {
        @Struct.field(Name)
        declare name: Name
        @Struct.field('string')
        declare reason: string
    }
    @Struct.type('claim')
    export class claim extends Struct {
        @Struct.field(Name)
        declare owner: Name
    }
    @Struct.type('clear')
    export class clear extends Struct {
        @Struct.field(Name)
        declare pair: Name
    }
    @Struct.type('globalinput')
    export class globalinput extends Struct {
        @Struct.field(UInt64)
        declare datapoints_per_instrument: UInt64
        @Struct.field(UInt64)
        declare bars_per_instrument: UInt64
        @Struct.field(UInt64)
        declare vote_interval: UInt64
        @Struct.field(UInt64)
        declare write_cooldown: UInt64
        @Struct.field(UInt64)
        declare approver_threshold: UInt64
        @Struct.field(UInt64)
        declare approving_oracles_threshold: UInt64
        @Struct.field(UInt64)
        declare approving_custodians_threshold: UInt64
        @Struct.field(UInt64)
        declare minimum_rank: UInt64
        @Struct.field(UInt64)
        declare paid: UInt64
        @Struct.field(UInt64)
        declare min_bounty_delay: UInt64
        @Struct.field(UInt64)
        declare new_bounty_delay: UInt64
    }
    @Struct.type('configure')
    export class configure extends Struct {
        @Struct.field(globalinput)
        declare g: globalinput
    }
    @Struct.type('custodians')
    export class custodians extends Struct {
        @Struct.field(Name)
        declare name: Name
    }
    @Struct.type('datapoints')
    export class datapoints extends Struct {
        @Struct.field(UInt64)
        declare id: UInt64
        @Struct.field(Name)
        declare owner: Name
        @Struct.field(UInt64)
        declare value: UInt64
        @Struct.field(UInt64)
        declare median: UInt64
        @Struct.field(TimePoint)
        declare timestamp: TimePoint
    }
    @Struct.type('delcustodian')
    export class delcustodian extends Struct {
        @Struct.field(Name)
        declare name: Name
    }
    @Struct.type('deletepair')
    export class deletepair extends Struct {
        @Struct.field(Name)
        declare name: Name
        @Struct.field('string')
        declare reason: string
    }
    @Struct.type('donations')
    export class donations extends Struct {
        @Struct.field(UInt64)
        declare id: UInt64
        @Struct.field(Name)
        declare donator: Name
        @Struct.field(Name)
        declare pair: Name
        @Struct.field(TimePoint)
        declare timestamp: TimePoint
        @Struct.field(Asset)
        declare amount: Asset
    }
    @Struct.type('pairinput')
    export class pairinput extends Struct {
        @Struct.field(Name)
        declare name: Name
        @Struct.field(Asset.Symbol)
        declare base_symbol: Asset.Symbol
        @Struct.field(UInt16)
        declare base_type: UInt16
        @Struct.field(Name)
        declare base_contract: Name
        @Struct.field(Asset.Symbol)
        declare quote_symbol: Asset.Symbol
        @Struct.field(UInt16)
        declare quote_type: UInt16
        @Struct.field(Name)
        declare quote_contract: Name
        @Struct.field(UInt64)
        declare quoted_precision: UInt64
    }
    @Struct.type('editbounty')
    export class editbounty extends Struct {
        @Struct.field(Name)
        declare name: Name
        @Struct.field(pairinput)
        declare pair: pairinput
    }
    @Struct.type('pairs')
    export class pairs extends Struct {
        @Struct.field('bool')
        declare active: boolean
        @Struct.field('bool')
        declare bounty_awarded: boolean
        @Struct.field('bool')
        declare bounty_edited_by_custodians: boolean
        @Struct.field(Name)
        declare proposer: Name
        @Struct.field(Name)
        declare name: Name
        @Struct.field(Asset)
        declare bounty_amount: Asset
        @Struct.field(Name, {array: true})
        declare approving_custodians: Name[]
        @Struct.field(Name, {array: true})
        declare approving_oracles: Name[]
        @Struct.field(Asset.Symbol)
        declare base_symbol: Asset.Symbol
        @Struct.field(UInt16)
        declare base_type: UInt16
        @Struct.field(Name)
        declare base_contract: Name
        @Struct.field(Asset.Symbol)
        declare quote_symbol: Asset.Symbol
        @Struct.field(UInt16)
        declare quote_type: UInt16
        @Struct.field(Name)
        declare quote_contract: Name
        @Struct.field(UInt64)
        declare quoted_precision: UInt64
    }
    @Struct.type('editpair')
    export class editpair extends Struct {
        @Struct.field(pairs)
        declare pair: pairs
    }
    @Struct.type('forfeithash')
    export class forfeithash extends Struct {
        @Struct.field(Name)
        declare owner: Name
    }
    @Struct.type('global')
    export class global extends Struct {
        @Struct.field(UInt64)
        declare id: UInt64
        @Struct.field(UInt64)
        declare total_datapoints_count: UInt64
        @Struct.field(Asset)
        declare total_claimed: Asset
        @Struct.field(UInt64)
        declare datapoints_per_instrument: UInt64
        @Struct.field(UInt64)
        declare bars_per_instrument: UInt64
        @Struct.field(UInt64)
        declare vote_interval: UInt64
        @Struct.field(UInt64)
        declare write_cooldown: UInt64
        @Struct.field(UInt64)
        declare approver_threshold: UInt64
        @Struct.field(UInt64)
        declare approving_oracles_threshold: UInt64
        @Struct.field(UInt64)
        declare approving_custodians_threshold: UInt64
        @Struct.field(UInt64)
        declare minimum_rank: UInt64
        @Struct.field(UInt64)
        declare paid: UInt64
        @Struct.field(UInt64)
        declare min_bounty_delay: UInt64
        @Struct.field(UInt64)
        declare new_bounty_delay: UInt64
    }
    @Struct.type('hashes')
    export class hashes extends Struct {
        @Struct.field(UInt64)
        declare id: UInt64
        @Struct.field(Name)
        declare owner: Name
        @Struct.field(Checksum256)
        declare multiparty: Checksum256
        @Struct.field(Checksum256)
        declare hash: Checksum256
        @Struct.field('string')
        declare reveal: string
        @Struct.field(TimePoint)
        declare timestamp: TimePoint
    }
    @Struct.type('migratedata')
    export class migratedata extends Struct {}
    @Struct.type('networks')
    export class networks extends Struct {
        @Struct.field(Name)
        declare name: Name
    }
    @Struct.type('newbounty')
    export class newbounty extends Struct {
        @Struct.field(Name)
        declare proposer: Name
        @Struct.field(pairinput)
        declare pair: pairinput
    }
    @Struct.type('oglobal')
    export class oglobal extends Struct {
        @Struct.field(UInt64)
        declare id: UInt64
        @Struct.field(UInt64)
        declare total_datapoints_count: UInt64
    }
    @Struct.type('producer_info')
    export class producer_info extends Struct {
        @Struct.field(Name)
        declare owner: Name
        @Struct.field(Float64)
        declare total_votes: Float64
        @Struct.field(PublicKey)
        declare producer_key: PublicKey
        @Struct.field('bool')
        declare is_active: boolean
        @Struct.field('string')
        declare url: string
        @Struct.field(UInt32)
        declare unpaid_blocks: UInt32
        @Struct.field(TimePoint)
        declare last_claim_time: TimePoint
        @Struct.field(UInt16)
        declare location: UInt16
    }
    @Struct.type('quote')
    export class quote extends Struct {
        @Struct.field(UInt64)
        declare value: UInt64
        @Struct.field(Name)
        declare pair: Name
    }
    @Struct.type('reguser')
    export class reguser extends Struct {
        @Struct.field(Name)
        declare owner: Name
    }
    @Struct.type('stats')
    export class stats extends Struct {
        @Struct.field(Name)
        declare owner: Name
        @Struct.field(TimePoint)
        declare timestamp: TimePoint
        @Struct.field(UInt64)
        declare count: UInt64
        @Struct.field(TimePoint)
        declare last_claim: TimePoint
        @Struct.field(Asset)
        declare balance: Asset
    }
    @Struct.type('unvotebounty')
    export class unvotebounty extends Struct {
        @Struct.field(Name)
        declare owner: Name
        @Struct.field(Name)
        declare bounty: Name
    }
    @Struct.type('updateusers')
    export class updateusers extends Struct {}
    @Struct.type('users')
    export class users extends Struct {
        @Struct.field(Name)
        declare name: Name
        @Struct.field(Asset)
        declare contribution: Asset
        @Struct.field(UInt64)
        declare score: UInt64
        @Struct.field(TimePoint)
        declare creation_timestamp: TimePoint
    }
    @Struct.type('voteabuser')
    export class voteabuser extends Struct {
        @Struct.field(Name)
        declare owner: Name
        @Struct.field(Name)
        declare abuser: Name
    }
    @Struct.type('votebounty')
    export class votebounty extends Struct {
        @Struct.field(Name)
        declare owner: Name
        @Struct.field(Name)
        declare bounty: Name
    }
    @Struct.type('voter_info')
    export class voter_info extends Struct {
        @Struct.field(Name)
        declare owner: Name
        @Struct.field(Name)
        declare proxy: Name
        @Struct.field(Name, {array: true})
        declare producers: Name[]
        @Struct.field(Int64)
        declare staked: Int64
        @Struct.field(Float64)
        declare last_vote_weight: Float64
        @Struct.field(Float64)
        declare proxied_vote_weight: Float64
        @Struct.field('bool')
        declare is_proxy: boolean
        @Struct.field(UInt32)
        declare flags1: UInt32
        @Struct.field(UInt32)
        declare reserved2: UInt32
        @Struct.field(Asset)
        declare reserved3: Asset
    }
    @Struct.type('write')
    export class write extends Struct {
        @Struct.field(Name)
        declare owner: Name
        @Struct.field(quote, {array: true})
        declare quotes: quote[]
    }
    @Struct.type('writehash')
    export class writehash extends Struct {
        @Struct.field(Name)
        declare owner: Name
        @Struct.field(Checksum256)
        declare hash: Checksum256
        @Struct.field('string')
        declare reveal: string
    }
}
export const TableMap = {
    abusers: Types.abusers,
    bars: Types.bars,
    custodians: Types.custodians,
    datapoints: Types.datapoints,
    donations: Types.donations,
    global: Types.global,
    hashes: Types.hashes,
    networks: Types.networks,
    npairs: Types.pairs,
    oglobal: Types.oglobal,
    pairs: Types.pairs,
    producers: Types.producer_info,
    stats: Types.stats,
    users: Types.users,
    voters: Types.voter_info,
}
export interface TableTypes {
    abusers: Types.abusers
    bars: Types.bars
    custodians: Types.custodians
    datapoints: Types.datapoints
    donations: Types.donations
    global: Types.global
    hashes: Types.hashes
    networks: Types.networks
    npairs: Types.pairs
    oglobal: Types.oglobal
    pairs: Types.pairs
    producers: Types.producer_info
    stats: Types.stats
    users: Types.users
    voters: Types.voter_info
}
export type RowType<T> = T extends keyof TableTypes ? TableTypes[T] : any
export type TableNames = keyof TableTypes
export namespace ActionParams {
    export namespace Type {
        export interface globalinput {
            datapoints_per_instrument: UInt64Type
            bars_per_instrument: UInt64Type
            vote_interval: UInt64Type
            write_cooldown: UInt64Type
            approver_threshold: UInt64Type
            approving_oracles_threshold: UInt64Type
            approving_custodians_threshold: UInt64Type
            minimum_rank: UInt64Type
            paid: UInt64Type
            min_bounty_delay: UInt64Type
            new_bounty_delay: UInt64Type
        }
        export interface pairinput {
            name: NameType
            base_symbol: Asset.SymbolType
            base_type: UInt16Type
            base_contract: NameType
            quote_symbol: Asset.SymbolType
            quote_type: UInt16Type
            quote_contract: NameType
            quoted_precision: UInt64Type
        }
        export interface pairs {
            active: boolean
            bounty_awarded: boolean
            bounty_edited_by_custodians: boolean
            proposer: NameType
            name: NameType
            bounty_amount: AssetType
            approving_custodians: NameType[]
            approving_oracles: NameType[]
            base_symbol: Asset.SymbolType
            base_type: UInt16Type
            base_contract: NameType
            quote_symbol: Asset.SymbolType
            quote_type: UInt16Type
            quote_contract: NameType
            quoted_precision: UInt64Type
        }
        export interface quote {
            value: UInt64Type
            pair: NameType
        }
    }
    export interface addcustodian {
        name: NameType
    }
    export interface cancelbounty {
        name: NameType
        reason: string
    }
    export interface claim {
        owner: NameType
    }
    export interface clear {
        pair: NameType
    }
    export interface configure {
        g: Type.globalinput
    }
    export interface delcustodian {
        name: NameType
    }
    export interface deletepair {
        name: NameType
        reason: string
    }
    export interface editbounty {
        name: NameType
        pair: Type.pairinput
    }
    export interface editpair {
        pair: Type.pairs
    }
    export interface forfeithash {
        owner: NameType
    }
    export interface migratedata {}
    export interface newbounty {
        proposer: NameType
        pair: Type.pairinput
    }
    export interface reguser {
        owner: NameType
    }
    export interface unvotebounty {
        owner: NameType
        bounty: NameType
    }
    export interface updateusers {}
    export interface voteabuser {
        owner: NameType
        abuser: NameType
    }
    export interface votebounty {
        owner: NameType
        bounty: NameType
    }
    export interface write {
        owner: NameType
        quotes: Type.quote[]
    }
    export interface writehash {
        owner: NameType
        hash: Checksum256Type
        reveal: string
    }
}
export interface ActionNameParams {
    addcustodian: ActionParams.addcustodian
    cancelbounty: ActionParams.cancelbounty
    claim: ActionParams.claim
    clear: ActionParams.clear
    configure: ActionParams.configure
    delcustodian: ActionParams.delcustodian
    deletepair: ActionParams.deletepair
    editbounty: ActionParams.editbounty
    editpair: ActionParams.editpair
    forfeithash: ActionParams.forfeithash
    migratedata: ActionParams.migratedata
    newbounty: ActionParams.newbounty
    reguser: ActionParams.reguser
    unvotebounty: ActionParams.unvotebounty
    updateusers: ActionParams.updateusers
    voteabuser: ActionParams.voteabuser
    votebounty: ActionParams.votebounty
    write: ActionParams.write
    writehash: ActionParams.writehash
}
export type ActionNames = keyof ActionNameParams
export class Contract extends BaseContract {
    constructor(args: PartialBy<ContractArgs, 'abi' | 'account'>) {
        super({
            client: args.client,
            abi: abi,
            account: args.account || Name.from('delphioracle.bk'),
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

import type {Action, Checksum256Type, NameType} from '@wharfkit/antelope'
import {ABI, Blob, Checksum256, Name, Struct} from '@wharfkit/antelope'
import type {ActionOptions, ContractArgs, PartialBy, Table} from '@wharfkit/contract'
import {Contract as BaseContract} from '@wharfkit/contract'
export const abiBlob = Blob.from(
    'DmVvc2lvOjphYmkvMS4yAAcHYWNjb3VudAACBG5hbWUEbmFtZQhyZWZlcnJlcgRuYW1lCWFjY291bnR2MgADB2FjY291bnQEbmFtZQhyZWZlcnJlcgRuYW1lC3JlY292ZXJ5X2lkC2NoZWNrc3VtMjU2BWxvZ2luAAEHYWNjb3VudARuYW1lEG1pZ3JhdGVfYWNjb3VudHMAAANyZWcAAgdhY2NvdW50BG5hbWUIcmVmZXJyZXIEbmFtZQVyZXNldAAAD3NldF9yZWNvdmVyeV9pZAACB2FjY291bnQEbmFtZQtyZWNvdmVyeV9pZAtjaGVja3N1bTI1NgUAAAAAgOkYjQVsb2dpbgCAM0JGZXOZkxBtaWdyYXRlX2FjY291bnRzAAAAAAAAAJi6A3JlZwAAAAAAgKywugVyZXNldAAAAEjubnSzwg9zZXRfcmVjb3ZlcnlfaWQAAgAAADhPTREyA2k2NAAAB2FjY291bnQAgNg4T00RMgNpNjQAAAlhY2NvdW50djIAAAAAAA=='
)
export const abi = ABI.from(abiBlob)
export namespace Types {
    @Struct.type('account')
    export class account extends Struct {
        @Struct.field(Name)
        declare name: Name
        @Struct.field(Name)
        declare referrer: Name
    }
    @Struct.type('accountv2')
    export class accountv2 extends Struct {
        @Struct.field(Name)
        declare account: Name
        @Struct.field(Name)
        declare referrer: Name
        @Struct.field(Checksum256)
        declare recovery_id: Checksum256
    }
    @Struct.type('login')
    export class login extends Struct {
        @Struct.field(Name)
        declare account: Name
    }
    @Struct.type('migrate_accounts')
    export class migrate_accounts extends Struct {}
    @Struct.type('reg')
    export class reg extends Struct {
        @Struct.field(Name)
        declare account: Name
        @Struct.field(Name)
        declare referrer: Name
    }
    @Struct.type('reset')
    export class reset extends Struct {}
    @Struct.type('set_recovery_id')
    export class set_recovery_id extends Struct {
        @Struct.field(Name)
        declare account: Name
        @Struct.field(Checksum256)
        declare recovery_id: Checksum256
    }
}
export const TableMap = {
    accounts: Types.account,
    accountsv2: Types.accountv2,
}
export interface TableTypes {
    accounts: Types.account
    accountsv2: Types.accountv2
}
export type RowType<T> = T extends keyof TableTypes ? TableTypes[T] : any
export type TableNames = keyof TableTypes
export namespace ActionParams {
    export namespace Type {}
    export interface login {
        account: NameType
    }
    export interface migrate_accounts {}
    export interface reg {
        account: NameType
        referrer: NameType
    }
    export interface reset {}
    export interface set_recovery_id {
        account: NameType
        recovery_id: Checksum256Type
    }
}
export interface ActionNameParams {
    login: ActionParams.login
    migrateaccts: ActionParams.migrateaccts
    reg: ActionParams.reg
    reset: ActionParams.reset
    setrcvrid: ActionParams.setrcvrid
}
export type ActionNames = keyof ActionNameParams
export class Contract extends BaseContract {
    constructor(args: PartialBy<ContractArgs, 'abi' | 'account'>) {
        super({
            client: args.client,
            abi: abi,
            account: args.account || Name.from('accounts.bk'),
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

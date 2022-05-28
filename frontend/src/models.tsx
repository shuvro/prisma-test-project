export enum InsuranceType {
    LIABILITY = 'LIABILITY',
    HOUSEHOLD = 'HOUSEHOLD',
    HEALTH = 'HEALTH'
}
export enum PolicyStatus {
    ACTIVE = 'ACTIVE',
    PENDING = 'PENDING',
    CANCELLED = 'CANCELLED',
    DROPPED_OUT = 'DROPPED_OUT'
}
export interface Customer {
    id: string
    firstName: string
    lastName: string
    dateOfBirth: Date
}

export interface Policy {
    id: string
    customer: Customer
    provider: string
    insuranceType: InsuranceType
    status: PolicyStatus
    startDate: Date
    endDate: Date
    createdAt: Date
}

export type valueof<T> = T[keyof T]
export type ElementOf<A extends Array<any>> = A[0]
export type MemberOf<T, V extends keyof T> = T[V]
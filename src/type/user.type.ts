 export type AddUser = {
    email: string,
    firstName: string,
    lastName: string,
    mobile: string,
    countryCode: string,
    multiFactorAuth: boolean,
    TCAgreement: boolean,
    [key: string ]: any,
}

export type splitPayment = {
    item: string,
    subAccount: string,
    percentage: string
}
export interface IClients {
    Id?: number;
    Title?: string;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    EmailAddress: string;
    PhoneNumber: string;
    ClientStatus: string;
    ClientCode: string;
    ClientAddress: string;
    UserId: number | string;
    UserEmail?: string;
    Industry: string;
    Website: string;
}

export interface IClientsView extends IClients {
    ID?: number;
    UserValue?: string;
    User?: any;
}
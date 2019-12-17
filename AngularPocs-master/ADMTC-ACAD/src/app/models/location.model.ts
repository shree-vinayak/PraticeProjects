export class Location {
    id: string;
    AddressLine1: string;
    AddressLine2: string;
    ZipCode: string;
    City: string;
    Country: number
    constructor() {
        this.id = "";
        this.AddressLine1 = "";
        this.AddressLine2 = "";
        this.ZipCode = "";
        this.City = "";
        this.Country = 0;
    }
}

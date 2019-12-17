export class AcadStudentDetails {
    _id: string;
    user: string;   // ObjRef to AcadUser
    studentInfo: {
        address: {
            line1: string,
            line2: string,
            zipCode: string,
            city: string,
            country: string
        },
        telephone: string,
        cellphone: string,
        studiesFinancedBy: string,
        photo: string               //address to photo file
    };
    guardians: {
        relation: string,
        firstname: string,
        familyname: string,
        address: {
            line1: string,
            line2: string,
            zipCode: string,
            city: string,
            country: string
        },
        telephone: string,
        cellphone: string
    }[];                        //multiple guardians
    status: string;
}
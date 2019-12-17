export class UserList {
    id: string;
    name: string;
    affiliation: string;
    crpc: string;
    userType: string;
    rncptitle: string;
    certifierID: string;
    RNCPTitleID: string;
    preparationCenterID: string;
    userTypeID: string;
    

    constructor(id: string, name: string, affiliation: string, crpc: string, userType: string, rncptitle: string, certifierID: string, RNCPTitleID: string, preparationCenterID: string, userTypeID: string) {
        this.id = id;
        this.name = name;
        this.affiliation = affiliation;
        this.crpc = crpc;
        this.userType = userType;
        this.rncptitle = rncptitle;
        this.certifierID = certifierID;
        this.RNCPTitleID = RNCPTitleID;
        this.preparationCenterID = preparationCenterID;
        this.userTypeID = userTypeID;
    }
}

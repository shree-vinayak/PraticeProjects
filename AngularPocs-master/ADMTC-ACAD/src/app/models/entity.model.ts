export class Entity {
    type: string;
    school: string | string[];
    company: string;
    groupOfSchools ?: any[];

    constructor() {
        this.type = null;
        this.school = null;
        this.company = null;
        this.groupOfSchools = null;
    }
}

export class JobDescription {
	_id: string;
	jobName: string;
	status: string;
	studentIdentity: {
		firstName: string; // comes from student collection
		lastName: string;// comes from student collection
		email: string; // comes from student collection
	};
	datesOfTheMission: {
		from: Date;
		to: Date
	};
	mainMissionOfTheDepartment: string;
	organizationOfTheDepartment: string;
	mainMission: string;
	missionsActivitiesAutonomy: {
		missions: string;
		activities: string;
		autonomyLevel: string
	}[];
	knowledge: string[];
	knowHow: string[];
	objectivesOfTheDepartment: string[];
	expectedFromTheStudent: {
		contribution: string;
		objectives: string
	}[];
	signatureOfTheStudent: boolean;
	signatureOfTheCompanyMentor: boolean;
	studentId?: any;
	mentor: object;
	company: object;
	sendNotification?: boolean;
	constructor() {
		this.jobName = "";
		this.studentIdentity = {
			firstName: "", // comes from student collection
			lastName: "", // comes from student collection
			email: "" // comes from student collection
		};
		this.datesOfTheMission = {
			from: new Date(),
			to: new Date()
		};
		this.status = "";
		this.mainMissionOfTheDepartment = "";
		this.organizationOfTheDepartment = "";
		this.mainMission = "";
		this.missionsActivitiesAutonomy = [{
			missions: "",
			activities: "",
			autonomyLevel: ""
		}];
		this.knowledge = [];
		this.knowHow = [];
		this.objectivesOfTheDepartment = [];
		this.expectedFromTheStudent = [{
			contribution: "",
			objectives: ""
		}];
		this.signatureOfTheStudent = false;
		this.signatureOfTheCompanyMentor = false;
		this.company = {
			companyName: "",
		}
		this.studentId = {
			school: {},
			rncpTitle: {},
			currentClass: {}
		}
		this.mentor = {
			firstName: "",
			civility: "",
			lastName: "",
		}
	}


}

export class StudentJobDescription {
  _id: string;
  notification_status: string;
  jobDescriptionId: string;
  sendNotification: boolean;


  constructor(_id: string, notification_status: string, jobDescriptionId: string, sendNotification) {
      this._id = _id;
      this.notification_status = notification_status;
      this.jobDescriptionId = jobDescriptionId;
      this.sendNotification = sendNotification;
  }
}

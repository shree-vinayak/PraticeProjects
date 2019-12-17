export class Mail {
  emails: Array<Object>;
  mailType: string;
  subject: string;
  message: string;
  isSent: boolean;
  tags: Array<string>;
  status: string;
  sender: string;
  receivers: Object;
  description: string;
  category: string;
  attachments: Object;
  fileAttachments: object;
  isImportant: boolean;
  replayTo: string;
  senderProperty: Object;
  recipientProperty: Object;
  user: string;
  now: boolean;
  laterDate: string;
  lang?: string;
  company: string;
  mentor: string;
  isUrgentMail: boolean;
  sendNotification?: boolean;
  isGroupParent?: boolean;
  userTypeSelection?: boolean;
  groupDetails?: {
    rncp?: string[];
    userType?: string[];
  };
}

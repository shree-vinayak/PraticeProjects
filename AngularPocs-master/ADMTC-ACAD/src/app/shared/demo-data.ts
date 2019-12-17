export class DemoData {
  static RNCPTitles: any[] = [{
    certifier: {
      longName: 'Long Name of Certifier'
    },
    longName: 'Long Name of RNCP Title',
    shortName: 'SName of RNCPTitle',
    rncpLevel: 'I',
    _id: '1'
  }];

  static Categories: any[] = [];

  static getNewID(): string {
    let text = '';
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
}

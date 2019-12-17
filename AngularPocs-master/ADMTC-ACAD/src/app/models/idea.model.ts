export class Idea {
  _id: string;
  user: string; // Reference to User
  school: string; // Reference to School
  category: string; // Reference to Idea Category
  suggestion: string;
  point: any [];
  createdAt: Date;
  status: string; // 'active' or 'delete'

  constructor(category: string, suggestion? : string) {
    this.category = category;
    this.suggestion = suggestion || '';
  }
}

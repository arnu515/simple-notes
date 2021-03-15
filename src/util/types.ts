export interface Subject {
  id: number;
  name: string;
  shortName: string;
  grades: number[];
}

export interface Note {
  content: string;
  createdAt: number;
  grade: string;
  id: number;
  subject: string;
  title: string;
  type: "markdown" | "wysiwyg" | "document" | "null";
  uid: string;
  updatedAt: number;
}

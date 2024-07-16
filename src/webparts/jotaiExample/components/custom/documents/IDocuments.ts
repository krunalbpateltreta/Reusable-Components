export interface IDocuments {
    Id: number;
    ID?: number;
    Title: string;
    FileRef: string;
    FileLeafRef: string;
    FileDirRef: string;
    FileSizeDisplay: string;
    File_x0020_Size?: string;
    File_x0020_Type: string;
    AuthorValue: string;
    AuthorId: number | string;
    Author?: any;
    EditorValue: string;
    EditorId: number | string;
    Editor?: any;
    Modified: string;
    Created: string;
    FSObjType: number;
    ClientName: string;
    ClientNameId: number;
    DocumentTitle: string;
    DocumentCategory: string;
    DocumentKeyword: string;
    DocumentStatus: string;
    DocumentSubcategory: string;
}
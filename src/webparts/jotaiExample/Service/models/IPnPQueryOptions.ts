export default interface IPnPQueryOptions {
    select?: string[];
    filter?: string;
    expand?: string[];
    top?: number;
    batchSize?: number;
    skip?: number;
    orderBy?: string;
    isSortOrderAsc?: boolean;
    listName: string;
    listInternalName?: string;
}

export interface IPnPCAMLQueryOptions {
    listName: string;
    queryXML?: string;
    siteUrl?: string;
    pageToken?: string | "";
    pageLength?: number;
    FolderServerRelativeUrl?: string | "";
    overrideParameters?: { SortField: string, SortDir: string } | { SortField: "Id", SortDir: "Desc" };
}
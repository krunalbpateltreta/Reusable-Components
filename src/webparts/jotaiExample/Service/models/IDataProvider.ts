import { IFileWithBlob } from "../models/IFileWithBlob";
import IPnPQueryOptions, { IPnPCAMLQueryOptions } from "./IPnPQueryOptions";

export type IDataProvider = {
    createItem(objItems: any, listName: string): Promise<any>;
    updateItem(objItems: any, listName: string, itemId: number): Promise<any>;
    createItemInBatch(objItems: any[], listName: string): Promise<any>;
    getItemsByQuery(queryOptions: IPnPQueryOptions): Promise<any>;
    getAllItems(queryOptions: IPnPQueryOptions): Promise<any>;
    getByItemByID(queryOptions: IPnPQueryOptions, id: number): Promise<any>;
    getItemsByCAMLQuery(listName: string, xmlQuery: string, folderPath?: string, overrideParameters?: any, siteUrl?: string): Promise<any>;
    updateListItemsInBatchPnP(listName: string, objItems: any[]): Promise<any>;
    updateListItemsInMultipleListInBatchPnP(objItems: any[]): Promise<any>;
    getCurrentUser(): Promise<any>;
    getPropertiesFor(usersArray: any): Promise<any>;
    getSearchDocument(data: any): Promise<any>;
    deleteItem(listName: string, itemId: number): Promise<any>;
    createFolder(folderUrl: string, metadata?: any): Promise<any>;
    uploadFile(file: IFileWithBlob, metadataUpdate?: boolean, metadata?: any): Promise<any>;
    getVersionHistoryById(listName: string, itemId: number): Promise<any>;
    createItemWithAttchment(objItems: any, listName: string, file: any): Promise<any>;
    UpdateItemWithAttachment(ID: number, objItems: any, listName: string, file: any, oldAttachmnetName?: any): Promise<any>;
    loadBatchOfItems(pageNumber: number): Promise<any>;
    getBatchItemsItemsByQuery(queryOptions: IPnPQueryOptions): Promise<any[]>;
    getItemsInBatchByCAMLQuery(pnpQueryOptions: IPnPCAMLQueryOptions): Promise<any>;
    getListGUID(listName: string): Promise<any>;
    getListItemCount(listName: string): Promise<any>;
    getAllItemsSkip(queryOptions: IPnPQueryOptions): Promise<any>;
}
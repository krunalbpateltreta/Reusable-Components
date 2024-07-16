/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IDataProvider } from "./models/IDataProvider";
import IPnPQueryOptions, { IPnPCAMLQueryOptions } from "./models/IPnPQueryOptions";
import { IFileWithBlob } from "../Service/models/IFileWithBlob";
import { SPFI, SPFx, spfi } from "@pnp/sp";
import { getSP } from "./models/PnPJSConfig";
import { IItem, IItemAddResult, IItemUpdateResult } from "@pnp/sp/items";
import "@pnp/sp/search";
import { IRenderListDataParameters } from "@pnp/sp/lists";
import { IFileAddResult } from "@pnp/sp/files";
import { HttpRequestError } from "@pnp/queryable";
import { boolean } from "zod";

export const getUniueRecordsByColumnName = (items: any[], columnName: string) => {
    const lookup: any = {};
    const result: any[] = [];
    if (!!items) {
        for (let index = 0; index < items?.length; index++) {
            const item = items[index];
            const name = item[columnName];
            if (!(name in lookup)) {
                lookup[name] = 1;
                result.push(item);
            }
        }
        return result;
    }
    else {
        return [];
    }
};


export default class Service implements IDataProvider {
    private _webPartContext: WebPartContext;
    private _sp: SPFI;

    constructor(_context: WebPartContext) {
        this._webPartContext = _context;
        this._sp = getSP(this._webPartContext);
    }

    getSearchDocument(data: any): Promise<any> {
        throw new Error('Method not implemented.');
    }

    public createItem(objItems: any, listName: string): Promise<any> {
        return new Promise<any>((resolve: (results: IItemAddResult) => void, reject: (error: any) => void): void => {
            this._sp.web.lists.getByTitle(listName).items.add(objItems).then((itemAddedResult: IItemAddResult): any => {
                resolve(itemAddedResult);
            }, (error: any): any => {
                console.log("Error in Creating Item", error);
                reject(error);
            });
        });
    }

    public updateItem(objItems: any, listName: string, itemId: number): Promise<any> {
        return new Promise<any>((resolve: (results: any) => void, reject: (error: any) => void): void => {
            this._sp.web.lists.getByTitle(listName).items
                .getById(itemId).update(objItems)
                .then((itemUpdateResult: IItemUpdateResult) => {
                    resolve(itemUpdateResult);
                }, (error: any): void => {
                    console.log("Error in updating item in -" + listName);
                    reject(error);
                });
        });
    }

    public createItemInBatch(objItems: any[], listName: string): Promise<any[]> {
        return new Promise<any>((resolve: (results: any) => void, reject: (error: any) => void): void => {
            const [batchedSP, execute] = this._sp.batched();

            const list = batchedSP.web.lists.getByTitle(listName);
            const res: any[] = [];
            for (let index = 0; index < objItems.length; index++) {
                const element = objItems[index];
                list.items.add(element).then(r =>
                    res.push(r))
                    .catch(err => {
                        console.log(err);
                        reject(err);
                    });
            }
            // Executes the batched calls
            execute().then(() => {
                resolve(res);
            }, (error: any): any => {
                console.log("Error in Creating Item", error);
                reject(error);
            });
        });
    }

    public async getItemsByQuery(queryOptions: IPnPQueryOptions): Promise<any> {
        try {
            const { filter, select, expand, top, skip, listName, orderBy, isSortOrderAsc } = queryOptions;
            const fetchTop = !!top ? (top >= 5000 ? 4999 : top) : 4999;
            const _list = this._sp.web.lists.getByTitle(listName);
            let result = _list.items;
            if (select) result = result.select(...select);
            if (filter) result = result.filter(filter);
            if (expand) result = result.expand(...expand);
            if (fetchTop) result = result.top(fetchTop);
            if (orderBy) result = result.orderBy(orderBy, isSortOrderAsc);
            if (skip) result = result.skip(skip);
            let listItems = [];
            let items: any;
            items = await result.getPaged();
            listItems = items.results;
            while (items.hasNext) {
                items = await items.getNext();
                listItems = [...listItems, ...items.results];
            }
            return listItems;
        } catch (error) {
            await this.getErrorObject(error);
        }
    }

    public async getAllItems(queryOptions: IPnPQueryOptions): Promise<any> {
        try {
            const { filter, select, expand, top, skip, listName, orderBy, isSortOrderAsc } = queryOptions;
            const _list = this._sp.web.lists.getByTitle(listName);
            let result = _list.items;
            if (filter) result = result.filter(filter);
            if (select) result = result.select(...select);
            if (expand) result = result.expand(...expand);
            if (top) result = result.top(top);
            if (orderBy) result = result.orderBy(orderBy, isSortOrderAsc);
            if (skip) result = result.skip(skip);
            return await result.getAll();
        } catch (e) {
            await this.getErrorObject(e);
        }
    }
    public async getAllItemsSkip(queryOptions: any): Promise<any> {
        try {
            const { filter, select, expand, top, skip, listName, orderBy, isSortOrderAsc } = queryOptions;
            const _list = this._sp.web.lists.getByTitle(listName).items.skip(!!skip ? skip : 0).top(!!top ? top : 0).filter(!!filter ? filter : "").select(...select)()
            // const _list = this._sp.web.lists.getByTitle(listName);
            // let result = _list.items;
            // if (filter) result = result.filter(filter);
            // if (select) result = result.select(...select);
            // if (expand) result = result.expand(...expand);
            // if (top) result = result.top(top);
            // return await result.getAll()
            return _list
        } catch (e) {
            await this.getErrorObject(e);
        }
    }

    public getByItemByID(queryOptions: IPnPQueryOptions, id: number): Promise<any> {
        try {
            const { select, expand } = queryOptions;
            const _list = this._sp.web.lists.getByTitle(queryOptions.listName);
            let result = _list.items.getById(id);
            if (select) result = result.select(...select);
            if (expand) result = result.expand(...expand);
            return result();
        }
        catch (error) { throw new Error(error); }
    }


    public getListItemCount(listName: string): Promise<any> {
        try {

            const _list = this._sp.web.lists.getByTitle(listName).select("*")()
            return _list;
        }
        catch (error) { throw new Error(error); }
    }

    public updateListItemsInBatchPnP(listName: string, objItems: any[]): Promise<any> {
        return new Promise<any>((resolve: (results: any) => void, reject: (error: any) => void): void => {
            const [batchedSP, execute] = this._sp.batched();

            const list = batchedSP.web.lists.getByTitle(listName);
            const res: any[] = [];
            for (let index = 0; index < objItems.length; index++) {
                const element = objItems[index];
                const obj = { ...element };
                delete obj.Id;
                list.items.getById(element.Id).update(obj).then(r => res.push(r)).catch(err => { console.log(err); reject(err); });
            }
            execute().then(() => {
                resolve(res);
            }, (error: any): any => {
                console.log("Error in Creating Item");
                reject(error);
            });
        });
    }

    public updateListItemsInMultipleListInBatchPnP(objItems: any[]): Promise<any> {
        return new Promise<any>((resolve: (results: any) => void, reject: (error: any) => void): void => {
            const [batchedSP, execute] = this._sp.batched();

            const res: any[] = [];
            for (let index = 0; index < objItems.length; index++) {
                const element = objItems[index];
                const obj = { ...element };
                delete obj.Id;
                delete obj.listName;
                const list = batchedSP.web.lists.getByTitle(element.listName);
                list.items.getById(element.Id).update(obj).then(r => res.push(r)).catch(err => { console.log(err); reject(err); });
            }
            // Executes the batched calls
            execute().then(() => {
                resolve(res);
            }, (error: any): any => {
                console.log("Error in Creating Item");
                reject(error);
            });
        });
    }

    public async getCurrentUser(): Promise<any> {
        try {
            return await this._sp.web.currentUser();
        }
        catch (error) {
            throw new Error(error);
        }
    }

    public async createFolder(folderUrl: string, metadata?: any): Promise<any> {
        return new Promise<any>((resolve: (results: any) => void, reject: (error: any) => void): void => {
            this._sp.web.folders.addUsingPath(folderUrl).then(async (response) => {
                console.log("Folder is created at " + response.data.ServerRelativeUrl);
                if (metadata) {
                    await response.folder.getItem().then(async (item: IItem) => {
                        await item.update(metadata).then((updateItem: any) => {
                            resolve(updateItem?.item?.Id);
                        });
                    });
                }
                resolve(response.data);
            }, (error: any): any => {
                console.log("Error in Creating Item", error);
                reject(error);
            });
        });
    }

    public async uploadFile(file: IFileWithBlob, metadataUpdate?: boolean, metadata: any = null): Promise<any> {
        let fileUpload: IFileAddResult;
        if (file.file?.size <= 10485760) {
            fileUpload = await this._sp.web.getFolderByServerRelativePath(file.folderServerRelativeURL).
                files.addUsingPath(file.name, file.file, { Overwrite: true });
            if (metadataUpdate) {
                const item = await fileUpload.file.getItem();
                await item.update(metadata);
            }
        }
        else {
            //large upload
            fileUpload = await this._sp.web.getFolderByServerRelativePath(file.folderServerRelativeURL).files
                .addChunked(file.name, file.file, data => {
                    console.log(`progress`);
                }, true);
            if (metadataUpdate) {
                const item = await fileUpload.file.getItem();
                await item.update(metadata);
            }
        }
        return fileUpload;
    }

    public deleteItem(listName: string, itemId: number): Promise<boolean> {
        return new Promise<any>((resolve: (results: any) => void, reject: (error: any) => void): void => {
            this._sp.web.lists.getByTitle(listName).items.getById(itemId).delete()
                .then(_ => {
                    resolve(true);
                }, (error: any): void => {
                    console.log("Error in deleting Item from -" + listName);
                    reject(false);
                });
        });
    }

    public async getVersionHistoryById(listName: string, itemId: number): Promise<any[]> {
        return new Promise<any>((resolve: (results: any[]) => void, reject: (error: any) => void): void => {
            this._sp.web.lists.getByTitle(listName).items.getById(itemId).versions()
                .then((itemVersionHistory: any[]) => {
                    const sortedItemVersionHistory = itemVersionHistory.sort((a: any, b: any) => b.VersionId - (a.VersionId));
                    resolve(sortedItemVersionHistory);
                }, (error: any): void => {
                    console.log("Error in get version history by -" + listName);
                    reject([]);
                });
        });
    }

    getPropertiesFor(usersArray: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    public async getItemsByCAMLQuery(listName: string, xmlQuery: string, folderPath: string = "", overrideParameters: any = { SortField: "Id", SortDir: "Asc" }, siteUrl?: string): Promise<any> {
        try {
            let isPaged: boolean = true;
            let allData: any[] = [];
            let pageToken = "";
            do {
                const renderListDataParams: IRenderListDataParameters = {
                    ViewXml: xmlQuery,
                    Paging: pageToken,
                };
                if (folderPath && folderPath !== "") {
                    renderListDataParams.FolderServerRelativeUrl = folderPath;
                }
                let r;
                if (!!siteUrl) {
                    const spWeb = spfi(siteUrl).using(SPFx(this._webPartContext));
                    r = await spWeb.web.lists.getByTitle(listName).renderListDataAsStream(renderListDataParams, overrideParameters);
                } else {
                    r = await this._sp.web.lists.getByTitle(listName).renderListDataAsStream(renderListDataParams, overrideParameters);
                }

                if (!!r.NextHref) {
                    pageToken = r.NextHref.split('?')[1];
                } else {
                    isPaged = false;
                }
                allData = [...allData, ...r.Row];
            } while (isPaged);
            return allData;
        } catch (error) {
            await this.getErrorObject(error);
        }
    }

    public createItemWithAttchment(objItems: any, listName: string, file: any): Promise<any> {
        return new Promise<any>((resolve: (results: any) => void, reject: (error: any) => void): void => {
            this._sp.web.lists.getByTitle(listName).items.add(objItems)
                .then(async (itemAddedResult: IItemAddResult): Promise<any> => {
                    if (!!file)
                        await itemAddedResult.item.attachmentFiles.add(file.name, file.content);
                    resolve(itemAddedResult);
                }
                ).catch((error: any): any => {
                    console.log("Error in Creating Item");
                    reject(error);
                });
        });
    }

    public UpdateItemWithAttachment(ID: number, objItems: any, listName: string, file: any, oldAttachmnetName?: any): Promise<any> {
        return new Promise<any>((resolve: (results: any) => void, reject: (error: any) => void): void => {
            if (objItems.Id)
                delete objItems.Id;
            this._sp.web.lists.getByTitle(listName).items.getById(ID).update(objItems)
                .then(async (itemAddedResult: IItemAddResult) => {
                    if (!!file) {
                        await itemAddedResult.item.attachmentFiles.add(file.name, file.content);
                    }
                    resolve(itemAddedResult);
                }, (error: any): any => {
                    console.log("Error in Updating  Item" + ID);
                    reject(error);
                }).catch((e: any) => {
                    console.log(e);
                });
        });
    }

    public loadBatchOfItems = async (skip: number): Promise<any> => {
        try {
            const response = await this._sp.web.lists.getByTitle("Employee").items
                .select("FirstName,Id") // Specify the fields you want to retrieve
                .top(20)
                .skip(skip)
                .orderBy("ID", true)
                .getPaged();

            if (!response) {
                return [];
            }

            return response.results;
        } catch (e) {
            console.error('An error occurred while loading batch of items:', e);
            await this.getErrorObject(e);
        }
    };

    public async getBatchItemsItemsByQuery(queryOptions: IPnPQueryOptions): Promise<any> {
        try {
            const { filter, select, expand, batchSize, skip, listName, orderBy, isSortOrderAsc } = queryOptions;
            const fetchTop = !!batchSize ? (batchSize >= 5000 ? 4999 : batchSize) : 4999;
            const _list = this._sp.web.lists.getByTitle(listName);
            let result = _list.items;
            if (select) result = result.select(...select);
            if (filter) result = result.filter(filter);
            if (expand) result = result.expand(...expand);
            if (fetchTop) result = result.top(fetchTop);
            if (orderBy) result = result.orderBy(orderBy, isSortOrderAsc);
            if (skip) result = result.skip(skip);
            const items = await result.getPaged();
            return items;
        } catch (e) {
            await this.getErrorObject(e);
        }
    }

    public async getListGUID(listName: string): Promise<any> {
        try {
            const _list = await this._sp.web.lists.getByTitle(listName).select("Id")();
            return _list
        } catch (e) {
            await this.getErrorObject(e);
        }
    }

    public async getItemsInBatchByCAMLQuery(pnpQueryOptions: IPnPCAMLQueryOptions): Promise<any> {
        try {
            let isPaged: boolean = true;
            let allData: any[] = [];
            let pageToken = pnpQueryOptions.pageToken;
            let response: any;
            const pageLength = pnpQueryOptions.pageLength || 0;
            do {
                const renderListDataParams: IRenderListDataParameters = {
                    ViewXml: pnpQueryOptions.queryXML,
                    Paging: pageToken,
                };

                if (pnpQueryOptions.FolderServerRelativeUrl) {
                    renderListDataParams.FolderServerRelativeUrl = pnpQueryOptions.FolderServerRelativeUrl
                }

                if (!!pnpQueryOptions.siteUrl) {
                    const spWeb = spfi(pnpQueryOptions.siteUrl).using(SPFx(this._webPartContext));
                    response = await spWeb.web.lists.getByTitle(pnpQueryOptions.listName).renderListDataAsStream(renderListDataParams, pnpQueryOptions.overrideParameters, undefined);
                } else {
                    response = await this._sp.web.lists.getByTitle(pnpQueryOptions.listName).renderListDataAsStream(renderListDataParams, pnpQueryOptions.overrideParameters, undefined);
                }
                if (response) {
                    allData = [...allData, ...response.Row];
                    if ((response?.Row.length === 0 || allData?.length < pageLength) && response?.NextHref) {
                        pageToken = response.NextHref.split('?')[1];
                    } else {
                        isPaged = false;
                    }
                } else {
                    isPaged = false;
                }
            } while (isPaged);
            if (response?.Row)
                response.Row = allData;
            return response;
        } catch (error) {
            console.log(pnpQueryOptions.listName);
            await this.getErrorObject(error);
        }
    }

    private async getErrorObject(e: any) {
        const _error = { message: "", name: "" };
        if (e?.isHttpRequestError) {
            const json = await (<HttpRequestError>e).response.json();
            _error.message = typeof json["odata.error"] === "object" ? json["odata.error"].message.value : e.message;
            if ((<HttpRequestError>e).status === 404) {
                console.error((<HttpRequestError>e).statusText);
            }

        } else {
            console.log(e.message);
            _error.message = e.message;
        }
        throw new Error(JSON.stringify(_error));
    }
}

import { useState, useCallback } from 'react';
import { ICustomBreadcrumbItem } from '../../../Common/breadcrumb/CustomBreadcrumb';
import { useBoolean, useId } from '@uifabric/react-hooks';
import { IDocuments } from '../IDocuments';
import { DateFormat, columnProps } from '../../../../Shared/constants/Constants';
import { ListNames } from '../../../../Shared/Enum/ListNames';
import CamlBuilder from 'camljs';
import moment from 'moment';
import React from 'react';
import { formatBytes, getCAMLQueryFilterExpression, getErrorMessage, getFileTypeIcon, getLookupIdCAML, getLookupValueCAML, getNumberValue, getPeoplePickerValueCAML, getStringValue, isNullOrEmpty } from '../../../../Shared/Utils';
import { appGlobalStateAtom } from '../../../../jotai/appGlobalStateAtom';
import { useAtom } from 'jotai';
import { ICustomColumn } from '../../../Common/DetailList/DataGridComponent';
import { DMSDocumentsFields, DMSDocumentsViewFields } from '../DocumentFields';
import { ColumnActionsMode, Link, TooltipHost } from '@fluentui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toInteger } from 'lodash';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { IPnPCAMLQueryOptions } from '../../../../Service/models/IPnPQueryOptions';
import { SortOrder } from '../../../Common/DetailList/constant/DetailListEnum';
import { FieldType, ICamlQueryFilter, LogicalType } from '../../../../Shared/Enum/CamlQueryFilter';

const PAGE_LENGTH = 30;

export function viewDocumentsData() {
    const [selectedKey, setSelectedKey] = useState<string>("");
    const [appGlobalState, setAppGlobalState] = useAtom(appGlobalStateAtom);
    const { provider, context, folderPath, itemId } = appGlobalState;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [allItems, setItems] = useState<IDocuments[]>([]);
    const [nextData, setNextData] = useState<any>();
    const [_filterFields, setFilterFields] = useState<ICamlQueryFilter[]>();
    const [error, setError] = React.useState<Error>((undefined as unknown) as Error);
    const [dialogHeader, setDialogHeader] = React.useState<string>("");
    const [dialogMessage, setDialogMessage] = React.useState<string>("");
    const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
    const [hideSuccessDialog, { toggle: toggleHideSuccessDialog }] = useBoolean(true);
    const tooltipId = useId('tooltip');
    const fileLinkId = useId('fileLink');
    const [deleteItemId, setDeleteItemId] = React.useState<number>(-1);
    const [sourcePath, setSourcePath] = useState<string>(folderPath || "");
    //following state variable is for breadcrumb
    //const [newBreadcrumbItem, setNewBreadcrumbItem] = useState<ICustomBreadcrumbItem>({ text: "Folder 2", key: "/sites/ReddApps/ReusableComponent/Shared Documents/Folder 1/Folder 2" });
    let defaultBreadCrumb = undefined;
    if (folderPath) {
        defaultBreadCrumb = { text: folderPath?.split("/").slice(-1)[0], key: folderPath }
    }
    const [newBreadcrumbItem, setNewBreadcrumbItem] = useState<ICustomBreadcrumbItem | undefined>(defaultBreadCrumb);

    const deleteConfirmationClick = (item: IDocuments) => {
        if (item?.Id) {
            setDialogHeader("Confirmation");
            setDialogMessage("Are you sure, you want to delete this record?");
            setDeleteItemId(item?.Id);
            toggleHideDialog();
        }
    }

    /*
    TODO: this method will be called when someone clicked on the folder inside the Grid
   */
    const onFolderClick = useCallback((documentItem: IDocuments) => {
        setIsLoading(true);
        const newBreadcrumbItem: ICustomBreadcrumbItem = {
            text: `${documentItem.FileLeafRef}`,
            key: `${documentItem.FileDirRef}/${documentItem.FileLeafRef}`,
        };
        reloadData(`${documentItem.FileDirRef}/${documentItem.FileLeafRef}`, documentItem.ClientNameId);
        setNewBreadcrumbItem(newBreadcrumbItem);
        setAppGlobalState({ ...appGlobalState, folderPath: newBreadcrumbItem.key, itemId: documentItem.ClientNameId })
    }, []);

    /*
    TODO: this method will clicked whenever someone clicked on Client Name from the left navigation.
    */
    const onLinkClick = (ev?: React.MouseEvent<HTMLElement>, item?: any) => {
        setIsLoading(true);
        const newBreadcrumbItem: ICustomBreadcrumbItem = {
            text: `${item?.name}`,
            key: `${item?.FileDirRef}/${item?.name}`,
        };
        reloadData(`${item?.FileDirRef}/${item?.name}`, item.ClientNameId);
        setAppGlobalState({ ...appGlobalState, folderPath: item?.filePath, itemId: item.ClientNameId });
        setNewBreadcrumbItem(newBreadcrumbItem);
        setSelectedKey(item?.key);
    }

    /*
    TODO: loading batch  of Items method is calling multiple times, so created a common method for reloading of Data.
    */
    const reloadData = (folderPath: string, _itemId: number) => {
        void (async () => {
            setIsLoading(true);
            await loadBatchOfItems(folderPath, _itemId);
            setIsLoading(false);
        })();
    }

    /*
    TODO: Create a method for Grid. On Render File Name & Folder column this method will be called. 
    ! on Folder click it will load the Sub folders data.
    */
    const _onRenderFileOrFolderCell = (documentItem: IDocuments) => {
        if (toInteger(documentItem.FSObjType) === 0) {
            return <Link className="" href={`${documentItem.FileRef}`} >
                <TooltipHost
                    content={"View Document"}
                    id={fileLinkId}
                >
                    <img src={`${documentItem.File_x0020_Type}`} className="fileIconImg" alt="File" /> {documentItem.FileLeafRef}
                </TooltipHost>
            </Link>
        }
        else {
            return <Link className="" onClick={() => onFolderClick(documentItem)}>
                <TooltipHost
                    content={"View Documents"}
                    id={fileLinkId}
                >
                    <FontAwesomeIcon icon={faFolder} style={{ color: "#FFCA28" }} /> {documentItem.FileLeafRef}
                </TooltipHost>
            </Link>
        }
    }

    const _onRenderActionColumn = (documentItem: IDocuments) => {
        return <><div className="dflex">
            <Link className="actionBtn iconSize btnDanger dticon" onClick={() => { deleteConfirmationClick(documentItem) }} >
                <TooltipHost
                    content={"Delete Item"}
                    id={tooltipId}
                >
                    <FontAwesomeIcon icon="trash-can" />
                </TooltipHost>
            </Link>
        </div>
        </>
    }

    /*
     TODO: This will generate the columns which was used in documents grid.
    */
    const generateColumns = (): ICustomColumn[] => {
        let columns: ICustomColumn[] = [];
        columns = [
            {
                ...columnProps,
                key: 'column3',
                name: DMSDocumentsViewFields.FileName,
                fieldName: DMSDocumentsFields.FileLeafRef,
                minWidth: 200,
                maxWidth: 300,
                isSortingRequired: true,
                columnActionsMode: ColumnActionsMode.clickable,
                onRender: _onRenderFileOrFolderCell
            }, {
                ...columnProps,
                key: 'column2',
                name: DMSDocumentsViewFields.ClientName,
                fieldName: DMSDocumentsFields.ClientName,
                minWidth: 120,
                maxWidth: 150,
            }, {
                ...columnProps,
                key: 'column11',
                name: DMSDocumentsViewFields.DocumentCategory,
                fieldName: DMSDocumentsFields.DocumentCategory,
                minWidth: 100,
                maxWidth: 120
            },
            {
                ...columnProps,
                key: 'column4',
                name: DMSDocumentsViewFields.DocumentSubcategory,
                fieldName: DMSDocumentsFields.DocumentSubcategory,
                minWidth: 100,
                maxWidth: 150
            },
            {
                ...columnProps,
                key: 'column12',
                name: DMSDocumentsViewFields.DocumentStatus,
                fieldName: DMSDocumentsFields.DocumentStatus,
                minWidth: 100,
                maxWidth: 150
            }
            ,
            {
                ...columnProps,
                key: 'column13',
                name: DMSDocumentsViewFields.DocumentKeyword,
                fieldName: DMSDocumentsFields.DocumentKeyword,
                minWidth: 100,
                maxWidth: 150
            },
            {
                ...columnProps,
                key: 'column5',
                name: DMSDocumentsViewFields.CreatedBy,
                fieldName: DMSDocumentsFields.AuthorValue,
                minWidth: 100,
                maxWidth: 150,
            },
            {
                ...columnProps,
                key: 'column6',
                name: DMSDocumentsViewFields.Created,
                fieldName: DMSDocumentsFields.Created,
                minWidth: 80,
                maxWidth: 100,
            },
            {
                ...columnProps,
                key: 'column7',
                name: DMSDocumentsViewFields.ModifiedBy,
                fieldName: DMSDocumentsFields.Editor,
                minWidth: 100,
                maxWidth: 150,
            },
            {
                ...columnProps,
                key: 'column8',
                name: DMSDocumentsViewFields.Modified,
                fieldName: DMSDocumentsFields.Modified,
                minWidth: 80,
                maxWidth: 100,
            },
            {
                ...columnProps,
                key: 'column9',
                name: "Action",
                fieldName: "",
                minWidth: 110,
                maxWidth: 150,
                onRender: _onRenderActionColumn
            }
        ];
        return columns;
    }

    /*
    TODO: Load data from the document library.
    */
    const loadData = async (pageToken: string, sortOptions: { sortColumn: string, sortOrder: SortOrder }, filterFields: ICamlQueryFilter[], _folderPath: string) => {
        try {
            const camlQuery = new CamlBuilder()
                .View([
                    DMSDocumentsFields.Id,
                    DMSDocumentsFields.Title,
                    DMSDocumentsFields.FileLeafRef,
                    DMSDocumentsFields.FileRef,
                    DMSDocumentsFields.FileDirRef,
                    DMSDocumentsFields.FileSize,
                    DMSDocumentsFields.FileType,
                    DMSDocumentsFields.Author,
                    DMSDocumentsFields.Editor,
                    DMSDocumentsFields.FSObjType,
                    DMSDocumentsFields.Created,
                    DMSDocumentsFields.Modified,
                    DMSDocumentsFields.DocumentCategory,
                    DMSDocumentsFields.DocumentKeyword,
                    DMSDocumentsFields.DocumentStatus,
                    DMSDocumentsFields.DocumentSubcategory,
                    DMSDocumentsFields.ClientName,
                ])
                .Scope(CamlBuilder.ViewScope.RecursiveAll)
                .RowLimit(PAGE_LENGTH, true)
                .Query()

            if (filterFields) {
                const categoriesExpressions: any[] = getCAMLQueryFilterExpression(filterFields);
                camlQuery.Where().All(categoriesExpressions);
            }
            sortOptions.sortOrder === SortOrder.Ascending ? camlQuery.OrderBy(sortOptions.sortColumn) : camlQuery.OrderByDesc(sortOptions.sortColumn)
            const pnpQueryOptions: IPnPCAMLQueryOptions = {
                listName: ListNames.DMSDocuments,
                queryXML: camlQuery.ToString(),
                FolderServerRelativeUrl: _folderPath || "",
                pageToken: pageToken,
                pageLength: PAGE_LENGTH
            }
            console.time('All');
            const localResponse = await provider.getItemsInBatchByCAMLQuery(pnpQueryOptions);
            console.timeEnd('All');
            return localResponse;
        } catch (error) {
            const _error = getErrorMessage(error);
            setError(_error);
            return null;
        }
    }

    const mappingData = (listItems: any): IDocuments[] => {
        if (!!listItems) {
            try {
                const itemsData: any[] = listItems.map((itemObj: any, index: number) => {
                    const itemData: IDocuments = {
                        Id: getNumberValue(itemObj?.ID),
                        Title: getStringValue(itemObj?.Title),
                        FileLeafRef: getStringValue(itemObj?.FileLeafRef),
                        FileRef: getStringValue(itemObj?.FileRef),
                        FileDirRef: getStringValue(itemObj?.FileDirRef),
                        FSObjType: getNumberValue(itemObj?.FSObjType),
                        File_x0020_Size: formatBytes(itemObj?.File_x0020_Size) || "",
                        FileSizeDisplay: formatBytes(itemObj?.File_x0020_Size) || "",
                        File_x0020_Type: getFileTypeIcon(itemObj?.FSObjType === 1 ? "folder" : itemObj?.File_x0020_Type) || "",
                        AuthorValue: getPeoplePickerValueCAML(itemObj?.Author, "title"),
                        AuthorId: getPeoplePickerValueCAML(itemObj?.Author, "id"),
                        EditorValue: getPeoplePickerValueCAML(itemObj?.Editor, "title"),
                        EditorId: getPeoplePickerValueCAML(itemObj?.Editor, "id"),
                        Modified: moment(itemObj?.Modified).format(DateFormat),
                        Created: moment(itemObj?.Created).format(DateFormat),
                        DocumentTitle: getStringValue(itemObj?.DocumentTitle),
                        DocumentCategory: getStringValue(itemObj?.DocumentCategory),
                        DocumentStatus: getStringValue(itemObj?.DocumentStatus),
                        DocumentSubcategory: getStringValue(itemObj?.DocumentSubcategory),
                        DocumentKeyword: getStringValue(itemObj?.DocumentKeyword),
                        ClientName: getLookupValueCAML(itemObj?.ClientName),
                        ClientNameId: getLookupIdCAML(itemObj?.ClientName),
                    };
                    return itemData;
                });
                return itemsData;
            } catch (e) {
                setError(e);
            }
        }
        return [];
    }

    const loadBatchOfItems = async (_sourcePath?: string, _itemId?: number): Promise<void> => {
        try {
            let _folderPath = sourcePath;
            if (!!_sourcePath && _sourcePath !== "") {
                _folderPath = _sourcePath;
            } else if (newBreadcrumbItem) {
                _folderPath = `${newBreadcrumbItem?.key}`;
            } else if (folderPath) {
                _folderPath = folderPath;
            }
            const filterFields: ICamlQueryFilter[] = [];
            const mainPath = `${context.pageContext.web.serverRelativeUrl}/${ListNames.DMSDocumentsPath}`;
            if (isNullOrEmpty(_folderPath) || _folderPath === mainPath) {
                filterFields.push({
                    fieldName: "FSObjType",
                    fieldValue: 0,
                    fieldType: FieldType.Number,
                    LogicalType: LogicalType.EqualTo
                })
            }
            else {
                if (_itemId) {
                    filterFields.push({
                        fieldName: "ClientName",
                        fieldValue: _itemId,
                        fieldType: FieldType.LookupById,
                        LogicalType: LogicalType.EqualTo
                    })
                }
                filterFields.push({
                    fieldName: "FileDirRef",
                    fieldValue: _folderPath,
                    fieldType: FieldType.Text,
                    LogicalType: LogicalType.EqualTo
                });
            }
            setFilterFields(filterFields);
            const localResponse = await loadData("", { sortColumn: "ID", sortOrder: SortOrder.Descending }, filterFields, _folderPath);
            console.time("Mapping");
            const listItems = mappingData(localResponse?.Row);
            console.timeEnd("Mapping");
            setIsLoading(false);
            setItems(listItems);
            setNextData(localResponse);
        } catch (error) {
            console.error('An error occurred while loading batch of items:', error);
            setIsLoading(false);
            setError(error);
        }
    };

    const deleteItem = async (): Promise<void> => {
        if (!!deleteItemId && deleteItemId > 0) {
            const response = await provider.deleteItem(ListNames.DMSDocuments, deleteItemId);
            if (response) {
                setDialogHeader("Success");
                setDialogMessage("File has been deleted successfully");
                setIsSuccess(true);
            } else {
                setDialogHeader("Warning");
                setDialogMessage("Error in delete file");
                setIsSuccess(false);
            }
        }
    }

    const loadDataAfterDelete = async (): Promise<void> => {
        setIsLoading(true);
        toggleHideSuccessDialog();
        await loadBatchOfItems();
        setIsLoading(false);
    }

    const deleteSPRecord = async (): Promise<void> => {
        setIsLoading(true);
        toggleHideDialog();
        await deleteItem();
        setIsLoading(false);
    }

    const hasError = React.useMemo(() => {
        return !error ? false : true;
    }, [error]);

    React.useEffect(() => {
        reloadData(sourcePath, (!!itemId && itemId > 0 ? itemId : 0));
    }, [sourcePath]);

    return {
        isLoading,
        allItems,
        setSourcePath,
        newBreadcrumbItem,
        loadBatchOfItems,
        setIsLoading,
        generateColumns,
        selectedKey,
        onLinkClick,
        deleteItem,
        hasError,
        error,
        dialogHeader,
        dialogMessage,
        isSuccess,
        hideDialog,
        hideSuccessDialog,
        toggleHideDialog,
        toggleHideSuccessDialog,
        nextData,
        loadData,
        loadDataAfterDelete,
        deleteSPRecord,
        mappingData,
        reloadData,
        _filterFields
    }

}
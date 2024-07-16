import * as React from "react";
import { ICustomColumn } from "../../../Common/DetailList/DataGridComponent";
import { IPnPCAMLQueryOptions } from "../../../../Service/models/IPnPQueryOptions";
import { ListNames } from "../../../../Shared/Enum/ListNames";
import { Link, TooltipHost } from "@fluentui/react";
import { useId } from "@uifabric/react-hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ComponentName } from "../../../../Shared/Enum/ComponentName";
import { FeildType } from "../../../../Shared/Enum/FieldType";
import * as CamlBuilder from "camljs";
import { SortOrder } from "../../../Common/DetailList/constant/DetailListEnum";
import { useState } from "react";
import { ICamlQueryFilter } from "../../../../Shared/Enum/CamlQueryFilter";
import {
    generateAndSavePDF,
    getCAMLQueryFilterExpression,
    getErrorMessage,
    getNumberValue,
    getPeoplePickerValueCAML,
    getStringValue
} from "../../../../Shared/Utils";
import { ClientFields, ClientViewFields } from "../ClientFields";
import { appGlobalStateAtom } from "../../../../jotai/appGlobalStateAtom";
import { useAtomValue } from "jotai";
import { Messages } from "../../../../Shared/constants/Messages";
import { columnProps } from "../../../../Shared/constants/Constants";
import { IClientsView } from "../IClients";
import { IImportFields } from "../../../Common/importExcel/IImportFileFileds";
import { ListMenu } from "../../../Common/ListMenu";

interface IDialogMessageState {
    dialogHeader: string;
    dialogMessage: string;
    isSuccess: boolean
}

export interface IViewClientsDataProps {
    toggleHideSuccessDialog: any;
    toggleHideDialog: any;
}

export function viewClientsListData(props: IViewClientsDataProps) {
    const { toggleHideSuccessDialog, toggleHideDialog } = props;
    const [itemId, setItemId] = React.useState<number>(-1);
    const [listGUID, setListGUID] = React.useState<string>("");
    const [allItems, setitems] = React.useState<IClientsView[]>([]);
    const [selectedItems, setSelecteditems] = React.useState<IClientsView[]>([]);
    const [nextData, setNextData] = useState<any>();

    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const tooltipId = useId('tooltip');
    const PAGE_LENGTH: number = 30;
    const [error, setError] = React.useState<Error>((undefined as unknown) as Error);

    const appGlobalState = useAtomValue(appGlobalStateAtom);
    const { provider, loadComponent, componentName } = appGlobalState;

    const printTypeOpitons: any[] = [
        { value: "type1", label: "Type 1" },
        { value: "type2", label: "Type 2" },
        { value: "type3", label: "Type 3" },
        { value: "type4", label: "Type 4" },
        { value: "type5", label: "Type 5" },
        { value: "type6", label: "Type 6" }
    ]

    const [dialogState, setDialogState] = React.useState<IDialogMessageState>({
        dialogHeader: "",
        dialogMessage: "",
        isSuccess: false
    })

    const importFileColumnNames: IImportFields[] = [
        {
            fieldName: ClientFields.FirstName,
            required: true,
            type: FeildType.Text
        }, {
            fieldName: ClientFields.MiddleName,
            required: false,
            type: FeildType.Text
        }, {
            fieldName: ClientFields.LastName,
            required: true,
            type: FeildType.Text
        }, {
            fieldName: ClientFields.EmailAddress,
            required: true,
            type: FeildType.Text
        }, {
            fieldName: ClientFields.PhoneNumber,
            required: true,
            type: FeildType.Text
        }, {
            fieldName: ClientFields.Industry,
            required: true,
            type: FeildType.Text
        }, {
            fieldName: ClientFields.Website,
            required: false,
            type: FeildType.Text
        }, {
            fieldName: ClientFields.ClientAddress,
            required: true,
            type: FeildType.Text
        }, {
            fieldName: ClientFields.ClientStatus,
            required: true,
            type: FeildType.Choices
        }, {
            fieldName: ClientFields.ClientCode,
            required: true,
            type: FeildType.Text
        },
    ];

    const editClick = (item: IClientsView) => {
        loadComponent(ComponentName.AddClient, componentName, item.ID);
    }

    const deleteConfirmationClick = (item: IClientsView) => {
        if (item?.Id) {
            setDialogState({
                dialogHeader: "Confirmation",
                dialogMessage: Messages.DeleteConfirmation,
                isSuccess: true
            });
            setItemId(item?.Id);
            toggleHideDialog();
        }
    }

    const _generateColumns = (): ICustomColumn[] => {
        const columns: ICustomColumn[] = [
            {
                ...columnProps,
                isSorted: true,
                isSortedDescending: true,
                key: ClientFields.ID,
                name: ClientViewFields.Id,
                fieldName: ClientFields.ID,
                // columnActionsMode: ColumnActionsMode.hasDropdown,
                minWidth: 50,
                maxWidth: 70
            },
            {
                ...columnProps,
                key: ClientFields.FirstName,
                name: ClientViewFields.FirstName,
                fieldName: ClientFields.FirstName,
                minWidth: 80,
                maxWidth: 150,
                className: "p-r-0 ",
                isSortingRequired: true,
                onRender: (rowitem: any) => {
                    const element: React.ReactElement<any> = React.createElement(
                        ListMenu, {
                        itemId: rowitem.Id,
                        item: rowitem,
                        listGUID: listGUID,
                        deleteClick: deleteConfirmationClick,
                        editClick: editClick
                    }
                    );
                    return <div className="dflex dataJustifyBetween">
                        <div>
                            {rowitem.FirstName}
                        </div>
                        <div>
                            {element}
                        </div>
                    </div>
                }
                // columnActionsMode: ColumnActionsMode.hasDropdown,
            },
            // {
            //     name: "Action",
            //     key: "",
            //     fieldName: "",
            //     minWidth: 20,
            //     maxWidth: 20,
            //     isSortingRequired: false,
            //     onRender: (rowitem: any) => {
            //         const element: React.ReactElement<any> = React.createElement(
            //             ListMenu, {
            //             item: rowitem
            //         }
            //         );
            //         return element;
            //     }
            // },
            {
                ...columnProps,
                key: ClientFields.MiddleName,
                name: ClientViewFields.MiddleName,
                fieldName: ClientFields.MiddleName,
                minWidth: 80,
                maxWidth: 150,
                // columnActionsMode: ColumnActionsMode.hasDropdown,

            },
            {
                ...columnProps,
                key: ClientFields.LastName,
                name: ClientViewFields.LastName,
                fieldName: ClientFields.LastName,
                minWidth: 80,
                maxWidth: 150,
                // columnActionsMode: ColumnActionsMode.hasDropdown,
            },
            {
                ...columnProps,
                key: ClientFields.ClientCode,
                name: ClientViewFields.ClientCode,
                fieldName: ClientFields.ClientCode,
                minWidth: 80,
                maxWidth: 150,
                // columnActionsMode: ColumnActionsMode.hasDropdown,
            },
            {
                ...columnProps,
                key: ClientFields.EmailAddress,
                name: ClientViewFields.EmailAddress,
                fieldName: ClientFields.EmailAddress,
                minWidth: 150,
                maxWidth: 250,
                // columnActionsMode: ColumnActionsMode.hasDropdown,
            },
            {
                ...columnProps,
                key: ClientFields.PhoneNumber,
                name: ClientViewFields.PhoneNumber,
                fieldName: ClientFields.PhoneNumber,
                minWidth: 90,
                maxWidth: 100,
                // columnActionsMode: ColumnActionsMode.hasDropdown,

            },
            {
                ...columnProps,
                key: ClientFields.ClientStatus,
                name: ClientViewFields.ClientStatus,
                fieldName: ClientFields.ClientStatus,
                minWidth: 70,
                maxWidth: 100,
                // columnActionsMode: ColumnActionsMode.hasDropdown,

            }, {
                ...columnProps,
                key: ClientFields.User,
                name: ClientViewFields.User,
                fieldName: ClientFields.User,
                minWidth: 70,
                maxWidth: 90,
                // columnActionsMode: ColumnActionsMode.hasDropdown,
            }, {
                ...columnProps,
                key: ClientFields.Industry,
                name: ClientViewFields.Industry,
                fieldName: ClientFields.Industry,
                minWidth: 70,
                maxWidth: 150,
                // columnActionsMode: ColumnActionsMode.hasDropdown,
            }, {
                ...columnProps,
                key: ClientFields.Website,
                name: ClientViewFields.Website,
                fieldName: ClientFields.Website,
                minWidth: 100,
                maxWidth: 120,
                // columnActionsMode: ColumnActionsMode.hasDropdown,
            }, {
                ...columnProps,
                key: ClientFields.ID,
                name: "Action",
                fieldName: "",
                minWidth: 150,
                maxWidth: 200,
                onRender: (item: IClientsView) => {
                    return <><div className="dflex">
                        <Link className="actionBtn iconSize btnEdit dticon"
                            onClick={() => {
                                editClick(item)
                            }} >
                            <TooltipHost
                                content={"Edit Item"}
                                id={tooltipId}
                            >
                                <FontAwesomeIcon icon={"pencil"} />
                            </TooltipHost>
                        </Link>
                        <Link className="actionBtn iconSize btnDanger dticon"
                            onClick={() => {
                                deleteConfirmationClick(item)
                            }} >
                            <TooltipHost
                                content={"Delete Item"}
                                id={tooltipId}
                            >
                                <FontAwesomeIcon icon="trash-can" />
                            </TooltipHost>
                        </Link>
                        {/* <ViewDetail itemId={item?.Id || 0} /> */}
                    </div>
                    </>
                }
            }
        ]
        return columns;
    }

    const hasError = React.useMemo(() => {
        return !error ? false : true;
    }, [error]);

    const loadData = async (pageToken: string, sortOptions: { sortColumn: string, sortOrder: SortOrder }, filterFields?: ICamlQueryFilter[]) => {
        try {
            const camlQuery = new CamlBuilder()
                .View([
                    ClientFields.Id,
                    ClientFields.Title,
                    ClientFields.FirstName,
                    ClientFields.LastName,
                    ClientFields.MiddleName,
                    ClientFields.ClientName,
                    ClientFields.EmailAddress,
                    ClientFields.PhoneNumber,
                    ClientFields.ClientStatus,
                    ClientFields.User,
                    ClientFields.Industry,
                    ClientFields.Website,
                    ClientFields.ClientAddress,
                    ClientFields.ClientCode,
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
                listName: ListNames.ExcelClientList,
                queryXML: camlQuery.ToString(),
                pageToken: pageToken,
            }
            const localResponse = await provider.getItemsInBatchByCAMLQuery(pnpQueryOptions);
            return localResponse;
        } catch (error) {
            const _error = getErrorMessage(error);
            setError(_error);
            return null;
        }
    }

    const mappingData = (listItems: any): IClientsView[] => {
        if (!!listItems) {
            try {
                const listItemsData: any[] = listItems.map((itemObj: any, index: number) => {
                    const item: IClientsView = {
                        FirstName: getStringValue(itemObj?.FirstName),
                        MiddleName: getStringValue(itemObj?.MiddleName),
                        LastName: getStringValue(itemObj?.LastName),
                        EmailAddress: getStringValue(itemObj?.EmailAddress),
                        PhoneNumber: getStringValue(itemObj?.PhoneNumber),
                        ClientStatus: getStringValue(itemObj?.ClientStatus),
                        UserId: getPeoplePickerValueCAML(itemObj?.User, "id"),
                        User: getPeoplePickerValueCAML(itemObj?.User, "title"),
                        UserEmail: getPeoplePickerValueCAML(itemObj?.User, "email"),
                        ClientCode: getStringValue(itemObj?.ClientCode),
                        ClientAddress: getStringValue(itemObj?.ClientAddress),
                        Industry: getStringValue(itemObj?.Industry),
                        Website: getStringValue(itemObj?.Website),
                        ID: getNumberValue(itemObj?.ID),
                        Id: getNumberValue(itemObj?.ID),
                    };
                    return item;
                });
                return listItemsData;
            } catch (e) {
                setError(e);
            }
        }
        return [];
    }


    const filterFields: ICamlQueryFilter[] = [
        // {
        //     fieldName: ClientFields.ClientStatus,
        //     fieldValue: "Active",
        //     fieldType: FieldType.Text,
        //     LogicalType: LogicalType.EqualTo
        // },
        // {
        //     fieldName: "FirstName",
        //     fieldValue: "Madison",
        //     fieldType: FieldType.Text,
        //     LogicalType: LogicalType.Contains
        // },
        // {
        //     fieldName: "Department",
        //     fieldValue: "Human Resource",
        //     fieldType: FieldType.Lookup,
        //     LogicalType: LogicalType.EqualTo
        // },
        // {
        //     fieldName: "ID",
        //     fieldValue: "95",
        //     fieldType: FieldType.Number,
        //     LogicalType: LogicalType.GreaterThanOrEqualTo
        // }
    ]

    const getListGuid = async () => {
        let data = await provider.getListGUID(ListNames.Clients);
        if (!!data) {
            setListGUID(data.Id)
        }
    }



    const onClickPrint = async (printType: any) => {
        await generateAndSavePDF("pdfGenerate", "dummy", printType);
    }

    const loadBatchOfItems = async (): Promise<void> => {
        try {
            const localResponse = await loadData("", { sortColumn: "ID", sortOrder: SortOrder.Descending }, filterFields);
            const listItems = mappingData(localResponse?.Row);
            setNextData(localResponse);
            setitems(listItems);
            setIsLoading(false);
        } catch (error) {
            console.error('An error occurred while loading batch of items:', error);
        }
    };

    const _deleteItem = async (itemId: number): Promise<any> => {
        let response = true;
        if (itemId) {
            response = await provider.deleteItem(ListNames.Clients, itemId);
            if (response) {
                setDialogState({
                    dialogHeader: "Success",
                    dialogMessage: Messages.ClientDeleteSuccess,
                    isSuccess: true
                });
                toggleHideSuccessDialog();
            } else {
                setDialogState({
                    dialogHeader: "Warning",
                    dialogMessage: Messages.ClientDeleteFailed,
                    isSuccess: true
                });
                toggleHideSuccessDialog();
            }
        }
        return response;
    }

    const reloadData = async (): Promise<void> => {
        setIsLoading(true);
        if (dialogState?.dialogHeader !== "" && dialogState?.dialogMessage !== "") {
            toggleHideSuccessDialog();
        }
        await loadBatchOfItems();
        setIsLoading(false);
    }

    const deleteItem = async (): Promise<void> => {
        setIsLoading(true);
        toggleHideDialog();
        await _deleteItem(itemId);
        setIsLoading(false);
    }

    const onSelectionChange = (item: any): void => {
        if (item.length > 0) {
            setSelecteditems(item);
            console.log(item);
        } else {
            setSelecteditems([])
        }
    };

    return {
        isLoading,
        allItems,
        importFileColumnNames,
        dialogState,
        nextData,
        filterFields,
        selectedItems,
        hasError,
        error,
        printTypeOpitons,
        setIsLoading,
        _generateColumns,
        loadBatchOfItems,
        loadData,
        mappingData,
        reloadData,
        getListGuid,
        deleteItem,
        onClickPrint,
        onSelectionChange,
    }
}
/* eslint-disable*/
import React from "react"
import { columnProps } from "../../../Shared/constants/Constants"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, TooltipHost } from "office-ui-fabric-react"
import { ClientFields, ClientViewFields } from "../../custom/clients/ClientFields"
import { IClientsView } from "../../custom/clients/IClients"
import { ICustomColumn } from "../DetailList/DataGridComponent"
import { getCAMLQueryFilterExpression, getErrorMessage, getNumberValue, getStringValue } from "../../../Shared/Utils"
import CamlBuilder from "camljs"
import IPnPQueryOptions, { IPnPCAMLQueryOptions } from "../../../Service/models/IPnPQueryOptions"
import { FieldType, ICamlQueryFilter, LogicalType } from "../../../Shared/Enum/CamlQueryFilter"
import { ListNames } from "../../../Shared/Enum/ListNames"
import { SortOrder } from "../DetailList/constant/DetailListEnum"
import { appGlobalStateAtom } from "../../../jotai/appGlobalStateAtom"
import { useAtomValue } from "jotai";
import { ClientListCamelQuerySchema, FormResultsSchema, LibrarySchema } from "./ZodData"
import { DMSDocumentsFields, DMSDocumentsViewFields } from "../../custom/documents/DocumentFields"
export const ZodExampleData = () => {
    const PAGE_LENGTH: number = 30;
    const appGlobalState = useAtomValue(appGlobalStateAtom);
    const { provider, loadComponent, componentName, context } = appGlobalState;
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [allItems, setitems] = React.useState<any[]>([]);
    const [documentsItems, setDocumentsItems] = React.useState<any[]>([]);
    /**
     * 
     * @returns below column generate method is for the getItemsByQuery
     */
    // const _generateColumns = (): ICustomColumn[] => {
    //     const columns: any[] = [
    //         {
    //             ...columnProps,
    //             isSorted: true,
    //             isSortedDescending: true,
    //             key: ClientFields.ID,
    //             name: ClientViewFields.Id,
    //             fieldName: ClientFields.ID,
    //             // columnActionsMode: ColumnActionsMode.hasDropdown,
    //             minWidth: 50,
    //             maxWidth: 70
    //         },
    //         {
    //             ...columnProps,
    //             key: ClientFields.Image,
    //             name: ClientViewFields.Image,
    //             fieldName: ClientFields.Image,
    //             minWidth: 150,
    //             maxWidth: 180,
    //             onRender: (item: any) => {
    //                 if (!!item?.Image) {
    //                     let filePath: string = context.pageContext.web.serverRelativeUrl + '/Lists/ExcelClientList/Attachments/' + item.ID + "/"
    //                     return (<img src={`${filePath + item.Image}`} height="75px" width="75px" className="course-img-first" />)
    //                 } else {
    //                     return ""
    //                 }

    //             }
    //         },
    //         {
    //             ...columnProps,
    //             key: "Attachment",
    //             name: "Attachment",
    //             fieldName: "Attachment",
    //             minWidth: 150,
    //             maxWidth: 180,
    //             onRender: (item: any) => {
    //                 if (item?.AttachmentFiles?.length > 0) {
    //                     let filePath: string = context.pageContext.web.serverRelativeUrl + '/Lists/ExcelClientList/Attachments/' + item.ID + "/"
    //                     return (<iframe src={item.AttachmentFiles[0].ServerRelativeUrl} height="75px" width="75px" className="course-img-first" />)
    //                 } else {
    //                     return ""
    //                 }

    //             }
    //         },
    //         {
    //             ...columnProps,
    //             key: ClientFields.FirstName,
    //             name: ClientViewFields.FirstName,
    //             fieldName: ClientFields.FirstName,
    //             minWidth: 80,
    //             maxWidth: 150,
    //             isSortingRequired: true,
    //             // columnActionsMode: ColumnActionsMode.hasDropdown,
    //         },

    //         {
    //             ...columnProps,
    //             key: ClientFields.MiddleName,
    //             name: ClientViewFields.MiddleName,
    //             fieldName: ClientFields.MiddleName,
    //             minWidth: 80,
    //             maxWidth: 150,
    //             // columnActionsMode: ColumnActionsMode.hasDropdown,

    //         },
    //         {
    //             ...columnProps,
    //             key: ClientFields.LastName,
    //             name: ClientViewFields.LastName,
    //             fieldName: ClientFields.LastName,
    //             minWidth: 80,
    //             maxWidth: 150,
    //             // columnActionsMode: ColumnActionsMode.hasDropdown,
    //         },
    //         {
    //             ...columnProps,
    //             key: ClientFields.ClientCode,
    //             name: ClientViewFields.ClientCode,
    //             fieldName: ClientFields.ClientCode,
    //             minWidth: 80,
    //             maxWidth: 150,
    //             // columnActionsMode: ColumnActionsMode.hasDropdown,
    //         },
    //         {
    //             ...columnProps,
    //             key: "Modified",
    //             name: "Modified",
    //             fieldName: "Modified",
    //             minWidth: 80,
    //             maxWidth: 150,
    //             // columnActionsMode: ColumnActionsMode.hasDropdown,
    //         },
    //         {
    //             ...columnProps,
    //             key: ClientFields.EmailAddress,
    //             name: ClientViewFields.EmailAddress,
    //             fieldName: ClientFields.EmailAddress,
    //             minWidth: 150,
    //             maxWidth: 250,
    //             // columnActionsMode: ColumnActionsMode.hasDropdown,
    //         },
    //         {
    //             ...columnProps,
    //             key: ClientFields.PhoneNumber,
    //             name: ClientViewFields.PhoneNumber,
    //             fieldName: ClientFields.PhoneNumber,
    //             minWidth: 90,
    //             maxWidth: 100,
    //             // columnActionsMode: ColumnActionsMode.hasDropdown,

    //         },
    //         {
    //             ...columnProps,
    //             key: ClientFields.RepresentativeTitle,
    //             name: ClientViewFields.Representative,
    //             fieldName: ClientFields.Representative,
    //             minWidth: 150,
    //             maxWidth: 180,
    //             onRender: (item: any) => {
    //                 return (item?.Representative?.length > 0 ? item.Representative.join(", ") : "")
    //             }
    //         },
    //         {
    //             ...columnProps,
    //             key: ClientFields.City,
    //             name: ClientViewFields.City,
    //             fieldName: ClientFields.City,
    //             minWidth: 150,
    //             maxWidth: 180,
    //             onRender: (item: any) => {
    //                 return (item?.City?.length > 0 ? item.City.join(", ") : "")
    //             }
    //         },
    //         {
    //             ...columnProps,
    //             key: ClientFields.Technology,
    //             name: ClientViewFields.Technology,
    //             fieldName: ClientFields.Technology,
    //             minWidth: 150,
    //             maxWidth: 180,
    //             onRender: (item: any) => {
    //                 return (item?.Technology?.length > 0 ? item.Technology.join(", ") : "")
    //             }
    //         },
    //         {
    //             ...columnProps,
    //             key: ClientFields.IsDelete,
    //             name: ClientViewFields.IsDelete,
    //             fieldName: ClientFields.IsDelete,
    //             minWidth: 150,
    //             maxWidth: 180,
    //         },

    //         {
    //             ...columnProps,
    //             key: ClientFields.ClientStatus,
    //             name: ClientViewFields.ClientStatus,
    //             fieldName: ClientFields.ClientStatus,
    //             minWidth: 70,
    //             maxWidth: 100,
    //             // columnActionsMode: ColumnActionsMode.hasDropdown,

    //         }, {
    //             ...columnProps,
    //             key: ClientFields.User,
    //             name: ClientViewFields.User,
    //             fieldName: ClientFields.User,
    //             minWidth: 70,
    //             maxWidth: 90,
    //             // columnActionsMode: ColumnActionsMode.hasDropdown,
    //         }, {
    //             ...columnProps,
    //             key: ClientFields.Industry,
    //             name: ClientViewFields.Industry,
    //             fieldName: ClientFields.Industry,
    //             minWidth: 70,
    //             maxWidth: 90,
    //             // columnActionsMode: ColumnActionsMode.hasDropdown,
    //         },
    //         {
    //             ...columnProps,
    //             key: ClientFields.Website,
    //             name: ClientViewFields.Website,
    //             fieldName: ClientFields.Website,
    //             minWidth: 100,
    //             maxWidth: 120,
    //             // columnActionsMode: ColumnActionsMode.hasDropdown,
    //         },
    //         // columnActionsMode: ColumnActionsMode.hasDropdown,


    //     ]
    //     return columns;
    // }
    /**
     * 
     * @returns below column generate method is for the getItemsByCamelQuery
     */

    const generateColumnslibrary = (): ICustomColumn[] => {
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
                key: 'column8',
                name: DMSDocumentsViewFields.Modified,
                fieldName: DMSDocumentsFields.Modified,
                minWidth: 80,
                maxWidth: 100,
            },
        ];
        return columns;
    }


    const _generateColumns = (): ICustomColumn[] => {
        const columns: any[] = [
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
                key: ClientFields.Image,
                name: ClientViewFields.Image,
                fieldName: ClientFields.Image,
                minWidth: 150,
                maxWidth: 180,
                onRender: (item: any) => {
                    if (!!item.Image) {
                        let filePath: string = context.pageContext.web.serverRelativeUrl + '/Lists/ExcelClientList/Attachments/' + item.ID + "/"
                        return (<img src={`${filePath + item.Image}`} height="75px" width="75px" className="course-img-first" />)
                    } else {
                        return ""
                    }

                }
            },
            {
                ...columnProps,
                key: "Attachment",
                name: "Attachment",
                fieldName: "Attachment",
                minWidth: 150,
                maxWidth: 180,
                onRender: (item: any) => {
                    if (item?.AttachmentFiles?.length > 0) {
                        return (<iframe src={item.AttachmentFiles[0].ServerRelativeUrl} height="75px" width="75px" className="course-img-first" />)
                    } else {
                        return ""
                    }

                }
            },
            {
                ...columnProps,
                key: ClientFields.FirstName,
                name: ClientViewFields.FirstName,
                fieldName: ClientFields.FirstName,
                minWidth: 80,
                maxWidth: 150,
                isSortingRequired: true,
                // columnActionsMode: ColumnActionsMode.hasDropdown,
            },

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
                key: "Modified",
                name: "Modified",
                fieldName: "Modified",
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
                key: ClientFields.RepresentativeTitle,
                name: ClientViewFields.Representative,
                fieldName: ClientFields.Representative,
                minWidth: 80,
                maxWidth: 100,
                onRender: (item: any) => {
                    return (item?.Representative?.length > 0 ? item.Representative.map((x: any) => x.id).join(', ') : "")
                }
            },
            {
                ...columnProps,
                key: ClientFields.RepresentativeTitle,
                name: ClientViewFields.RepresentativeId,
                fieldName: ClientFields.Representative,
                minWidth: 150,
                maxWidth: 180,
                onRender: (item: any) => {
                    return (item?.Representative?.length > 0 ? item.Representative.map((x: any) => x.title).join(', ') : "")
                }
            },
            {
                ...columnProps,
                key: ClientFields.City,
                name: ClientViewFields.City,
                fieldName: ClientFields.City,
                minWidth: 150,
                maxWidth: 180,
                onRender: (item: any) => {
                    return (item?.City?.length > 0 ? item.City.join(", ") : "")
                }
            },
            {
                ...columnProps,
                key: ClientFields.Technology,
                name: ClientViewFields.Technology,
                fieldName: ClientFields.Technology,
                minWidth: 150,
                maxWidth: 180,
                onRender: (item: any) => {
                    return (item?.Technology?.length > 0 ? item.Technology.join(", ") : "")
                }
            },
            {
                ...columnProps,
                key: ClientFields.IsDelete,
                name: ClientViewFields.IsDelete,
                fieldName: ClientFields.IsDelete,
                minWidth: 150,
                maxWidth: 180,
            },

            {
                ...columnProps,
                key: ClientFields.ClientStatus,
                name: ClientViewFields.ClientStatus,
                fieldName: ClientFields.ClientStatus,
                minWidth: 70,
                maxWidth: 100,
                // columnActionsMode: ColumnActionsMode.hasDropdown,

            },
            {
                ...columnProps,
                key: ClientFields.User,
                name: ClientViewFields.User + "Id",
                fieldName: ClientFields.User,
                minWidth: 80,
                maxWidth: 100,
                onRender: (item: any) => {
                    return (item?.User?.length > 0 ? item.User.map((x: any) => x.id).join(', ') : "")
                }
            },
            {
                ...columnProps,
                key: ClientFields.User,
                name: ClientViewFields.User,
                fieldName: ClientFields.User,
                minWidth: 150,
                maxWidth: 180,
                onRender: (item: any) => {
                    return (item?.User?.length > 0 ? item.User.map((x: any) => x.title).join(', ') : "")
                }
            },
            , {
                ...columnProps,
                key: ClientFields.Industry,
                name: ClientViewFields.Industry,
                fieldName: ClientFields.Industry,
                minWidth: 70,
                maxWidth: 90,
                // columnActionsMode: ColumnActionsMode.hasDropdown,
            },
            {
                ...columnProps,
                key: ClientFields.Website,
                name: ClientViewFields.Website,
                fieldName: ClientFields.Website,
                minWidth: 100,
                maxWidth: 120,
                // columnActionsMode: ColumnActionsMode.hasDropdown,
            },
            // columnActionsMode: ColumnActionsMode.hasDropdown,


        ]
        return columns;
    }



    // const loadBatchOfItems = async (): Promise<void> => {
    //     try {
    //         // const localResponse = await loadData("", { sortColumn: "ID", sortOrder: SortOrder.Descending }, filterFields);
    //         const queryOptions: IPnPQueryOptions = {
    //             listName: ListNames.ExcelClientList,
    //             filter: "Id eq '19330' or Id eq '19329' or Id eq '19328'",
    //             select: [
    //                 ClientFields.Id,
    //                 ClientFields.Title,
    //                 ClientFields.FirstName,
    //                 ClientFields.LastName,
    //                 ClientFields.MiddleName,
    //                 ClientFields.ClientName,
    //                 ClientFields.EmailAddress,
    //                 ClientFields.PhoneNumber,
    //                 ClientFields.ClientStatus,
    //                 ClientFields.Industry,
    //                 ClientFields.Website,
    //                 ClientFields.ClientAddress,
    //                 ClientFields.ClientCode,
    //                 ClientFields.RepresentativeId,
    //                 ClientFields.RepresentativeTitle,
    //                 ClientFields.UserId,
    //                 ClientFields.UserValue,
    //                 ClientFields.Modified,
    //                 ClientFields.CityTitle,
    //                 ClientFields.Technology,
    //                 ClientFields.IsDelete,
    //                 ClientFields.Image,
    //                 ClientFields.AttachmentFiles,
    //             ],
    //             expand: ["User,Representative,City,AttachmentFiles"],
    //         }
    //         const data = await provider.getItemsByQuery(queryOptions)
    //         const listItems = FormResultsSchema.parse(data)
    //         // const listItems = FormResultsSchema.parse([
    //         //     {
    //         //         Title: 'Sample Title',
    //         //         FirstName: 'John',
    //         //         MiddleName: 'A',
    //         //         ID: 123,
    //         //         LastName: 'Doe',
    //         //         ClientName: 'Client XYZ',
    //         //         EmailAddress: 'john.doe@example.com',
    //         //         PhoneNumber: '123-456-7890',
    //         //         ClientStatus: 'Active',
    //         //         Industry: 'Technology',
    //         //         Website: null,
    //         //         ClientAddress: '123 Main St',
    //         //         ClientCode: 'C123',
    //         //         UserId: 1,
    //         //         User: { Title: 'Manager' },
    //         //         RepresentativeId: [20, 21],
    //         //     },
    //         //     {
    //         //         Title: 'Another Title',
    //         //         FirstName: 'Jane',
    //         //         MiddleName: 'B',
    //         //         ID: 124,
    //         //         LastName: 'Smith',
    //         //         ClientName: 'Client ABC',
    //         //         EmailAddress: 'jane.smith@example.com',
    //         //         PhoneNumber: '098-765-4321',
    //         //         ClientStatus: 'Inactive',
    //         //         Industry: 'Finance',
    //         //         Website: undefined,
    //         //         ClientAddress: '456 Elm St',
    //         //         ClientCode: 'C456',
    //         //         UserId: 2,
    //         //         RepresentativeId: [20, 21],
    //         //         RepresentativeTitle: [{ Title: "Hello" }, { Title: "Hello2" }]
    //         //     },
    //         //     {
    //         //         Title: 'Third Title',
    //         //         FirstName: 'Jim',
    //         //         MiddleName: 'C',
    //         //         ID: 125,
    //         //         LastName: 'Beam',
    //         //         ClientName: 'Client DEF',
    //         //         EmailAddress: 'jim.beam@example.com',
    //         //         PhoneNumber: '111-222-3333',
    //         //         ClientStatus: 'Pending',
    //         //         Industry: 'Healthcare',
    //         //         Website: 'http://example.com',
    //         //         ClientAddress: '789 Pine St',
    //         //         ClientCode: 'C789',
    //         //         UserId: 3,
    //         //         User: { Title: null },
    //         //         RepresentativeId: [20, 21],
    //         //         RepresentativeTitle: [{ Title: "Hello" }, { Title: "Hello2" }]
    //         //     }
    //         // ])
    //         // setNextData(localResponse);
    //         setitems(listItems);
    //         setIsLoading(false);
    //     } catch (error) {
    //         console.error('An error occurred while loading batch of items:', error);
    //     }
    // };

    const loadBatchOfItems = async (): Promise<void> => {
        try {
            let camlQuery = new CamlBuilder()
                .View([
                    ClientFields.ID,
                    ClientFields.Title,
                    ClientFields.FirstName,
                    ClientFields.LastName,
                    ClientFields.MiddleName,
                    ClientFields.ClientName,
                    ClientFields.EmailAddress,
                    ClientFields.PhoneNumber,
                    ClientFields.ClientStatus,
                    ClientFields.Industry,
                    ClientFields.Website,
                    ClientFields.ClientAddress,
                    ClientFields.ClientCode,
                    ClientFields.Representative,
                    ClientFields.User,
                    ClientFields.Modified,
                    ClientFields.City,
                    ClientFields.Technology,
                    ClientFields.IsDelete,
                    ClientFields.Image,
                ])
                .Scope(CamlBuilder.ViewScope.RecursiveAll)
                .RowLimit(5000, true)
                .Query();
            const filterFields: any[] = [
                {
                    fieldName: ClientFields.ID,
                    fieldValue: [19330, 19229],
                    fieldType: FieldType.Number,
                    LogicalType: LogicalType.In
                },
            ]

            if (filterFields) {
                const categoriesExpressions: any[] = getCAMLQueryFilterExpression(filterFields);
                camlQuery.Where().All(categoriesExpressions);
            }
            const data = await provider.getItemsByCAMLQuery(ListNames.ExcelClientList, camlQuery.ToString(),)
            const listItems = ClientListCamelQuerySchema.parse(data);
            setitems(listItems);

            /**
             * get document library
             * 
             */
            const camlQueryLibrary = new CamlBuilder()
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
                .RowLimit(5000, false)
                .Query()
            const libraryitems = await provider.getItemsByCAMLQuery(ListNames.DMSDocuments, camlQueryLibrary.ToString(),);
            const libraryData = LibrarySchema.parse(libraryitems);
            setDocumentsItems(libraryData);

            setIsLoading(false);
        } catch (error) {
            console.error('An error occurred while loading batch of items:', error);
        }
    };


    return {
        _generateColumns,
        loadBatchOfItems,
        generateColumnslibrary,
        allItems,
        isLoading,
        documentsItems


    }
}
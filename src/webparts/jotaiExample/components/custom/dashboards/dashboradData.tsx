import * as React from 'react'
import { DateFormat, columnProps } from '../../../Shared/constants/Constants';
import { ICustomColumn } from '../../Common/DetailList/DataGridComponent';
import { DMSDocumentsFields, DMSDocumentsViewFields } from '../documents/DocumentFields';
import CamlBuilder from 'camljs';
import { ListNames } from '../../../Shared/Enum/ListNames';
import { formatBytes, getFileTypeIcon, getLookupIdCAML, getLookupValueCAML, getNumberValue, getPeoplePickerValueCAML, getStringValue } from '../../../Shared/Utils';
import { appGlobalStateAtom } from '../../../jotai/appGlobalStateAtom';
import { useAtomValue } from 'jotai';
import { IPnPCAMLQueryOptions } from '../../../Service/models/IPnPQueryOptions';
import { IDocuments } from '../documents/IDocuments';
import moment from 'moment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const BATCHSIZE = 3000;
export function dashboradData() {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [clientDataCount, setClientDataCount] = React.useState<number>(0);
    const [metaDataDetailsDataList, setmetaDataDetailsDataList] = React.useState<IDocuments[]>([]);
    const [metaDataCount, setMetaDataCount] = React.useState<number>(0);
    const [metaDataActiveCount, setMetaDataActiveCount] = React.useState<number>(0);
    const [metaDataArchieveCount, setMetaDataArchieveCount] = React.useState<number>(0);

    const appGlobalState = useAtomValue(appGlobalStateAtom);
    const { provider } = appGlobalState;

    const _generateColumns = (): ICustomColumn[] => {
        const columns: ICustomColumn[] = [
            {
                ...columnProps,
                isSorted: true,
                isSortedDescending: true,
                key: DMSDocumentsFields.ID,
                name: DMSDocumentsViewFields.Id,
                fieldName: DMSDocumentsFields.ID,
                minWidth: 50,
                maxWidth: 70,
            },
            {
                ...columnProps,
                key: DMSDocumentsFields.FileLeafRef,// give here fieldName for header filter apply,
                name: DMSDocumentsViewFields.FileName,
                fieldName: DMSDocumentsFields.FileLeafRef,
                minWidth: 150,
                maxWidth: 250,
                isSortingRequired: true
            },
            {
                ...columnProps,
                key: DMSDocumentsFields.ClientName,
                name: DMSDocumentsViewFields.ClientName,
                fieldName: DMSDocumentsFields.ClientName,
                minWidth: 80,
                maxWidth: 150

            },
            {
                ...columnProps,
                key: DMSDocumentsFields.DocumentCategory,
                name: DMSDocumentsViewFields.DocumentCategory,
                fieldName: DMSDocumentsFields.DocumentCategory,
                minWidth: 80,
                maxWidth: 150

            },
            {
                ...columnProps,
                key: DMSDocumentsFields.DocumentSubcategory,
                name: DMSDocumentsViewFields.DocumentSubcategory,
                fieldName: DMSDocumentsFields.DocumentSubcategory,
                minWidth: 80,
                maxWidth: 150,
            },
            {
                ...columnProps,
                key: DMSDocumentsFields.DocumentKeyword,
                name: DMSDocumentsViewFields.DocumentKeyword,
                fieldName: DMSDocumentsFields.DocumentKeyword,
                minWidth: 80,
                maxWidth: 150,
            },
            {
                ...columnProps,
                key: DMSDocumentsFields.DocumentStatus,
                name: DMSDocumentsViewFields.DocumentStatus,
                fieldName: DMSDocumentsFields.DocumentStatus,
                minWidth: 80,
                maxWidth: 150,
            },
            {
                ...columnProps,
                key: DMSDocumentsFields.AuthorValue,
                name: DMSDocumentsViewFields.Author,
                fieldName: DMSDocumentsFields.AuthorValue,
                minWidth: 90,
                maxWidth: 100,

            },
            {
                ...columnProps,
                key: DMSDocumentsFields.Created,
                name: DMSDocumentsViewFields.Created,
                fieldName: DMSDocumentsFields.Created,
                minWidth: 70,
                maxWidth: 100,
            }
        ]
        return columns;
    }

    const _getDocuments = async () => {
        let camlQuery;
        try {
            camlQuery = new CamlBuilder().View([
                DMSDocumentsFields.Id,
                DMSDocumentsFields.ID,
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
                DMSDocumentsFields.ClientName
            ])
                .Scope(CamlBuilder.ViewScope.RecursiveAll)
                .RowLimit(5, true)
                .Query()
                .Where()
                .BooleanField("IsRecycled").NotEqualTo(true)
                .And()
                .TextField(DMSDocumentsFields.DocumentStatus).EqualTo("Active")
                .OrderByDesc("Created");

            const pnpQueryOptions: IPnPCAMLQueryOptions = {
                listName: ListNames.DMSDocuments,
                queryXML: camlQuery.ToString(),
                pageToken: ""
            };
            const localResponse = await provider.getItemsInBatchByCAMLQuery(pnpQueryOptions);
            return localResponse;
        }
        catch (ex) {
            console.log(ex);
        }
    };

    const getMetadataCountInHome = async () => {
        let camlQuery;
        try {
            camlQuery = new CamlBuilder()
                .View([
                    DMSDocumentsFields.Id,
                    DMSDocumentsFields.DocumentStatus,
                    DMSDocumentsFields.FSObjType,
                ])
                .Scope(CamlBuilder.ViewScope.RecursiveAll)
                .RowLimit(BATCHSIZE, true)
                .Query()
                .Where()
                .BooleanField("IsRecycled").NotEqualTo(true)
                .And()
                .BooleanField(DMSDocumentsFields.FSObjType).NotEqualTo(true);

            const pnpQueryOptions: IPnPCAMLQueryOptions = {
                listName: ListNames.DMSDocuments,
                queryXML: camlQuery.ToString(),
                pageToken: ""
            };
            return await provider.getItemsInBatchByCAMLQuery(pnpQueryOptions);
        }
        catch (ex) {
            console.log(ex);
        }
    };

    const getClientCount = async () => {
        try {
            const camlQuery = new CamlBuilder().
                View(["ID"])
                .Scope(CamlBuilder.ViewScope.RecursiveAll)
                .RowLimit(5000, true)
                .Query()
                .Where()
                .BooleanField("IsDelete").NotEqualTo(true)
                .ToString();
            return await provider.getItemsByCAMLQuery(ListNames.Clients, camlQuery);
        }
        catch (ex) {
            console.log(ex);
        }
    };

    const loadMore = (camlQueryResponse: any): void => {
        void (async function (): Promise<void> {
            let camlQuery;
            if (!!camlQueryResponse?.NextHref) {
                const randomNumber = Math.floor(Math.random() * (3000 - 500 + 1)) + 1000;
                camlQuery = new CamlBuilder().View([
                    DMSDocumentsFields.Id,
                    DMSDocumentsFields.DocumentStatus,
                    DMSDocumentsFields.FSObjType,
                    DMSDocumentsFields.IsRecycled,
                ])
                    .Scope(CamlBuilder.ViewScope.RecursiveAll)
                    .RowLimit(randomNumber, true)
                    .Query()
                    .Where().BooleanField("IsRecycled").NotEqualTo(true);


                const _localResponse = camlQueryResponse;
                let isNextPage = false;
                let localResponse = _localResponse;
                do {

                    if (!!localResponse?.NextHref) {
                        const pnpQueryOptions: IPnPCAMLQueryOptions = {
                            listName: ListNames.DMSDocuments,
                            queryXML: camlQuery.ToString(),
                            pageToken: !!localResponse?.NextHref ? localResponse?.NextHref?.split('?')[1] : ""
                        };
                        localResponse = await provider.getItemsInBatchByCAMLQuery(pnpQueryOptions);
                        const AllData: IDocuments[] = localResponse?.Row;
                        const documents = AllData.filter((item: IDocuments) => item.DocumentStatus !== "Inactive");
                        setMetaDataCount((prevCount) => prevCount + documents.length);
                        const activeDoc = AllData.filter((item: IDocuments) => item.DocumentStatus === "Active");
                        setMetaDataActiveCount((prevCount) => prevCount + activeDoc.length);
                        const archieveDoc = AllData.filter((item: IDocuments) => item.DocumentStatus === "Archieve");
                        setMetaDataArchieveCount((prevCount) => prevCount + archieveDoc.length);
                    }
                    isNextPage = !!localResponse.NextHref;
                } while (isNextPage);
            }
        })();
    };

    const getAllListItems = async () => {
        setIsLoading(true);
        const [clientData, metadataCountResponse, metadataTopFiveRecords] = await Promise.all([getClientCount(), getMetadataCountInHome(), _getDocuments()]);
        setClientDataCount(clientData?.length);
        if (!!metadataCountResponse) {
            const documents = metadataCountResponse?.Row.filter((item: IDocuments) => item.DocumentStatus !== "Inactive");
            setMetaDataCount(documents.length);
            const activeDoc = metadataCountResponse?.Row.filter((item: IDocuments) => item.DocumentStatus === "Active");
            setMetaDataActiveCount(activeDoc.length);
            const archieveDoc = metadataCountResponse?.Row.filter((item: IDocuments) => item.DocumentStatus === "Archieve");
            setMetaDataArchieveCount(archieveDoc.length);
        }
        if (!!metadataTopFiveRecords) {
            const metaDataDetailsData: IDocuments[] = metadataTopFiveRecords?.Row.map((itemObj: any) => {
                const itemData: IDocuments = {
                    Id: getNumberValue(itemObj?.ID),
                    ID: getNumberValue(itemObj?.ID),
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
            setmetaDataDetailsDataList(metaDataDetailsData);
        }
        setIsLoading(false);
        if (!!metadataCountResponse?.NextHref) {
            loadMore(metadataCountResponse);
        }
    };

    // const printToPdf = () => {
    //     const input = document.getElementById('printArea');
    //     if (input) {
    //         html2canvas(input, { scale: 2 })
    //             .then((canvas) => {
    //                 const imgData = canvas.toDataURL('image/png');
    //                 const pdf = new jsPDF('p', 'mm', 'a4');

    //                 const imgWidth = 210; // A4 width in mm
    //                 const pageHeight = 297; // A4 height in mm
    //                 const imgHeight = (canvas.height * imgWidth) / canvas.width;
    //                 let heightLeft = imgHeight;

    //                 let position = 0;

    //                 pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    //                 heightLeft -= pageHeight;

    //                 while (heightLeft >= 0) {
    //                     position = heightLeft - imgHeight;
    //                     pdf.addPage();
    //                     pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    //                     heightLeft -= pageHeight;
    //                 }

    //                 pdf.save('download.pdf');
    //             })
    //             .catch((error) => {
    //                 console.error('Error generating PDF: ', error);
    //             });
    //     }
    // };

    const printToPdf = () => {
        const input = document.getElementById('printArea');
        if (input) {
            html2canvas(input, { scale: 2 })
                .then((canvas) => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const margin = 5;
                    const imgWidth = 210 - 2 * margin; // A4 width in mm
                    const pageHeight = 297;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    let heightLeft = imgHeight;
                    let position = margin;

                    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight - 2 * margin;

                    while (heightLeft > 0) {
                        position = heightLeft - imgHeight + margin;
                        pdf.addPage();
                        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                        heightLeft -= pageHeight - 2 * margin;
                    }

                    pdf.save('download.pdf');
                })
                .catch((error) => {
                    console.error('Error generating PDF: ', error);
                });
        }
    };

    React.useEffect(() => {
        void (async () => {
            await getAllListItems();
        })();
    }, []);

    return {
        isLoading,
        clientDataCount,
        metaDataDetailsDataList,
        metaDataCount,
        metaDataActiveCount,
        metaDataArchieveCount,
        printToPdf,
        _generateColumns
    }
}


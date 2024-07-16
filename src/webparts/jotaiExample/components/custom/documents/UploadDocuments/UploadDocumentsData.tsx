import { IFileAddResult } from "@pnp/sp/files";
import * as React from "react";
import { IFileWithBlob } from "../../../../Interfaces/IFileWithBlob";
import { Messages } from "../../../../Shared/constants/Messages";
import { IDialogMessageState } from "../../../../models/IDialogState";
import { appGlobalStateAtom } from "../../../../jotai/appGlobalStateAtom";
import { useAtom } from "jotai";
import { IDocumentProperty } from "./IDocumentProperty";
import { DMSDocumentsFields } from "../DocumentFields";
import CamlBuilder from "camljs";
import { CategoryFields } from './../../../../models/CategoryFields';
import { IPnPCAMLQueryOptions } from "../../../../Service/models/IPnPQueryOptions";
import { ListNames } from "../../../../Shared/Enum/ListNames";
import { getErrorMessage } from "../../../../Shared/Utils";
import { SubcategoryFields } from "../../../../models/SubcategoryFields";
import { ClientFields } from "../../clients/ClientFields";
import moment from "moment";

export interface IUploadDocumentsDataProps {
    isMultiple: boolean;
    toggleHideDialog: any;
    onCancelOrSuccessClick: () => void;
}

let uploadedFileCount = 0;
export function uploadDocumentsData(props: IUploadDocumentsDataProps) {
    const { isMultiple } = props;
    const defaultDocumentProperty: IDocumentProperty = {
        ClientNameId: undefined,
        DocumentTitle: "",
        DocumentCategory: "",
        DocumentSubcategory: "",
        DocumentKeywords: "",
        DocumentNumber: moment().format("DDMMYYYYHHmmss")
    }
    const [documentProperty, setDocumentProperty] = React.useState<IDocumentProperty>(defaultDocumentProperty);
    const [categoryOptions, setCategoryOptions] = React.useState<{ value: string, label: string }[]>([]);
    const [subCategoryOptions, setSubcategoryOptions] = React.useState<{ value: string, label: string }[]>([]);
    const [clientOptions, setClientOptions] = React.useState<{ value: string | number, label: string }[]>([]);
    const [category, setCategory] = React.useState<{ value: string, label: string }>({ value: '', label: '-- Select Category --' });
    const [subcategory, setSubcategory] = React.useState<{ value: string, label: string }>({ value: '', label: '-- Select Subcategory --' });
    const [selectedClient, setSelectedClient] = React.useState<{ value: string | number, label: string }>({ value: '', label: '-- Select Client --' });
    const [files, setFiles] = React.useState<IFileWithBlob[]>([]);
    const [percentComplete, setPercentComplete] = React.useState<number>(0);
    const [isUploadingFile, setUploadingFile] = React.useState<boolean>(false);
    const [errorMessages, setErrorMessages] = React.useState<string[]>([]);
    const [appGlobalState] = useAtom(appGlobalStateAtom);
    const { provider, folderPath, itemId } = appGlobalState;
    const [dialogState, setDialogState] = React.useState<IDialogMessageState>({
        dialogHeader: "",
        dialogMessage: "",
        isSuccess: false
    })

    const handleChange = React.useCallback((event: any) => {
        const { name, value } = event.target;
        setDocumentProperty({
            ...documentProperty,
            [name]: value
        });
    }, [documentProperty]);

    const handleReactSelectChange = React.useCallback((selectedOption: { value: string, label: string }, name: string) => {
        setDocumentProperty({
            ...documentProperty,
            [name]: selectedOption.value
        });

        switch (name) {
            case DMSDocumentsFields.DocumentCategory:
                setCategory(selectedOption);
                break;
            case DMSDocumentsFields.DocumentSubcategory:
                setSubcategory(selectedOption);
                break;
            case DMSDocumentsFields.ClientNameId:
                setSelectedClient(selectedOption);
                break;
            default:
                break;
        }
    }, [documentProperty]);

    const setFilesToState = (files: any[]) => {
        try {
            const selectedFiles: IFileWithBlob[] = [];
            if (files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const selectedFile: IFileWithBlob = {
                        file: file,
                        name: file.name,
                        folderServerRelativeURL: folderPath || "",
                        overwrite: true,
                        key: i
                    };
                    selectedFiles.push(selectedFile);
                }
                setFiles(selectedFiles);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onCancel = async () => {
        await setFiles([]);
    };

    const allPromiseProgress = (fileUploadPromises: any[], fileUploadProgress: any): Promise<any> => {
        let progress = 0;
        fileUploadProgress(0);
        for (const awaitFileUpload of fileUploadPromises) {
            awaitFileUpload.then((file: IFileAddResult) => {
                progress++;
                const progPercentage = ((progress * 100) / fileUploadPromises?.length).toFixed(2);
                fileUploadProgress(progPercentage, file);
            });
        }
        return Promise.all(fileUploadPromises);
    }

    const onSaveFiles = async () => {
        try {
            if (files.length === 0) {
                setErrorMessages(["Please select the file"]);
            }
            else {

                setUploadingFile(true);
                if (isMultiple) {
                    const fileUploadArray: any[] = [];
                    files.map(async (fileItem: IFileWithBlob, i: number) => {
                        fileUploadArray.push(provider.uploadFile(fileItem, true, documentProperty));
                    });

                    const resultData: IFileAddResult[] = [];
                    await allPromiseProgress(fileUploadArray, (progPercentage: number, file: IFileAddResult) => {
                        if (file) {
                            resultData.push(file);
                            uploadedFileCount += 1;
                        }
                        setPercentComplete(((progPercentage / 100) + percentComplete) % 1);
                    });

                    setUploadingFile(false);
                    const response = resultData.map((resultItem: IFileAddResult) => {
                        return resultItem && resultItem.data !== null && resultItem.data.ServerRelativeUrl;
                    });
                    if (response.length === files.length) {
                        uploadedFileCount = 0;
                        setFiles([]);
                    }
                } else {
                    await provider.uploadFile(files[0], true, documentProperty);
                    setPercentComplete(100);
                    setFiles([]);
                    setUploadingFile(false);
                }
                setDialogState({
                    dialogHeader: "Success",
                    dialogMessage: Messages.DocumentUploadSuccess,
                    isSuccess: true
                });
                props.toggleHideDialog();

            }
        } catch (e) {
            setUploadingFile(false);
            setDialogState({
                dialogHeader: "Alert",
                dialogMessage: Messages.DocumentUploadFailed,
                isSuccess: false
            });
            props.toggleHideDialog();
        }
    };

    const loadCategoryData = async () => {
        try {
            const camlQuery = new CamlBuilder()
                .View([
                    CategoryFields.ID,
                    CategoryFields.CategoryName
                ])
                .Scope(CamlBuilder.ViewScope.RecursiveAll)
                .RowLimit(5000, true)
                .Query()

            camlQuery.OrderBy(CategoryFields.CategoryName);
            const pnpQueryOptions: IPnPCAMLQueryOptions = {
                listName: ListNames.Category,
                queryXML: camlQuery.ToString(),
                pageToken: ""
            }
            const localResponse = await provider.getItemsInBatchByCAMLQuery(pnpQueryOptions);
            return localResponse;
        } catch (error) {
            const _error = getErrorMessage(error);
            console.log(_error);
            //setError(_error);
            return null;
        }
    }

    const loadSubcategoryData = async (): Promise<any> => {
        try {
            const camlQuery = new CamlBuilder()
                .View([
                    SubcategoryFields.ID,
                    SubcategoryFields.SubcategoryName
                ])
                .Scope(CamlBuilder.ViewScope.RecursiveAll)
                .RowLimit(5000, true)
                .Query()

            camlQuery.OrderBy(SubcategoryFields.SubcategoryName);
            const pnpQueryOptions: IPnPCAMLQueryOptions = {
                listName: ListNames.Subcategory,
                queryXML: camlQuery.ToString(),
                pageToken: ""
            }
            const localResponse = await provider.getItemsInBatchByCAMLQuery(pnpQueryOptions);
            return localResponse;
        } catch (error) {
            const _error = getErrorMessage(error);
            console.log(_error);
            return null;
        }
    }

    const loadClientData = async () => {
        const camlQuery = new CamlBuilder()
            .View([
                ClientFields.Id,
                ClientFields.ID,
                ClientFields.ClientName,
                ClientFields.FolderName,
            ])
            .Scope(CamlBuilder.ViewScope.RecursiveAll)
            .RowLimit(5000, true)
            .Query()
            .Where()
            .BooleanField("IsDelete").NotEqualTo(true);

        const listItems = await provider.getItemsByCAMLQuery(ListNames.Clients, camlQuery.ToString(), "");
        return listItems;

    };


    React.useEffect(() => {
        void (async () => {
            const [categoryData, subCategoryData, clientsData] = await Promise.all([loadCategoryData(), loadSubcategoryData(), loadClientData()]);
            const categoryOptions = [
                { value: '', label: 'Select Category' }
            ];
            const subCategoryOptions = [
                { value: '', label: 'Select Subcategory' }
            ];
            if (categoryData) {
                const listItems = categoryData?.Row;
                listItems.forEach((element: any) => {
                    categoryOptions.push({ value: element?.CategoryName, label: element?.CategoryName });
                });
                setCategoryOptions(categoryOptions);
            }
            if (subCategoryData) {
                const listItems = subCategoryData?.Row;
                listItems.forEach((element: any) => {
                    subCategoryOptions.push({ value: element?.SubcategoryName, label: element?.SubcategoryName });
                });
                setSubcategoryOptions(subCategoryOptions);
            }

            if (!!clientsData) {
                const listItemsData: any[] = clientsData.map((itemObj: any, index: number) => {
                    const item = {
                        value: itemObj.ID,
                        label: itemObj.ClientName,
                    };
                    if (parseInt(itemObj.ID) === itemId) {
                        setSelectedClient(item);
                        setDocumentProperty({
                            ...documentProperty,
                            ClientNameId: parseInt(item.value)
                        });
                    }
                    return item;
                });
                setClientOptions(listItemsData);
            }
        })()
    }, []);

    return {
        setFilesToState,
        isUploadingFile,
        files,
        percentComplete,
        uploadedFileCount,
        dialogState,
        errorMessages,
        onSaveFiles,
        onCancel,
        handleChange,
        documentProperty,
        handleReactSelectChange,
        category,
        subcategory,
        categoryOptions,
        subCategoryOptions,
        selectedClient,
        itemId,
        clientOptions
    }
}
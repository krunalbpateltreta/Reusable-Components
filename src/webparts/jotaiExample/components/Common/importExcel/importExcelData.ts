import { useAtom } from "jotai";
import { appGlobalStateAtom } from "../../../jotai/appGlobalStateAtom";
import { generateExcelFile, isNullOrEmpty, splitIntoBatches } from "../../../Shared/Utils";
import { useState } from "react";
import { useBoolean } from "@uifabric/react-hooks";
import * as XLSX from 'xlsx';
import { ListNames } from "../../../Shared/Enum/ListNames";
import { IFileWithBlob } from "../../../Interfaces/IFileWithBlob";
import { IImportFields } from "./IImportFileFileds";
import { FeildType } from "../../../Shared/Enum/FieldType";

type Props = {
    columnsToRead: IImportFields[];
    listName: ListNames;
    cancelOrSuccessClick: () => void;
}

const importFileMessages = {
    "NoRecordFoundTosave": "No data found to save.",
    "ImportSuccess": "Excel file has been imported successfully!",
    "PartialImportSuccess": "Excel file has been partially imported, some of the records are skipped!\n\nCheck Skipped file.",
    "ImportFailed": "Error in importing file!",
}

export function importExcelData(props: Props) {
    const [files, setFiles] = useState<IFileWithBlob[]>([]);
    const [percentComplete, setPercentComplete] = useState<number>(0);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [dialogHeader, setDialogHeader] = useState<string>("");
    const [dialogMessage, setDialogMessage] = useState<string>("");
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
    const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
    const [appGlobalState] = useAtom(appGlobalStateAtom);
    const { provider } = appGlobalState;
    const { columnsToRead, cancelOrSuccessClick } = props;
    const allPromiseProgress = (itemCreationPromises: any[], successResult: any): Promise<any> => {
        let progress = 0;
        successResult(0);
        for (const awaitedItemCreation of itemCreationPromises) {
            awaitedItemCreation.then((file: any) => {
                progress++;
                const progPercentage = ((progress * 100) / itemCreationPromises?.length).toFixed(2);
                successResult(progPercentage, file);
            }).catch((e: any) => {
                progress++;
                const progPercentage = ((progress * 100) / itemCreationPromises?.length).toFixed(2);
                successResult(progPercentage, false);
            });
        }
        return Promise.all(itemCreationPromises);
    };

    const saveDataInBatches = async (readExcelData: any[]): Promise<boolean> => {
        const createItems: any[] = [];
        const batches: number[][] = splitIntoBatches(readExcelData, 100);
        batches.map(async (batch: any, i: number) => {
            // createItems.push(provider.createItemInBatch(batch, listName));
            createItems.push(provider.createItemInBatch(batch, ListNames.ExcelClientList));
        });

        const resultData: any[] = [];
        await allPromiseProgress(createItems, (progPercentage: number, response: any) => {
            if (response) {
                resultData.push(response);
                console.log("Batch success");
            }
            else {
                resultData.push(null);
            }
            setPercentComplete(((progPercentage / 100) + percentComplete) % 1);
        });

        const finalResult = resultData.map((resultItem: any) => {
            return resultItem !== null;
        });
        return finalResult.length === resultData.length
    }

    const processExcelData = (excelData: any) => {
        if (!!excelData && excelData.length > 0) {
            const data: any = JSON.stringify(excelData, null, 2);
            const jsonData: any = JSON.parse(data);
            const saveData: any[] = [];
            const inValidData: any[] = [];
            jsonData?.forEach((item: any) => {
                const saveItemObj: any = {};
                let isValid = true;
                const errorColumnName: any[] = []
                columnsToRead.forEach((column: IImportFields) => {
                    const fieldValue = item[column.fieldName];

                    // Check if required field is missing or empty
                    if (column.required && isNullOrEmpty(fieldValue)) {
                        isValid = false;
                        errorColumnName.push(column.fieldName);
                    }
                    switch (column.type) {
                        case FeildType.User:
                        case FeildType.Number:
                        case FeildType.LookupField:
                            if (column.isMulti) {
                                saveItemObj[column.fieldName] = !!fieldValue ? fieldValue.split(";").filter((value: any) => value !== "").map(Number) : fieldValue;
                            } else {
                                saveItemObj[column.fieldName] = !!fieldValue ? Number(fieldValue) : fieldValue;
                            }
                            break;
                        case FeildType.Choices:
                            if (column.isMulti) {
                                saveItemObj[column.fieldName] = !!fieldValue ? fieldValue.split(";").filter((value: any) => value !== "").map((t: any) => t.trim()) : fieldValue;
                            } else {
                                saveItemObj[column.fieldName] = !!fieldValue ? fieldValue.trim() : fieldValue;
                            }
                            break;
                        case FeildType.Boolean:
                            saveItemObj[column.fieldName] = fieldValue ? (fieldValue.toLocaleLowerCase() === "true" || Number(fieldValue) === 1) : false;
                            break;
                        case FeildType.Date:
                            saveItemObj[column.fieldName] = fieldValue ? new Date(fieldValue).toISOString().split('T')[0] : fieldValue;
                            break;
                        default:
                            // Default case for other field types
                            saveItemObj[column.fieldName] = fieldValue;
                    }
                });

                if (isValid)
                    saveData.push(saveItemObj);
                else {
                    item.ImportRemark = `some thing wrong in this column: ${errorColumnName.join(", ")}`;
                    inValidData.push(item);
                    // saveItemObj.ImportRemark = `Hello some thing wrong in this column:  ${errorColumnName.join(", ")}`;
                    // inValidData.push(saveItemObj);
                }
            });

            setIsLoading(true);
            void (async () => {
                const success = await saveDataInBatches(saveData)
                if (success) {
                    setIsLoading(false);
                    if (inValidData.length > 0) {
                        setDialogHeader("Warning");
                        setDialogMessage(importFileMessages.PartialImportSuccess);
                        const success = generateExcelFile(inValidData, "Skipped Records.xlsx");
                        console.log(success);
                    } else {
                        setDialogHeader("Success");
                        setDialogMessage(importFileMessages.ImportSuccess);
                        setIsSuccess(true);
                    }
                    hideModal();
                    toggleHideDialog();
                }
                else {
                    setIsLoading(false);
                    setDialogHeader("Warning");
                    setDialogMessage(importFileMessages.ImportFailed)
                    setIsSuccess(false);
                    toggleHideDialog();
                }
            })()
        }
        else {
            setDialogHeader("Warning");
            setDialogMessage(importFileMessages.NoRecordFoundTosave)
            setIsSuccess(false);
        }
    }

    const readExcelFileAndValidateColumn = (filedata: any) => {
        setErrorMessages([]);
        const errorobj: string[] = [];
        const file: any = filedata[0]?.file;
        const reader = new FileReader();
        reader.onload = async (e: any) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const columnHeader: any[] = XLSX.utils.sheet_to_json<any>(workbook.Sheets[workbook.SheetNames[0]], {
                header: 1, defval: "", raw: false
            })[0];
            let isColumnsValid = true;
            columnsToRead.forEach(element => {
                isColumnsValid = columnHeader.indexOf(element.fieldName) >= 0;
                if (!isColumnsValid) {
                    errorobj.push(element.fieldName);
                    return null;
                }
            })

            if (errorobj.length > 0) {
                setErrorMessages(errorobj);
                setDialogHeader("Warning");
                setDialogMessage("Following columns are missing from the excel, please select the correct excel file.")
                setIsSuccess(false);
                toggleHideDialog();
            }
            else {
                const excelData: any = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
                processExcelData(excelData);
            }
        }
        reader.readAsArrayBuffer(file);
    }

    const onClickCloseModel = () => {
        hideModal();
    };

    const onSuccessClick = () => {
        toggleHideDialog();
        cancelOrSuccessClick();
    };

    const onFileSelected = (_selectedFiles: any) => {
        const selectedFiles: IFileWithBlob[] = [];
        if (_selectedFiles.length > 0) {
            for (let i = 0; i < _selectedFiles.length; i++) {
                const file = _selectedFiles[i];
                const selectedFile: IFileWithBlob = {
                    file: file,
                    name: file.name,
                    folderServerRelativeURL: "",
                    overwrite: true,
                    key: i
                };
                selectedFiles.push(selectedFile);
            }
            setFiles(selectedFiles);
        }

    };

    const onSaveFiles = () => {
        if (files && files.length > 0)
            readExcelFileAndValidateColumn(files);
    }

    return {
        files,
        isLoading,
        isModalOpen,
        errorMessages,
        dialogHeader,
        dialogMessage,
        hideDialog,
        isSuccess,
        percentComplete,
        showModal,
        hideModal,
        toggleHideDialog,
        onSuccessClick,
        onClickCloseModel,
        onSaveFiles,
        onFileSelected
    }
} 
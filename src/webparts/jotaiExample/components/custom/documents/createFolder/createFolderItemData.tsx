import * as React from "react";
import { appGlobalStateAtom } from "../../../../jotai/appGlobalStateAtom";
import { useAtomValue } from "jotai";
import { ValidateForm, ValidationType } from "../../../../Shared/Validation";
import CamlBuilder from "camljs";
import { ListNames } from "../../../../Shared/Enum/ListNames";
import { ClientFields } from "../../clients/ClientFields";
import { useBoolean } from "@uifabric/react-hooks";
import { IDialogMessageState } from "../../../../models/IDialogState";
import { Messages } from "../../../../Shared/constants/Messages";

export function createFolderData() {
    const appGlobalState = useAtomValue(appGlobalStateAtom);
    const { provider, context, folderPath, itemId } = appGlobalState;
    const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
    const [folderName, setFolderName] = React.useState<string>("");
    const [selectedClient, setSelectedClient] = React.useState<{ value: string | number, label: string, folderName: string }>({ value: '', label: '-- Select Client Name --', folderName: "" });
    const [clientOptions, setClientOptions] = React.useState<any>([]);
    const [dialogState, setDialogState] = React.useState<IDialogMessageState>({
        dialogHeader: "",
        dialogMessage: "",
        isSuccess: false
    })
    const [hideSuccessDialog, { toggle: toggleHideSuccessDialog }] = useBoolean(true);
    const [errorMessages, setErrorMessages] = React.useState<string[]>([]);

    const handleChange = React.useCallback((event: any) => {
        const { value } = event.target;
        setFolderName(value);
    }, [folderName]);

    const handleReactSelectChange = React.useCallback((selectedOption: { value: string | number, label: string, folderName: string }, name: string) => {
        setSelectedClient({ value: selectedOption.value, label: selectedOption.label, folderName: selectedOption.folderName });
    }, []);

    const createNewFolder = async () => {
        let newFolderName = "";
        if (!!folderPath && folderPath !== "")
            newFolderName = `${folderPath}/${folderName}`;
        else
            newFolderName = `${context.pageContext.web.serverRelativeUrl}/${ListNames.DMSDocumentsPath}/${selectedClient.folderName}/${folderName}`
        await provider.createFolder(newFolderName, {
            ClientNameId: Number(selectedClient.value)
        }).then(async (res: any) => {
            hideModal();
            setDialogState({
                dialogHeader: "Success",
                dialogMessage: Messages.FolderCreated,
                isSuccess: true
            });
            toggleHideSuccessDialog();
        });

    }

    const submitFolder = () => {
        const FolderObj = {
            FolderName: folderName.trim(),
            ClientNameId: selectedClient?.value

        }
        const validationFieldsObj = [
            {
                type: [ValidationType.Required],
                fieldName: "FolderName",
                displayText: "Folder Name"
            },
            {
                type: [ValidationType.Required],
                fieldName: "ClientNameId",
                displayText: "Client Name"
            },
        ];
        const validationResult = ValidateForm(FolderObj, validationFieldsObj);
        if (validationResult.isValid) {
            void (async () => {
                await createNewFolder();
            })()
        }
        else {
            const validationMsg: string[] = [];
            for (const vMsg in validationResult.fields) {
                if (validationResult.fields[vMsg] !== "") {
                    if (Object.prototype.hasOwnProperty.call(validationResult.fields, vMsg) && vMsg.indexOf("errorMessage") >= 0) {
                        validationMsg.push(validationResult.fields[vMsg]);
                    }
                }
            }
            setErrorMessages(validationMsg);
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

        const listItems = await provider.getItemsByCAMLQuery(ListNames.Clients, camlQuery.ToString());
        if (!!listItems) {
            const listItemsData: any[] = listItems.map((itemObj: any, index: number) => {
                const item = {
                    value: itemObj.ID,
                    label: itemObj.ClientName,
                    folderName: itemObj.FolderName
                };
                if (itemObj.ID === itemId) {
                    setSelectedClient(item);
                }
                return item;
            });
            setClientOptions(listItemsData);
        }
    };

    React.useEffect(() => {
        void (async function (): Promise<void> {
            await loadClientData();
        })();
    }, []);

    React.useEffect(() => {
        if (isModalOpen) {
            const selectedItem = clientOptions.filter((item: any) => parseInt(item.value) === itemId)[0];
            if (selectedItem)
                setSelectedClient(selectedItem);
            else
                setSelectedClient({ value: '', label: '-- Select Client Name --', folderName: "" });
            setFolderName("");
        }
    }, [isModalOpen])

    return {
        handleChange,
        handleReactSelectChange,
        clientOptions,
        folderName,
        submitFolder,
        selectedClient,
        isModalOpen,
        showModal,
        hideModal,
        errorMessages,
        hideSuccessDialog,
        toggleHideSuccessDialog,
        dialogState
    }
}
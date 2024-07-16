/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import { ValidationType, ValidateForm } from "../../../../Shared/Validation";
import { ListNames } from "../../../../Shared/Enum/ListNames";
import { Messages } from "../../../../Shared/constants/Messages";
import { IItemAddResult, IItemUpdateResult } from "@pnp/sp/items";
import { ClientViewFields, ClientFields } from "../ClientFields";
import IPnPQueryOptions from "../../../../Service/models/IPnPQueryOptions";
import { getLookUpOrPeoplePickerValue, getNumberValue, getStringValue } from "../../../../Shared/Utils";
import { IDialogMessageState } from "../../../../models/IDialogState";
import { useBoolean } from "@uifabric/react-hooks";
import { ComponentName } from "../../../../Shared/Enum/ComponentName";
import { appGlobalStateAtom } from "../../../../jotai/appGlobalStateAtom";
import { useAtomValue } from "jotai";
import { IClients } from "../IClients";
import moment from "moment";


export function addClientsData() {
    const appGlobalState = useAtomValue(appGlobalStateAtom);
    const { provider, context, prevComponentName, loadComponent, itemId } = appGlobalState;
    const defaultValue: IClients = {
        FirstName: "",
        MiddleName: "",
        LastName: "",
        PhoneNumber: "",
        EmailAddress: "",
        ClientStatus: "",
        ClientAddress: "",
        ClientCode: `C-${moment().format("YYDDMMHHmmss")}`,
        Industry: "",
        Website: "",
        UserId: -1,
        UserEmail: ""
    }
    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
    const [clientObj, setClientObj] = React.useState<IClients>(defaultValue);
    const [status, setStatus] = React.useState<{ value: string, label: string }>({ value: '', label: '-- Select Status --' });
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [selectedItems, setSelectedItems] = React.useState<any[]>([]);
    const [dialogState, setDialogState] = React.useState<IDialogMessageState>({
        dialogHeader: "",
        dialogMessage: "",
        isSuccess: false
    })
    const [errorMessages, setErrorMessages] = React.useState<string[]>([]);

    const _getPeoplePickerItems = React.useCallback((items: any[]): void => {
        if (items?.length > 0) {
            setClientObj({
                ...clientObj,
                "UserId": items[0].id
            });
            setSelectedItems([...selectedItems, { Id: items[0].id, emailAddress: items[0].loginName }]);
        }
    }, [clientObj]);

    const handleChange = React.useCallback((event: any) => {
        const { name, value } = event.target;
        setClientObj({
            ...clientObj,
            [name]: value
        });
    }, [clientObj]);

    const handleReactSelectChange = React.useCallback((selectedOption: { value: string, label: string }, name: string) => {
        setClientObj({
            ...clientObj,
            [name]: selectedOption.value
        });

        switch (name) {
            case "ClientStatus":
                setStatus(selectedOption);
                break;
            default:
                break;
        }
    }, [clientObj]);

    const createItem = () => {
        const saveObj = { ...clientObj };
        delete saveObj.UserEmail;
        provider.createItem(saveObj, ListNames.Clients).then((respose: IItemAddResult) => {
            setDialogState({
                dialogHeader: "Success",
                dialogMessage: Messages.ClientSaveSuccess,
                isSuccess: true
            });
            toggleHideDialog();
            setIsLoading(false);
        }).catch((err) => {
            setDialogState({
                dialogHeader: "Warning",
                dialogMessage: Messages.ClientSaveFailed,
                isSuccess: true
            });
            toggleHideDialog();
            setIsLoading(false);
        });
    }

    const updateItem = () => {
        if (itemId && itemId > 0) {
            const saveObj = { ...clientObj };
            delete saveObj.UserEmail;
            provider.updateItem(saveObj, ListNames.Clients, itemId).then((respose: IItemUpdateResult) => {
                setDialogState({
                    dialogHeader: "Success",
                    dialogMessage: Messages.ClientUpdateSuccess,
                    isSuccess: true
                });
                toggleHideDialog();
                setIsLoading(false);
            }).catch((err) => {
                setDialogState({
                    dialogHeader: "Warning",
                    dialogMessage: Messages.ClientUpdateFailed,
                    isSuccess: true
                });
                toggleHideDialog();
                setIsLoading(false);
            });
        }
    }

    const submitDataToList = (): void => {
        setErrorMessages([]);
        setIsLoading(true);
        const validationFieldsObj = [
            {
                type: [ValidationType.Required],
                fieldName: ClientFields.FirstName,
                displayText: ClientViewFields.FirstName
            },
            {
                type: [ValidationType.Required],
                fieldName: ClientFields.MiddleName,
                displayText: ClientViewFields.MiddleName
            },
            {
                type: [ValidationType.Required],
                fieldName: ClientFields.LastName,
                displayText: ClientViewFields.LastName
            },
            {
                type: [ValidationType.Required, ValidationType.Email],
                fieldName: ClientFields.EmailAddress,
                displayText: ClientViewFields.EmailAddress
            },
            {
                type: [ValidationType.Required, ValidationType.PhoneNumber],
                fieldName: ClientFields.PhoneNumber,
                displayText: ClientViewFields.PhoneNumber
            },
            {
                type: [ValidationType.Required],
                fieldName: ClientFields.ClientStatus,
                displayText: ClientViewFields.ClientStatus
            },
            {
                type: [ValidationType.Required],
                fieldName: ClientFields.UserId,
                displayText: ClientViewFields.User
            }
        ]

        const validationResult = ValidateForm(clientObj, validationFieldsObj);
        if (validationResult.isValid) {
            //ID present so updating Item
            if (itemId && itemId > 0) {
                updateItem();
            }
            else {
                createItem();
            }
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
            setDialogState({
                dialogHeader: "Warning",
                dialogMessage: Messages.ClientValidationFailed,
                isSuccess: false
            })
            toggleHideDialog();
            setIsLoading(false);
        }
    }

    const cancelSuccessForm = (): void => {
        loadComponent(prevComponentName || ComponentName.ViewClient)
    }

    const getItemById = (): void => {
        try {
            if (itemId && itemId > 0) {
                const queryStringOptions: IPnPQueryOptions = {
                    select: [
                        ClientFields.Id,
                        ClientFields.Title,
                        ClientFields.FirstName,
                        ClientFields.LastName,
                        ClientFields.MiddleName,
                        ClientFields.EmailAddress,
                        ClientFields.ClientAddress,
                        ClientFields.PhoneNumber,
                        ClientFields.ClientStatus,
                        ClientFields.UserEmail,
                        ClientFields.UserId,
                        ClientFields.Industry,
                        ClientFields.Website,
                        ClientFields.UserEmail,
                        ClientFields.ClientCode,
                    ],
                    expand: [ClientFields.User],
                    listName: ListNames.Clients,
                };

                provider.getByItemByID(queryStringOptions, itemId).then((ClientItem) => {
                    const _defaultValue: IClients = {
                        FirstName: getStringValue(ClientItem?.FirstName),
                        MiddleName: getStringValue(ClientItem?.MiddleName),
                        LastName: getStringValue(ClientItem?.LastName),
                        EmailAddress: getStringValue(ClientItem?.EmailAddress),
                        PhoneNumber: getStringValue(ClientItem?.PhoneNumber),
                        ClientStatus: getStringValue(ClientItem?.ClientStatus),
                        UserId: getNumberValue(ClientItem?.UserId),
                        UserEmail: getLookUpOrPeoplePickerValue(ClientItem?.User, "EMail"),
                        ClientCode: getStringValue(ClientItem?.ClientCode),
                        ClientAddress: getStringValue(ClientItem?.ClientAddress),
                        Industry: getStringValue(ClientItem?.Industry),
                        Website: getStringValue(ClientItem?.Website),
                    }
                    setClientObj(_defaultValue);
                    setStatus({ value: _defaultValue?.ClientStatus, label: _defaultValue?.ClientStatus });
                    setIsLoading(false);
                }).catch((e) => {
                    console.log(e);
                });
            }

        }
        catch (ex) {
            console.error(ex);
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        setIsLoading(true);
        getItemById();
        setIsLoading(false);
    }, [itemId]);

    return {
        context,
        status,
        isLoading,
        clientObj,
        dialogState,
        errorMessages,
        hideDialog,
        toggleHideDialog,
        submitDataToList,
        handleChange,
        handleReactSelectChange,
        _getPeoplePickerItems,
        cancelSuccessForm
    }
}
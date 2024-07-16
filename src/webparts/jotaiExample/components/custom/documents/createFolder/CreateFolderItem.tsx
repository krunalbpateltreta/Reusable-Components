import { DefaultButton, Label, PrimaryButton, TextField } from '@fluentui/react'
import * as React from 'react'
import { ModalDialog } from '../../../Common/dialogs/ModalDialog'
import { ClientFields, ClientViewFields } from '../../clients/ClientFields'
import ReactDropdown from '../../../Common/reactSelect/ReactSelectDropdown'
import { createFolderData } from './createFolderItemData'
import { DialogComponent } from '../../../Common/dialogs/DialogComponent'
import { appGlobalStateAtom } from '../../../../jotai/appGlobalStateAtom'
import { useAtomValue } from 'jotai'

type Props = {
    loadDataOnSuccess: any;
};

const CreateFolder = (props: Props) => {
    const { loadDataOnSuccess } = props;
    const appGlobalState = useAtomValue(appGlobalStateAtom);
    const { itemId } = appGlobalState;
    const {
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
    } = createFolderData();

    const RenderDialog = React.useCallback(() => {
        const { dialogHeader, dialogMessage, isSuccess } = dialogState;
        return <DialogComponent
            dialogHeader={`${dialogHeader}`}
            message={`${dialogMessage}`}
            hideDialog={hideSuccessDialog}
            toggleHideDialog={toggleHideSuccessDialog}
            isSuccess={isSuccess}
            cancelOrSuccessClick={loadDataOnSuccess}
        />
    }, [hideSuccessDialog]);

    return (
        <React.Fragment>
            <PrimaryButton
                text={"Create Folder"}
                className='btn-primary create-folder-btn'
                onClick={showModal}
            />
            <RenderDialog />
            <ModalDialog header="Create Folder" isModalOpen={isModalOpen} hideModal={hideModal} dialogWidth={"450px"}>
                <div className="ms-Grid">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12">
                            <TextField
                                label={"Folder Name"}
                                name={"fonderName"}
                                value={folderName}
                                required={true}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="ms-Grid-col ms-sm12">
                            <Label>{ClientViewFields.ClientName} <span className="required">*</span></Label>
                            <ReactDropdown
                                name={ClientFields.ClientStatus}
                                isMultiSelect={false}
                                defaultOption={selectedClient}
                                onChange={handleReactSelectChange}
                                options={clientOptions}
                                isDisabled={!!itemId && itemId > 0}
                            />
                        </div>
                        <div className="ms-Grid-col ms-sm12 mt-2">
                            <PrimaryButton className="btn btn-primary" onClick={submitFolder} text={"Create"} />
                            <DefaultButton className="btn btn-danger ml-1" onClick={hideModal}
                                text="Cancel" />
                        </div>
                        <div className="ms-Grid-col ms-sm12 mt-2">
                            {(errorMessages && errorMessages.length > 0) && (
                                <ul>
                                    {errorMessages?.map((error, ind) => <li key={ind}>{error}</li>)}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </ModalDialog>
        </React.Fragment>
    )
}

export default CreateFolder
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import { DefaultButton, Label, PrimaryButton, ProgressIndicator, TextField } from '@fluentui/react';
import { useBoolean } from '@uifabric/react-hooks';
import { IUploadDocumentsDataProps, uploadDocumentsData } from './UploadDocumentsData';
import { useAtom } from 'jotai';
import DragandDropFilePicker from '../../../Common/dragandDrop/DragandDropFilePicker';
import { DialogComponent } from '../../../Common/dialogs/DialogComponent';
import { appGlobalStateAtom } from '../../../../jotai/appGlobalStateAtom';
import { DMSDocumentsFields, DMSDocumentsViewFields } from '../DocumentFields';
import ReactDropdown from '../../../Common/reactSelect/ReactSelectDropdown';

interface IDragAndDropProps {
    successComponentName?: string;
    isPopup?: boolean;
}

const UploadDocuments: React.FC<IDragAndDropProps> = React.memo((props: IDragAndDropProps) => {
    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
    const { successComponentName, isPopup } = props;
    const [appGlobalState] = useAtom(appGlobalStateAtom);
    const { loadComponent, itemId } = appGlobalState;

    const onCancelOrSuccessClick = (): void => {
        if (loadComponent)
            loadComponent(successComponentName || "");
    }

    const dataProps: IUploadDocumentsDataProps = {
        isMultiple: true,
        toggleHideDialog,
        onCancelOrSuccessClick,
    }

    const {
        setFilesToState,
        isUploadingFile,
        files,
        percentComplete,
        uploadedFileCount,
        dialogState,
        errorMessages,
        onSaveFiles,
        handleChange,
        documentProperty,
        handleReactSelectChange,
        category,
        subcategory,
        categoryOptions,
        subCategoryOptions,
        selectedClient,
        clientOptions
    } = uploadDocumentsData(dataProps);

    return (
        <React.Fragment>
            <div className={`${isPopup ? "" : "boxCard"}`}>
                <div className={`${isPopup ? "" : "formGroup"}`}>
                    {!isPopup && <h1 className="mainTitle" style={{ textAlign: "left" }}>Add New File</h1>}
                    <DragandDropFilePicker isMultiple={true} setFilesToState={setFilesToState} />

                    <div className="ms-Grid mt-3">
                        <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg3 ms-md4 ms-sm6 mb16">
                                <Label>{DMSDocumentsViewFields.ClientName} <span className="required">*</span></Label>
                                <ReactDropdown
                                    name={DMSDocumentsFields.ClientNameId}
                                    isMultiSelect={false}
                                    defaultOption={selectedClient}
                                    onChange={handleReactSelectChange}
                                    options={clientOptions}
                                    isDisabled={!!itemId && itemId > 0}
                                />
                            </div>
                            <div className="ms-Grid-col ms-lg3 ms-md4 ms-sm6 mb16">
                                <TextField
                                    label={DMSDocumentsViewFields.DocumentTitle}
                                    name={DMSDocumentsFields.DocumentTitle}
                                    value={documentProperty?.DocumentTitle}
                                    required={true}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="ms-Grid-col ms-lg3 ms-md4 ms-sm6 mb16">
                                <Label>{DMSDocumentsViewFields.DocumentCategory} <span className="required">*</span></Label>
                                <ReactDropdown
                                    name={DMSDocumentsFields.DocumentCategory}
                                    isMultiSelect={false}
                                    defaultOption={category}
                                    onChange={handleReactSelectChange}
                                    options={categoryOptions}
                                />
                            </div>
                            <div className="ms-Grid-col ms-lg3 ms-md4 ms-sm6 mb16">
                                <Label>{DMSDocumentsViewFields.DocumentSubcategory} <span className="required">*</span></Label>
                                <ReactDropdown
                                    name={DMSDocumentsFields.DocumentSubcategory}
                                    isMultiSelect={false}
                                    defaultOption={subcategory}
                                    onChange={handleReactSelectChange}
                                    options={subCategoryOptions}
                                />
                            </div>
                        </div>
                    </div>

                    {isUploadingFile && <div className="progress-fileUpload">
                        <div className="ms-Grid">
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg12 mb16">
                                    <div className="progress-Content">
                                        <ProgressIndicator label="Uploading Files..."
                                            description={`Successfully uploaded ${uploadedFileCount} file(s) out of ${files?.length}`}
                                            ariaValueText="Uploading Files..."
                                            barHeight={10}
                                            percentComplete={percentComplete}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    }

                    <div className="ms-Grid">
                        <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg12 mb16">
                                <div className="ms-Grid-col ms-lg12 mb16 textRight">
                                    <PrimaryButton disabled={(!!files && files.length > 0) ? false : true} className={(!!files && files.length > 0) ? 'btn btn-primary marleft' : ''}
                                        onClick={onSaveFiles}>
                                        Save
                                    </PrimaryButton>
                                    <DefaultButton className='btn btn-danger marleft' onClick={onCancelOrSuccessClick}>Cancel</DefaultButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogComponent
                        dialogHeader={dialogState?.dialogHeader}
                        message={dialogState?.dialogMessage}
                        hideDialog={hideDialog}
                        toggleHideDialog={toggleHideDialog}
                        isSuccess={dialogState?.isSuccess}
                        cancelOrSuccessClick={onCancelOrSuccessClick}
                    >
                        {(errorMessages && errorMessages.length > 0) && (
                            <ul>
                                {errorMessages?.map((error, ind) => <li key={ind}>{error}</li>)}
                            </ul>
                        )}
                    </DialogComponent>
                </div >
            </div >
        </React.Fragment >
    );
});

export default UploadDocuments;



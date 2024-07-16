import * as React from 'react';
import { Label, PrimaryButton, TextField } from '@fluentui/react';
import { addClientsData } from './addClientsData';
import { CustomPeoplePicker } from '../../../Common/PeoplePicker';
import { DialogComponent } from '../../../Common/dialogs/DialogComponent';
import { Loader } from '../../../Common/loader/Loader';
import ReactDropdown from '../../../Common/reactSelect/ReactSelectDropdown';
import { ClientViewFields, ClientFields } from '../ClientFields';
type Props = {}
const options = [
    { value: '', label: 'Select Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
];
export const AddClients = (props: Props) => {
    const {
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
    } = addClientsData();

    console.log(clientObj);
    return (
        <React.Fragment>
            <div className="boxCard ms-SPLegacyFabricBlock">
                <div className="formGroup">
                    {isLoading && <Loader />}
                    <h1 className="mainTitle" style={{ textAlign: "left" }}>Add New Client</h1>
                    <div className="ms-Grid">
                        <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg3">
                                <TextField
                                    label={ClientViewFields.FirstName}
                                    name={ClientFields.FirstName}
                                    value={clientObj?.FirstName}
                                    required={true}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg3">
                                <TextField
                                    label={ClientViewFields.MiddleName}
                                    name={ClientFields.MiddleName}
                                    value={clientObj?.MiddleName}
                                    required={true}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg3">
                                <TextField
                                    label={ClientViewFields.LastName}
                                    name={ClientFields.LastName}
                                    value={clientObj?.LastName}
                                    required={true}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg3">
                                <TextField
                                    label={ClientViewFields.EmailAddress}
                                    name={ClientFields.EmailAddress}
                                    value={clientObj?.EmailAddress}
                                    required={true}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg3">
                                <TextField
                                    label={ClientViewFields.PhoneNumber}
                                    name={ClientFields.PhoneNumber}
                                    value={clientObj?.PhoneNumber}
                                    required={true}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg3">
                                <Label>{ClientViewFields.ClientStatus} <span className="required">*</span></Label>
                                <ReactDropdown
                                    name={ClientFields.ClientStatus}
                                    isMultiSelect={false}
                                    defaultOption={status}
                                    onChange={handleReactSelectChange}
                                    options={options}
                                />
                            </div>
                            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg3">
                                <TextField
                                    label={ClientViewFields.Industry}
                                    name={ClientFields.Industry}
                                    value={clientObj?.Industry}
                                    required={true}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg3">
                                <TextField
                                    label={ClientViewFields.Website}
                                    name={ClientFields.Website}
                                    value={clientObj?.Website}
                                    required={true}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg3">
                                <CustomPeoplePicker
                                    context={context}
                                    _getPeoplePickerItems={_getPeoplePickerItems}
                                    selectedItems={[clientObj?.UserEmail]}
                                    label={ClientViewFields.User}
                                />
                            </div>
                            <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
                                <TextField
                                    multiline={true}
                                    label={ClientViewFields.ClientAddress}
                                    name={ClientFields.ClientAddress}
                                    value={clientObj?.ClientAddress}
                                    required={true}
                                    onChange={handleChange}
                                />
                            </div>

                        </div>
                        <div className="ms-Grid-row mt-2">
                            <div className="ms-Grid-col ms-sm12">
                                <PrimaryButton text='Submit' onClick={submitDataToList} className='btn-primary' />
                                <PrimaryButton text='Cancel' onClick={cancelSuccessForm} className='btn-danger ml-1' />
                            </div>
                        </div>
                    </div>

                    <DialogComponent
                        dialogHeader={dialogState.dialogHeader}
                        message={dialogState.dialogMessage}
                        hideDialog={hideDialog}
                        toggleHideDialog={toggleHideDialog}
                        isSuccess={dialogState.isSuccess}
                        cancelOrSuccessClick={cancelSuccessForm}
                    >
                        {(errorMessages && errorMessages.length > 0) && (
                            <ul>
                                {errorMessages?.map((error, ind) => <li key={ind}>{error}</li>)}
                            </ul>
                        )}
                    </DialogComponent>
                </div>
            </div>
        </React.Fragment>
    )
}


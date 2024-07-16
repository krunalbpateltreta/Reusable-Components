/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import styles from '../../../Common/DetailList/css/DataGrid.module.scss';
import { Loader } from '../../../Common/loader/Loader';
import { DialogConfirmationComponent } from '../../../Common/dialogs/DialogConfirmationComponent';
import { useBoolean } from '@uifabric/react-hooks';
import { DialogComponent } from '../../../Common/dialogs/DialogComponent';
import { ComponentName } from '../../../../Shared/Enum/ComponentName';
import { ListNames } from '../../../../Shared/Enum/ListNames';
import { IViewClientsDataProps, viewClientsListData } from './clientsListData';
import { ShowMessage } from '../../../Common/showMessage/ShowMessage';
import { EMessageType } from '../../../../Shared/constants/MessageType';
import { ShimmerDetailsListComponent } from '../../../Common/DetailList/ShimmerDetailsList';
import { appGlobalStateAtom } from '../../../../jotai/appGlobalStateAtom';
import { useAtomValue } from 'jotai';

const ClientsList: React.FC = (): React.ReactElement => {

    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
    const [hideSuccessDialog, { toggle: toggleHideSuccessDialog }] = useBoolean(true);
    const appGlobalState = useAtomValue(appGlobalStateAtom);
    const { loadComponent } = appGlobalState;

    const dataProps: IViewClientsDataProps = {
        toggleHideDialog: toggleHideDialog,
        toggleHideSuccessDialog: toggleHideSuccessDialog,
    }

    const {
        isLoading,
        allItems,
        importFileColumnNames,
        dialogState,
        nextData,
        filterFields,
        setIsLoading,
        hasError,
        error,
        _generateColumns,
        loadBatchOfItems,
        loadData,
        mappingData,
        reloadData,
        deleteItem,
        onSelectionChange
    } = viewClientsListData(dataProps);

    React.useEffect(() => {
        void (async function (): Promise<void> {
            setIsLoading(true);
            await loadBatchOfItems();
        })();
    }, []);

    const RenderBodyContent = React.useCallback(() => {
        if (hasError) {
            return <div className="boxCard">
                <div className="formGroup" >
                    <ShowMessage isShow={hasError} messageType={EMessageType.ERROR} message={error.message} />
                </div>
            </div>
        }
        if (isLoading) {
            return <Loader />
        }
        return <>
            <div className="boxCard">
                <div className="formGroup" >
                    <h1 className="mainTitle" style={{ textAlign: "left" }}>View Clients</h1>
                    <div className={styles.dataGrid}>
                        <ShimmerDetailsListComponent
                            dataProps={{
                                items: allItems || [],
                                nextData: nextData,
                                isLoading: isLoading,
                                columns: _generateColumns(),
                                loadData: loadData,
                                mappingData: mappingData,
                                filterFields: filterFields
                            }}
                            reRenderComponent={true}
                            isExportToExcel={true}
                            addNewItem={{
                                isAddNewItem: true,
                                addNewItemClick: loadComponent,
                                addNewItemComponentName: ComponentName.AddClient,
                                currentComponentName: ComponentName.ViewClient,
                                buttonName: "Add Employee"
                            }}
                            importExcel={{
                                importFileColumnNames: importFileColumnNames,
                                isImportExcel: true,
                                reloadData: reloadData,
                                listName: ListNames.Clients
                            }}
                            otherProps={{
                                isDisplayScrollablePane: true
                            }}
                            onSelectionChange={onSelectionChange}
                        />
                    </div>
                </div>
            </div>
        </>
    }, [hasError, error, isLoading]);

    const RenderDialog = React.useCallback(() => {
        return <DialogComponent
            hideDialog={hideSuccessDialog}
            dialogHeader={dialogState?.dialogHeader}
            message={dialogState?.dialogMessage}
            isSuccess={dialogState?.isSuccess}
            toggleHideDialog={toggleHideSuccessDialog}
            cancelOrSuccessClick={reloadData}
        />
    }, [hideSuccessDialog]);

    const RenderConfirmationDialog = React.useCallback(() => {
        return <DialogConfirmationComponent
            dialogHeader={dialogState?.dialogHeader}
            message={dialogState?.dialogMessage}
            hideDialog={hideDialog}
            toggleHideDialog={toggleHideDialog}
            yesText='Yes'
            noText='No'
            yesClick={deleteItem}
        />
    }, [hideDialog]);

    return (
        <React.Fragment>
            <RenderBodyContent />
            <RenderDialog />
            <RenderConfirmationDialog />

        </React.Fragment>
    );
}


export default ClientsList;

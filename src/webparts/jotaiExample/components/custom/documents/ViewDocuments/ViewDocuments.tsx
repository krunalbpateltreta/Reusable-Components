/* eslint-disable @microsoft/spfx/import-requires-chunk-name */
import React, { useCallback } from 'react'
import { appGlobalStateAtom } from '../../../../jotai/appGlobalStateAtom'
import { useAtom } from 'jotai'
import styles from '../../../Common/DetailList/css/DataGrid.module.scss'
import { ListNames } from '../../../../Shared/Enum/ListNames'
import { ComponentName } from '../../../../Shared/Enum/ComponentName'
import { DialogComponent } from '../../../Common/dialogs/DialogComponent'
import { DialogConfirmationComponent } from '../../../Common/dialogs/DialogConfirmationComponent'
import { Loader } from '../../../Common/loader/Loader'
import { viewDocumentsData } from './viewDocumentsData'
import { ShowMessage } from '../../../Common/showMessage/ShowMessage'
import { EMessageType } from '../../../../Shared/constants/MessageType'
import { ShimmerDetailsListComponent } from '../../../Common/DetailList/ShimmerDetailsList'

const CreateFolder = React.lazy(() => import("../createFolder/CreateFolderItem"));
const LeftNavigation = React.lazy(() => import("../LeftNavigation"));
const CustomBreadcrumb = React.lazy(() => import("../../../Common/breadcrumb/CustomBreadcrumb"));

export const ViewDocuments: React.FC = () => {
    const [appGlobalState] = useAtom(appGlobalStateAtom);
    const { loadComponent, context, folderPath } = appGlobalState;

    const {
        isLoading,
        allItems,
        setSourcePath,
        newBreadcrumbItem,
        generateColumns,
        selectedKey,
        onLinkClick,
        hasError,
        error,
        dialogHeader,
        dialogMessage,
        isSuccess,
        hideDialog,
        hideSuccessDialog,
        toggleHideDialog,
        toggleHideSuccessDialog,
        nextData,
        loadData,
        loadDataAfterDelete,
        deleteSPRecord,
        mappingData,
        reloadData,
        _filterFields
    } = viewDocumentsData();



    const RenderBodyContent = useCallback(() => {
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
        return <React.Fragment />

    }, [hasError, error]);

    const RenderDialog = useCallback(() => {
        return <DialogComponent
            dialogHeader={`${dialogHeader}`}
            message={`${dialogMessage}`}
            hideDialog={hideSuccessDialog}
            toggleHideDialog={toggleHideSuccessDialog}
            isSuccess={isSuccess}
            cancelOrSuccessClick={loadDataAfterDelete}
        />
    }, [hideSuccessDialog]);

    const RenderConfirmationDialog = useCallback(() => {
        return <DialogConfirmationComponent
            dialogHeader={`${dialogHeader}`}
            message={`${dialogMessage}`}
            hideDialog={hideDialog}
            toggleHideDialog={toggleHideDialog}
            yesText='Yes'
            noText='No'
            yesClick={deleteSPRecord}
        />
    }, [hideDialog]);

    return (
        <React.Fragment>
            {/* <RenderBodyContent /> */}
            return <React.Fragment>
                {isLoading && <Loader />}
                <div className="boxCard">
                    <div className="formGroup" >
                        <div className='cust-container'>
                            <RenderBodyContent />
                            <div className="leftNav">
                                <div className="ms-Grid">
                                    <div className="ms-Grid-row">
                                        <div className="ms-Grid-col ms-sm12">
                                            <React.Suspense fallback={<></>}>
                                                <LeftNavigation
                                                    onLinkClick={onLinkClick}
                                                    selectedKey={selectedKey} />
                                            </React.Suspense>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='rightContainer'>
                                <div className="ms-Grid">
                                    <div className="ms-Grid-row">
                                        <div className="ms-Grid-col ms-sm12">
                                            <h1 className="mainTitle" style={{ textAlign: "left" }}>View Documents</h1>
                                            <React.Suspense fallback={<></>}>
                                                <CustomBreadcrumb
                                                    siteServerRelativeURL={`${context.pageContext.web.serverRelativeUrl}`}
                                                    parentBreadCrumbItem={{
                                                        key: `${context.pageContext.web.serverRelativeUrl}/${ListNames.DMSDocumentsPath}`,
                                                        text: `${ListNames.DMSDocuments}`
                                                    }}
                                                    setSourcePath={setSourcePath} // set a new path when click on breadcrumb item.
                                                    newBreadcrumbItem={newBreadcrumbItem || undefined} // add a new item in breadcrumb when folder is clicked
                                                />
                                            </React.Suspense>
                                            <React.Suspense fallback={<></>}>
                                                <CreateFolder loadDataOnSuccess={reloadData} />
                                            </React.Suspense>
                                            <div className={styles.dataGrid}>
                                                <ShimmerDetailsListComponent
                                                    dataProps={{
                                                        items: allItems || [],
                                                        nextData: nextData,
                                                        isLoading: isLoading,
                                                        columns: generateColumns(),
                                                        loadData: loadData,
                                                        mappingData: mappingData,
                                                        filterFields: _filterFields,
                                                        folderPath: folderPath || undefined
                                                    }}
                                                    reRenderComponent={true}
                                                    isExportToExcel={true}
                                                    addNewItem={{
                                                        isAddNewItem: true,
                                                        addNewItemClick: loadComponent,
                                                        addNewItemComponentName: ComponentName.AddDocuments,
                                                        currentComponentName: ComponentName.ViewDocuments,
                                                        buttonName: "Add Document"
                                                    }}
                                                    otherProps={{
                                                        isDisplayScrollablePane: true,
                                                        reduceHeight: 350
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
            <RenderDialog />
            <RenderConfirmationDialog />
        </React.Fragment >
    )
}

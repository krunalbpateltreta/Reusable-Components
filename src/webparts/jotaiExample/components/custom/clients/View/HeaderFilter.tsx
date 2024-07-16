/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import styles from '../../../Common/DetailList/css/DataGrid.module.scss';
import { Loader } from '../../../Common/loader/Loader';
import { DialogConfirmationComponent } from '../../../Common/dialogs/DialogConfirmationComponent';
import { useBoolean } from '@uifabric/react-hooks';
import { DialogComponent } from '../../../Common/dialogs/DialogComponent';
import { IViewClientsDataProps, } from './clientsListData';
import { ShowMessage } from '../../../Common/showMessage/ShowMessage';
import { EMessageType } from '../../../../Shared/constants/MessageType';
import { MemoizedDataGridComponent } from '../../../Common/DetailList/DataGridComponent';
import { HeaderFilterData } from './HeaderFilterData';

const HeaderFilter: React.FC = (): React.ReactElement => {
    const [keyUpdate, setKeyUpdate] = React.useState<number>(Math.random());
    const data = React.useRef<any[]>([]);
    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);

    // const printType = React.useRef<any>("");
    const [hideSuccessDialog, { toggle: toggleHideSuccessDialog }] = useBoolean(true);
    const dataProps: IViewClientsDataProps = {
        toggleHideDialog: toggleHideDialog,
        toggleHideSuccessDialog: toggleHideSuccessDialog,
    }
    const {
        isLoading,
        allItems,
        dialogState,
        setIsLoading,
        hasError,
        // onClickPrint,
        error,
        _generateColumns,
        loadBatchOfItems,
        reloadData,
        // printTypeOpitons,
        deleteItem,
    } = HeaderFilterData(dataProps);// HeaderFilterData(dataProps);


    // const onClickPrintType = (selectedOption: any, name: string) => {
    //     printType.current = selectedOption.value;
    // }


    React.useEffect(() => {
        void (async function (): Promise<void> {
            setIsLoading(true);
            await loadBatchOfItems();
        })();
    }, []);
    React.useMemo(() => {
        setKeyUpdate(Math.random());
        data.current = allItems
    }, [allItems]);


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
            <div className="boxCard" id="pdfGenerate">
                <div className="formGroup"  >
                    {/* <div className='dataJustifyBetween'>
                        <div></div>
                        <div>
                            <ReactDropdown options={printTypeOpitons} name={'Select-Type'} isMultiSelect={false} onChange={onClickPrintType} defaultOption={undefined} />
                            <PrimaryButton text='Print' onClick={() => {
                                onClickPrint(printType.current);
                            }} />
                        </div>
                    </div> */}
                    <h1 className="mainTitle" style={{ textAlign: "left" }} >Header Filter</h1>
                    <div className={styles.dataGrid} key={keyUpdate}  >
                        <MemoizedDataGridComponent
                            key={keyUpdate}
                            items={data.current}
                            columns={_generateColumns()}
                            isheaderFilter={true}
                            reRenderComponent={true}
                            showPagination={true}
                            isExportToExcel={true}
                            isDisplayScrollablePane={true}
                            pageSize={50}
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


export default HeaderFilter;
/* eslint-disable*/
import React from "react";
import styles from '../../Common/DetailList/css/DataGrid.module.scss';
import { MemoizedDataGridComponent } from "../DetailList/DataGridComponent";
import { ZodExampleData } from "./ZodExampleData";
import { Loader } from "../loader/Loader";


export const ZodExample = () => {
    const [keyUpdate, setKeyUpdate] = React.useState<number>(Math.random());
    const [keyUpdateDocuments, setKeyUpdateDocuments] = React.useState<number>(Math.random());
    const data = React.useRef<any[]>([]);
    const documentsData = React.useRef<any[]>([]);
    const {
        isLoading,
        allItems,
        documentsItems,
        loadBatchOfItems,
        _generateColumns,
        generateColumnslibrary
    } = ZodExampleData();
    React.useEffect(() => {
        (async () => {
            await loadBatchOfItems();
        })()

    }, []);

    React.useMemo(() => {
        setKeyUpdate(Math.random());
        data.current = allItems;
    }, [allItems]);

    React.useMemo(() => {
        setKeyUpdateDocuments(Math.random());
        documentsData.current = documentsItems;
    }, [documentsItems]);

    return <>
        {isLoading && <Loader />}
        <div className="boxCard" id="pdfGenerate">
            <div className="formGroup"  >
                <h1 className="mainTitle" style={{ textAlign: "left" }} >Zod Example List</h1>
                <div className={styles.dataGrid} key={keyUpdate}  >
                    <MemoizedDataGridComponent
                        key={keyUpdate}
                        columns={_generateColumns() || []}
                        reRenderComponent={true}
                        showPagination={true}
                        isDisplayScrollablePane={true}
                        pageSize={2000}
                        items={data.current || []}
                    />
                </div>
                <h1 className="mainTitle" style={{ textAlign: "left" }} >Zod Example Library</h1>
                <div className={styles.dataGrid} style={{ marginTop: "10px" }} key={keyUpdateDocuments}  >
                    <MemoizedDataGridComponent
                        key={keyUpdateDocuments}
                        columns={generateColumnslibrary() || []}
                        reRenderComponent={true}
                        showPagination={true}
                        isDisplayScrollablePane={true}
                        pageSize={100}
                        items={documentsData.current || []}
                    />
                </div>
            </div>
        </div>
    </>
}
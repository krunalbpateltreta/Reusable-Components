import { useAtomValue } from 'jotai';
import * as React from 'react'
import { appGlobalStateAtom } from '../../../jotai/appGlobalStateAtom';
import { Loader } from '../../Common/loader/Loader';
import { ComponentName } from '../../../Shared/Enum/ComponentName';
import { dashboradData } from './dashboradData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MemoizedDataGridComponent } from '../../Common/DetailList/DataGridComponent';
import { generateExcelTable } from '../../../Shared/Utils';

type Props = {}

const Dashboards = (props: Props) => {
    const appGlobalState = useAtomValue(appGlobalStateAtom);
    const { loadComponent } = appGlobalState;

    const { isLoading,
        _generateColumns,
        clientDataCount,
        metaDataDetailsDataList,
        metaDataCount,
        metaDataActiveCount,
        metaDataArchieveCount,
    } = dashboradData();

    const RenderDocumentsGrid = React.useCallback(() => {
        const columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Age', key: 'age', width: 10 },
        ];

        const rows = [
            { id: 1, name: 'John Doe', age: 25 },
            { id: 2, name: 'Jane Doe', age: 28 },
        ];

        return <div className="ms-Grid-row" id="printArea">
            <h2 className="mainTitle" style={{ marginBottom: 14 }}>Recently Added Documents</h2>
            <button onClick={(e) => generateExcelTable(rows, columns)}>
                {"Export To Excel"}
            </button>
            <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg12 mainBox">
                <MemoizedDataGridComponent
                    items={metaDataDetailsDataList}
                    columns={_generateColumns()}
                    reRenderComponent={false}
                    isheaderFilter={true}
                />
                <br /><br />
                <div className="seeAllDiv" style={{ float: "right", marginTop: 3 }}>
                    <a href="#" className="seeAllTAg" onClick={() => {
                        loadComponent(ComponentName.Documents, ComponentName.Dashboard);
                    }}>See All
                        <FontAwesomeIcon icon={"arrow-right"} style={{ marginLeft: "2px" }} />
                    </a>
                </div>
            </div>
        </div>
    }, [metaDataDetailsDataList]);



    return (
        <>
            {isLoading && <Loader />}
            <div className="boxCard">
                <div className="ms-Grid">
                    <div className="ms-Grid-row" style={{ marginTop: 10 }}>
                        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg3">
                            <div className="boxCardCount firstcard" style={{
                                textAlign: "center", cursor: "pointer"
                            }} onClick={() => {
                                loadComponent(ComponentName.ViewClient, ComponentName.Dashboard);
                            }}>
                                <div style={{ margin: 16 }}>
                                    <span style={{ fontSize: 36 }}>{clientDataCount} </span><br />
                                    <span style={{ fontSize: 20, fontWeight: "bold" }}>Clients</span>
                                </div>
                            </div>
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg3">
                            <div className="boxCardCount secondcard" style={{ textAlign: "center", cursor: "pointer" }} onClick={() => {
                                loadComponent(ComponentName.Documents, ComponentName.Dashboard);
                            }}>
                                <div style={{ margin: 16 }}>
                                    <span style={{ fontSize: 36 }}>{metaDataCount} </span><br />
                                    <span style={{ fontSize: 20, fontWeight: "bold" }}>Documents</span>
                                </div>
                            </div>
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg3">
                            <div className="boxCardCount thirdcard" style={{ textAlign: "center", cursor: "pointer" }} onClick={() => {
                                loadComponent(ComponentName.Documents, ComponentName.Dashboard);
                            }}>
                                <div style={{ margin: 16 }}>
                                    <span style={{ fontSize: 36 }}>{metaDataActiveCount} </span><br />
                                    <span style={{ fontSize: 20, fontWeight: "bold" }}>Active Documents</span>
                                </div>
                            </div>
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg3">
                            <div className="boxCardCount forthcard" style={{ textAlign: "center", cursor: "pointer" }} onClick={() => {
                                loadComponent(ComponentName.Documents, ComponentName.Dashboard);
                            }}>
                                <div style={{ margin: 16 }}>
                                    <span style={{ fontSize: 36 }}>{metaDataArchieveCount} </span><br />
                                    <span style={{ fontSize: 20, fontWeight: "bold" }}>Archieve Documents</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <RenderDocumentsGrid />
                    <br />

                </div>
            </div >
        </>
    );
}

export default Dashboards; 
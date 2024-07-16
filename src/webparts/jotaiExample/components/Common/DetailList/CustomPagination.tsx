/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pagination } from "@pnp/spfx-controls-react/lib/Pagination"
import * as React from "react";
import styles from './css/DataGrid.module.scss';
interface IPaginationCommonProps {
    items: any[];
    pagedItems: any;
    pageLength?: number
}
interface IPaginationState {
    fromNo: number,
    toNo: number,
    totalPages: number,
    pagedItem: any[],
    currentPage: number,
}
export const CustomPagination = ({ items, pagedItems: pagedItems, pageLength }: IPaginationCommonProps): React.ReactElement => {
    const PAGE_LENGTH: number = 20;
    const [paginationState, setPaginationState] = React.useState<IPaginationState>({
        fromNo: 1,
        toNo: !!pageLength ? pageLength : PAGE_LENGTH,
        totalPages: 0,
        pagedItem: [],
        currentPage: 1,
    })

    const _getPagedOnClick = (currentPage: number, pageSize: number, items: any[]): any => {
        let fromNo;
        let toNo;
        let pagedItemsData;
        const oddItems = items.length % pageSize
        let totalPage;
        // let FinalPage;
        if (oddItems > 0) {
            totalPage = (items.length / pageSize)
            // FinalPage = totalPage.toString().split(".", 1)
            totalPage = totalPage.toString().split(".", 2)
            totalPage = totalPage[1]
            if (totalPage >= "5") {
                const page = (items.length / pageSize)
                totalPage = Math.round(page)
            }
            else {
                const page = (items.length / pageSize)
                totalPage = Math.round(Number(page)) + 1
            }
        }
        else {
            totalPage = (items.length / pageSize)
        }
        if (currentPage === 1) {
            pagedItemsData = (items.slice(0, pageSize))
        } else {
            const roundupPage = Math.ceil(currentPage - 1);
            pagedItemsData = (items.slice(roundupPage * pageSize, (roundupPage * pageSize) + pageSize))
        }
        if (currentPage === 1) {
            fromNo = 1
            toNo = totalPage === 1 ? items.length : pageSize;
        } else {
            if ((currentPage - 1) === 1) {
                fromNo = pageSize + (currentPage - 1);
            } else {
                fromNo = pageSize * (currentPage - 1) + 1;
            }
            const setToNo = pageSize * currentPage
            if (setToNo > items.length) {
                toNo = items.length;
            } else {
                toNo = pageSize * currentPage;
            }
        }

        return { pagedItemsData, fromNo, toNo, totalPage }
    }

    const _getPaged = (page: number): void => {
        const { pagedItemsData, fromNo, toNo, totalPage } = _getPagedOnClick(page, !!pageLength ? pageLength : PAGE_LENGTH, items)
        setPaginationState({ fromNo: fromNo, toNo: toNo, totalPages: Number(totalPage), pagedItem: pagedItems, currentPage: page })
        pagedItems(pagedItemsData)
    }

    React.useEffect(() => {
        _getPaged(1);
    }, [items])

    return (
        <>
            <div className="ms-Grid-row" style={{ display: "flex", alignItems: "baseline" }}>
                <div className="ms-Grid-col ms-lg3">
                    <div className={[styles.p_b_20, styles.p_t_10].join(" ")}>
                        Showing {paginationState.fromNo} to {paginationState.toNo} of {items.length} entries
                    </div>
                </div>
                <div className="ms-Grid-col ms-lg9 ">
                    <Pagination
                        currentPage={paginationState.currentPage}
                        totalPages={paginationState.totalPages}
                        onChange={(page: number) => _getPaged(page)}
                        limiter={2} />
                </div>
            </div>
        </>
    )

}

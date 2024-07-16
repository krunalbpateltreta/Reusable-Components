import { ColumnActionsMode, IDetailsHeaderProps, IRenderFunction } from "@fluentui/react";
import { ICustomColumn } from "./DataGridComponent";

export interface IDataGridStates {
    allColumns: ICustomColumn[],
    filteredItems: any[],
    allItems: any[],
    detailsListProps: any;
    searchText: string;
    nextData?: any;
    currentSortingColumn?: ICustomColumn | undefined;
    beforefilterData?: any
}

export const onDetailListHeaderRender = (detailsHeaderProps: IDetailsHeaderProps, defaultRender: IRenderFunction<IDetailsHeaderProps>): any => {
    return defaultRender({
        ...detailsHeaderProps,
        styles: {
            root: {
                selectors: {
                    '.ms-DetailsHeader-cell': {
                        whiteSpace: 'normal',
                        textOverflow: 'clip',
                        lineHeight: 'normal',
                        background: "#A4262C",
                        color: "#fff",
                        fontSize: "13px"
                    },
                    '.ms-DetailsHeader-cell:hover': {
                        background: "#ed989c",
                        color: "#fff",
                        fontSize: "13px"
                    },
                    '.ms-DetailsHeader-cellTitle': {
                        height: '100%',
                        alignItems: 'center'
                    },
                    '.ms-Icon': {
                        color: '#ffffff',
                    }

                },
            }
        }
    })
};

export function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
    const key = columnKey as keyof T;
    return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}

export const _generateDynamicColumn = (columns: ICustomColumn[], _onColumnClick: any, isheaderFilter: boolean) => {
    const IColumArray = ["key", "name", "fieldName", "flexGrow", "className", "styles", 'minWidth', "targetWidthProportion", "ariaLabel", "isRowHeader", "maxWidth", "columnActionsMode", "iconName", "isIconOnly", "iconClassName", "isCollapsable", "isCollapsible", "showSortIconWhenUnsorted", "isSorted", "isSortedDescending", "isResizable", "isMultiline", "onRender", "getValueKey", "onRenderField", "onRenderDivider", "onRenderFilterIcon", "onRenderHeader", "isFiltered", "onColumnClick", "onColumnContextMenu", "onColumnResize", "isGrouped", "data", "calculatedWidth", "currentWidth", "headerClassName", "isPadded", "sortAscendingAriaLabel", "sortDescendingAriaLabel", "sortableAriaLabel", "groupAriaLabel", "filterAriaLabel", "isMenuOpen"];
    const allColumns: ICustomColumn[] = [];
    for (let index = 0; index < columns.length; index++) {
        const element: ICustomColumn = columns[index];
        const obj: any = {
            isPadded: true,
            isRowHeader: true,
            isResizable: true,
        };
        for (const key in element) {
            if (Object.prototype.hasOwnProperty.call(element, key)) {
                const el = element[key as keyof ICustomColumn];
                if (IColumArray.indexOf(key) > -1) {
                    obj[key] = el;
                }
                if (!!isheaderFilter && isheaderFilter === true) {
                    obj.columnActionsMode = ColumnActionsMode.hasDropdown
                }
                if (key === "isSortingRequired" && element[key]) {
                    obj.onColumnClick = _onColumnClick
                }
            }
        }
        allColumns.push(obj);
    }
    return allColumns;
}

export const setColumnProperties = (data: React.MutableRefObject<IDataGridStates>, column: ICustomColumn) => {
    const newColumns: ICustomColumn[] = data.current.allColumns.slice();
    const currColumn: ICustomColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
    newColumns.forEach((newCol: ICustomColumn) => {
        if (newCol === currColumn) {
            currColumn.isSortedDescending = !currColumn.isSortedDescending;
            currColumn.isSorted = true;
        } else {
            newCol.isSorted = false;
            newCol.isSortedDescending = true;
        }
    });
    return { newColumns, currColumn };
}
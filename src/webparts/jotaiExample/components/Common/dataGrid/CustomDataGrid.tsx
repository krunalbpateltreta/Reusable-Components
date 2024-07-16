/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-inner-declarations */
import * as React from "react";
import {
    FolderRegular,
    DocumentRegular,
} from "@fluentui/react-icons";
import {
    useArrowNavigationGroup,
    TableBody,
    TableRow,
    Table,
    TableHeader,
    TableHeaderCell,
    TableSelectionCell,
    useTableFeatures,
    TableColumnDefinition,
    useTableSelection,
    useTableSort,
    createTableColumn,
    TableColumnId,
    TableRowId,
    TableColumnSizingOptions,
    useTableColumnSizing_unstable
} from "@fluentui/react-components";
import { formatBytes, getFileTypeIcon, getNumberValue, getPeoplePickerValueCAML, getStringValue } from "../../../Shared/Utils";
import * as CamlBuilder from "camljs";
import * as moment from "moment";
import { Documents, IDocuments } from "../../../models/IDocuments";
import { ListNames } from "../../../Shared/Enum/ListNames";
import CustomBreadcrumb, { ICustomBreadcrumbItem } from "../breadcrumb/CustomBreadcrumb";
import { TableSelectableRowMemoized } from "./TableRow";
// import sortBy from 'lodash/sortBy';
import { appGlobalStateAtom } from "../../../jotai/appGlobalStateAtom";
import { useAtomValue } from "jotai";
import { DocumentsFields } from "./DocumentsFields";
import { DateTimeFormat } from "../../../Shared/constants/Constants";
import { Loader } from "../loader/Loader";
import { IPnPCAMLQueryOptions } from "../../../Service/models/IPnPQueryOptions";
import { ScrollablePane, ScrollbarVisibility } from "@fluentui/react";
import { useRef } from 'react';

const columns: TableColumnDefinition<Documents>[] = [
    createTableColumn<Documents>({
        columnId: "file",
        compare: (a, b) => {
            return a.file.label.localeCompare(b.file.label);
        },
    }),
    createTableColumn<Documents>({
        columnId: "author",
        compare: (a, b) => {
            return a.author.label.localeCompare(b.author.label);
        },
    }),
    createTableColumn<Documents>({
        columnId: "editor",
        compare: (a, b) => {
            return a.author.label.localeCompare(b.editor.label);
        },
    }),
    createTableColumn<Documents>({
        columnId: "created",
        compare: (a, b) => {
            return a.created.timestamp - b.created.timestamp;
        },
    }),
    createTableColumn<Documents>({
        columnId: "lastUpdated",
        compare: (a, b) => {
            return a.lastUpdated.timestamp - b.lastUpdated.timestamp;
        },
    }),
    createTableColumn<Documents>({
        columnId: "fileSize",
        compare: (a, b) => {
            return a.fileSize.size - b.fileSize.size;
        },
    })
];


export const CustomDataGrid: React.FC = () => {
    const [selectedRows, setSelectedRows] = React.useState(() => new Set<TableRowId>([]));
    const [sourcePath, setSourcePath] = React.useState<string>("");
    const [newBreadcrumbItem, setNewBreadcrumbItem] = React.useState<ICustomBreadcrumbItem>();
    const [items, setItems] = React.useState<Documents[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [heightOfContainer,] = React.useState<number>(Math.round(window.innerHeight) - 300);
    const camlQueryRef = useRef<string>("");
    const nextDataRef = useRef<any>(undefined);
    const appGlobalState = useAtomValue(appGlobalStateAtom);
    const { provider, context } = appGlobalState;

    const [columnSizingOptions] = React.useState<TableColumnSizingOptions>({
        file: {
            idealWidth: 250,
            minWidth: 250,
        },
        author: {
            minWidth: 110,
            defaultWidth: 110,
        },
        created: {
            minWidth: 100,
            defaultWidth: 100,
        },
    });

    const {
        getRows,
        selection: {
            allRowsSelected,
            someRowsSelected,
            toggleAllRows,
            toggleRow,
            isRowSelected,
        },
        sort: { getSortDirection, toggleColumnSort, sort },
        columnSizing_unstable,
        tableRef
    } = useTableFeatures({ columns, items }, [
        useTableSelection({
            selectionMode: "multiselect",
            defaultSelectedItems: selectedRows,
            onSelectionChange: (e, data) => setSelectedRows(data.selectedItems),
        }),
        useTableSort({
            defaultSortState: { sortColumn: "created", sortDirection: "descending" },
        }),
        useTableColumnSizing_unstable({ columnSizingOptions })
    ]
    );

    const rows = sort(
        getRows((row) => {
            const selected = isRowSelected(row.rowId);
            return {
                ...row,
                selected,
                appearance: selected ? ("neutral" as const) : ("none" as const),
            };
        })
    );

    const headerSortProps = (columnId: TableColumnId) => ({
        onClick: (e: React.MouseEvent) => {
            toggleColumnSort(e, columnId);
        },
        sortDirection: getSortDirection(columnId),
    });

    const keyboardNavAttr = useArrowNavigationGroup({ axis: "grid" });
    const bindData = (allFoldersfiles: any) => {
        if (!!allFoldersfiles) {
            const itemsData: Documents[] = allFoldersfiles.map((itemObj: IDocuments, index: number) => {
                const itemData: Documents = {
                    Id: itemObj?.ID || 0,
                    file: {
                        label: getStringValue(itemObj?.FileLeafRef),
                        link: getStringValue(itemObj?.FileRef),
                        icon: (getNumberValue(itemObj?.FSObjType) === 1 ? <FolderRegular /> : <DocumentRegular />)
                    },
                    author: {
                        label: getPeoplePickerValueCAML(itemObj?.Author, "title"),
                        status: "do-not-disturb"
                    },
                    created: {
                        label: moment(itemObj?.Created).format(DateTimeFormat),
                        timestamp: new Date(itemObj?.Created).getTime()
                    },
                    editor: {
                        label: getPeoplePickerValueCAML(itemObj?.Editor, "title"),
                        status: "available"
                    },
                    lastUpdated: {
                        label: moment(itemObj?.Modified).format(DateTimeFormat),
                        timestamp: new Date(itemObj?.Modified).getTime()
                    },
                    fileSize: {
                        label: formatBytes(itemObj?.File_x0020_Size) || "",
                        size: getNumberValue(itemObj?.File_x0020_Size)
                    },
                    fileType: getFileTypeIcon(getNumberValue(itemObj?.FSObjType) === 1 ? "folder" : itemObj?.File_x0020_Type) || "",
                    fsObjectType: itemObj?.FSObjType || 0
                };
                return itemData;
            });
            setItems((prevItems: any) => [...prevItems, ...itemsData])
        }
    }

    const loadMoreData = async () => {
        const pageToken = nextDataRef?.current?.NextHref.split('?')[1];
        const pnpQueryOptions: IPnPCAMLQueryOptions = {
            listName: ListNames.DMSDocuments,
            queryXML: camlQueryRef.current,
            FolderServerRelativeUrl: sourcePath || "",
            pageToken: pageToken,
            pageLength: 100
        }
        const moreResponse = await provider.getItemsInBatchByCAMLQuery(pnpQueryOptions);
        bindData(moreResponse?.Row);
        if (nextDataRef.current)
            nextDataRef.current = moreResponse;
    }

    const handleScroll = (event: any) => {
        try {
            if (event.target.clientHeight >= Math.round(event.target.scrollHeight - event.target.scrollTop) && event.target.scrollTop > 0) {
                void (async function (): Promise<void> {
                    console.log("Scroll");
                    await loadMoreData();
                })();
            }
        } catch (error) {
            console.log("Error in on scroll event");
        }
    };


    React.useEffect(() => {
        const getListItemsCamlQuery = async () => {
            try {
                let folderPath = "";
                if (sourcePath !== "") {
                    folderPath = sourcePath;
                    setItems([]);
                }
                const camlQuery = new CamlBuilder()
                    .View([
                        DocumentsFields.Id,
                        DocumentsFields.Title,
                        DocumentsFields.FileLeafRef,
                        DocumentsFields.FileRef,
                        DocumentsFields.FileDirRef,
                        DocumentsFields.FileSize,
                        DocumentsFields.FileType,
                        DocumentsFields.Author,
                        DocumentsFields.AuthorId,
                        DocumentsFields.Editor,
                        DocumentsFields.EditorId,
                        DocumentsFields.FSObjType,
                        DocumentsFields.Created,
                        DocumentsFields.Modified
                    ])
                    .Scope(CamlBuilder.ViewScope.RecursiveAll)
                    .RowLimit(100, true)
                    .Query()
                    .OrderByDesc(DocumentsFields.Created).ToString();
                const pnpQueryOptions: IPnPCAMLQueryOptions = {
                    listName: ListNames.DMSDocuments,
                    queryXML: camlQuery,
                    FolderServerRelativeUrl: folderPath || "",
                    pageToken: "",
                    pageLength: 100
                }
                const localResponse = await provider.getItemsInBatchByCAMLQuery(pnpQueryOptions);
                bindData(localResponse?.Row);
                setIsLoading(false);
                camlQueryRef.current = camlQuery;
                nextDataRef.current = localResponse;
            } catch (error) {
                console.log(error);
            }
        }

        void (async () => {
            setIsLoading(true);
            await getListItemsCamlQuery();
        })()

    }, [sourcePath])

    return (
        <div className="boxCard">
            <div className="formGroup" >
                {isLoading && <Loader />}
                <h1 className="mainTitle" style={{ textAlign: "left" }}>View Documents</h1>
                <CustomBreadcrumb
                    siteServerRelativeURL={`${context.pageContext.web.serverRelativeUrl}`}
                    parentBreadCrumbItem={{
                        key: `${context.pageContext.web.serverRelativeUrl}/${ListNames.DMSDocumentsPath}`,
                        text: `${ListNames.DMSDocuments}`
                    }}
                    setSourcePath={setSourcePath} // set a new path when click on breadcrumb item.
                    newBreadcrumbItem={newBreadcrumbItem || undefined} // add a new item in breadcrumb when folder is clicked
                />
                {`Total Items: ${items?.length}`}
                <div style={{ position: "relative", height: `${heightOfContainer}px` }}>
                    <ScrollablePane initialScrollPosition={0} scrollbarVisibility={ScrollbarVisibility.auto} onScroll={handleScroll}>
                        <Table
                            {...keyboardNavAttr}
                            role="grid"
                            sortable
                            ref={tableRef}
                            aria-label="DataGrid implementation with Table primitives"
                            {...columnSizing_unstable.getTableProps()}
                        >
                            <TableHeader>
                                <TableRow>
                                    <TableSelectionCell
                                        checked={
                                            allRowsSelected ? true : someRowsSelected ? "mixed" : false
                                        }
                                        aria-checked={
                                            allRowsSelected ? true : someRowsSelected ? "mixed" : false
                                        }
                                        role="checkbox"
                                        onClick={toggleAllRows}
                                        checkboxIndicator={{ "aria-label": "Select all rows " }}
                                    />
                                    <TableHeaderCell {...headerSortProps("file")} {...columnSizing_unstable.getTableHeaderCellProps("file")}>
                                        File
                                    </TableHeaderCell>
                                    <TableHeaderCell {...headerSortProps("author")} {...columnSizing_unstable.getTableHeaderCellProps("author")}>
                                        Author
                                    </TableHeaderCell>
                                    <TableHeaderCell {...headerSortProps("editor")}  {...columnSizing_unstable.getTableHeaderCellProps("author")}>
                                        Editor
                                    </TableHeaderCell>
                                    <TableHeaderCell {...headerSortProps("lastUpdated")}  {...columnSizing_unstable.getTableHeaderCellProps("created")}>
                                        Last updated
                                    </TableHeaderCell>
                                    <TableHeaderCell {...headerSortProps("created")} {...columnSizing_unstable.getTableHeaderCellProps("created")}>
                                        Created
                                    </TableHeaderCell>
                                    <TableHeaderCell {...headerSortProps("fileSize")} {...columnSizing_unstable.getTableHeaderCellProps("created")}>
                                        File Size
                                    </TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map(({ item, selected, appearance, rowId }) => (
                                    <TableSelectableRowMemoized
                                        key={rowId}
                                        rowId={rowId}
                                        toggleRow={toggleRow}
                                        item={item}
                                        selected={selected}
                                        appearance={appearance}
                                        setSourcePath={setSourcePath}
                                        setNewBreadcrumbItem={setNewBreadcrumbItem}
                                        columnSizing_unstable={columnSizing_unstable}
                                        setSelectedRows={setSelectedRows}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollablePane>
                </div>
            </div>
        </div>
    );
};

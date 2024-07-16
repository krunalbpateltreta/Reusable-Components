import * as React from "react";
import { Link, TooltipHost } from "@fluentui/react";
import { useId } from "@uifabric/react-hooks";
import {
    Avatar,
    TableCell,
    TableRow,
    TableSelectionCell,
    TableCellLayout,
    TableRowProps,
    TableSelectionState,
    TableRowId,
} from "@fluentui/react-components";
import { Documents } from "../../../models/IDocuments";
import { ICustomBreadcrumbItem } from "../breadcrumb/CustomBreadcrumb";
type TableSelectableRowProps = {
    toggleRow: TableSelectionState["toggleRow"];
    item: Documents;
    selected: boolean;
    setSourcePath: any;
    setNewBreadcrumbItem: any;
    appearance: TableRowProps["appearance"];
    rowId: TableRowId;
    columnSizing_unstable: any,
    setSelectedRows: any;
};


const TableSelectableRow: React.FC<TableSelectableRowProps> = (props) => {
    const { item, selected, appearance, rowId, toggleRow, setSourcePath, setNewBreadcrumbItem, columnSizing_unstable, setSelectedRows } = props;

    const fileLinkId = useId('fileLink');
    const onClick = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => toggleRow(e, rowId),
        [toggleRow, rowId]
    );
    const onKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === " ") {
                e.preventDefault();
                toggleRow(e, rowId);
            }
        },
        [toggleRow, rowId]
    );

    const onFolderClick = React.useCallback((documentItem: Documents) => {
        const newBreadcrumbItem: ICustomBreadcrumbItem = {
            text: `${documentItem.file.label}`,
            key: `${documentItem.file.link}`,
        };

        setNewBreadcrumbItem(newBreadcrumbItem);
        setSourcePath(newBreadcrumbItem.key);
        setSelectedRows(() => new Set<TableRowId>([]));
    }, []);


    return (
        <TableRow
            key={item.file.label}
            onClick={onClick}
            onKeyDown={onKeyDown}
            aria-selected={selected}
            appearance={appearance}
        >
            <TableSelectionCell
                role="gridcell"
                aria-selected={selected}
                checked={selected}
                checkboxIndicator={{ "aria-label": "Select row" }}
            />
            <TableCell tabIndex={0} role="gridcell" aria-selected={selected}
                {...columnSizing_unstable.getTableCellProps("file")} style={{ wordBreak: 'break-word' }}
            >
                <TableCellLayout media={
                    <img src={`${item.fileType}`} className="fileIconImg" alt="File" />
                }>
                    {item.fsObjectType === 0 ?
                        <Link className="" href={`${item.file.link}`} >
                            <TooltipHost
                                content={"View Document"}
                                id={fileLinkId}
                            >
                                {item.file.label}
                            </TooltipHost>
                        </Link>
                        : <Link className="" onClick={() => onFolderClick(item)}>
                            <TooltipHost
                                content={"View Documents"}
                                id={fileLinkId}
                            >
                                {item.file.label}
                            </TooltipHost>
                        </Link>
                    }
                </TableCellLayout>
            </TableCell>
            <TableCell tabIndex={0} role="gridcell"  {...columnSizing_unstable.getTableCellProps("author")}>
                <TableCellLayout
                    media={
                        <Avatar
                            aria-label={item.author.label}
                            name={item.author.label}
                            badge={{ status: item.author.status }}
                        />
                    }
                >
                    {item.author.label}
                </TableCellLayout>
            </TableCell>
            <TableCell tabIndex={0} role="gridcell"  {...columnSizing_unstable.getTableCellProps("author")}>
                <TableCellLayout
                    media={
                        <Avatar
                            aria-label={item.editor.label}
                            name={item.editor.label}
                            badge={{ status: item.editor.status }}
                        />
                    }
                >
                    {item.editor.label}
                </TableCellLayout>
            </TableCell>
            <TableCell tabIndex={0} role="gridcell" {...columnSizing_unstable.getTableHeaderCellProps("created")}>
                {item.lastUpdated.label}
            </TableCell>
            <TableCell tabIndex={0} role="gridcell" {...columnSizing_unstable.getTableHeaderCellProps("created")}>
                {item.created.label}
            </TableCell>
            <TableCell tabIndex={0} role="gridcell" {...columnSizing_unstable.getTableHeaderCellProps("created")}>
                {item.fileSize.label}
            </TableCell>
        </TableRow >
    );
};

export const TableSelectableRowMemoized = React.memo(TableSelectableRow);

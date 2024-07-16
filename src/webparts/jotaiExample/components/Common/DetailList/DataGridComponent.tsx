/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
   ConstrainMode, IDetailsHeaderProps, IListProps, IRenderFunction, SelectionMode,
   Sticky, StickyPositionType, ScrollbarVisibility,
   ScrollablePane, IColumn, SearchBox, DetailsList, ContextualMenu, IContextualMenuItem, IContextualMenuProps, DirectionalHint, ColumnActionsMode, TooltipHost
} from "@fluentui/react";
import * as _ from "lodash";
import * as React from "react";
import { CustomPagination } from "./CustomPagination";
import { PrimaryButton } from "office-ui-fabric-react";
import { NoRecordFound } from '../NoRecordFound';
import { ComponentName } from "../../../Shared/Enum/ComponentName";
import { SearchboxAlignment } from "./constant/DetailListEnum";
import { _copyAndSort, onDetailListHeaderRender } from "./DetailListCommon";
import { GetFilterValues, GetSortingMenuItems, generateExcelFile, generateExcelTable } from "../../../Shared/Utils";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IExportColumns } from "../../../models/ExportColumn";
require("./css/detailList.css");

export interface ICustomColumn extends IColumn {
   isSortingRequired?: boolean;
}

interface IAddNewItem {
   isAddNewItem: boolean;
   addNewItemClick: (_componentName: string) => void;
   addNewItemComponentName: ComponentName;
   buttonName: string;
}

interface IDataGridComponentProps {
   items: any[];
   columns: ICustomColumn[];
   reRenderComponent?: boolean;
   addNewItem?: IAddNewItem;
   pageSize?: number;
   reduceHeight?: number;
   searchAlignment?: SearchboxAlignment;
   isStickyHeader?: boolean;
   customOnDetailListHeaderRender?: any;
   isExportToExcel?: boolean;
   isDisplayScrollablePane?: boolean;
   showPagination?: boolean
   onItemInvoked?: (item?: any,
      index?: number, ev?: Event) => void;
   isheaderFilter?: any
}

interface IDataGridStates {
   allColumns: ICustomColumn[],
   filteredItems: any[],
   allItems: any[],
   detailsListProps: any;
   searchText: string;
}
export const DataGridComponent = (props: IDataGridComponentProps) => {
   const PAGE_LENGTH: number = !!props.pageSize ? props.pageSize : 10;
   const [, forceUpdate] = React.useReducer(x => x + 1, 0);
   const breadCrumFolderItems = React.useRef<any[]>([]);
   const [keyUpdate, setKeyUpdate] = React.useState<number>(Math.random());

   const [headerFilterProps, setHeaderFilterProps] = React.useState<any>(null);
   const defaultStates: IDataGridStates = {
      allColumns: [],
      filteredItems: [],
      allItems: [],
      detailsListProps: {},
      searchText: ""
   }
   const data = React.useRef(defaultStates);
   const [pagedItemData, setPagedItemData] = React.useState<any[]>([]);
   const [showResetFilters, setShowResetFilters] = React.useState<boolean>(false);
   const IColumArray = ["key", "name", "fieldName", "flexGrow", "className", "styles", 'minWidth', "targetWidthProportion", "ariaLabel", "isRowHeader", "maxWidth", "columnActionsMode", "iconName", "isIconOnly", "iconClassName", "isCollapsable", "isCollapsible", "showSortIconWhenUnsorted", "isSorted", "isSortedDescending", "isResizable", "isMultiline", "onRender", "getValueKey", "onRenderField", "onRenderDivider", "onRenderFilterIcon", "onRenderHeader", "isFiltered", "onColumnClick", "onColumnContextMenu", "onColumnResize", "isGrouped", "data", "calculatedWidth", "currentWidth", "headerClassName", "isPadded", "sortAscendingAriaLabel", "sortDescendingAriaLabel", "sortableAriaLabel", "groupAriaLabel", "filterAriaLabel", "isMenuOpen"];
   const [heightOfContainer, setHeightOfContainer] = React.useState<number>(Math.round(window.innerHeight) - 250);
   const { reduceHeight, showPagination } = props;
   const getHeight = (topHeight: number): number => {
      if (document.getElementsByClassName("ms-DetailsList").length > 0) {
         const detailListHeight = document.getElementsByClassName("ms-DetailsList")[0].clientHeight;
         const fullHeight = Math.round(window.innerHeight) - topHeight;
         return (detailListHeight < fullHeight ? (detailListHeight + 20) : fullHeight)
      }
      else {
         return Math.round(window.innerHeight) - topHeight;
      }
   }

   const setGridHeight = () => {
      setTimeout(() => {
         const _componentHeight = getHeight(reduceHeight || 310);
         setHeightOfContainer(_componentHeight);
      }, 200);
   }

   const pagedItems = (items: any[]) => {
      setPagedItemData(items);
      setGridHeight();
   };

   const _GetFilterValues = (column: IColumn): IContextualMenuItem[] => {

      const filters = GetFilterValues(column, data.current.filteredItems, ClickFilter);
      return filters;
   }

   const _onBreadcrumbItemClicked = (ev: React.MouseEvent<HTMLElement>, item: any): void => {
      const parentItemIndex = item.parent.findIndex((i: any) => i.number === item.number) + 1;
      const crumb = breadCrumFolderItems.current.slice(0, parentItemIndex);
      breadCrumFolderItems.current = crumb
      setKeyUpdate(Math.random());
      for (let index = 0; index < crumb.length; index++) {
         const element = crumb[index];
         if (index === 0) {
            ClickFilter(ev, element.item, true, true)
         } else {
            ClickFilter(ev, element.item, true)
         }
      }
      // ClickFilter(ev, item.item, true)
   }
   const ClickFilter = (ev?: any, item?: IContextualMenuItem, isBreadCrumClicked?: boolean, isAllData?: boolean): void => {
      if (item) {
         const columns = data.current.allColumns;

         columns.filter((matchColumn: any) => matchColumn.key === item.data)
            .forEach((filteredColumn: IColumn) => {
               filteredColumn.isFiltered = true;
            });
         const modifeidColumns: IColumn[] = data.current.allColumns;
         _.map(modifeidColumns, (c: IColumn) => {
            if (c.fieldName !== item.data) {
               c.isSorted = false;
               c.isSortedDescending = false;
            }
         });

         const documents = (!!isAllData && isAllData === true) ? data.current.allItems : data.current.filteredItems;
         let newDocs: any = [];
         if (item.data !== "Tags") {
            newDocs = documents.filter((matchDoc: any) => matchDoc[item.data] === item.key);
         }
         else {
            for (let i = 0; i < documents.length; i++) {
               const itemValue: string = documents[i][item.data];
               if (itemValue.indexOf(item.key) > -1) {
                  newDocs.push(documents[i]);
               }
            }

         }

         const breadCrumbItems: any[] = breadCrumFolderItems.current;
         const isSameColumn = breadCrumbItems.filter((i: any) => i.value === item.key).length > 0;
         if (!isSameColumn) {
            breadCrumbItems.push({ text: ` ${item.data}: ${item.key}`, key: item.data, onClick: _onBreadcrumbItemClicked, item: item, parent: breadCrumFolderItems.current, number: Math.random(), value: item.key, index: breadCrumbItems.length })
         }
         if (isBreadCrumClicked === undefined) {
            breadCrumFolderItems.current = breadCrumbItems;
         }

         setShowResetFilters(true)
         setKeyUpdate(Math.random());
         const detailsListObj = { ...data.current.detailsListProps, columns: modifeidColumns };

         data.current = {
            ...data.current,
            filteredItems: newDocs,
            allColumns: modifeidColumns,
            detailsListProps: detailsListObj
         };
         forceUpdate();
         // setState((prevState: any) => ({ ...prevState, displayeItems: newDocs, showResetFilters: true }));
      }
   }

   const _onSortColumn = (column: any, isSortedDescending: boolean) => {

      column = _.find(data.current.allColumns, c => c.fieldName === column.fieldName);
      column.isSortedDescending = isSortedDescending;
      column.isSorted = true;

      //reset the other columns
      const modifeidColumns: IColumn[] = data.current.allColumns;
      _.map(modifeidColumns, (c: IColumn) => {
         if (c.fieldName !== column.fieldName) {
            c.isSorted = false;
            c.isSortedDescending = false;
         }
      });

      let modifiedDocs: any = data.current.filteredItems;

      modifiedDocs = _.orderBy(
         modifiedDocs,
         [(document) => {
            if (column.data === Number) {
               if (document[column.fieldName]) {
                  return parseInt(document[column.fieldName]);
               }
               return 0;
            }
            if (column.data === Date) {
               if (document[column.fieldName]) {

                  return new Date(document[column.fieldName]);
               }
               return new Date(0);
            }

            return document[column.fieldName];
         }],
         [column.isSortedDescending ? "desc" : "asc"]);
      const detailsListObj = { ...data.current.detailsListProps, columns: modifeidColumns };
      data.current = {
         ...data.current,
         filteredItems: modifiedDocs,
         allColumns: modifeidColumns,
         detailsListProps: detailsListObj
      }
      setShowResetFilters(true)
   }

   const _getContextualMenuProps = (ev: React.MouseEvent<HTMLElement>, column: IColumn): IContextualMenuProps => {


      const items: IContextualMenuItem[] = GetSortingMenuItems(column, _onSortColumn);
      if (isFilterable(column.key)) {
         items.push({
            key: 'filterBy',
            name: 'Filter by ',// + column.name,
            canCheck: true,
            checked: column.isFiltered,
            subMenuProps: {
               items: _GetFilterValues(column)
            }
         });
      }

      return {
         items: items,
         target: ev.currentTarget as HTMLElement,
         directionalHint: DirectionalHint.bottomLeftEdge,
         gapSpace: 10,
         isBeakVisible: true,
         onDismiss: _onContextualMenuDismissed
      };
   }
   const _onContextualMenuDismissed = () => {
      if (props.isheaderFilter)
         setHeaderFilterProps(null)
   }
   const isFilterable = (columnKey: string): boolean => {
      return columnKey !== "Name";
   }
   const _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: ICustomColumn): void => {
      if (!!props.isheaderFilter && props.isheaderFilter === true) {
         setHeaderFilterProps(_getContextualMenuProps(ev, column))
      } else {
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
         const newItems = _copyAndSort(data.current.filteredItems, currColumn.fieldName!, currColumn.isSortedDescending);
         const detailsListObj = { ...data.current.detailsListProps, columns: newColumns };
         data.current = {
            ...data.current,
            allColumns: newColumns,
            filteredItems: newItems,
            detailsListProps: detailsListObj
         };
      }
      forceUpdate();
   };

   const _generateDynamicColumn = () => {
      const allColumns: ICustomColumn[] = [];
      for (let index = 0; index < props.columns.length; index++) {
         const element: ICustomColumn = props.columns[index];
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
               if (!!props.isheaderFilter && props.isheaderFilter === true) {
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


   const onSearch = (arrayList: any[], searchKey: string): any[] => {
      if (!!searchKey && searchKey.trim().length > 0) {
         searchKey = searchKey.trim().toString().toLowerCase();
         return arrayList.filter((obj: any) => {
            return Object.keys(obj).some((key: string) => {
               return !!obj[key] ? obj[key].toString().toLowerCase().includes(searchKey) : false;
            })
         });
      } else {
         return arrayList;
      }
   };

   const _onSearchTextChange = React.useCallback((text: string | undefined) => {
      const filteredData = onSearch(data.current.allItems, text || "");
      data.current = { ...data.current, filteredItems: filteredData, searchText: text || "" };
      forceUpdate();
      setPagedItemData(filteredData);
      setGridHeight();
   }, []);

   React.useEffect(() => {
      let detailsListObj = {};
      if (typeof (props.isStickyHeader) === 'undefined' || props.isStickyHeader) {
         detailsListObj = {
            onRenderDetailsHeader:
               (detailsHeaderProps: IDetailsHeaderProps, defaultRender: IRenderFunction<IDetailsHeaderProps>) => (
                  <Sticky stickyPosition={StickyPositionType.Header}>
                     {!!props.customOnDetailListHeaderRender ? props.customOnDetailListHeaderRender(detailsHeaderProps, defaultRender) : onDetailListHeaderRender(detailsHeaderProps, defaultRender)}
                  </Sticky>
               )
         }
      } else {
         detailsListObj = {
            onRenderDetailsHeader:
               (detailsHeaderProps: IDetailsHeaderProps, defaultRender: IRenderFunction<IDetailsHeaderProps>) => (
                  <>
                     {!!props.customOnDetailListHeaderRender ? props.customOnDetailListHeaderRender(detailsHeaderProps, defaultRender) : onDetailListHeaderRender(detailsHeaderProps, defaultRender)}
                  </>
               )
         }
      }
      if (!!props.columns && props.columns.length > 0) {
         detailsListObj = { ...detailsListObj, columns: _generateDynamicColumn() }
      }
      if (!!props.onItemInvoked) {
         detailsListObj = { ...detailsListObj, onItemInvoked: props.onItemInvoked }
      }
      data.current = {
         ...data.current,
         allColumns: (!!props.columns && props.columns.length > 0) ? _generateDynamicColumn() : [],
         filteredItems: props.items,
         allItems: props.items,
         detailsListProps: detailsListObj
      };
      setGridHeight();
      setPagedItemData(props.items);
   }, [props.columns, props.items]);


   const _onClickExportToExcel = React.useCallback(() => {
      try {
         let fileData: any[] = [];
         if (!!props.columns && props.columns.length > 0) {
            const rows = data.current?.filteredItems;
            const exportColumns: IExportColumns[] = props.columns.map(cols => {
               const maxWidth = Math.max(cols?.maxWidth ? (cols?.maxWidth / 7) : cols.name.length, cols.name.length + 10);
               return {
                  header: cols.name,
                  key: cols.fieldName || cols.name,
                  width: maxWidth
               }
            });
            generateExcelTable(rows, exportColumns, `DataFile-${moment().format("DDMMYYYY-hhmm")}.xlsx`);
         } else {
            fileData = data.current?.filteredItems;
            generateExcelFile(fileData, `DataFile-${moment().format("DDMMYYYY-hhmm")}.xlsx`)
         }
      } catch (e) {
         console.log("Error in export to excel");
      }
   }, [data.current.filteredItems]);

   const _onAddNewItemClicked = React.useCallback(() => {
      if (props?.addNewItem?.addNewItemClick)
         props?.addNewItem?.addNewItemClick(props?.addNewItem?.addNewItemComponentName);
   }, []);

   const _onResetFiltersClicked = () => {

      const columns = data.current.allColumns;
      //reset the columns
      _.map(columns, (c: IColumn) => {
         c.isSorted = false;
         c.isSortedDescending = false;
         c.isFiltered = false;

      });
      //update the state, this will force the control to refresh
      breadCrumFolderItems.current = []
      data.current = {
         ...data.current,
         filteredItems: data.current.allItems,
      }
      setKeyUpdate(Math.random());
      setShowResetFilters(false)

   }

   const DetailsListComponent = () => {
      return (<DetailsList

         compact={true}
         items={pagedItemData || []}
         selectionMode={SelectionMode.none}
         ariaLabelForGrid="Item details"
         columns={data.current.allColumns}
         listProps={{ renderedWindowsAhead: 0, renderedWindowsBehind: 0 }}
         constrainMode={ConstrainMode.unconstrained}
         selectionPreservedOnEmptyClick={true}
         onShouldVirtualize={(props: IListProps) => {
            return false;
         }}
         {...data.current.detailsListProps}
      />)
   }

   const onClickRemoveFilter = (items: any) => {
      let filteredItems = data.current.allItems;
      const breadCrumbItems = breadCrumFolderItems.current.filter(r => r.index !== items.index)
      const columns = data.current.allColumns
      columns.filter((matchColumn: any) => matchColumn.key === items.item.data)
         .forEach((filteredColumn: IColumn) => {
            filteredColumn.isFiltered = false;
         });
      for (let index = 0; index < breadCrumbItems.length; index++) {
         const el = breadCrumbItems[index];
         filteredItems = filteredItems.filter((i: any) => {
            return i[el.key] === el.value;
         });
      }
      // setKeyUpdate(Math.random());
      if (breadCrumbItems.length === 0) {
         // const columns = data.current.allColumns;
         // //reset the columns
         // _.map(columns, (c: IColumn) => {
         //    c.isSorted = false;
         //    c.isSortedDescending = false;
         //    c.isFiltered = false;

         // });
         setShowResetFilters(false);
      }
      breadCrumFolderItems.current = breadCrumbItems
      data.current = {
         ...data.current,
         filteredItems: filteredItems,
      };
      setKeyUpdate(Math.random());
      // console.log(filteredItems);

   }

   const genrateHeaderFilter = () => {
      return breadCrumFolderItems.current.map((i: any, index: number) => {
         return <div className="dflex" key={`remove-${index}`}>
            <div>  {i.key}:</div>
            <div className="headerFilter pr-10 pl-10" >
               <TooltipHost content="Remove">
                  <span >{i.value} <FontAwesomeIcon icon="times" className="cancel" onClick={() => onClickRemoveFilter(i)} /></span>
               </TooltipHost>
            </div>
         </div>
      })

   }

   return (
      <>
         <React.Fragment>
            <div className="ms-Grid">
               <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12 ms-xl12 ms-xxl12 ms-xxl12"
                     style={{ display: "flex", justifyContent: (!!props.searchAlignment ? props.searchAlignment : "flex-start") }}>
                     <div style={{ width: "200px" }}>
                        <SearchBox
                           placeholder="Search"
                           onChange={(_, newValue) => _onSearchTextChange(newValue)}
                           value={data.current.searchText}
                        />
                     </div>
                     {!!props.isExportToExcel && props.isExportToExcel &&
                        <div style={{ paddingLeft: "20px" }}>
                           <PrimaryButton text="Export To Excel" className='btn-primary' onClick={_onClickExportToExcel} />
                        </div>
                     }
                     {!!props?.addNewItem?.isAddNewItem && props?.addNewItem?.isAddNewItem &&
                        <div style={{ position: "absolute", right: "8px" }}>
                           <PrimaryButton text={props?.addNewItem?.buttonName} className='btn-primary' onClick={_onAddNewItemClicked} />
                        </div>
                     }
                  </div>
               </div>
               <div className="ms-Grid-row mt-2">
                  <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
                     {showResetFilters &&
                        <>
                           <div className="dataJustifyBetween filterbreadcrumb mb-10 ">
                              {/* <Breadcrumb
                                 key={keyUpdate as any}
                                 items={breadCrumFolderItems.current}
                                 maxDisplayedItems={10}
                                 ariaLabel="Breadcrumb with items rendered as buttons"
                                 overflowAriaLabel="More links" /> */}
                              <div className="dflex"> {genrateHeaderFilter()}</div>
                              <div >
                                 <PrimaryButton
                                    text='Reset'
                                    onClick={_onResetFiltersClicked} />
                              </div>
                           </div>
                        </>
                     }
                  </div>
                  <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
                     {data.current.filteredItems.length > 0 && props.isDisplayScrollablePane ?
                        <div style={{ position: "relative", height: `${heightOfContainer}px` }} key={keyUpdate}>
                           <ScrollablePane initialScrollPosition={0} scrollbarVisibility={ScrollbarVisibility.auto}>
                              {DetailsListComponent() as any}
                              {!!headerFilterProps && (
                                 <ContextualMenu   {...headerFilterProps}
                                 />
                              )}
                           </ScrollablePane>
                        </div>
                        :
                        <div key={keyUpdate}>
                           {DetailsListComponent() as any}
                           {!!headerFilterProps && (
                              <ContextualMenu   {...headerFilterProps}
                              />
                           )}
                        </div>
                     }

                     {(data.current.filteredItems.length > 0 && showPagination) &&
                        <CustomPagination
                           items={data.current.filteredItems}
                           pagedItems={pagedItems}
                           pageLength={PAGE_LENGTH}
                        />
                     }

                     {data.current.filteredItems.length === 0 &&
                        <NoRecordFound />
                     }
                  </div>
               </div>
            </div>

         </React.Fragment>
      </>
   )
}

const customComparator = (prevProps: Readonly<IDataGridComponentProps>, nextProps: Readonly<IDataGridComponentProps>) => {
   return !nextProps.reRenderComponent;
};

export const MemoizedDataGridComponent = React.memo(DataGridComponent, customComparator);
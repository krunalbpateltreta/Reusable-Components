/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from 'react';
import { useState, useEffect, useReducer, useRef } from 'react';
import {
   CheckboxVisibility, ScrollablePane, ScrollbarVisibility, SearchBox,
   IDetailsHeaderProps, IRenderFunction, Sticky, StickyPositionType, PrimaryButton, ConstrainMode, Selection, SelectionMode, IContextualMenuItem, IContextualMenuProps, DirectionalHint, IColumn, ContextualMenu, ShimmeredDetailsList, Breadcrumb
} from '@fluentui/react';
import { NoRecordFound } from '../NoRecordFound';
import { ICustomColumn } from './DataGridComponent';
import { SearchboxAlignment, SortOrder } from './constant/DetailListEnum';
import { IDataGridStates, _generateDynamicColumn, onDetailListHeaderRender, setColumnProperties } from './DetailListCommon';
import { ComponentName } from '../../../Shared/Enum/ComponentName';
import { FieldType, ICamlQueryFilter, LogicalType } from '../../../Shared/Enum/CamlQueryFilter';
import { ImportExcel } from '../importExcel/ImportExcel';
import { ListNames } from '../../../Shared/Enum/ListNames';
import moment from 'moment';
import * as _ from "lodash";
import { GetFilterValues, GetSortingMenuItems, generateExcelFile, generateExcelTable, getUniueRecordsByTwoColumnName } from '../../../Shared/Utils';
import { IExportColumns } from '../../../models/ExportColumn';

interface IAddNewItemProps {
   isAddNewItem: boolean;
   addNewItemClick: (_componentName: string) => void;
   addNewItemComponentName: ComponentName;
   currentComponentName: ComponentName;
   buttonName: string;
}

interface IImportExcelProps {
   isImportExcel: boolean;
   importFileColumnNames: any[]
   reloadData: any;
   listName: ListNames;
}

interface IDataProps {
   items: any[],
   nextData: any;
   loadData: (pageToken: string, sortOptions: { sortColumn: string, sortOrder: SortOrder }, filterFields?: ICamlQueryFilter[], _folderPath?: string) => any;
   mappingData: (listItems: any) => any[];
   isLoading: boolean;
   columns: ICustomColumn[];
   filterFields?: ICamlQueryFilter[];
   folderPath?: string;
}
interface IOtherProps {
   pageSize?: number;
   reduceHeight?: number;
   searchAlignment?: SearchboxAlignment | SearchboxAlignment.left;
   customOnDetailListHeaderRender?: any;
   isDisplayScrollablePane?: boolean;
}

type IShimmeredDetailsListProps = {
   dataProps: IDataProps;
   reRenderComponent?: boolean;
   addNewItem?: IAddNewItemProps;
   importExcel?: IImportExcelProps;
   isExportToExcel?: boolean;
   otherProps?: IOtherProps;
   onItemInvoked?: (item?: any, index?: number, ev?: Event) => void;
   onSelectionChange?: (item?: any, index?: number, ev?: Event) => void;
   isheaderFilter?: any
}

const ShimmeredDetailsListCAML: React.FC<IShimmeredDetailsListProps> = (props: IShimmeredDetailsListProps) => {
   const { columns, nextData, isLoading, items, loadData, mappingData, filterFields } = props.dataProps;
   const [keyUpdate, setKeyUpdate] = React.useState<number>(Math.random());
   const [showResetFilters, setShowResetFilters] = React.useState<boolean>(false);
   const [headerFilterProps, setHeaderFilterProps] = React.useState<any>(null);
   const { importExcel, onSelectionChange } = props;
   const breadCrumFolderItems = React.useRef<any[]>([]);
   const _isDisplayScrollablePane = props.otherProps?.isDisplayScrollablePane || false;
   const _searchAlignment = props.otherProps?.searchAlignment || SearchboxAlignment.left;
   const [, forceUpdate] = useReducer(x => x + 1, 0);
   const [pagedItemData, setPagedItemData] = useState<any[]>([]);
   const [heightOfContainer, setHeightOfContainer] = React.useState<number>(Math.round(window.innerHeight) - 250);

   const defaultStates: IDataGridStates = {
      allColumns: [],
      filteredItems: [],
      allItems: [],
      detailsListProps: {},
      searchText: "",
      nextData: null,
      currentSortingColumn: undefined,
      beforefilterData: []

   }

   const data = useRef(defaultStates);
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
         const _componentHeight = getHeight(props.otherProps?.reduceHeight || 275);
         setHeightOfContainer(_componentHeight);
      }, 200);
   }

   const handleScroll = (event: any) => {
      try {
         if (event.target.clientHeight >= Math.round(event.target.scrollHeight - event.target.scrollTop) && event.target.scrollTop > 0) {
            void (async function (): Promise<void> {
               if (!!data.current.nextData?.NextHref) {
                  const sortColumn = data.current.currentSortingColumn?.fieldName || "ID";
                  const sortOrder = data.current.currentSortingColumn === undefined ? SortOrder.Descending : (data.current.currentSortingColumn?.isSortedDescending ? SortOrder.Descending : SortOrder.Ascending);
                  const sortOption = { sortColumn: sortColumn, sortOrder: sortOrder }
                  const defaultfilterFields: ICamlQueryFilter[] = !!filterFields ? filterFields : []
                  if (breadCrumFolderItems.current.length > 0) {
                     breadCrumFolderItems.current.map((i: any) => {
                        const data: ICamlQueryFilter = {
                           fieldName: i.key,
                           fieldValue: i.value,
                           fieldType: FieldType.Text,
                           LogicalType: LogicalType.EqualTo
                        }
                        defaultfilterFields.push(data)
                     })
                  }
                  const filter = getUniueRecordsByTwoColumnName(defaultfilterFields, "fieldValue", "fieldName")

                  const localResponse = await loadData(data.current.nextData.NextHref.split('?')[1], sortOption, filter);
                  const listItems = mappingData(localResponse?.Row);
                  setPagedItemData((prevItems) => [...prevItems, ...listItems]);
                  data.current = {
                     ...data.current,
                     nextData: localResponse,
                     filteredItems: [...pagedItemData, ...listItems],
                  }
               }
            })();
         }
      } catch (error) {
         console.log("Error in on scroll event");
      }
   };

   const _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: ICustomColumn): void => {
      if (!!props.isheaderFilter && props.isheaderFilter === true) {
         setHeaderFilterProps(_getContextualMenuProps(ev, column))
         forceUpdate();
      } else {
         const { newColumns, currColumn }: { newColumns: ICustomColumn[]; currColumn: ICustomColumn; } = setColumnProperties(data, column);
         const detailsListObj = { ...data.current.detailsListProps, columns: newColumns };
         void (async function (): Promise<void> {
            const sortColumn = currColumn?.fieldName || "ID";
            const sortOrder = (currColumn.isSortedDescending ? SortOrder.Descending : SortOrder.Ascending);
            const sortOption = { sortColumn: sortColumn, sortOrder: sortOrder }
            const localResponse = await loadData("", sortOption, filterFields);
            const listItems = mappingData(localResponse?.Row);
            setPagedItemData([]);
            setPagedItemData(listItems);
            data.current = {
               ...data.current,
               allColumns: newColumns,
               nextData: localResponse,
               filteredItems: listItems,
               detailsListProps: detailsListObj,
               currentSortingColumn: currColumn
            }
            forceUpdate();
         })();
      }
   };

   const _selection = new Selection({
      onSelectionChanged: () => getSelectionDetails()
   });

   const getSelectionDetails = (): any => {
      if (onSelectionChange) {
         const selectionCount = _selection.getSelectedCount();
         if (selectionCount > 0) {
            onSelectionChange(_selection.getSelection());
         } else {
            onSelectionChange([]);
         }
      }
   };

   useEffect(() => {
      let detailsListObj = {};
      setPagedItemData([]);
      if (!!columns && columns.length > 0) {
         detailsListObj = {
            ...detailsListObj,
            columns: _generateDynamicColumn(columns, _onColumnClick, props?.isheaderFilter)
         }
      }
      if (!!props.onItemInvoked) {
         detailsListObj = {
            ...detailsListObj,
            onItemInvoked: props.onItemInvoked
         }
      }
      if (!!props.onSelectionChange) {
         detailsListObj = {
            ...detailsListObj,
            selection: _selection,
            selectionMode: SelectionMode.multiple,
            checkboxVisibility: CheckboxVisibility.always
         }
      }
      else {
         detailsListObj = {
            ...detailsListObj,
            selectionMode: SelectionMode.none
         }
      }
      data.current = {
         ...data.current,
         allColumns: (!!columns && columns.length > 0) ? _generateDynamicColumn(columns, _onColumnClick, props?.isheaderFilter) : [],
         filteredItems: items,
         allItems: items,
         detailsListProps: detailsListObj,
         nextData: nextData,
         currentSortingColumn: columns.filter(item => item.isSorted)[0]
      };
      setGridHeight();
      setPagedItemData(items);
      forceUpdate();
   }, [items, nextData]);

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
   const ClickFilter = (ev?: React.MouseEvent<HTMLElement>, item?: IContextualMenuItem, isBreadCrumClicked?: boolean, isAllData?: boolean): void => {
      if (item) {
         const columns = data.current.allColumns
         columns.filter((matchColumn: any) => matchColumn.key === item.data)
            .forEach((filteredColumn: IColumn) => {
               filteredColumn.isFiltered = true;
            });

         // const documents = data.current.filteredItems;
         const documents = (!!isAllData && isAllData === true) ? data.current.beforefilterData : data.current.filteredItems;
         // const documents = data.current.filteredItems;
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
         data.current = {
            ...data.current,
            beforefilterData: data.current.filteredItems
         }
         const isSameColumn = breadCrumbItems.filter((i: any) => i.value === item.key).length > 0;
         if (!isSameColumn) {
            breadCrumbItems.push({ text: ` ${item.data}: ${item.key}`, key: item.data, onClick: _onBreadcrumbItemClicked, item: item, parent: breadCrumFolderItems.current, number: Math.random(), value: item.key })
         }
         if (isBreadCrumClicked === undefined) {
            breadCrumFolderItems.current = breadCrumbItems;
         }

         setShowResetFilters(true)
         setKeyUpdate(Math.random());
         data.current = {
            ...data.current,
            filteredItems: newDocs,
         };
         setPagedItemData([]);
         setPagedItemData(newDocs);
         // setKeyUpdate(Math.random());
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

      let modifiedDocs: any = data.current.filteredItems; pagedItemData
      // let modifiedDocs: any = pagedItemData;
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
      setPagedItemData([]);
      setPagedItemData(modifiedDocs);
   }
   const _GetFilterValues = (column: any): IContextualMenuItem[] => {

      const filters = GetFilterValues(column, data.current.filteredItems, ClickFilter);
      return filters;
   }

   const _getContextualMenuProps = (ev: React.MouseEvent<HTMLElement>, column: any): IContextualMenuProps => {
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
         target: ev.target as HTMLElement,
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

   const _onClickExportToExcel = React.useCallback(() => {
      try {
         let fileData: any[] = [];
         if (!!columns && columns.length > 0) {
            const rows = data.current?.filteredItems;
            const exportColumns: IExportColumns[] = columns.map(cols => {
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
         nextData: nextData,
         filteredItems: data.current.allItems,
      }
      setShowResetFilters(false)
      setPagedItemData(data.current.allItems);

   }

   const _onAddNewItemClicked = React.useCallback(() => {
      if (props?.addNewItem?.addNewItemClick)
         props?.addNewItem?.addNewItemClick(props?.addNewItem?.addNewItemComponentName);
   }, []);

   const _onSearchTextChange = React.useCallback((text: string | undefined) => {
      const filteredData = onSearch(data.current.allItems, text || "");
      data.current = {
         ...data.current,
         filteredItems: filteredData,
         searchText: text || ""
      };
      forceUpdate();
      setPagedItemData(filteredData);
      setGridHeight();
   }, []);

   return (
      <div className="ms-Grid">
         <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12 ms-xl12 ms-xxl12 ms-xxl12"
               style={{ display: "flex", justifyContent: (_searchAlignment) }}>
               <div style={{ width: "200px" }}>
                  <SearchBox
                     placeholder="Search"
                     onChange={(_, newValue) => _onSearchTextChange(newValue)}
                     value={data.current.searchText}
                  />
               </div>
               {!!props.isExportToExcel && props.isExportToExcel &&
                  <div style={{ paddingLeft: "10px" }}>
                     <PrimaryButton text="Export To Excel" className='btn-primary' onClick={_onClickExportToExcel} />
                  </div>
               }
               {!!props?.addNewItem?.isAddNewItem && props?.addNewItem?.isAddNewItem &&
                  <div style={{ position: "absolute", right: "8px" }}>
                     <PrimaryButton text={props?.addNewItem?.buttonName}
                        className='btn-primary' onClick={_onAddNewItemClicked} />
                  </div>
               }
               {!!importExcel?.isImportExcel && importExcel?.isImportExcel &&
                  <div style={{ position: "absolute", right: "8px", minWidth: "150" }}>
                     <ImportExcel
                        columnsToRead={importExcel?.importFileColumnNames}
                        listName={importExcel?.listName}
                        cancelOrSuccessClick={importExcel?.reloadData} />
                  </div>
               }
            </div>
         </div>
         <div className="ms-Grid-row mt-2">
            <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
               {/* <div>{data.current.filteredItems.length}Count</div> */}
               {showResetFilters &&
                  <>
                     <div className="dataJustifyBetween filterbreadcrumb">
                        <Breadcrumb
                           key={keyUpdate as any}
                           items={breadCrumFolderItems.current}
                           maxDisplayedItems={10}
                           ariaLabel="Breadcrumb with items rendered as buttons"
                           overflowAriaLabel="More links" />
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
               {data.current.filteredItems.length > 0 && _isDisplayScrollablePane &&
                  <div style={{ position: "relative", height: `${heightOfContainer}px` }}>
                     <ScrollablePane initialScrollPosition={0} scrollbarVisibility={ScrollbarVisibility.auto} onScroll={handleScroll} >
                        <ShimmeredDetailsList
                           className="docsWrapper"
                           {...data.current.detailsListProps}
                           items={pagedItemData || []}
                           columns={data.current.allColumns}
                           onRenderDetailsHeader={(detailsHeaderProps: IDetailsHeaderProps, defaultRender: IRenderFunction<IDetailsHeaderProps>) => (
                              <Sticky stickyPosition={StickyPositionType.Both}>
                                 {onDetailListHeaderRender(detailsHeaderProps, defaultRender)}
                              </Sticky>
                           )}
                           constrainMode={ConstrainMode.unconstrained}
                           enableShimmer={isLoading}
                           onShouldVirtualize={() => true}
                           listProps={{
                              onShouldVirtualize: () => true,
                           }}
                        />
                     </ScrollablePane>
                     {!!headerFilterProps && (
                        <ContextualMenu   {...headerFilterProps}
                        />
                     )}
                  </div>
               }
               {data.current.filteredItems.length === 0 &&
                  <NoRecordFound />
               }
            </div>
         </div>
      </div >
   );
}

const customComparator = (prevProps: Readonly<IShimmeredDetailsListProps>, nextProps: Readonly<IShimmeredDetailsListProps>) => {
   return !nextProps.reRenderComponent;
};

export const ShimmerDetailsListComponent = React.memo(ShimmeredDetailsListCAML, customComparator);



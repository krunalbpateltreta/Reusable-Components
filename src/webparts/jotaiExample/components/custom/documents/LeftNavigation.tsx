/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-void */
export interface IProps {
    onLinkClick: any;
    selectedKey: any;
}
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Nav, SearchBox } from '@fluentui/react';
import _debounce from 'lodash/debounce';
import CamlBuilder from 'camljs';
import { IPnPCAMLQueryOptions } from '../../../Service/models/IPnPQueryOptions';
import { ListNames } from '../../../Shared/Enum/ListNames';
import { appGlobalStateAtom } from '../../../jotai/appGlobalStateAtom';
import { useAtom } from 'jotai';
import { ClientFields } from '../clients/ClientFields';
import { getUniueRecordsByColumnName } from '../../../Shared/Utils';

const LeftNavigation: React.FC<IProps> = React.memo(({ onLinkClick, selectedKey }) => {
    const [filterValue, setFilterValue] = useState('');
    const [navItems, setNavItems] = useState<any>([]);
    const [filteredNavItems, setFilteredNavItems] = useState<any>([]);
    const [appGlobalState] = useAtom(appGlobalStateAtom);
    const { provider, context } = appGlobalState;

    function mapData(listItems: any) {
        const sortItems: any[] = listItems?.map((item: any) => {
            const folderName = `${item.ClientCode}-${item.ClientName}`;
            return {
                name: folderName,
                key: folderName,
                url: "#",
                FileRef: folderName,
                filePath: `${context.pageContext.web.serverRelativeUrl}/${ListNames.DMSDocumentsPath}/${folderName}`,
                FileDirRef: `${context.pageContext.web.serverRelativeUrl}/${ListNames.DMSDocumentsPath}`,
                ClientNameId: Number(item.ID),
                ClientName: item.CompanyName
            };
        });
        const sortedItems = sortItems.sort((a: any, b: any) => a?.name?.localeCompare(b?.name));
        setFilteredNavItems((prevItems: any) => [...prevItems, ...sortedItems]);
        setNavItems((prevItems: any) => [...prevItems, ...sortedItems]);
    }


    const loadData = (): void => {
        void (async function (): Promise<void> {
            const camlQuery = new CamlBuilder()
                .View([
                    ClientFields.Id,
                    ClientFields.ID,
                    ClientFields.ClientName,
                    ClientFields.ClientCode,
                    ClientFields.FolderName,
                ])
                .Scope(CamlBuilder.ViewScope.RecursiveAll)
                .RowLimit(1000, true)
                .Query()
                .Where()
                .BooleanField("IsDelete").NotEqualTo(true)
                .OrderBy("FolderName")
                .ToString();

            const pnpQueryOptions: IPnPCAMLQueryOptions = {
                listName: ListNames.Clients,
                queryXML: camlQuery,
                pageToken: ""
            }
            const localResponse = await provider.getItemsInBatchByCAMLQuery(pnpQueryOptions);

            mapData([...getUniueRecordsByColumnName(localResponse?.Row, "ID")]);

            if (!!localResponse.NextHref)
                await loadMoreData();

            async function loadMoreData() {
                let clientsData: any[] = [];
                let isPaged = true;
                let pageToken = localResponse.NextHref.split('?')[1];
                let moreResponse;
                do {
                    const pnpQueryOptions: IPnPCAMLQueryOptions = {
                        listName: ListNames.Clients,
                        queryXML: camlQuery,
                        pageToken: pageToken
                    };
                    moreResponse = await provider.getItemsInBatchByCAMLQuery(pnpQueryOptions);
                    clientsData = [...clientsData, ...moreResponse?.Row];
                    if (!!moreResponse.NextHref) {
                        pageToken = moreResponse.NextHref.split('?')[1];
                    } else {
                        isPaged = false;
                    }
                    mapData(moreResponse?.Row);
                } while (isPaged);
            }
        })();


    };

    useEffect(() => {
        void (async () => {
            loadData();
        })();
    }, []);

    useEffect(() => {
        setFilteredNavItems([]);
        const delayedFiltering = _debounce(() => {
            const filteredItems = navItems?.filter((item: any) =>
                item?.name?.toLowerCase().includes(filterValue.toLowerCase())
            );
            setFilteredNavItems(filteredItems);
        }, 50);
        delayedFiltering();
        return () => delayedFiltering.cancel();
    }, [filterValue]);

    return (
        <div>
            <div className="seachbox">
                <SearchBox
                    className='SlectedClientFolderSearchBox'
                    placeholder="Search Client"
                    value={filterValue}
                    onClear={ev => {
                        setFilteredNavItems(filteredNavItems);
                    }}
                    onChange={(_, newValue: string) => setFilterValue(newValue)}
                />
            </div>
            <div className="scrollable-div">
                <Nav
                    groups={[{
                        links: [
                            {
                                name: 'Documents',
                                expandAriaLabel: 'Expand Home section',
                                url: "",
                                links: filteredNavItems,
                                isExpanded: true,
                            }
                        ]
                    }]}
                    onLinkClick={onLinkClick}
                    selectedKey={selectedKey}
                />
            </div>
        </div>
    );
});

export default LeftNavigation;
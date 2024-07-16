import * as React from "react";
import { Header, INavItem } from "./header/Header";
import { useAtom } from "jotai";
import { appGlobalStateAtom } from "../../jotai/appGlobalStateAtom";
import { IJotaiExampleProps } from "../IJotaiExampleProps";
import { ComponentName } from "../../Shared/Enum/ComponentName";
import { Memoization } from "./dataGrid/Memorized";
import { ViewDocuments } from "../custom/documents/ViewDocuments/ViewDocuments";
import { AddClients } from '../custom/clients/Add/AddClients';
import Dashboards from "../custom/dashboards/Dashboards";
import ClientsList from "../custom/clients/View/ClientsList";
import UploadDocuments from "../custom/documents/UploadDocuments/UploadDocuments";
import { CustomDataGrid } from "./dataGrid/CustomDataGrid";
import HeaderFilter from "../custom/clients/View/HeaderFilter";
import ShimerHeaderFilter from "../custom/clients/View/ShimerHeaderFilter";
import { PDF } from "../custom/PDF";
import { ZodExample } from "./ZodExample/ZodExample";

interface ILoadComponentProps {
    appProps: IJotaiExampleProps;
    componentName: string;
    prevComponentName: string;
    loadComponent: (_componentName: string, _prevComponentName?: string) => void;
}

const LoadComponent = React.memo(({ appProps, componentName, prevComponentName, loadComponent }: ILoadComponentProps): React.ReactNode => {
    const [appGlobalState, setAppGlobalState] = useAtom(appGlobalStateAtom);
    const { provider } = appGlobalState;
    const currentComponent = (): React.ReactNode => {
        switch (componentName) {
            case ComponentName.Dashboard:
                return <React.Fragment>
                    <Dashboards />
                </React.Fragment>
                break;
            case ComponentName.AddDocuments:
                return <React.Fragment>
                    <UploadDocuments
                        successComponentName={ComponentName.ViewDocuments}
                    />
                </React.Fragment>
                break;
            case ComponentName.AddClient:
                return <React.Fragment>
                    <AddClients />
                </React.Fragment>
                break;
            case ComponentName.ViewClient:
                return <React.Fragment>
                    <ClientsList />
                </React.Fragment>
                break;
            case ComponentName.ViewDocuments:
                return <React.Fragment>
                    <ViewDocuments />
                </React.Fragment>
                break;
            case ComponentName.DataGrid:
                return <React.Fragment>
                    <CustomDataGrid />
                </React.Fragment>
                break;
            case ComponentName.MemorizedDataGrid:
                return <React.Fragment>
                    <Memoization />
                </React.Fragment>
                break;
            case ComponentName.HeaderFilter:
                return <React.Fragment>
                    <HeaderFilter />
                </React.Fragment>
                break;
            case ComponentName.ShimmerHeaderFilter:
                return <React.Fragment>
                    <ShimerHeaderFilter />
                </React.Fragment>
                break;
            case ComponentName.KenDoPDF:
                return <React.Fragment>
                    <PDF />
                </React.Fragment>
                break;
            case ComponentName.ZodExample:
                return <React.Fragment>
                    <ZodExample />
                </React.Fragment>
                break;
            default:
                break;
        }
    }

    const navItems: INavItem[] = [
        { name: ComponentName.Dashboard },
        { name: ComponentName.ViewClient, childItems: [ComponentName.AddClient] },
        { name: ComponentName.ViewDocuments },
        {
            name: ComponentName.Master,
            hasChild: true,
            childItems: [
                ComponentName.DataGrid,
                ComponentName.MemorizedDataGrid,
                ComponentName.HeaderFilter,
                ComponentName.ShimmerHeaderFilter,
                ComponentName.KenDoPDF,
                ComponentName.ZodExample
            ]
        },
        { name: ComponentName.AccessDenied }
    ]

    React.useEffect(() => {
        setAppGlobalState({
            ...appGlobalState,
            ...appProps,
            componentName: componentName,
            loadComponent: loadComponent,
            prevComponentName: prevComponentName,
        });
    }, [appProps, componentName]);

    return (
        <React.Fragment>
            <Header
                loadComponent={loadComponent}
                currentView={componentName}
                linkItems={navItems}
            />
            {provider !== undefined && <>
                {currentComponent()}
            </>
            }
        </React.Fragment>
    );
})

export default LoadComponent;
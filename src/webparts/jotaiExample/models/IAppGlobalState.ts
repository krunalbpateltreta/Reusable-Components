import { IJotaiExampleProps } from "../components/IJotaiExampleProps";

export interface IAppGlobalState extends IJotaiExampleProps {
    componentName: string;
    loadComponent: (_componentName: string, _prevComponentName?: string, itemId?: number) => void;
    prevComponentName: string;
    itemId?: number;
    folderPath?: string;
}

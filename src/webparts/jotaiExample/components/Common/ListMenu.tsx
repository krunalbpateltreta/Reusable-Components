import * as React from 'react';
import { IconButton } from '@fluentui/react/lib/Button';
import { ContextualMenuItemType } from '@fluentui/react/lib/ContextualMenu';
import { DialogType, TooltipHost } from '@fluentui/react';
import { useAtomValue } from "jotai";
import { appGlobalStateAtom } from '../../jotai/appGlobalStateAtom';
import { ListNames } from '../../Shared/Enum/ListNames';
import { ModalDialog } from './dialogs/ModalDialog';
import { IFrameDialog } from '@pnp/spfx-controls-react/lib/IFrameDialog';
import { DialogComponent } from './dialogs/DialogComponent';
export interface IListMenuProps {
    itemId: number,
    item: any
    listGUID: string; //ex:"39015dbb-9262-4d1f-baa5-efa5843b6c14" 
    editClick(item: any): any;
    deleteClick(item: any): any

}
export const ListMenu = (props: IListMenuProps) => {
    const appGlobalState = useAtomValue(appGlobalStateAtom);
    const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false)
    const [isDialogOpenView, setIsDialogOpenView] = React.useState<boolean>(false)
    const { provider, context } = appGlobalState;
    const handleClick = async (event: any): Promise<void> => {
        setIsDialogOpen(true)
    };
    const handleClickView = async (event: any): Promise<void> => {
        setIsDialogOpenView(true)
    };
    const getVersionHistoryUrl = (): string => {
        // const { listGUID, itemID }

        return `${context.pageContext.web.absoluteUrl}/_layouts/15/Versions.aspx?list=${props.listGUID}&ID=${props.itemId}&IsDlg=2`;

    };
    const getView = (): string => {
        // const { listGUID, itemID }

        return `${context.pageContext.web.absoluteUrl}/Lists/Clients/DispForm.aspx?ID=${props.itemId}`

    };
    return <>
        <IFrameDialog
            url={getVersionHistoryUrl()}
            hidden={!isDialogOpen}
            onDismiss={() => setIsDialogOpen(false)}
            // modalProps={{
            //     isBlocking: true,
            //     containerClassName: styles.dialogContainer
            // }}
            dialogContentProps={{
                type: DialogType.close,
                showCloseButton: true
            }}
            width={'570px'}
            height='800px'
        />
        <IFrameDialog
            url={getView()}
            hidden={!isDialogOpenView}
            onDismiss={() => setIsDialogOpenView(false)}
            // modalProps={{
            //     isBlocking: true,
            //     containerClassName: styles.dialogContainer
            // }}
            dialogContentProps={{
                type: DialogType.close,
                showCloseButton: true
            }}
            width={'570px'}
            height='800px'
        />


        <TooltipHost content="Show more actions for this item" >
            <IconButton
                id='ContextualMenuButton1'
                text=''
                width='30'
                split={false}
                iconProps={{ iconName: 'MoreVertical' }}
                menuIconProps={{ iconName: '' }}
                menuProps={{
                    shouldFocusOnMount: true,
                    items: [
                        {
                            key: 'action1',
                            name: 'View',
                            iconProps: { iconName: 'RedEye12' },
                            onClick: handleClickView.bind(this)
                        },
                        {
                            key: 'divider_1',
                            itemType: ContextualMenuItemType.Divider
                        },
                        {
                            key: 'action2',
                            name: 'Edit',
                            iconProps: { iconName: 'Edit' },
                            // onClick:  handleClick.bind(this, props.item)
                            onClick: props.editClick.bind(this, props.item)
                        },
                        {
                            key: 'action3',
                            name: 'Delete',
                            iconProps: { iconName: 'delete' },
                            // onClick: handleClick.bind(this, props.item)
                            onClick: props.deleteClick.bind(this, props.item)
                        },
                        {
                            key: 'divider_2',
                            itemType: ContextualMenuItemType.Divider
                        },
                        {
                            key: 'action4',
                            name: 'Version History',
                            iconProps: { iconName: 'StackIndicator' },
                            onClick: handleClick.bind(this, props.item)
                        },
                    ]
                }}
            />
        </TooltipHost>
    </>

}
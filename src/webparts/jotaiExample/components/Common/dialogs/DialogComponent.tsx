import * as React from 'react';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton } from '@fluentui/react/lib/Button';

require("./dialogStyle.css")
interface IDialogComponentProps {
    message: string;
    hideDialog: boolean;
    toggleHideDialog: any;
    dialogHeader: string;
    isSuccess: boolean;
    cancelOrSuccessClick: () => void;
    children?: React.ReactNode;
}

const modelProps = {
    isBlocking: true,
    styles: { main: { maxWidth: 500, minWidth: 450 } },
};

export const DialogComponent: React.FunctionComponent<IDialogComponentProps> = React.memo((props: IDialogComponentProps) => {

    const { message, hideDialog, toggleHideDialog, dialogHeader, isSuccess, cancelOrSuccessClick } = props;
    const dialogContentProps = {
        type: DialogType.largeHeader,
        title: dialogHeader || "Information",
        subText: message
    };

    const closeOnSuccess = () => {
        toggleHideDialog();
        cancelOrSuccessClick();
    }

    return (
        <>
            <Dialog
                hidden={hideDialog}
                onDismiss={toggleHideDialog}
                dialogContentProps={dialogContentProps}
                modalProps={modelProps}
            >
                {props.children}
                <DialogFooter>
                    {isSuccess ?
                        <PrimaryButton onClick={closeOnSuccess} text="Ok" className='btn-primary' />
                        :
                        <PrimaryButton onClick={props.toggleHideDialog} text="Close" className='btn-primary' />
                    }

                </DialogFooter>
            </Dialog>
        </>
    );
});

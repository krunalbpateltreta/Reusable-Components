/* eslint-disable no-void */
import * as React from 'react';
import { useId } from '@fluentui/react-hooks';
import {
    getTheme,
    mergeStyleSets,
    FontWeights,
    Modal,
    IIconProps,
} from '@fluentui/react';
import { IconButton, IButtonStyles } from '@fluentui/react/lib/Button';
require("./dialogStyle.css")

export interface IModalDialogProps {
    header: string;
    isModalOpen: boolean;
    hideModal: () => void;
    dialogWidth: number | string;
    children?: React.ReactNode;
}

const cancelIcon: IIconProps = { iconName: 'Cancel' };
const theme = getTheme();

const iconButtonStyles: Partial<IButtonStyles> = {
    root: {
        color: '#A4262C',
        marginLeft: 'auto',
        marginTop: '4px',
        marginRight: '2px',
    },
    rootHovered: {
        color: theme.palette.neutralDark,
    },
};

export const ModalDialog: React.FunctionComponent<IModalDialogProps> = React.memo((props: IModalDialogProps) => {
    const titleId = useId('title');
    const { isModalOpen, hideModal, dialogWidth } = props;

    const contentStyles = mergeStyleSets({
        container: {
            display: 'flex',
            flexFlow: 'column nowrap',
            alignItems: 'stretch',
            maxWidth: `${dialogWidth ? dialogWidth : "850px"}`,
            minWidth: "800px",
            width: `${dialogWidth ? dialogWidth : "850px"}`
        },
        header: [
            theme.fonts.xLargePlus,
            {
                flex: '1 1 auto',
                borderTop: `4px solid #A4262C`,
                color: '#A4262C',
                display: 'flex',
                alignItems: 'center',
                fontWeight: FontWeights.semibold,
                padding: '12px 12px 14px 24px',
            },
        ],
        heading: {
            color: '#A4262C',
            fontWeight: FontWeights.semibold,
            fontSize: 'inherit',
            margin: '0',
        },
        body: {
            flex: '4 4 auto',
            padding: '0 24px 24px 24px',
            overflowY: 'hidden',
            selectors: {
                p: { margin: '14px 0' },
                'p:first-child': { marginTop: 0 },
                'p:last-child': { marginBottom: 0 },
            },
        },
    });

    return (
        <div>
            <Modal
                titleAriaId={titleId}
                isOpen={isModalOpen}
                onDismiss={hideModal}
                isBlocking={false}
                containerClassName={contentStyles.container}
                dragOptions={undefined}
            >
                <div className={contentStyles.header}>
                    <h2 className={contentStyles.heading} id={titleId}>
                        {props.header}
                    </h2>
                    <IconButton
                        styles={iconButtonStyles}
                        iconProps={cancelIcon}
                        ariaLabel="Close popup modal"
                        onClick={hideModal}
                    />
                </div>
                <div className={contentStyles.body}>
                    <div className="ms-SPLegacyFabricBlock">
                        {props.children}
                    </div>
                </div>
            </Modal>
        </div>
    );
});



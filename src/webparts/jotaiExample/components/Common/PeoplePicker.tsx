import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react'
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
type Props = {
    context: WebPartContext;
    selectedItems: any[];
    label: string;
    _getPeoplePickerItems: (items: any[]) => void;
}

export const CustomPeoplePicker: React.FC<Props> = React.memo(({ selectedItems, context, label, _getPeoplePickerItems }) => {
    return (
        <PeoplePicker
            context={context as any}
            titleText={label}
            personSelectionLimit={3}
            groupName={""} // Leave this blank in case you want to filter from all users
            showtooltip={true}
            required={true}
            disabled={false}
            defaultSelectedUsers={selectedItems.map((item) => item)}
            searchTextLimit={2}
            onChange={_getPeoplePickerItems}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000}
            ensureUser={true}
        />
    )
})


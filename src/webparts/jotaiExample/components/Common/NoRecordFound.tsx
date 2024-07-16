import * as React from "react";
import { Stack, Text } from "@fluentui/react";

export const NoRecordFound = React.memo(() => {
    return (
        <Stack horizontalAlign='center' className='noRecordFound'>
            <Text>No record found</Text>
        </Stack>
    );
});

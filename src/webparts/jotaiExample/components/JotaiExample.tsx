/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import 'office-ui-fabric-react/dist/css/fabric.css';
require("../assets/css/style.css");
const _data = require("../../../../config/package-solution.json");
import { IJotaiExampleProps } from './IJotaiExampleProps';
import { tenantNames } from '../Shared/constants/Constants';

import { Provider } from 'jotai';
import LoadComponent from './Common/ComponentContainer';
import { ComponentName } from '../Shared/Enum/ComponentName';


export const JotaiExample = (props: IJotaiExampleProps) => {
  const [componentToLoad, setComponentToLoad] = React.useState<string>(ComponentName.Dashboard);
  const [prevComponent, setPrevComponent] = React.useState<string>("");

  React.useEffect(() => {
    try {
      console.log("Package solution Version:- ", _data.solution.version);
    } catch (error) {
      console.error('Error parsing package solution JSON:', error);
    }
    try {
      const siteUrl: string = props.context.pageContext.web.absoluteUrl;
      if (!!siteUrl) {
        const urlParts = siteUrl.replace(/^https?:\/\//, '').split('.');
        const foundTenantName = urlParts[0];
        const isValidTenant = tenantNames.filter((item: string) => item.toLowerCase() === foundTenantName.toLowerCase()).length > 0;
        if (!isValidTenant) {
          setComponentToLoad("AccessDenied")
          console.log("Access Denied");
        }
      }
    } catch (error) {
      console.error('Error parsing Tenant Names:', error);
    }
  }, []);

  const loadComponent = (_componentName: string, _prevComponentName?: string) => {
    setComponentToLoad(_componentName);
    setPrevComponent(_prevComponentName || "");
  }

  return (
    <React.Fragment>
      <Provider>
        <LoadComponent
          appProps={props}
          componentName={componentToLoad}
          loadComponent={loadComponent}
          prevComponentName={prevComponent}
        />
      </Provider>
    </React.Fragment>
  )
}
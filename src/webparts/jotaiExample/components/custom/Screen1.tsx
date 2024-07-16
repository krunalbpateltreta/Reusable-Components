import * as React from 'react';
import { useAtom } from 'jotai';
import { appGlobalStateAtom } from '../../jotai/appGlobalStateAtom';
import { PrimaryButton } from '@fluentui/react';
type Props = {}

export const Screen1 = (props: Props) => {
  const [appGlobalState, setAppGlobalState] = useAtom(appGlobalStateAtom);
  React.useEffect(() => {
    console.log("Screen 1 loaded");
  }, []);

  const setNewComponentName = () => {
    setAppGlobalState({ ...appGlobalState, componentName: "Screen 1" });
  }
  return (
    <div className="boxCard">
      <div className="formGroup" >
        <h1 className="mainTitle" style={{ textAlign: "left" }}>Screen 1</h1>
        <h5>Welcome : {appGlobalState?.currentUser?.displayName}</h5>
        <h5>{appGlobalState.componentName}</h5>
        <PrimaryButton onClick={setNewComponentName} text='Set New Component Name' />
      </div>
    </div>
  )
}


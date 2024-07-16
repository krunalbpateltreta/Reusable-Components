import { useAtomValue } from 'jotai';
import React from 'react'
import { appGlobalStateAtom } from '../../jotai/appGlobalStateAtom';

type Props = {}

export const Screen2 = (props: Props) => {
  const appGlobalState = useAtomValue(appGlobalStateAtom);
  React.useEffect(() => {
    console.log("Screen 2s loaded");
  }, []);

  return (
    <div className="boxCard">
      <div className="formGroup" >
        <h1 className="mainTitle" style={{ textAlign: "left" }}>Screen 2</h1>
        <h5>Welcome : {appGlobalState?.currentUser?.displayName}</h5>
        <h5>{appGlobalState?.componentName}</h5>
      </div>
    </div>
  )
}

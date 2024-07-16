import * as React from "react";

const AccessDenied: React.FunctionComponent = () => {
    return (
        <React.Fragment>
            <div className="boxCard">
                <div className="formGroup" >
                    <h1 className="mainTitle" style={{ textAlign: "left" }}>Access Denied</h1>
                    <br />
                    <h3>You do not have access to this page!</h3>
                </div>
            </div>
        </React.Fragment>
    )

}

export default AccessDenied;
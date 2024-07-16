import { HoverCard, HoverCardType, IPlainCardProps, Link, TeachingBubble, TooltipHost, mergeStyles } from "@fluentui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useId, useBoolean } from "@uifabric/react-hooks";
import * as React from "react";
import { appGlobalStateAtom } from "../../../jotai/appGlobalStateAtom";
import { useAtom } from "jotai";
export interface INavItem {
    name: string;
    hasChild?: boolean;
    childItems?: string[];
}

export interface IHeaderComponentProps {
    loadComponent: (_componentName: string, _prevComponentName?: string, itemId?: number) => void;
    currentView: string;
    linkItems: INavItem[];
}

export const Header = React.memo(({ loadComponent, currentView, linkItems }: IHeaderComponentProps) => {
    const tooltipId = useId('tooltip');
    const buttonId = useId('button');
    const [teachingBubbleVisible, { toggle: toggleTeachingBubbleVisible }] = useBoolean(false);
    const [appglobalState] = useAtom(appGlobalStateAtom);
    const { context, currentUser } = appglobalState;
    const pageURL = context?.pageContext.web.absoluteUrl;
    const itemClass = mergeStyles({
        selectors: {
        },
        height: "125px",
        width: "320px"
    });

    const onRenderPlainCard = (): JSX.Element => {
        return <div className={itemClass} >
            <div className="ms-SPLegacyFabricBlock">
                <div className="ms-Grid">
                    <div className="ms-Grid-row">
                        {currentUser?.isAdmin ?
                            <React.Fragment>
                                <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg6 ">
                                    <div className="dflex">
                                        <Link className="actionBtn btnView dticon" target="_blank" rel="noopenernoreferrer"
                                            onClick={() => { window.open(`${pageURL}/_layouts/15/settings.aspx`, '_blank'); }}  >
                                            <TooltipHost
                                                content={"Site Setting"}
                                                id={tooltipId}
                                            >
                                                <FontAwesomeIcon className="quickImg " icon={"gear"} />
                                            </TooltipHost>
                                        </Link>
                                        <Link className="actionBtn btnView dticon" target="_blank" rel="noopenernoreferrer"
                                            onClick={() => { window.open(`${pageURL}/_layouts/15/viewlsts.aspx`, '_blank'); }}   >
                                            <TooltipHost
                                                content={"Site Content"}
                                                id={tooltipId}
                                            >
                                                <FontAwesomeIcon className="quickImg " icon={"bars"} />
                                            </TooltipHost>

                                        </Link>
                                    </div>
                                </div>
                                <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg6 justifyright ">
                                    <a href={`https://login.windows.net/common/oauth2/logout?post_logout_redirect_uri=${pageURL}`}>
                                        <button style={{ height: "40px", border: "0px", background: "rgba(0,0,0,.08)" }}>
                                            Sign out
                                        </button>
                                    </a>
                                </div>
                            </React.Fragment>
                            : <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12 justifyright ">
                                <a href={`https://login.windows.net/common/oauth2/logout?post_logout_redirect_uri=
                                ${pageURL}`}>
                                    <button style={{ height: "40px", border: "0px", background: "rgba(0,0,0,.08)" }}>
                                        Sign out
                                    </button>
                                </a>
                            </div>
                        }
                        <div className="userHover">
                            <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg4">
                                <img src={window.location.origin + "/_layouts/15/userPhoto.aspx?accountName=" +
                                    currentUser?.email + "&Size=l"} className="user-picHover" alt="user" />
                            </div>
                            <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg8 mt-20">
                                <div className="ms-Grid">
                                    <div className="ms-Grid-row">
                                        <div className="ms-Grid-col ms-sm12 ms-md8 ms-lg12 ">
                                            <div className="truncate" style={{ fontSize: "18px", fontWeight: "700" }}>
                                                {currentUser?.displayName}</div>
                                        </div>
                                        <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12 ">
                                            <TooltipHost content={currentUser.email} id={tooltipId}>
                                                <div className="truncate">{currentUser.email}</div>
                                            </TooltipHost>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div>
        </div >
    };

    const plainCardProps: IPlainCardProps = {
        onRenderPlainCard: onRenderPlainCard,
    };

    return (
        <div>
            {teachingBubbleVisible && (
                <TeachingBubble
                    target={`#${buttonId}`}
                    onDismiss={toggleTeachingBubbleVisible}
                >
                    {onRenderPlainCard()}
                </TeachingBubble>
            )}
            <nav className="nav fixedTop">
                <div className="navHeader">
                    <div className="navBrand">
                        <div className="brandLogo">
                            <span className="m-l-10">Jotai Example & Reusable Component Solution</span>
                        </div>
                    </div>
                </div>
                <div className="nav-btn">
                    <label htmlFor="nav-check">
                        <span />
                        <span />
                        <span />
                    </label>
                </div>
                <div className="navbarCollapse">
                    <ul className="navList">
                        {linkItems?.map((navItem: INavItem, index: number) => {
                            return <>
                                {navItem.hasChild ?
                                    <li key={`nav${index}`} className={(currentView === navItem.name || (navItem.childItems && navItem.childItems?.filter(item => item === currentView).length > 0)) ? 'active' : ''}>
                                        <div className="dropdown">
                                            {navItem.name}<FontAwesomeIcon icon={"caret-down"} style={{ marginLeft: "5px" }} />
                                            <ul className="dropdown-content" id="myDropdown">
                                                {navItem.childItems?.map((item: string, index: number) => {
                                                    return <li key={`nav-child${index}`} className={currentView === item ? 'active' : ''}>
                                                        <a onClick={() => loadComponent(item)}>{item}</a>
                                                    </li>
                                                })}
                                            </ul>
                                        </div>
                                    </li>
                                    :
                                    <li key={`nav${index}`} className={(currentView === navItem.name || (navItem.childItems && navItem.childItems?.filter(item => item === currentView).length > 0)) ? 'active' : ''}>
                                        <a onClick={() => loadComponent(navItem.name)}>{navItem.name}</a>
                                    </li>
                                }
                            </>
                        })
                        }
                    </ul >
                </div>
                {false && <div className="userDropdownItem">
                    <HoverCard plainCardProps={plainCardProps} instantOpenOnClick type={HoverCardType.plain}>
                        <img src={window.location.origin + "/_layouts/15/userPhoto.aspx?accountName=" + currentUser?.email + "&Size=S"} className="user-pic" alt="user" />
                    </HoverCard>

                </div>}
                <div className="userDropdownItem" onClick={() => toggleTeachingBubbleVisible()}>
                    <img id={buttonId} src={window.location.origin + "/_layouts/15/userPhoto.aspx?accountName=" + currentUser?.email + "&Size=S"}
                        className="user-pic" alt="user" />
                </div>
            </nav >
        </div >
    );
});
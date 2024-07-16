import React from "react"
import { generateAndSaveKendoPDF } from "../../Shared/Utils"
import { PrimaryButton } from "@fluentui/react"
require('../../assets/css/custome.css')

export const PDF = () => {

    const onClickPrint = async () => {
        generateAndSaveKendoPDF("pdfGenerate", "dummy")
    }


    return <div className="boxCard">

        <PrimaryButton text='Print' onClick={onClickPrint} style={{ fontSize: "16px" }} />
        <div id="pdfGenerate" className="upcommingBox_31b3d301 mb3_31b3d301">
            <div className="spRow_31b3d301 alignItemsEnd_31b3d301">
                <div className="txtcenter">
                    <h2>
                        <b>
                            <label htmlFor="formBasicTitle">APM Terminals Mumbai</label>
                        </b>
                    </h2>
                    <h3>
                        <b>
                            <label htmlFor="formBasicTitle">CIVIL WORK PERMIT</label>
                        </b>
                    </h3>
                    <div>
                        <b>
                            <label htmlFor="formBasicTitle">
                                (To be filled in quadruplicate copy)
                            </label>
                        </b>
                    </div>
                    <div>
                        <b>
                            <label htmlFor="formBasicTitle">
                                ((In case of Hot work/Excavation/confined space/height work,
                                separate permit is required))
                            </label>
                        </b>
                    </div>
                </div>
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-xl2">
                            <b>
                                <label htmlFor="formBasicTitle">Note:</label>
                            </b>
                        </div>
                        <div className="ms-Grid-col ms-sm110 ms-xl10">
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-sm12 ms-xl12">
                                    <b>
                                        <label htmlFor="formBasicTitle">
                                            1. Permit must be deemed CANCELLED in case of emergency
                                            situation.
                                        </label>
                                    </b>
                                </div>
                            </div>
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-sm12 ms-xl12">
                                    <b>
                                        <label htmlFor="formBasicTitle">
                                            2. Mark clearly Yes/No/NA in front of each check point.
                                        </label>
                                    </b>
                                </div>
                            </div>
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-sm12 ms-xl12">
                                    <b>
                                        <label htmlFor="formBasicTitle" className="mgbtn15">
                                            3.Permit copy to be submitted to Operations Shift Manager,
                                            Engineering Shift Incharge &amp; HSSE.
                                        </label>
                                    </b>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brleft brright brbottom brtop">
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-sm12 ms-xl12">
                                    <b>
                                        <label htmlFor="formBasicTitle">GTI Contact</label>
                                    </b>
                                </div>
                            </div>
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-sm12 ms-xl12">
                                    <b>
                                        <label htmlFor="formBasicTitle">Numbers</label>
                                    </b>
                                </div>
                            </div>
                        </div>
                        <div className="ms-Grid-col ms-sm13 ms-xl3 brbottom brtop brright">
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-sm12 ms-xl12">
                                    <b>
                                        <label htmlFor="formBasicTitle">Operations Shift Manger</label>
                                    </b>
                                </div>
                            </div>
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-sm12 ms-xl12">
                                    <label htmlFor="formBasicTitle">
                                        022 -62971082 /8657454264/9653283831
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="ms-Grid-col ms-sm13 ms-xl3 brright brbottom brtop">
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-sm12 ms-xl12">
                                    <b>
                                        <label htmlFor="formBasicTitle">
                                            Engineering Shift In-charge
                                        </label>
                                    </b>
                                </div>
                            </div>
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-sm12 ms-xl12">
                                    <label htmlFor="formBasicTitle">
                                        022 - 62971133 /9821633572/9653282630
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brright brbottom brtop">
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-sm12 ms-xl12">
                                    <b>
                                        <label htmlFor="formBasicTitle">Security Shift Executive</label>
                                    </b>
                                </div>
                            </div>
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-sm12 ms-xl12">
                                    <label htmlFor="formBasicTitle">
                                        022 - 62971136 /9821816048{" "}
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brright brbottom brtop">
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-sm12 ms-xl12">
                                    <b>
                                        <label htmlFor="formBasicTitle">Paramedic on Shift</label>
                                    </b>
                                </div>
                            </div>
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-sm12 ms-xl12">
                                    <label htmlFor="formBasicTitle">
                                        022 - 62971136 /9821669309{" "}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brleft brright brbottom">
                            <b>
                                <label htmlFor="formBasicTitle">Work Permit</label>
                            </b>
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brbottom brright">
                            <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                Civil Work Permit
                            </label>
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brbottom brright">
                            <b>
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    Date{" "}
                                </label>
                            </b>
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brbottom brright">
                            <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                01-01-2024
                            </label>
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brright brbottom">
                            <b>
                                <label htmlFor="formBasicTitle">Applicant</label>
                            </b>
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brright brbottom">
                            <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                Krunal Patel
                            </label>
                        </div>
                    </div>
                </div>
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brleft brright brbottom">
                            <b>
                                <label htmlFor="formBasicTitle">From</label>
                            </b>
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brbottom brright">
                            <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                2:00 PM
                            </label>
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brbottom brright">
                            <b>
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    To{" "}
                                </label>
                            </b>
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brbottom brright">
                            <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                4:00 PM
                            </label>
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brright brbottom">
                            <b>
                                <label htmlFor="formBasicTitle">Area</label>
                            </b>
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brright brbottom">
                            <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                Vapi
                            </label>
                        </div>
                    </div>
                </div>
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brleft brright brbottom">
                            <b>
                                <label htmlFor="formBasicTitle">Contractor</label>
                            </b>
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brright brbottom">
                            <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                ffsd
                            </label>
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brright brbottom">
                            <b>
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    No of Person
                                </label>
                            </b>
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brright brbottom">
                            <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                2
                            </label>
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-xl2 " />
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brright" />
                    </div>
                </div>
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brleft brbottom brright">
                            <b>
                                <label htmlFor="formBasicTitle">Location</label>
                            </b>
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brright brbottom">
                            <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                MG Rd
                            </label>
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brright brbottom">
                            <b>
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    Contact Number{" "}
                                </label>
                            </b>
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brright brbottom">
                            <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                9638521475
                            </label>
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brbottom" />
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brright brbottom" />
                    </div>
                </div>
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brleft brright brbottom">
                            <b>
                                <label htmlFor="formBasicTitle">Job Description</label>
                            </b>
                        </div>
                        <div className="ms-Grid-col ms-sm10 ms-xl10 brright brbottom">
                            <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                gf
                            </label>
                        </div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brleft brright brbottom">
                            <b>
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    Equipment to be used{" "}
                                </label>
                            </b>
                        </div>
                        <div className="ms-Grid-col ms-sm10 ms-xl10 brright brbottom">
                            <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                gh
                            </label>
                        </div>
                    </div>
                </div>
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brleft brright">
                            <b>
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    Check List{" "}
                                </label>
                            </b>
                        </div>
                        <div className="ms-Grid-col ms-sm8 ms-xl8 brright brbottom">
                            <div className="mb3_31b3d301 colMd8_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    {" "}
                                    Work area barricaded with concrete blocks and Warning tapes.
                                </label>
                            </div>
                        </div>
                        <div className="ms-Grid-col ms-sm2 ms-xl2 brright brbottom">
                            <div className="mb3_31b3d301 colMd2_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    No{" "}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brleft brright">
                            <div className="mb3_31b3d301 colMd2_31b3d301" />
                        </div>
                        <div className="ms-Grid-col ms-sm8 ms-xl8 brright brbottom">
                            <div className="mb3_31b3d301 colMd8_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    {" "}
                                    Met at work/Traffic diversion sign boards placed at required
                                    location.
                                </label>
                            </div>
                        </div>
                        <div className="ms-Grid-col ms-sm2 ms-xl2 brright brbottom">
                            <div className="mb3_31b3d301 colMd2_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    Yes{" "}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brleft brright">
                            <div className="mb3_31b3d301 colMd2_31b3d301" />
                        </div>
                        <div className="ms-Grid-col ms-sm8 ms-xl8 brright brbottom">
                            <div className="mb3_31b3d301 colMd8_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    {" "}
                                    Solar blinkers placed at both ends of traffic flow.
                                </label>
                            </div>
                        </div>
                        <div className="ms-Grid-col ms-sm2 ms-xl2 brright brbottom">
                            <div className="mb3_31b3d301 colMd2_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    Yes{" "}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brleft brright">
                            <div className="mb3_31b3d301 colMd2_31b3d301" />
                        </div>
                        <div className="ms-Grid-col ms-sm8 ms-xl8 brright brbottom">
                            <div className="mb3_31b3d301 colMd8_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    {" "}
                                    Drain pits/equipment within 10 meters covered and protected.
                                </label>
                            </div>
                        </div>
                        <div className="ms-Grid-col ms-sm2 ms-xl2 brright brbottom">
                            <div className="mb3_31b3d301 colMd2_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    Yes{" "}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brleft brright">
                            <div className="mb3_31b3d301 colMd2_31b3d301" />
                        </div>
                        <div className="ms-Grid-col ms-sm8 ms-xl8 brright brbottom">
                            <div className="mb3_31b3d301 colMd8_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    {" "}
                                    Road block clearance taken from concerned area in charge.
                                </label>
                            </div>
                        </div>
                        <div className="ms-Grid-col ms-sm2 ms-xl2 brright brbottom">
                            <div className="mb3_31b3d301 colMd2_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    Yes{" "}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brleft brright">
                            <div className="mb3_31b3d301 colMd2_31b3d301" />
                        </div>
                        <div className="ms-Grid-col ms-sm8 ms-xl8 brright brbottom">
                            <div className="mb3_31b3d301 colMd8_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    {" "}
                                    Workers received safety Toolbox briefing.
                                </label>
                            </div>
                        </div>
                        <div className="ms-Grid-col ms-sm2 ms-xl2 brright brbottom">
                            <div className="mb3_31b3d301 colMd2_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    No{" "}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brleft brright">
                            <div className="mb3_31b3d301 colMd2_31b3d301" />
                        </div>
                        <div className="ms-Grid-col ms-sm8 ms-xl8 brright brbottom">
                            <div className="mb3_31b3d301 colMd8_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    {" "}
                                    ABC/DCP fire extinguisher placed at work location.
                                </label>
                            </div>
                        </div>
                        <div className="ms-Grid-col ms-sm2 ms-xl2 brright brbottom">
                            <div className="mb3_31b3d301 colMd2_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    Yes{" "}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brleft brright">
                            <div className="mb3_31b3d301 colMd2_31b3d301" />
                        </div>
                        <div className="ms-Grid-col ms-sm8 ms-xl8 brright brbottom">
                            <div className="mb3_31b3d301 colMd8_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    {" "}
                                    Others
                                </label>
                            </div>
                        </div>
                        <div className="ms-Grid-col ms-sm2 ms-xl2 brright brbottom">
                            <div className="mb3_31b3d301 colMd2_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    Yes{" "}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brleft brright">
                            <div className="mb3_31b3d301 colMd2_31b3d301" />
                        </div>
                        <div className="ms-Grid-col ms-sm8 ms-xl8 brright brbottom">
                            <div className="mb3_31b3d301 colMd8_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    {" "}
                                    Helmet, Safety shoes &amp; Boiler suit with reflective tapes/
                                    Reflective vest
                                </label>
                            </div>
                        </div>
                        <div className="ms-Grid-col ms-sm2 ms-xl2 brright brbottom">
                            <div className="mb3_31b3d301 colMd2_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    Yes{" "}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brleft brright">
                            <div className="mb3_31b3d301 colMd2_31b3d301" />
                        </div>
                        <div className="ms-Grid-col ms-sm8 ms-xl8 brright brbottom">
                            <div className="mb3_31b3d301 colMd8_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    {" "}
                                    Safety Goggle/Face shield
                                </label>
                            </div>
                        </div>
                        <div className="ms-Grid-col ms-sm2 ms-xl2 brright brbottom">
                            <div className="mb3_31b3d301 colMd2_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    Yes{" "}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brleft brright">
                            <div className="mb3_31b3d301 colMd2_31b3d301" />
                        </div>
                        <div className="ms-Grid-col ms-sm8 ms-xl8 brright brbottom">
                            <div className="mb3_31b3d301 colMd8_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    {" "}
                                    Hand gloves
                                </label>
                            </div>
                        </div>
                        <div className="ms-Grid-col ms-sm2 ms-xl2 brright brbottom">
                            <div className="mb3_31b3d301 colMd2_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    Yes{" "}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brleft brright">
                            <div className="mb3_31b3d301 colMd2_31b3d301" />
                        </div>
                        <div className="ms-Grid-col ms-sm8 ms-xl8 brright brbottom">
                            <div className="mb3_31b3d301 colMd8_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    {" "}
                                    Safety belt
                                </label>
                            </div>
                        </div>
                        <div className="ms-Grid-col ms-sm2 ms-xl2 brright brbottom">
                            <div className="mb3_31b3d301 colMd2_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    Yes{" "}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brleft brright">
                            <div className="mb3_31b3d301 colMd2_31b3d301" />
                        </div>
                        <div className="ms-Grid-col ms-sm8 ms-xl8 brright brbottom">
                            <div className="mb3_31b3d301 colMd8_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    {" "}
                                    Gas/ Dust mask
                                </label>
                            </div>
                        </div>
                        <div className="ms-Grid-col ms-sm2 ms-xl2 brright brbottom">
                            <div className="mb3_31b3d301 colMd2_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    Yes{" "}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brleft brright brbottom">
                            <div className="mb3_31b3d301 colMd2_31b3d301" />
                        </div>
                        <div className="ms-Grid-col ms-sm8 ms-xl8 brright brbottom">
                            <div className="mb3_31b3d301 colMd8_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    {" "}
                                    Life Jacket
                                </label>
                            </div>
                        </div>
                        <div className="ms-Grid-col ms-sm2 ms-xl2 brright brbottom">
                            <div className="mb3_31b3d301 colMd2_31b3d301">
                                <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                    Yes{" "}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brleft brright brbottom">
                            <b>
                                <label htmlFor="formBasicTitle">Approver History</label>
                            </b>
                        </div>
                        <div className="ms-Grid-col ms-sm10 ms-xl10 brright brbottom">
                            <div className="ms-Grid" dir="ltr">
                                <div className="ms-Grid-row p10">
                                    <div className="ms-Grid-col ms-sm4 ms-xl4 brleft brright brbottom brtop">
                                        <b>
                                            <label htmlFor="formBasicTitle">Approver</label>
                                        </b>
                                    </div>
                                    <div className="ms-Grid-col ms-sm4 ms-xl4 brright brbottom brtop">
                                        <b>
                                            <label
                                                className="formLabel_31b3d301"
                                                htmlFor="formBasicTitle"
                                            >
                                                Approved/Rejected Date
                                            </label>
                                        </b>
                                    </div>
                                    <div className="ms-Grid-col ms-sm4 ms-xl4 brright brbottom brtop">
                                        <b>
                                            <label
                                                className="formLabel_31b3d301"
                                                htmlFor="formBasicTitle"
                                            >
                                                Status
                                            </label>
                                        </b>
                                    </div>
                                    <div className="ms-Grid-col ms-sm4 ms-xl4 brleft brright brbottom">
                                        <label htmlFor="formBasicTitle">Shift InCharge</label>
                                    </div>
                                    <div className="ms-Grid-col ms-sm4 ms-xl4 brright brbottom">
                                        <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                            29-12-2023 4:41 PM
                                        </label>
                                    </div>
                                    <div className="ms-Grid-col ms-sm4 ms-xl4 brright brbottom">
                                        <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                            Approved
                                        </label>
                                    </div>
                                    <div className="ms-Grid-col ms-sm4 ms-xl4 brleft brright brbottom">
                                        <label htmlFor="formBasicTitle">Shift Manager</label>
                                    </div>
                                    <div className="ms-Grid-col ms-sm4 ms-xl4 brright brbottom">
                                        <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                            29-12-2023 4:57 PM
                                        </label>
                                    </div>
                                    <div className="ms-Grid-col ms-sm4 ms-xl4 brright brbottom">
                                        <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                            Approved
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-xl2 brleft brright brbottom">
                            <b>
                                <label htmlFor="formBasicTitle">Extension History</label>
                            </b>
                        </div>
                        <div className="ms-Grid-col ms-sm10 ms-xl10 brright brbottom">
                            <div className="ms-Grid" dir="ltr">
                                <div className="ms-Grid-row p10">
                                    <div className="ms-Grid-col ms-sm4 ms-xl4 brleft brright brbottom brtop">
                                        <b>
                                            <label htmlFor="formBasicTitle">Approver</label>
                                        </b>
                                    </div>
                                    <div className="ms-Grid-col ms-sm4 ms-xl4 brright brbottom brtop">
                                        <b>
                                            <label
                                                className="formLabel_31b3d301"
                                                htmlFor="formBasicTitle"
                                            >
                                                Approved/Rejected Date
                                            </label>
                                        </b>
                                    </div>
                                    <div className="ms-Grid-col ms-sm4 ms-xl4 brright brbottom brtop">
                                        <b>
                                            <label
                                                className="formLabel_31b3d301"
                                                htmlFor="formBasicTitle"
                                            >
                                                Status
                                            </label>
                                        </b>
                                    </div>
                                    <div className="ms-Grid-col ms-sm4 ms-xl4 brleft brright brbottom">
                                        <label htmlFor="formBasicTitle">Shift InCharge</label>
                                    </div>
                                    <div className="ms-Grid-col ms-sm4 ms-xl4 brright brbottom">
                                        <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                            29-12-2023 5:06 PM
                                        </label>
                                    </div>
                                    <div className="ms-Grid-col ms-sm4 ms-xl4 brright brbottom">
                                        <label className="formLabel_31b3d301" htmlFor="formBasicTitle">
                                            Extension-Rejected
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </div>
}
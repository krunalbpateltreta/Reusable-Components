import { useAtomValue } from 'jotai';
import * as React from 'react'
import { appGlobalStateAtom } from '../../jotai/appGlobalStateAtom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type Props = {}

const Home = (props: Props) => {
    const appGlobalState = useAtomValue(appGlobalStateAtom);
    React.useEffect(() => {
        console.log("Screen 1 loaded");
    }, []);

    const printToPdf = () => {
        const input = document.getElementById('printArea');
        if (input) {
            html2canvas(input, { scale: 2 })
                .then((canvas) => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('p', 'mm', 'a4');

                    const imgWidth = 210; // A4 width in mm
                    const pageHeight = 297; // A4 height in mm
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    let heightLeft = imgHeight;

                    let position = 0;

                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;

                    while (heightLeft >= 0) {
                        position = heightLeft - imgHeight;
                        pdf.addPage();
                        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                        heightLeft -= pageHeight;
                    }

                    pdf.save('download.pdf');
                })
                .catch((error) => {
                    console.error('Error generating PDF: ', error);
                });
        }
    };
    return (
        <div className="boxCard" id="printArea">
            <div className="formGroup" >
                <h1 className="mainTitle" style={{ textAlign: "left" }}>Dashboard</h1>
                <h5>Welcome : {`${appGlobalState?.currentUser?.displayName} - (${appGlobalState?.currentUser?.email})`}</h5>
                <button onClick={printToPdf}>{"Print"}</button>
            </div>
        </div>
    )
}

export default Home
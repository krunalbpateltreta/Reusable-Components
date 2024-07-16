var _exportToPDFKendo = function(domElementId, ttfFont) {
    var dfd = jQuery.Deferred();
    try {
        var ttfPath = ttfFont
        kendo.pdf.defineFont({
            "Helvetica": ttfFont,
        });
        $("#" + domElementId).find(".noExport").remove();
    } catch (ex) {

    }
    kendo.drawing
        .drawDOM("#" + domElementId, {
            forcePageBreak: ".page-break",
            paperSize: "A4",
            margin: {
                top: "0.1in",
                bottom: "0.1in",
                left: "0.1in",
                right: "0.1in"
            },
            //margin: "2cm",
            multiPage: false,
            //scale: 0.6,
            scale: 0.5,
            keepTogether: ".keep-together"
        })
        .then(function(group) {
            kendo.drawing.pdf.toBlob(group, function(blob) {
                dfd.resolve(blob);
            });
        });
    return dfd.promise();
}

export const exportToPDFKendo = _exportToPDFKendo;
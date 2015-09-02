/**
 * Created by michal on 02.09.15.
 */
myModule.factory('PlotTooltipService', function (AppConfig) {
    /**
     *
     * @param {jQuery} plot_container
     */
    var PlotTooltipService = function (plot_container) {

        /* Find tooltip element if exist or create one */
        var tooltip = $('#tooltip');
        if (!tooltip.length){
            tooltip = $("<div id='tooltip'></div>");
            // tooltip
            tooltip.css({
                position: "absolute",
                display: "none",
                border: "1px solid #fdd",
                padding: "5px",
                "background-color": "#fee",
                opacity: 0.90,
                "border-radius": "10px"
            }).appendTo("#viewContainer");
        }





        plot_container.bind("plothover", function (event, pos, item) {
            if (item) {
                var time = item.datapoint[0],
                    temp = item.datapoint[1].toFixed(1);

                var d = new Date(time);
                d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);

                var h = d.getHours(),
                    m = d.getMinutes();

                var stringDate = h + ":" + (m < 10 ? '0' : '') + m;

                tooltip.html(item.series.label + ': ' + temp + ' C at ' + stringDate)
                    .css({top: item.pageY + 20, left: item.pageX + 20})
                    .show();
            }
            else {
                tooltip.hide();
            }

        });
    };
    return PlotTooltipService;
});

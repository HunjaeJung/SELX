var gauge = {
	setGenerationGauge : function (max, value) {
		var chart = $('#container-generation').highcharts();
		this.updateChart (chart, max, value);
	},
	setConsumptionGauge : function (max, value) {
		var chart = $('#container-consumption').highcharts();
		this.updateChart (chart, max, value);
	},
	updateChart : function (chart, max, value) {
		var point = chart.series[0].points[0];
		chart.yAxis[0].setExtremes(0,max);
		point.update(value);
	},
	setBatteryGauge : function (max, value) {
		var percentage = value / max * 100;
		percentage = percentage.toFixed(1) + "%";
		$("#bat-percent").html(percentage);
		$("#bat-current").html(value);
		$("#bat-capacity").html(max);
		$("#battery-bar").css({width:percentage});
	}
}
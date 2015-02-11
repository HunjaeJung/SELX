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
		$("#bat-current").html(parseFloat(value).toFixed(3));
		$("#bat-capacity").html(parseFloat(max).toFixed(3));
		$("#battery-bar").animate({width:percentage});
	}
}

var records = {
	setValuesStarting6AM : function (generationArray, consumptionArray) {
		this.setGenerationValuesStarting6AM(generationArray);
		this.setConsumptionValuesStarting6AM(consumptionArray);
	},
	setGenerationValuesStarting6AM : function (valueArray) {
		var chart = $("#record-container").highcharts();
		var chartSeries = chart.series[0];
		valueArray.forEach(function(e,i){
			records.setValueAtIndexForChartSeries(chartSeries, i, e);
		});
	},
	setConsumptionValuesStarting6AM : function (valueArray) {
		var chart = $("#record-container").highcharts();
		var chartSeries = chart.series[1];
		valueArray.forEach(function(e,i){
			records.setValueAtIndexForChartSeries(chartSeries, i, e);
		});
	},
	setGenerationValueAtTimePoint : function (timePoint, value) {
		var chart = $("#record-container").highcharts();
		var chartSeries = chart.series[0];
		timePoint = timePoint >= 6 ? timePoint - 6 : timePoint + 18;
		this.setValueAtIndexForChartSeries(chartSeries, timePoint, value);
	},
	setConsumptionValueAtTimePoint : function (timePoint, value) {
		var chart = $("#record-container").highcharts();
		var chartSeries = chart.series[1];
		timePoint = timePoint >= 6 ? timePoint - 6 : timePoint + 18;
		this.setValueAtIndexForChartSeries(chartSeries, timePoint, value);
	},
	setValueAtIndexForChartSeries : function (chartSeries, index, value) {
		chartSeries.data[index].update(value);
	}
}
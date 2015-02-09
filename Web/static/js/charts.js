$(function () {
    $('#record-container').highcharts({
        chart: {
            type: 'areaspline'
        },
        title: {
            text: ''
        },
        colors: ['#55BF3B','#B363B6'],
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 150,
            y: 100,
            floating: true,
            borderWidth: 1,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        xAxis: {
            categories: [
                '06:00',
                '07:00',
                '08:00',
                '09:00',
                '10:00',
                '11:00',
                '12:00',
                '13:00',
                '14:00',
                '15:00',
                '16:00',
                '17:00',
                '18:00',
                '19:00',
                '20:00',
                '21:00',
                '22:00',
                '23:00',
                '24:00',
                '01:00',
                '02:00',
                '03:00',
                '04:00',
                '05:00',
            ],
            /*
            plotBands: [{ // visualize the weekend
                from: 4.5,
                to: 6.5,
                color: 'rgba(68, 170, 213, .2)'
            }]
            */
        },
        yAxis: {
            title: {
                text: 'kWh'
            }
        },
        tooltip: {
            shared: true,
            valueSuffix: ' kWh'
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 0.5
            }
        },
        series: [{
            name: 'Generation',
            data: [3, 4, 3, 5, 4, 10, 12, 16, 18, 21, 15, 14, 15, 16, 11, 13, 12, 11, 23, 14, 23, 22, 13, 11]
        }, {
            name: 'Consumption',
            data: [6, 8, 9, 3, 2, 8, 14, 13, 21, 26, 32, 10, 11, 8, 3, 1, 4, 8, 8, 9, 11, 14, 16, 21]
        }]
    });
});
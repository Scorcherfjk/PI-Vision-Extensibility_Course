(function (PV) {
	"use strict";

	function symbolVis() { };
	PV.deriveVisualizationFromBase(symbolVis);

	var definition = {
		typeName: "amChart",
		iconUrl: 'Images/chrome.highchart.svg',
		visObjectType: symbolVis,
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
		getDefaultConfig: function () {
			return {
				DataShape: 'Timeseries',
				DataQueryMode: PV.Extensibility.Enums.DataQueryMode.ModeEvents,
				Height: 150,
				Width: 150,
				Intervals: 5000
			}
		}
	}


	symbolVis.prototype.init = function (scope, elem) {
		// eventos propios del objeto
		this.onDataUpdate = dataUpdate;

		//diferenciando cada objeto independiente
		var container = elem.find('#container')[0];
		container.id = "barChart_" + scope.symbol.Name;
		var chart = am4core.create(container.id, am4charts.XYChart);

		var valueAxisX = chart.xAxes.push(new am4charts.DateAxis());

		var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());

		var series = chart.series.push(new am4charts.LineSeries());
		series.dataFields.valueY = "value";
		series.dataFields.dateX = "date";
		series.tensionX = 0.8; //curvas en las lineas
		series.fillOpacity = 0.2; //convertir linea en area
		series.tooltipText = "{value}";
		series.tooltip.pointerOrientation = "vertical";

		//marcadores circulares
		//var bullet = series.bullets.push(new am4charts.CircleBullet());

		chart.cursor = new am4charts.XYCursor();
		chart.cursor.snapToSeries = series;
		chart.cursor.xAxis = valueAxisX;



		function dataUpdate(data) {
			if (!data) return;
			/*
			var max = parseFloat(data.ValueScaleLimits[1]);
			var startd = new Date(data.StartTime);
			var inicio = new Date(startd.toLocaleString('es-ES', { timeZone: 'America/Lima' })).valueOf();
	*/
			data.Data.forEach(function (datos) {

				var lista = [];
				var elemento = {};

				datos.Values.forEach(function (valor) {

					var horaArray = valor.Time.substring(10).split(':');
					var fechaArray = valor.Time.substring(0, 10).split('/');
					var fecha = new Date(
						fechaArray[2],
						fechaArray[1] - 1,
						fechaArray[0],
						horaArray[0],
						horaArray[1],
						horaArray[2]
					);
					var dato = parseFloat(valor.Value);

					elemento = {
						date: fecha,
						value: dato
					};

					lista.push(elemento);
				})

				chart.data = lista;
			});
		};

	};

	PV.symbolCatalog.register(definition);
})(window.PIVisualization); 

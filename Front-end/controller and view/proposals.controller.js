(function () {
    angular.module('wca.metrics')
        .controller('proposalController', ProposalController);

    ProposalController.$inject = ['proposalsService'];

    function ProposalController(proposalsService) {
        var vm = this;

        vm.header = "Metrics";
        vm.chartName = "Line Chart";

        vm.getChart = _getChart;
        vm.changeChart = _changeChart;
        _init();


        function _init() {

            vm.chartConfig = {
                chart: {
                    height: 500,
                    width: 800,
                    reflow: true,
                    type: "column",
                    plotBorderColor: '#346691',
                    plotBorderWidth: 2,
                    zoomType: 'x',
                    panning: true,
                    panKey: 'shift'
                },
                xAxis: {
                    categories: [],
                    crosshair: true,
                    endOnTick: true
                },
                yAxis: {
                    title: {
                        text: "Number of Public Proposals"
                    },
                    allowDecimals: false
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.1,
                        borderWidth: 0.5
                    }
                },
                title: {
                    text: 'PROPOSALS'
                },
                series: []
            };

            _getRange(7);

            _getChart(7, 'week');
        };

        function _changeChart() {
            if (vm.chartName == "Line Chart") {
                vm.chartConfig.chart.type = "line";
                vm.chartName = "Column Chart";
            }
            else {
                vm.chartConfig.chart.type = "column";
                vm.chartName = "Line Chart";
            }
        }

        function _getChart(numberOfDay, range) {
            vm.chartConfig.xAxis.categories = [];

            if (range == 'week') {
                vm.chartConfig.title.text = "PROPOSALS IN 1 WEEK";
            }
            else if (range == 'month') {
                vm.chartConfig.title.text = "PROPOSALS IN 1 MONTH";
            }
            else {
                vm.chartConfig.title.text = "PROPOSALS IN 1 YEAR";
            }
            vm.chartConfig.series = [];

            _getRange(numberOfDay)

            proposalsService.getProjectProposals(numberOfDay, range)
                .then(_getProjectSuccess)
                .catch(_getError);
            proposalsService.getFundProposals(numberOfDay, range)
                .then(_getFundSuccess)
                .catch(_getError);
            proposalsService.getOrganizationProposals(numberOfDay, range)
                .then(_getOrganizationSuccess)
                .catch(_getError);
        };

        function _getProjectSuccess(res) {
            _serializeData(res);
        };

        function _getFundSuccess(res) {
            _serializeData(res);
        };

        function _getOrganizationSuccess(res) {
            _serializeData(res);
        };

        function _getError(err) {
            console.log(err);
        };

        function _serializeData(res) {
            var dataObject = {};
            var timeRange = [];
            var typeOfProposal = "";
            var data = res.data.items;

            if (res.config.url.includes('projects') == true) {
                typeOfProposal = "Project";
            }
            else if (res.config.url.includes('funds') == true) {
                typeOfProposal = "Fund";
            }
            else if (res.config.url.includes('organizations') == true) {
                typeOfProposal = "Organization";
            }

            dataObject.name = typeOfProposal;
            dataObject.id = typeOfProposal;
            dataObject.data = [];

            for (var j = 0; j < data.length; j++) {
                timeRange.push(data[j]._id);
            }
            for (var i = 0; i < vm.daysInRange.length; i++) {
                if (timeRange.indexOf(vm.daysInRange[i]) != -1) {
                    dataObject.data.push(data[timeRange.indexOf(vm.daysInRange[i])].count)
                }
                else {
                    dataObject.data.push(0)
                }
            }
            vm.chartConfig.series.push(dataObject);
        };

        function _getRange(numberOfDay) {
            var date = new Date();
            var today = new Date();
            var timeElement = "";
            vm.daysInRange = [];
            if (numberOfDay <= 30) {
                for (var beginningPeriod = new Date(date.setDate(date.getDate() - numberOfDay)); beginningPeriod <= today; beginningPeriod.setDate(beginningPeriod.getDate() + 1)) {
                    if (beginningPeriod.getMonth() < 9 && beginningPeriod.getDate() < 10) {
                        timeElement = "0" + (beginningPeriod.getMonth() + 1) + "-0" + beginningPeriod.getDate() + "-" + beginningPeriod.getFullYear();
                    }
                    else if (beginningPeriod.getMonth() < 9) {
                        timeElement = "0" + (beginningPeriod.getMonth() + 1) + "-" + beginningPeriod.getDate() + "-" + beginningPeriod.getFullYear();
                    }
                    else if (beginningPeriod.getDate() < 10) {
                        timeElement = (beginningPeriod.getMonth() + 1) + "-0" + beginningPeriod.getDate() + "-" + beginningPeriod.getFullYear();
                    }
                    vm.daysInRange.push(timeElement);
                    vm.chartConfig.xAxis.categories.push(timeElement);
                };
            }
            else {
                for (var beginningPeriod = new Date(date.setDate(date.getDate() - numberOfDay)); beginningPeriod <= today; beginningPeriod.setMonth(beginningPeriod.getMonth() + 1)) {
                    if (beginningPeriod.getMonth() < 9) {
                        timeElement = "0" + (beginningPeriod.getMonth() + 1) + "-" + beginningPeriod.getFullYear();
                    }
                    else {
                        timeElement = (beginningPeriod.getMonth() + 1) + "-" + beginningPeriod.getFullYear();
                    }
                    vm.daysInRange.push(timeElement);
                    vm.chartConfig.xAxis.categories.push(timeElement);
                };
            }
        }
    }
})();
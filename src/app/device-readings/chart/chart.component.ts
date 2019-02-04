import {Component, Input, OnChanges} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-device-info-chart-component',
  templateUrl: './chart.component.html'
})
export class ChartComponent implements OnChanges {

  @Input() param: any;
  @Input() unit: string;
  @Input() period: string;

  barChartOptions: any;
  barChartLabels: string[];
  barChartType: string;
  barChartLegend: boolean;
  barChartData: any[];
  barChartColor: Array<any>;
  showChart: boolean;

  constructor() {
    this.barChartOptions = {
      scaleShowVerticalLines: false,
      responsive: true,
    };
    this.barChartLabels = [];
    this.barChartType = 'bar';
    this.barChartLegend = true;
    this.barChartData = [
      {data: [], label: ''},
    ];
    this.barChartColor = [{
      backgroundColor: '#3f51b5',
    }];
    this.showChart = false;
  }
  ngOnChanges(newParam) {
    this.showChart = false;
    if (newParam.param) {
      if (newParam.period.currentValue === 'day') {
        this.updateChartForDay(newParam.param.currentValue);
      } else {
        this.updateChart(newParam.param.currentValue);
      }
    }
  }
  updateChart(param) {
    if (param) {

      this.barChartData = [{data: [], label: 'Расход' }];
      this.barChartLabels = null;
      this.barChartLabels = [];
      const arrlabel = [];
      const arrData = [{data: [], label: 'Расход ' + this.unit}];
      for (let i = 0; i < param.length; i++) {
        arrlabel.push(param[i].periodFrom + param[i].periodTill);
        arrData[0].data.push(param[i].consumption );
      }

      this.barChartLabels = arrlabel;
      this.barChartData = arrData;
      setTimeout(() => { this.showChart = true; }, 0);
    }
  }
  updateChartForDay(param) {
    if (param) {
      this.barChartData = [{data: [], label: 'Расход' }];
      this.barChartLabels = null;
      this.barChartLabels = [];
      const arrlabel = [];
      const arrData = [{data: [], label: 'Расход ' + this.unit}];
      for (let i = 0; i < param.length; i++) {
        arrlabel.push(moment(param[i].time).format('HH:mm'));
        arrData[0].data.push((param[i].prew ? (param[i].value - param[i].prew) / 1000 : 0) );
      }

      this.barChartLabels = arrlabel;
      this.barChartData = arrData;
      setTimeout(() => { this.showChart = true; }, 0);
    }
  }
  // events
  chartClicked(e: any): void {
    // console.log(e);
  }
  chartHovered(e: any): void {
    // console.log(e);
  }
}

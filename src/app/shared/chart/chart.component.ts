import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements OnInit {
  chart: any;

  ngOnInit() {
    this.initChart();
  }

  initChart() {
    this.chart = new Chart('Player Money / Round', {
      type: 'line',
      data: {
        labels: [], 
        datasets: [{
          label: 'Money',
          data: [], 
        }]
      },
    });
  }

  updateChartData(round: string, money: number) {
    this.chart.data.labels.push(round);
    this.chart.data.datasets[0].data.push(money);
    this.chart.update();
  }
}

export default class DisplayChart {
  constructor(uhunt, codeforces) {
    this.uhunt = uhunt
    this.codeforces = codeforces
  }

  displayRating() {
    window.google.charts.load("current", { packages: ["corechart"] });
    window.google.charts.setOnLoadCallback(() => {
      let data = window.google.visualization.arrayToDataTable(this.codeforces.rating);
      let chart = new window.google.visualization.LineChart(document.getElementById('curve_chart'));
      chart.draw(data, {
        legend: 'none'
      });
    });
  }

  displaySubmission() {
    let totalSolved = {}
    for (let i = 0, l = this.uhunt.submissions.solved.length; i < l; i++) {
      let solved = this.uhunt.submissions.solved[i]
      let timespans = this.uhunt.submissions.timespans[i]
      totalSolved[timespans] = (typeof totalSolved[timespans] !== "undefined")
        ? totalSolved[timespans] + solved
        : solved
    }
    for (let i = 0, l = this.codeforces.submissions.solved.length; i < l; i++) {
      let solved = this.codeforces.submissions.solved[i]
      let timespans = this.codeforces.submissions.timespans[i]
      totalSolved[timespans] = (typeof totalSolved[timespans] !== "undefined")
        ? totalSolved[timespans] + solved
        : solved
    }

    let rows = []
    let minYear = 0
    let maxYear = 0
    for (let timespans in totalSolved) {
      let date = new Date(parseInt(timespans))
      rows.push([date, Math.min(totalSolved[timespans], 10)])
      minYear = (minYear === 0) ? date.getFullYear() : Math.min(minYear, date.getFullYear())
      maxYear = (maxYear === 0) ? date.getFullYear() : Math.max(maxYear, date.getFullYear())
    }

    let height = (maxYear - minYear + 1) * 150 + 35

    window.google.charts.load("current", { packages: ["calendar"] });
    window.google.charts.setOnLoadCallback(() => {
      let dataTable = new window.google.visualization.DataTable();
      dataTable.addColumn({ type: 'date', id: 'Date' });
      dataTable.addColumn({ type: 'number', id: 'Won/Loss' });
      dataTable.addRows(rows);

      console.log(rows)

      let chart = new window.google.visualization.Calendar(document.getElementById('calendar_basic'));
      chart.draw(dataTable, {
        height,
        noDataPattern: {
          backgroundColor: '#E0E0E0',
          color: '#9E9E9E'
        }
      });
    });
  }
}

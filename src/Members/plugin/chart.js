export default class DisplayChart {
  constructor(uhunt, codeforces) {
    this.uhunt = uhunt
    this.codeforces = codeforces

    this.displayContestRating()
    this.displayTotalVerdict()
    this.displayProblemRatingSolved()
    this.displayExerciseStatus()
    this.displayHistorySubmission()
  }

  displayContestRating() {
    window.google.charts.load("current", { packages: ["corechart"] });
    window.google.charts.setOnLoadCallback(() => {
      let data = window.google.visualization.arrayToDataTable(this.codeforces.rating);
      let chart = new window.google.visualization.LineChart(document.getElementById('contest_rating'));
      chart.draw(data, {
        legend: 'none'
      });
    });
  }

  displayTotalVerdict() {
    window.google.charts.load("current", { packages: ["corechart"] });
    window.google.charts.setOnLoadCallback(() => {
      let data = window.google.visualization.arrayToDataTable([
        ['Verdict', 'Total'],
        ['Accepted', this.uhunt.verdict.ac + this.codeforces.verdict.ac],
        ['Wrong Answer', this.uhunt.verdict.wa + this.codeforces.verdict.wa],
        ['Runtime Error', this.uhunt.verdict.rte + this.codeforces.verdict.rte],
        ['Time Limit', this.uhunt.verdict.tle + this.codeforces.verdict.tle],
      ]);
      let chart = new window.google.visualization.PieChart(document.getElementById('total_verdict'));
      chart.draw(data, {
        is3D: true,
        legend: {
          position: 'bottom'
        }
      });
    });
  }

  displayProblemRatingSolved() {
    window.google.charts.load("current", { packages: ["corechart", "bar"] });
    window.google.charts.setOnLoadCallback(() => {
      let data = new window.google.visualization.DataTable();
      data.addColumn('string', 'Problem Rating');
      data.addColumn('number', 'Solved');
      data.addRows(this.codeforces.problemRatingSolved);

      let chart = new window.google.charts.Bar(document.getElementById('problem_rating_solved'));
      chart.draw(data, {
        title: 'none',
        legend: { position: "none" },
      });
    });
  }

  displayExerciseStatus() {
    window.google.charts.load('current', { packages: ['corechart', 'bar'] });
    window.google.charts.setOnLoadCallback(() => {
      let rawdata = [["Exercise", "Solved"]]
      for (let i = 0, l = this.uhunt.titles.length; i < l; i++) {
        let { solved, total } = this.uhunt.exercises[i]
        let exercise = this.uhunt.titles[i]
        rawdata.push([exercise, (solved * 100 / total)])
      }

      let data = window.google.visualization.arrayToDataTable(rawdata);
      let chart = new window.google.visualization.BarChart(document.getElementById('exercise_status'));
      chart.draw(data, {
        height: 350,
        chartArea: {
          width: '50%'
        },
      });
    });
  }

  displayHistorySubmission() {
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

      let chart = new window.google.visualization.Calendar(document.getElementById('history_submissions'));
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

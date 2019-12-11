import React, { Fragment } from 'react'

export default class Member extends React.Component {
  state = {
    info: {
      nim: '',
      name: '',
      ps: ''
    },
    rating: [],
    titles: [],
    exercises: [],
    solved: 0,
    problemsId: {
      id: {
        solved: false,
        exerciseId: 0
      }
    },
    problemsNumber: {
      number: {
        solved: false,
        exerciseId: 0
      }
    },
    user: {
      handle: '',
      rank: ' ',
      lastOnline: 0,
      avatar: ''
    },
    codeforces: {
      solved: []
    }
  }

  async componentDidMount() {
    let search = window.location.search;
    let params = new URLSearchParams(search);

    let state = {
      info: {
        nim: params.get('nim'),
        name: params.get('name'),
        ps: params.get('ps') === "ti" ? "Teknik Informatika" : "Sistem Informasi"
      }
    }

    this.setState(state)
    await this.fetchCpBook3();
    await this.fetchProblemDetail();

    await this.getUserInfo(params.get('cf'));
    await this.getUserCodeforcesSubmissions(params.get('cf'));

    await this.fetchUserSubmissions(params.get('uva'));
    await this.fetchCodeforcesRating(params.get('cf'));

    await this.setupSubmission();
    await this.setupRatingChart();
    // await this.setupProfileChart();
  }

  getUserCodeforcesSubmissions = async (uname) => {
    let api = await fetch(`https://codeforces.com/api/user.status?handle=${uname}&from=1&count=1000`)
    let response = await api.json()
    let submissions = response.result
    let state = {
      codeforces: {
        solved: []
      }
    }
    for (let submission of submissions) {
      if (submission.verdict === "OK") {
        state.codeforces.solved.push(submission.creationTimeSeconds)
      }
    }

    this.setState(state)
  }

  getUserInfo = async (uname) => {
    let api = await fetch(`https://codeforces.com/api/user.info?handles=${uname}`)
    let response = await api.json()
    let user = response.result[0]
    let state = {
      user: {
        handle: user.handle,
        rank: user.rank,
        lastOnline: user.lastOnlineTimeSeconds * 1000,
        avatar: "https:" + user.titlePhoto
      }
    }
    this.setState(state)
  }

  fetchCpBook3 = async () => {
    let response = await fetch(`https://uhunt.onlinejudge.org/api/cpbook/3`);
    let exercises = await response.json();
    let state = {
      titles: [],
      exercises: [],
      problemsNumber: {}
    };

    for (let [id, exercise] of exercises.entries()) {
      state.titles.push(exercise.title);
      state.exercises.push({
        solved: 0,
        total: 0
      });

      let subExercises = exercise.arr;
      for (let subExercise of subExercises) {
        let tags = subExercise.arr;
        for (let tag of tags) {
          for (let problem = 1; problem < tag.length; problem++) {
            state.exercises[id].total += 1;
            state.problemsNumber[Math.abs(parseInt(tag[problem], 10))] = {
              solved: false,
              exerciseId: id
            };
          }
        }
      }
    }

    this.setState(state);
  }

  fetchProblemDetail = async () => {
    let response = await fetch(`https://uhunt.onlinejudge.org/api/p`);
    let problems = await response.json();
    let state = {
      problemsId: this.state.problemsId,
      problemsNumber: this.state.problemsNumber
    };

    for (let problem of problems) {
      state.problemsId[parseInt(problem[0], 10)] = state.problemsNumber[parseInt(problem[1], 10)];
    }

    this.setState(state);
  }

  fetchUserSubmissions = async (userId) => {
    let response = await fetch(`https://uhunt.onlinejudge.org/api/subs-user/${userId}`);
    let submissions = await response.json();
    let state = {
      solved: this.state.solved,
      exercises: this.state.exercises,
      problemsId: this.state.problemsId
    };

    for (let submission of submissions.subs) {
      if (parseInt(submission[2], 10) === 90) {
        if (typeof state.problemsId[parseInt(submission[1], 10)] === 'undefined') {
          state.solved += 1;
        }
        else if (state.problemsId[parseInt(submission[1], 10)].solved === false) {
          let exerciseId = state.problemsId[parseInt(submission[1], 10)].exerciseId;
          state.problemsId[parseInt(submission[1], 10)].solved = true;
          state.exercises[exerciseId].solved += 1;
        }
      }
    }

    this.setState(state);
  }

  fetchCodeforcesRating = async (uname) => {
    let response = await fetch(`https://codeforces.com/api/user.rating?handle=${uname}`);
    let api = await response.json();
    let state = {
      rating: []
    };

    for (let rating of api.result) {
      state.rating.push(rating.newRating);
    }

    this.setState(state);
  }

  setupSubmission = async () => {
    window.google.charts.load("current", { packages: ["calendar"] });
    window.google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      let dataTable = new window.google.visualization.DataTable();
      dataTable.addColumn({ type: 'date', id: 'Date' });
      dataTable.addColumn({ type: 'number', id: 'Won/Loss' });
      dataTable.addRows([
        [new Date(2012, 3, 13), 0],
        [new Date(2012, 3, 14), 2],
        [new Date(2012, 3, 17), 5],
        [new Date(2012, 3, 15), 3],
        [new Date(2012, 3, 16), 4]
      ]);

      let chart = new window.google.visualization.Calendar(document.getElementById('calendar_basic'));
      chart.draw(dataTable);
    }
  }

  setupRatingChart = async () => {
    /*eslint no-new: "off"*/
    new window.Chart(document.getElementById('myRating').getContext('2d'), {
      type: 'line',
      data: {
        labels: this.state.rating,
        datasets: [{
          data: [...this.state.rating, this.state.rating[this.state.rating.length - 1] - 25],
          lineTension: 0,
          backgroundColor: 'rgba(255, 0, 0, 0.5)'
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: false //this will remove all the x-axis grid lines
          }]
        }
      }
    });
  }

  setupProfileChart = async () => {
    let data = [];
    let labels = [];
    for (let [id, exercise] of this.state.titles.entries()) {
      data.push(this.state.exercises[id].solved / this.state.exercises[id].total);
      labels.push(exercise);
    }

    /*eslint no-new: "off"*/
    new window.Chart(document.getElementById('myChart').getContext('2d'), {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          data,
          label: '# of Votes',
          backgroundColor: 'rgba(255, 0, 0, 0.5)',
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: false
        },
        scale: {
          ticks: {
            display: false,
            maxTicksLimit: 5
          }
        }
      }
    });
  }

  render() {
    let uvaSolve = 0
    const viewExercises = this.state.titles.map((exercise, id) => {
      uvaSolve += this.state.exercises[id].solved
      return (
        <Fragment>
          <div className="col-md-3">
            <b>{exercise}</b>
          </div>
          <div className="col-md-9">
            <div className="progress">
              <div className="progress-bar bg-info" style={{ width: (this.state.exercises[id].solved * 100 / this.state.exercises[id].total) + '%' }}>
                {this.state.exercises[id].solved} / {this.state.exercises[id].total}
              </div>
            </div>
          </div>
        </Fragment>
      )
    });

    return (
      <div className="row mb-3">
        <div className="col-md-10 offset-md-1 mt-3">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <img src={this.state.user.avatar} style={{ maxWidth: '100%' }} />

                </div>

                <div className="col-md-9">
                  <div className="row">
                    <div className="col-md-6">
                      <p className="mb-0"><b>NIM: </b> {this.state.info.nim}</p>
                      <p className="mb-0"><b>Nama: </b> {this.state.info.name}</p>
                      <p className="mb-0"><b>Program Studi: </b> {this.state.info.ps}</p>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-6" >
                      <canvas id="myRating" />
                    </div>
                    <div className="col-md-6">
                      <h6>{this.state.user.rank[0].toUpperCase() + this.state.user.rank.slice(1)}</h6>
                      <h3 className="mb-4">{this.state.user.handle}</h3>
                      <p className="mb-0"><b>Problem(s) solved: </b> {uvaSolve + this.state.codeforces.solved.length}</p>
                      <p className="mb-0"><b>Last submissions: </b> {(new Date(this.state.user.lastOnline)).toDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <h3 className="mt-3">Status</h3>
                  <div className="row">
                    {viewExercises}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-10 offset-md-1 mt-3">
          <div className="card">
            <div className="card-body">
              <div className="text-center">
                <div id="calendar_basic" />
              </div>
              <table><tbody>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Solved</th>
                </tr>
                <tr>
                  <td>1</td>
                  <td>20 Sept 2019</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>20 Sept 2019</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>20 Sept 2019</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>20 Sept 2019</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>20 Sept 2019</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>20 Sept 2019</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>20 Sept 2019</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>20 Sept 2019</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>20 Sept 2019</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>20 Sept 2019</td>
                  <td>1</td>
                </tr>
              </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

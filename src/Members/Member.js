import React, { Fragment } from 'react'
import UhuntAPI from './plugin/uhunt'
import CodeforcesAPI from './plugin/codeforces'
import DisplayChart from './plugin/chart'
import './Member.css'

export default class Member extends React.Component {
  state = {
    info: {
      nim: '',
      name: '',
      ps: ''
    }
  }

  async componentDidMount() {
    let params = new URLSearchParams(window.location.search);
    this.setState({
      info: {
        nim: params.get('nim'),
        name: params.get('name'),
        ps: params.get('ps') === "ti" ? "Teknik Informatika" : "Sistem Informasi"
      },
      uhunt: await new UhuntAPI(params.get('uva')).getData(),
      codeforces: await new CodeforcesAPI(params.get('cf')).getData(),
    })
    console.log(this.state.uhunt, this.state.codeforces)
    let chart = new DisplayChart(this.state.uhunt, this.state.codeforces)
    chart.displayRating()
    chart.displaySubmission()
  }

  render() {
    const haveUhunt = typeof this.state.uhunt !== "undefined"
    const haveCodeforces = typeof this.state.codeforces !== "undefined"

    const viewExercises = haveUhunt && this.state.uhunt.titles.map((exercise, id) => {
      let { solved, total } = this.state.uhunt.exercises[id]
      return (
        <Fragment>
          <div className="col-md-3">
            <b>{exercise}</b>
          </div>
          <div className="col-md-9">
            <div className="progress">
              <div className="progress-bar bg-info" style={{ width: (solved * 100 / total) + '%' }}>
                {solved} / {total}
              </div>
            </div>
          </div>
        </Fragment>
      )
    });

    const getProblemSolved = () => {
      return haveCodeforces && this.state.uhunt.verdict.ac + this.state.codeforces.verdict.ac
    }

    const getLastSubmission = () => {
      return haveCodeforces && (new Date(this.state.codeforces.lastOnline)).toDateString()
    }

    return (
      <div className="row mb-3" id="printable">
        <div className="col-md-10 offset-md-1 mt-3">
          <div className="card">
            <div class="card-header">
              <h3 class="m-0">Profile</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <img src={haveCodeforces && this.state.codeforces.avatar} style={{ maxWidth: '100%' }} />
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
                      <div id="curve_chart"></div>
                    </div>
                    <div className="col-md-6">
                      <h6>{haveCodeforces && this.state.codeforces.rank[0].toUpperCase() + this.state.codeforces.rank.slice(1)}</h6>
                      <h3 className="mb-4">{haveCodeforces && this.state.codeforces.handle}</h3>
                      <p className="mb-0"><b>Problem(s) solved: </b> {getProblemSolved()}</p>
                      <p className="mb-0"><b>Last submissions: </b> {getLastSubmission()}</p>
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
            <div class="card-header">
              <h3 class="m-0">History Submissions</h3>
            </div>
            <div className="card-body">
              <div className="text-center">
                <div id="calendar_basic" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

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

    new DisplayChart(this.state.uhunt, this.state.codeforces)
  }

  render() {
    const haveUhunt = typeof this.state.uhunt !== "undefined"
    const haveCodeforces = typeof this.state.codeforces !== "undefined"

    const getProblemSolved = () => {
      return haveUhunt && haveCodeforces && this.state.uhunt.verdict.ac + this.state.codeforces.verdict.ac
    }

    const getLastSubmission = () => {
      return haveCodeforces && (new Date(this.state.codeforces.lastOnline)).toDateString()
    }

    return (
      <div className="row mb-3" id="printable">
        <div className="col-md-12 mt-3">
          <div className="card">
            <div class="card-header">
              <h3 class="m-0">Profile</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <img src={haveCodeforces && this.state.codeforces.avatar} style={{ maxWidth: '100%' }} />
                </div>

                <div className="col-md-4">
                  <p className="mb-0"><b>NIM: </b> {this.state.info.nim}</p>
                  <p className="mb-0"><b>Nama: </b> {this.state.info.name}</p>
                  <p className="mb-0"><b>Program Studi: </b><br /> {this.state.info.ps}</p>
                </div>

                <div className="col-md-4">
                  <h6 className="mb-0">{haveCodeforces && this.state.codeforces.rank[0].toUpperCase() + this.state.codeforces.rank.slice(1)}</h6>
                  <h4 className="mb-3">{haveCodeforces && this.state.codeforces.handle}</h4>
                  <p className="mb-0"><b>Problem(s) solved: </b> {getProblemSolved()}</p>
                  <p className="mb-0"><b>Last submissions: </b><br /> {getLastSubmission()}</p>
                </div>

                <div className="col-md-7">
                  <h3 className="mt-3">Contest rating:</h3>
                  <div id="contest_rating" />
                </div>

                <div className="col-md-5">
                  <h3 className="mt-3">Total verdict:</h3>
                  <div id="total_verdict" />
                </div>

                <div className="col-md-12">
                  <h3 className="mt-3">Problem rating solved:</h3>
                  <div id="problem_rating_solved" />
                </div>

                <div className="col-md-12">
                  <h3 className="mt-3">Exercise Status:</h3>
                  <div id="exercise_status" />
                </div>

                <div className="col-md-12">
                  <h3 className="mt-3">History submissions:</h3>
                  <div id="history_submissions" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

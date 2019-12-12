export default class CodeforcesAPI {
  constructor(uname) {
    this.uname = uname;
    this.data = {};

    return this;
  }

  async getUser() {
    let api = await fetch(`https://codeforces.com/api/user.info?handles=${this.uname}`)
    let response = await api.json()
    let user = response.result[0]

    this.data.rank = user.rank
    this.data.handle = user.handle
    this.data.lastOnline = user.lastOnlineTimeSeconds * 1000
    this.data.avatar = "https:" + user.titlePhoto
  }

  async getRatingHistory() {
    let api = await fetch(`https://codeforces.com/api/user.rating?handle=${this.uname}`);
    let response = await api.json();
    let ratings = response.result

    this.data.rating = [['Date', 'Rating']]
    for (let rating of ratings) {
      this.data.rating.push([new Date(rating.ratingUpdateTimeSeconds * 1000), rating.newRating]);
    }
  }

  async getSubmissions() {
    let api = await fetch(`https://codeforces.com/api/user.status?handle=${this.uname}&from=1&count=10000`)
    let response = await api.json()
    let submissions = response.result

    this.data.verdict = { ac: 0, wa: 0, tle: 0, rte: 0 }
    for (let submission of submissions) {
      switch (submission.verdict) {
        case "OK": this.data.verdict.ac += 1; break;
        case "WRONG_ANSWER": this.data.verdict.wa += 1; break;
        case "RUNTIME_ERROR": this.data.verdict.rte += 1; break;
        case "TIME_LIMIT_EXCEEDED": this.data.verdict.tle += 1; break;
        default: break;
      }
    }

    let solved = {}
    for (let submission of submissions) {
      if (submission.verdict === "OK") {
        let date = new Date(submission.creationTimeSeconds * 1000)
        let timespans = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
        solved[timespans] = (typeof solved[timespans] !== "undefined")
          ? solved[timespans] + 1
          : 1
      }
    }

    this.data.submissions = { timespans: [], solved: [] }
    for (let timespans in solved) {
      this.data.submissions.timespans.push(timespans)
      this.data.submissions.solved.push(solved[timespans])
    }
  }

  async getData() {
    await this.getUser()
    await this.getRatingHistory()
    await this.getSubmissions()
    return this.data
  }
}

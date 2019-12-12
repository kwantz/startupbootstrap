export default class UhuntAPI {
  constructor(userId) {
    this.userId = userId;
    this.data = {};

    return this;
  }

  async getExercises() {
    let api = await fetch(`https://uhunt.onlinejudge.org/api/cpbook/3`);
    let exercises = await api.json();

    this.data.titles = []
    this.data.exercises = []
    this.data.problemsNumber = {}
    for (let [id, exercise] of exercises.entries()) {
      this.data.titles.push(exercise.title);
      this.data.exercises.push({
        solved: 0,
        total: 0
      });

      let subExercises = exercise.arr;
      for (let subExercise of subExercises) {
        let tags = subExercise.arr;
        for (let tag of tags) {
          for (let problem = 1; problem < tag.length; problem++) {
            this.data.exercises[id].total += 1;
            this.data.problemsNumber[Math.abs(parseInt(tag[problem], 10))] = {
              solved: false,
              exerciseId: id
            };
          }
        }
      }
    }
  }

  async getProblem() {
    let api = await fetch(`https://uhunt.onlinejudge.org/api/p`);
    let problems = await api.json();

    this.data.problemsId = {}
    for (let problem of problems)
      this.data.problemsId[parseInt(problem[0], 10)] = this.data.problemsNumber[parseInt(problem[1], 10)];
  }

  async getSubmissions() {
    let api = await fetch(`https://uhunt.onlinejudge.org/api/subs-user/${this.userId}`);
    let submissions = await api.json();

    this.data.verdict = { ac: 0, wa: 0, tle: 0, rte: 0 }
    for (let submission of submissions.subs) {
      if (parseInt(submission[2], 10) === 90) {
        this.data.verdict.ac += 1
        if (typeof this.data.problemsId[parseInt(submission[1], 10)] !== 'undefined' && this.data.problemsId[parseInt(submission[1], 10)].solved === false) {
          let exerciseId = this.data.problemsId[parseInt(submission[1], 10)].exerciseId;
          this.data.problemsId[parseInt(submission[1], 10)].solved = true;
          this.data.exercises[exerciseId].solved += 1;
        }
      }
      if (parseInt(submission[2], 10) === 80 || parseInt(submission[2], 10) === 70)
        this.data.verdict.wa += 1
      if (parseInt(submission[2], 10) === 60)
        this.data.verdict.rte += 1
      if (parseInt(submission[2], 10) === 50)
        this.data.verdict.tle += 1
    }

    let solved = {}
    for (let submission of submissions.subs) {
      if (parseInt(submission[2], 10) === 90) {
        let date = new Date(submission[4] * 1000)
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
    await this.getExercises()
    await this.getProblem()
    await this.getSubmissions()
    return this.data
  }
}

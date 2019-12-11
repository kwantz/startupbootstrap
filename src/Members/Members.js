import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';

export default class Members extends React.Component {
  state = {
    members: [
      {
        nim: '16.111.0099',
        name: 'Andy Yu',
        ps: 'ti',
        cf: 'RavenYu',
        uva: '816882'
      }, {
        nim: '16.111.2057',
        name: 'Fariz Hazmi',
        ps: 'ti',
        cf: 'farizhazmi10',
        uva: '887170'
      }, {
        nim: '16.111.4066',
        name: 'Ryan Owen Thionanda',
        ps: 'ti',
        cf: 'Owenizedd',
        uva: '883622'
      }, {
        nim: '16.211.1286',
        name: 'Steven Wijaya',
        ps: 'si',
        cf: 'luckys65',
        uva: '963327'
      }, {
        nim: '17.111.0151',
        name: 'James Koeswandi',
        ps: 'ti',
        cf: 'Jemir',
        uva: '995861'
      }, {
        nim: '17.111.0495',
        name: 'Felix',
        ps: 'ti',
        cf: 'xfelix9977',
        uva: '996242'
      }, {
        nim: '17.111.0614',
        name: 'Steven',
        ps: 'ti',
        cf: 'lHikaril',
        uva: '963321'
      }, {
        nim: '17.111.0975',
        name: 'William Ho',
        ps: 'ti',
        cf: 'william100',
        uva: '995814'
      }, {
        nim: '18.111.0131',
        name: 'Felix Liman',
        ps: 'ti',
        cf: 'FelixLim',
        uva: '995830'
      }, {
        nim: '18.111.0522',
        name: 'Angela Ho',
        ps: 'ti',
        cf: 'Angela_Ho',
        uva: '995844'
      }, {
        nim: '18.111.0701',
        name: 'Kevin Thiotanry',
        ps: 'ti',
        cf: 'yabel_aurelius',
        uva: '1032903',
      }, {
        nim: '18.111.1048',
        name: 'Ken Ken',
        ps: 'ti',
        cf: 'xigmaxe',
        uva: '816661'
      }, {
        nim: '18.111.1439',
        name: 'Andreas Lukita',
        ps: 'ti',
        cf: 'Dreuia',
        uva: '893486'
      }, {
        nim: '18.111.1684',
        name: 'Herlian',
        ps: 'ti',
        cf: 'herlianzhang',
        uva: '995827'
      }, {
        nim: '18.111.2957',
        name: 'Shelly Tansil',
        ps: 'ti',
        cf: 'Shellytan',
        uva: '995838'
      }, {
        nim: '18.111.3561',
        name: 'Ritchie Goldwin',
        ps: 'ti',
        cf: 'Metalblade',
        uva: '995893'
      }, {
        nim: '18.111.4061',
        name: 'James Ryans',
        ps: 'ti',
        cf: 'james_ryans',
        uva: '995834'
      }, {
        nim: '18.111.4401',
        name: 'Haryo Wijaya',
        ps: 'ti',
        cf: 'miracle_fortune',
        uva: '788285'
      }, {
        nim: '18.211.1019',
        name: 'Kevin',
        ps: 'si',
        cf: 'Theofratus',
        uva: '978433'
      }
    ]
  }

  render() {
    const members = this.state.members.map((member, id) => (
      <div class="col-md-4 col-xl-3 py-3">
        <div class="card">
          <img class="card-img-top" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_16ef4538b2b%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_16ef4538b2b%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22105.5%22%20y%3D%2296.6%22%3E286x180%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" alt="Card image cap" />
          <div class="card-body">
            <h5 class="card-title">{member.name}</h5>
            <p class="card-text">
              <b>NIM:</b> <span>{member.nim}</span><br />
              <b>Program Studi:</b> <br /><span>{member.ps === "ti" ? "Teknik Informatika" : "Sistem Informasi"}</span><br />
            </p>
            <Link to={`/mpc/member?nim=${member.nim}&name=${member.name}&ps=${member.ps}&uva=${member.uva}&cf=${member.cf}`} class="btn btn-primary font-weight-bold float-right">
              <span>Go somewhere</span>
            </Link>
          </div>
        </div>
      </div>
    ))


    return (
      <div className="row">
        <div class="col-md-10 offset-md-1">
          <div class="row">
            {members}
          </div>
        </div>
      </div>
    )
  }
}

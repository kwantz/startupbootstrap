import React from 'react'
import Header from './Header/Header'
import Color from './Color/Color'
import Overview from './Overview/Overview'
import Earnings from './Earnings/Earnings'
import Revenue from './Revenue/Revenue'
import Project from './Project/Project'
import Illustrations from './Illustrations/Illustrations'
import Development from './Development/Development'

export default function Dashboard() {
  return (
    <div class="container-fluid">
      <Header/>
      <Overview/>
      <div class="row">
        <Earnings/>
        <Revenue/>
      </div>
      <div class="row">
        <div class="col-lg-6 mb-4">
          <Project/>
          <Color/>
        </div>
        <div class="col-lg-6 mb-4">
          <Illustrations/>
          <Development/>
        </div>
      </div>
    </div>
  )
}
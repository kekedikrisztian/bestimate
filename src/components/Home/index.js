import React, { Component } from 'react';
import { render } from "react-dom";
import { Chart } from "react-google-charts";
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from "../../App";
import Grid from '@material-ui/core/Grid';
import {Button, FormControl, Input, InputLabel} from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';
import 'typeface-roboto';

/**
 * Init Alpha Vantage with your API key.
 *
 * @param {String} key
 *   Your Alpha Vantage API key.
 */

const alpha = require('alphavantage')({ key: 'X6L7N691EZB1N3CJ' });

// // Simple examples
// alpha.data.intraday(`msft`).then(data => {
//     console.log(data);
// });

// alpha.forex.rate('btc', 'usd').then(data => {
//     console.log(data);
// })

class Home extends Component {
  state = {
      data: undefined,
      symbol: "aapl",
      startDate: new Date().toISOString().substring(0, 10),
      simDate: Date.parse(new Date().toISOString().substring(0, 10))
  }

  componentDidMount() {
  //   alpha.data.batch([`msft`, `aapl`, `btc`]).then(data => {
  //     this.setState({data})
  //     console.log(data);
  // });
  }

  componentDidUpdate(prevProps, prevState) {
      if (this.state.data === null && this.state.symbol) {
          alpha.data.daily_adjusted(this.state.symbol, 'full').then(data => {
              this.setState({data})
              console.log(data);
          });
      }
  }

  render() {
      const lastTwoWeeks = new Array(30)
          .fill(0).map((x, index) => {
              const d = new Date(this.state.simDate) - index * 86400000;
              return this.state.data && this.state.data["Time Series (Daily)"][new Date(d).toISOString().substring(0, 10)] ? d : null
          }).filter(Boolean);
      const avgOpen = lastTwoWeeks.reduce((sum, current) => {
          sum += +this.state.data["Time Series (Daily)"][new Date(current).toISOString().substring(0, 10)]["1. open"];
          return sum
      }, 0) / lastTwoWeeks.length;
      return (
          <div>
              <form className="main-container">
                  <Grid container spacing={32}>
                      <Grid item xs={6}>
                          <FormControl margin="normal" fullWidth>
                              <InputLabel htmlFor="symbol">symbol</InputLabel>
                              <Input id="symbol" type="text" onChange={(e) => {
                                  this.setState({symbol: e.target.value})
                              }}/>
                          </FormControl>
                      </Grid>

                      <Grid item xs={6}>
                          <FormControl margin="normal" fullWidth>
                              <InputLabel htmlFor="symbol"></InputLabel>
                              <Input type="date" value={this.state.startDate} onChange={(e) => {
                                  this.setState({startDate: e.target.value, simDate: Date.parse(e.target.value)})
                              }}/>
                          </FormControl>
                      </Grid>
                      <Grid container spacing={32} justify="center">
                          <Grid item>
                              <Fab color="secondary" variant="extended" size="medium" onClick={(e) => {
                                  this.setState({data: null})
                              }}>
                                  Start
                              </Fab>
                          </Grid>
                      </Grid>
                  </Grid>
              </form>

{this.state.data !== undefined && (
        this.state.data === null ?
            <div>
                <CircularProgress color="secondary"/>
            </div>
          :
          <div>
              {this.state.data["Meta Data"]["1. Information"]}

              <p>Today: {new Date(this.state.simDate).toISOString().substring(0, 10)}</p>
              <Button color="secondary" variant="outlined" size="medium" onClick={() => {
                  this.setState({simDate: this.state.simDate + 86400000})
              }}>Next day</Button>

              <p>Avg Open: {avgOpen} </p>

              <p>{avgOpen < this.state.data["Time Series (Daily)"][new Date(lastTwoWeeks[0]).toISOString().substring(0, 10)]["1. open"] ? "BUY" : "SELL"}</p>
              <div className="main-container">
                  <Grid container spacing={32}>
                      <Grid item xs={12}>
                          <Paper>
                              <Table>
                                  <TableHead>
                                      <TableRow>
                                          <TableCell>Date</TableCell>
                                          <TableCell>Open Value</TableCell>
                                          <TableCell>Divident Amount</TableCell>
                                      </TableRow>
                                  </TableHead>
                                  <TableBody>
                                      {lastTwoWeeks.map(date => {
                                          const key = new Date(date).toISOString().substring(0, 10);
                                          return <DayDetails date={key}
                                                             item={this.state.data["Time Series (Daily)"][key]}
                                                             key={key}/>
                                      })}
                                  </TableBody>
                              </Table>
                          </Paper>
                      </Grid>
                  </Grid>
              </div>
          </div>
        )}
      </div>
    );
  }
}

export default Home;

const DayDetails = (props) => (
  <TableRow>
      <TableCell>
          {props.date}
      </TableCell>
      <TableCell>
          {props.item["1. open"]}
      </TableCell>
      <TableCell>
          {props.item["7. dividend amount"]}
      </TableCell>
  </TableRow>
)

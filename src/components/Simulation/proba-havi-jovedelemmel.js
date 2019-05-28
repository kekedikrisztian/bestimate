import React, {BaseSyntheticEvent as e, Component} from 'react';
import { Chart } from "react-google-charts";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import {Button, FormControl, Input, InputLabel} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import AddIcon from '@material-ui/icons/Add';
import BarChart from '@material-ui/icons/BarChart';
import CloudDownload from '@material-ui/icons/CloudDownload';
import CircularProgress from '@material-ui/core/CircularProgress';

import Icon from '@material-ui/core/Icon';
import axios from 'axios';

// const availableSymbols = [
//     {symbol: "MSFT", title: "Microsoft"},
//     {symbol: "AAPL", title: "Apple"},
// ]

class Simulation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startInterval: "2010-05-10",
            endInterval: "2019-04-15",
            startCapital: 37000,
            maxPurchaseAmount: 700,
            purchaseCondition: 5,
            sellingCondition: undefined,
            symbol: undefined,
            symbols: [
                {symbol: "T", title: "AT&T", checked: true},
                {symbol: "BEP", title: "Brookfield Renewable Partners", checked: true},
                {symbol: "IRM", title: "Iron Mountain Incorporated", checked: true},
                {symbol: "JNJ", title: "Johnson & Johnson", checked: true},
                {symbol: "WELL", title: "Welltower Inc", checked: true}
            ],
            pieceOfStock: [],
            purchases: [],
            dividends: [],
            dataIsLoaded: undefined,
            allData: {},
            items: [],
            stockData: [],
            dividendDatas: [],
            onlyPaidDateDividend: [],
            myCapital: [],
            myCapitalWithDividend: [],
            myCapitalCompare: [],
            capitalDifference: [],
            openToDividend: [],
            allOpening: [],
            allDividend: [],
            dividendAmount: 0,
            showDiagram: false,
            simulateIsDisabled: true,
            downloadIsDisabled: false
        };

        this.stockDatas = [];
        this.dividendDatas = [];
        this.dividends = [];
        this.onlyPaidDateDividend = [];
        this.myCapital = [];
        this.capitalDifference = [];
        this.dividendPerShare = [];
        this.allOpening = [];

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange({ target }) {
        this.setState({
            [target.name]: target.value
        });
    }

    componentDidMount() {
    }

    downloadData = (e) => {
        e.preventDefault();
        this.setState({dataIsLoaded: false});
        var symbolCounter = 0;
        var pieceOfStock = {};

        const selectedSymbols = this.state.symbols.filter(x=>x.checked);
        selectedSymbols.map(x=>{
            axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=" + x.symbol.toUpperCase() + "&outputsize=full&apikey=X6L7N691EZB1N3CJ")
            /*axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=MSFT&outputsize=full&apikey=demo")*/
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    console.log(res.data['Time Series (Daily)']);

                    Object.keys(res.data['Time Series (Daily)']).forEach((key) => {
                        if(!this.state.allData[key]) {
                            this.state.allData[key] = {};
                        }

                        if(!this.state.allData[key][x.symbol]) {
                            this.state.allData[key][x.symbol] = {}
                        }

                        this.state.allData[key][x.symbol].opening = Number(res.data['Time Series (Daily)'][key]['1. open']);
                        this.state.allData[key][x.symbol].dividend = Number(res.data['Time Series (Daily)'][key]['7. dividend amount']);
                    })

                    if(!pieceOfStock[symbolCounter]) {
                        pieceOfStock[symbolCounter] = {};
                    }

                    pieceOfStock[symbolCounter].symbol = x.symbol;
                    pieceOfStock[symbolCounter].piece = 0;
                    pieceOfStock[symbolCounter].valueInitial = 0;
                    pieceOfStock[symbolCounter].valueNow = 0;
                    pieceOfStock[symbolCounter].dividend = 0;
                    symbolCounter++;

                    if(selectedSymbols.length === symbolCounter) {
                        this.setState({dataIsLoaded: true});
                        this.state.pieceOfStock = pieceOfStock;
                    }
                })


        });


        this.setState({simulateIsDisabled: false});

        console.log(this.state.allData);
    }

    consoleLogThis = (e) => {
        e.preventDefault();
    }

    dataToObject = (e) => {
        e.preventDefault();
        this.setState({downloadIsDisabled: true});

        const selectedSymbols = this.state.symbols.filter(x=>x.checked);

        /* opening adatok tömbbe rakása */
        let keyCounter = 0;
        Object.keys(this.state.allData).forEach((key) => {
            this.state.allOpening.push([key]);
            selectedSymbols.map(x => {
                if(this.state.allData[key][x.symbol]) {
                    this.state.allOpening[keyCounter].push(Number(this.state.allData[key][x.symbol].opening));
                }
                else {
                    this.state.allOpening[keyCounter].push(0);
                }

            });
            keyCounter++;
        });

        keyCounter = 0;
        /* dividend adatok tömbbe rakása */

        Object.keys(this.state.allData).forEach((key) => {
            this.state.allDividend.push([key]);
            selectedSymbols.map(x => {
                if(this.state.allData[key][x.symbol]) {
                    this.state.allDividend[keyCounter].push(Number(this.state.allData[key][x.symbol].dividend));
                }
                else {
                    this.state.allDividend[keyCounter].push(0);
                }

            });
            keyCounter++;
        });

        this.state.allOpening.reverse();
        this.state.allDividend.reverse();

        this.state.allOpening.unshift(['date']);
        this.state.allDividend.unshift(['date']);

        selectedSymbols.map(x => {
            this.state.allOpening[0].push(x.symbol);
            this.state.allDividend[0].push(x.symbol);
        });

        for (var i=1; i<this.state.allOpening.length; i++) {
            if ((this.state.allOpening[i][0] < this.state.startInterval) || (this.state.allOpening[i][0] > this.state.endInterval)) {
                this.state.allOpening.splice(i, 1);
                this.state.allDividend.splice(i, 1);
                i--;
            }
            else {

            }
        }
        console.log(this.state.allOpening);
        console.log(this.state.allDividend);

        /*vásároljunk*/
        var capital = this.state.startCapital;
        var maxPurchaseAmount = this.state.maxPurchaseAmount;
        var freeCashFlow = capital;
        var dividends = {};
        var purchases = {};
        var purchaseCounter = 0;
        var purchaseCondition = 1 - this.state.purchaseCondition / 100;
        var purchaseCapital = 700;

        var monthCounter = 1;

        var myCapital = [];
        myCapital.unshift(['date', 'amount']);

        var myCapitalWithDividend = [];
        myCapitalWithDividend.unshift(['date', 'amount']);

        var myCapitalCompare = [];
        myCapitalCompare.unshift(['date', 'without dividend', 'with dividend', 'original']);

        for (var i=1; i<this.state.allOpening.length; i++) {
            for (var j=1; j<this.state.allOpening[i].length; j++) {
                var actualPrice = this.state.allOpening[i][j];
                var buyBlock = 0;

                if ((this.state.allOpening[i][0] === this.state.startInterval) && (actualPrice !== 0)) { /*vásárlási feltétel*/
                    console.log("ennyi volt:" + freeCashFlow);

                    console.log("ennyi lett:" + freeCashFlow);


                }

                if ((i % 30 === 0) && (j === 1) && (i < this.state.allOpening.length / 6)) {
                    purchaseCapital += 700;
                }

                if ((i > 3) &&
                    ((this.state.allOpening[i][j] < this.state.allOpening[i - 1][j] * purchaseCondition)
                        || (this.state.allOpening[i][j] < this.state.allOpening[i - 2][j] * purchaseCondition)
                        || (this.state.allOpening[i][j] < this.state.allOpening[i - 3][j] * purchaseCondition))
                    && (buyBlock === 0) && (purchaseCapital > 0)) {

                    if(!purchases[purchaseCounter]) {
                        purchases[purchaseCounter] = {};
                    }

                    purchases[purchaseCounter].date = this.state.allOpening[i][0];
                    purchases[purchaseCounter].symbol = this.state.allOpening[0][j]; //szimbólum neve
                    purchases[purchaseCounter].quantity = Math.floor(maxPurchaseAmount / actualPrice);

                    purchaseCapital -= Math.floor(maxPurchaseAmount / actualPrice) * actualPrice;

                    Object.keys(this.state.pieceOfStock).forEach((key) => {
                        if (this.state.pieceOfStock[key].symbol === this.state.allOpening[0][j]){
                            this.state.pieceOfStock[key].piece = this.state.pieceOfStock[key].piece + Math.floor(maxPurchaseAmount / actualPrice);
                            this.state.pieceOfStock[key].valueInitial = actualPrice * this.state.pieceOfStock[key].piece;
                        }
                    });


                    freeCashFlow = freeCashFlow - actualPrice * Math.floor(maxPurchaseAmount / actualPrice);
                    purchaseCounter++;
                }


                Object.keys(this.state.pieceOfStock).forEach((key) => {
                    if (this.state.pieceOfStock[key].symbol === this.state.allOpening[0][j]){
                        if(!myCapital[i]) {
                            myCapital[i] = [];
                            myCapital[i][1] = 0;
                        }
                        myCapital[i][0] = this.state.allOpening[i][0];
                        myCapital[i][1] = myCapital[i][1] +  this.state.pieceOfStock[key].piece * actualPrice;
                    }
                });

                Object.keys(this.state.pieceOfStock).forEach((key) => {
                    if (this.state.pieceOfStock[key].symbol === this.state.allOpening[0][j]){
                        this.state.pieceOfStock[key].dividend = this.state.pieceOfStock[key].dividend + this.state.allDividend[i][j] * this.state.pieceOfStock[key].piece;
                        this.state.dividendAmount = this.state.dividendAmount + this.state.allDividend[i][j] * this.state.pieceOfStock[key].piece;

                        this.state.pieceOfStock[key].valueNow = this.state.pieceOfStock[key].piece * actualPrice;
                        if(this.state.allDividend[i][j] !== 0) {
                            console.log(
                                "dátum: " + this.state.allOpening[i][0] +
                                ", részvény: " + this.state.pieceOfStock[key].symbol +
                                ", db: " + this.state.pieceOfStock[key].piece +
                                ", érték vásárláskor: " + this.state.pieceOfStock[key].valueInitial +
                                ", érték jelenleg: " +this.state.pieceOfStock[key].valueNow +
                                ", összesen: " + this.state.pieceOfStock[key].piece*this.state.allDividend[i][j] +
                                ", eddigi összes: " + this.state.dividendAmount
                            );
                        }

                        if(!myCapitalWithDividend[i]) {
                            myCapitalWithDividend[i] = [];
                            myCapitalWithDividend[i][1] = 0;
                        }
                        myCapitalWithDividend[i][0] = this.state.allOpening[i][0];
                        myCapitalWithDividend[i][1] =
                            myCapitalWithDividend[i][1] +
                            this.state.pieceOfStock[key].piece * actualPrice +
                            this.state.dividendAmount / Object.keys(this.state.pieceOfStock).length;
                    }
                });
            }
            /* összehasonlítós diagram előállítása */
            if(!myCapitalCompare[i]) {
                myCapitalCompare[i] = [];
                myCapitalCompare[i][1] = 0;
                myCapitalCompare[i][2] = 0;
                myCapitalCompare[i][3] = 0;
            }

            myCapitalCompare[i][0] = this.state.allOpening[i][0];
            myCapitalCompare[i][1] = myCapital[i][1] + purchaseCapital;
            myCapitalCompare[i][2] = myCapitalWithDividend[i][1] + purchaseCapital;
            myCapitalCompare[i][3] = Number(700 * monthCounter);

            if((i % 30 === 0) && (i < this.state.allOpening.length / 6)) {
                monthCounter++;
            }
        }

        this.state.myCapital = myCapital;
        this.state.myCapitalWithDividend = myCapitalWithDividend;
        this.state.myCapitalCompare = myCapitalCompare;
        console.log(myCapitalCompare);
        console.log("végül: " + freeCashFlow);
        console.log(this.state.pieceOfStock);
        console.log(Object.keys(this.state.pieceOfStock).length);
        console.log(myCapital);
        console.log(purchases);
        console.log(capital);
        console.log(dividends);

        this.setState({showDiagram: true});
    }

    showDiagramFunc = (e) => {
        var capital = this.state.startCapital;
        var lastValue = this.state.stockData[this.state.stockData.length -1][1];
        var stockBit = Math.floor(capital / lastValue);
        var allDividend = 0;
        var dividendValue = 0;
        var dividend = 0;
        var container = 0;
        var actualDividend = 0;
        var firstDividend = false;
        var avg = 0;
        var sum = 0;

        e.preventDefault();
        this.setState({showDiagram: true});

        console.log(capital);
        console.log("legutóbbi dátum" + lastValue);
        console.log("ennyi részvényt tudunk venni:" + stockBit);
        capital = capital - lastValue * stockBit;
        console.log(capital);

        for (var i=1; i<this.stockDatas.length; i++) {

            if ((this.stockDatas[i][0] < this.state.startInterval)) {
                avg=avg+this.stockDatas[i][1];
                sum++;
            }

            if ((this.stockDatas[i][0] === this.state.startInterval)) {
                avg = avg / sum;
            }

            if ((this.stockDatas[i][0] < this.state.startInterval) || (this.stockDatas[i][0] > this.state.endInterval)) {
                this.stockDatas.splice(i,1);
                this.dividends.splice(i,1);
                this.dividendDatas.splice(i,1);
                this.capitalDifference.splice(i,1);
                this.dividendPerShare.splice(i,1);
                this.myCapital.splice(i,1);
                i--;
            }
        }

        console.log(avg);

        for (var i=1; i < this.dividends.length; i++) {
            allDividend = allDividend + this.dividends[i][1];
            console.log(allDividend);
            container = this.dividends[i][1];
            this.dividends[i][1] = dividendValue + this.dividends[i][1];
            dividendValue = dividendValue + container;
        }

        for (var i=1; i < this.dividends.length; i++) {
            dividend = this.dividends[i][1];
            if(dividend > 0) {
                this.onlyPaidDateDividend.push(this.dividends[i]);
            }
            dividend = dividend + this.dividends[i];
        }
        this.onlyPaidDateDividend.unshift(['date', '$']);
        console.log(this.dividends);

        for (var i=1; i < this.myCapital.length; i++) {
            this.myCapital[i][1] = (this.myCapital[i][1] + this.dividends[i][1]);
        }
        console.log(this.myCapital);

        for (var i=1; i < this.capitalDifference.length; i++) {
            this.capitalDifference[i][2] = this.myCapital[i][1];
        }

        for (var i=1; i < this.dividendPerShare.length; i++) {
            if (this.dividendDatas[i][1] > 0) {
                if (firstDividend === true){
                    if (actualDividend*2 < this.dividendDatas[i][1]) {
                        actualDividend = actualDividend;
                    }
                    else {
                        actualDividend = this.dividendDatas[i][1];
                    }
                }
                else {
                    actualDividend = this.dividendDatas[i][1];
                }

                firstDividend = true;
            }

            if (actualDividend === 0) {
                this.dividendPerShare[i][1] = 0;
            }

            else {
                this.dividendPerShare[i][1] = actualDividend / this.dividendPerShare[i][1];
            }
        }


    };

    handleSymbolSelect = (e)=>{
        let newSymbols = [...this.state.symbols];
        let selected = newSymbols.find(x=>x.symbol === e.target.value);
        selected.checked = e.target.checked;
        this.setState({symbols:newSymbols});
    }

    render() {
        return (
            <Grid container spacing={32} alignItems="center">
                <Grid item xs={4}>
                    <form>
                        <Paper className="form-container">
                            <div className="form-container__header">
                                Simulation
                            </div>
                            {this.state.dataIsLoaded === undefined
                                ?
                                <div>
                                    <FormLabel component="legend">
                                        <strong>
                                            Select your symbols
                                        </strong>
                                    </FormLabel>
                                    <Grid container spacing={32} alignItems="center" className="mt-8">
                                        <Grid item xs={12}>
                                            <FormControl component="fieldset">
                                                <FormGroup>
                                                    {this.state.symbols.map(symbol => (
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox value={symbol.symbol} checked={symbol.checked} onChange={this.handleSymbolSelect} />
                                                            }
                                                            label={symbol.title}
                                                        />
                                                    ))}
                                                </FormGroup>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Fab color="primary" variant="extended" size="medium"
                                                 onClick={this.downloadData}
                                                 disabled={this.state.downloadIsDisabled}
                                            >
                                                Download data <CloudDownload className={"ml-8"}

                                            />
                                            </Fab>
                                        </Grid>
                                    </Grid>
                                </div>
                                :
                                (this.state.dataIsLoaded === false ?
                                        <div>
                                            <CircularProgress color="primary"/>
                                        </div>
                                        :
                                        <div>
                                            <Grid container spacing={32} alignItems="center" className="mt-16">
                                                <Grid item xs={12}>
                                                    <FormLabel component="legend">
                                                        <strong>
                                                            Interval management
                                                        </strong>
                                                    </FormLabel>
                                                    <Grid container spacing={32} alignItems="center">
                                                        <Grid item xs={6}>
                                                            <FormControl margin="normal" fullWidth>
                                                                <TextField
                                                                    type="date"
                                                                    label="start of interval"
                                                                    name="startInterval"
                                                                    InputLabelProps={{
                                                                        shrink: true,
                                                                    }}
                                                                    value={this.state.startInterval}
                                                                    onChange={this.handleChange}/>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FormControl margin="normal" fullWidth>
                                                                <TextField
                                                                    type="date"
                                                                    label="end of interval"
                                                                    name="endInterval"
                                                                    InputLabelProps={{
                                                                        shrink: true,
                                                                    }}
                                                                    value={this.state.endInterval}
                                                                    onChange={this.handleChange}/>
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FormLabel component="legend">
                                                        <strong>
                                                            Capital management
                                                        </strong>
                                                    </FormLabel>
                                                    <Grid container spacing={32} alignItems="center" justify="flex-start">
                                                        <Grid item xs={12}>
                                                            <FormControl margin="normal" fullWidth>
                                                                <TextField
                                                                    id="free-cash-flow"
                                                                    label="starting capital"
                                                                    type="number"
                                                                    variant="outlined"
                                                                    name="startCapital"
                                                                    InputProps={{
                                                                        endAdornment: <InputAdornment
                                                                            position="end">$</InputAdornment>,
                                                                    }}
                                                                    value={this.state.startCapital}
                                                                    onChange={this.handleChange}
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Grid container spacing={32} alignItems="center"
                                                              justify="flex-start">
                                                            <Grid item xs={12}>
                                                                <FormControl margin="none" fullWidth>
                                                                    <TextField
                                                                        id="free-cash-flow"
                                                                        label="purchase amount"
                                                                        type="number"
                                                                        variant="outlined"
                                                                        name="maxPurchaseAmount"
                                                                        InputProps={{
                                                                            endAdornment: <InputAdornment
                                                                                position="end">$</InputAdornment>,
                                                                        }}
                                                                        value={this.state.maxPurchaseAmount}
                                                                        onChange={this.handleChange}
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Grid container spacing={32} alignItems="center"
                                                              justify="flex-start">
                                                            <Grid item xs={12}>
                                                                <FormControl margin="none" fullWidth>
                                                                    <TextField
                                                                        id="free-cash-flow"
                                                                        label="purchase condition"
                                                                        type="number"
                                                                        variant="outlined"
                                                                        name="purchaseCondition"
                                                                        InputProps={{
                                                                            endAdornment: <InputAdornment
                                                                                position="end">%</InputAdornment>,
                                                                        }}
                                                                        value={this.state.purchaseCondition}
                                                                        onChange={this.handleChange}
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Fab color="secondary" variant="extended" size="medium"
                                                         onClick={this.dataToObject}
                                                         disabled={this.state.simulateIsDisabled}
                                                    >
                                                        Simulate
                                                        <BarChart/>
                                                    </Fab>
                                                </Grid>
                                            </Grid>
                                        </div>
                                )}
                        </Paper>
                    </form>
                </Grid>

                {this.state.showDiagram === false
                    ?
                    <div>

                    </div>
                    :
                    <div>
                        <Grid item xs={12}>
                            <div className={"my-pretty-chart-container"}>
                                <Chart
                                    width={'1400px'}
                                    height={'600px'}
                                    chartType="LineChart"
                                    data={this.state.allOpening}
                                    options={{
                                        hAxis: {
                                            title: 'Time',
                                        },
                                        vAxis: {
                                            title: 'Openings',
                                        },
                                    }}
                                    rootProps={{'data-testid': '1'}}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <div className={"my-pretty-chart-container"}>
                                <Chart
                                    width={'1400px'}
                                    height={'600px'}
                                    chartType="LineChart"
                                    data={this.state.allDividend}
                                    options={{
                                        hAxis: {
                                            title: 'Time',
                                        },
                                        vAxis: {
                                            title: 'Dividends',
                                        },
                                    }}
                                    rootProps={{'data-testid': '1'}}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <div className={"my-pretty-chart-container"}>
                                <Chart
                                    width={'1400px'}
                                    height={'600px'}
                                    chartType="LineChart"
                                    data={this.state.myCapital}
                                    options={{
                                        hAxis: {
                                            title: 'Time',
                                        },
                                        vAxis: {
                                            title: 'Dividends',
                                        },
                                    }}
                                    rootProps={{'data-testid': '1'}}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <div className={"my-pretty-chart-container"}>
                                <Chart
                                    width={'1400px'}
                                    height={'600px'}
                                    chartType="LineChart"
                                    data={this.state.myCapitalWithDividend}
                                    options={{
                                        hAxis: {
                                            title: 'Time',
                                        },
                                        vAxis: {
                                            title: 'Dividends',
                                        },
                                    }}
                                    rootProps={{'data-testid': '1'}}
                                />
                            </div>
                        </Grid>

                        <Grid item xs={12}>
                            <div className={"my-pretty-chart-container"}>
                                <Chart
                                    width={'1400px'}
                                    height={'600px'}
                                    chartType="LineChart"
                                    data={this.state.myCapitalCompare}
                                    options={{
                                        hAxis: {
                                            title: 'Time',
                                        },
                                        vAxis: {
                                            title: 'Dividends',
                                        },
                                    }}
                                    rootProps={{'data-testid': '1'}}
                                />
                            </div>
                        </Grid>
                    </div>
                }
            </Grid>
        );
    }
}


export default Simulation;
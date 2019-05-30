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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Icon from '@material-ui/core/Icon';
import axios from 'axios';
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";

// const availableSymbols = [
//     {symbol: "MSFT", title: "Microsoft"},
//     {symbol: "AAPL", title: "Apple"},
// ]

class Simulation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apiKeys: [
                "A2W38D3WS7J0R7J1",
                "X6L7N691EZB1N3CJ",
                "J0B1FY4RMTXYH268",
                "54JICR6CEA006X86",
                "DBDPWO34WDYWJ46M",
                "3UKM1X56EDN0MJE5",
                "7C0WJM71BAIT2ED4" //PREMIUM
            ],
            startInterval: "2010-05-07",
            endInterval: "2019-05-07",
            startCapital: 100000,
            maxPurchaseAmount: 2000,
            purchaseCondition: 5,
            sellingCondition: undefined,
            stringency: undefined,
            symbol: undefined,
            symbols: [
                {symbol: "CBL", title: "CBL", checked: true},
                {symbol: "PEI", title: "PEI", checked: true},
                {symbol: "SMHD", title: "SMHD", checked: true},
                {symbol: "KREF", title: "KREF", checked: true},
                {symbol: "HPT", title: "HPT", checked: true},
                {symbol: "SKT", title: "SKT", checked: true},
                {symbol: "KRG", title: "KRG", checked: true},
                {symbol: "MAC", title: "MAC", checked: true},
                {symbol: "BPR", title: "BPR", checked: true},
                {symbol: "BRX", title: "BRX", checked: true},
                {symbol: "KIM", title: "KIM", checked: true},
                {symbol: "SITC", title: "SITC", checked: true},
                {symbol: "WRI", title: "WRI", checked: true},
                {symbol: "TCO", title: "TCO", checked: true},
                {symbol: "MNR", title: "MNR", checked: true},
                {symbol: "UE", title: "UE", checked: true},
                {symbol: "SPG", title: "SPG", checked: true},
                {symbol: "ROIC", title: "ROIC", checked: true},
                {symbol: "GTY", title: "GTY", checked: true},
                {symbol: "O", title: "O", checked: true},
                {symbol: "CUBE", title: "CUBE", checked: true},
                {symbol: "NNN", title: "NNN", checked: true},
                {symbol: "REG", title: "REG", checked: true},
                {symbol: "ADC", title: "ADC", checked: true},

                /*{symbol: "T", title: "AT&T", checked: true},
                {symbol: "BEP", title: "Brookfield Renewable Partners", checked: true},
                {symbol: "IRM", title: "Iron Mountain Incorporated", checked: true},
                {symbol: "JNJ", title: "Johnson & Johnson", checked: true},
                {symbol: "WELL", title: "Welltower Inc", checked: true},
                {symbol: "CVX", title: "cvx", checked: true},
                {symbol: "OXY", title: "oxy", checked: true},
                {symbol: "MCD", title: "mcd", checked: true},
                {symbol: "PM", title: "pm", checked: true},
                {symbol: "KO", title: "ko", checked: true},
                {symbol: "CBRL", title: "cbrl", checked: true},
                {symbol: "TGT", title: "tgt", checked: true},
                {symbol: "GIS", title: "gis", checked: true},
                {symbol: "KMI", title: "kmi", checked: true},
                {symbol: "QCOM", title: "qcom", checked: true},
                {symbol: "IBM", title: "ibm", checked: true},
                {symbol: "HP", title: "hp", checked: true},
                {symbol: "XOM", title: "xom", checked: true},
                {symbol: "SU", title: "su", checked: true},
                {symbol: "PEP", title: "pep", checked: true},
                {symbol: "PG", title: "pg", checked: true},
                {symbol: "MMM", title: "mmm", checked: true},
                {symbol: "TROW", title: "trow", checked: true},
                {symbol: "ADM", title: "adm", checked: true},
                {symbol: "WHR", title: "whr", checked: true},
                {symbol: "UTX", title: "utx", checked: true},
                {symbol: "GPS", title: "gps", checked: true},
                {symbol: "CMI", title: "cmi", checked: true},
                {symbol: "FLO", title: "flo", checked: true},
                {symbol: "DIS", title: "dis", checked: true}*/
            ],
            pieceOfStock: [],
            lastDividends: [],
            purchases: [],
            dividends: [],
            dataIsLoaded: undefined,
            allData: {},
            items: [],
            stockData: [],
            dividendDatas: [],
            onlyPaidDateDividend: [],
            moneyPerMonth: undefined,
            yieldPerMonth: undefined,
            myCapital: [],
            myCapitalWithDividend: [],
            myCapitalCompare: [],
            capitalDifference: [],
            openToDividend: [],
            allOpening: [],
            allDividend: [],
            allDps: [],
            allDividendYield: [],
            allVolume: [],
            allSplit: [],
            dividendAmount: 0,
            capital: 0,
            showDiagram: false,
            calculated: false,
            simulateIsDisabled: true,
            downloadIsDisabled: false,
            reitResults: [
                ["hosszútáv / rövidtáv", "5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%"],
                [1, 0.4901,	    0.4901,	0.476,	0.5075,	0.4909,	0.5487,	0.6013,	0.7266,	0.6945,	0.8446,	0.8993],
                [2, 0.5666,	    0.6175,	0.6161,	0.6445,	0.6423,	0.7378,	0.7183,	0.8459,	0.9365,	0.9731, 0.9862],
                [3, 0.6893,	    0.7198,	0.7179,	0.72,	0.7635,	0.7335,	0.8158,	0.9217,	0.9598,	0.999,	1.0154],
                [4, 0.698,	    0.7311,	0.7168,	0.834,	0.7433,	0.7306,	0.9214,	0.9406,	0.9858,	0.999,	1.0155],
                [5, 0.7087,	    0.7505,	0.8541,	0.7881,	0.7453,	0.8287,	0.9706,	0.9623,	0.9743,	1.0062,	1.0248],
                [10, 0.7277,	0.8153,	0.7747,	0.7684,	0.7886,	1.009,	1.0171,	1.0308,	1.0317,	1.0534,	1.0474],
                [15, 0.8219,	0.7724,	0.7714,	0.7721,	0.7994,	1.0165,	1.03,	1.0456,	1.0484,	1.075,	1.0706],
                [20, 0.8406,	0.7642,	0.7676,	0.7767,	0.8144,	1.0267,	1.0424,	1.0599,	1.0648,	1.0965,	1.0939],
                [25, 0.8327,	0.7615,	0.7568,	0.7898,	0.8652,	1.0316,	1.0501,	1.071,	1.0648,	1.0696,	1.064],
                [30, 0.8115,	0.7495,	0.7472,	0.7945,	0.8652,	1.0316,	1.0501,	1.071,	1.0783,	1.0696,	1.064]
            ]
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
        for(var i = 0; i < this.state.symbols.length; i++) {
            console.log(Math.trunc(i/5));
        }
    }

    downloadData = (e) => {
        e.preventDefault();
        this.setState({dataIsLoaded: false});
        var symbolCounter = 0;
        var pieceOfStock = [];

        const selectedSymbols = this.state.symbols.filter(x=>x.checked);
        selectedSymbols.map((symbol)=>{
            axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=" + symbol.symbol.toUpperCase() + "&outputsize=full&apikey=7C0WJM71BAIT2ED4")
            /*axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=MSFT&outputsize=full&apikey=demo")*/
                .then(res => {
                    /*console.log(res);
                    console.log(res.data);*/
                    Object.keys(res.data['Time Series (Daily)']).forEach((key) => {
                        if(!this.state.allData[key]) {
                            this.state.allData[key] = {};
                        }

                        if(!this.state.allData[key][symbol.symbol]) {
                            this.state.allData[key][symbol.symbol] = {}
                        }

                        this.state.allData[key][symbol.symbol].opening = Number(res.data['Time Series (Daily)'][key]['1. open']);
                        this.state.allData[key][symbol.symbol].volume = Number(res.data['Time Series (Daily)'][key]['6. volume']);
                        this.state.allData[key][symbol.symbol].dividend = Number(res.data['Time Series (Daily)'][key]['7. dividend amount']);
                        this.state.allData[key][symbol.symbol].split = Number(res.data['Time Series (Daily)'][key]['8. split coefficient']);
                    })

                    if(!pieceOfStock[symbolCounter]) {
                        pieceOfStock[symbolCounter] = {};
                    }

                    pieceOfStock[symbolCounter].symbol = symbol.symbol;
                    pieceOfStock[symbolCounter].piece = 0;
                    pieceOfStock[symbolCounter].valueAverage = 0;
                    pieceOfStock[symbolCounter].valueNow = 0;
                    pieceOfStock[symbolCounter].dividend = 0;
                    pieceOfStock[symbolCounter].lastDividend = 0;
                    pieceOfStock[symbolCounter].minDividendYield = 0;
                    pieceOfStock[symbolCounter].maxDividendYield = 0;
                    pieceOfStock[symbolCounter].purchase = 0;

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
            this.state.allDividendYield.push([key]);
            this.state.allSplit.push([key]);
            this.state.allVolume.push([key]);
            this.state.allDps.push([key]);
            this.state.allDividend.push([key]);

            selectedSymbols.map(x => {
                if(this.state.allData[key][x.symbol]) {
                    this.state.allOpening[keyCounter].push(Number(this.state.allData[key][x.symbol].opening));
                    this.state.allDividendYield[keyCounter].push(Number(this.state.allData[key][x.symbol].opening));
                    this.state.allVolume[keyCounter].push(Number(this.state.allData[key][x.symbol].volume));
                    this.state.allDividend[keyCounter].push(Number(this.state.allData[key][x.symbol].dividend));
                    this.state.allDps[keyCounter].push(Number(this.state.allData[key][x.symbol].dividend));
                    this.state.allSplit[keyCounter].push(Number(this.state.allData[key][x.symbol].split));

                }
                else {
                    this.state.allOpening[keyCounter].push(0);
                    this.state.allDividendYield[keyCounter].push(0);
                    this.state.allVolume[keyCounter].push(1);
                    this.state.allDividend[keyCounter].push(0);
                    this.state.allDps[keyCounter].push(0);
                    this.state.allSplit[keyCounter].push(1);
                }

            });
            keyCounter++;
        });

        this.state.allOpening.reverse();
        this.state.allDividend.reverse();
        this.state.allDividendYield.reverse();
        this.state.allSplit.reverse();
        this.state.allDps.reverse();
        this.state.allVolume.reverse();

        this.state.allOpening.unshift(['date']);
        this.state.allDividend.unshift(['date']);
        this.state.allDividendYield.unshift(['date']);
        this.state.allSplit.unshift(['date']);
        this.state.allDps.unshift(['date']);
        this.state.allVolume.unshift(['date']);

        /*console.log(this.state.allOpening);
        console.log(this.state.allDividend);
        console.log(this.state.allDividendYield);
        console.log(this.state.allSplit);*/


        selectedSymbols.map(x => {
            this.state.allOpening[0].push(x.symbol);
            this.state.allDividend[0].push(x.symbol);
            this.state.allDividendYield[0].push(x.symbol);
            this.state.allSplit[0].push(x.symbol);
            this.state.allDps[0].push(x.symbol);
            this.state.allVolume[0].push(x.symbol);

        });

        for (var i=1; i<this.state.allOpening.length; i++) {
            if ((this.state.allOpening[i][0] < this.state.startInterval) || (this.state.allOpening[i][0] > this.state.endInterval)) {
                this.state.allOpening.splice(i, 1);
                this.state.allDividend.splice(i, 1);
                this.state.allDividendYield.splice(i, 1);
                this.state.allSplit.splice(i, 1);
                this.state.allDps.splice(i, 1);
                this.state.allVolume.splice(i, 1);
                i--;
            }
        }

        for (var i=1; i<this.state.allDps.length; i++) {
            if(Number(this.state.allDps[i][1]) === 0) {
                this.state.allDps.splice(i, 1);
                i--;
            }
        }

        console.log(this.state.allDps);

        var lastDividends = [];
        lastDividends[0] = [];
        lastDividends[1] = [];
        var firstDividends = [];
        selectedSymbols.map((s, index) => {
            lastDividends[0][index] = s.symbol;
            lastDividends[1][index] = 0;
            firstDividends[index] = false;
        });

        console.log(lastDividends);


        /*console.log(this.state.allOpening);
        console.log(this.state.allDividend);
        console.log(this.state.allDividendYield);*/
        console.log(this.state.allVolume);
        console.log(this.state.allDps);

        /*vásároljunk*/
        var capital = this.state.startCapital;
        var maxPurchaseAmount = this.state.maxPurchaseAmount;
        var freeCashFlow = capital;
        var dividends = {};
        var lastPayedDividends = [];
        var purchases = [];
        var purchaseCounter = 0;
        var purchaseCondition = 1 - this.state.purchaseCondition / 100;

        var myCapital = [];
        myCapital.unshift(['date', 'amount']);

        var myCapitalWithDividend = [];
        myCapitalWithDividend.unshift(['date', 'amount']);

        var myCapitalCompare = [];
        myCapitalCompare.unshift(['date', 'without dividend', 'with dividend']);

        for (var i=1; i<this.state.allOpening.length; i++) {
            for (var j=1; j<this.state.allOpening[i].length; j++) {
                var actualPrice = this.state.allOpening[i][j];
                var buyBlock = 0;

                if((this.state.allSplit[i][j] !== 1) && (this.state.allSplit[i][j])) {
                    Object.keys(this.state.pieceOfStock).forEach((key) => {
                        if (this.state.pieceOfStock[key].symbol === this.state.allOpening[0][j]){
                            this.state.pieceOfStock[key].piece *= this.state.allSplit[i][j];
                        }
                    });
                }


                //lastDividends feltöltés, a legutóbbi nem kiemelt osztalékok tárolása
                if(this.state.allDividend[i][j] !== 0) {

                    lastPayedDividends[j-1] = this.state.allDividend[j];
                    if(firstDividends[j-1] === false) {
                        lastDividends[1][j-1] = this.state.allDividend[i][j];


                        Object.keys(this.state.pieceOfStock).forEach((key) => {
                            if (this.state.pieceOfStock[key].symbol === this.state.allOpening[0][j]){
                                this.state.pieceOfStock[key].minDividendYield = lastDividends[1][j-1] / this.state.allDividendYield[i][j];
                                this.state.pieceOfStock[key].maxDividendYield = lastDividends[1][j-1] / this.state.allDividendYield[i][j];
                            }
                        });
                    }
                    else {
                        if(lastDividends[1][j-1]*4 > this.state.allDividend[i][j]) {
                            lastDividends[1][j-1] = this.state.allDividend[i][j];

                            Object.keys(this.state.pieceOfStock).forEach((key) => {
                                if (this.state.pieceOfStock[key].symbol === this.state.allOpening[0][j]){
                                    if(lastDividends[1][j-1] / this.state.allDividendYield[i][j] > this.state.pieceOfStock[key].maxDividendYield) {
                                        this.state.pieceOfStock[key].maxDividendYield = lastDividends[1][j-1] / this.state.allDividendYield[i][j];
                                    }

                                    if(lastDividends[1][j-1] / this.state.allDividendYield[i][j] < this.state.pieceOfStock[key].minDividendYield) {
                                        this.state.pieceOfStock[key].minDividendYield = lastDividends[1][j-1] / this.state.allDividendYield[i][j];
                                    }
                                }
                            });
                        }
                    }

                    firstDividends[j-1] = true;
                }

                //DividendYield feltöltése
                if(lastDividends[1][j-1] !== 0) {
                    this.state.allDividendYield[i][j] = lastDividends[1][j-1] / this.state.allDividendYield[i][j];
                } else {
                    this.state.allDividendYield[i][j] = 0;
                }

                var allMinDividendYield = [];
                var allMaxDividendYield = [];
                var avgDividendYield = 0;
                var maxDividendYield = 0;

                Object.keys(this.state.pieceOfStock).forEach((key, index) => {
                    allMinDividendYield[index] = this.state.pieceOfStock[key].minDividendYield;
                    allMaxDividendYield[index] = this.state.pieceOfStock[key].maxDividendYield;

                    avgDividendYield += this.state.pieceOfStock[key].maxDividendYield;

                    if(maxDividendYield < this.state.pieceOfStock[key].maxDividendYield) {
                        maxDividendYield = this.state.pieceOfStock[key].maxDividendYield;
                    }
                });

                avgDividendYield = avgDividendYield / this.state.symbols.length;
                /*console.log(this.state.symbols.length);*/


                if ((i > 30) &&
                    ((this.state.allOpening[i][j] < this.state.allOpening[i - 1][j] * purchaseCondition)
                        || (this.state.allOpening[i][j] < this.state.allOpening[i - 2][j] * purchaseCondition)
                        || (this.state.allOpening[i][j] < this.state.allOpening[i - 3][j] * purchaseCondition))
                    && (this.state.allDividendYield[i][j] > maxDividendYield - ((maxDividendYield - avgDividendYield) / this.state.stringency))
                    && (buyBlock === 0) && (capital > this.state.maxPurchaseAmount)) {
                    /*console.log(allMaxDividendYield[j-1] - ((allMaxDividendYield[j-1] - allMinDividendYieldDividendYield[j-1])*0.1));*/
                    if(!purchases[purchaseCounter]) {
                        purchases[purchaseCounter] = {};
                    }

                    purchases[purchaseCounter].date = this.state.allOpening[i][0];
                    purchases[purchaseCounter].symbol = this.state.allOpening[0][j]; //szimbólum neve
                    purchases[purchaseCounter].quantity = Math.floor(maxPurchaseAmount / actualPrice);

                    capital -= Math.floor(maxPurchaseAmount / actualPrice) * actualPrice;

                    Object.keys(this.state.pieceOfStock).forEach((key) => {
                        if (this.state.pieceOfStock[key].symbol === this.state.allOpening[0][j]){
                            this.state.pieceOfStock[key].purchase += 1;
                            this.state.pieceOfStock[key].piece = this.state.pieceOfStock[key].piece + Math.floor(maxPurchaseAmount / actualPrice);
                            this.state.pieceOfStock[key].valueAverage = ((this.state.pieceOfStock[key].purchase - 1) * (this.state.pieceOfStock[key].valueAverage) + actualPrice) / this.state.pieceOfStock[key].purchase;
                        }
                    });


                    freeCashFlow = freeCashFlow - actualPrice * Math.floor(maxPurchaseAmount / actualPrice);
                    purchaseCounter++;
                }


                Object.keys(this.state.pieceOfStock).forEach((key) => {
                    if (this.state.pieceOfStock[key].symbol === this.state.allOpening[0][j]){
                    }
                });

                Object.keys(this.state.pieceOfStock).forEach((key) => {
                    if (this.state.pieceOfStock[key].symbol === this.state.allOpening[0][j]){

                        if(!myCapital[i]) {
                            myCapital[i] = [];
                            myCapital[i][1] = 0;
                        }
                        myCapital[i][0] = this.state.allOpening[i][0];
                        myCapital[i][1] = myCapital[i][1] +  this.state.pieceOfStock[key].piece * actualPrice;

                        this.state.pieceOfStock[key].dividend = this.state.pieceOfStock[key].dividend + this.state.allDividend[i][j] * this.state.pieceOfStock[key].piece;
                        this.state.dividendAmount = this.state.dividendAmount + this.state.allDividend[i][j] * this.state.pieceOfStock[key].piece;

                        this.state.pieceOfStock[key].valueNow = actualPrice;
                        /*if(this.state.allDividend[i][j] !== 0) {
                            console.log(
                                "dátum: " + this.state.allOpening[i][0] +
                                ", részvény: " + this.state.pieceOfStock[key].symbol +
                                ", db: " + this.state.pieceOfStock[key].piece +
                                ", érték vásárláskor: " + this.state.pieceOfStock[key].valueAverage +
                                ", érték jelenleg: " +this.state.pieceOfStock[key].valueNow +
                                ", összesen: " + this.state.pieceOfStock[key].piece*this.state.allDividend[i][j] +
                                ", eddigi összes: " + this.state.dividendAmount
                            );
                        }*/

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
            }

            myCapitalCompare[i][0] =  this.state.allOpening[i][0];
            myCapitalCompare[i][1] = myCapital[i][1] + capital;     // azzal hogy hozzáadtam a capitalt, a compare-s diagramban nem 0-tól kezdődnek az értékek
            myCapitalCompare[i][2] = myCapitalWithDividend[i][1] + capital;
        }



        console.log(this.state.allDividendYield);

        console.log(this.state.allDps);
        console.log(lastDividends);
        this.setState({lastDividends : lastDividends});
        console.log(this.state.lastDividends);
        this.setState({myCapital : myCapital});
        this.setState({myCapitalWithDividend : myCapitalWithDividend});
        this.setState({myCapitalCompare : myCapitalCompare});
        this.setState({purchases : purchases});
        console.log(myCapitalCompare);
        console.log("végül: " + freeCashFlow);
        console.log(this.state.pieceOfStock);
        console.log(Object.keys(this.state.pieceOfStock).length);
        console.log(myCapital);
        console.log(purchases);
        console.log(capital);
        console.log(dividends);

        this.setState({capital : capital});

        this.setState({showDiagram: true});
    }

    moneyPerMonth  = (e) => {
        let moneyPerMonth = 0;
        let yieldPerMonth;
        e.preventDefault();

        Object.keys(this.state.pieceOfStock).forEach((key) => {
            for(var i = 0; i < this.state.lastDividends[0].length; i++) {
                if(this.state.lastDividends[0][i] === this.state.pieceOfStock[key].symbol) {
                    moneyPerMonth += this.state.pieceOfStock[key].piece * this.state.lastDividends[1][i];
                }
            }
        });

        console.log(moneyPerMonth / 3 + "$, " + moneyPerMonth * 289 / 3 + "ft");
        let spentMoney = this.state.startCapital - this.state.capital;
        yieldPerMonth = moneyPerMonth / 3 / (spentMoney / 100);
        console.log(yieldPerMonth);


        this.state.moneyPerMonth = moneyPerMonth;
        this.state.yieldPerMonth = yieldPerMonth;

        console.log(this.state.moneyPerMonth);
        console.log(this.state.yieldPerMonth);
        console.log(this.state.yieldPerMonth * 12);
        this.setState({calculated : true});
    }

    setStringency = (e) => {
        this.setState({stringency : e.target.value});
    }

    handleSymbolSelect = (e)=>{
        let newSymbols = [...this.state.symbols];
        let selected = newSymbols.find(x=>x.symbol === e.target.value);
        selected.checked = e.target.checked;
        this.setState({symbols:newSymbols});
    }

    render() {
        return (
            <Grid container spacing={32} alignItems="center">



                {/*<Grid item xs={12}>
                    <div className={"my-pretty-chart-container"}>
                        <Chart
                            width={'1100px'}
                            height={'600px'}
                            chartType="LineChart"
                            data={this.state.reitResults}
                            options={{
                                hAxis: {
                                    title: 'Time',
                                },
                                vAxis: {
                                    title: 'Dividend Yield',
                                },
                            }}
                            rootProps={{'data-testid': '1'}}
                        />
                    </div>
                </Grid>
                <Grid>
                    <div className="p-50">
                        <div className="table-title">
                            My Revenue
                        </div>
                        <Paper>
                            <Table>
                                <TableHead>
                                        {this.state.reitResults.map((item, index)=>(
                                            index === 0
                                            ?
                                            <TableRow>
                                                {this.state.reitResults[index].map(value=>(
                                                        <TableCell>
                                                            {value}
                                                        </TableCell>
                                                ))}
                                            </TableRow>
                                            :
                                            ""
                                            ))}
                                </TableHead>
                                <TableBody>
                                    {this.state.reitResults.map((item, index)=>(
                                        index > 0
                                        ?
                                        <TableRow>
                                            {this.state.reitResults[index].map(value=>(
                                                <TableCell>
                                                    {value}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                        :
                                        ""
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </div>
                </Grid>*/}





                <Grid item xs={12}>
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
                                        <FormControl component="fieldset">
                                            <FormLabel component="legend">
                                                <strong>
                                                    Stringency condition
                                                </strong>
                                            </FormLabel>
                                            <RadioGroup className="flex-row" aria-label="Stringency condition" name="stringency">
                                                <FormControlLabel value="1" control={<Radio />} onClick={this.setStringency} label="1" />
                                                <FormControlLabel value="2" control={<Radio />} onClick={this.setStringency} label="2" />
                                                <FormControlLabel value="3" control={<Radio />} onClick={this.setStringency} label="3" />
                                                <FormControlLabel value="4" control={<Radio />} onClick={this.setStringency} label="4" />
                                                <FormControlLabel value="5" control={<Radio />} onClick={this.setStringency} label="5" />
                                                <FormControlLabel value="6" control={<Radio />} onClick={this.setStringency} label="6" />
                                                <FormControlLabel value="7" control={<Radio />} onClick={this.setStringency} label="7" />
                                                <FormControlLabel value="8" control={<Radio />} onClick={this.setStringency} label="8" />
                                                <FormControlLabel value="9" control={<Radio />} onClick={this.setStringency} label="9" />
                                                <FormControlLabel value="10" control={<Radio />} onClick={this.setStringency} label="10" />
                                                <FormControlLabel value="15" control={<Radio />} onClick={this.setStringency} label="15" />
                                                <FormControlLabel value="20" control={<Radio />} onClick={this.setStringency} label="20" />
                                                <FormControlLabel value="25" control={<Radio />} onClick={this.setStringency} label="25" />
                                                <FormControlLabel value="30" control={<Radio />} onClick={this.setStringency} label="30" />
                                            </RadioGroup>
                                        </FormControl>
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
                                    <Grid item xs={12}>
                                        <Fab color="secondary" variant="extended" size="medium"
                                             onClick={this.moneyPerMonth}
                                        >
                                            Calculate revenue
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
                        {this.state.calculated === true
                            ?
                            <Grid item xs={8}>
                                <div className="p-50">
                                    <div className="table-title">
                                        My Revenue
                                    </div>
                                    <Paper>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Yield per month</TableCell>
                                                    <TableCell>Yield per year</TableCell>
                                                    <TableCell>Money per month in USD</TableCell>
                                                    <TableCell>Money per month in HUF</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>
                                                        {this.state.yieldPerMonth.toFixed(4)} %
                                                    </TableCell>
                                                    <TableCell>
                                                        {(this.state.yieldPerMonth * 12).toFixed(4)} %
                                                    </TableCell>
                                                    <TableCell>
                                                        {(this.state.moneyPerMonth / 3).toFixed(4)} $
                                                    </TableCell>
                                                    <TableCell>
                                                        {(this.state.moneyPerMonth / 3 * 289).toFixed(4)} Ft
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </Paper>
                                </div>
                            </Grid>
                            :
                            ""
                        }
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
                                    data={this.state.allDividendYield}
                                    options={{
                                        hAxis: {
                                            title: 'Time',
                                        },
                                        vAxis: {
                                            title: 'Dividend Yield',
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
                                            title: 'Capital in stocks',
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
                                            title: 'Capital with dividend',
                                        },
                                    }}
                                    rootProps={{'data-testid': '1'}}
                                />
                            </div>
                        </Grid>



                        <Grid item xs={8}>
                            <div className="p-50">
                                <div className="table-title">
                                    My Stocks
                                </div>
                                <Paper>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Symbol</TableCell>
                                                <TableCell>Piece</TableCell>
                                                <TableCell>Divident Amount</TableCell>
                                                <TableCell>Value Average</TableCell>
                                                <TableCell>Value now</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {this.state.pieceOfStock.map( stock => (
                                                stock.piece !== 0
                                                    ?
                                                    <TableRow>
                                                        <TableCell>
                                                            {stock.symbol}
                                                        </TableCell>
                                                        <TableCell>
                                                            {stock.piece}
                                                        </TableCell>
                                                        <TableCell>
                                                            {stock.dividend}
                                                        </TableCell>
                                                        <TableCell>
                                                            {stock.valueAverage}
                                                        </TableCell>
                                                        <TableCell>
                                                            {stock.valueNow}
                                                        </TableCell>
                                                    </TableRow>
                                                    :
                                                    ""
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Paper>
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

                        <Grid item xs={8}>
                            <div className="p-50">
                                <div className="table-title">
                                    My Purchases
                                </div>
                                <Paper>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Number</TableCell>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Symbol</TableCell>
                                                <TableCell>Quantity</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {this.state.purchases.map( (purchase, index) => (
                                                <TableRow>
                                                    <TableCell>
                                                        {index + 1}.
                                                    </TableCell>
                                                    <TableCell>
                                                        {purchase.date}
                                                    </TableCell>
                                                    <TableCell>
                                                        {purchase.symbol}
                                                    </TableCell>
                                                    <TableCell>
                                                        {purchase.quantity}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </div>
                        </Grid>
                    </div>
                }
            </Grid>
        );
    }
}


export default Simulation;
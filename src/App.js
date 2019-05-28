import React, { Component } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'
import TypoGraphy from "@material-ui/core/Typography"
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

import {
  FormControl,
  Grid,
  InputLabel,
  Input,
  Button,
  TextField
} from "@material-ui/core";

import Home from "./components/Home"
import SimpleMenu from "./components/SimpleMenu"
import Simulation from "./components/Simulation"
import './App.css';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const stocktheme = createMuiTheme({
  overrides: {
    MuiAppBar: {
      colorPrimary: {
        background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)'
      }
    },
    MuiButton: {
      colorPrimary: {
        background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)'
      },
    },
  },
  typography: { useNextVariants: true },
});

function TabContainer(props) {
  return (
      <TypoGraphy component="div" style={{ padding: 8 * 3 }}>
        {props.children}
      </TypoGraphy>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};



class App extends Component {

  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    const { anchorEl } = this.state;

    return (
      <div className="App">
        <MuiThemeProvider theme={stocktheme}>
          <AppBar color="primary" position="static">
            <Tabs value={value} onChange={this.handleChange}>
              <Tab label="Bestimate" />
            </Tabs>
          </AppBar>
          {value === 0 && <TabContainer>
            <Simulation/>
          </TabContainer>}
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;

import React, { Children, Component, useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CreatePipeline from './createPipeline';
import Pipeline from './pipeline';
import app from "../firebase/firebase.js";
import {Route,Redirect, BrowserRouter as Router, Switch, Link} from 'react-router-dom';
import { ListItem } from '@material-ui/core';
import PrivateRoute from './router';
import CustomRoute from './customRoute';
import { AuthContext } from './authentication';
import {useHistory } from 'react-router-dom';
import PipelineDataService from '../firebase/pipelineDataService';
import SchemaConfig from './schemaConfig';
import firebase from "../firebase/firebase";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexdirection: 'column',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function PersistentDrawerLeft() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState(null);

  const handleDrawerOpen = () => {

    setOpen(true);
  };

  const getUserName=()=>{
    var uid = firebase.auth().currentUser.uid;
    let name;
    firebase.database().ref('users/'+uid).on("value", snapshot => {
      name = snapshot.val().userName
      setUserName(name)
      console.log(name)
  });
}

  const handleDrawerClose = () => {
    setOpen(false);
  };



  return (
    <div className={classes.root}>
      <Router>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
        
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          
          <div>
            <h1>EpiDataFuse</h1>
            <Typography noWrap>
            Spatio Temporal Data Fusion Engine for Machine Learning Platform
            </Typography>
          </div>
          
          <button style={{fontsize:"24px"}} onClick={()=>{app.auth().signOut()}}>Logout <i className="fa fa-sign-out"></i></button>
          
        </Toolbar>
        <div className="w3-bar w3-teal">
            <Link to="/status" class="w3-bar-item w3-button w3-right">Status</Link>
            <Link to="/pipeline" class="w3-bar-item w3-button w3-right">Customize Pipeline</Link>
            <Link to="/" class="w3-bar-item w3-button w3-right">Home</Link>
          </div>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <div className="w3-card-4 w3-dark-white">
          <div className="w3-container w3-center">
            <h3>User</h3>
            <img src="userProfile.jpg" alt="Avatar" style={{width:"80%"}}></img>
            <h5>{userName}</h5>
          </div>
          </div>
        </List> 
      </Drawer>
      <div
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader}/>
        <div className="btn-home w3-border" >
          <Switch>
          <PrivateRoute exact path="/pipeline" component={Pipeline}/>
          <PrivateRoute exact path="/" component={CreatePipeline}/>
          </Switch>
        </div>
      </div>
      </Router>
    </div>
  )
}

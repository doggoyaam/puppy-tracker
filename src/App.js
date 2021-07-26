import React, { useEffect, useRef, useState } from 'react';
import { useBetween } from "use-between";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import Form from "react-bootstrap/Form";
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
// use custom calanderheatmap component
import CalendarHeatmap from './calendar-heatmap.component';
import moment from 'moment';
// import { interpolateNumber, timeMillisecond } from 'd3';
import styled from 'styled-components'


if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJ_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_S_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MSEND_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
  });
} else {
  firebase.app(); // if already initialized, use that one
}


const auth = firebase.auth();
const firestore = firebase.firestore();
// const analytics = firebase.analytics();
var _ = require('lodash');

const evCollectionName = process.env.REACT_APP_FIREBASE_APP_COLL_NAME;


const useShareableState = () => {
  // const [username, setUsername] = useState('Abrar');

  // nap
  const [edNapIdValue, setEdNapIdValue] = useState(null);
  const [edNapStartTimeValue, setEdNapStartTimeValue] = useState(null);
  // set default times for sliders
  const [edNapTimeHrsValue, setEdNapTimeHrsValue] = useState(1);
  const [edNapTimeMinsValue, setEdNapTimeMinsValue] = useState(0);
  const [edNapNotesValue, setEdNapNotesValue] = useState("");
  const [showEditNap, setShowEditNap] = useState(false);


  // Food
  const [edFoodIdValue, setEdFoodIdValue] = useState(null);
  const [edFoodStartTimeValue, setEdFoodStartTimeValue] = useState(null);
  // set default times for sliders
  const [edFoodTimeMinsValue, setEdFoodTimeMinsValue] = useState(5);
  const [edFoodNotesValue, setEdFoodNotesValue] = useState("");
  const [showEditFood, setShowEditFood] = useState(false);

  // Water
  const [edWaterIdValue, setEdWaterIdValue] = useState(null);
  const [edWaterStartTimeValue, setEdWaterStartTimeValue] = useState(null);
  // set default times for sliders
  const [edWaterTimeMinsValue, setEdWaterTimeMinsValue] = useState(1);
  const [edWaterNotesValue, setEdWaterNotesValue] = useState("");
  const [showEditWater, setShowEditWater] = useState(false);

  // Accident
  const [edAccidentIdValue, setEdAccidentIdValue] = useState(null);
  const [edAccidentStartTimeValue, setEdAccidentStartTimeValue] = useState(null);
  // set default times for sliders
  const [edAccidentTimeMinsValue, setEdAccidentTimeMinsValue] = useState(3);
  const [edAccidentNotesValue, setEdAccidentNotesValue] = useState("");
  const [showEditAccident, setShowEditAccident] = useState(false);

  // Poop
  const [edPoopIdValue, setEdPoopIdValue] = useState(null);
  const [edPoopStartTimeValue, setEdPoopStartTimeValue] = useState(null);
  // set default times for sliders
  const [edPoopTimeMinsValue, setEdPoopTimeMinsValue] = useState(3);
  const [edPoopNotesValue, setEdPoopNotesValue] = useState("");
  const [showEditPoop, setShowEditPoop] = useState(false);


  // Pee
  const [edPeeIdValue, setEdPeeIdValue] = useState(null);
  const [edPeeStartTimeValue, setEdPeeStartTimeValue] = useState(null);
  // set default times for sliders
  const [edPeeTimeMinsValue, setEdPeeTimeMinsValue] = useState(1);
  const [edPeeNotesValue, setEdPeeNotesValue] = useState("");
  const [showEditPee, setShowEditPee] = useState(false);


  // Filter state
  const [showFilterEvents, setShowFilterEvents] = useState(false);
  const [filterStartTimeValue, setfilterStartTimeValue] = useState(null);



  // const [count, setCount] = useState(0);
  return {
    edNapIdValue,
    setEdNapIdValue,
    edNapStartTimeValue,
    setEdNapStartTimeValue,
    edNapTimeHrsValue,
    setEdNapTimeHrsValue,
    edNapTimeMinsValue,
    setEdNapTimeMinsValue,
    edNapNotesValue,
    setEdNapNotesValue,
    showEditNap,
    setShowEditNap,

    edFoodIdValue,
    setEdFoodIdValue,
    edFoodStartTimeValue,
    setEdFoodStartTimeValue,
    edFoodTimeMinsValue,
    setEdFoodTimeMinsValue,
    edFoodNotesValue,
    setEdFoodNotesValue,
    showEditFood,
    setShowEditFood,

    edWaterIdValue,
    setEdWaterIdValue,
    edWaterStartTimeValue,
    setEdWaterStartTimeValue,
    edWaterTimeMinsValue,
    setEdWaterTimeMinsValue,
    edWaterNotesValue,
    setEdWaterNotesValue,
    showEditWater,
    setShowEditWater,

    edAccidentIdValue,
    setEdAccidentIdValue,
    edAccidentStartTimeValue,
    setEdAccidentStartTimeValue,
    edAccidentTimeMinsValue,
    setEdAccidentTimeMinsValue,
    edAccidentNotesValue,
    setEdAccidentNotesValue,
    showEditAccident,
    setShowEditAccident,

    edPoopIdValue,
    setEdPoopIdValue,
    edPoopStartTimeValue,
    setEdPoopStartTimeValue,
    edPoopTimeMinsValue,
    setEdPoopTimeMinsValue,
    edPoopNotesValue,
    setEdPoopNotesValue,
    showEditPoop,
    setShowEditPoop,

    edPeeIdValue,
    setEdPeeIdValue,
    edPeeStartTimeValue,
    setEdPeeStartTimeValue,
    edPeeTimeMinsValue,
    setEdPeeTimeMinsValue,
    edPeeNotesValue,
    setEdPeeNotesValue,
    showEditPee,
    setShowEditPee,

    showFilterEvents,
    setShowFilterEvents,
    filterStartTimeValue,
    setfilterStartTimeValue
  }
}



function App() {
  // const dummy = useRef();

  const [user] = useAuthState(auth);
  const [nowTimeValue, setNowTimeValue] = useState(null);
  // set default times for sliders
  const [napTimeHrsValue, setNapTimeHrsValue] = useState(1);
  const [napTimeMinsValue, setNapTimeMinsValue] = useState(0);

  const [foodTimeMinsValue, setFoodTimeMinsValue] = useState(5);

  const [waterTimeMinsValue, setWaterTimeMinsValue] = useState(1);

  const [accidentTimeMinsValue, setAccidentTimeMinsValue] = useState(3);

  const [poopTimeMinsValue, setPoopTimeMinsValue] = useState(2);

  const [peeTimeMinsValue, setPeeTimeMinsValue] = useState(1);


  // Tabs
  const [tab, setTab] = useState('home');

  const [showNap, setShowNap] = useState(false);
  const [showFood, setShowFood] = useState(false);
  const [showWater, setShowWater] = useState(false);
  const [showAccdnt, setShowAccdnt] = useState(false);
  const [showPoop, setShowPoop] = useState(false);
  const [showPee, setShowPee] = useState(false);



  const {
    edNapIdValue,
    setEdNapIdValue,
    edNapStartTimeValue,
    setEdNapStartTimeValue,
    edNapTimeHrsValue,
    setEdNapTimeHrsValue,
    edNapTimeMinsValue,
    setEdNapTimeMinsValue,
    edNapNotesValue,
    setEdNapNotesValue,
    showEditNap,
    setShowEditNap,

    edFoodIdValue,
    setEdFoodIdValue,
    edFoodStartTimeValue,
    setEdFoodStartTimeValue,
    edFoodTimeMinsValue,
    setEdFoodTimeMinsValue,
    edFoodNotesValue,
    setEdFoodNotesValue,
    showEditFood,
    setShowEditFood,

    edWaterIdValue,
    setEdWaterIdValue,
    edWaterStartTimeValue,
    setEdWaterStartTimeValue,
    edWaterTimeMinsValue,
    setEdWaterTimeMinsValue,
    edWaterNotesValue,
    setEdWaterNotesValue,
    showEditWater,
    setShowEditWater,

    edAccidentIdValue,
    setEdAccidentIdValue,
    edAccidentStartTimeValue,
    setEdAccidentStartTimeValue,
    edAccidentTimeMinsValue,
    setEdAccidentTimeMinsValue,
    edAccidentNotesValue,
    setEdAccidentNotesValue,
    showEditAccident,
    setShowEditAccident,

    edPoopIdValue,
    setEdPoopIdValue,
    edPoopStartTimeValue,
    setEdPoopStartTimeValue,
    edPoopTimeMinsValue,
    setEdPoopTimeMinsValue,
    edPoopNotesValue,
    setEdPoopNotesValue,
    showEditPoop,
    setShowEditPoop,

    edPeeIdValue,
    setEdPeeIdValue,
    edPeeStartTimeValue,
    setEdPeeStartTimeValue,
    edPeeTimeMinsValue,
    setEdPeeTimeMinsValue,
    edPeeNotesValue,
    setEdPeeNotesValue,
    showEditPee,
    setShowEditPee,

    showFilterEvents,
    setShowFilterEvents,
    filterStartTimeValue,
    setfilterStartTimeValue
  } = useBetween(useShareableState);


  const [showAbout, setShowAbout] = useState(false);




  const dgevents = firestore.collection(evCollectionName);


  // add current date time to window
  useEffect(
    () => {
      // console.log("Using effect");
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      let nowTimeStr = now.toISOString().slice(0, 16);
      // console.log("Now time", nowTimeStr);
      setNowTimeValue(nowTimeStr);
    },
    [showNap, showFood, showWater, showAccdnt, showPee, showPoop]
  )

  const handleCloseNap = () => setShowNap(false);
  const handleCloseEditNap = () => setShowEditNap(false);

  const handleCloseFood = () => setShowFood(false);
  const handleCloseEditFood = () => setShowEditFood(false);

  const handleClosePoop = () => setShowPoop(false);
  const handleCloseEditPoop = () => setShowEditPoop(false);

  const handleClosePee = () => setShowPee(false);
  const handleCloseEditPee = () => setShowEditPee(false);

  const handleCloseAccdnt = () => setShowAccdnt(false);
  const handleCloseEditAccdnt = () => setShowEditAccident(false);

  const handleCloseWater = () => setShowWater(false);
  const handleCloseEditWater = () => setShowEditWater(false);

  const handleCloseFilterEvents = () => setShowFilterEvents(false);



  const showSchedule = (e) => {
    e.preventDefault();

    console.log("Showing schedule");
    setTab("schedule");


  };
  const showHome = (e) => {
    e.preventDefault();

    console.log("Showing home");
    setTab("home");


  };

  const saveEvent = async (evType, evData) => {
    // console.log("Save event", evType, evData);

    const { uid, photoURL } = auth.currentUser;
    // const sts = await firebase.firestore.FieldValue.serverTimestamp();

    // for nap extract hours before duration conv
    if (evType === "Nap") {
      var today = new Date();

      var tdateString = moment(today).format('YYYY-MM-DD');
      // console.log(tdateString);

      var stDt = new Date(evData.start_time);
      // console.log(stDt);
      // var enDt = new Date(evData.end_time);

      // calc nap duration in seconds
      var napHours = parseInt(evData.ev_hours);
      var napMins = parseInt(evData.ev_mins);

      var durationSec = (napHours * 60 * 60) + (napMins * 60);
      // console.log(napHours, napMins);
      // console.log("duration:", durationSec);


      await dgevents.add({
        type: evType,
        create_date: tdateString,
        start_time: stDt,
        duration: durationSec,
        note: evData.notes,
        uid: uid,
        photoURL: photoURL
      });


    } else {

      let today = new Date();

      let tdateString = moment(today).format('YYYY-MM-DD');
      // console.log(tdateString);

      let stDt = new Date(evData.start_time);
      // console.log(stDt);
      // var enDt = new Date(evData.end_time);

      // calc ev duration in seconds
      var evMins = parseInt(evData.ev_mins);

      let durationSec = evMins * 60;
      // console.log("duration:", durationSec);



      await dgevents.add({
        type: evType,
        create_date: tdateString,
        start_time: stDt,
        duration: durationSec,
        note: evData.notes,
        uid: uid,
        photoURL: photoURL
      });

    }



  }



  const updateEvent = async (evType, evData) => {
    console.log("Update event", evType, evData);

    const { uid, photoURL } = auth.currentUser;
    // for nap extract hours before duration conv
    if (evType === "Nap") {

      // console.log(tdateString);

      var stDt = new Date(evData.start_time);
      // calc nap duration in seconds
      var napHours = parseInt(evData.ev_hours);
      var napMins = parseInt(evData.ev_mins);

      var durationSec = (napHours * 60 * 60) + (napMins * 60);
      // console.log(napHours, napMins);
      // console.log("duration:", durationSec);

      // get event id
      let evId = evData.ev_id;
      // console.log("event id", evId);

      await dgevents.doc(evId).update({
        start_time: stDt,
        duration: durationSec,
        note: evData.notes,
        uid: uid,
        photoURL: photoURL
      });
      console.log("Done updating nap :)");


    } else {
      // console.log(tdateString);

      let stDt = new Date(evData.start_time);
      // console.log(stDt);
      // calc ev duration in seconds
      var evMins = parseInt(evData.ev_mins);

      let durationSec = evMins * 60;
      // console.log("duration:", durationSec);

      // get event id
      let evId = evData.ev_id;
      // console.log("event id", evId);

      await dgevents.doc(evId).update({
        start_time: stDt,
        duration: durationSec,
        note: evData.notes,
        uid: uid,
        photoURL: photoURL
      });
      console.log("Done updating event :)");

    }

  }



  const deleteEvent = async (evId) => {
    console.log("Delete event", evId);

    await dgevents.doc(evId).delete();
    console.log("Done deleting event :)");


  }







  // console.log("User:", user);
  let usrLayout = null;





  const handleShowNap = () => {
    // set the time appropriately
    // console.log("Using effect show nap ndate");
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    // only get to minutes
    let nowTimeStr = now.toISOString().slice(0, 16);
    console.log("Now time", nowTimeStr);
    setNowTimeValue(nowTimeStr);


    setShowNap(true);
  }
  const handleSaveNap = (e) => {
    e.preventDefault();

    console.log("Saving nap");
    // console.log(e);
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);
    saveEvent("Nap", formDataObj);
    handleCloseNap();
    return true;

  };

  const handleSaveEditNap = (e) => {
    e.preventDefault();

    console.log("Saving edit nap");
    // // console.log(e);
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);
    updateEvent("Nap", formDataObj);
    handleCloseEditNap();
    return true;

  };

  const handleDeleteNap = (e) => {
    e.preventDefault();

    console.log("deleting nap");
    const napId = edNapIdValue;
    console.log("Nap id", napId);
    deleteEvent(napId);

    handleCloseEditNap();
    return true;

  };


  const handleShowFood = () => {
    // also gotta update current time
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    let nowTimeStr = now.toISOString().slice(0, 16);
    // console.log("Now time", nowTimeStr);
    setNowTimeValue(nowTimeStr);


    setShowFood(true);

  }
  const handleSaveFood = (e) => {
    e.preventDefault();

    console.log("Saving food");
    // console.log(e);
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries());
    // console.log(formDataObj);
    saveEvent("Food", formDataObj);
    handleCloseFood();
    return true;

  };

  const handleSaveEditFood = (e) => {
    e.preventDefault();

    console.log("Saving edit food");
    // // console.log(e);
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);
    updateEvent("Food", formDataObj);
    handleCloseEditFood();
    return true;

  };

  const handleDeleteFood = (e) => {
    e.preventDefault();

    console.log("deleting food");
    const evId = edFoodIdValue;
    deleteEvent(evId);

    handleCloseEditFood();
    return true;

  };

  const handleShowWater = () => {

    // also gotta update current time
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    let nowTimeStr = now.toISOString().slice(0, 16);
    // console.log("Now time", nowTimeStr);
    setNowTimeValue(nowTimeStr);

    setShowWater(true);
  }
  const handleSaveWater = (e) => {
    e.preventDefault();

    console.log("Saving water");
    // console.log(e);
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);
    saveEvent("Water", formDataObj);
    handleCloseWater();
    return true;

  };

  const handleSaveEditWater = (e) => {
    e.preventDefault();

    console.log("Saving edit Water");
    // // console.log(e);
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);
    updateEvent("Water", formDataObj);
    handleCloseEditWater();
    return true;

  };

  const handleDeleteWater = (e) => {
    e.preventDefault();

    console.log("deleting Water");
    const evId = edWaterIdValue;
    deleteEvent(evId);

    handleCloseEditWater();
    return true;

  };

  const handleShowAccdnt = () => {
    // also gotta update current time
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    let nowTimeStr = now.toISOString().slice(0, 16);
    // console.log("Now time", nowTimeStr);
    setNowTimeValue(nowTimeStr);


    setShowAccdnt(true);
  }
  const handleSaveAccdnt = (e) => {
    e.preventDefault();

    console.log("Saving accdnt");
    // console.log(e);
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);
    saveEvent("Accident", formDataObj);
    handleCloseAccdnt();
    return true;

  };

  const handleSaveEditAccident = (e) => {
    e.preventDefault();

    console.log("Saving edit Accident");
    // // console.log(e);
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);
    updateEvent("Accident", formDataObj);
    handleCloseEditAccdnt();
    return true;

  };

  const handleDeleteAccident = (e) => {
    e.preventDefault();

    console.log("deleting Accident");
    const evId = edAccidentIdValue;
    deleteEvent(evId);

    handleCloseEditAccdnt();
    return true;

  };





  const handleShowPoop = () => {
    // also gotta update current time
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    let nowTimeStr = now.toISOString().slice(0, 16);
    // console.log("Now time", nowTimeStr);
    setNowTimeValue(nowTimeStr);


    setShowPoop(true);
  }
  const handleSavePoop = (e) => {
    e.preventDefault();

    console.log("Saving poop");
    // console.log(e);
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);
    saveEvent("Poop", formDataObj);
    handleClosePoop();
    return true;

  };

  const handleSaveEditPoop = (e) => {
    e.preventDefault();

    console.log("Saving edit Poop");
    // // console.log(e);
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);
    updateEvent("Poop", formDataObj);
    handleCloseEditPoop();
    return true;

  };

  const handleDeletePoop = (e) => {
    e.preventDefault();

    console.log("deleting Poop");
    const evId = edPoopIdValue;
    deleteEvent(evId);

    handleCloseEditPoop();
    return true;

  };

  const handleShowPee = () => {
    // also gotta update current time
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    let nowTimeStr = now.toISOString().slice(0, 16);
    // console.log("Now time", nowTimeStr);
    setNowTimeValue(nowTimeStr);

    setShowPee(true);
  }
  const handleSavePee = (e) => {
    e.preventDefault();

    console.log("Saving pee");
    // console.log(e);
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);
    saveEvent("Pee", formDataObj);
    handleClosePee();
    return true;

  };

  const handleSaveEditPee = (e) => {
    e.preventDefault();

    console.log("Saving edit Pee");
    // // console.log(e);
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);
    updateEvent("Pee", formDataObj);
    handleCloseEditPee();
    return true;

  };

  const handleDeletePee = (e) => {
    e.preventDefault();

    console.log("deleting Pee");
    const evId = edPeeIdValue;
    deleteEvent(evId);

    handleCloseEditPee();
    return true;

  };


  const handleSaveFilter = (e) => {
    e.preventDefault();

    console.log("Applying filter");
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);
    // const evId = edPeeIdValue;
    const stTime = formDataObj.start_time;
    if (stTime !== "") {
      console.log("Got start time for filter", stTime);
      setfilterStartTimeValue(stTime);

    } else {
      console.log("No start time for filter", stTime);

    }

    setShowFilterEvents(false);


    return true;

  }

  const handleClearFilter = (e) => {
    e.preventDefault();

    console.log("Clearing filter");
    setfilterStartTimeValue(null);

    setShowFilterEvents(false);


    return true;

  }


  const showAboutMsg = (e) => {
    e.preventDefault();
    const cHeadState = showAbout;
    // console.log("Currently showing about:", cHeadState);
    if (cHeadState === false) {
      setShowAbout(true);
    }
    else {
      setShowAbout(false);
    }

  }





  var activeTabComp = null;
  var activeTabCompLabel = null;




  if (user !== null) {
    // get the active tab component
    // home is event view
    // Schedule is the Schedule heatmap view
    if (tab === "home") {
      // console.log("Shoing home tab");
      activeTabComp = (<>
        <TimeLine />
      </>
      );

      // set the label
      // show the schedule link if at home
      activeTabCompLabel = (<>
        <div className="scheduletitle" onClick={showSchedule}>schedule</div>

      </>);
    }
    else if (tab === "schedule") {
      // console.log("Shoing schedule tab");
      activeTabComp = (<>
        <TrackerView />
      </>
      );
      // set the label
      // show the home link if at schedule
      activeTabCompLabel = (<>
        <div className="scheduletitle" onClick={showHome}>home</div>

      </>);

    }

    var headComp = null;
    if (showAbout === false) {
      headComp = (<>
        🐶💩📜💬
      </>);
    } else {
      headComp = (<>
        doggoyaam - made with ❤️ for m&m
      </>);

    }
    // show layout for logged in users
    usrLayout = (
      <div class="App">
        <header>
          <div onClick={showAboutMsg}>
            {headComp}
          </div>
          <SignOut />
        </header>

        <div class="maincontainer">


          <div class="cardTop">
            {activeTabCompLabel}


            <svg width="497" height="219" viewBox="0 0 497 219" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M-38.5 196C-38.5 196 34 91 133.5 91C233 91 427 159 532.5 30C638 -99 518 236 518 236L-49 246.5L-38.5 196Z" fill="#B79972" />
            </svg>

          </div>


          <div>
            {activeTabComp}
          </div>

        </div>



        <div>

          <Container>
            <Modal show={showNap} onHide={handleCloseNap} animation={false} backdrop="static">

              <Form noValidate onSubmit={handleSaveNap}>

                <Modal.Body>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Event Type: <b>Nap</b> </Form.Label>
                    <br></br>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control type="datetime-local" name='start_time' defaultValue={nowTimeValue} />


                    <Form.Label>Duration: <b>{napTimeHrsValue}</b> hours <b>{napTimeMinsValue}</b> minutes</Form.Label>
                    <br></br>


                    <Form.Label>Hours</Form.Label>
                    <Form.Control
                      type="range"
                      name='ev_hours'
                      min={0}
                      max={12}
                      step={1}
                      defaultValue={napTimeHrsValue}
                      onChange={changeEvent => setNapTimeHrsValue(changeEvent.target.value)} />

                    <Form.Label>Minutes</Form.Label>
                    <Form.Control
                      type="range"
                      name='ev_mins'
                      min={0}
                      max={59}
                      step={10}
                      defaultValue={napTimeMinsValue}
                      onChange={changeEvent => setNapTimeMinsValue(changeEvent.target.value)} />

                    <Form.Label>Notes</Form.Label>
                    <Form.Control as="textarea" name='notes' rows={3} />
                  </Form.Group>




                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseNap}>
                    Close
                  </Button>
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>

                </Modal.Footer>
              </Form>
            </Modal>


            <Modal show={showEditNap} onHide={handleCloseEditNap} animation={false} backdrop="static">
              <Form noValidate onSubmit={handleSaveEditNap}>
                <Modal.Body>
                  <Form.Group controlId="exampleForm.ControlInput1Edit">
                    <Form.Label>Event Type: <b>(Edit) Nap</b> </Form.Label>
                    <Form.Control plaintext readOnly name='ev_id' defaultValue={edNapIdValue} />
                    <Button variant="danger" onClick={handleDeleteNap}>
                      Delete Event
                    </Button>
                    <br></br>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control type="datetime-local" name='start_time' defaultValue={edNapStartTimeValue} />

                    <Form.Label>Duration: <b>{edNapTimeHrsValue}</b> hours <b>{edNapTimeMinsValue}</b> minutes</Form.Label>
                    <br></br>
                    <Form.Label>Hours</Form.Label>
                    <Form.Control
                      type="range"
                      name='ev_hours'
                      min={0}
                      max={12}
                      step={1}
                      defaultValue={edNapTimeHrsValue}
                      onChange={changeEvent => setEdNapTimeHrsValue(changeEvent.target.value)} />

                    <Form.Label>Minutes</Form.Label>
                    <Form.Control
                      type="range"
                      name='ev_mins'
                      min={0}
                      max={59}
                      step={10}
                      defaultValue={edNapTimeMinsValue}
                      onChange={changeEvent => setEdNapTimeMinsValue(changeEvent.target.value)} />

                    <Form.Label>Notes</Form.Label>
                    <Form.Control as="textarea" name='notes' rows={3} defaultValue={edNapNotesValue} onChange={changeEvent => setEdNapNotesValue(changeEvent.target.value)} />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseEditNap}>
                    Close
                  </Button>
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>
          </Container>

          <Container>

            <Modal show={showFood} onHide={handleCloseFood}>

              <Form noValidate onSubmit={handleSaveFood}>

                <Modal.Body>
                  <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label>Event Type: <b>Food</b> </Form.Label>
                    <br></br>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control type="datetime-local" name='start_time' defaultValue={nowTimeValue} />

                    <Form.Label>Duration: <b>{foodTimeMinsValue}</b> minutes</Form.Label>
                    <br></br>

                    <Form.Label>Minutes</Form.Label>
                    <Form.Control
                      type="range"
                      name='ev_mins'
                      min={0}
                      max={30}
                      step={1}
                      defaultValue={foodTimeMinsValue}
                      onChange={changeEvent => setFoodTimeMinsValue(changeEvent.target.value)} />

                    <Form.Label>Notes</Form.Label>
                    <Form.Control as="textarea" name='notes' rows={3} />
                  </Form.Group>




                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseFood}>
                    Close
                  </Button>
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>

                </Modal.Footer>
              </Form>
            </Modal>


            <Modal show={showEditFood} onHide={handleCloseEditFood} animation={false} backdrop="static">
              <Form noValidate onSubmit={handleSaveEditFood}>
                <Modal.Body>
                  <Form.Group controlId="exampleForm.ControlInput1Edit2">
                    <Form.Label>Event Type: <b>(Edit) Food</b> </Form.Label>
                    <Form.Control plaintext readOnly name='ev_id' defaultValue={edFoodIdValue} />
                    <Button variant="danger" onClick={handleDeleteFood}>
                      Delete Event
                    </Button>
                    <br></br>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control type="datetime-local" name='start_time' defaultValue={edFoodStartTimeValue} />

                    <Form.Label>Duration: <b>{edFoodTimeMinsValue}</b> minutes</Form.Label>
                    <br></br>
                    <Form.Label>Minutes</Form.Label>
                    <Form.Control
                      type="range"
                      name='ev_mins'
                      min={0}
                      max={30}
                      step={1}
                      defaultValue={edFoodTimeMinsValue}
                      onChange={changeEvent => setEdFoodTimeMinsValue(changeEvent.target.value)} />

                    <Form.Label>Notes</Form.Label>
                    <Form.Control as="textarea" name='notes' rows={3} defaultValue={edFoodNotesValue} onChange={changeEvent => setEdFoodNotesValue(changeEvent.target.value)} />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseEditFood}>
                    Close
                  </Button>
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>

          </Container>


          <Container>


            <Modal show={showWater} onHide={handleCloseWater}>

              <Form noValidate onSubmit={handleSaveWater}>

                <Modal.Body>
                  <Form.Group controlId="exampleForm.ControlInput3">
                    <Form.Label>Event Type: <b>Water</b> </Form.Label>
                    <br></br>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control type="datetime-local" name='start_time' defaultValue={nowTimeValue} />

                    <Form.Label>Duration: <b>{waterTimeMinsValue}</b> minutes</Form.Label>
                    <br></br>

                    <Form.Label>Minutes</Form.Label>
                    <Form.Control
                      type="range"
                      name='ev_mins'
                      min={0}
                      max={30}
                      step={1}
                      defaultValue={waterTimeMinsValue}
                      onChange={changeEvent => setWaterTimeMinsValue(changeEvent.target.value)} />

                    <Form.Label>Notes</Form.Label>
                    <Form.Control as="textarea" name='notes' rows={3} />
                  </Form.Group>




                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseWater}>
                    Close
                  </Button>
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>

                </Modal.Footer>
              </Form>
            </Modal>

            <Modal show={showEditWater} onHide={handleCloseEditWater} animation={false} backdrop="static">
              <Form noValidate onSubmit={handleSaveEditWater}>
                <Modal.Body>
                  <Form.Group controlId="exampleForm.ControlInput1Edit3">
                    <Form.Label>Event Type: <b>(Edit) Water</b> </Form.Label>
                    <Form.Control plaintext readOnly name='ev_id' defaultValue={edWaterIdValue} />
                    <Button variant="danger" onClick={handleDeleteWater}>
                      Delete Event
                    </Button>
                    <br></br>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control type="datetime-local" name='start_time' defaultValue={edWaterStartTimeValue} />

                    <Form.Label>Duration: <b>{edWaterTimeMinsValue}</b> minutes</Form.Label>
                    <br></br>
                    <Form.Label>Minutes</Form.Label>
                    <Form.Control
                      type="range"
                      name='ev_mins'
                      min={0}
                      max={30}
                      step={1}
                      defaultValue={edWaterTimeMinsValue}
                      onChange={changeEvent => setEdWaterTimeMinsValue(changeEvent.target.value)} />

                    <Form.Label>Notes</Form.Label>
                    <Form.Control as="textarea" name='notes' rows={3} defaultValue={edWaterNotesValue} onChange={changeEvent => setEdWaterNotesValue(changeEvent.target.value)} />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseEditWater}>
                    Close
                  </Button>
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>

          </Container>

          <Container>

            <Modal show={showAccdnt} onHide={handleCloseAccdnt}>

              <Form noValidate onSubmit={handleSaveAccdnt}>

                <Modal.Body>
                  <Form.Group controlId="exampleForm.ControlInput4">
                    <Form.Label>Event Type: <b>Accdnt</b> </Form.Label>
                    <br></br>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control type="datetime-local" name='start_time' defaultValue={nowTimeValue} />

                    <Form.Label>Duration: <b>{accidentTimeMinsValue}</b> minutes</Form.Label>
                    <br></br>

                    <Form.Label>Minutes</Form.Label>
                    <Form.Control
                      type="range"
                      name='ev_mins'
                      min={0}
                      max={30}
                      step={1}
                      defaultValue={accidentTimeMinsValue}
                      onChange={changeEvent => setAccidentTimeMinsValue(changeEvent.target.value)} />

                    <Form.Label>Notes</Form.Label>
                    <Form.Control as="textarea" name='notes' rows={3} />
                  </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseAccdnt}>
                    Close
                  </Button>
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>

                </Modal.Footer>
              </Form>
            </Modal>

            <Modal show={showEditAccident} onHide={handleCloseEditAccdnt} animation={false} backdrop="static">
              <Form noValidate onSubmit={handleSaveEditAccident}>
                <Modal.Body>
                  <Form.Group controlId="exampleForm.ControlInput1Edit4">
                    <Form.Label>Event Type: <b>(Edit) Accident</b> </Form.Label>
                    <Form.Control plaintext readOnly name='ev_id' defaultValue={edAccidentIdValue} />
                    <Button variant="danger" onClick={handleDeleteAccident}>
                      Delete Event
                    </Button>
                    <br></br>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control type="datetime-local" name='start_time' defaultValue={edAccidentStartTimeValue} />

                    <Form.Label>Duration: <b>{edAccidentTimeMinsValue}</b> minutes</Form.Label>
                    <br></br>
                    <Form.Label>Minutes</Form.Label>
                    <Form.Control
                      type="range"
                      name='ev_mins'
                      min={0}
                      max={30}
                      step={1}
                      defaultValue={edAccidentTimeMinsValue}
                      onChange={changeEvent => setEdAccidentTimeMinsValue(changeEvent.target.value)} />

                    <Form.Label>Notes</Form.Label>
                    <Form.Control as="textarea" name='notes' rows={3} defaultValue={edAccidentNotesValue} onChange={changeEvent => setEdAccidentNotesValue(changeEvent.target.value)} />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseEditAccdnt}>
                    Close
                  </Button>
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>

          </Container>

          <Container>


            <Modal show={showPoop} onHide={handleClosePoop}>

              <Form noValidate onSubmit={handleSavePoop}>

                <Modal.Body>
                  <Form.Group controlId="exampleForm.ControlInput5">
                    <Form.Label>Event Type: <b>Poop</b> </Form.Label>
                    <br></br>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control type="datetime-local" name='start_time' defaultValue={nowTimeValue} />

                    <Form.Label>Duration: <b>{poopTimeMinsValue}</b> minutes</Form.Label>
                    <br></br>

                    <Form.Label>Minutes</Form.Label>
                    <Form.Control
                      type="range"
                      name='ev_mins'
                      min={0}
                      max={30}
                      step={1}
                      defaultValue={poopTimeMinsValue}
                      onChange={changeEvent => setPoopTimeMinsValue(changeEvent.target.value)} />

                    <Form.Label>Notes</Form.Label>
                    <Form.Control as="textarea" name='notes' rows={3} />
                  </Form.Group>




                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClosePoop}>
                    Close
                  </Button>
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>

                </Modal.Footer>
              </Form>
            </Modal>


            <Modal show={showEditPoop} onHide={handleCloseEditPoop} animation={false} backdrop="static">
              <Form noValidate onSubmit={handleSaveEditPoop}>
                <Modal.Body>
                  <Form.Group controlId="exampleForm.ControlInput1Edit5">
                    <Form.Label>Event Type: <b>(Edit) Poop</b> </Form.Label>
                    <Form.Control plaintext readOnly name='ev_id' defaultValue={edPoopIdValue} />
                    <Button variant="danger" onClick={handleDeletePoop}>
                      Delete Event
                    </Button>
                    <br></br>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control type="datetime-local" name='start_time' defaultValue={edPoopStartTimeValue} />

                    <Form.Label>Duration: <b>{edPoopTimeMinsValue}</b> minutes</Form.Label>
                    <br></br>
                    <Form.Label>Minutes</Form.Label>
                    <Form.Control
                      type="range"
                      name='ev_mins'
                      min={0}
                      max={30}
                      step={1}
                      defaultValue={edPoopTimeMinsValue}
                      onChange={changeEvent => setEdPoopTimeMinsValue(changeEvent.target.value)} />

                    <Form.Label>Notes</Form.Label>
                    <Form.Control as="textarea" name='notes' rows={3} defaultValue={edPoopNotesValue} onChange={changeEvent => setEdPoopNotesValue(changeEvent.target.value)} />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseEditPoop}>
                    Close
                  </Button>
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>


          </Container>

          <Container>


            <Modal show={showPee} onHide={handleClosePee}>

              <Form noValidate onSubmit={handleSavePee}>

                <Modal.Body>
                  <Form.Group controlId="exampleForm.ControlInput6">
                    <Form.Label>Event Type: <b>Pee</b> </Form.Label>
                    <br></br>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control type="datetime-local" name='start_time' defaultValue={nowTimeValue} />

                    <Form.Label>Duration: <b>{peeTimeMinsValue}</b> minutes</Form.Label>
                    <br></br>

                    <Form.Label>Minutes</Form.Label>
                    <Form.Control
                      type="range"
                      name='ev_mins'
                      min={0}
                      max={30}
                      step={1}
                      defaultValue={peeTimeMinsValue}
                      onChange={changeEvent => setPeeTimeMinsValue(changeEvent.target.value)} />


                    <Form.Label>Notes</Form.Label>
                    <Form.Control as="textarea" name='notes' rows={3} />
                  </Form.Group>




                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClosePee}>
                    Close
                  </Button>
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>

                </Modal.Footer>
              </Form>
            </Modal>


            <Modal show={showEditPee} onHide={handleCloseEditPee} animation={false} backdrop="static">
              <Form noValidate onSubmit={handleSaveEditPee}>
                <Modal.Body>
                  <Form.Group controlId="exampleForm.ControlInput1Edit6">
                    <Form.Label>Event Type: <b>(Edit) Pee</b> </Form.Label>
                    <Form.Control plaintext readOnly name='ev_id' defaultValue={edPeeIdValue} />
                    <Button variant="danger" onClick={handleDeletePee}>
                      Delete Event
                    </Button>
                    <br></br>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control type="datetime-local" name='start_time' defaultValue={edPeeStartTimeValue} />

                    <Form.Label>Duration: <b>{edPeeTimeMinsValue}</b> minutes</Form.Label>
                    <br></br>
                    <Form.Label>Minutes</Form.Label>
                    <Form.Control
                      type="range"
                      name='ev_mins'
                      min={0}
                      max={30}
                      step={1}
                      defaultValue={edPeeTimeMinsValue}
                      onChange={changeEvent => setEdPeeTimeMinsValue(changeEvent.target.value)} />

                    <Form.Label>Notes</Form.Label>
                    <Form.Control as="textarea" name='notes' rows={3} defaultValue={edPeeNotesValue} onChange={changeEvent => setEdPeeNotesValue(changeEvent.target.value)} />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseEditPee}>
                    Close
                  </Button>
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>



            <Modal show={showFilterEvents} onHide={handleCloseFilterEvents} animation={false} backdrop="static">
              <Form noValidate onSubmit={handleSaveFilter}>
                <Modal.Header>
                  Filter Events
                </Modal.Header>
                <Modal.Body>
                  <Form.Group controlId="exampleForm.ControlInput1Edit7">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control type="date" name='start_time' defaultValue={filterStartTimeValue} />


                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseFilterEvents}>
                    Close
                  </Button>
                  <Button variant="danger" onClick={handleClearFilter}>
                    Clear Filter
                  </Button>
                  <Button type="submit" variant="primary">
                    Apply Filter
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>

          </Container>


        </div>








        <footer>
          <div class="footerActions">
            <Button variant="dgevents" onClick={handleShowNap}>
              Nap
            </Button >

            <Button variant="dgevents" onClick={handleShowFood}>
              Food
            </Button>



            <Button variant="dgevents" onClick={handleShowWater}>
              Water
            </Button>

            <Button variant="dgevents" onClick={handleShowAccdnt}>
              Accident
            </Button>


            <Button variant="dgevents" onClick={handleShowPoop}>
              Poop
            </Button>

            <Button variant="dgevents" onClick={handleShowPee}>
              Pee
            </Button>


          </div>

        </footer>

      </div>
    );


  } else {
    // non authd users
    usrLayout = (
      <div className="App">
        <header>🐶💩📜💬!!
          <SignIn />
        </header>

        <main>

        </main>

      </div>
    );

  }

  return usrLayout;
}



const _MS_PER_DAY = 1000 * 60 * 60 * 24;
const _ms_to_sec = 1000;
const _ms_to_min = 1000 * 60;
const _ms_to_hour = 1000 * 60 * 60;


// a and b are javascript Date objects
function dateDiffs(a, b) {
  // Discard the time and time-zone information.
  // const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  // const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  const d = Math.abs(b - a);
  // console.log(d);

  const secs = d / _ms_to_sec;
  const mins = d / _ms_to_min;
  const hours = d / _ms_to_hour;
  const days = Math.floor(d / _MS_PER_DAY);
  // console.log(secs, mins, hours, days);

  const ret = {
    seconds: secs,
    minutes: mins,
    hours: hours,
    days: days
  }
  return ret;

  // return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}


// function to take in the above date oobject and return a human redible subtitle
// dictating how long ago the event took place
// scheme: 
// - If minutes <= 1 . Display seconds ago
// - If hours <= 1. Display minutes, seconds ago
// - If days <= 1. Display hours, minutes ago
// - If days > 0. Display Days ago


function fmtTimeAgo(dObj) {
  var s = null;

  if (dObj.minutes <= 1) {
    var secsAll = Math.floor(dObj.seconds);

    s = `${secsAll}s ago`;
  }
  else if (dObj.hours <= 1) {
    var minsAll = Math.floor(dObj.minutes);

    s = `${minsAll}m ago`;
  }
  else if (dObj.days < 1) {
    var hrs = Math.floor(dObj.hours);
    var minsAll = Math.floor(dObj.minutes);
    var minsLeft = minsAll - hrs * 60;
    s = `${hrs}h${minsLeft}m ago`;

    // just do hours ago 
    // s = `${hrs} hours ago`;


  }
  else if (dObj.days >= 1) {
    // var hrs = Math.floor(dObj.hours);
    // var minsAll = Math.floor(dObj.minutes);
    // var minsLeft = minsAll - hrs * 60;
    s = `${dObj.days} days ago`;

  }
  return s;

}



function TimeLine() {
  console.log("Timelining");


  const {
    edNapIdValue,
    setEdNapIdValue,
    edNapStartTimeValue,
    setEdNapStartTimeValue,
    edNapTimeHrsValue,
    setEdNapTimeHrsValue,
    edNapTimeMinsValue,
    setEdNapTimeMinsValue,
    edNapNotesValue,
    setEdNapNotesValue,
    showEditNap,
    setShowEditNap,

    edFoodIdValue,
    setEdFoodIdValue,
    edFoodStartTimeValue,
    setEdFoodStartTimeValue,
    edFoodTimeMinsValue,
    setEdFoodTimeMinsValue,
    edFoodNotesValue,
    setEdFoodNotesValue,
    showEditFood,
    setShowEditFood,

    edWaterIdValue,
    setEdWaterIdValue,
    edWaterStartTimeValue,
    setEdWaterStartTimeValue,
    edWaterTimeMinsValue,
    setEdWaterTimeMinsValue,
    edWaterNotesValue,
    setEdWaterNotesValue,
    showEditWater,
    setShowEditWater,

    edAccidentIdValue,
    setEdAccidentIdValue,
    edAccidentStartTimeValue,
    setEdAccidentStartTimeValue,
    edAccidentTimeMinsValue,
    setEdAccidentTimeMinsValue,
    edAccidentNotesValue,
    setEdAccidentNotesValue,
    showEditAccident,
    setShowEditAccident,

    edPoopIdValue,
    setEdPoopIdValue,
    edPoopStartTimeValue,
    setEdPoopStartTimeValue,
    edPoopTimeMinsValue,
    setEdPoopTimeMinsValue,
    edPoopNotesValue,
    setEdPoopNotesValue,
    showEditPoop,
    setShowEditPoop,

    edPeeIdValue,
    setEdPeeIdValue,
    edPeeStartTimeValue,
    setEdPeeStartTimeValue,
    edPeeTimeMinsValue,
    setEdPeeTimeMinsValue,
    edPeeNotesValue,
    setEdPeeNotesValue,
    showEditPee,
    setShowEditPee,

    showFilterEvents,
    setShowFilterEvents,
    filterStartTimeValue,
    setfilterStartTimeValue
  } = useBetween(useShareableState);

  const dgevents = firestore.collection(evCollectionName);

  var query;

  if (filterStartTimeValue === null) {
    console.log("no filter value");
    // default qquery
    query = dgevents.orderBy('start_time', 'desc').limit(30);
  } else {
    console.log("Got filter val", filterStartTimeValue);

    var start = new Date(filterStartTimeValue);
    start.setHours(0, 0, 0, 0);

    var end = new Date(filterStartTimeValue);
    end.setHours(23, 59, 59, 999);

    query = dgevents.where('start_time', ">=", start)
      .where('start_time', "<", end)
      .orderBy('start_time', 'desc');

  }



  const [devents] = useCollectionData(query, { idField: 'id' });
  // console.log(devents);





  const handleShowEditEventWrapper = (dataKey) => {
    // set the time appropriately
    console.log("Handle show edit event wrapper");
    console.log(dataKey);
    // const now = new Date();
    // now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    // // only get to minutes
    // let nowTimeStr = now.toISOString().slice(0, 16);
    // console.log("Now time", nowTimeStr);
    // setNowTimeValue(nowTimeStr);
    if (dataKey === null) {
      console.log("No data key");
    } else {

      const elemRef = dgevents.doc(dataKey).get()
        .then((snap) => {
          console.log("Got snap")
          const elemData = snap.data();
          // console.log(elemData);
          const evType = elemData.type;
          const stTime = elemData.start_time; //.toDate().toISOString(0, 16);
          // Note the T
          // Need to format as below for the datetime input 

          var stTimeStr = moment(stTime.toDate()).format('YYYY-MM-DDTHH:mm');

          console.log("type", evType, " start time", stTimeStr);
          if (evType === "Nap") {
            setEdNapIdValue(dataKey);
            setEdNapStartTimeValue(stTimeStr);
            setEdNapNotesValue(elemData.note);
            setShowEditNap(true);
          } else if (evType === "Food") {
            setEdFoodIdValue(dataKey);
            setEdFoodStartTimeValue(stTimeStr);
            setEdFoodNotesValue(elemData.note);
            setShowEditFood(true);
          } else if (evType === "Water") {
            setEdWaterIdValue(dataKey);
            setEdWaterStartTimeValue(stTimeStr);
            setEdWaterNotesValue(elemData.note);
            setShowEditWater(true);
          } else if (evType === "Accident") {
            setEdAccidentIdValue(dataKey);
            setEdAccidentStartTimeValue(stTimeStr);
            setEdAccidentNotesValue(elemData.note);
            setShowEditAccident(true);
          } else if (evType === "Poop") {
            setEdPoopIdValue(dataKey);
            setEdPoopStartTimeValue(stTimeStr);
            setEdPoopNotesValue(elemData.note);
            setShowEditPoop(true);
          } else if (evType === "Pee") {
            setEdPeeIdValue(dataKey);
            setEdPeeStartTimeValue(stTimeStr);
            setEdPeeNotesValue(elemData.note);
            setShowEditPee(true);
          } else {
            console.log("Unknown update type");
          }

        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    }

  }

  const handleClickCard = (e) => {
    console.log("Clicked card");
    console.log(e);
    const dataKey = e.target.getAttribute("data-key");


    handleShowEditEventWrapper(dataKey);
  }

  const handleClickFilter = (e) => {
    console.log("Clicked filter emoji");
    // console.log(e);
    // const dataKey = e.target.getAttribute("data-key");


    setShowFilterEvents(true);
  }




  // console.log("Got event track:", trackData);


  var lastAccident = null;


  // group items by start date
  // so we can label the dates and stuff
  var hmShow3Arr = [];


  // group items by date name and then get the name for each month
  const dateGroupEvents = _.chain(devents)
    // .groupBy(item => moment(item.start_time.toDate()).format('YYYY-MM-DD'))
    .groupBy(item => moment(item.start_time.toDate()).format('D MMMM YYYY'))
    .value();

  console.log(dateGroupEvents);
  // will get back obj where each key , val = groupdate, groupDataArr
  // mabe sort by date in desc explicitly

  for (var key in dateGroupEvents) {
    if (dateGroupEvents.hasOwnProperty(key)) {
      console.log(key);
      var dateEvents = dateGroupEvents[key];

      var hms2 = dateEvents.map((item, index) => {
        var stTime = item.start_time;

        // console.log(stTime.toDate());
        // test it
        const now = new Date();
        const dObj = dateDiffs(stTime.toDate(), now);
        // get time to display
        const clockEvTime = moment(stTime.toDate()).format('HH:mm a')
        // console.log(dObj);
        const subStr = fmtTimeAgo(dObj);
        // console.log(subStr);
        const messageClass = item.uid === auth.currentUser.uid ? 'sent' : 'received';
        // console.log(item, messageClass);
        // console.log(item.id);

        const TimeAgoBlock = styled.div`
            &:before {
                display: block;
                position: absolute;
                background: inherit;
                height: 10px;
                right: 5px;
                font-weight: 300;
                font-size: 11px;
                bottom:5px;
                content: '(${subStr})'
            }
        `;

        if (item.type === "Nap") {
          return (
            <div class="timeline-container evnap">
              <div class="timeline-icon">

              </div>
              <div class="timeline-body" key={index} >
                <div class="propic">
                  <img src={item.photoURL} />
                </div>
                <h4 class="timeline-title"><span class="badge" data-key={item.id} onClick={handleClickCard}>Nap</span></h4>
                <p>{item.note}</p>

                <div class="timeline-subtitle">{clockEvTime} <TimeAgoBlock onClick={(e) => console.log("Clicked on timeago nap", e)} /> </div>

              </div>
            </div >
          )

        }
        else if (item.type === "Food") {
          return (
            <div class="timeline-container evfood">
              <div class="timeline-icon">
                <i class="far fa-grin-wink"></i>
              </div>
              <div class="timeline-body" key={index} >
                <div class="propic">
                  <img src={item.photoURL} />
                </div>
                <h4 class="timeline-title"><span class="badge" data-key={item.id} onClick={handleClickCard}>Food</span></h4>
                <p>{item.note}</p>
                <div class="timeline-subtitle">{clockEvTime} <TimeAgoBlock /> </div>
              </div>
            </div>
          )
        }

        else if (item.type === "Water") {
          return (
            <div class="timeline-container evwater">
              <div class="timeline-icon">
                <i class="far fa-grin-wink"></i>
              </div>
              <div class="timeline-body" key={index} >
                <div class="propic">
                  <img src={item.photoURL} />
                </div>
                <h4 class="timeline-title"><span class="badge" data-key={item.id} onClick={handleClickCard}>Water</span></h4>
                <p>{item.note}</p>

                <div class="timeline-subtitle">{clockEvTime} <TimeAgoBlock /> </div>

              </div>
            </div>
          )
        }

        else if (item.type === "Accident") {
          return (
            <div class="timeline-container evaccident">
              <div class="timeline-icon">
                <i class="far fa-grin-wink"></i>
              </div>
              <div class="timeline-body" key={index} >
                <div class="propic">
                  <img src={item.photoURL} />
                </div>
                <h4 class="timeline-title"><span class="badge" data-key={item.id} onClick={handleClickCard}>Accident</span></h4>
                <p>{item.note}</p>

                <div class="timeline-subtitle">{clockEvTime} <TimeAgoBlock /> </div>

              </div>
            </div>
          )
        }

        else if (item.type === "Poop") {
          return (
            <div class="timeline-container evpoop">
              <div class="timeline-icon">
                <i class="far fa-grin-wink"></i>
              </div>
              <div class="timeline-body" key={index} >
                <div class="propic">
                  <img src={item.photoURL} />
                </div>
                <h4 class="timeline-title"><span class="badge" data-key={item.id} onClick={handleClickCard}>Poop</span></h4>
                <p>{item.note}</p>

                <div class="timeline-subtitle">{clockEvTime} <TimeAgoBlock /> </div>
              </div>
            </div>
          )
        }

        else if (item.type === "Pee") {
          return (
            <div class="timeline-container evpee" >
              <div class="timeline-icon">
                <i class="far fa-grin-wink"></i>
              </div>
              <div class="timeline-body" key={index}>
                <div class="propic">
                  <img src={item.photoURL} />
                </div>
                <h4 class="timeline-title"><span class="badge" data-key={item.id} onClick={handleClickCard}>Pee</span></h4>
                <p>{item.note}</p>

                <div class="timeline-subtitle">{clockEvTime} <TimeAgoBlock /> </div>

              </div>
            </div>
          )
        }
        else {
          return null;
        }
      });

      var dateDiv = (
        <div>
          <div class="date-info-text">
            {key}
          </div>
          <div>
            {hms2}
          </div>
        </div>
      );
      hmShow3Arr.push(dateDiv);
    }

  }

  // create the actual comp to be rendered
  var hmShow3Comp = hmShow3Arr.map((item, index) => {
    return (<>
      <div key={index}>
        {item}
      </div>
    </>)
  });




  var numDaysSinceLastAcc = null;

  if (lastAccident !== null) {
    console.log("Got last accident", lastAccident);
    numDaysSinceLastAcc = lastAccident.days;

  }



  // const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  const filterTitle = "🕓";

  const FilterBtn = styled.div`
    &:before {
        font-weight: 300;
        font-size: 13px;
        content: '${filterTitle}';
        display: block;
        position: relative;
        top:-28px;
        right:-64px;
    }
  `;




  var hmShow2 = (<>
    <div class="tbcontainer">
      <div class="timelineblur">

        <div class="updates">Updates <FilterBtn onClick={handleClickFilter} /></div>

        <div class="timeline">
          {hmShow3Comp}
        </div>

      </div>

    </div>

  </>);



  return hmShow2;
}


function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </>
  )

}

function SignOut() {
  // console.log(auth.user);
  if (auth.user) {
    return (
      <button onClick={() => auth.signOut()}>Sign Out</button>
    )

  }
  else {
    return null
  }
}


function getDates(numDaysBack) {
  let today = new Date();

  var dateArray = [];


  for (var i = 0; i < numDaysBack; i++) {
    // get the date for each date to look in past
    // first item should be today
    if (i === 0) {
      var tdateString = moment(today).format('YYYY-MM-DD');
      dateArray.push(tdateString);
    }
    else {
      let dayAgoObj = new Date();
      dayAgoObj.setDate(today.getDate() - i);
      var adateString = moment(dayAgoObj).format('YYYY-MM-DD');

      dateArray.push(adateString);
    }
  }


  // console.log('Today: ' + today);
  // console.log('Yesterday: ' + yesterday);
  // console.log(dateArray);
  // var currentDate = moment(startDate);
  // var stopDate = moment(stopDate);
  // while (currentDate <= stopDate) {
  //     dateArray.push( moment(currentDate).format('YYYY-MM-DD') )
  //     currentDate = moment(currentDate).add(1, 'days');
  // }
  return dateArray;
}

function TrackerView() {
  // const dummy = useRef();

  const [nowDateValue, setNowDateValue] = useState(null);





  const dgevents = firestore.collection(evCollectionName);

  // var start = moment().startOf('day'); // set to 12:00 am today
  // var end = moment().endOf('day'); // set to 23:59 pm today

  var start = new Date(nowDateValue);
  start.setMinutes(start.getMinutes() - start.getTimezoneOffset());

  start.setHours(0, 0, 0, 0);

  var end = new Date(nowDateValue);
  end.setMinutes(end.getMinutes() - end.getTimezoneOffset());

  end.setHours(23, 59, 59, 999);
  if (nowDateValue == null) {
    console.log("Empty nowday")
  }
  else {
    console.log("Start", start, "end", end);

  }

  const query = dgevents.where('start_time', ">=", start)
    .where('start_time', "<", end)
    .orderBy('start_time', 'desc');
  // .limit(25);
  const [devents] = useCollectionData(query, { idField: 'id' });




  var dateArr = getDates(3);
  // console.log("Got dates", dateArr);

  // console.log("events:", devents);
  // console.log(d0events);
  // return null;


  // add current date time to window
  useEffect(
    () => {
      console.log("Using effec TimeLine");
      const now = new Date();
      // now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      // let nowTimeStr = now.toISOString().slice(0, -1);
      // console.log("Now time", nowTimeStr);
      var ndateString = moment(now).format('YYYY-MM-DD');
      console.log("Now time styr", ndateString);

      setNowDateValue(ndateString);

    },
    []
  )



  return (<>
    <div class="scheduleblur">

      <h3>Schedule</h3>

      <Row>
        <Col>
          <Form.Group controlId="exampleForm.ControlInputSch1" as={Row} className="mb-3">
            <Form.Label column sm={4}> Select Date</Form.Label>
            <Col sm={6}>

              <Form.Control type="date" name='start_date' defaultValue={nowDateValue} onChange={changeEvent => setNowDateValue(changeEvent.target.value)} />
            </Col>
          </Form.Group>

        </Col>
        <Col>
          <Container fluid>

            <p>{nowDateValue}</p>
            <EventTrack tdate={dateArr[0]} tdata={devents} />
          </Container>
        </Col>
      </Row>
    </div>







  </>)






}

//create your forceUpdate hook
function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}

function EventTrack(props) {
  const trackDate = props.tdate;
  const trackData = props.tdata;




  // console.log("Got event track:", trackData);
  // console.log(devents);

  // var trDetails = [];
  // init the template data
  // will be same for all traces

  let trackDataAll = [];

  if (trackData == null) {
    console.log("No events");
    // const d = {
    //   name: "Poo",
    //   date: "2021-06-30 13:37:00",
    //   value: 1
    // }
    // trDetails.push(d);

  }
  else {
    var a = _.groupBy(trackData, function (n) {
      // return n.create_date;
      return moment(n.start_time.toDate()).format('YYYY-MM-DD')
    });
    console.log(a)
    // console.log(typeof (a))
    _.forEach(a, function (val, key) {
      // console.log("Key", key);
      // console.log(val);

      var details = [];
      var total = 0;

      // build up the details for this date
      _.forEach(val, function (value) {

        var est = value['start_time'];
        var estMils = est['seconds'] * 1000
        var dtest = new Date(estMils);
        // console.log(dtest);
        // console.log(est);
        var tdateString = moment(est.toDate()).format('YYYY-MM-DD HH:mm:ss');
        // console.log("elem", tdateString);
        // console.log("elem", typeof (tdateString));
        // console.log(value["type"]);
        var d = {
          "name": value["type"],
          "date": tdateString,
          "value": value["duration"]
        };
        details.push(d);
        total = total + d.value;
      });
      console.log("details");
      console.log(details);

      var dData = {
        "date": key,
        "details": details,
        "total": total
      };
      trackDataAll.push(dData);


    });





  }

  // const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';


  // console.log(trackDataOld);
  console.log(trackDataAll);
  var overview = "day";

  var hmShow = null;

  if (trackDataAll.length > 0) {
    hmShow = (<>
      <CalendarHeatmap
        data={trackDataAll}
        overview={overview}
      >
      </CalendarHeatmap>
    </>);

  }
  else {
    hmShow = null;

  }
  useForceUpdate();

  return hmShow;
}


export default App;
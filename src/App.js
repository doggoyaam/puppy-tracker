import React, { useEffect, useRef, useState } from 'react';
import { useBetween } from "use-between";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


import firebaseApp from './Components/FirebaseApp';

import { useAuthState } from 'react-firebase-hooks/auth';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import Form from "react-bootstrap/Form";
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
// use custom calanderheatmap component
// import CalendarHeatmap from './calendar-heatmap.component';
// import CalendarHeatmapComp from './calendar-heatmapcomp.component';
import { Offline, Online } from "react-detect-offline";
import moment from 'moment';
// import { interpolateNumber, timeMillisecond } from 'd3';

import useShareableState from './Components/ShareableState';
import TimeLine from './Components/Timeline';
import TrackerView from './Components/TrackerView';
import SignIn from './Components/SignIn';
import SignOut from './Components/SignOut';

const auth = firebaseApp.auth();
const firestore = firebaseApp.firestore();
// const analytics = firebase.analytics();
var _ = require('lodash');

const evCollectionName = process.env.REACT_APP_FIREBASE_APP_COLL_NAME;




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
          <div>
            <Online>Only shown when you're online</Online>
            <Offline>Only shown offline (surprise!)</Offline>
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



export default App;
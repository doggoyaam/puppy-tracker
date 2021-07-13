import React, { useEffect, useRef, useState } from 'react';
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
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import TabContainer from 'react-bootstrap/TabContainer';
import Card from "react-bootstrap/Card";
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import CalendarHeatmap from 'reactjs-calendar-heatmap'
import moment from 'moment';
import { timeMillisecond } from 'd3';

// process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
// process.env.REACT_APP_FIREBASE_PROJ_ID
// process.env.REACT_APP_FIREBASE_S_BUCKET
// process.env.REACT_APP_FIREBASE_MSEND_ID
// process.env.REACT_APP_FIREBASE_APP_ID

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


function App() {
  const dummy = useRef();

  const [user] = useAuthState(auth);
  const [nowTimeValue, setNowTimeValue] = useState(null);
  // user for default nap time
  const [nowp1TimeValue, setNowp1TimeValue] = useState(null);

  // use for default pee time and water
  const [nowp1mTimeValue, setNowp1mTimeValue] = useState(null);
  // use for default poop time and accident and food
  const [nowp3mTimeValue, setNowp3mTimeValue] = useState(null);

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

  const dgevents = firestore.collection('testevents');


  // add current date time to window
  useEffect(
    () => {
      console.log("Using effect");
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      let nowTimeStr = now.toISOString().slice(0, -1);
      console.log("Now time", nowTimeStr);
      setNowTimeValue(nowTimeStr);

      // set now + 1 hour for default nap time interval 
      var tp1 = new Date();
      tp1.setHours(now.getHours() + 1);
      // tp1.setMinutes(tp1.getMinutes() - tp1.getTimezoneOffset());
      let nowtp1TimeStr = tp1.toISOString().slice(0, -1);
      console.log("Now TP1 time", nowtp1TimeStr);
      setNowp1TimeValue(nowtp1TimeStr);

      // set now + 1 min for default pee and water time interval 
      var tp1m = new Date();
      tp1m.setMinutes(tp1m.getMinutes() - tp1m.getTimezoneOffset() + 1);
      // tp1m.setMinutes(now.getMinutes() + 1);
      // tp1.setMinutes(tp1.getMinutes() - tp1.getTimezoneOffset());
      let nowtp1mTimeStr = tp1m.toISOString().slice(0, -1);
      console.log("Now TP1m time", nowtp1mTimeStr);
      setNowp1mTimeValue(nowtp1mTimeStr);

      // set now + 3 min for default food, accident and poop time interval 
      const tp3m = new Date();
      console.log(tp3m);
      // do we first need to set the timezone offset?
      // tp3m.setMinutes(tp3m.getMinutes() - tp3m.getTimezoneOffset());
      tp3m.setMinutes(tp3m.getMinutes() - tp3m.getTimezoneOffset() + 3);
      var nowtp3mTimeStr = tp3m.toISOString().slice(0, -1);
      console.log("Now TP3m time", nowtp3mTimeStr);
      setNowp3mTimeValue(nowtp3mTimeStr);

      // window.addEventListener('load', () => {
      //   const now = new Date();
      //   now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      //   document.getElementsByName('date_of_birth').value = now.toISOString().slice(0, -1);
      // });
    },
    [showNap, showFood, showWater, showAccdnt, showPee, showPoop]
  )

  const saveEvent = async (evType, evData) => {
    console.log("Save event", evType, evData);

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
      console.log(napHours, napMins);
      console.log("duration:", durationSec);


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

      var today = new Date();

      var tdateString = moment(today).format('YYYY-MM-DD');
      // console.log(tdateString);

      var stDt = new Date(evData.start_time);
      // console.log(stDt);
      // var enDt = new Date(evData.end_time);

      // calc ev duration in seconds
      var evMins = parseInt(evData.ev_mins);

      var durationSec = evMins * 60;
      console.log("duration:", durationSec);



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
  // console.log("User:", user);
  let usrLayout = null;



  const handleCloseNap = () => setShowNap(false);
  const handleShowNap = () => {
    // set the time appropriately
    console.log("Using effect show nap ndate");
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    let nowTimeStr = now.toISOString().slice(0, -1);
    console.log("Now time", nowTimeStr);
    setNowTimeValue(nowTimeStr);

    // set now + 1 hour for default nap time interval 
    var tp1 = new Date();
    tp1.setHours(now.getHours() + 1);
    // tp1.setMinutes(tp1.getMinutes() - tp1.getTimezoneOffset());
    let nowtp1TimeStr = tp1.toISOString().slice(0, -1);
    console.log("Now TP1 time", nowtp1TimeStr);
    setNowp1TimeValue(nowtp1TimeStr);

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

  const handleCloseFood = () => setShowFood(false);
  const handleShowFood = () => {
    // also gotta update current time
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    let nowTimeStr = now.toISOString().slice(0, -1);
    // console.log("Now time", nowTimeStr);
    setNowTimeValue(nowTimeStr);

    // set now + 3 min for default food, accident and poop time interval 
    const tp3m = new Date();
    // console.log(tp3m);
    // do we first need to set the timezone offset?
    // tp3m.setMinutes(tp3m.getMinutes() - tp3m.getTimezoneOffset());
    tp3m.setMinutes(tp3m.getMinutes() - tp3m.getTimezoneOffset() + 3);
    var nowtp3mTimeStr = tp3m.toISOString().slice(0, -1);
    // console.log("Now TP3m time", nowtp3mTimeStr);
    setNowp3mTimeValue(nowtp3mTimeStr);

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

  const handleCloseWater = () => setShowWater(false);
  const handleShowWater = () => {

    // also gotta update current time
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    let nowTimeStr = now.toISOString().slice(0, -1);
    // console.log("Now time", nowTimeStr);
    setNowTimeValue(nowTimeStr);

    // set now + 1 min for default pee and water time interval 
    var tp1m = new Date();
    tp1m.setMinutes(tp1m.getMinutes() - tp1m.getTimezoneOffset() + 1);
    // tp1m.setMinutes(now.getMinutes() + 1);
    // tp1.setMinutes(tp1.getMinutes() - tp1.getTimezoneOffset());
    let nowtp1mTimeStr = tp1m.toISOString().slice(0, -1);
    // console.log("Now TP1m time", nowtp1mTimeStr);
    setNowp1mTimeValue(nowtp1mTimeStr);
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

  const handleCloseAccdnt = () => setShowAccdnt(false);
  const handleShowAccdnt = () => {
    // also gotta update current time
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    let nowTimeStr = now.toISOString().slice(0, -1);
    // console.log("Now time", nowTimeStr);
    setNowTimeValue(nowTimeStr);


    // set now + 3 min for default food, accident and poop time interval 
    const tp3m = new Date();
    // console.log(tp3m);
    // do we first need to set the timezone offset?
    // tp3m.setMinutes(tp3m.getMinutes() - tp3m.getTimezoneOffset());
    tp3m.setMinutes(tp3m.getMinutes() - tp3m.getTimezoneOffset() + 3);
    var nowtp3mTimeStr = tp3m.toISOString().slice(0, -1);
    // console.log("Now TP3m time", nowtp3mTimeStr);
    setNowp3mTimeValue(nowtp3mTimeStr);
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

  const handleClosePoop = () => setShowPoop(false);
  const handleShowPoop = () => {
    // also gotta update current time
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    let nowTimeStr = now.toISOString().slice(0, -1);
    // console.log("Now time", nowTimeStr);
    setNowTimeValue(nowTimeStr);


    // set now + 3 min for default food, accident and poop time interval 
    const tp3m = new Date();
    // console.log(tp3m);
    // do we first need to set the timezone offset?
    // tp3m.setMinutes(tp3m.getMinutes() - tp3m.getTimezoneOffset());
    tp3m.setMinutes(tp3m.getMinutes() - tp3m.getTimezoneOffset() + 3);
    var nowtp3mTimeStr = tp3m.toISOString().slice(0, -1);
    // console.log("Now TP3m time", nowtp3mTimeStr);
    setNowp3mTimeValue(nowtp3mTimeStr);
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

  const handleClosePee = () => setShowPee(false);
  const handleShowPee = () => {
    // also gotta update current time
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    let nowTimeStr = now.toISOString().slice(0, -1);
    // console.log("Now time", nowTimeStr);
    setNowTimeValue(nowTimeStr);

    // set now + 1 min for default pee and water time interval 
    var tp1m = new Date();
    tp1m.setMinutes(tp1m.getMinutes() - tp1m.getTimezoneOffset() + 1);
    // tp1m.setMinutes(now.getMinutes() + 1);
    // tp1.setMinutes(tp1.getMinutes() - tp1.getTimezoneOffset());
    let nowtp1mTimeStr = tp1m.toISOString().slice(0, -1);
    // console.log("Now TP1m time", nowtp1mTimeStr);
    setNowp1mTimeValue(nowtp1mTimeStr);
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

  var activeTabComp = null;
  var activeTabCompLabel = null;




  if (user !== null) {
    // get the active tab component
    // home is event view
    // Schedule is the Schedule heatmap view
    if (tab === "home") {
      console.log("Shoing home tab");
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
      console.log("Shoing schedule tab");
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
    // show layout for logged in users
    usrLayout = (
      <div class="App">
        <header>🐶💩📜💬
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








        <footer>
          <div>
            <button onClick={handleShowNap}>
              Nap
            </button >
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
            </Container>

          </div>

          <div>
            <button onClick={handleShowFood}>
              Food
            </button>
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

          </div>


          <div>
            <button onClick={handleShowWater}>
              Water
            </button>

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

          </div>


          <div>
            <button onClick={handleShowAccdnt}>
              Accident
            </button>
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

          </div>

          <div>
            <button onClick={handleShowPoop}>
              Poop
            </button>

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

          </div>

          <div>
            <button onClick={handleShowPee}>
              Pee
            </button>

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

    s = `${secsAll} seconds ago`;
  }
  else if (dObj.hours <= 1) {
    var minsAll = Math.floor(dObj.minutes);

    s = `${minsAll} minutes ago`;
  }
  else if (dObj.days <= 1) {
    var hrs = Math.floor(dObj.hours);
    var minsAll = Math.floor(dObj.minutes);
    var minsLeft = minsAll - hrs * 60;
    s = `${hrs} hours ${minsLeft} minutes ago`;

  }
  else if (dObj.days > 1) {
    // var hrs = Math.floor(dObj.hours);
    // var minsAll = Math.floor(dObj.minutes);
    // var minsLeft = minsAll - hrs * 60;
    s = `${dObj.days} days ago`;

  }
  return s;

}

function handleClickCard(e) {
  console.log("Clicked card");
  console.log(e);
  console.log(e.target.getAttribute("data-key"))
}

function TimeLine() {
  console.log("Timelining");
  const trackData = null;
  const dgevents = firestore.collection('testevents');

  const query = dgevents.orderBy('start_time', 'desc');
  const [devents] = useCollectionData(query, { idField: 'id' });
  // console.log(devents);




  // console.log("Got event track:", trackData);
  var trDetails = [];

  var trackDataAll = [];

  var lastAccident = null;

  if (devents == null) {
    console.log("No events");

  }
  else {
    var hms = devents.map((item, index) => {
      // console.log(item.type);

      // console.log(item.start_time);
      var stTime = item.start_time;

      // console.log(stTime.toDate());
      // test it
      const now = new Date();
      const dObj = dateDiffs(stTime.toDate(), now);
      // console.log(dObj);
      const subStr = fmtTimeAgo(dObj);
      // console.log(subStr);
      const messageClass = item.uid === auth.currentUser.uid ? 'sent' : 'received';
      // console.log(item, messageClass);




      if (item.type === "Nap") {
        return (
          <div class="timeline-container evnap">
            <div class="timeline-icon">



            </div>
            <div class="timeline-body" key={index} data-key={item.id} onClick={handleClickCard}>
              <div class="propic">
                <img src={item.photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
              </div>
              <h4 class="timeline-title"><span class="badge">Nap</span></h4>
              <p>{item.note}</p>
              <p class="timeline-subtitle">{subStr}</p>
            </div>
          </div>
        )

      }
      else if (item.type === "Food") {
        return (
          <div class="timeline-container evfood">
            <div class="timeline-icon">
              <i class="far fa-grin-wink"></i>
            </div>
            <div class="timeline-body">
              <div class="propic">
                <img src={item.photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
              </div>
              <h4 class="timeline-title"><span class="badge">Food</span></h4>
              <p>{item.note}</p>
              <p class="timeline-subtitle">{subStr}</p>
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
            <div class="timeline-body">
              <div class="propic">
                <img src={item.photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
              </div>
              <h4 class="timeline-title"><span class="badge">Water</span></h4>
              <p>{item.note}</p>
              <p class="timeline-subtitle">{subStr}</p>
            </div>
          </div>
        )
      }

      else if (item.type === "Accident") {
        // return the last accident date if not already found
        if (lastAccident === null) {
          lastAccident = dObj;
        }
        return (
          <div class="timeline-container evaccident">
            <div class="timeline-icon">
              <i class="far fa-grin-wink"></i>
            </div>
            <div class="timeline-body">
              <div class="propic">
                <img src={item.photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
              </div>
              <h4 class="timeline-title"><span class="badge">Accident</span></h4>
              <p>{item.note}</p>
              <p class="timeline-subtitle">{subStr}</p>
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
            <div class="timeline-body">
              <div class="propic">
                <img src={item.photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
              </div>
              <h4 class="timeline-title"><span class="badge">Poop</span></h4>
              <p>{item.note}</p>
              <p class="timeline-subtitle">{subStr}</p>
            </div>
          </div>
        )
      }

      else if (item.type === "Pee") {
        return (
          <div class="timeline-container evpee">
            <div class="timeline-icon">
              <i class="far fa-grin-wink"></i>
            </div>
            <div class="timeline-body">
              <div class="propic">
                <img src={item.photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
              </div>
              <h4 class="timeline-title"><span class="badge">Pee</span></h4>
              <p>{item.note}</p>
              <p class="timeline-subtitle">{subStr}</p>
            </div>
          </div>
        )
      }
      else {
        return null;
      }



    });







  }

  var numDaysSinceLastAcc = null;

  if (lastAccident !== null) {
    console.log("Got last accident", lastAccident);
    numDaysSinceLastAcc = lastAccident.days;

  }



  // const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';


  // var trackDataPlot = [{
  //   "date": "2021-06-30",
  //   "total": 1,
  //   "details": trDetails

  // }];
  // console.log(trackDataPlot);
  // // console.log(trackDataOld);
  // console.log(trackDataAll);
  // var overview = "day";



  var hmShow2 = (<>
    <div class="timelineblur">

      <h3>Updates</h3>
      <label>{numDaysSinceLastAcc} days since last accident</label>

      <div class="timeline">
        {hms}
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
  console.log(auth.user);
  if (auth.user) {
    return (
      <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
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
    if (i == 0) {
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


  console.log('Today: ' + today);
  // console.log('Yesterday: ' + yesterday);
  console.log(dateArray);
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




  const dgevents = firestore.collection('testevents');

  const query = dgevents.orderBy('create_date');
  const [devents] = useCollectionData(query, { idField: 'id' });




  var dateArr = getDates(3);
  console.log("Got dates", dateArr);

  console.log("events:", devents);
  // console.log(d0events);
  // return null;

  return (<>
    <main>

      <Row>
        <Col>
          <p>{dateArr[0]}</p>
        </Col>
        <Col>
          <Container fluid>

            <p>test</p>
            <EventTrack tdate={dateArr[0]} tdata={devents} />
          </Container>
        </Col>
      </Row>





    </main>

  </>)



  // var hms = dateArr.map((item, index) => {
  //   return (
  //     <div>
  //       <p>{item}</p>
  //       <EventTrack key={index} tdate={item} />
  //     </div>
  //   )
  // });



  // return (<>
  //   <main>


  //   </main>

  // </>)


}

//create your forceUpdate hook
function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}

function EventTrack(props) {
  const trackDate = props.tdate;
  const trackData = props.tdata;




  console.log("Got event track:", trackData);
  // console.log(devents);
  // var startTrackDt = trackDate + " 00:00:00";

  // var trDetails = [
  //   {
  //     "name": "Nap",
  //     "date": startTrackDt,
  //     "value": 0
  //   },
  //   {
  //     "name": "Food",
  //     "date": startTrackDt,
  //     "value": 0
  //   },
  //   {
  //     "name": "Water",
  //     "date": startTrackDt,
  //     "value": 0
  //   },
  //   {
  //     "name": "Accident",
  //     "date": startTrackDt,
  //     "value": 0
  //   },
  //   {
  //     "name": "Poop",
  //     "date": startTrackDt,
  //     "value": 0
  //   },
  //   {
  //     "name": "Pee",
  //     "date": startTrackDt,
  //     "value": 0
  //   }
  // ];
  var trDetails = [];
  // init the template data
  // will be same for all traces

  var trackDataAll = [];

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
      return n.create_date;
    });
    console.log(a)
    console.log(typeof (a))
    _.forEach(a, function (val, key) {
      console.log("Key", key);
      console.log(val);

      var details = [];

      // build up the details for this date
      _.forEach(val, function (value) {

        var est = value['start_time'];
        var estMils = est['seconds'] * 1000
        var dtest = new Date(estMils);
        console.log(dtest);
        var tdateString = moment(dtest).format('YYYY-MM-DD hh:mm:ss');
        console.log("elem", tdateString);
        console.log("elem", typeof (tdateString));
        console.log(value["type"]);
        var d = {
          "name": value["type"],
          "date": tdateString,
          "value": 10
        };
        details.push(d);
      });
      console.log("details");
      console.log(details);

      var dData = {
        "date": key,
        "details": details
      };
      trackDataAll.push(dData);


    });





  }

  // const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';


  var trackDataPlot = [{
    "date": "2021-06-30",
    "total": 1,
    "details": trDetails

  }];
  console.log(trackDataPlot);
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
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

  // Tabs
  const [key, setKey] = useState('home');

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

    var today = new Date();

    var tdateString = moment(today).format('YYYY-MM-DD');
    // console.log(tdateString);

    var stDt = new Date(evData.start_time);
    // console.log(stDt);
    var enDt = new Date(evData.end_time);


    await dgevents.add({
      type: evType,
      create_date: tdateString,
      start_time: stDt,
      end_time: enDt,
      note: evData.notes,
      uid: uid
    });

  }
  // console.log("User:", user);
  let usrLayout = null;



  const handleCloseNap = () => setShowNap(false);
  const handleShowNap = () => setShowNap(true);
  const handleSaveNap = (e) => {
    e.preventDefault();

    console.log("Saving nap");
    console.log(e);
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);
    saveEvent("Nap", formDataObj);
    return false;

  };

  const handleCloseFood = () => setShowFood(false);
  const handleShowFood = () => setShowFood(true);
  const handleSaveFood = (e) => {
    e.preventDefault();

    console.log("Saving food");
    // console.log(e);
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);
    saveEvent("Food", formDataObj);
    return false;

  };

  const handleCloseWater = () => setShowWater(false);
  const handleShowWater = () => setShowWater(true);
  const handleSaveWater = (e) => {
    e.preventDefault();

    console.log("Saving water");
    // console.log(e);
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);
    saveEvent("Water", formDataObj);
    return false;

  };

  const handleCloseAccdnt = () => setShowAccdnt(false);
  const handleShowAccdnt = () => setShowAccdnt(true);
  const handleSaveAccdnt = (e) => {
    e.preventDefault();

    console.log("Saving accdnt");
    // console.log(e);
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);
    saveEvent("Accident", formDataObj);
    return false;

  };

  const handleClosePoop = () => setShowPoop(false);
  const handleShowPoop = () => setShowPoop(true);
  const handleSavePoop = (e) => {
    e.preventDefault();

    console.log("Saving poop");
    // console.log(e);
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);
    saveEvent("Poop", formDataObj);
    return false;

  };

  const handleClosePee = () => setShowPee(false);
  const handleShowPee = () => setShowPee(true);
  const handleSavePee = (e) => {
    e.preventDefault();

    console.log("Saving pee");
    // console.log(e);
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);
    saveEvent("Pee", formDataObj);
    return false;

  };




  if (user !== null) {
    // show layout for logged in users
    usrLayout = (
      <div className="App">
        <header>🐶💩📜💬
          <SignOut />
        </header>

        <div class="main">

          <div class="cardTop">

            <svg width="497" height="219" viewBox="0 0 497 219" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M-38.5 196C-38.5 196 34 91 133.5 91C233 91 427 159 532.5 30C638 -99 518 236 518 236L-49 246.5L-38.5 196Z" fill="#B79972" />
            </svg>



          </div>


          <div class="timeline">

            <h3>Updates</h3>
            <label>23 in the last 7 hours</label>


            <div class="box">

              <div class="container">


                <div class="lines">
                  <div class="dot"></div>
                  <div class="line"></div>
                  <div class="dot"></div>
                  <div class="line"></div>
                  <div class="dot"></div>
                  <div class="line"></div>
                </div>


                <div class="cards">
                  <div class="card">
                    <h4>16:30</h4>
                    <p>Believing Is The Absence<br></br> Of Doubt</p>
                  </div>


                  <div class="card">
                    <h4>15:22</h4>
                    <p>Start With A Baseline</p>
                  </div>
                  <div class="card">
                    <h4>14:15</h4>
                    <p>Break Through Self Doubt<br></br> And Fear</p>
                  </div>









                </div>
              </div>
            </div>
          </div>
        </div>








        <footer>
          <div>
            <button onClick={handleShowNap}>
              Nap
            </button >
            <Modal show={showNap} onHide={handleCloseNap}>

              <Form noValidate onSubmit={handleSaveNap}>

                <Modal.Header closeButton>
                  <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Event Type: <b>Nap</b> </Form.Label>
                    <br></br>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control type="datetime-local" name='start_time' defaultValue={nowTimeValue} />
                    <Form.Label>End Time</Form.Label>
                    <Form.Control type="datetime-local" name='end_time' defaultValue={nowp1TimeValue} />
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

          </div>

          <div>
            <button onClick={handleShowFood}>
              Food
            </button>
            <Modal show={showFood} onHide={handleCloseFood}>

              <Form noValidate onSubmit={handleSaveFood}>

                <Modal.Header closeButton>
                  <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label>Event Type: <b>Food</b> </Form.Label>
                    <br></br>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control type="datetime-local" name='start_time' defaultValue={nowTimeValue} />
                    <Form.Label>End Time</Form.Label>
                    <Form.Control type="datetime-local" name='end_time' defaultValue={nowp3mTimeValue} />
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

                <Modal.Header closeButton>
                  <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group controlId="exampleForm.ControlInput3">
                    <Form.Label>Event Type: <b>Water</b> </Form.Label>
                    <br></br>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control type="datetime-local" name='start_time' defaultValue={nowTimeValue} />
                    <Form.Label>End Time</Form.Label>
                    <Form.Control type="datetime-local" name='end_time' defaultValue={nowp1mTimeValue} />
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

                <Modal.Header closeButton>
                  <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group controlId="exampleForm.ControlInput4">
                    <Form.Label>Event Type: <b>Accdnt</b> </Form.Label>
                    <br></br>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control type="datetime-local" name='start_time' defaultValue={nowTimeValue} />
                    <Form.Label>End Time</Form.Label>
                    <Form.Control type="datetime-local" name='end_time' defaultValue={nowp3mTimeValue} />
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

                <Modal.Header closeButton>
                  <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group controlId="exampleForm.ControlInput4">
                    <Form.Label>Event Type: <b>Poop</b> </Form.Label>
                    <br></br>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control type="datetime-local" name='start_time' defaultValue={nowTimeValue} />
                    <Form.Label>End Time</Form.Label>
                    <Form.Control type="datetime-local" name='end_time' defaultValue={nowp3mTimeValue} />
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

                <Modal.Header closeButton>
                  <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group controlId="exampleForm.ControlInput4">
                    <Form.Label>Event Type: <b>Pee</b> </Form.Label>
                    <br></br>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control type="datetime-local" name='start_time' defaultValue={nowTimeValue} />
                    <Form.Label>End Time</Form.Label>
                    <Form.Control type="datetime-local" name='end_time' defaultValue={nowp1mTimeValue} />
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
        <header>🐶💩📜💬
        </header>

        <section>
          <SignIn />
        </section>

      </div>
    );

  }

  return usrLayout;
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
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
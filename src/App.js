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
import Card from "react-bootstrap/Card";
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import CalendarHeatmap from 'reactjs-calendar-heatmap'
import moment from 'moment';

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyAZfYl7NnQYt33R6b0aN1MRc1A_MqpLcQw",
    authDomain: "doggoyaam.firebaseapp.com",
    projectId: "doggoyaam",
    storageBucket: "doggoyaam.appspot.com",
    messagingSenderId: "748545462168",
    appId: "1:748545462168:web:d04a9d32a27de7a0eae5ed"
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
  const [nowp1TimeValue, setNowp1TimeValue] = useState(null);

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

      // window.addEventListener('load', () => {
      //   const now = new Date();
      //   now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      //   document.getElementsByName('date_of_birth').value = now.toISOString().slice(0, -1);
      // });
    },
    []
  )

  const saveEvent = async (evType, evData) => {
    console.log("Save event", evType, evData);

    const { uid, photoURL } = auth.currentUser;
    // const sts = await firebase.firestore.FieldValue.serverTimestamp();

    var today = new Date();

    var tdateString = moment(today).format('YYYY-MM-DD');
    console.log(tdateString);

    var stDt = new Date(evData.start_time);
    console.log(stDt);
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
  console.log("User:", user);
  let usrLayout = null;


  const handleClickNap = () => {
    console.log("Clicked log nap");
  }

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

  const handleCloseWater = () => setShowWater(false);
  const handleShowWater = () => setShowWater(true);

  const handleCloseAccdnt = () => setShowAccdnt(false);
  const handleShowAccdnt = () => setShowAccdnt(true);

  const handleClosePoop = () => setShowPoop(false);
  const handleShowPoop = () => setShowPoop(true);

  const handleClosePee = () => setShowPee(false);
  const handleShowPee = () => setShowPee(true);




  if (user !== null) {
    // show layout for logged in users
    usrLayout = (
      <div className="App">
        <header>🐶💩📜💬
          <SignOut />
        </header>

        <section>
          <TrackerView />
        </section>

        <footer>
          <div>
            <button onClick={handleShowNap}>
              Nap
            </button >
            <Modal show={showNap} onHide={handleCloseNap}>
              <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSaveNap}>
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


                  <Button variant="secondary" onClick={handleCloseNap}>
                    Close
                  </Button>

                  <Button type="submit">
                    Save
                  </Button>
                </Form>


              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseNap}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleCloseNap}>
                  Save Changes
                </Button>

              </Modal.Footer>
            </Modal>

          </div>

          <button>
            Food
          </button>


          <button>
            Water
          </button>


          <button>
            Accident
          </button>

          <button>
            Poop
          </button>

          <button>
            Pee
          </button>
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

  // const d0query = dgevents.where('create_date', '==', dateArr[0]);
  // const [d0events] = useCollectionData(d0query, { idField: 'id' });

  // const d1query = dgevents.where('create_date', '==', dateArr[1]);
  // const [d1events] = useCollectionData(d1query, { idField: 'id' });

  // const d2query = dgevents.where('create_date', '==', dateArr[2]);
  // const [d2events] = useCollectionData(d2query, { idField: 'id' });

  // const d3query = dgevents.where('create_date', '==', dateArr[0]);
  // const [d3events] = useCollectionData(d3query, { idField: 'id' });

  // const d4query = dgevents.where('create_date', '==', dateArr[0]);
  // const [d4events] = useCollectionData(d4query, { idField: 'id' });

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



    // // got events
    // for (let index = 0; index < trackData.length; index++) {
    //   var element = trackData[index];
    //   console.log("elem", element);
    //   console.log("elem", element['start_time']);
    //   // will be in mills
    //   var est = element['start_time'];
    //   var estMils = est['seconds'] * 1000
    //   var dtest = new Date(estMils);
    //   console.log(dtest);
    //   var tdateString = moment(dtest).format('YYYY-MM-DD hh:mm:ss');
    //   console.log("elem", tdateString);
    //   console.log("elem", typeof (tdateString));
    //   console.log(element["type"]);

    //   const d = {
    //     name: element["type"],
    //     date: tdateString,
    //     value: 1
    //   }
    //   // trDetails.push(d);
    //   // var d2 = {
    //   //   "name": "Poo",
    //   //   "date": "2021-06-30 13:37:00",
    //   //   "value": 10
    //   // }
    //   // trDetails.push(d2);

    //   // var d = {};

    //   // d = {
    //   //   "name": "Pee",
    //   //   "date": "2021-06-30 13:37:00",
    //   //   "value": 10
    //   // }
    //   trDetails.push(d);


    // }
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

  return hmShow;
}


export default App;
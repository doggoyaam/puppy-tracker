import React, { useEffect, useRef, useState } from 'react';
import { useBetween } from "use-between";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';


import firebaseApp from './FirebaseApp';
// import firebase from 'firebase/app';
// import 'firebase/firestore';
// import 'firebase/auth';
// import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import Form from "react-bootstrap/Form";
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
// use custom calanderheatmap component
import moment from 'moment';
// import { interpolateNumber, timeMillisecond } from 'd3';

import EventTrack from './EventTrack';
import { getDates } from './utils';
const firestore = firebaseApp.firestore();
// const analytics = firebase.analytics();
var _ = require('lodash');

const evCollectionName = process.env.REACT_APP_FIREBASE_APP_COLL_NAME;



function TrackerView() {
    // const dummy = useRef();

    const [nowDateValue, setNowDateValue] = useState(null);





    const dgevents = firestore.collection(evCollectionName);

    // var start = moment().startOf('day'); // set to 12:00 am today
    // var end = moment().endOf('day'); // set to 23:59 pm today


    var start = new Date(nowDateValue);
    start.setMinutes(start.getMinutes() - start.getTimezoneOffset());
    start.setHours(0, 0, 0, 0);

    let prevStart = moment(start).subtract(1, 'day').toDate();
    // prevStart.setMinutes(prevStart.getMinutes() - prevStart.getTimezoneOffset());
    // prevStart.setDate(start.getDate() - 1);

    prevStart.setHours(0, 0, 0, 0);

    console.log("Prev start", prevStart);


    var end = new Date(nowDateValue);
    end.setMinutes(end.getMinutes() - end.getTimezoneOffset());

    end.setHours(23, 59, 59, 999);
    let prevEnd = moment(end).subtract(1, 'day').toDate();
    // prevEnd.setMinutes(prevEnd.getMinutes() - prevEnd.getTimezoneOffset());
    // prevEnd.setDate(end.getDate() - 1);

    prevEnd.setHours(23, 59, 59, 999);

    console.log("Prev End", prevEnd);
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

    const queryComp = dgevents.where('start_time', ">=", prevStart)
        .where('start_time', "<", prevEnd)
        .orderBy('start_time', 'desc');
    // .limit(25);
    const [deventsComp] = useCollectionData(queryComp, { idField: 'id' });
    console.log("DEV COMP", deventsComp);




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

                    <Container fluid>

                        <p>{nowDateValue}</p>
                        <EventTrack tdate={dateArr[1]} tdata={deventsComp} />
                    </Container>
                </Col>
            </Row>
        </div>







    </>)






}

export default TrackerView;
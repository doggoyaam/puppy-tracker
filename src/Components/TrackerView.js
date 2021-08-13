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
import ToggleButton from 'react-bootstrap/ToggleButton'
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
    const [compDateValue, setCompDateValue] = useState(null);

    const [compareState, setCompareState] = useState(false);
    const [showCompDtPicker, setShowCompDtPicker] = useState(false);






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

    // set the prevStartComp date if user specified
    var compStart = null;
    var compEnd = null;
    if (compDateValue === null) {
        console.log("no comp date set, using default");
        compStart = prevStart;
        compEnd = prevEnd;
    }
    else {
        console.log("comp date set");
        // user picked date. set to the user date
        const csDate = new Date(compDateValue);

        let csprevStart = moment(csDate).toDate();
        // prevStart.setMinutes(prevStart.getMinutes() - prevStart.getTimezoneOffset());
        // prevStart.setDate(start.getDate() - 1);

        csprevStart.setHours(0, 0, 0, 0);

        console.log("Prev start", csprevStart);


        let csprevEnd = moment(csDate).toDate();
        // prevEnd.setMinutes(prevEnd.getMinutes() - prevEnd.getTimezoneOffset());
        // prevEnd.setDate(end.getDate() - 1);

        csprevEnd.setHours(23, 59, 59, 999);

        compStart = csprevStart;
        compEnd = csprevEnd;

    }


    const query = dgevents.where('start_time', ">=", start)
        .where('start_time', "<", end)
        .orderBy('start_time', 'desc');
    // .limit(25);
    const [devents] = useCollectionData(query, { idField: 'id' });


    // only get comp data if user selected
    var queryComp;
    if (compareState === true) {
        queryComp = dgevents.where('start_time', ">=", compStart)
            .where('start_time', "<", compEnd)
            .orderBy('start_time', 'desc');
    }


    // .limit(25);
    const [deventsComp] = useCollectionData(queryComp, { idField: 'id' });
    console.log("DEV COMP", deventsComp);




    var dateArr = getDates(3);
    // console.log("Got dates", dateArr);

    // console.log("events:", devents);
    // console.log(d0events);
    // return null;
    console.log("Compare state", compareState);


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

    const handleClickCompDate = (e) => {
        console.log("Clicked on compare date", e);
        setShowCompDtPicker(true);
    }

    let compElem = null;
    if (compareState === true) {
        var cdateString = moment(compStart).format('YYYY-MM-DD');
        compElem = (<>
            <Container fluid>

                <div onClick={handleClickCompDate}>
                    <p style={{ 'color': '#000' }}>{cdateString}</p>
                    <Form.Control size='sm' type="date" name='start_date_comp' defaultValue={cdateString} onChange={changeEvent => setCompDateValue(changeEvent.target.value)} />
                </div>
                <EventTrack compId={2} tdate={cdateString} tdata={deventsComp} />
            </Container>

        </>);
    }



    return (<>
        <div class="scheduleblur">

            <h3>Schedule</h3>
            <Container fluid>

                <Row>
                    <Col>
                        <Form.Group controlId="exampleForm.ControlInputSch1" as={Row} >
                            <Col sm={4}>
                                <Form.Label > Select Date</Form.Label>
                            </Col>
                            <Col sm={5}>

                                <Form.Control size='sm' type="date" name='start_date' defaultValue={nowDateValue} onChange={changeEvent => setNowDateValue(changeEvent.target.value)} />
                            </Col>
                            <Col sm={2}>
                                <ToggleButton
                                    id="toggle-check"
                                    type="checkbox"
                                    variant="outline-dark"
                                    checked={compareState}
                                    defaultValue={compareState}
                                    size='sm'
                                    value="1"
                                    onChange={changeEvent => setCompareState(changeEvent.currentTarget.checked)}
                                >
                                    <div>Compare</div>
                                </ToggleButton>

                            </Col>

                        </Form.Group>


                        <Container fluid>

                            <p style={{ 'color': '#000' }}>{nowDateValue}</p>
                            <EventTrack compId={1} tdate={dateArr[0]} tdata={devents} />
                        </Container>

                        {compElem}


                    </Col>
                </Row>
            </Container>
        </div>







    </>)






}

export default TrackerView;
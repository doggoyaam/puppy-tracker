import React from 'react';
import { useBetween } from "use-between";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


import firebaseApp from './FirebaseApp';

import { useCollectionData } from 'react-firebase-hooks/firestore';
import moment from 'moment';
// import { interpolateNumber, timeMillisecond } from 'd3';
import styled from 'styled-components'

import useShareableState from './ShareableState';
import { dateDiffs, fmtTimeAgo } from './utils';


const auth = firebaseApp.auth();
const firestore = firebaseApp.firestore();
// const analytics = firebase.analytics();
var _ = require('lodash');

const evCollectionName = process.env.REACT_APP_FIREBASE_APP_COLL_NAME;




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

export default TimeLine
import React, { useEffect, useRef, useState } from 'react';
import { useBetween } from "use-between";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';


import firebaseApp from './FirebaseApp';
// import firebase from 'firebase/app';
// import 'firebase/firestore';
// import 'firebase/auth';
// import 'firebase/analytics';

// use custom calanderheatmap component
import CalendarHeatmap from './calendar-heatmap.component';
import moment from 'moment';
// import { interpolateNumber, timeMillisecond } from 'd3';


var _ = require('lodash');

const evCollectionName = process.env.REACT_APP_FIREBASE_APP_COLL_NAME;

function EventTrack(props) {
    const trackDate = props.tdate;
    const trackData = props.tdata;
    const evCompId = props.compId;



    let trackDataAll = [];

    if (trackData == null) {
        console.log("No events");

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
                compId={evCompId}
                data={trackDataAll}
                overview={overview}
            >
            </CalendarHeatmap>
        </>);

    }
    else {
        hmShow = null;

    }
    //   useForceUpdate();

    return hmShow;
}

export default EventTrack;
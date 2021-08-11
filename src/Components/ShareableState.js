import { useState } from 'react';


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

    // handle filter by event type
    const [filterNapChecked, setFilterNapChecked] = useState(false);
    const [filterFoodChecked, setFilterFoodChecked] = useState(false);
    const [filterWaterChecked, setFilterWaterChecked] = useState(false);
    const [filterAccidentChecked, setFilterAccidentChecked] = useState(false);
    const [filterPoopChecked, setFilterPoopChecked] = useState(false);
    const [filterPeeChecked, setFilterPeeChecked] = useState(false);

    // const [filterEventsValue, setFilterEventsValue] = useState("");





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
        setfilterStartTimeValue,

        filterNapChecked,
        setFilterNapChecked,
        filterFoodChecked,
        setFilterFoodChecked,
        filterWaterChecked,
        setFilterWaterChecked,
        filterAccidentChecked,
        setFilterAccidentChecked,
        filterPoopChecked,
        setFilterPoopChecked,
        filterPeeChecked,
        setFilterPeeChecked
    }
}
export default useShareableState;
import React, {useEffect} from 'react';
import {useGeolocated, useOrientation} from "../../hooks";
import {calcQiblaDegreeToPoint, getQiblaAngle} from "../../utils";

const Pusula: React.FC = () => {

    const orientation = useOrientation();

    const {coords, isGeolocationAvailable, isGeolocationEnabled} =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: true,
            },
            userDecisionTimeout: 5000,
        });


    useEffect(() => {
        if (coords) {
            console.log('getQiblaAngle: ', getQiblaAngle(coords.latitude, coords.longitude))
            console.log('calcQiblaDegreeToPoint: ', calcQiblaDegreeToPoint(coords.latitude, coords.longitude))
        }
    }, [coords]);


    useEffect(() => {
        if (orientation) {
            console.log('orientation: ', orientation)
        }
    }, [orientation]);

    return !isGeolocationAvailable ? (
        <div>Your browser does not support Geolocation</div>
    ) : !isGeolocationEnabled ? (
        <div>Geolocation is not enabled</div>
    ) : coords ? (
        <table>
            <tbody>
            <tr>
                <td>latitude</td>
                <td>{coords.latitude}</td>
            </tr>
            <tr>
                <td>longitude</td>
                <td>{coords.longitude}</td>
            </tr>
            <tr>
                <td>altitude</td>
                <td>{coords.altitude}</td>
            </tr>
            <tr>
                <td>heading</td>
                <td>{coords.heading}</td>
            </tr>
            <tr>
                <td>speed</td>
                <td>{coords.speed}</td>
            </tr>
            <tr>
                <td>accuracy</td>
                <td>{coords.accuracy}</td>
            </tr>
            <tr>
                <td>alpha</td>
                <td>{orientation.orientation?.alpha}</td>
            </tr>
            <tr>
                <td>beta</td>
                <td>{orientation.orientation?.beta}</td>
            </tr>
            <tr>
                <td>gamma</td>
                <td>{orientation.orientation?.gamma}</td>
            </tr>
            </tbody>
        </table>
    ) : (
        <div>Getting the location data&hellip; </div>
    );
};

export default Pusula;
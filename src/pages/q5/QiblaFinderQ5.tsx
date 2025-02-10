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
                <td>alpha (orientation)</td>
                <td>{orientation.orientation?.alpha}</td>
            </tr>
            <tr>
                <td>beta (orientation)</td>
                <td>{orientation.orientation?.beta}</td>
            </tr>
            <tr>
                <td>gamma (orientation)</td>
                <td>{orientation.orientation?.gamma}</td>
            </tr>

            <tr>
                <td>x (motion)</td>
                <td>{orientation.motion?.x}</td>
            </tr>
            <tr>
                <td>y (motion)</td>
                <td>{orientation.motion?.y}</td>
            </tr>
            <tr>
                <td>z (motion)</td>
                <td>{orientation.motion?.z}</td>
            </tr>
            <tr>
                <td>alpha (motion)</td>
                <td>{orientation.motion?.alpha}</td>
            </tr>
            <tr>
                <td>beta (motion)</td>
                <td>{orientation.motion?.beta}</td>
            </tr>
            <tr>
                <td>gamma (motion)</td>
                <td>{orientation.motion?.gamma}</td>
            </tr>
            <tr>
                <td>gravityX (motion)</td>
                <td>{orientation.motion?.gravityX}</td>
            </tr>
            <tr>
                <td>gravityY (motion)</td>
                <td>{orientation.motion?.gravityY}</td>
            </tr>
            <tr>
                <td>gravityZ (motion)</td>
                <td>{orientation.motion?.gravityZ}</td>
            </tr>
            </tbody>
        </table>
    ) : (
        <div>Getting the location data&hellip; </div>
    );
};

export default Pusula;
import {useEffect, useState} from "react";

export function useOrientation(): {
    orientation: DeviceOrientationEvent | undefined;
    motion: DeviceMotionEvent | undefined
} {
    const [orientation, SetOrientation] = useState<DeviceOrientationEvent>()
    const [motion, SetMotion] = useState<DeviceMotionEvent>()

    useEffect(() => {
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientationabsolute', (e) => {
                console.log('deviceorientationabsolute: ', e)
                SetOrientation(e)
            });
        }
        if (window.ondevicemotion) {
            window.addEventListener('devicemotion', (e) => {
                console.log('devicemotion: ', e)
                SetMotion(e)
            });
        }
    }, []);

    return {orientation, motion}
}
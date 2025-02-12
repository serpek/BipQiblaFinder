import {useCallback, useEffect, useState} from "react";

export interface OrientationResult {
    absolute: boolean | null
    alpha: number | null
    beta: number | null
    gamma: number | null
}

export function useOrientation(): {
    orientation: OrientationResult | undefined
    requestPermission: () => Promise<void>
    isOrientationGranted: boolean
} {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    const [orientation, setOrientation] = useState<OrientationResult>()
    const [isOrientationGranted, setIsOrientationGranted] = useState(
        // @ts-expect-error iOS özellik kontrolü
        typeof DeviceOrientationEvent.requestPermission !== "function",
    );

    const requestPermission = useCallback(async () => {
        try {
            // @ts-expect-error iOS özellik kontrolü
            if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                // @ts-expect-error iOS özellik kontrolü
                const permissionState = await DeviceOrientationEvent.requestPermission()
                setIsOrientationGranted(permissionState === "granted");
            }
        } catch {
            setIsOrientationGranted(false);
        }
    }, []);

    const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
        let alpha = e.alpha;
        // @ts-expect-error iOS özellik kontrolü
        if (e.webkitCompassHeading) {
            // @ts-expect-error iOS özellik kontrolü
            alpha = e.webkitCompassHeading;
        } else if (e.absolute && typeof e.alpha === 'number') {
            // alpha = (360 - e.alpha) % 360;
            alpha = e.alpha;
        }
        setOrientation((prev) => ({
            ...prev,
            absolute: e.absolute,
            alpha: Math.round(alpha || 0),
            beta: Math.round(e.beta || 0),
            gamma: Math.round(e.gamma || 0)
        }))
    }, []);

    useEffect(() => {
        if (isOrientationGranted) {

            if (isIOS) {
                window.addEventListener("deviceorientation", handleOrientation, true);
            } else {
                window.addEventListener("deviceorientationabsolute", handleOrientation, true);
            }

            return () => {
                if (isIOS) {
                    window.removeEventListener("deviceorientation", handleOrientation);
                } else {
                    window.removeEventListener("deviceorientationabsolute", handleOrientation);
                }
            };
        }
    }, [isOrientationGranted, handleOrientation, isIOS]);


    useEffect(() => {
        requestPermission().catch(console.error)
    }, []);

    return {orientation, requestPermission, isOrientationGranted}
}
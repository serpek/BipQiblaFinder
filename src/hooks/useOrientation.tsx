import {useCallback, useEffect, useState} from "react";

export interface OrientationResult {
    alpha: number | null
    beta: number | null
    gamma: number | null
}

export interface MotionResult {
    x: number | null | undefined
    y: number | null | undefined
    z: number | null | undefined
    alpha: number | null | undefined
    beta: number | null | undefined
    gamma: number | null | undefined
    gravityX: number | null | undefined
    gravityY: number | null | undefined
    gravityZ: number | null | undefined
}

interface DeviceOrientationEventExtended extends DeviceOrientationEvent {
    requestPermission?: () => Promise<"granted" | "denied">;
}

interface DeviceMotionEventExtended extends DeviceMotionEvent {
    requestPermission?: () => Promise<"granted" | "denied">;
}

export function useOrientation(): {
    orientation: OrientationResult | undefined;
    orientationAbsolute: OrientationResult | undefined;
    motion: MotionResult | undefined
    requestPermission: () => Promise<void>
} {
    const [orientation, setOrientation] = useState<OrientationResult>()
    const [orientationAbsolute, setOrientationAbsolute] = useState<OrientationResult>()
    const [motion, setMotion] = useState<MotionResult>()

    // Determine if we need to request permission (for iOS 13+)
    const [isOrientationGranted, setIsOrientationGranted] = useState(
        typeof (DeviceOrientationEvent as unknown as DeviceOrientationEventExtended)
            .requestPermission !== "function",
    );
    const [isMotionGranted, setIsMotionGranted] = useState(
        typeof (DeviceMotionEvent as unknown as DeviceMotionEventExtended)
            .requestPermission !== "function",
    );

    const requestPermission = useCallback(async () => {
        const deviceOrientationEvent = DeviceOrientationEvent as unknown as DeviceOrientationEventExtended;
        if (typeof deviceOrientationEvent.requestPermission === "function") {
            deviceOrientationEvent.requestPermission()
                .then(permissionState => {
                    setIsOrientationGranted(permissionState === "granted");
                }).catch(console.error);
        }

        const deviceMotionEvent = DeviceMotionEvent as unknown as DeviceMotionEventExtended;
        if (typeof deviceMotionEvent.requestPermission === 'function') {
            deviceMotionEvent.requestPermission()
                .then(permissionState => {
                    setIsMotionGranted(permissionState === "granted");
                }).catch(console.error);
        }
    }, []);

    const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
        setOrientation((prev) => ({
            ...prev,
            alpha: Math.round(e.alpha || 0),
            beta: Math.round(e.beta || 0),
            gamma: Math.round(e.gamma || 0)
        }))
    }, []);

    const handleOrientationAbsolute = useCallback((e: DeviceOrientationEvent) => {
        setOrientationAbsolute((prev) => ({
            ...prev,
            alpha: Math.round(e.alpha || 0),
            beta: Math.round(e.beta || 0),
            gamma: Math.round(e.gamma || 0)
        }))
    }, []);

    const handleMotion = useCallback((e: DeviceMotionEvent) => {
        setMotion((prev) => ({
            ...prev,
            x: Math.round(e.acceleration?.x || 0),
            y: Math.round(e.acceleration?.y || 0),
            z: Math.round(e.acceleration?.z || 0),
            alpha: Math.round(e.rotationRate?.alpha || 0),
            beta: Math.round(e.rotationRate?.beta || 0),
            gamma: Math.round(e.rotationRate?.gamma || 0),
            gravityX: Math.round(e.accelerationIncludingGravity?.x || 0),
            gravityY: Math.round(e.accelerationIncludingGravity?.y || 0),
            gravityZ: Math.round(e.accelerationIncludingGravity?.z || 0),
        }))
    }, []);

    useEffect(() => {
        if (window.DeviceOrientationEvent && 'ondeviceorientationabsolute' in window) {
            window.addEventListener('deviceorientationabsolute', handleOrientationAbsolute);

            return () => {
                window.removeEventListener("deviceorientationabsolute", handleOrientationAbsolute);
            };
        }
    }, [handleOrientationAbsolute]);

    useEffect(() => {
        if (isOrientationGranted) {
            window.addEventListener("deviceorientation", handleOrientation);

            return () => {
                window.removeEventListener("deviceorientation", handleOrientation);
            };
        }
    }, [isOrientationGranted, handleOrientation]);

    useEffect(() => {
        if (isMotionGranted) {
            window.addEventListener("devicemotion", handleMotion);

            return () => {
                window.removeEventListener("devicemotion", handleMotion);
            };
        }
    }, [isMotionGranted, handleMotion]);


    useEffect(() => {
        requestPermission().catch(console.error)
    }, []);

    return {orientation, orientationAbsolute, motion, requestPermission}
}
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
    motion: MotionResult | undefined
    requestPermission: () => Promise<void>
} {
    const [orientation, setOrientation] = useState<OrientationResult>()
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
        setOrientation((prev) => ({...prev, alpha: e.alpha, beta: e.beta, gamma: e.gamma}))
    }, []);

    const handleMotion = useCallback((e: DeviceMotionEvent) => {
        setMotion((prev) => ({
            ...prev,
            x: e.acceleration?.x,
            y: e.acceleration?.y,
            z: e.acceleration?.z,
            alpha: e.rotationRate?.alpha,
            beta: e.rotationRate?.beta,
            gamma: e.rotationRate?.gamma,
            gravityX: e.accelerationIncludingGravity?.x,
            gravityY: e.accelerationIncludingGravity?.y,
            gravityZ: e.accelerationIncludingGravity?.z,
        }))
    }, []);

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

    return {orientation, motion, requestPermission}
}
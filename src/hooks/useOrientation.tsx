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

export function useOrientation(): {
    orientation: OrientationResult | undefined;
    motion: MotionResult | undefined
} {
    const [orientation, setOrientation] = useState<OrientationResult>()
    const [motion, setMotion] = useState<MotionResult>()

    // Determine if we need to request permission (for iOS 13+)
    const [isPermissionGranted, setIsPermissionGranted] = useState(
        typeof (DeviceOrientationEvent as unknown as DeviceOrientationEventExtended)
            .requestPermission !== "function",
    );

    const requestPermission = useCallback(async () => {
        const deviceOrientationEvent =
            DeviceOrientationEvent as unknown as DeviceOrientationEventExtended;

        if (typeof deviceOrientationEvent.requestPermission === "function") {
            try {
                const permissionState = await deviceOrientationEvent.requestPermission();
                setIsPermissionGranted(permissionState === "granted");
            } catch (error) {
                console.error("Error requesting device orientation permission:", error);
            }
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
        if (isPermissionGranted) {
            window.addEventListener("deviceorientation", handleOrientation);

            return () => {
                window.removeEventListener("deviceorientation", handleOrientation);
            };
        }
    }, [isPermissionGranted, handleOrientation]);

    useEffect(() => {
        requestPermission().catch(console.error)

        // if (window.DeviceOrientationEvent) {
        //     window.addEventListener('deviceorientationabsolute', handleOrientation);
        // }

        if (window.ondevicemotion) {
            window.addEventListener('devicemotion', handleMotion);
        }
    }, []);

    return {orientation, motion}
}
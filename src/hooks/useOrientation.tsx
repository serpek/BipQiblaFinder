import {useEffect, useState} from "react";

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


export function useOrientation(): {
    orientation: OrientationResult | undefined;
    motion: MotionResult | undefined
} {
    const [orientation, SetOrientation] = useState<OrientationResult>()
    const [motion, SetMotion] = useState<MotionResult>()

    useEffect(() => {
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientationabsolute', (e) => {
                SetOrientation({alpha: e.alpha, beta: e.beta, gamma: e.gamma})
            });
        }
        if (window.ondevicemotion) {
            window.addEventListener('devicemotion', (e) => {
                console.log('devicemotion: ', e)
                SetMotion({
                    x: e.acceleration?.x,
                    y: e.acceleration?.y,
                    z: e.acceleration?.z,
                    alpha: e.rotationRate?.alpha,
                    beta: e.rotationRate?.beta,
                    gamma: e.rotationRate?.gamma,
                    gravityX: e.accelerationIncludingGravity?.x,
                    gravityY: e.accelerationIncludingGravity?.y,
                    gravityZ: e.accelerationIncludingGravity?.z,
                })
            });
        }
    }, []);

    return {orientation, motion}
}
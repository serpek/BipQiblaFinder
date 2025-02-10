export * from './qibla';

export const calcQiblaDegreeToPoint = (latitude: number, longitude: number) => {
    // Qibla geolocation
    const point = {
        lat: 21.422487,
        lng: 39.826206,
    };

    const phiK = (point.lat * Math.PI) / 180.0;
    const lambdaK = (point.lng * Math.PI) / 180.0;
    const phi = (latitude * Math.PI) / 180.0;
    const lambda = (longitude * Math.PI) / 180.0;
    const psi =
        (180.0 / Math.PI) *
        Math.atan2(
            Math.sin(lambdaK - lambda),
            Math.cos(phi) * Math.tan(phiK) -
            Math.sin(phi) * Math.cos(lambdaK - lambda)
        );
    return Math.round(psi);
};


export function getQiblaAngle(latitude: number, longitude: number): number {
    const makkahLat = 21.4225 * (Math.PI / 180);
    const makkahLng = 39.8262 * (Math.PI / 180);
    const userLat = latitude * (Math.PI / 180);
    const userLng = longitude * (Math.PI / 180);

    const deltaLng = makkahLng - userLng;

    const angle = Math.atan2(
        Math.sin(deltaLng),
        Math.cos(userLat) * Math.tan(makkahLat) - Math.sin(userLat) * Math.cos(deltaLng)
    );

    return (angle * (180 / Math.PI) + 360) % 360;
}

export function toRadians(degrees: number) {
    return degrees * (Math.PI / 180);
}

export function toDegrees(radians: number) {
    return radians * (180 / Math.PI);
}
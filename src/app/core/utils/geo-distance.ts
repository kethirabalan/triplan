type GeoPoint = {
    lat: number;
    lng: number;
};
export default (
    point1: GeoPoint,
    point2: GeoPoint
): number => {
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);

    const R = 6371000; // Earth's radius in meters

    const dLat = toRadians(point2.lat - point1.lat);
    const dLng = toRadians(point2.lng - point1.lng);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in meters

    return distance;
};

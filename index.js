const geoViewport = require("@mapbox/geo-viewport");
const SphericalMercator = require("@mapbox/sphericalmercator");


class LongLatToXY {
    constructor(points, width, height, size) {
        this.points = points;
        this.height = height;
        this.width = width;
        this.boundingBox = this.getBoundingBox(points);
        this.canvasCenter = [width / 2, height / 2];
        this.mercator = new SphericalMercator({
            size: size || 256
        });
        this.viewport = geoViewport.viewport(this.boundingBox, [
            width,
            height
        ], 0, 16, size || 256);
    }

    getBoundingBox(points) {
        let xMax, xMin, yMax, yMin;
        for (let i = 0; i < points.length; i++) {
            let point = {};
            point.x = parseFloat(points[i][0]);
            point.y = parseFloat(points[i][1]);
            
            // set starting point
            if (i === 0) {
                xMax = point.x;
                xMin = point.x;
                yMax = point.y;
                yMin = point.y;
            }

            if (point.x > xMax) {
                xMax = point.x;
            }
            if (point.x < xMin) {
                xMin = point.x;
            }
            if (point.y > yMax) {
                yMax = point.y;
            }
            if (point.y < yMin) {
                yMin = point.y;
            }
        }
        return [xMin, yMin, xMax, yMax];
    }

    xy() {
        const {points, canvasCenter, viewport} = this;
        const centerPx = this.mercator.px(viewport.center, viewport.zoom);

        let translatedLocations = points.map(point => {
            let px = this.mercator.px([point[0], point[1]], viewport.zoom);
            let lonDifference = -(centerPx[0] - px[0]) + canvasCenter[0];
            let latDifference = -(centerPx[1] - px[1]) + canvasCenter[1];
            return [lonDifference, latDifference];
        });
        return translatedLocations;

    }
}

module.exports = LongLatToXY;
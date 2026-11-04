import * as Cesium from 'cesium';

// A camera-only virtual drone tour; imagery comes from the configured Cesium layers.
const radians = Cesium.Math.toRadians;
export function installDestinationFlybys(viewer, destinations, onState) {
  let active = false;
  let sequence = 0;
  let suppressMove = false;
  let lastAutoId = null;
  const candidates = destinations.filter(d => Number.isFinite(d.lat) && Number.isFinite(d.lng));
  const report = (name = '', flying = false) => onState({ name, flying });
  function cancel() {
    sequence += 1;
    active = false;
    viewer.camera.cancelFlight();
    report();
  }
  function flyTo(destination) {
    if (!destination || viewer.isDestroyed()) return;
    sequence += 1;
    const run = sequence;
    active = true;
    lastAutoId = destination.id;
    report(destination.name, true);
    const { lng, lat } = destination;
    const stages = [
      { height: 95000, heading: -25, pitch: -62, duration: 2.8 },
      { height: 14500, heading: 20, pitch: -43, duration: 3.4 },
      { height: 3800, heading: 75, pitch: -29, duration: 3.6 },
      { height: 2100, heading: 140, pitch: -38, duration: 3.8 }
    ];
    function next(index) {
      if (run !== sequence || viewer.isDestroyed()) return;
      if (index >= stages.length) {
        active = false;
        report(destination.name, false);
        return;
      }
      const stage = stages[index];
      suppressMove = true;
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lng, lat, stage.height),
        orientation: {
          heading: radians(stage.heading),
          pitch: radians(stage.pitch),
          roll: 0
        },
        duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : stage.duration,
        easingFunction: Cesium.EasingFunction.SINUSOIDAL_IN_OUT,
        complete: () => {
          suppressMove = false;
          next(index + 1);
        },
        cancel: () => {
          suppressMove = false;
        }
      });
    }
    next(0);
  }
  const selectionListener = entity => {
    const destination = entity?.properties?.ryftlandsId?.getValue(Cesium.JulianDate.now());
    const match = candidates.find(d => d.id === destination);
    if (match) flyTo(match);
  };
  const zoomListener = () => {
    if (active || suppressMove || viewer.isDestroyed()) return;
    const position = viewer.camera.positionCartographic;
    if (!position || position.height > 110000 || position.height < 400) {
      if (position?.height > 180000) lastAutoId = null;
      return;
    }
    const lon = Cesium.Math.toDegrees(position.longitude);
    const lat = Cesium.Math.toDegrees(position.latitude);
    const cameraPoint = Cesium.Cartesian3.fromDegrees(lon, lat);
    const nearest = candidates.map(d => ({
      d,
      meters: Cesium.Cartesian3.distance(cameraPoint, Cesium.Cartesian3.fromDegrees(d.lng, d.lat))
    })).sort((a, b) => a.meters - b.meters)[0];
    if (nearest && nearest.meters < 70000 && nearest.d.id !== lastAutoId) flyTo(nearest.d);
  };
  viewer.selectedEntityChanged.addEventListener(selectionListener);
  viewer.camera.moveEnd.addEventListener(zoomListener);
  return {
    flyTo,
    cancel,
    destroy() {
      sequence += 1;
      viewer.selectedEntityChanged.removeEventListener(selectionListener);
      viewer.camera.moveEnd.removeEventListener(zoomListener);
      if (!viewer.isDestroyed()) viewer.camera.cancelFlight();
    }
  };
}


window.CESIUM_BASE_URL = '/dist/Cesium'
import * as Cesium from 'cesium'
import "../public/Cesium/Widgets/widgets.css";
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YTAzYzFiOS1mOTY1LTQyZDUtODAyMi1iY2RmM2E1NmUzNTQiLCJpZCI6MTI1MTE4LCJpYXQiOjE2NzY2MDI5NzJ9.dwRnODmpnx1Ro2dZerSDAaiaYh8kWHrGABzzE5L_rbw';

const esriWms = new Cesium.ArcGisMapServerImageryProvider({
  url: 'http://localhost:8010/arcgis/rest/services/HGGeopark/MapServer',
  enablePickFeatures: false,
  defaultAlpha: 1
});
const viewer = new Cesium.Viewer("cesiumContainer", {

  terrainProvider: Cesium.createWorldTerrain(),
  contextOptions: {
    webgl: {
      alpha: true
    }
  },
  // imageryProvider: esriWms,
  // creditContainer: "creditContainer",

  selectionIndicator: false,

  animation: false,  //是否显示动画控件

  baseLayerPicker: false, //是否显示图层选择控件

  geocoder: false, //是否显示地名查找控件

  timeline: false, //是否显示时间线控件

  sceneModePicker: true, //是否显示投影方式控件

  navigationHelpButton: false, //是否显示帮助信息控件

  infoBox: false,  //是否显示点击要素之后显示的信息

  fullscreenButton: true
});
const buildingsTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());

//取消双击事件

// viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(-104.9965, 39.74248, 4000)
})
//设置homebutton的位置
// STEP 3 CODE
async function addBuildingGeoJSON () {
  // Load the GeoJSON file from Cesium ion.
  const geoJSONURL = await Cesium.IonResource.fromAssetId(1554645);
  // Create the geometry from the GeoJSON, and clamp it to the ground.
  const geoJSON = await Cesium.GeoJsonDataSource.load(geoJSONURL, { clampToGround: true });
  // Add it to the scene.
  const dataSource = await viewer.dataSources.add(geoJSON);
  // By default, polygons in CesiumJS will be draped over all 3D content in the scene.
  // Modify the polygons so that this draping only applies to the terrain, not 3D buildings.
  for (const entity of dataSource.entities.values) {
    entity.polygon.classificationType = Cesium.ClassificationType.TERRAIN;
  }
  // Move the camera so that the polygon is in view.
  viewer.flyTo(dataSource);
}
addBuildingGeoJSON();
// STEP 4 CODE
// Hide individual buildings in this area using 3D Tiles Styling language.
buildingsTileset.style = new Cesium.Cesium3DTileStyle({
  // Create a style rule to control each building's "show" property.
  show: {
    conditions: [
      // Any building that has this elementId will have `show = false`.
      ['${elementId} === 332469316', false],
      ['${elementId} === 332469317', false],
      ['${elementId} === 235368665', false],
      ['${elementId} === 530288180', false],
      ['${elementId} === 530288179', false],
      // If a building does not have one of these elementIds, set `show = true`.
      [true, true]
    ]
  },
  // Set the default color style for this particular 3D Tileset.
  // For any building that has a `cesium#color` property, use that color, otherwise make it white.
  color: "Boolean(${feature['cesium#color']}) ? color(${feature['cesium#color']}) : color('#ffffff')"
});
Cesium.Camera.DEFAULT_VIEW_RECTANGLE =

  Cesium.Rectangle.fromDegrees(110.15, 34.54, 110.25, 34.56);//Rectangle(west, south, east, north)

//设置初始位置

// viewer.camera.setView({

//   destination: Cesium.Cartesian3.fromDegrees(110.20, 34.55, 3000000)

// });
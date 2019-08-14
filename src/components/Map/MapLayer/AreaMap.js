import { iserverBasePath } from '../../../services/config';
import mapboxgl from 'mapbox-gl';
import * as SuperMap from '@supermap/iclient-mapboxgl'
class AreaMap {
    constructor(map) {
        this.map = map;
        this.data = null;
        this.addMapLay = this.addMapLay.bind(this);
        this.removeMapLay = this.removeMapLay.bind(this);
        this.filterBy = this.filterBy.bind(this);
        this.dataUrl = iserverBasePath;
        this.popup;
        this.themeLayer;
        this.closeInfoWin = () => {
            if (this.popup) {
                this.popup.remove(this.map);
            }
        }
    }
    MapLayData() {

    }
    addMapLay() {
        let IDs = [];
        for (let i = 1; i < 20; i++) {
            IDs.push(i)
        }
        let idsParam = new SuperMap.GetFeaturesByIDsParameters({
            IDs: IDs,
            datasetNames: ['data:派出所辖区'],
            fromIndex: 0,
            toIndex: 10000,
            maxFeatures: 10000
        });
        let service = new mapboxgl.supermap.FeatureService(this.dataUrl);
        let themeLayerOptions = {
            map: this.map,
            attributions: " ",
            themeFields: ["CON2009", "CON2010", "CON2011", "CON2012", "CON2013"],
            opacity: 0.9,
            chartsSetting: {},
        };
        service.getFeaturesByIDs(idsParam, (serviceResult) => {
            let data = serviceResult.result.features.features;
            let features = [];
            window.mapboxgl = mapboxgl;
            let chartsSettingForPieOrRing = {
                width: 240,
                height: 100,
                codomain: [0, 40000],       // 允许图表展示的值域范围，此范围外的数据将不制作图表
                sectorStyle: { fillOpacity: 0.8 },      // 柱状图中柱条的（表示字段值的图形）样式
                sectorStyleByFields: [
                    { fillColor: "#FFB980" },
                    { fillColor: "#5AB1EF" },
                    { fillColor: "#B6A2DE" },
                    { fillColor: "#2EC7C9" },
                    { fillColor: "#D87A80" }],
                sectorHoverStyle: { fillOpacity: 1 },
                xShapeBlank: [10, 10, 10],      // 水平方向上的空白间距参数
                axisYLabels: ["4万", "3万", "2万", "1万", "0"],         // y 轴标签内容
                axisXLabels: ["09年", "10年", "11年", "12年", "13年"],         // x 轴标签内容
                backgroundStyle: { fillColor: "#CCE8CF" },        // 背景样式
                backgroundRadius: [5, 5, 5, 5],        // 背景框圆角参数
            };
            for (let i in data) {
                // var provinceInfo = data[i];
                var geo = new mapboxgl.LngLat(data[i].properties['GEOX'], data[i].properties['GEOY']);
                var attrs = {};
                attrs.NAME = data[i].properties['POLICE_NAME'];
                attrs.CON2009 = data[i].properties['刑释解教不满五年'];
                attrs.CON2010 = data[i].properties['吸毒前科人员数']
                attrs.CON2011 = data[i].properties['上访重点人数'];
                attrs.CON2012 = data[i].properties['重性精神病人员数'];
                attrs.CON2013 = data[i].properties['国保重点人数'];
                var fea = new mapboxgl.supermap.ThemeFeature(geo, attrs);
                features.push(fea);
                //     let dataMap =  [
                //         {value: data[i].properties['刑释解教不满五年'], name:'刑释解教不满五年'},
                //         {value: data[i].properties['吸毒前科人员数'], name:'吸毒前科人员数'},
                //         {value: data[i].properties['上访重点人数'], name:'上访重点人数'},
                //         {value: data[i].properties['重性精神病人员数'], name:'重性精神病人员数'},
                //         {value: data[i].properties['国保重点人数'], name:'国保重点人数'}
                //     ]
                //     let div = document.createElement('div');
                //     let chart = echarts.init(div, '', {
                //             width: 100,
                //             height: 100,
                //             background:'rgba(128, 128, 128, 0)',
                //             margin:'0',
                //             padding:'0'
                //     });
                //     var option = {
                //         backgroundColor:'rgba(128, 128, 128, 0)',
                //         tooltip: {
                //             trigger: 'item',
                //             // formatter: "{a} <br/>{b}: {c} ({d}%)"
                //         },
                //         series: [{
                //                 type:'pie',
                //                 center: ['50%', '50%'],
                //                 data: dataMap,
                //                 labelLine: {
                //                     normal: {
                //                         show: false
                //                     }
                //                 },
                //             }]
                //     };
                //     chart.setOption(option);
                //    let popup = new mapboxgl.Popup();
                //    popup.setLngLat([data[i].properties.GEOX,data[i].properties.GEOY])
                //         .setDOMContent(div) // sets a popup on this marker
                //         .addTo(this.map);
            }
            // //Pie add Ring chartsSetting


            themeLayerOptions.chartsSetting = chartsSettingForPieOrRing;
            this.themeLayer = new mapboxgl.supermap.GraphThemeLayer("PieLayer", "Pie", themeLayerOptions);
            this.themeLayer.addFeatures(features);
            //专题图层 mousemove 事件
            this.themeLayer.on('mousemove', this.showInfoWin.bind(this, this.themeLayer, data));
        });
    }

    showInfoWin(themeLayer, data, e) {
        this.closeInfoWin(this.props);
        // e.target 是图形对象，即数据的可视化对象，柱状图中是柱条;
        // 图形对象的 refDataID 属性是数据（feature）的 id 属性，它指明图形对象是由那个数据制作而来;
        // 图形对象的 dataInfo 属性是图形对象表示的具体数据，他有两个属性，field 和 value;
        if (e.target && e.target.refDataID && e.target.dataInfo) {
            // 获取图形对应的数据 (feature)
            var fea = themeLayer.getFeatureById(e.target.refDataID);

            var info = e.target.dataInfo;
            // 弹窗内容
            var contentHTML = '';
            contentHTML = "<div style='color: #000; background-color: #fff'>";

            contentHTML += "所属派出所:<br><strong>" + fea.data.NAME + "</strong>";

            contentHTML += "<hr style='margin: 3px'>";
            switch (info.field) {
                case "CON2009":
                    contentHTML += "刑释解教不满五年:<br/><strong>" + info.value + "</strong>（人）";
                    break;
                case "CON2010":
                    contentHTML += "吸毒前科人员数:<br/><strong>" + info.value + "</strong>（人）";
                    break;
                case "CON2011":
                    contentHTML += "上访重点人数:<br/><strong>" + info.value + "</strong>（人）";
                    break;
                case "CON2012":
                    contentHTML += "重性精神病人员数:<br/><strong>" + info.value + "</strong>（人）";
                    break;
                case "CON2013":
                    contentHTML += "国保重点人数:<br/><strong>" + info.value + "</strong>（人）";
                    break;
                default:
                    contentHTML += "No Data";
            }
            contentHTML += "</div>";
            var tempPoint = this.map.unproject(new window.mapboxgl.Point(e.event.offsetX, e.event.offsetY));
            this.popup = new mapboxgl.Popup({ closeOnClick: false })
                .setLngLat([tempPoint.lng, tempPoint.lat])
                .setHTML(contentHTML)
                .addTo(this.map);
            return;
        }
        this.closeInfoWin(this.popup);
    }

    filterBy(time) {
        let filters = ["all", [">=", "time", time - 365], ["<=", "time", time + 365]]
        this.map.setFilter('IntersectionMap', filters);
    }
    removeMapLay() {
        if (this.map.getLayer("IntersectionMap")) {
            this.map.removeLayer("IntersectionMap");
            this.map.removeSource("IntersectionMap");
        }
        if (this.map.getLayer("addIntersectionMap")) {
            this.map.removeLayer("addIntersectionMap");
            this.map.removeSource("addIntersectionMap");
        }
    }
}
export default AreaMap;

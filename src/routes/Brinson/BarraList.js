import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Tabs, Table, Button, Icon } from 'antd';
import { NavigationBar } from './NavigationBar';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import "echarts/lib/component/toolbox";
require("echarts/lib/component/legendScroll");
import styles from './BrinsonList.less';

var $ = require("jquery");
//import exportExcel from '../../utils/exportExcel';
var exportExcel = require('../../utils/exportExcel');
var common = require('../../utils/common');

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
export default class BrinsonList extends Component {
  state = {
    currentTabKey: '3',
    //display1:display1,
  };


  componentDidMount() {
    this.props.dispatch({
      type: 'chart/fetch',
    }).then(()=>{
        
        const { indexData, exContribution, configData, stockcrossData } = this.props.chart;
        this.displayChart1(indexData,exContribution);
        this.displayChart2(indexData,configData,stockcrossData);
    });

    this.props.dispatch({
      type: 'chart/getStrategyInfo',
    }).then(()=>{
        console.log(this.props.chart.strategyInfo);
    })

    this.setState({
      strategy_id: common.getParamFromURLOrCookie('strategy_id',true),
      index_code : common.getParamFromURLOrCookie('index_code',true),
      begin_date : common.getParamFromURLOrCookie('begin_date',true),
      end_date : common.getParamFromURLOrCookie('end_date',true),
    });

  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  //绘制图表1
  displayChart1=function(xAxisData,yAxisData){
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('chartId1'));
    // 绘制图表
    var option = {
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                for(var i = 0; i < params.length; i++) {
                    return params[i].name + '</br>' + params[i].seriesName + ':' + (params[i].value * 100).toFixed(2) + '%';
                }
            }
        },
        toolbox: {
            show: true,
            x: '90%',
            feature : {
                dataView : {
                    show : true,
                    readOnly : true
                },
                saveAsImage: {　　　　
                    show: true,
                    name:'Brinson归因-超额贡献图',
            　　　　excludeComponents: ['toolbox'],
            　　　　pixelRatio: 2   　　　　
                }
            }
        },
        legend: {
            data: ['超额贡献']
        },
        itemStyle: {
            color: '#108ee9',
        },
        xAxis: {
            axisLabel: {
                rotate: 45
            },
            data: xAxisData
        },
        yAxis: {},
        series: [{
            name: '超额贡献',
            type: 'bar',
            data: yAxisData
        }]
    };
    myChart.setOption(option);
  }

displayChart2 = (xAxisData, configData, stockcrossData) => {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chartId2'));

        var option = {
            toolbox: {
                show: true,
                x: '90%',
                feature: {
                    dataView: {
                        show: true,
                        readOnly: true
                    },
                    saveAsImage: {
                        show: true,
                        name: 'Brinson归因-行业配置等图',
                        　　　　excludeComponents: ['toolbox'],
                        　　　　pixelRatio: 2
                    }
                }
            },
            legend: {
                data: ['行业配置', '选股+交叉']
            },
            itemStyle: {
                color: '#108ee9',
            },
            xAxis: {
                axisLabel: {
                    rotate: 45
                },
                data: xAxisData
            },
            yAxis: {},
            series: [{
                name: '行业配置',
                type: 'bar',
                itemStyle: {
                    color: '#108ee9'
                },
                data: configData,
                formatter: function(params) {
                    for(var i = 0; i < params.length; i++) {
                        return params[i].name + '</br>' + params[i].seriesName + ':' + (params[i].value * 100).toFixed(2) + '%';
                    }
                }
            }, {
                name: '选股+交叉',
                type: 'bar',
                itemStyle: {
                    color: '#C0504D'
                },
                data: stockcrossData,
                formatter: function(params) {
                    for(var i = 0; i < params.length; i++) {
                        return params[i].name + '</br>' + params[i].seriesName + ':' + (params[i].value * 100).toFixed(2) + '%';
                    }
                }
            }]
        };
        myChart.setOption(option);
    };


   //替代锚点的方案
   //参考：https://blog.csdn.net/mrhaoxiaojun/article/details/79960792
  scrollToAnchor = (anchorName) => {
    if (anchorName) {
        // 找到锚点
        let anchorElement = document.getElementById(anchorName);
        // 如果对应id的锚点存在，就跳转到锚点
        if(anchorElement) { anchorElement.scrollIntoView({block: 'start', behavior: 'smooth'}); }
    }
  }

  //下载
  downloadExcel = (id,excelName)=>{
    var tableInnerHtml = $("#"+ id).find("table").html();
    exportExcel.exprotTableHtmlExcel(tableInnerHtml,excelName);
  }

  render() {
    
    const { chart, loading } = this.props;
    const { indexData, exContribution, configData, stockcrossData,strategyInfo } = chart;

    //this.display1(indexData, exContribution);

    const brinsonData = []; //数据 brinson数据
    for (let i = 0; i < indexData.length; i++) {
      brinsonData.push({
        index: i + 1,
        x: indexData[i],
        y: exContribution[i],
      });
    }

    const columns = [
      {
        title: '项目',
        dataIndex: 'x',
        key: 'x',
      },
      {
        title: '超额贡献',
        dataIndex: 'y',
        key: 'y',
        //sorter: (a, b) => a.count - b.count,
        className: styles.alignRight,
      },
    ];


    const brinsonData2 = []; //行业配置和交叉股
    for (let i = 0; i < indexData.length; i++) {
      brinsonData2.push({
        index: i + 1,
        x: indexData[i],
        y: configData[i],
        z: stockcrossData[i],
      });
    }
    const columns2 = [
      {
        title: '项目',
        dataIndex: 'x',
        key: 'x',
      },
      {
        title: '行业配置',
        dataIndex: 'y',
        key: 'y',
        //sorter: (a, b) => a.count - b.count,
        className: styles.alignRight,
      },
      {
        title: '选股+交叉',
        dataIndex: 'z',
        key: 'z',
        //sorter: (a, b) => a.count - b.count,
        className: styles.alignRight,
      },
    ];

    return (
      <Fragment>
        <NavigationBar currentKey={this.state.currentTabKey} />

        <Card loading={loading} bordered={false} style={{ marginTop: 24 }}>
          
            <div className="row bar_title">
              <div className="col-sm-6">
                <p>策略：<span>{strategyInfo.strategy_name}</span></p>
              </div>
              <div className="col-sm-6">
                <p>日期：<span>{this.state.begin_date}~{this.state.end_date}</span></p>
              </div>
            </div>
          
          <div>
             <Button type="primary" icon="download" onClick={()=>this.downloadExcel('table1','Brinson归因-超额贡献图')}>导出Excel</Button>
             <Button type="primary" icon="table" style={{ marginLeft: 24 }} onClick={()=>this.scrollToAnchor('table1')}>详细数据</Button>
          </div>
          <div id="chartId1" style={{ width: '95%', height: 500 }} />
        </Card>
        <Card loading={loading} bordered={false} style={{ marginTop: 24 }}>
          <div>
             <Button type="primary" icon="download" onClick={()=>this.downloadExcel('table2','Brinson归因-行业配置等图')}>导出Excel</Button>
             <Button type="primary" icon="table" style={{ marginLeft: 24 }} onClick={()=>this.scrollToAnchor('table2')}>详细数据</Button>
          </div>
          <div id="chartId2" style={{ width: '95%', height: 500 }} />
        </Card>

        <Card loading={loading} bordered={false} style={{ marginTop: 24 }}>
          <Table
            rowKey={record => record.index}
            size="small"
            columns={columns}
            dataSource={brinsonData}
            pagination={{
              style: { marginBottom: 0 },
              pageSize: 100,
            }}

            id="table1"
          />
        </Card>

        <Card loading={loading} bordered={false} style={{ marginTop: 24 }}>
          <Table
            rowKey={record => record.index}
            size="small"
            columns={columns2}
            dataSource={brinsonData2}
            pagination={{
              style: { marginBottom: 0 },
              pageSize: 100,
            }}

            id="table2"
          />
        </Card>
      </Fragment>
    );
  }
}

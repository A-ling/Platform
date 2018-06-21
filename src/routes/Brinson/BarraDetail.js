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
    currentTabKey: '4',
    //display1:display1,
  };


  componentDidMount() {
    this.props.dispatch({
      type: 'chart/fetch', //获取模拟的data数据
    }).then(()=>{
        
    });

    this.props.dispatch({
      type: 'chart/getStrategyInfo', //获取策略详情：根据策略ID获取策略详情，传入id待解决
    }).then(()=>{
        console.log(this.props.chart.strategyInfo);
    })

    //获取链接中的参数值
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

  //下载
  // downloadExcel = (id,excelName)=>{
  //   var tableInnerHtml = $("#"+ id).find("table").html();
  //   exportExcel.exprotTableHtmlExcel(tableInnerHtml,excelName);
  // }

  render() {
    
    const { chart, loading } = this.props;
    const { indexData,columnsData, exContribution, configData, stockcrossData, dataData, strategyInfo } = chart;


    //表头
    const columns = [
      {
        title: '行业/项目',
        dataIndex: 'col0',
        key: 'col0',
      },
    ];
    for (let i = 0; i < columnsData.length; i++){
      columns.push({
        title: columnsData[i],
        dataIndex: 'col'+(i+1),
        key: 'col'+(i+1),
        className: styles.alignRight,
      });
    }

    //行数据
    const brinsonData = [];
    for (let i = 0; i < indexData.length; i++) {
        var item = {};
        item["index"] = i;
        item["col0"] = indexData[i]
        for (let j = 0; j < columnsData.length; j++){
          item["col"+(j+1)] = dataData[i][j];
        }
        brinsonData.push(item);
    }

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

      </Fragment>
    );
  }
}

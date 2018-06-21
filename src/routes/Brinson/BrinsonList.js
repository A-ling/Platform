import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Tabs, Table } from 'antd';
import { NavigationBar } from './NavigationBar';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import styles from './BrinsonList.less';

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
export default class BrinsonList extends Component {
  state = {
    currentTabKey: '1',
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'chart/fetch',
    });

    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    // 绘制图表
    myChart.setOption({
      title: {
        text: 'ECharts 入门示例',
      },
      tooltip: {},
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20],
        },
      ],
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  render() {
    const { chart, loading } = this.props;
    const { indexData, exContribution, configData, stockcrossData } = chart;

    const brinsonData = []; //数据 brinson数据
    for (let i = 0; i < indexData.length; i++) {
      brinsonData.push({
        index: i + 1,
        x: indexData[i],
        y: exContribution[i],
      });
    }

    const brinsonData2 = []; //行业配置和交叉股
    for (let i = 0; i < indexData.length; i++) {
      brinsonData2.push({
        index: i + 1,
        x: indexData[i],
        y: [configData[i], stockcrossData[i]],
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

    //		DrawConfigurationBar = (xAxisData, configData, stockcrossData) => {
    //			var dom = document.getElementById('ConfigurationBar');
    //			var ConfigurationBar = echarts.init(dom);
    //
    //			var option = {
    //				toolbox: {
    //					show: true,
    //					x: '90%',
    //					feature: {
    //						dataView: {
    //							show: true,
    //							readOnly: true
    //						},
    //						saveAsImage: {
    //							show: true,
    //							name: 'Brinson归因-行业配置等图',
    //							　　　　excludeComponents: ['toolbox'],
    //							　　　　pixelRatio: 2
    //						}
    //					}
    //				},
    //				legend: {
    //					data: ['行业配置', '选股+交叉']
    //				},
    //				itemStyle: {
    //					color: '#108ee9',
    //				},
    //				xAxis: {
    //					axisLabel: {
    //						rotate: 45
    //					},
    //					data: xAxisData
    //				},
    //				yAxis: {},
    //				series: [{
    //					name: '行业配置',
    //					type: 'bar',
    //					itemStyle: {
    //						color: '#108ee9'
    //					},
    //					data: configData,
    //					formatter: function(params) {
    //						for(var i = 0; i < params.length; i++) {
    //							return params[i].name + '</br>' + params[i].seriesName + ':' + (params[i].value * 100).toFixed(2) + '%';
    //						}
    //					}
    //				}, {
    //					name: '选股+交叉',
    //					type: 'bar',
    //					itemStyle: {
    //						color: '#C0504D'
    //					},
    //					data: stockcrossData,
    //					formatter: function(params) {
    //						for(var i = 0; i < params.length; i++) {
    //							return params[i].name + '</br>' + params[i].seriesName + ':' + (params[i].value * 100).toFixed(2) + '%';
    //						}
    //					}
    //				}]
    //			};
    //
    //			ConfigurationBar.setOption(option);
    //		};
    //
    //		DrawExContributionBar = (xAxisData, yAxisData) => {
    //			var dom = document.getElementById('ExContributionBar');
    //			var ExContributionBar = echarts.init(dom);
    //			var option = {
    //				tooltip: {
    //					trigger: 'axis',
    //					formatter: function(params) {
    //						for(var i = 0; i < params.length; i++) {
    //							return params[i].name + '</br>' + params[i].seriesName + ':' + (params[i].value * 100).toFixed(2) + '%';
    //						}
    //					}
    //				},
    //				toolbox: {
    //					show: true,
    //					x: '90%',
    //					feature: {
    //						dataView: {
    //							show: true,
    //							readOnly: true
    //						},
    //						saveAsImage: {
    //							show: true,
    //							name: 'Brinson归因-超额贡献图',
    //							　　　　excludeComponents: ['toolbox'],
    //							　　　　pixelRatio: 2
    //						}
    //					}
    //				},
    //				legend: {
    //					data: ['超额贡献']
    //				},
    //				itemStyle: {
    //					color: '#108ee9',
    //				},
    //				xAxis: {
    //					axisLabel: {
    //						rotate: 45
    //					},
    //					data: xAxisData
    //				},
    //				yAxis: {},
    //				series: [{
    //					name: '超额贡献',
    //					type: 'bar',
    //					data: yAxisData
    //				}]
    //			};
    //			ExContributionBar.setOption(option);
    //		};

    return (
      <Fragment>
        <NavigationBar currentKey={this.state.currentTabKey} />
        <Card loading={loading} bordered={false} style={{ marginTop: 24 }}>
          <div id="main" style={{ width: '95%', height: 500 }} />
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
          />
        </Card>
      </Fragment>
    );
  }
}

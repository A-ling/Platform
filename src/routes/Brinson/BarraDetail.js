import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Icon,
  Card,
  Tabs,
  Table,
  Radio,
  DatePicker,
  Tooltip,
  Menu,
  Dropdown,
} from 'antd';
import numeral from 'numeral';
import {
  ChartCard,
  yuan,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  Bar,
  Pie,
  TimelineChart,
} from 'components/Charts';
import Trend from 'components/Trend';
import NumberInfo from 'components/NumberInfo';
import { getTimeDistance } from '../../utils/utils';
import { NavigationBar } from './NavigationBar';
import styles from './BarraDetail.less';
//var echarts = require('echarts');

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const Yuan = ({ children }) => (
  <span dangerouslySetInnerHTML={{ __html: yuan(children) }} /> /* eslint-disable-line react/no-danger */
);

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
export default class BarraDetail extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '4',
    rangePickerValue: getTimeDistance('year'),
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'chart/fetch',
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
    const {
      indexData,
      exContribution,
      configData,
      stockcrossData,
    } = chart;

    const brinsonData = [];//数据 brinson数据
    for(let i=0;i<indexData.length;i++){
      brinsonData.push({
          index:(i+1),
          x:indexData[i],
          y:exContribution[i]
      });
    }

    const brinsonData2=[]; //行业配置和交叉股
    for(let i=0;i<indexData.length;i++){
      brinsonData2.push({
          index:(i+1),
          x:indexData[i],
          y:[configData[i],stockcrossData[i]]
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

    return (
      <Fragment>
         
        <NavigationBar currentKey={this.state.currentTabKey}/>
        <Card loading={loading} bordered={false}>
        <div className={styles.salesCard}>
          <div className={styles.salesBar}>
            <div id="configurationBar"></div>
            <Bar height={295} title="超额贡献" data={brinsonData} />
          </div>
           </div>
        </Card>
          <Card
            loading={loading}
            bordered={false}
            style={{ marginTop: 24 }} >
            <Table
              rowKey={record => record.index}
              size="small"
              columns={columns}
              dataSource={brinsonData}
              pagination={{
                style: { marginBottom: 0 },
                pageSize:100,
              }}
            />
          </Card>
         
      </Fragment>
    );
  }
}

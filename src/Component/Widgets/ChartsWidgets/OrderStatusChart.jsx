import React, { Fragment } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ShoppingBag } from 'react-feather';
import { Card, CardBody, Col, } from 'reactstrap';
import { OrderStatus } from '../../../Constant';
import { progress1, progress2, progress3, progress4, progress5 } from '../../../Pages/Widgets/Charts/WidgetChartsData';
import ChartHeader from './Common/ChartHeader';

const OrderStatusChart = () => {
  return (
    <Fragment>
      <Col xl="8" lg="12" className="box-col-6 xl-50">
        <Card>
          <ChartHeader title={OrderStatus}>
            <ShoppingBag className="text-muted" />
          </ChartHeader>
          <CardBody className="pt-0">
            <div className="chart-container order-chart">
              <div id="progress1">
                <ReactApexChart options={progress1.options} series={progress1.series} height="70" type="bar" />
              </div>
              <div id="progress2">
                <ReactApexChart options={progress2.options} series={progress2.series} height="70" type="bar" />
              </div>
              <div id="progress3">
                <ReactApexChart options={progress3.options} series={progress3.series} height="70" type="bar" />
              </div>
              <div id="progress4">
                <ReactApexChart options={progress4.options} series={progress4.series} height="70" type="bar" />
              </div>
              <div id="progress5">
                <ReactApexChart options={progress5.options} series={progress5.series} height="70" type="bar" />
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Fragment>
  );
};
export default OrderStatusChart;
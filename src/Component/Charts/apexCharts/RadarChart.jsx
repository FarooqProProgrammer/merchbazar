import React, { Fragment, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody, Col } from 'reactstrap';
import { RadarChart } from '../../../Constant/index';
import CommenHeader from '../Commen';
import { apexRadarPolygonfillCharts } from './apexData';

const RadarChartClass = () => {
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    let timer = setTimeout(() => setDisplay(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if(!display) {
  return <></>;
  }
  return (
    <Fragment>
      <Col sm='12' xl="6" className='box-col-6'>
        <Card>
          <CommenHeader title={RadarChart} />
          <CardBody>
            <div id='radarchart'>
              <Chart options={apexRadarPolygonfillCharts.options} series={apexRadarPolygonfillCharts.series} type="radar" height={350} />
            </div>
          </CardBody>
        </Card>
      </Col>
    </Fragment>
  );
};

export default RadarChartClass;
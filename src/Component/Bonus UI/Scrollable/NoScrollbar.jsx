import React, { Fragment } from 'react';
import ScrollBar from 'react-perfect-scrollbar';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';
import { H5, Image } from '../../../AbstractElements';

const NoScrollbar = () => {
  return (
    <Fragment>
      <Col sm="6">
        <Card>
          <CardHeader className="pb-0">
            <H5>{'No Scrollbar'}</H5>
          </CardHeader>
          <CardBody>
            <ScrollBar className="vertical-scroll"
              options={{ suppressScrollX: true, suppressScrollY: true }}
            >
              <div>
                <Image attrImage={{ src: `${require('../../../assets/images/banner/1.jpg')}`, alt: "", height: "600" }} />
              </div>
            </ScrollBar>
          </CardBody>
        </Card>
      </Col>
    </Fragment>
  );
};

export default NoScrollbar;
import React, { Fragment } from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import { H4, Image, P } from '../../../AbstractElements';
import { MainCardPara1, MainCardPara2 } from '../../../Data/KnowledegesBase';
import knowledgebase from '../../../assets/images/knowledgebase/1.jpg';

const MainCard = () => {
  return (
    <Fragment>
      <Col xl="9" className='xl-60 box-col-8'>
        <div className="blog-single">
          <div className="blog-box">
            <Card>
              <Image attrImage={{ className: 'img-fluid w-100', src: `${knowledgebase}`, alt: 'blog-main' }} />
            </Card>
            <Card>
              <CardBody>
                <div className="blog-details">
                  <H4 attrH4={{ className: 'mt-0' }}>Why Choose Knowledge Course ?</H4>
                  <div className="single-blog-content-top">
                    <P>{MainCardPara1}</P>
                    <P>{MainCardPara2}</P>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </Col>
    </Fragment>
  );
};
export default MainCard;
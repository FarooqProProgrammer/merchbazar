import React, { Fragment } from 'react';
import { Col, Card, CardBody, CardHeader } from 'reactstrap';
import { H5 } from '../../../AbstractElements';
import { SpillDragNDrop, CopyDragNDrop } from '../../../Constant';

const Draggables = (props) => {
    const { dragulaDecoratorSpill = '', dragulaDecoratorRight = '' } = props;
    return (
        <Fragment>
            <Col sm="12">
                <Card>
                    <CardHeader className='pb-0'>
                        <H5>{SpillDragNDrop}</H5>
                    </CardHeader>
                    <CardBody>
                        <div className="ui-sortable" id="draggableMultiple">
                            <div className='container' ref={dragulaDecoratorSpill}>
                                <div>{'You can move these elements between these two containers'}</div>
                                <div>{'Moving them anywhere else isn\'t quite possible'}</div>
                                <div>{'There\'s also the possibility of moving elements around in the same container, changing their position'}</div>
                                <div>{'This is the default use case. You only need to specify the containers you want to use'}</div>
                                <div>{'You can move these elements between these two containers'}</div>
                                <div>{'Moving them anywhere else isn\'t quite possible'}</div>
                                <div>{'Make sure to check out the documentation on GitHub!'}</div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
            <Col sm="12">
                <Card>
                    <CardHeader className='pb-0'>
                        <H5>{CopyDragNDrop}</H5>
                    </CardHeader>
                    <CardBody>
                        <div className="ui-sortable" id="draggableMultiple">
                            <div className='container' id="right" ref={dragulaDecoratorRight}>
                                <div>{'There\'s also the possibility of moving elements around in the same container, changing their position'}</div>
                                <div>{'This is the default use case. You only need to specify the containers you want to use'}</div>
                                <div>{'You can move these elements between these two containers'}</div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Fragment>
    );
};

export default Draggables;
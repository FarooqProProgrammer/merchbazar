import React from 'react';
import { Col, Card, CardBody, Pagination, PaginationItem, PaginationLink, CardHeader } from 'reactstrap';
import { H5, UL } from '../../../AbstractElements';
import { PaginationSizing, Previous, Next } from '../../../Constant';

const PaginationSizingClass = () => {
    return (
        <Col xl="12">
            <Card>
                <CardHeader className='pb-0'>
                    <H5>{PaginationSizing}</H5>
                </CardHeader>
                <CardBody>
                    <Pagination className="m-b-30" aria-label="Page navigation example">
                        <UL attrUL={{ className: 'simple-list flex-row pagination pagination-lg pagination-primary' }}>
                            <PaginationItem>
                                <PaginationLink href="#javascript">{Previous}</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#javascript">{'1'}</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#javascript">{'2'}</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#javascript">{'3'}</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#javascript">{Next}</PaginationLink>
                            </PaginationItem>
                        </UL>
                    </Pagination>
                    <Pagination aria-label="Page navigation example">
                        <UL attrUL={{ className: 'simple-list flex-row pagination pagination-sm pagination-primary' }}>
                            <PaginationItem>
                                <PaginationLink href="#javascript">{Previous}</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#javascript">{'1'}</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#javascript">{'2'}</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#javascript">{'3'}</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#javascript">{Next}</PaginationLink>
                            </PaginationItem>
                        </UL>
                    </Pagination>
                </CardBody>
            </Card>
        </Col>
    );
};

export default PaginationSizingClass;
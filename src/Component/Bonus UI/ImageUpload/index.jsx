import React, { Fragment, useState } from 'react';
import Files from 'react-files';
import { Container, Row, Col, Card, CardBody, CardHeader } from 'reactstrap';
import { SelectSingleImageUpload, MultipleImageUpload } from '../../../Constant';
import { Btn, H5, Image } from '../../../AbstractElements';

const UploadImageContain = () => {
    const [files, setFiles] = useState([]);

    function deleteFile(e) {
        setFiles([]);
        return files

    }
    const onFilesChange = (files) => {
        setFiles(files)
    }
    const onFilesError = (error, file) => {
        setFiles(file)
    }

    return (
        <Fragment>
            <Container fluid={true}>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardHeader className='pb-0'>
                                <h5>{SelectSingleImageUpload}</h5>
                            </CardHeader>
                            <CardBody className="fileUploader">
                                <Files
                                    className='files-dropzone fileContainer'
                                    onChange={onFilesChange}
                                    onError={onFilesError}
                                    accepts={['image/*']}
                                    multiple={false}
                                    maxFileSize={10000000}
                                    minFileSize={0}
                                    clickable
                                >
                                    {
                                        files.length > 0
                                            ? <div className='files-gallery'>
                                                {files.map((file, index) =>
                                                    <div key={index}>
                                                        <Image attrImage={{ className: 'files-gallery-item', alt: "img", src: `${file.preview.url}` }} />
                                                    </div>
                                                )}
                                            </div>

                                            : <div className="d-flex justify-content-center">
                                                <Btn attrBtn={{ className: "mt-2", type: "button", color: 'primary' }} >Upload Image</Btn>
                                            </div>
                                    }
                                </Files>
                                {files.length > 0 ?
                                    <div className="d-flex justify-content-center">
                                        <Btn attrBtn={{ className: "mt-2", color: 'primary', type: "button", onClick: () => deleteFile(files) }} >
                                            Delete
                                        </Btn></div> : ''}

                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>

    );
};

export default UploadImageContain;
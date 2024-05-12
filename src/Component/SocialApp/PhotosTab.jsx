import { PortfolioTitle } from "../../Constant";
import { H4, P, Image } from "../../AbstractElements";
import React, { Fragment, useState, useEffect } from "react";
import { Col, Row, Card, CardBody } from "reactstrap";
import Lightbox from "react-image-lightbox";
import axios from "axios";

const PhotosTab = () => {
  const description = "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.";
  const [images, setImage] = useState([]);
  const [smallImages, setsmallImages] = useState([]);
  const initilindex = { index: 0, isOpen: false };
  const [photoIndex, setPhotoIndex] = useState(initilindex);

  const onMovePrev = () => {
    const prev = (photoIndex.index + images.length - 1) % images.length;
    setPhotoIndex({ ...photoIndex, index: prev });
  };

  const onMoveNext = () => {
    const next = (photoIndex.index + 1) % images.length;
    setPhotoIndex({ ...photoIndex, index: next });
  };

  useEffect(() => {
    axios.get(`${process.env.PUBLIC_URL}/api/image-light.json`).then((response) => {
      setImage(response.data.src);
    });

    axios.get(`${process.env.PUBLIC_URL}/api/image-big-light.json`).then((response) => {
      setsmallImages(response.data.src);
    });
  }, []);

  return (
    <Fragment>
      <Row>
        {smallImages && (
          <Col sm="12">
            <Card>
              <CardBody className="my-gallery gallery-with-description">
                <Row>
                  {smallImages &&
                    smallImages.map((item, i) => {
                      return (
                        <figure className="col-xl-3 col-sm-6" key={i}>
                          <a href="#javascript" data-size="1600x950">
                            <Image
                              attrImage={{
                                src: require(`../../assets/images/${item}`),
                                alt: "Gallery",
                                className: "img-thumbnail",
                                onClick: (e) => {
                                  e.preventDefault();
                                  setPhotoIndex({ ...photoIndex, index: i, isOpen: true });
                                },
                              }}
                            />
                            <div className="caption">
                              <H4>{PortfolioTitle}</H4>
                              <P>{description}</P>
                            </div>
                          </a>
                        </figure>
                      );
                    })}
                </Row>
              </CardBody>
            </Card>
          </Col>
        )}
      </Row>
      {photoIndex.isOpen && (
        <Lightbox
          mainSrc={require(`../../assets/images/${images[photoIndex.index]}`)}
          nextSrc={require(`../../assets/images/${images[(photoIndex.index + 1) % images.length]}`)}
          prevSrc={require(`../../assets/images/${images[(photoIndex.index + images.length - 1) % images.length]}`)}
          imageTitle={photoIndex.index + 1 + "/" + images.length}
          onCloseRequest={() => setPhotoIndex({ ...photoIndex, isOpen: false })}
          onMovePrevRequest={onMovePrev}
          onMoveNextRequest={onMoveNext}
        />
      )}
    </Fragment>
  );
};

export default PhotosTab;

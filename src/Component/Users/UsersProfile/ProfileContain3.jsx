import { Image } from '../../../AbstractElements';
import PostHeader from './common/PostHeader';
import PostReact from './common/PostReact';
import SocialIcon from './common/SocialIcons';
import React, { Fragment } from 'react';
import { Card, Col } from 'reactstrap';

const ProfileContain3 = () => {
    return (
      <Fragment>
        <Col sm="12">
          <Card>
            <div className="profile-post">
              <PostHeader h6={'2 Hours ago'} />
              <div className="post-body">
                <div className="img-container">
                  <div className="my-gallery" id="aniimated-thumbnials" itemScope="">
                    <Col itemProp="associatedMedia" itemScope="">
                      <a href="#javascript" itemProp="contentUrl" data-size="1600x950">
                        <Image attrImage={{ className: 'img-fluid rounded', src: `${require('../../../assets/images/user-profile/post4.jpg')}`, itemProp: 'thumbnail', alt: 'gallery' }} />
                      </a>
                    </Col>
                  </div>
                </div>
                <br />
                <PostReact h6={'+20 people react this post'} />
                <SocialIcon />
              </div>
            </div>
          </Card>
        </Col>
      </Fragment>
    );
};
export default ProfileContain3;
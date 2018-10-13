import React from 'react';
import { connect } from 'dva';
import {Fade} from 'react-reveal';
import styles from './App.css';

class App extends React.Component{
  afterLoaded = e => {
    document.getElementById('root').style.display = 'block';
    document.getElementById('loading').classList.add('hidden');
  };
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'example/fetch',
      payload: {
        options: {
          url: '/api/napi/photos?page=3&per_page=5&order_by=latest',
          method: 'get',
          mode: 'cors',
        },
        cb: this.afterLoaded
      }
    });
  }
  render() {
    const {example} = this.props;
    const {remote} = example;
    return (
      <div className={styles.app}>
        <div className={styles.main}>
          {
            remote.map((item, index)=>{
              return (
                <section key={index} className={styles.section} style={{backgroundImage: `url(${item.bg})`}}>
                  <Fade top cascade>
                  <h1 key="title" className={styles['section-title']}>
                    {item.title}
                  </h1>
                  </Fade>
                  <Fade right>
                    <p key="description" className={styles['section-description']}>
                      {item.description}
                    </p>
                  </Fade>
                  <Fade left>
                    <div key="content" className={styles['section-content']}>
                      {item.content}
                    </div>
                  </Fade>
                </section>
              );
            })
          }
        </div>
      </div>
    );
  }
}

App.propTypes = {
};

export default connect(({example, dispatch}) => ({example, dispatch}))(App);

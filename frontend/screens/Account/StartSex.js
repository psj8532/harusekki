import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  width,
  AsyncStorage,
  Image,
  Dimensions,
} from 'react-native';
import {serverUrl} from '../../constants';
import {connect} from 'react-redux';
import {login} from '../../src/action/user';

const H = Dimensions.get('window').height;
const W = Dimensions.get('window').width;

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
});

class StartSex extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    need: {sex: ''},
    malecolor: 'transparent',
    femalecolor: 'transparent',
  };
  infoNext = () => {
    if (this.state.need.sex) {
      fetch(`${serverUrl}accounts/need/`, {
        method: 'PATCH',
        body: JSON.stringify(this.state.need),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${this.props.user.token}`,
        },
      })
        .then((response) => response.json())
        .then(() => {
          this.props.navigation.push('Startinfo');
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      alert('성별을 선택해주세요');
    }
  };
  setMale = () => {
    this.setState({
      need: {sex: 'male'},
      malecolor: '#51adcf',
      femalecolor: 'transparent',
    });
  };
  setFemale = () => {
    this.setState({
      need: {sex: 'female'},
      malecolor: 'transparent',
      femalecolor: '#f9c0c0',
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.next} onPress={this.infoNext}>
          <Text
            style={{fontSize: W * 0.05, fontWeight: 'bold', color: '#fca652'}}>
            다음
          </Text>
        </TouchableOpacity>
        <View style={{width: W * 0.4, height: W * 0.4}}>
          <Image
            source={{
              uri:
                'https://cdn3.iconfinder.com/data/icons/virus-transmision/32/gender_corona_virus_covid19-256.png',
            }}
            style={styles.image}
          />
        </View>
        <Text
          style={{
            fontSize: W * 0.06,
            fontFamily: 'NanumSquareRoundEB',
            color: 'gray',
            marginBottom: H * 0.04,
            marginTop: H * 0.02,
          }}>
          성별을 입력해주세요.
        </Text>
        <View style={styles.selectboxes}>
          <TouchableOpacity
            style={[styles.selectbox1, {backgroundColor: this.state.malecolor}]}
            onPress={this.setMale}>
            <Text
              style={{
                fontSize: W * 0.1,
                fontFamily: 'NanumSquareRoundEB',
                color: 'gray',
              }}>
              남
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.selectbox2,
              {backgroundColor: this.state.femalecolor},
            ]}
            onPress={this.setFemale}>
            <Text
              style={{fontSize: W * 0.1, fontWeight: 'bold', color: 'gray'}}>
              여
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.location}>
          <View style={styles.ncircle}></View>
          <View style={styles.ycircle}></View>
          <View style={styles.ncircle}></View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbfbe6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  selectboxes: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selectbox1: {
    width: W * 0.4,
    height: W * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  selectbox2: {
    width: W * 0.4,
    height: W * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  next: {
    position: 'absolute',
    right: W * 0.03,
    top: W * 0.03,
  },
  location: {
    position: 'absolute',
    top: H * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: W * 0.3,
  },
  ycircle: {
    width: W * 0.05,
    height: W * 0.05,
    borderRadius: 100,
    backgroundColor: '#fca652',
  },
  ncircle: {
    width: W * 0.05,
    height: W * 0.05,
    borderRadius: 100,
    backgroundColor: 'gray',
  },
});

export default connect(mapStateToProps)(StartSex);

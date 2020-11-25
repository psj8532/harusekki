import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  Image,
  Dimensions,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {serverUrl} from '../../constants';
import {connect} from 'react-redux';
import {login} from '../../src/action/user';

const H = Dimensions.get('window').height;
const W = Dimensions.get('window').width;

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user) => dispatch(login(user)),
});

class StartInfo extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    height: null,
    weight: null,
    age: null,
    active: 'normal',
  };
  infoNext = () => {
    if (this.state.height && this.state.weight && this.state.age) {
      fetch(`${serverUrl}accounts/need/info/`, {
        method: 'PATCH',
        body: JSON.stringify(this.state),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${this.props.user.token}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          this.props.login(response);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      alert('모든 정보가 입력되지 않아 저장되지 않았습니다.');
    }
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'drawer'}],
      }),
    );
  };
  onActive = (active) => {
    var ans = null;
    if (active === 'high') {
      ans = 'high';
    } else if (active === 'normal') {
      ans = 'normal';
    } else {
      ans = 'low';
    }
    this.setState({
      active: ans,
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.next} onPress={this.infoNext}>
          <Text
            style={{
              fontSize: W * 0.05,
              fontFamily: 'NanumSquareRoundEB',
              color: '#fca652',
            }}>
            다음
          </Text>
        </TouchableOpacity>
        <Image
          source={require('../../assets/images/info.png')}
          style={styles.image}
        />
        <Text
          style={{
            fontSize: 25,
            fontFamily: 'NanumSquareRoundEB',
            color: 'darkgray',
            textAlign: 'center',
            marginVertical: W * 0.05,
          }}>
          기초대사량 계산을 위해{'\n'}다음 정보를 입력해주세요.
        </Text>
        <View>
          <View style={styles.textGroup}>
            <TextInput
              style={styles.inputArea}
              placeholder="키"
              keyboardType="number-pad"
              onChangeText={(text) => {
                this.setState({height: text});
              }}
            />
            <Text style={styles.unit}>cm</Text>
          </View>
          <View style={styles.textGroup}>
            <TextInput
              style={styles.inputArea}
              placeholder="몸무게"
              keyboardType="number-pad"
              onChangeText={(text) => {
                this.setState({weight: text});
              }}
            />
            <Text style={styles.unit}>kg</Text>
          </View>
          <View style={styles.textGroup}>
            <TextInput
              style={styles.inputArea}
              placeholder="나이"
              keyboardType="number-pad"
              onChangeText={(text) => {
                this.setState({age: text});
              }}
            />
            <Text style={styles.unit}>세</Text>
          </View>

          <View style={styles.activeArea}>
            <Text style={styles.activeText}>활동량</Text>
            <TouchableOpacity
              style={
                this.state.active === 'high'
                  ? styles.activeBox
                  : styles.unActiveBox
              }
              onPress={() => this.onActive('high')}>
              <Text style={styles.activeText}>상</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                this.state.active === 'normal'
                  ? styles.activeBox
                  : styles.unActiveBox
              }
              onPress={() => this.onActive('normal')}>
              <Text style={styles.activeText}>중</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                this.state.active === 'low'
                  ? styles.activeBox
                  : styles.unActiveBox
              }
              onPress={() => this.onActive('low')}>
              <Text style={styles.activeText}>하</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.location}>
          <View style={styles.ncircle}></View>
          <View style={styles.ncircle}></View>
          <View style={styles.ycircle}></View>
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
  next: {
    position: 'absolute',
    right: W * 0.03,
    top: W * 0.03,
  },
  image: {
    width: W * 0.4,
    height: W * 0.4,
  },
  textGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputArea: {
    width: W * 0.6,
    height: W * 0.1,
    fontSize: W * 0.04,
    fontFamily: 'NanumBarunGothicBold',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginTop: H * 0.01,
    marginBottom: H * 0.01,
    padding: W * 0.02,
  },
  unit: {
    marginTop: W * 0.04,
    fontSize: W * 0.045,
    fontFamily: 'NanumBarunGothicBold',
    color: 'gray',
    marginLeft: 5,
  },
  activeArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: W * 0.05,
  },
  activeBox: {
    backgroundColor: '#FAD499',
  },
  unActiveBox: {
    backgroundColor: 'transparent',
  },
  activeText: {
    width: W * 0.155,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'NanumSquareRoundR',
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

export default connect(mapStateToProps, mapDispatchToProps)(StartInfo);

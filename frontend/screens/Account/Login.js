import React, {Component} from 'react';
import {
  Image,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  AsyncStorage,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {serverUrl} from '../../constants';
import {connect} from 'react-redux';
import {login} from '../../src/action/user';

const H = Dimensions.get('window').height;
const W = Dimensions.get('window').width;

const mapDispatchToProps = (dispatch) => ({
  login: (user) => dispatch(login(user)),
});

class Login extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    username: '',
    password: '',
  };
  async componentDidMount() {
    const token = await AsyncStorage.getItem('auth-token');
    const username = await AsyncStorage.getItem('username');
    if (token) {
      var data = {
        token: token,
      };
      // profile
      await fetch(`${serverUrl}accounts/profile/${username}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((response) => {
          data = Object.assign(data, response);
        })
        .catch((err) => {
          console.error(err);
        });
      this.props.login(data);
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'drawer'}],
        }),
      );
    }
  }
  handleEmail = (text) => {
    this.setState({username: text});
  };
  handlePassword = (text) => {
    this.setState({password: text});
  };
  onLogin = () => {
    fetch(`${serverUrl}rest-auth/login/`, {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(async (response) => {
        if (response.key) {
          AsyncStorage.setItem('auth-token', response.key);
          AsyncStorage.setItem('username', this.state.username);
          var userData = {
            token: response.key,
          };
          // profile
          await fetch(`${serverUrl}accounts/profile/${this.state.username}/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((response) => response.json())
            .then((response) => {
              userData = Object.assign(userData, response);
            })
            .catch((err) => {
              console.error(err);
            });
          // dispatch
          this.props.login(userData);
          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{name: 'drawer'}],
            }),
          );
        } else {
          alert('계정 정보가 일치하지 않습니다.');
        }
      })
      .catch((err) => console.error(err));
  };
  onSign = () => {
    this.props.navigation.push('Signup');
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleGroup}>
          <Image
            source={require('../../assets/images/로고.png')}
            style={styles.image}
          />
          <Text style={styles.title}>하루세끼</Text>
        </View>
        <View>
          <TextInput
            style={styles.inputArea}
            placeholder="아이디"
            onChangeText={this.handleEmail}
          />
          <TextInput
            style={styles.inputArea}
            placeholder="비밀번호"
            secureTextEntry={true}
            onChangeText={this.handlePassword}
          />
        </View>
        <View style={styles.loginBtn}>
          <TouchableOpacity style={styles.loginButton} onPress={this.onLogin}>
            <Text style={styles.loginBtnText}>로그인</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.findBox}>
          <TouchableOpacity style={styles.findBtn} color="transparent">
            <Text
              style={{fontSize: W * 0.035, fontFamily: 'NanumBarunGothicBold'}}>
              아이디 찾기
            </Text>
          </TouchableOpacity>
          <Text style={{fontSize: W * 0.03}}>|</Text>
          <TouchableOpacity style={styles.findBtn}>
            <Text
              style={{fontSize: W * 0.035, fontFamily: 'NanumBarunGothicBold'}}>
              비밀번호 찾기
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.signupBox}>
          <Text
            style={{
              textAlign: 'center',
              marginBottom: H * 0.01,
              fontSize: W * 0.035,
              fontFamily: 'NanumBarunGothicBold',
            }}>
            가입이 되어 있지 않으신가요?
          </Text>
          <TouchableOpacity style={styles.signupBtn} onPress={this.onSign}>
            <Text
              style={{
                color: 'blue',
                textDecorationLine: 'underline',
                fontSize: W * 0.035,
                fontFamily: 'NanumBarunGothicBold',
              }}>
              회원가입
            </Text>
          </TouchableOpacity>
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
    backgroundColor: '#FBFBE6',
  },
  titleGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  title: {
    fontSize: W * 0.13,
    fontFamily: 'BMJUA',
    marginBottom: H * 0.08,
    marginTop: H * 0.01,
  },
  image: {
    marginRight: W * 0.03,
    width: W * 0.165,
    height: W * 0.165,
  },
  inputArea: {
    width: W * 0.7,
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
  loginBtn: {
    backgroundColor: '#fca652',
    padding: W * 0.02,
    borderRadius: 5,
    marginTop: H * 0.01,
    marginBottom: H * 0.01,
    width: W * 0.7,
  },
  loginButton: {
    width: '100%',
    alignItems: 'center',
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'NanumBarunGothicBold',
  },
  findBox: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  findBtn: {
    backgroundColor: 'transparent',
    color: 'red',
    marginHorizontal: W * 0.02,
  },
  signupBox: {
    marginTop: H * 0.1,
  },
  signupBtn: {
    backgroundColor: 'transparent',
    color: 'blue',
    alignItems: 'center',
  },
});

export default connect(null, mapDispatchToProps)(Login);

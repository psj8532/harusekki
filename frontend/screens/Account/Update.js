import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {serverUrl} from '../../constants';
import {connect} from 'react-redux';
import {login} from '../../src/action/user';
import Icon from 'react-native-vector-icons/Ionicons';

const H = Dimensions.get('window').height;
const W = Dimensions.get('window').width;

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user) => dispatch(login(user)),
});

class Update extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    userData: {
      age: this.props.user.age,
      sex: this.props.user.sex,
      height: this.props.user.height,
      weight: this.props.user.weight,
      active: this.props.user.active,
      basal_metabolism: this.props.user.basal_metabolism,
    },
  };
  onUpdateImg = () => {
    this.props.navigation.push('UpdateImg');
  };
  onUpdate = async () => {
    if (
      this.state.userData.height &&
      this.state.userData.weight &&
      this.state.userData.age
    ) {
      var user = this.deepClone(this.props.user);
      user.age = this.state.userData.age;
      user.sex = this.state.userData.sex;
      user.height = this.state.userData.height;
      user.weight = this.state.userData.weight;
      user.active = this.state.userData.active;
      user.basal_metabolism = this.state.userData.basal_metabolism;
      await fetch(`${serverUrl}accounts/update/`, {
        method: 'PATCH',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${this.props.user.token}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          user.basal_metabolism = response.basal_metabolism;
        })
        .catch((err) => {
          console.error(err);
        });
      this.props.login(user);
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'Profile'}],
        }),
      );
    } else {
      alert('모든 정보가 입력되지 않아 저장되지 않았습니다.');
    }
  };
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    const result = Array.isArray(obj) ? [] : {};
    for (let key of Object.keys(obj)) {
      result[key] = this.deepClone(obj[key]);
    }

    return result;
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.headerBox}>
          <View>
            <Text style={styles.mainComment}>회원 정보 수정</Text>
            <Text style={styles.subComment}>
              기존 회원 정보를 수정할 수 있습니다.
            </Text>
          </View>
          <TouchableOpacity onPress={this.onUpdate}>
            <Text style={styles.updateText}>수정</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <View>
            {this.props.user.profileImage && (
              <Image
                style={styles.profileImg}
                source={{
                  uri: `${serverUrl}gallery` + this.props.user.profileImage,
                }}
              />
            )}
            {!this.props.user.profileImage && (
              <Image
                style={styles.profileImg}
                source={require('../../assets/images/default-profile.png')}
              />
            )}
          </View>
          <View style={styles.userInfo}>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>아이디</Text>
              <Text style={styles.infoValue}>{this.props.user.username}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>성별</Text>
              <View style={styles.radioBox}>
                <View style={{flexDirection: 'row', marginLeft: W * 0.01}}>
                  <Text style={{marginHorizontal: W * 0.01}}>남</Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        userData: {
                          ...this.state.userData,
                          sex: 'male',
                        },
                      });
                    }}>
                    {this.state.userData.sex === 'male' && (
                      <Icon
                        name="checkbox-outline"
                        style={{fontSize: 20}}></Icon>
                    )}
                    {this.state.userData.sex !== 'male' && (
                      <Icon name="square-outline" style={{fontSize: 20}}></Icon>
                    )}
                  </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', marginLeft: W * 0.01}}>
                  <Text style={{marginHorizontal: W * 0.01}}>여</Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        userData: {
                          ...this.state.userData,
                          sex: 'female',
                        },
                      });
                    }}>
                    {this.state.userData.sex === 'female' && (
                      <Icon
                        name="checkbox-outline"
                        style={{fontSize: 20}}></Icon>
                    )}
                    {this.state.userData.sex !== 'female' && (
                      <Icon name="square-outline" style={{fontSize: 20}}></Icon>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>나이</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.infoInput}
                  keyboardType="number-pad"
                  selectionColor="#e74c3c"
                  value={String(this.state.userData.age)}
                  onChangeText={(age) => {
                    this.setState({
                      userData: {
                        ...this.state.userData,
                        age: age,
                      },
                    });
                  }}></TextInput>
                <Text style={styles.infoValue}> 세</Text>
              </View>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>키</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.infoInput}
                  keyboardType="number-pad"
                  value={String(this.state.userData.height)}
                  onChangeText={(height) => {
                    this.setState({
                      userData: {
                        ...this.state.userData,
                        height: height,
                      },
                    });
                  }}></TextInput>
                <Text style={styles.infoValue}> cm</Text>
              </View>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>몸무게</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.infoInput}
                  keyboardType="number-pad"
                  value={String(this.state.userData.weight)}
                  onChangeText={(weight) => {
                    this.setState({
                      userData: {
                        ...this.state.userData,
                        weight: weight,
                      },
                    });
                  }}></TextInput>
                <Text style={styles.infoValue}> kg</Text>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>활동량</Text>
              <View style={styles.radioBox}>
                <View style={{flexDirection: 'row', marginLeft: W * 0.01}}>
                  <Text style={{marginHorizontal: W * 0.01}}>상</Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        userData: {
                          ...this.state.userData,
                          active: 'high',
                        },
                      });
                    }}>
                    {this.state.userData.active === 'high' && (
                      <Icon
                        name="checkbox-outline"
                        style={{fontSize: 20}}></Icon>
                    )}
                    {this.state.userData.active !== 'high' && (
                      <Icon name="square-outline" style={{fontSize: 20}}></Icon>
                    )}
                  </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', marginLeft: W * 0.01}}>
                  <Text style={{marginHorizontal: W * 0.01}}>중</Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        userData: {
                          ...this.state.userData,
                          active: 'normal',
                        },
                      });
                    }}>
                    {this.state.userData.active === 'normal' && (
                      <Icon
                        name="checkbox-outline"
                        style={{fontSize: 20}}></Icon>
                    )}
                    {this.state.userData.active !== 'normal' && (
                      <Icon name="square-outline" style={{fontSize: 20}}></Icon>
                    )}
                  </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', marginLeft: W * 0.01}}>
                  <Text style={{marginHorizontal: W * 0.01}}>하</Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        userData: {
                          ...this.state.userData,
                          active: 'low',
                        },
                      });
                    }}>
                    {this.state.userData.active === 'low' && (
                      <Icon
                        name="checkbox-outline"
                        style={{fontSize: 20}}></Icon>
                    )}
                    {this.state.userData.active !== 'low' && (
                      <Icon name="square-outline" style={{fontSize: 20}}></Icon>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>활동대사량</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.infoInput}
                  keyboardType="number-pad"
                  value={String(this.state.userData.basal_metabolism)}
                  onChangeText={(val) => {
                    this.setState({
                      userData: {
                        ...this.state.userData,
                        basal_metabolism: val,
                      },
                    });
                  }}
                />
                <Text style={styles.infoValue}> kcal</Text>
              </View>
            </View>
            <View style={styles.infoBox}>
              <Text style={{fontFamily: 'NanumSquareRoundL'}}>
                사용자가 입력한 정보를 토대로 기초 대사량이 계산됩니다.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfbe6',
  },
  // body
  body: {
    alignItems: 'center',
  },
  profileImg: {
    marginTop: W * 0.05,
    marginBottom: W * 0.05,
    borderRadius: W * 0.3,
    width: W * 0.37,
    height: W * 0.37,
  },
  // infobox
  userInfo: {
    borderRadius: 10,
    width: '80%',
    // elevation: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginVertical: 10,
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: W * 0.1,
    marginVertical: H * 0.015,
  },
  infoTitle: {
    fontSize: W * 0.05,
    fontFamily: 'NanumSquareRoundB',
  },
  infoValue: {
    fontSize: W * 0.05,
    fontFamily: 'NanumSquareRoundR',
  },
  infoInput: {
    fontSize: W * 0.032,
    height: H * 0.055,
    width: W * 0.15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    borderRadius: 6,
    textAlign: 'center',
  },

  infoItem: {
    marginTop: H * 0.02,
    marginBottom: H * 0.02,
    marginLeft: W * 0.03,
    marginRight: W * 0.03,
  },

  infoCon: {
    marginTop: H * 0.02,
    marginBottom: H * 0.02,
    marginLeft: W * 0.03,
    marginRight: W * 0.03,
  },

  gohomeBtn: {
    backgroundColor: 'transparent',
    color: 'black',
  },
  updateText: {
    fontSize: 25,
    fontFamily: 'NanumSquareRoundEB',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 150,
  },
  // header
  headerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  mainComment: {
    fontSize: 25,
    fontFamily: 'NanumSquareRoundEB',
  },
  subComment: {
    fontFamily: 'NanumSquareRoundL',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Update);

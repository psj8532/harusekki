import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  Alert,
  TextInput,
  Image,
  AsyncStorage,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
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
class Profile extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    modalVisible: false,
    secessionModal: false,
    password: null,
  };
  goHome = () => {
    this.props.navigation.push('Home');
  };
  onUpdate = () => {
    this.props.navigation.push('Update');
  };
  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };
  onUpdateImg = (visible) => {
    var user = this.deepClone(this.props.user);
    const options = {};
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.uri) {
        var data = new FormData();
        data.append('data', response.data);
        data.append('type', response.type);
        data.append('fileName', response.fileName);
        fetch(`${serverUrl}accounts/pimg/update/`, {
          method: 'PATCH',
          body: data,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Token ${this.props.user.token}`,
          },
        })
          .then((response) => response.json())
          .then((response) => {
            user.profileImage = response.profileImage;
            this.setModalVisible(visible);
          })
          .then(() => {
            this.props.login(user);
          })
          .catch((err) => console.error(err));
      }
    });
  };
  onDeleteImg = (visible) => {
    var user = this.deepClone(this.props.user);
    fetch(`${serverUrl}accounts/pimg/delete/`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${this.props.user.token}`,
      },
    })
      .then(() => {
        user.profileImage = null;
        this.setModalVisible(visible);
        this.props.login(user);
      })
      .catch((err) => {
        console.error(err);
      });
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

  // 회원 탈퇴
  setSecessionModal = (visible) => {
    this.setState({secessionModal: visible});
  };
  onConfirm = (visible) => {
    fetch(`${serverUrl}rest-auth/login/`, {
      method: 'POST',
      body: JSON.stringify({
        username: this.props.user.username,
        password: this.state.password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.key) {
          this.onDelete();
          this.setState({
            secessionModal: visible,
          });
        } else {
          alert('비밀번호가 틀렸습니다.');
        }
      });
  };
  onDelete = () => {
    fetch(`${serverUrl}accounts/delete/${this.props.user.username}`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${this.props.user.token}`,
      },
    })
      .then(() => {
        AsyncStorage.clear();
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: '로그인'}],
          }),
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerBox}>
          <View>
            <Text style={styles.mainComment}>회원정보</Text>
            <Text style={styles.subComment}>
              가입 시 입력한 정보를 확인할 수 있습니다.
            </Text>
          </View>
          <TouchableOpacity onPress={this.onUpdate}>
            <Text style={styles.updateText}>수정</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}>
          <TouchableOpacity
            style={styles.centeredView}
            onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
            }}>
            <View style={styles.modalView}>
              <TouchableHighlight
                onPress={() => {
                  this.onUpdateImg(!this.state.modalVisible);
                }}>
                <Text style={styles.modalText}>새 프로필 사진 등록</Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => {
                  this.onDeleteImg(!this.state.modalVisible);
                }}>
                <Text style={styles.modalText}>프로필 사진 삭제</Text>
              </TouchableHighlight>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.secessionModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.secessionCenteredView}>
            <View style={styles.secessionModalView}>
              <View style={styles.secessionModalHeader}>
                <Text style={styles.secessionTitle}>비밀번호 확인</Text>
                <Icon
                  name="close"
                  style={styles.secessionIcon}
                  onPress={() => {
                    this.setSecessionModal(!this.state.secessionModal);
                  }}
                />
              </View>
              <View style={styles.secessionModalBody}>
                <TextInput
                  autoFocus={true}
                  placeholder="비밀번호 확인"
                  secureTextEntry={true}
                  style={styles.passwordInput}
                  onChangeText={(text) => {
                    this.setState({
                      password: text,
                    });
                  }}
                />
                <TouchableOpacity
                  style={styles.secessionOpenButton}
                  onPress={() => {
                    this.onConfirm(!this.state.secessionModal);
                  }}>
                  <Text style={styles.secessionTextStyle}>확인</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
            <TouchableOpacity
              onPress={() => this.setModalVisible(!this.state.modalVisible)}
              style={styles.updateImgBtn}>
              <Image
                style={styles.updateImg}
                source={{
                  uri:
                    'https://cdn4.iconfinder.com/data/icons/pictype-free-vector-icons/16/write-256.png',
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.userInfo}>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>아이디</Text>
              <Text style={styles.infoValue}>{this.props.user.username}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>성별</Text>
              {this.props.user.sex === 'male' && (
                <Text style={styles.infoValue}>남</Text>
              )}
              {this.props.user.sex === 'female' && (
                <Text style={styles.infoValue}>여</Text>
              )}
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>나이</Text>
              <Text style={styles.infoValue}>{this.props.user.age}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>키</Text>
              <Text style={styles.infoValue}>{this.props.user.height}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>몸무게</Text>
              <Text style={styles.infoValue}>{this.props.user.weight}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>활동대사량</Text>
              <Text style={styles.infoValue}>
                {this.props.user.basal_metabolism} kcal
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={{fontFamily: 'NanumSquareRoundL'}}>
                사용자가 입력한 정보를 토대로 기초 대사량이 계산됩니다.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => this.setSecessionModal(!this.state.secessionModal)}
            style={styles.deleteBtn}>
            <Text style={styles.delText}>회원 탈퇴</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  updateImgBtn: {
    width: W * 0.075,
    height: W * 0.075,
    backgroundColor: '#F1C40F',
    borderRadius: W * 0.075,
    position: 'absolute',
    right: W * 0.02,
    bottom: W * 0.05,
    zIndex: 2,
  },
  updateImg: {
    width: W * 0.05,
    height: W * 0.05,
    margin: W * 0.015,
  },
  userInfo: {
    borderRadius: 10,
    width: '80%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    marginVertical: 10,
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
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  deleteBtn: {
    marginTop: H * 0.02,
  },
  delText: {
    color: '#34495E',
    fontFamily: 'NanumSquareRoundB',
    fontSize: W * 0.06,
    borderBottomWidth: 1,
    borderBottomColor: '#34495E',
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
  updateText: {
    fontSize: 25,
    fontFamily: 'NanumSquareRoundEB',
  },
  // image modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    // margin: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#34495E',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 2,
  },
  modalText: {
    marginVertical: 10,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'NanumSquareRoundB',
  },
  // secession modal
  secessionCenteredView: {
    flex: 1,
    paddingHorizontal: W * 0.2,
    paddingTop: H * 0.3,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  secessionModalView: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  secessionOpenButton: {
    backgroundColor: '#34495E',
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 10,
    elevation: 2,
  },
  secessionTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'NanumSquareRoundB',
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 6,
    width: '90%',
    marginVertical: 20,
  },
  secessionModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  secessionTitle: {
    fontSize: 20,
    fontFamily: 'NanumSquareRoundR',
    marginHorizontal: 10,
  },
  secessionIcon: {
    fontSize: 20,
    marginHorizontal: 10,
  },
  secessionModalBody: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  TouchableHighlight,
  AsyncStorage,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
// import ImagePicker from 'react-native-image-crop-picker';
import CropImg from './CropImg';
import {serverUrl} from '../../../constants';

const H = Dimensions.get('window').height;
const W = Dimensions.get('window').width;

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
});

class FoodInput extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    update: false,
    foodInfo: this.props.food,
    modalVisible: false,
    location: [],
  };
  componentDidMount = () => {
    //여기서 props 가 있는지 없는지에 따라서 분기 해줘야 함
    if (Object.values(this.props.food).length > 0) {
      this.setState({
        update: true,
      });
    }
    this.setState({
      showRecommend: false,
    });
  };
  recommend = (text) => {
    this.setState({
      foodInfo: {
        DESC_KOR: text,
      },
    });
    var data = new FormData();
    data.append('search', text);
    fetch(`${serverUrl}food/search/`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Token ${this.props.user.token}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.length > 0) {
          this.setState({
            showRecommend: true,
            recommendLst: response,
          });
        } else {
          this.setState({
            showRecommend: false,
            recommendLst: {},
          });
        }
      })
      .catch((error) => console.error(error));
  };
  chooseFood(idx) {
    var selectedFood = this.state.recommendLst[idx];
    if (!selectedFood['SERVING_SIZE']) {
      selectedFood['SERVING_SIZE'] = 0;
    }
    if (!selectedFood['NUTR_CONT1']) {
      selectedFood['NUTR_CONT1'] = 0;
    }
    if (!selectedFood['NUTR_CONT2']) {
      selectedFood['NUTR_CONT2'] = 0;
    }
    if (!selectedFood['NUTR_CONT3']) {
      selectedFood['NUTR_CONT3'] = 0;
    }
    if (!selectedFood['NUTR_CONT4']) {
      selectedFood['NUTR_CONT4'] = 0;
    }
    this.setState({
      showRecommend: false,
      foodInfo: selectedFood,
    });
  }
  isUpdate() {
    this.props.isUpdate(
      this.state.update,
      this.state.foodInfo,
      this.state.location,
    );
  }
  close(tf) {
    this.props.close(tf);
  }
  setModalVisible = (tf) => {
    this.setState({
      modalVisible: tf,
    });
  };
  putLocation(location) {
    this.setModalVisible(false);
    this.setState({
      location: location,
    });
  }
  render() {
    return (
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 22,
            }}>
            <View style={styles.modalView}>
              <TouchableHighlight
                style={{
                  alignItems: 'flex-end',
                }}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Icon
                  name="close"
                  style={{
                    alignItems: 'flex-end',
                    fontSize: 30,
                    marginRight: 15,
                    marginBottom: 10,
                    // fontWeight: 'bold',
                    // fontFamily: 'BMHANNAAir',
                    color: '#F39C12',
                  }}></Icon>
              </TouchableHighlight>
              <CropImg
                image={this.props.image === null ? null : this.props.image}
                sendLocation={(location) => this.putLocation(location)}
              />
            </View>
          </View>
        </Modal>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{fontFamily: 'NanumSquareRoundB'}}>영역선택</Text>
          {this.props.image !== null && (
            <TouchableOpacity
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}>
              <Image
                style={{height: 100, width: 100}}
                source={{
                  uri: `data:image/jpeg;base64,${this.props.image.data}`,
                }}
              />
            </TouchableOpacity>
          )}
          {this.props.image === null && (
            <View
              style={{
                height: 100,
                width: 100,
                backgroundColor: '#fff',
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
              }}>
              <Text style={{color: '#BEBEBE', fontFamily: 'NanumSquareRoundR'}}>
                사진없음
              </Text>
            </View>
          )}
        </View>
        <View>
          <Text style={{fontFamily: 'NanumSquareRoundB'}}>음식이름</Text>
          <TextInput
            style={[
              styles.inputArea,
              {
                width: W * 0.7,
                backgroundColor: '#fff',
                fontFamily: 'NanumSquareRoundR',
              },
            ]}
            placeholder="음식이름을 입력하세요."
            onChangeText={this.recommend}
            value={this.state.foodInfo ? this.state.foodInfo.DESC_KOR : ''}
          />
          <Text
            style={{
              color: '#BEBEBE',
              fontSize: 12,
              marginTop: 10,
              fontFamily: 'NanumSquareRoundL',
            }}>
            음식을 검색하면 영양정보가 자동으로 등록됩니다.
          </Text>
          {/* 여기에 추천 검색어가 뜨도록 */}
          {this.state.recommendLst && this.state.showRecommend && (
            <View
              style={{
                position: 'absolute',
                top: 70,
                width: W * 0.7,
                backgroundColor: '#fff',
                borderRadius: 5,
                zIndex: 2,
                padding: 10,
              }}>
              {this.state.recommendLst.map((food, i) => {
                return (
                  <TouchableOpacity onPress={() => this.chooseFood(i)}>
                    <Text style={{margin: 5}} key={i}>
                      {food['DESC_KOR']}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <View style={{marginRight: 10}}>
            <Text style={styles.labeltxt}>칼로리</Text>
            <Text style={styles.labeltxt}>탄수화물</Text>
            <Text style={styles.labeltxt}>단백질</Text>
            <Text style={styles.labeltxt}>지방</Text>
          </View>
          <View>
            <View style={styles.inputline}>
              <TextInput
                style={[
                  styles.inputArea,
                  {
                    width: W * 0.4,
                    backgroundColor: '#EAEAEA',
                    fontFamily: 'NanumSquareRoundR',
                  },
                ]}
                onChangeText={(text) =>
                  this.changeNum(text, this.state.foodInfo.NUTR_CONT1)
                }
                value={
                  this.state.foodInfo ? this.state.foodInfo.NUTR_CONT1 : ''
                }
                keyboardType="number-pad"
                placeholder="칼로리"
                editable={false}
              />
              <Text style={styles.labeltxt}>kcal</Text>
            </View>
            <View style={styles.inputline}>
              <TextInput
                style={[
                  styles.inputArea,
                  {
                    width: W * 0.4,
                    backgroundColor: '#EAEAEA',
                    fontFamily: 'NanumSquareRoundR',
                  },
                ]}
                placeholder="탄수화물"
                value={
                  this.state.foodInfo ? this.state.foodInfo.NUTR_CONT2 : ''
                }
                keyboardType="number-pad"
                editable={false}
              />
              <Text style={styles.labeltxt}>g</Text>
            </View>
            <View style={styles.inputline}>
              <TextInput
                style={[
                  styles.inputArea,
                  {
                    width: W * 0.4,
                    backgroundColor: '#EAEAEA',
                    fontFamily: 'NanumSquareRoundR',
                  },
                ]}
                placeholder="단백질"
                value={
                  this.state.foodInfo ? this.state.foodInfo.NUTR_CONT3 : ''
                }
                keyboardType="number-pad"
                editable={false}
              />
              <Text style={styles.labeltxt}>g</Text>
            </View>
            <View style={styles.inputline}>
              <TextInput
                style={[
                  styles.inputArea,
                  {
                    width: W * 0.4,
                    backgroundColor: '#EAEAEA',
                    fontFamily: 'NanumSquareRoundR',
                  },
                ]}
                placeholder="지방"
                value={
                  this.state.foodInfo ? this.state.foodInfo.NUTR_CONT4 : ''
                }
                keyboardType="number-pad"
                editable={false}
              />
              <Text style={styles.labeltxt}>g</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
            justifyContent: 'center',
          }}>
          <TouchableHighlight
            style={{...styles.FImodalButton, backgroundColor: '#FCA652'}}
            onPress={() => {
              this.isUpdate();
            }}>
            <Text style={styles.buttonTxt}>저장</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={{...styles.FImodalButton, backgroundColor: '#FCA652'}}
            onPress={() => {
              this.close(false);
            }}>
            <Text style={styles.buttonTxt}>취소</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputArea: {
    // width: W * 0.7,
    height: W * 0.1,
    fontSize: W * 0.04,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: H * 0.01,
    marginRight: 5,
    padding: W * 0.02,
  },
  labeltxt: {
    marginVertical: H * 0.03,
    marginRight: 10,
    fontFamily: 'NanumSquareRoundB',
  },
  FImodalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    marginHorizontal: 20,
  },
  modalView: {
    width: '100%',
    height: '100%',
    zIndex: 10,
    backgroundColor: '#FFFBE6',
    borderRadius: 5,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonTxt: {
    fontSize: 15,
    fontFamily: 'NanumSquareRoundEB',
    color: '#fff',
  },
});

export default connect(mapStateToProps)(FoodInput);

import React, {Component} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
  AsyncStorage,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {serverUrl} from '../../../constants';

const {width, height} = Dimensions.get('screen');

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
});

let today = new Date();
let year = today.getFullYear(); // 년도
let month = today.getMonth() + 1; // 월
let date = today.getDate(); // 날짜

class Gallery extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    pictures: [],
    selected: {id: null, image: null},
    pictureTime: {},
    // 뱃지
    badgeColors: ['#2ECC71', '#3498DB', '#8E44AD', '#F1C40F', '#F312A4'],
  };
  componentDidMount() {
    this.onGallery();
  }
  onGallery = () => {
    fetch(`${serverUrl}gallery/myImgs/`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${this.props.user.token}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.length) {
          this.setState({
            pictures: response,
            selected: {id: response[0].id, image: response[0].image},
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  pad = (n, width) => {
    n = n + '';
    return n.length >= width
      ? n
      : new Array(width - n.length + 1).join('0') + n;
  };
  onDate = () => {
    var newYear = this.pad(`${year}`, 4);
    var newMonth = this.pad(`${month}`, 2);
    var newDate = this.pad(`${date}`, 2);
    var sendDate = `${newYear}-${newMonth}-${newDate}`;
    this.props.navigation.navigate('MyDatePicker', {
      date: sendDate,
    });
  };
  // 뱃지
  getBadgeStyle(mealTime) {
    if (mealTime === '아침') {
      return {backgroundColor: this.state.badgeColors[0]};
    } else if (mealTime === '점심') {
      return {backgroundColor: this.state.badgeColors[1]};
    } else if (mealTime === '저녁') {
      return {backgroundColor: this.state.badgeColors[2]};
    } else if (mealTime === '간식') {
      return {backgroundColor: this.state.badgeColors[3]};
    } else {
      return {backgroundColor: this.state.badgeColors[4]};
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={{width: '100%'}}>
          <View style={styles.pictureBox}>
            {this.state.pictures.map((picture) => {
              const borderColor =
                picture.id === this.state.selected.id
                  ? '#FCA652'
                  : 'transparent';
              return (
                <TouchableOpacity
                  style={[styles.imgBtn, {borderColor: borderColor}]}
                  key={picture.id}
                  onPress={() => {
                    const time = picture['created_at'];
                    const year = time.substring(0, 4);
                    const month = time.substring(5, 7);
                    const date = time.substring(8, 10);
                    const pictureDate = {
                      year: year,
                      month: month,
                      date: date,
                    };

                    this.setState({
                      selected: {id: picture.id, image: picture.image},
                    });
                    this.props.navigation.push('DetailImage', {
                      imageId: picture.id,
                      image: picture.image,
                      picture: picture,
                      pictureDate: pictureDate,
                      mealTime: picture.mealTime,
                    });
                  }}>
                  {picture.image && (
                    <Image
                      style={styles.picture}
                      source={{
                        uri: `${serverUrl}gallery` + picture.image,
                      }}
                    />
                  )}
                  {!picture.image && (
                    <View
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#FAD499',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Icon
                        name="fast-food-outline"
                        style={{fontSize: 80, color: '#fff'}}></Icon>
                    </View>
                  )}
                  {/* 뱃지 */}
                  <View
                    style={[
                      styles.badge,
                      this.getBadgeStyle(picture.mealTime),
                    ]}>
                    {/* 폰트 크기는 사진에 맞게 바꿀 예정 */}
                    <Text style={{color: '#fff', fontSize: 10}}>
                      {picture.mealTime}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.btnBox} onPress={this.onDate}>
          <Icon name="camera" style={styles.cameraLogo}></Icon>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: height,
    flex: 1,
    backgroundColor: '#fbfbe6',
    paddingTop: 10,
  },
  pictureBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imgBtn: {
    width: '33.3%',
    height: 130,
    borderColor: 'white',
    borderWidth: 2,
  },
  picture: {
    width: '100%',
    height: '100%',
  },
  // 뱃지
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    borderRadius: 50,
    zIndex: 2,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  // 카메라버튼
  btnBox: {
    backgroundColor: '#fca652',
    position: 'absolute',
    right: 30,
    bottom: 30,
    borderRadius: 100,
    padding: 15,
    elevation: 5,
  },
  cameraLogo: {
    fontSize: 40,
    color: '#fff',
  },
});

export default connect(mapStateToProps)(Gallery);

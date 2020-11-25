import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {serverUrl} from '../../constants';
import MyFeedImage from './MyFeedImage';

const {width, height} = Dimensions.get('screen');

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
});

class MyFeed extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    myArticles: [],
    modalData: '',
    modalVisible: false,
    active: 'btn1',
    btn1Color: '#F39C12',
    btn2Color: '#FFFBE6',
    btn3Color: '#FFFBE6',
  };
  componentDidMount() {
    this.getMyArticles();
  }
  setModalVisible = (visible, recipe) => {
    if (visible) {
      this.setState({
        modalData: recipe,
      });
    } else {
      this.setState({
        modalData: '',
      });
    }
    this.setState({modalVisible: visible});
  };
  getMyArticles = () => {
    fetch(`${serverUrl}articles/read/${this.props.user.username}/`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          myArticles: response,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  onBtn1 = () => {
    this.setState({
      btn1Color: '#F39C12',
      btn2Color: '#FFFBE6',
      btn3Color: '#FFFBE6',
      active: 'btn1',
    });
  };
  onBtn2 = () => {
    this.setState({
      btn1Color: '#FFFBE6',
      btn2Color: '#F39C12',
      btn3Color: '#FFFBE6',
      active: 'btn2',
    });
  };
  onBtn3 = () => {
    this.setState({
      btn1Color: '#FFFBE6',
      btn2Color: '#FFFBE6',
      btn3Color: '#F39C12',
      active: 'btn3',
    });
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.profileBox}>
            <View style={styles.imgBox}>
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
              <Text
                style={{
                  fontFamily: 'NanumSquareRoundEB',
                  fontSize: 20,
                }}>
                {this.props.user.username}
              </Text>
            </View>
            <View style={styles.cntBox}>
              <Text style={styles.cntContent}>게시글</Text>
              <Text style={styles.cntContent}>
                {this.state.myArticles.length}
              </Text>
            </View>
            <View style={styles.cntBox}>
              <Text style={styles.cntContent}>팔로워</Text>
              <Text style={styles.cntContent}>
                {this.props.user.num_of_followers}
              </Text>
            </View>
            <View style={styles.cntBox}>
              <Text style={styles.cntContent}>팔로잉</Text>
              <Text style={styles.cntContent}>
                {this.props.user.num_of_followings}
              </Text>
            </View>
          </View>
          <View style={styles.btnGroup}>
            <TouchableHighlight
              style={[styles.btnBtn, {borderBottomColor: this.state.btn1Color}]}
              onPress={this.onBtn1}>
              <Icon name="grid" style={styles.btnIcon} />
            </TouchableHighlight>
            <TouchableHighlight
              style={[styles.btnBtn, {borderBottomColor: this.state.btn2Color}]}
              onPress={this.onBtn2}>
              <Icon name="heart" style={styles.btnIcon} />
            </TouchableHighlight>
            <TouchableHighlight
              style={[styles.btnBtn, {borderBottomColor: this.state.btn3Color}]}
              onPress={this.onBtn3}>
              <Icon name="bookmarks" style={styles.btnIcon} />
            </TouchableHighlight>
          </View>
          {this.state.active === 'btn1' && (
            <MyFeedImage
              articles={this.state.myArticles}
              navigation={this.props.navigation}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFBE6',
    flex: 1,
  },
  // profileBox
  profileBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  imgBox: {},
  profileImg: {
    borderRadius: 50,
    width: 50,
    height: 50,
  },
  cntBox: {},
  cntContent: {
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'NanumSquareRoundR',
  },
  // btn
  btnGroup: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  btnBtn: {
    flexDirection: 'row',
    width: '33.3%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 6,
  },
  btnIcon: {
    fontSize: 30,
  },
});

export default connect(mapStateToProps)(MyFeed);

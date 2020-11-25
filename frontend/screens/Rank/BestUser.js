import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  AsyncStorage,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {serverUrl} from '../../constants';

const H = Dimensions.get('window').height;
const W = Dimensions.get('window').width;

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
});

class BestUser extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    recommendUsers: [],
    BestUser: [],
    isFollow: false,
    myName: null,
    userData: {},
    username: [],
    myName: this.props.user.username,
  };
  componentDidMount() {
    this.getDatas();
  }
  getDatas = () => {
    fetch(`${serverUrl}accounts/recommendusers/`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${this.props.user.token}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          recommendUsers: response,
        });
      })
      .catch((err) => console.error(err));

    fetch(`${serverUrl}accounts/bestusers/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          BestUser: response,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  onFollow = () => {
    fetch(
      `${serverUrl}accounts/profile/${this.state.userData.username}/follow/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${this.props.suer.token}`,
        },
      },
    )
      .then(() => {
        if (!this.state.isFollow) {
          this.setState({
            // isFollow: !this.state.isFollow,
            userData: {
              ...this.state.userData,
              num_of_followers: this.state.userData.num_of_followers + 1,
            },
          });
        } else {
          this.setState({
            // isFollow: !this.state.isFollow,
            userData: {
              ...this.state.userData,
              num_of_followers: this.state.userData.num_of_followers - 1,
            },
          });
        }
      })
      .catch((err) => console.error(err));
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.box}>
            <Text style={styles.subTitle}>추천친구</Text>
            <ScrollView style={styles.recommendBox} horizontal={true}>
              {this.state.recommendUsers.map((obj, idx) => {
                return (
                  <TouchableOpacity
                    style={styles.recommendItem}
                    onPress={() => {
                      this.props.navigation.push('UserFeed', {
                        username: obj.username,
                      });
                    }}>
                    {obj.profileImage && (
                      <Image
                        style={styles.writerImg}
                        source={{
                          uri: `${serverUrl}gallery${obj.profileImage}`,
                        }}
                      />
                    )}
                    {!obj.profileImage && (
                      <Image
                        style={styles.writerImg}
                        source={require('../../assets/images/default-profile.png')}
                      />
                    )}
                    <Text
                      style={{
                        fontFamily: 'NanumSquareRoundEB',
                        textAlign: 'center',
                      }}>
                      {obj.username}{' '}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            {/* {this.state.PlusUser.map((user) => {
              <Text>{user.username}</Text>;
            })} */}
          </View>

          <View style={styles.box}>
            <Text style={styles.subTitle}>주간 랭킹</Text>
            <View style={styles.weeklyBox}>
              {this.state.BestUser.map((user, i) => {
                return (
                  <View style={styles.rankingBox}>
                    {this.state.profileImage ? (
                      <Image
                        style={styles.profileImg}
                        source={{
                          uri: `${serverUrl}gallery` + this.state.profileImage,
                        }}
                      />
                    ) : (
                      <Image
                        style={styles.profileImg}
                        source={require('../../assets/images/default-profile.png')}
                      />
                    )}
                    <Text
                      style={styles.followUser}
                      onPress={(e) => {
                        this.props.navigation.push('UserFeed', {
                          username: user.username,
                        });
                      }}>
                      {user.username}
                    </Text>
                    <Text style={styles.followCnt}>
                      {user.num_of_followers}
                    </Text>
                    <View style={styles.followBtn}>
                      {i == 0 && (
                        <View>
                          <Icon name="medal" style={styles.rank1}></Icon>
                        </View>
                      )}
                      {i == 1 && (
                        <View>
                          <Icon name="medal" style={styles.rank2}></Icon>
                        </View>
                      )}
                      {i == 2 && (
                        <View>
                          <Icon name="medal" style={styles.rank3}></Icon>
                        </View>
                      )}
                      {i >= 3 && (
                        <View>
                          <Icon name="medal" style={styles.rank4}></Icon>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fbfbe6',
    flex: 1,
  },
  recommendBox: {
    alignSelf: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    backgroundColor: '#fff',
    marginVertical: W * 0.05,
  },
  box: {
    marginVertical: 15,
    marginHorizontal: 20,
  },
  rankingBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginHorizontal: 10,
    marginVertical: 10,
  },
  weeklyBox: {
    width: '100%',
  },
  ranking: {
    fontSize: W * 0.1,
    fontFamily: 'NanumSquareRoundEB',
    width: W * 0.1,
  },
  followUser: {
    fontSize: W * 0.06,
    fontFamily: 'NanumSquareRoundEB',
    width: W * 0.5,
  },
  profileImg: {
    borderRadius: W * 0.15,
    width: W * 0.13,
    height: W * 0.13,
  },
  subTitle: {
    fontSize: W * 0.06,
    fontFamily: 'NanumSquareRoundEB',
    marginVertical: 10,
  },
  followUser: {
    fontSize: W * 0.06,
    fontFamily: 'NanumSquareRoundB',
    marginLeft: 20,
    minWidth: W * 0.25,
    maxWidth: W * 0.25,
  },
  followCnt: {
    fontSize: W * 0.06,
    fontFamily: 'NanumSquareRoundB',
    marginLeft: 20,
    minWidth: W * 0.15,
    maxWidth: W * 0.15,
  },
  followTxt: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'NanumSquareRoundEB',
    textAlign: 'center',
  },
  follow: {
    // width: '20%',
    backgroundColor: '#fca652',
    borderRadius: 10,
    // marginVertical: 10,
    padding: 10,
    borderColor: '#fca652',
    borderWidth: 1,
  },
  // followingTxt: {
  //   color: '#fca652',
  //   fontSize: 20,
  //   fontFamily: 'NanumSquareRoundEB',
  //   textAlign: 'center',
  // },
  // following: {
  //   // width: '20%',
  //   backgroundColor: '#fffbe6',
  //   borderColor: '#fca652',
  //   borderWidth: 1,
  //   borderRadius: 10,
  //   // marginVertical: 10,
  //   padding: 10,
  // },
  // followBtn: {
  //   fontSize: W * 0.06,
  //   fontFamily: 'NanumSquareRoundEB',
  //   marginHorizontal: 10,
  // },
  rank1: {
    fontSize: W * 0.1,
    color: '#FFD700',
  },
  rank2: {
    fontSize: W * 0.1,
    color: '#C0C0C0',
  },
  rank3: {
    fontSize: W * 0.1,
    color: '#C49C48',
  },
  rank4: {
    fontSize: W * 0.1,
    color: 'transparent',
  },
  writerImg: {
    borderRadius: 50,
    width: 40,
    height: 40,
  },
  recommendItem: {
    margin: W * 0.05,
  },
});

export default connect(mapStateToProps)(BestUser);

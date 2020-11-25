import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {serverUrl} from '../../constants';

const H = Dimensions.get('window').height;
const W = Dimensions.get('window').width;

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
  menu: state.recordReducer.menu,
});

class Analysis extends Component {
  constructor(props) {
    super(props);
  }
  onLabelPress = (label, value) => {
    alert(label + ':' + value);
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
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
            style={{marginRight: W * 0.01, fontFamily: 'NanumSquareRoundEB'}}>
            {this.props.user.username}
          </Text>
          <Text style={{fontFamily: 'NanumSquareRoundR'}}>
            님의 식단 분석 결과입니다.
          </Text>
        </View>

        {/*body*/}
        <ScrollView>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 6,
                borderWidth: 1,
                borderColor: '#bebebe',
                width: '65%',
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: W * 0.02,
                marginVertical: W * 0.02,
              }}>
              <Text style={styles.comment}>단백질을 너무 적게 드셨네요!!</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.comment}>추천 메뉴는 </Text>
                <Text
                  style={[styles.comment, {fontFamily: 'NanumSquareRoundEB'}]}>
                  닭가슴살
                </Text>
                <Text style={styles.comment}> 입니다.</Text>
              </View>
              <Text></Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.comment}>수분섭취량은 </Text>
                <Text
                  style={[styles.comment, {fontFamily: 'NanumSquareRoundEB'}]}>
                  67 %
                </Text>
                <Text style={styles.comment}> 입니다.</Text>
              </View>
              <Text></Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.comment}>나트륨 섭취량이 </Text>
                <Text
                  style={[styles.comment, {fontFamily: 'NanumSquareRoundEB'}]}>
                  80 %
                </Text>
                <Text style={styles.comment}> 입니다.</Text>
              </View>
            </View>

            <Image
              style={styles.haru}
              source={require('../../assets/images/haru.png')}
            />
          </View>
          <Image
            style={styles.graph}
            source={require('../../assets/images/graph.png')}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBE6',
  },
  // header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: W * 0.03,
  },
  profileImg: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginRight: W * 0.03,
  },
  haru: {
    height: W * 0.5,
    width: W * 0.3,
  },
  comment: {
    fontSize: 15,
    fontFamily: 'NanumSquareRoundR',
  },
  graph: {
    width: '100%',
  },
});

export default connect(mapStateToProps)(Analysis);

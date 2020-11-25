import React, {Component} from 'react';
import {Text, View, SafeAreaView, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Pie from 'react-native-pie';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {connect} from 'react-redux';
import {serverUrl} from '../../../constants';
const mapStateToProps = (state) => ({
  menu: state.recordReducer.menu,
});

const mapDispatchToProps = (dispatch) => ({
  // js에서 함수 호출을 위한 변수명: (보낼 데이터) => dispatch(action에서 실행할 함수))
  // this.props.updatemenu로 호출
  updateMenu: (menu) => dispatch(updateMenu(menu)),
});

class MyCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      carouselItems: this.props.Send[0],
      dateTime: this.props.Send[1],
      W: this.props.Send[2],
    };
  }
  // 캐러셀 내용
  _renderItem({item, index}) {
    // item = [["치킨까스", 593, 1, 1]] 이름 / 칼로리 / menu2food_id / 수량
    return (
      <>
        {index === 0 && (
          <ScrollView>
            <>
              {item.map((food, i) => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      // borderBottomWidth: 1,
                      marginBottom: 10,
                    }}
                    key={i}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: 'NanumSquareRoundEB',
                        marginLeft: 10,
                      }}>
                      {food[0]}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontFamily: 'NanumSquareRoundEB',
                        }}>
                        {food[1]}kcal
                      </Text>
                      <Text
                        style={{
                          fontSize: 18,
                          fontFamily: 'NanumSquareRoundEB',
                          marginLeft: 30,
                          marginRight: 10,
                        }}>
                        {food[3]} 인분
                      </Text>
                    </View>
                  </View>
                );
              })}
            </>
          </ScrollView>
        )}
        {index === 1 && (
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
            }}>
            <Pie
              radius={65}
              sections={[
                {
                  percentage: item[0], //탄수화물
                  color: '#FBC02D',
                },
                {
                  percentage: item[1], //단백질
                  color: '#FFEB3B',
                },
                {
                  percentage: item[2], //지방
                  color: '#FFF59D',
                },
              ]}
              strokeCap={'butt'}
            />
            <View style={{marginTop: 20, marginLeft: 20}}>
              <Text style={{fontFamily: 'NanumSquareRoundB'}}>
                <Icon name="ellipse" style={{color: '#FBC02D'}}></Icon>
                탄수화물 {item[0].toFixed(1)}%
              </Text>
              <Text style={{fontFamily: 'NanumSquareRoundB'}}>
                <Icon name="ellipse" style={{color: '#FFEB3B'}}></Icon>
                단백질 {item[1].toFixed(1)}%
              </Text>
              <Text style={{fontFamily: 'NanumSquareRoundB'}}>
                <Icon name="ellipse" style={{color: '#FFF59D'}}></Icon>
                지방 {item[2].toFixed(1)}%
              </Text>
            </View>
          </View>
        )}
      </>
    );
  }
  // 페이지 표시
  get pagination() {
    const {entries, activeSlide} = this.state;
    return (
      <Pagination
        dotsLength={this.state.carouselItems.length}
        activeDotIndex={this.state.activeIndex}
        //   containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 3,
          backgroundColor: '#F39C12',
        }}
        inactiveDotStyle={{
          // Define styles for inactive dots here
          backgroundColor: '#BEBEBE',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }
  render() {
    return (
      //   <SafeAreaView style={{flex: 1, backgroundColor:'rebeccapurple', paddingTop: 50, }}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Carousel
          layout={'default'}
          ref={(ref) => (this.carousel = ref)}
          data={this.state.carouselItems}
          sliderWidth={this.state.W * 0.8}
          itemWidth={this.state.W * 0.8}
          renderItem={this._renderItem}
          onSnapToItem={(index) => this.setState({activeIndex: index})}
        />
        {this.pagination}
      </View>
      //   </SafeAreaView>
    );
  }
}
export default MyCarousel;
// export default connect(mapStateToProps,mapDispatchToProps)(MyCarousel);

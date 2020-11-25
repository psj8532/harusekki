import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  PanResponder,
  AsyncStorage,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Draggable from 'react-native-draggable';
import {Dropdown} from 'react-native-material-dropdown';

const {width, height} = Dimensions.get('window');

export default class CropImg extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    image: this.props.image,
    size: 0.5,
    squareSizeDrop: [
      {
        value: 'very small',
      },
      {
        value: 'small',
      },
      {
        value: 'medium',
      },
      {
        value: 'large',
      },
      {
        value: 'very large',
      },
    ],
  };
  componentDidMount = () => {
    const squareSizeDropval = this.state.squareSizeDrop[2].value;
    // const squarePropDropval = this.state.squarePropDrop[0].value;
    this.setState({
      squareSizeDropval: squareSizeDropval,
      // squarePropDropval: squarePropDropval,
    });
  };
  checkLocation(info) {
    // 오른쪽 하단 y, 왼쪽 상단 x, 오른쪽 하단 x, 왼쪽 상단 y
    //{"bottom": 205.7142791748047, "left": 0, "right": 205.7142791748047, "top": 0}
    console.log(info);
    // 오른쪽 상단 x, y, 왼쪽 상단 x, y
    this.setState({
      location: [
        info['left'] / width,
        info['top'] / width,
        info['right'] / width,
        info['bottom'] / width,
      ],
    });
  }
  sendLocation() {
    this.props.sendLocation(this.state.location);
  }
  changeSize(selected) {
    var Size = {
      'very small': 0.2,
      small: 0.3,
      medium: 0.5,
      large: 0.7,
      'very large': 0.9,
    };
    for (var [key, val] of Object.entries(Size)) {
      if (selected === key) {
        this.setState({
          size: val,
        });
      }
    }
  }
  render() {
    return (
      <View style={{width: '100%', height: '100%', flex: 1}}>
        <Draggable
          renderColor="black"
          renderText={this.state.size}
          renderSize={width * this.state.size}
          renderColor="rgba(52, 152, 219, 0.43)"
          x={0}
          y={0}
          minX={0}
          minY={0}
          maxX={width}
          maxY={width}
          onDragRelease={(e, gestureState, getBounds) =>
            this.checkLocation(getBounds)
          }
        />
        <Image
          style={{height: width, width: width}}
          source={{
            uri: `data:image/jpeg;base64,${this.state.image.data}`,
          }}
        />
        <View style={{alignItems: 'center', margin: 30}}>
          <Dropdown
            label="크기를 선택하세요."
            data={this.state.squareSizeDrop}
            value={this.state.squareSizeDropval}
            containerStyle={styles.dropdown}
            pickerStyle={styles.dropdownPicker}
            dropdownOffset={{top: 10}}
            onChangeText={(value) => {
              this.changeSize(value);
            }}
          />
          {/* <Dropdown
              label='비율을 선택하세요.'
              data={this.state.squarePropDrop}
              value={this.state.squarePropDropval}
              containerStyle={styles.dropdown}
              pickerStyle={styles.dropdownPicker}
              dropdownOffset={{top: 10}}
              onChangeText={(value) => {this.changeSize(value)}}
            /> */}
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
            justifyContent: 'center',
          }}>
          <TouchableHighlight
            style={{...styles.modalButton, backgroundColor: '#FCA652'}}
            onPress={() => {
              this.sendLocation();
            }}>
            <Text>저장</Text>
          </TouchableHighlight>
          {/* <TouchableHighlight
            style={{...styles.FImodalButton, backgroundColor: '#FCA652'}}
            onPress={() => {
              this.close(false);
            }}>
            <Text>취소</Text>
          </TouchableHighlight> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dropdown: {
    width: '100%',
  },
  dropdownPicker: {
    // width: '30%',
    // position: 'absolute',
    // left: '68%',
    // top: '19%',
    // // right: 0,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    marginHorizontal: 20,
  },
});

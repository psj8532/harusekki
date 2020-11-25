import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  Alert,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';

export default class Camera extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    selectedCameraModal: false,
  };
  visibleModal = (visible) => {
    this.setState({
      selectedCameraModal: visible,
    });
  };
  render() {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
        allowsEditing: true,
      },
    };
    return (
      <>
        {/* camera modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.selectedCameraModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <TouchableOpacity
            style={styles.centeredView}
            onPress={() => {
              this.visibleModal(!this.state.selectedCameraModal);
            }}>
            <View style={styles.delmodalView}>
              <TouchableHighlight
                onPress={() => {
                  ImagePicker.launchCamera(options, (response) => {
                    // Same code as in above section!
                    this.visibleModal(!this.state.selectedCameraModal);
                    this.props.onCamera(response);
                  });
                }}>
                <Text style={styles.modalText}>카메라 촬영</Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => {
                  ImagePicker.launchImageLibrary(options, (response) => {
                    // Same code as in above section!
                    if (response.uri) {
                      this.visibleModal(!this.state.selectedCameraModal);
                      this.props.onCamera(response);
                    }
                  });
                }}>
                <Text style={styles.modalText}>앨범에서 가져오기</Text>
              </TouchableHighlight>
            </View>
          </TouchableOpacity>
        </Modal>

        <TouchableOpacity
          style={{
            width: '100%',
            height: 300,
            backgroundColor: '#fff',
            borderRadius: 5,
            borderColor: '#E0E0E0',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => this.visibleModal(!this.state.selectedCameraModal)}>
          <Text style={{fontFamily: 'NanumSquareRoundR'}}>
            사진을 추가해보세요.
          </Text>
        </TouchableOpacity>
      </>
    );
  }
}

const styles = StyleSheet.create({
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
  //modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  delmodalView: {
    width: '60%',
    margin: 20,
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  openButton: {
    backgroundColor: '#34495E',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 2,
  },
  modalText: {
    marginBottom: 15,
    fontSize: 20,
    fontFamily: 'NanumSquareRoundB',
  },
});

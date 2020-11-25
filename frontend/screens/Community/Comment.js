import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {AsyncStorage, Image} from 'react-native';
import {serverUrl} from '../../constants';
import {connect} from 'react-redux';

const {width, height} = Dimensions.get('screen');

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
});

class Comment extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    articleId: this.props.route.params.articleId,
    comments: [],
    myComment: {
      content: '',
    },
    selectedReply: {
      flag: false,
      commentId: null,
    },
    username: this.props.user.username,
  };
  createComment = async () => {
    if (this.state.myComment.content) {
      fetch(`${serverUrl}articles/${this.state.articleId}/create_comment/`, {
        method: 'POST',
        body: JSON.stringify(this.state.myComment),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${this.props.user.token}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          this.setState({
            myComment: {
              ...this.state.myComment,
              content: '',
            },
          });
          this.getComments();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
  createReply = () => {
    if (this.state.myComment.content) {
      fetch(
        `${serverUrl}articles/${this.state.selectedReply.commentId}/create_reply/`,
        {
          method: 'POST',
          body: JSON.stringify(this.state.myComment),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${this.props.user.token}`,
          },
        },
      )
        .then((response) => response.json())
        .then(() => {
          this.setState({
            myComment: {
              ...this.state.myComment,
              content: '',
            },
          });
          this.getComments();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  componentDidMount() {
    // you might want to do the I18N setup here
    this.getComments();
  }

  getComments = () => {
    fetch(`${serverUrl}articles/${this.state.articleId}/comments/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          comments: response,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  getReply = (commentId, i) => {
    fetch(`${serverUrl}articles/${commentId}/replys/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((response) => {
        var newComments = this.state.comments;
        newComments[i]['replys'] = response;
        this.setState({
          comments: newComments,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  delReply = (commentId, i) => {
    var newComments = this.state.comments;
    delete newComments[i]['replys'];
    this.setState({});
  };
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={{width: '100%'}}>
            <View style={styles.comments}>
              {this.state.comments.map((comment, i) => {
                const btnColor =
                  comment.id === this.state.selectedReply.commentId
                    ? '#fca652'
                    : '#000000';
                return (
                  <View style={styles.comment} key={comment.id}>
                    {comment.user.profileImage && (
                      <Image
                        style={styles.writerImg}
                        source={{
                          uri: `${serverUrl}gallery${comment.user.profileImage}`,
                        }}
                      />
                    )}
                    {!comment.user.profileImage && (
                      <Image
                        style={styles.writerImg}
                        source={require('../../assets/images/default-profile.png')}
                      />
                    )}
                    <View style={styles.commentText}>
                      <Text style={styles.commentContent}>
                        {comment.content}
                      </Text>
                      <View style={styles.commentData}>
                        <Text style={styles.cmdData}>
                          {comment.user.username}
                        </Text>
                        <Text style={styles.cmdData}>|</Text>
                        <Text style={styles.cmdData}>{comment.created_at}</Text>
                        <TouchableOpacity
                          style={styles.cmdData}
                          onPress={() => {
                            if (
                              this.state.selectedReply.commentId === comment.id
                            ) {
                              this.setState({
                                selectedReply: {
                                  ...this.state.selectedReply,
                                  flag: false,
                                  commentId: null,
                                },
                              });
                            } else {
                              this.setState({
                                selectedReply: {
                                  ...this.state.selectedReply,
                                  flag: true,
                                  commentId: comment.id,
                                },
                              });
                            }
                          }}>
                          <Text
                            style={{
                              color: btnColor,
                              fontFamily: 'NanumSquareRoundR',
                            }}>
                            답글 달기
                          </Text>
                        </TouchableOpacity>
                      </View>
                      {!comment.replys && (
                        <TouchableOpacity
                          onPress={() => {
                            this.getReply(comment.id, i);
                          }}>
                          <Text
                            style={{
                              fontFamily: 'NanumSquareRoundR',
                            }}>
                            답글 보기
                          </Text>
                        </TouchableOpacity>
                      )}
                      {comment.replys && (
                        <TouchableOpacity
                          onPress={() => {
                            this.delReply(comment.id, i);
                          }}>
                          <Text
                            style={{
                              fontFamily: 'NanumSquareRoundR',
                            }}>
                            답글 접기
                          </Text>
                        </TouchableOpacity>
                      )}
                      {comment.replys &&
                        comment.replys.map((reply) => {
                          return (
                            <View style={styles.comment}>
                              {reply.user.profileImage && (
                                <Image
                                  style={styles.writerImg}
                                  source={{
                                    uri: `${serverUrl}gallery${reply.user.profileImage}`,
                                  }}
                                />
                              )}
                              {!reply.user.profileImage && (
                                <Image
                                  style={styles.writerImg}
                                  source={{
                                    uri:
                                      'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/profle-256.png',
                                  }}
                                />
                              )}
                              <View style={styles.commentText}>
                                <Text style={styles.commentContent}>
                                  {reply.content}
                                </Text>
                                <View style={styles.commentData}>
                                  <Text style={styles.cmdData}>
                                    {reply.user.username}
                                  </Text>
                                  <Text style={styles.cmdData}>|</Text>
                                  <Text style={styles.cmdData}>
                                    {reply.created_at}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          );
                        })}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
        <TextInput
          style={styles.inputArea}
          placeholder="댓글을 입력하세요."
          value={this.state.myComment.content}
          onChangeText={(text) => {
            this.setState({
              myComment: {content: text},
            });
          }}
        />
        {!this.state.selectedReply.flag && (
          <TouchableOpacity
            onPress={this.createComment}
            style={styles.inputBtn}>
            <Text style={styles.inputTxt}>댓글 작성</Text>
          </TouchableOpacity>
        )}
        {this.state.selectedReply.flag && (
          <TouchableOpacity onPress={this.createReply} style={styles.inputBtn}>
            <Text style={styles.inputTxt}>답글 작성</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbe6',
  },
  comments: {
    width: '100%',
    marginHorizontal: 5,
    marginVertical: 10,
  },
  comment: {
    width: '100%',
    flexDirection: 'row',
    marginVertical: 10,
  },
  commenterImg: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  commentText: {
    marginHorizontal: 10,
  },
  commentContent: {
    fontSize: 16,
    fontFamily: 'NanumSquareRoundB',
  },
  commentData: {
    flexDirection: 'row',
  },
  cmdData: {
    marginRight: 7,
    fontSize: 13,
    fontFamily: 'NanumSquareRoundL',
  },
  inputArea: {
    backgroundColor: '#fff',
    fontFamily: 'NanumSquareRoundEB',
  },
  inputBtn: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  inputTxt: {
    color: '#fff',
    fontFamily: 'NanumSquareRoundEB',
    fontSize: 20,
  },
  writerImg: {
    borderRadius: 50,
    width: 40,
    height: 40,
  },
});

export default connect(mapStateToProps)(Comment);

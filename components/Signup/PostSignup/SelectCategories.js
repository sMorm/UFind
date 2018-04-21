import React, { Component } from 'react'
import { 
  View, Text, StyleSheet, AsyncStorage, Image,  StatusBar,
  ActivityIndicator, TouchableOpacity, Animated, FlatList, Easing
} from 'react-native'
import axios from 'axios'
import LottieView from 'lottie-react-native'
import lottieCheck from '../../../lottie/check.json'

import { PRIMARY_COLOR } from '../../../constants/colors'
import { ENDPOINT } from '../../../constants/api'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'

class Check extends Component {
  state = {
    progress: new Animated.Value(0)
  }

  componentDidUpdate() {
    if(this.props.selected) {
      Animated.timing(this.state.progress, {
        toValue: 1,
        duration: 250,
        easing: Easing.linear,
      }).start();
    } else {
      Animated.timing(this.state.progress, {
        toValue: 0,
        duration: 250,
        easing: Easing.linear,
      }).start();
    }
  }
  
  render() {
    return <LottieView source={lottieCheck} progress={this.state.progress} />
  }
}

export default class SelectCategories extends Component {
  state = {
    categories: null,
    isLoading: true,
    selected: [],
    progress: new Animated.Value(0)
  }

  async componentDidMount() {
    const res = await axios.get(`${ENDPOINT}/category`)
    if(res) this.setState({ categories: res.data, isLoading: false })
  }

  _renderItem = ({ item, index }) => { 
    return (
      <TouchableOpacity style={styles.option} onPress={this._onSelect(index)}>
        <Text key={item.id} style={styles.optionText}>{item.name}</Text>
        <View style={styles.lottieContainer}>
          <Check selected={item.selected} />
        </View>
      </TouchableOpacity>
    )
  }

  renderCheck = isSelected => {
    const progress = new Animated.Value(0)
    if(isSelected) {
      Animated.timing(progress, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
      }).start();
    } else {
      Animated.timing(progress, {
        toValue: 0,
        duration: 250,
        easing: Easing.linear,
      }).start();
    }
  }

  _onSelect = index => () => {
    const { categories } = this.state
    let currentCategory = categories[index]
    if(!currentCategory.selected) 
      currentCategory['selected'] = true
    else
      currentCategory['selected'] = false
    let updatedCategory = categories
    updatedCategory[index] = currentCategory
    this.setState({ categories: updatedCategory })
    console.log(this.state.categories)
  }

  _keyExtractor = (item, index) => item.name

  render() {
    const { categories, isLoading } = this.state
    if(isLoading) {
      return (
        <View style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={PRIMARY_COLOR} size='large' />
          </View>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor='white' barStyle="dark-content" />
        <View style={styles.content}>
          <Text style={styles.header}>Almost done!</Text>
          <Text style={styles.smallText}>In order to create connections between you and other students with similar interests, please select all categories that applies.</Text>
          <View style={styles.flatListContainer}>
            <FlatList
              data={categories}
              renderItem={this._renderItem } 
              keyExtractor={this._keyExtractor}
              extraData={this.state}/>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: '2%',
    paddingVertical: '4%',    
  },
  loadingContainer: {
    justifyContent: 'center'
  },
  lottieContainer: {
    height: 110,
    width: 110,
  },
  flatListContainer: {
    height: '80%',
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '108%',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  optionText: {
    fontFamily: 'circular',
    fontSize: 30,
    color: 'black'
  },
  header: {
    fontSize: 40,
    color: 'black',
    fontFamily: 'circular'
  },
  smallText: {
    fontSize: 20,
    color: '#888',
    marginTop: 10
  }
})
import React from 'react';
import { View, Text, ScrollView, AsyncStorage, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppLoading } from 'expo';
import List from './List';
import Icon from 'react-native-vector-icons/Feather';

export default class MainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      data: {},
    }
  }

  componentDidUpdate = () => {
    this.loadData();
  }

  componentDidMount = () => {
    this.loadData();
  }

  loadData = async () => {
    try {
      const getData = await AsyncStorage.getItem('worldclock');
      const parsedData = JSON.parse(getData);
      this.setState({loaded: true, data: parsedData || {}});
    } catch (err) {
      console.log(err);
    }
  };

  navigate = () => {
    this.props.navigation.navigate('Add')
  }

  navigateDetail = id => {
    this.props.navigation.navigate('Detail', {id:id})
  }

  render() {
    const {loaded,data} = this.state;
    if (!loaded) {
      return <AppLoading />;
    }
    return(
      <LinearGradient style={styles.container} colors={['#F2E4F9','#B0A3B6']}>
        <ScrollView contentContainerStyle={styles.list}>
          {Object.values(data).map(item => <List key={item.id} {...item} navigateDetail={this.navigateDetail} />)}
        </ScrollView>
        <TouchableOpacity onPressOut={this.navigate} style={{position:'absolute',bottom:32,}}>
          <Icon name='plus-square' size={40} color='rgba(154,145,158,1)' />
        </TouchableOpacity>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    flex: 1,
    alignItems: 'center',
  },
})

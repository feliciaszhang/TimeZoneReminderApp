import React from 'react';
import { View, Text, ScrollView, AsyncStorage, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppLoading } from 'expo';
import Icon from 'react-native-vector-icons/Feather';

export default class DetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.navigation.state.params,
      data: {},
      selected: {},
      loaded: false,
    }
  }

  componentDidMount = () => {
    this.loadData();
  }

  loadData = async () => {
    try {
      const getData = await AsyncStorage.getItem('worldclock');
      const parsedData = JSON.parse(getData);
      this.setState({data: parsedData || {}});
      {Object.values(parsedData).map(item => {item.id===this.state.value.id ? this.setState({loaded: true,selected:item}):null})}
    } catch (err) {
      console.log(err);
    }
  };

  save = item => {
    AsyncStorage.setItem('worldclock', JSON.stringify(item))
  }

  deleteItem = () => {
    let copy = JSON.parse(JSON.stringify(this.state.data))
    const id = this.state.selected.id
    delete copy[id]
    this.save(copy)
    this.setState({data: copy})
    this.navigate()
  }

  navigate = () => {
    this.props.navigation.navigate('Main')
  }

  render() {
    const {selected,loaded} = this.state
    if (!loaded) {
      return <AppLoading />;
    }
    return(
      <LinearGradient style={styles.container} colors={['#F2E4F9','#B0A3B6']}>
        <Text style={styles.name}>{selected.name}</Text>
        <Text style={styles.text}>{selected.time.replace(/:\d\d /, ' ')}</Text>
        <Text style={styles.text}>{selected.date}</Text>
        {Object.values(selected.timezoneList).map(timezone => <Text>{timezone.locationName} {timezone.convertedTime.replace(/:\d\d /, ' ')} {timezone.convertedDate}</Text>)}
        <TouchableOpacity onPressOut={this.deleteItem} style={{position:'absolute',right:32,bottom:32,}}>
          <Icon name='trash-2' size={40} color='rgba(154,145,158,1)' />
        </TouchableOpacity>
        <TouchableOpacity onPressOut={this.navigate} style={{position:'absolute',left:32,bottom:32,}}>
          <Icon name='home' size={40} color='rgba(154,145,158,1)' />
        </TouchableOpacity>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
  },
  name: {
    fontFamily: 'Avenir Next',
    fontSize: 35,
    color: '#422E49',
  },
  text: {
    fontFamily: 'Avenir Next',
    fontSize: 25,
    color: '#422E49',
  },
})

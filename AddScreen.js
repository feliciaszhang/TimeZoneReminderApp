import React from 'react';
import { StyleSheet, Text, AsyncStorage, ScrollView, TextInput, View, TouchableOpacity, DatePickerIOS } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppLoading } from 'expo';
import Icon from 'react-native-vector-icons/Feather';
import uuidv1 from 'uuid/v1';

export default class AddScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      time: new Date(),
      date: new Date(),
      locationName: '',
      timezoneName: '',
      timezoneList: {},
      loaded: false,
      data: {},
    }
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

  handleSearch = () => {
    const {locationName,timezoneName,time} = this.state;
    if (locationName !== '') {
      fetch(
        `http://api.timezonedb.com/v2.1/get-time-zone?key=WJQQDQQRIA45&format=json&by=zone&zone=${timezoneName}&fields=gmtOffset`
      ).then(res => res.json())
      .then(json => {
        if (json.status === 'OK') {
          let copy = JSON.parse(JSON.stringify(this.state.timezoneList))
          const seconds = json.gmtOffset
          copy[locationName] = {locationName:locationName,timezoneName:timezoneName,gmtOffset:seconds/60/60,convertedTime:'',convertedDate:''}
          this.setState({timezoneList:copy,locationName:'',timezoneName:''})
        }
      })
    }
  }

  save = item => {
    AsyncStorage.setItem('worldclock', JSON.stringify(item))
  }

  handleAdd = () => {
    const {name,time,timezoneList} = this.state;
    if (name !== '') {

      {Object.values(timezoneList).map(timezone => {
        let tempTime = time.toLocaleString("en-US", {timeZone: timezone.timezoneName})
        tempTime = new Date(tempTime)
        timezone.convertedTime = tempTime.toLocaleTimeString(),
        timezone.convertedDate = tempTime.toLocaleDateString("en-US",{weekday:'short',year:'numeric',month:'short',day:'numeric'})
      })}

      let copy = JSON.parse(JSON.stringify(this.state.data))
      const ID = uuidv1();
      copy[ID] = {
        id: ID,
        name: name,
        time: time.toLocaleTimeString(),
        date: time.toLocaleDateString("en-US",{weekday:'short',year:'numeric',month:'short',day:'numeric'}),
        timezoneList: timezoneList,
      }
      this.save(copy)
      this.setState({data:copy})
      this.navigate()
    }
  }

  navigate = () => {
    this.props.navigation.navigate('Main')
  }

  render() {
    const {loaded, name, time, timezoneName, locationName, timezoneList} = this.state;
    if (!loaded) {
      return <AppLoading />;
    }
    return (
      <LinearGradient style={styles.container} colors={['#F2E4F9','#B0A3B6']}>
        <View style={styles.fields}>
          <TextInput placeholder='event name' value={name} style={[styles.text,{padding: 16,}]}
          onChangeText={name => this.setState({name: name})} returnKeyType={'done'} />
        </View>
        <View style={styles.fields}>
          <DatePickerIOS minuteInterval={5} date={time} onDateChange={time => this.setState({time: time})} />
        </View>
        <View style={styles.fields}>
          <TextInput placeholder='participant name' value={locationName} style={[styles.text,styles.line]}
          onChangeText={locationName => this.setState({locationName: locationName})} returnKeyType={'done'} />
          <TextInput placeholder='timezone name' value={timezoneName} style={[styles.text,{padding:16,}]}
          onChangeText={timezoneName => this.setState({timezoneName: timezoneName})} returnKeyType={'done'} />
          <TouchableOpacity onPressOut={this.handleSearch}>
            <Icon name='user-plus' size={30} color='rgba(154,145,158,0.7)' style={{position:'absolute',right:8,bottom:8,}}/>
          </TouchableOpacity>
        </View>
        <View style={styles.clearfields}>
          <ScrollView horizontal={true}>
            {Object.values(timezoneList).map(zone =>
              <View style={{marginRight: 16,}} key={zone.locationName}>
                <Text style={styles.text}>{zone.locationName}</Text>
                <Text style={[styles.text,{fontSize: 20,color: '#9A919E',}]}>UTC {zone.gmtOffset}:00</Text>
              </View>
            )}
          </ScrollView>
        </View>
        <TouchableOpacity onPressOut={this.handleAdd} style={{position:'absolute',right:32,bottom:32,}}>
          <Icon name='save' size={40} color='rgba(154,145,158,1)' />
        </TouchableOpacity>
        <TouchableOpacity onPressOut={this.navigate} style={{position:'absolute',left:32,bottom:32,}}>
          <Icon name='home' size={40} color='rgba(154,145,158,1)' />
        </TouchableOpacity>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    flex: 1,
    alignItems: 'center',
  },
  fields: {
    width: 350,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
  },
  line: {
    paddingTop: 16,
    paddingBottom: 16,
    marginLeft: 16,
    marginRight: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(154,145,158,0.5)',
  },
  clearfields: {
    width: 350,
    marginBottom: 20,
  },
  text: {
    fontFamily: 'Avenir Next',
    fontSize: 25,
    color: '#422E49',
  },
})

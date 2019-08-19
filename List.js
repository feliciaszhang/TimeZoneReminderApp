import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default class List extends React.Component {
  navigate = () => {
    const {navigateDetail,id} = this.props
    navigateDetail(id)
  }

  render() {
    const {id,name,time,date} = this.props
    return(
      <TouchableOpacity onPressOut={this.navigate}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.date}>{date}</Text>
            </View>
            <Text style={styles.time}>{time.replace(/:\d\d /, ' ')}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
    width: 380,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
    padding: 12,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    fontFamily: 'Avenir Next',
    fontSize: 35,
    color: '#422E49',
  },
  name: {
    fontFamily: 'Avenir Next',
    fontSize: 20,
    color: '#422E49',
  },
  date: {
    fontFamily: 'Avenir Next',
    fontSize: 15,
    color: '#9A919E',
  },
})

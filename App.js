import { createStackNavigator, createAppContainer } from 'react-navigation';
import MainScreen from './MainScreen';
import DetailScreen from './DetailScreen';
import AddScreen from './AddScreen';

const Home = createStackNavigator({
  Main: {
    screen: MainScreen,
    navigationOptions: {
      header: null
    }
  },
  Detail: {
    screen: DetailScreen,
    navigationOptions: {
      header: null
    }
  },
  Add: {
    screen: AddScreen,
    navigationOptions: {
      header: null
    }
  },
})

const App = createAppContainer(Home);

export default App;

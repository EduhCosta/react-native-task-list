import React from 'react';
import Agenda from './../screens/Agenda'
import Auth from './../screens/Auth'
import {
  createStackNavigator, 
  createDrawerNavigator,
  createAppContainer 
} from 'react-navigation';
import commonStyles from './../commonStyles'
import Menu from './../screens/Menu'

const MenuRoute = {
  Today: {
    name: 'Today',
    screen: props => <Agenda title="Hoje" daysAhead={0} {...props} />,
    navigationOptions: { title: 'Hoje' }
  },
  Tomorrow: {
    name: 'Tomorrow',
    screen: props => <Agenda title="Amanhã" daysAhead={1} {...props} />,
    navigationOptions: { title: 'Amanhã' }
  },
  Week: {
    name: 'Week',
    screen: props => <Agenda title="Semana" daysAhead={7} {...props} />,
    navigationOptions: { title: 'Semana' }
  },
  Month: {
    name: 'Month',
    screen: props => <Agenda title="Mês" daysAhead={30} {...props} />,
    navigationOptions: { title: 'Mês' }
  }
}

const MenuConfig = {
  initialRouteName: 'Today',
  contentComponent: Menu,
  contentOptions: {
    labelStyle: {
      fontFamily: commonStyles.fontFamily,
      fontWeight: 'normal',
      fontSize: 20
    },
    activeLabel: {
      color: '#080'
    }
  }
}

const MenuNavigator = createDrawerNavigator(MenuRoute, MenuConfig)

const MainRoutes = createStackNavigator({
  Auth: {
    name: 'Auth',
    screen: Auth
  },
  Home: {
    name: 'Home',
    screen: MenuNavigator
  }
}, {
  headerMode: 'none'
})

export default createAppContainer(MainRoutes, {
  initialRouteName: 'Auth'
});
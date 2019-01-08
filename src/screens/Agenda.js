import React, { Component } from 'react';

// React Native
import { StyleSheet, FlatList, TouchableOpacity, Platform, AsyncStorage, Text, View, ImageBackground } from 'react-native';
// Components
import Task from './../components/Task';
import AddTask from './AddTask';
// Utils
import moment from 'moment';
import 'moment/locale/pt-br';
import ActionButton from 'react-native-action-button';
// Assets
import todayImage from './../../assets/imgs/today.jpg';
import Icon from 'react-native-vector-icons/FontAwesome';
// Styles
import commonStyles from './../commonStyles';
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 3
  },
  titleBar: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 50,
    marginLeft: 20,
    marginBottom: 10
  },
  subtitle: { 
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 30
  },
  tasksContainer: {
    flex: 7,
  },
  iconBar: {
    marginTop: Platform.OS === 'ios' ? 30 : 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});

class Agenda extends Component {
  state = {
    tasks: [],
    visibleTasks: [],
    showDoneTasks: true,
    showAddTask: false
  }

  componentDidMount = async () => {
    const data  = await AsyncStorage.getItem('tasks');
    const tasks = JSON.parse(data) || [];
    this.setState({ tasks }, this.filterTasks);
  }

  render() {
    return (
      <View style={styles.container}>
        <AddTask
          isVisible={this.state.showAddTask}
          onSave={this.addTask}
          onCancel={
            () => { 
              this.setState({ showAddTask: false })
            }
          }
        />
        <ImageBackground source={todayImage} style={styles.background}>
          <View style={styles.iconBar}>
            <TouchableOpacity onPress={this.toggleFilter}>
              <Icon 
                name={this.state.showDoneTasks ? 'eye' : 'eye-slash'}
                size={20}
                color={commonStyles.colors.secondary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.titleBar}>
            <Text style={styles.title}>Hoje</Text>
            <Text style={styles.subtitle}>{moment().locale('pt-br').format('ddd, D [de] MMMM [de] YYYY')}</Text>
          </View>
        </ImageBackground>
        <View style={styles.tasksContainer}>
          <FlatList 
            data={this.state.visibleTasks}
            keyExtractor={item => `${item.id}`}
            renderItem={({ item }) => 
              <Task {...item} toggleTask={this.toggleTask} onDelete={this.delTask} />
            }
          />

        </View>
        <ActionButton 
          buttonColor={commonStyles.colors.today}
          onPress={
            () => {
              this.setState({ showAddTask: true })
            }
          }
        />
      </View>
    );
  }

  addTask = task => {
    const tasks = [...this.state.tasks];
    tasks.push({
      id: Math.random(),
      desc: task.desc,
      estimateAt: task.date,
      doneAt: null
    });
    this.setState({ 
      tasks, 
      showAddTask: false 
    }, this.filterTasks);
  }

  delTask = id => {
    const tasks = this.state.tasks.filter(task => task.id !== id);
    this.setState({ tasks }, this.filterTasks);
  }

  filterTasks = () => {
    let visibleTasks = null;
    if (this.state.showDoneTasks) {
      visibleTasks = [...this.state.tasks];
    } else {
      const pending =  task => task.doneAt === null;
      visibleTasks = this.state.tasks.filter(pending);
    }
    this.setState({ visibleTasks });
    AsyncStorage.setItem('tasks', JSON.stringify(this.state.tasks));
  }

  toggleFilter = () => {
    this.setState({ showDoneTasks: !this.state.showDoneTasks }, this.filterTasks);
  }

  toggleTask = (id) => {
    const tasks = [...this.state.tasks];
    tasks.forEach(task => {
      if (task.id === id) {
        task.doneAt = task.doneAt ? null : new Date()
      }
    });
    this.setState({ tasks }, this.filterTasks());
  }
}

export default Agenda;
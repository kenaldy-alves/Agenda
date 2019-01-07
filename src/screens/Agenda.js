import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  AsyncStorage
} from 'react-native'

import moment from 'moment'
import 'moment/locale/pt-br'
import todayImage from '../../assets/imgs/today.jpg'
import commonStyles from '../styles/commonStyles'
import Task from '../components/task'
import Icon from 'react-native-vector-icons/FontAwesome'
import ActionButton from 'react-native-action-button'
import AddTask from '../components/AddTask'

export default class Agenda extends Component {

  state = {
    tasks: [],
    visibleTasks: [],
    showDoneTasks: true,
    showAddTaskModal: false
  }

  addTask = task => {
    const tasks = [... this.state.tasks]

    tasks.push({
      id: Math.random(),
      desc: task.desc,
      estimateAt: task.date,
      doneAt: null
    })

    this.setState({ tasks, showAddTaskModal: false }, this.filterTasks)
  }

  filterTasks = () => {
    let visibleTasks = null

    if (this.state.showDoneTasks) {
      visibleTasks = [... this.state.tasks]
    } else {
      const pending = task => task.doneAt === null
      visibleTasks = this.state.tasks.filter(pending)
    }
    this.setState({ visibleTasks })
    AsyncStorage.setItem('tasks', JSON.stringify(this.state.tasks))
  }

  toogleFilter = () => {
    this.setState({ showDoneTasks: !this.state.showDoneTasks }, this.filterTasks)
  }

  componentDidMount = async () => {
    const data = await AsyncStorage.getItem('tasks')
    const tasks = JSON.parse(data) || []
    this.setState({ tasks }, this.filterTasks)
  }

  toogleCheck = id => {
    const tasks = this.state.tasks.map(task => {
      if (task.id === id) {
        task = { ...task }
        task.doneAt = task.doneAt ? null : new Date()
      }
      return task
    })

    this.setState({ tasks }, this.filterTasks)
  }

  onDelete = id => {
    const tasks = this.state.tasks.filter(task => task.id !== id)
    this.setState({ tasks }, this.filterTasks)
  }

  render() {
    return (
      <View style={styles.container} >
        <StatusBar translucent={true} backgroundColor='rgba(125,0,0,0)' barStyle='light-content' />

        <AddTask isVisible={this.state.showAddTaskModal}
          onCancel={() => this.setState({ showAddTaskModal: false })}
          onSave={this.addTask}></AddTask>

        <ImageBackground source={todayImage} style={styles.background}>
          <View style={styles.iconBar}>
            <TouchableOpacity onPress={this.toogleFilter}>
              <Icon name={this.state.showDoneTasks ? 'eye' : 'eye-slash'} size={20}
                color={commonStyles.colors.secondary}></Icon>
            </TouchableOpacity>
          </View>

          <View style={styles.titleBar}>
            <Text style={styles.title}>Hoje</Text>
            <Text style={styles.subTitle}>
              {moment().locale('pt-br').format('ddd, D [de] MMMM [de] YYYY')}
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.taskContainer}>
          <FlatList data={this.state.visibleTasks}
            keyExtractor={item => '${item.id}'}
            renderItem={({ item }) => <Task {...item} toogleCheck={this.toogleCheck} onDelete={this.onDelete} />} >
          </FlatList>
        </View>

        <ActionButton title='Nova Tarefa'
          buttonColor={commonStyles.colors.today}
          onPress={() => { this.setState({ showAddTaskModal: true }) }}
          renderIcon={active => active ? false : <Icon name='pencil' style={styles.actionButton} />} />
      </View>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 3,
  },
  titleBar: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 50,
    marginLeft: 20,
    marginBottom: 10,
  },
  subTitle: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 30,
  },
  taskContainer: {
    flex: 7
  },
  iconBar: {
    marginTop: 30,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  actionButton: {
    fontSize: 20,
    height: 22,
    color: 'white',
  }
})
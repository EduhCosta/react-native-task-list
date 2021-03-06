import React from 'react';

// React Native
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  DatePickerIOS,
  DatePickerAndroid, 
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert
 } from 'react-native';
// Utils
import moment from 'moment';
import commonStyles from '../commonStyles';
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    justifyContent: 'space-between'
  },
  offset: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  button: {
    margin: 20,
    marginRight: 30,
    color: commonStyles.colors.default
  },
  header: {
    fontFamily: commonStyles.fontFamily,
    backgroundColor: commonStyles.colors.default,
    color: commonStyles.colors.secondary,
    textAlign: 'center',
    padding: 15,
    fontSize: 15
  },
  input: {
    fontFamily: commonStyles.fontFamily,
    width: '90%',
    height: 40,
    marginTop: 10,
    marginLeft: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 6
  },
  date: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
    marginLeft: 10,
    marginTop: 10,
    textAlign: 'center'
  }
});

class AddTask extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState = () => {
    return {
      desc: '',
      date: new Date()
    }
  }

  render() {
    let datePicker = null
    if ( Platform.OS === 'ios') {
      datePicker = (
        <DatePickerIOS
          mode="date"
          date={this.state.date}
          onDateChange={date => this.setState({ date })}
        />
      );
    } else {
      datePicker = (
        <TouchableOpacity onPress={this.handleDateAndroidChange}>
          <Text style={styles.date}>
            {moment(this.state.date).format('ddd, D [de] MMMM [de] YYYY')}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <Modal 
        onRequestClose={this.props.onCancel}
        visible={this.props.isVisible}
        animationType='slide'
        transparent={true}
        onShow={() => this.setState({ ...this.getInitialState() })}
      >
        <TouchableWithoutFeedback onPress={this.props.onCancel}>
          <View style={styles.offset} />
        </TouchableWithoutFeedback>
        <View style={styles.container}>
          <Text style={styles.header}>Nova Tarefa!</Text>
          <TextInput
            placeholder="Descrição..."
            style={styles.input}
            onChangeText={desc => this.setState({ desc })}
            value={this.state.desc}
          />
          {datePicker}
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity onPress={this.props.onCancel}>
              <Text style={styles.button}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.save}>
              <Text style={styles.button}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={this.props.onCancel}>
          <View style={styles.offset} />
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  handleDateAndroidChange = () => {
    DatePickerAndroid.open({
      date: this.state.date
    }).then( event => {
      if (event.action !== DatePickerAndroid.dismissedAction) {
        const momentDate = moment(this.state.date);
        momentDate.date(event.day)
        momentDate.month(event.month)
        momentDate.year(event.year)
        this.setState({ date: momentDate.toDate() })
      }
    })
  }

  save = () => {
    if (!this.state.desc.trim()) {
      Alert.alert('Dados Inválidos', 'Informe uma descrição para tarefa');
      return;
    }
    const data = { ...this.state };
    this.props.onSave(data);
    this.setState({ ...this.getInitialState() });
  }
};

AddTask.propTypes = {
    
};

export default AddTask;
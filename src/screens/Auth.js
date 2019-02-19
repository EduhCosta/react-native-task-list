import React from 'react';
import { StyleSheet, Text, TextInput, View,ImageBackground, TouchableOpacity, Alert } from 'react-native';

import axios from 'axios'
import { server, showError } from './../core/Common'
import AuthInput from './../components/AuthInput'
import commonStyles from './../commonStyles'
import backgroundImage from '../../assets/imgs/login.jpg'

class Auth extends React.Component {
  state = {
    stageNew: false,
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  }

  render() {
    const validations = []

    validations.push(this.state.email && this.state.email.includes('@'))
    validations.push(this.state.password && this.state.password.length >= 6)

    if (this.state.stageNew) {
      validations.push(this.state.name && this.state.name.trim())
      validations.push(this.state.confirmPassword)
      validations.push(this.state.confirmPassword === this.state.password)
    }

    const validForm = validations.reduce((all, v) => all && v)

    return (
      <ImageBackground source={backgroundImage} style={styles.background}>
        <Text style={styles.title}>Tasks</Text>
        <View style={styles.formContainer}>
          <Text style={styles.subtitle}>
            {this.state.stageNew ? 'Crie sua conta' : 'Informe seus dados'}
          </Text>
          {this.state.stageNew && (
            <AuthInput
              icon="user" 
              placeholder="Nome"
              style={styles.input}
              value={this.state.name}
              onChangeText={name => this.setState({ name })}
            />
          )}
          <AuthInput
            icon="at"
            placeholder="Email"
            style={styles.input}
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          />
          <AuthInput
            icon="lock" 
            secureTextEntry={true}
            placeholder="Senha"
            style={styles.input}
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
          />
          {this.state.stageNew && (
            <AuthInput
              icon="asterisk"
              secureTextEntry={true}
              placeholder="Confirmar senha"
              style={styles.input}
              value={this.state.confirmPassword}
              onChangeText={confirmPassword => this.setState({ confirmPassword })}
            />
          )}
          <TouchableOpacity disabled={!validForm} onPress={this.signinOrSignup}>
            <View style={[styles.button, !validForm ? {backgroundColor: '#AAA'} : {}]}>
              <Text style={styles.buttonText}>
                {this.state.stageNew ? 'Registrar' : 'Entrar'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{ padding: 10 }}
            onPress={() => this.setState({ stageNew: !this.state.stageNew })}
          >
            <Text style={styles.buttonText}>
              {this.state.stageNew ? 'Já possui conta?' : 'Ainda não possui conta?'}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  signin = async () => {
    const { stageNew, ...states } = this.state;
    try {
      const res = await axios.post(`${server}/signin`, {
        email: states.email,
        password: states.password
      })
      axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`
      this.props.navigation.navigate('Home', res.data)
    } catch (err) {
      showError(err)
    }
  }

  signup = async () => {
    const { stageNew, ...states } = this.state;
    try {
      await axios.post(`${server}/signup`, {
        ...states
      })
      Alert.alert('Sucesso!', 'Usuário cadastrado com sucesso!')
      this.setState({ stageNew: false })
    } catch (err) {
      showError(err)
    }
  }

  signinOrSignup = () => {
    const { stageNew, ...states } = this.state;
    if (stageNew) {
      this.signup()
    } else {
      this.signin()
    }
  }
}

export default Auth;

const styles = StyleSheet.create({
  background: {
    flex:  1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    color: '#FFF',
    fontSize: 70,
    marginBottom: 10
  },
  subtitle: {
    fontFamily: commonStyles.fontFamily,
    color: '#FFF',
    fontSize: 20
  },
  formContainer: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    width: '90%'
  },
  input: {
    marginTop: 10,
    backgroundColor: '#FFF'
  },
  button: { 
    backgroundColor: '#080',
    marginTop: 10,
    padding: 10,
    alignItems: 'center'
  },
  buttonText: {
    fontFamily: commonStyles.fontFamily,
    color: '#FFF',
    fontSize: 20,
    textAlign: 'center'
  }
})
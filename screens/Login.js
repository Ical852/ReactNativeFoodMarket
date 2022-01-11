import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Fumi } from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';
import toasCfg from "./TOAST"

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            username : '',
            password : '',
            userdata : ''
        };
    }

    login = () => {
        if (this.state.username == '' && this.state.password == '') {
            this.showWarningToast("Isi Username Dan Password Terlebih Dahulu")
        } else if (this.state.username == '' || this.state.password == '') {
            this.showWarningToast("Lengkapi Data Dengan Benar")
        } else {
            this.signingIn()
        }
    }

    signingIn = () => {
        fetch('http://10.0.2.2:3000/api/user/login', {
            method : 'POST',
            headers : {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': 'RAHASIA'
            },
            body : JSON.stringify({
                "username" : this.state.username,
                "password" : this.state.password
            })
        })
        .then(response => response.json())
        .then(json => {
            this.setState({userdata : json.data.id})
            if (this.state.userdata == 0) {
                this.showErrorToast('Akun Tidak Ditemukan')
                this.setState({username : ''})
                this.setState({password : ''})
            } else {
                this.shoSuccessToast()
                this.setState({username : ''})
                this.setState({password : ''})
                setTimeout(() => {
                    this.props.navigation.navigate('Home', {
                        userId : json.data.id
                    })
                }, 2500);
            }
        })
        .catch(err => {
            this.showErrorToast("Error, Gagal Login Error : " + err)
        })
    }

    shoSuccessToast = () => {
        Toast.show({
            type: 'success',
            text1: 'Berhasil',
            text2: 'Berhasil Sign In!',
            visibilityTime: 2000,
            autoHide: true,
            position: 'top'
        })
    }

    showErrorToast = (errmsg) => {
        Toast.show({
            type: 'error',
            text1: 'Error !',
            text2: errmsg,
            visibilityTime: 2000,
            autoHide: true,
            position: 'top'
        })
    }

    showWarningToast = (errmsg) => {
        Toast.show({
            type: 'warning',
            text1: 'Warning !',
            text2: errmsg,
            visibilityTime : 2000,
            autoHide : true,
            position : 'top'
        })
    }

    render() {
        return (
            <View style={{ flex : 1 }}>

                <StatusBar backgroundColor={'#66bb6a'}/>

                <View>
                    <LinearGradient
                        style={styles.header}
                        colors = {['#66bb6a', '#4caf50', '#43a047']}>
                        <Text style={styles.headerText}>GO</Text>
                        <Text style={styles.headerText}>FOOD MARKET</Text>
                    </LinearGradient>
                </View>

                <View style={styles.viewSignIn}>
                    <Text style={styles.signInText}>SIGN IN</Text>
                    
                    <Toast config={toasCfg.toastConfig} />
                    
                    <Fumi
                        onChangeText={(text) => {
                            this.setState({username : text})
                        }}
                        value={this.state.username}
                        style={styles.textInput}
                        label={'Username'}
                        iconClass={FontAwesomeIcon}
                        iconName={'user'}
                        iconColor={'#66bb6a'}
                        iconSize={20}
                        iconWidth={40}
                        inputPadding={16}
                    />
                    <Fumi
                        onChangeText={(text) => {
                            this.setState({password : text})
                        }}
                        value={this.state.password}
                        style={styles.textInput}
                        secureTextEntry
                        label={'Password'}
                        iconClass={FontAwesomeIcon}
                        iconName={'lock'}
                        iconColor={'#66bb6a'}
                        iconSize={20}
                        iconWidth={40}
                        inputPadding={16}
                        />
                    
                    <TouchableOpacity>
                        <Text style={styles.forgotPassword}>Forgot Password ?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => { this.login() }}
                        style={styles.btnSignin}>
                        <LinearGradient
                            colors = { ['#81c784', '#66bb6a', '#4caf50'] }
                            style={styles.btnSigninColor}>
                        <Text style={styles.btnSignnText}>SIGN IN</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => { this.props.navigation.navigate('Register') }}
                        style={styles.register}>
                        <Text style={styles.registerText} >Don't have account yet? Sign Up Now !</Text>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header : {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 70,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15
    },
    headerText : {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 25
    },
    viewSignIn : {
        marginHorizontal: 10,
        marginTop: -10,
        borderRadius: 15,
        elevation: 8,
        paddingBottom: 40,
        backgroundColor: 'white'
    },
    signInText : {
        textAlign: 'center',
        fontSize: 25,
        color: '#66bb6a',
        fontWeight: '900',
        marginTop: 35,
        marginBottom: 20
    },
    textInput : {
        elevation: 5,
        marginHorizontal: 15,
        marginTop: 20,
        borderRadius: 10
    },
    forgotPassword : {
        textAlign: 'right',
        color: '#66bb6a',
        fontWeight: '900',
        fontSize: 16,
        marginTop: 15,
        marginRight: 15
    },
    btnSignin : {
        marginTop: 40,
        marginHorizontal: 15,
    },
    btnSigninColor : {
        padding: 15,
        borderRadius: 15,
        elevation: 5
    },
    btnSignnText : {
        color: 'white',
        fontWeight: '900',
        fontSize: 20,
        textAlign: 'center'
    },
    register : {
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    registerText : {
        color: '#66bb6a',
        fontWeight: 'bold',
        fontSize: 16
    }
})
export default Login;
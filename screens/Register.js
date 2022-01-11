import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Fumi } from 'react-native-textinput-effects';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';
import toasCfg from "./TOAST"
import Modal from "react-native-modal";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            fullname : '',
            username : '',
            password: '',
            email : '',
            userimg : 'default.png',
            phoneNumber : '',
            roleId : 2,
            userStatus : 1,
            modalIsOpen: false
        };
    }

    register = () => {
        if (this.state.username == '' && this.state.password == '' && this.state.email == '' && this.state.phoneNumber == '') {
            this.showWarningToast("Isi Data Terlebih Dahulu")
        } else if (this.state.username == '' || this.state.password == '' || this.state.email == '' || this.state.phoneNumber == '') {
            this.showWarningToast("Lengkapi Data Dengan Benar")
        } else {
            this.registration()
        }
    }

    registration = () => {
        fetch('http://10.0.2.2:3000/api/user/register', {
            method : 'POST',
            headers : {
                Accept : 'application/json',
                'Content-Type' : 'application/json',
                'X-API-Key' : 'RAHASIA'
            },
            body : JSON.stringify({
                "full_name" : this.state.fullname,
                "username" : this.state.username,
                "password" : this.state.password,
                "email" : this.state.email,
                "user_img" : this.state.userimg,
                "phone_number" : this.state.phoneNumber,
                "role_id" : this.state.roleId,
                "user_status" : this.state.userStatus
            })
        })
        .then(response => response.json())
        .then(json => {
            this.showSuccessToast(),
            setTimeout(() => {
                this.setState({modalIsOpen : true})
            }, 2500);
        })
        .catch(err => {
            this.showErrorToast("Error : " + err)
            console.log(err)
        })
    }

    showWarningToast = (errmsg) => {
        Toast.show({
            type: 'warning',
            text1: 'Warning !',
            text2: errmsg,
            visibilityTime: 2000,
            autoHide: true,
            position: 'top'
        })
    }

    showErrorToast = (errmsg) => {
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: errmsg,
            visibilityTime: 2000,
            autoHide: true,
            position: 'top'
        })
    }

    showSuccessToast = () => {
        Toast.show({
            type: 'success',
            text1: 'Info',
            text2: 'Berhasil Mendaftarkan Akun !',
            visibilityTime: 2000,
            autoHide: true,
            position: 'top'
        })
    }

    render() {
        return (
            <View style={{ flex : 1 }}>
                
                <StatusBar backgroundColor={'#66bb6a'} />
                
                <View>
                    <LinearGradient
                        style={styles.header}
                        colors = { ['#66bb6a', '#4caf50', '#43a047'] }>
                        <Text style={styles.headerText}>GO</Text>
                        <Text style={styles.headerText}>Food Market</Text>
                    </LinearGradient>
                </View>

                <View style={styles.viewSignup} >
                    <Text style={styles.signupText}>SIGN UP</Text>

                    <Toast config={toasCfg.toastConfig} />

                    <Fumi
                        onChangeText={(text) => {
                            this.setState({fullname : text})
                            this.setState({username : text})
                        }}
                        style={styles.textInput}
                        label={'Username'}
                        iconClass={Icon}
                        iconName={'user'}
                        iconColor={'#4caf50'}
                        iconSize={20}
                        iconWidth={40}
                        inputPadding={16}
                    />
                    <Fumi
                        onChangeText={(text) => this.setState({password : text})}
                        secureTextEntry
                        style={styles.textInput}
                        label={'Password'}
                        iconClass={Icon}
                        iconName={'lock'}
                        iconColor={'#4caf50'}
                        iconSize={20}
                        iconWidth={40}
                        inputPadding={16}
                        />
                    <Fumi
                        onChangeText={(text) => this.setState({email : text})}
                        style={styles.textInput}
                        label={'Email'}
                        iconClass={Icon}
                        iconName={'envelope'}
                        iconColor={'#4caf50'}
                        iconSize={20}
                        iconWidth={40}
                        inputPadding={16}
                        />
                    <Fumi
                        onChangeText={(text) => this.setState({phoneNumber : text})}
                        style={styles.textInput}
                        label={'Phone Number'}
                        iconClass={Icon}
                        iconName={'phone'}
                        iconColor={'#4caf50'}
                        iconSize={20}
                        iconWidth={40}
                        inputPadding={16}
                        />

                    <TouchableOpacity
                        onPress={() => { this.register() }}
                        style={styles.btnSignup}>
                        <LinearGradient
                            colors = { ['#81c784', '#66bb6a', '#4caf50'] }
                            style={styles.btnSignupColor} >
                        <Text style={styles.btnSignupText} >SIGN UP</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => { this.props.navigation.navigate('Login') }}
                        style={styles.login} >
                        <Text style={styles.loginText}>Already Have An Account ? Sign In Now !</Text>
                    </TouchableOpacity>
                </View>

                <Modal
                    isVisible={this.state.modalIsOpen}
                    onBackdropPress={() => this.setState({modalIsOpen : false})}
                    animationInTiming={800}
                    animationOutTiming={800}
                    >

                    <View 
                        style = {styles.modalHeader}>
                        <Icon name="info" size={20} color="white" />
                        <Text style={styles.modalInfo}>INFO</Text>
                    </View>

                    <View style={styles.modalBody} >
                        <Text style={styles.modalBodyText1}>Akun Anda Sudah Berhasil Didaftarkan !</Text>
                        <Text style={styles.modalBodyText2}>Tekan Button Sign In Untuk Melanjutkan Ke Halaman Sign In, Tekan Tetap Disini Untuk Tetap Dihalaman Sign Up.</Text>
                    </View>
                    
                    <View style={styles.modalHr} />

                    <View style={styles.modalBtnBody}>
                        <TouchableOpacity
                            onPress={() => this.setState({modalIsOpen : false})}
                            style={styles.modalBtnStay}>
                            <Text style={styles.modalBtnText}>Tetap Disini</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                this.setState({modalIsOpen : false})
                                this.props.navigation.navigate('Login')
                            }}
                            style={styles.modalBtnSignin}>
                            <Text style={styles.modalBtnText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 35,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15
    },
    headerText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 25
    },
    viewSignup: {
        marginHorizontal: 10,
        marginTop: -10,
        borderRadius: 15,
        elevation: 8,
        paddingBottom: 40,
        backgroundColor: 'white'
    },
    signupText: {
        textAlign: 'center',
        fontSize: 25,
        color: '#66bb6a',
        fontWeight: '900',
        marginTop: 35,
        marginBottom: 20
    },
    textInput: {
        elevation: 5,
        marginHorizontal: 15,
        marginTop: 20,
        borderRadius: 10
    },
    forgotPassword: {
        textAlign: 'right',
        color: '#66bb6a',
        fontWeight: '900',
        fontSize: 16,
        marginTop: 15,
        marginRight: 15
    },
    btnSignup: {
        marginTop: 40,
        marginHorizontal: 15,
    },
    btnSignupColor: {
        padding: 15,
        borderRadius: 15,
        elevation: 5
    },
    btnSignupText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 20,
        textAlign: 'center'
    },
    login: {
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginText: {
        color: '#66bb6a',
        fontWeight: 'bold',
        fontSize: 16
    },
    modalHeader : {
        backgroundColor: '#4caf50',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 10
    },
    modalInfo : {
        color: 'white', 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginLeft: 10
    },
    modalBody : {
        backgroundColor: 'white',
        padding: 15
    },
    modalBodyText1 : {
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginBottom: 5
    },
    modalBodyText2 : {
        fontWeight: '500', 
        textAlign: 'center'
    },
    modalHr : {
        borderBottomColor: 'black',
        borderBottomWidth: 0.5
    },
    modalBtnBody : {
        backgroundColor: 'white',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    modalBtnStay : {
        backgroundColor: 'grey',
        marginRight: 10,
        padding: 10,
        borderRadius: 5
    },
    modalBtnSignin : {
        backgroundColor: '#4caf50',
        marginRight: 10,
        padding: 10,
        borderRadius: 5
    },
    modalBtnText : {
        color: 'white', 
        fontWeight: 'bold'
    }
})

export default Register;
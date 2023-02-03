import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Keyboard } from "react-native";
import BottomNav from '../component/BottomNav';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import { Fumi } from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';
import toasCfg from "./TOAST"


class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            userId: this.props.route.params.userId,
            userData: {},
            newFullName: "",
            newPhoneNumber: "",
            visible: true,
            currentState: 'profileData',
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        };
    }

    getUserData = () => {
        fetch(`http://10.0.2.2:3000/api/user/get/${this.state.userId}`, {
            method : 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': 'RAHASIA'
            }
        })
        .then(response => response.json())
        .then(json => {
            this.setState({userData : json.data})
            this.setState({newFullName: json.data.full_name})
            this.setState({newPhoneNumber: json.data.phone_number})
        })
        .catch(err => {
            console.log(err)
        })
    }

    componentDidMount() {
        this.getUserData()
        Keyboard.addListener('keyboardDidShow', () => {
            this.setState({visible: false})
        })
        Keyboard.addListener('keyboardDidHide', () => {
            this.setState({visible: true})
        })
    }

    updateProfileData = () => {
        if (this.state.newFullName == "" || this.state.newPhoneNumber == "") {
            this.showWarningToast("Lengkapi Data Baru Dengan Benar")
        } else if (this.state.newFullName == this.state.userData.full_name && this.state.newPhoneNumber == this.state.userData.phone_number) {
            this.showWarningToast("Tidak Ada Perubahan")
        } else {
            this.updateProfile()
        }
    }

    updateProfile = () => {
        fetch(`http://10.0.2.2:3000/api/user/update/${this.state.userId}`, {
            method : 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': 'RAHASIA'
            },
            body : JSON.stringify({
                full_name : this.state.newFullName,
                password: this.state.userData.password,
                phone_number: this.state.newPhoneNumber
            })
        })
        .then(response => response.json())
        .then(() => {
            this.showSuccessToast("Berhasil Update Password")
            this.getUserData()
        })
        .catch(err => {
            console.log(err)
        })
    }

    updatePassword = () => {
        fetch(`http://10.0.2.2:3000/api/user/update/${this.state.userId}`, {
            method : 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': 'RAHASIA'
            },
            body : JSON.stringify({
                full_name : this.state.userData.full_name,
                password: this.state.newPassword,
                phone_number: this.state.userData.phone_number
            })
        })
        .then(response => response.json())
        .then(() => {
            this.showSuccessToast("Berhasil Update Profile")
            this.getUserData()
        })
        .catch(err => {
            console.log(err)
        })
    }

    changePassword = () => {
        if (!this.state.currentPassword || !this.state.newPassword || !this.state.confirmPassword) {
            this.showErrorToast('Lengkapi Form Terlebih Dahulu')
        } else if (this.state.currentPassword != this.state.userData.password) {
            this.showErrorToast("Current Password Salah")
        } else {
            if (this.state.newPassword.length < 8) {
                this.showErrorToast("Password Baru Minimal 8 Karakter")
            } else {
                if (this.state.newPassword != this.state.confirmPassword) {
                    this.showErrorToast("Password Baru Tidak Match")
                } else {
                    this.updatePassword()
                }
            }
        }
    }

    showSuccessToast = (msg) => {
        Toast.show({
            type: 'success',
            text1: 'Berhasil',
            text2: msg,
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
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                {
                    this.state.currentState == 'profileData' ?
                    (
                        <ScrollView>
                            <View style={{ flex: 1 }}>
                                <View style={styles.profile}>
                                    <LinearGradient
                                        style={styles.profileCtr}
                                        colors = {['#66bb6a', '#66bb6a', '#4caf50']}>
                                        <View style={styles.profileCtn}>
                                            <TouchableOpacity style={styles.profileImg} activeOpacity={0.7}>
                                                <View style={styles.profileImg2}>
                                                    <Image
                                                        style={{ width: 80, height: 80, borderRadius: 80/2 }}
                                                        source={{ uri: `http://10.0.2.2:8000/static/${this.state.userData.user_img}` }}
                                                    />
                                                    <View style={styles.profileIcon}>
                                                        <Icon name="images" size={18} color="#66bb6a" />
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={styles.username}>
                                                <Icon name="user-alt" size={15} color="white" />
                                                <Text style={styles.usernametxt}>{this.state.userData.username}</Text>
                                            </View>
                                            <View style={styles.email}>
                                                <Icon name="envelope" size={18} color="white" />
                                                <Text style={styles.emailtxt}>{this.state.userData.email}</Text>
                                            </View>
                                        </View>
                                    </LinearGradient>
                                    <Toast config={toasCfg.toastConfig}/>
                                </View>
                                <View style={styles.profiledata}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Profile Data</Text>
                                    <Fumi
                                        onChangeText={(text) => {
                                            this.setState({newFullName : text})
                                        }}
                                        value={this.state.newFullName}
                                        style={styles.textInput}
                                        label={'Full Name'}
                                        iconClass={FontAwesomeIcon}
                                        iconName={'user'}
                                        iconColor={'#66bb6a'}
                                        iconSize={20}
                                        iconWidth={40}
                                        inputPadding={16}
                                    />
                                    <Fumi
                                        onChangeText={(text) => {
                                            this.setState({newPhoneNumber : text})
                                        }}
                                        value={this.state.newPhoneNumber}
                                        style={styles.textInput}
                                        label={'Phone Number'}
                                        iconClass={FontAwesomeIcon}
                                        iconName={'phone'}
                                        iconColor={'#66bb6a'}
                                        iconSize={20}
                                        iconWidth={40}
                                        inputPadding={16}
                                        />

                                    <TouchableOpacity
                                        onPress={() => this.updateProfileData()}
                                        style={styles.btnSignin}>
                                        <LinearGradient
                                            colors = { ['#81c784', '#66bb6a', '#4caf50'] }
                                            style={styles.btnSigninColor}>
                                        <Text style={styles.btnSignnText}>Save Data</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => this.setState({currentState: 'changePw'})}
                                        style={styles.register}>
                                        <Text style={styles.registerText} >Change Password</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    ) :
                    (
                        <ScrollView>
                            <View style={{ flex: 1 }}>
                                <View style={styles.profile}>
                                    <LinearGradient
                                        style={styles.profileCtr}
                                        colors = {['#66bb6a', '#66bb6a', '#4caf50']}>
                                        <View style={styles.profileCtn}>
                                            <TouchableOpacity style={styles.profileImg} activeOpacity={0.7}>
                                                <View style={styles.profileImg2}>
                                                    <Image
                                                        style={{ width: 80, height: 80, borderRadius: 80/2 }}
                                                        source={{ uri: `http://10.0.2.2:8000/static/${this.state.userData.user_img}` }}
                                                    />
                                                    <View style={styles.profileIcon}>
                                                        <Icon name="images" size={18} color="#66bb6a" />
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={styles.username}>
                                                <Icon name="user-alt" size={15} color="white" />
                                                <Text style={styles.usernametxt}>{this.state.userData.username}</Text>
                                            </View>
                                            <View style={styles.email}>
                                                <Icon name="envelope" size={18} color="white" />
                                                <Text style={styles.emailtxt}>{this.state.userData.email}</Text>
                                            </View>
                                        </View>
                                        <Toast config={toasCfg.toastConfig} />
                                    </LinearGradient>
                                </View>
                                <View style={styles.profiledata}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Change Password</Text>
                                    <Fumi
                                        onChangeText={(text) => {
                                            this.setState({currentPassword : text})
                                        }}
                                        secureTextEntry
                                        value={this.state.currentPassword}
                                        style={styles.textInput}
                                        label={'Current Password'}
                                        iconClass={FontAwesomeIcon}
                                        iconName={'key'}
                                        iconColor={'#66bb6a'}
                                        iconSize={20}
                                        iconWidth={40}
                                        inputPadding={16}
                                    />

                                    <Fumi
                                        onChangeText={(text) => {
                                            this.setState({newPassword : text})
                                        }}
                                        secureTextEntry
                                        value={this.state.newPassword}
                                        style={styles.textInput}
                                        label={'New Password'}
                                        iconClass={FontAwesomeIcon}
                                        iconName={'lock-open'}
                                        iconColor={'#66bb6a'}
                                        iconSize={20}
                                        iconWidth={40}
                                        inputPadding={16}
                                    />

                                    <Fumi
                                        onChangeText={(text) => {
                                            this.setState({confirmPassword : text})
                                        }}
                                        secureTextEntry
                                        value={this.state.confirmPassword}
                                        style={styles.textInput}
                                        label={'Confirm New Password'}
                                        iconClass={FontAwesomeIcon}
                                        iconName={'lock'}
                                        iconColor={'#66bb6a'}
                                        iconSize={20}
                                        iconWidth={40}
                                        inputPadding={16}
                                    />

                                    <TouchableOpacity
                                        onPress={() => this.changePassword()}
                                        style={styles.btnSignin}>
                                        <LinearGradient
                                            colors = { ['#81c784', '#66bb6a', '#4caf50'] }
                                            style={styles.btnSigninColor}>
                                        <Text style={styles.btnSignnText}>Change Password</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => this.setState({currentState: "profileData"})}
                                        style={styles.register}>
                                        <Text style={styles.registerText} >Profile Data</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    )
                }
                {this.state.visible && 
                    <BottomNav navigation={this.props.navigation} userId={this.state.userId} current={"Profile"}/>
                }
            </View>
        );
    }
}

export default Profile;

const styles = StyleSheet.create({
    profile: {
        height: 270,
    },
    profileCtr: {
        height: 270
    },
    profileCtn: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    profileImg: {
        width: 110,
        height: 110,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 110/2,
        marginTop: 20
    },
    profileImg2: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 100 / 2,
    },
    profileIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white'
    },
    username: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    usernametxt: {
        marginLeft: 5,
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
    },
    email: {
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    emailtxt: {
        marginLeft: 5,
        fontSize: 18,
        color: 'white',
    },
    profiledata: {
        padding: 40,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        marginTop: -40,
        backgroundColor: 'white'
    },
    textInput: {
        elevation: 5,
        marginTop: 20,
        borderRadius: 10
    },
    btnSignin : {
        marginTop: 35,
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
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    registerText : {
        color: '#66bb6a',
        fontWeight: 'bold',
        fontSize: 16
    }
})
import React, { Component } from 'react';
import { StyleSheet, Image, Text, StatusBar } from "react-native";
import { Logo } from '../assets'
import LinearGradient from 'react-native-linear-gradient';

class Splash extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    componentDidMount() {
        setTimeout(() => {
            this.props.navigation.replace('Login')
        }, 2000);
    }
    render() {
        return (
            <LinearGradient
                style={styles.header}
                colors = {['#66bb6a', '#66bb6a', '#4caf50']}>
                <Image style={styles.img} source={Logo}/>
                <Text style={styles.text}>
                    Go Food Market
                </Text>
            </LinearGradient>
        );
    }
}

export default Splash;

const styles = StyleSheet.create({
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    img : {
        height: 135,
        width: 120
    },
    text : {
        fontSize: 32,
        fontWeight : '600',
        marginTop : 16,
        color: 'white'
    }

})
import React, { Component } from 'react';
import { BaseToast } from 'react-native-toast-message';

module.exports = {
    toastConfig : {
        success: (props) => (
            <BaseToast
            {...props}
            style={{ borderLeftColor: '#4caf50' }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 15,
                fontWeight: '900'
            }}
            text2Style={{ 
                fontSize : 15,
                fontWeight : '900'
            }}
            />
        ),

        error: (props) => (
            <BaseToast
            {...props}
            style={{ borderLeftColor: 'crimson' }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 15,
                fontWeight: '900'
            }}
            text2Style={{ 
                fontSize : 15,
                fontWeight : '900'
            }}
            />
        ),

        warning: (props) => (
            <BaseToast
            {...props}
            style={{ borderLeftColor: '#ffd740' }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 15,
                fontWeight: '900'
            }}
            text2Style={{ 
                fontSize : 15,
                fontWeight : '900'
            }}
            />
        ),

        info: (props) => (
            <BaseToast
            {...props}
            style={{ borderLeftColor: '#29b6f6' }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 15,
                fontWeight: '900'
            }}
            text2Style={{ 
                fontSize : 15,
                fontWeight : '900'
            }}
            />
        ),
    }
}
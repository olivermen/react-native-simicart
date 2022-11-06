import AsyncStorage from '@react-native-community/async-storage';
import { rememberme_info, autologin_info } from "./constants";

class AppStorage {

    static saveData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log('Error saving data');
        }
    }

    static getData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                return value;
            }
        } catch (error) {
            console.log('Error retrieving data');
        }
    }

    static removeData = async (keys) => {
        keys.forEach(async item => {
            await AsyncStorage.removeItem(item);
        });
    }

    static saveCustomerAutoLoginInfo(customerInfo) {
        const save = async () => {
            await AsyncStorage.setItem(autologin_info, JSON.stringify(customerInfo), () => {
                const info = AsyncStorage.getItem(autologin_info, (error, result) => {
                    let printInfo = JSON.parse(result);
                    console.log(printInfo.email);
                });
            });
        }
        save();
    }

    static saveRemembermeLoginInfo(customerInfo) {
        const save = async () => {
            await AsyncStorage.setItem(rememberme_info, JSON.stringify(customerInfo), () => {
                const info = AsyncStorage.getItem(rememberme_info, (error, result) => {
                    let printInfo = JSON.parse(result);
                    console.log(printInfo.email);
                });
            });
        }
        save();
    }

    static removeAutologinInfo() {
        const remove = async () => {
            await AsyncStorage.removeItem(autologin_info);
        }
        remove();
    }

    static removeAllSavedInfo() {
        const remove = async () => {
            await AsyncStorage.removeItem(autologin_info);
            await AsyncStorage.removeItem(rememberme_info);
        }
        remove();
    }

    // Return json {email:'', password:''}. Use when autologin, continue section
    static async getCustomerAutoLoginInfo() {
        try {
            const retrievedItem = await AsyncStorage.getItem(autologin_info);
            const customerInfo = JSON.parse(retrievedItem);
            return customerInfo;
        } catch (error) {
            console.log(error.message);
        }
        return
    }

    // Return json {email:'', password:''}. Use to fill data to Login page
    static async getCustomerRemebermeLoginInfo() {
        try {
            const retrievedItem = await AsyncStorage.getItem(rememberme_info);
            const customerInfo = JSON.parse(retrievedItem);
            return customerInfo;
        } catch (error) {
            console.log(error.message);
        }
        return
    }
}

export default AppStorage;

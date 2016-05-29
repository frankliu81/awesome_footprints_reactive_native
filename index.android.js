/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Navigator,
  ToolbarAndroid,
  BackAndroid
} from 'react-native';
import BarcodeScanner from 'react-native-barcodescanner';

///////////////////
// Page 1
///////////////////
class HomeToolbar extends Component {
  render() {
    //debugger
    return (<View>
              <View style={styles.toolbar}>
                <TouchableHighlight style={styles.toolbarButton} underlayColor="grey" onPress={this.props.onPress}>
                  <Text style={styles.toolbarButtonText}>Scan</Text>
                </TouchableHighlight>
                <Text style={styles.toolbarTitle}>
                  TreadLight.ly
                </Text>
                <TouchableHighlight style={styles.toolbarButton} underlayColor="grey" onPress={this.props.onPress}>
                  <Text style={styles.toolbarButtonText}>Compare</Text>
                </TouchableHighlight>
              </View>
            </View>)
  }
}

class Home extends Component {
  _navigate() {
    this.props.navigator.push({
      name: "Scanner",
      component: Scanner
    });
  }

  render() {
    return <HomeToolbar onPress={this._navigate.bind(this)}/>
          // Below is put into ScanToolbar
          // return (<View>
          //           <View style={styles.toolbar}>
          //             <TouchableHighlight style={styles.toolbarButton} underlayColor="grey" onPress={() => this._navigate()}>
          //               <Text style={styles.toolbarButtonText}>Scan</Text>
          //             </TouchableHighlight>
          //             <Text style={styles.toolbarTitle}>
          //               TreadLight.ly
          //             </Text>
          //             <TouchableHighlight style={styles.toolbarButton} underlayColor="grey" onPress={() => this._navigate()}>
          //               <Text style={styles.toolbarButtonText}>Compare</Text>
          //             </TouchableHighlight>
          //           </View>
          //         </View>)
  }
}

///////////////////
// Page 2
///////////////////
class ScanToolbar extends Component {
  render() {
    return (<View>
              <View style={styles.toolbar}>
                {/*<TouchableHighlight style={styles.toolbarButton} underlayColor="grey" onPress={this.props.navigator.pop}>*/}
                <TouchableHighlight style={styles.toolbarButton} underlayColor="grey" onPress={this.props.onPress}>
                  <Text style={styles.toolbarButtonText}>Back</Text>
                </TouchableHighlight>
                <Text style={styles.toolbarTitleOneButton}>
                  TreadLight.ly
                </Text>
              </View>
           </View>)
  }
}

class Scanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      torchMode: 'off',
      cameraType: 'back',
      barCode: '',
      barCodeType: '',
      // tested and testOnPress are used for testing handler remove
      tested: false,
      testOnPress: this._test.bind(this),
      onBarCodeRead: this.barcodeReceived.bind(this)
    };
  }

  _navigateResult(){
    this.props.navigator.push({
        title: 'DisplayImpacts',
        component: DisplayImpacts,
        barCodeType: this.state.barCodeType,
        barCode: this.state.barCode,
        popCallback: this._popCallback.bind(this),
    });
  }

  barcodeReceived(e) {
    // debugger
    console.log('Barcode: ' + e.data);
    console.log('type: ' + e.type);
    // if (e.type === "UPC_A"){
    //   //console.log("Inside UPC_A");
    //   if (e.data === "722252212122"){
    //     console.log("Clif Bar");
    //   }
    // }

    // setting onBarCodeRead state to null will remove the onBarCodeRead handler
    // so we don't get multiple event fired causing multiple transitions
    // set state is asynchronous
    // http://stackoverflow.com/questions/30852251/react-native-this-setstate-not-working
    this.setState( {barCode: e.data, barCodeType: e.type, onBarCodeRead: null}, () => this._navigateResult());
    //this._navigateResult();
  }

  _navigateBack() {
    this.props.navigator.pop();
  }


  _popCallback() {
    //console.log(this);
    // rebind the barCodeReceived handler
    this.setState( {onBarCodeRead: this.barcodeReceived.bind(this)} );
  }

  _test() {
    console.log("test");
    //this.setState({testOnPress: this._test});
    // once button is clicked, then remove the handler
    this.setState({tested: true, testOnPress: null});
  }

  render() {
    var text = this.state.tested ? 'Tested' : 'Untested';

    return (
      // Refactor into ScanToolbar
      // <View style={styles.container}>
      //   <TouchableHighlight underlayColor="grey" onPress={() => this._navigate()}>
      //     <Text>Back</Text>
      //   </TouchableHighlight>
      //    <BarcodeScanner
      //    onBarCodeRead={this.barcodeReceived.bind(this)}
      //    style={{ height: 400, width: 300 }}
      //    //style={{flex: 1}}
      //    torchMode={this.state.torchMode}
      //    cameraType={this.state.cameraType}
      //   />
      // </View>
      <View style={styles.containerScan}>
       <ScanToolbar onPress={this._navigateBack.bind(this)}/>
       {/*<TouchableHighlight underlayColor="grey" onPress={this._test.bind(this)}>*/}
       {/* Making the onPress handler removable (ie. settable to null using state) */}
       {/*<TouchableHighlight underlayColor="grey" onPress={this.state.testOnPress}>
          <Text style={{fontSize: 30}}>{text}</Text>
        </TouchableHighlight>*/}
       <BarcodeScanner
           onBarCodeRead={this.state.onBarCodeRead}
           style={{flex: 1}}
           torchMode={this.state.torchMode}
           cameraType={this.state.cameraType}
          />
     </View>

    );
  }
}

/////////////////
// Page 3
/////////////////
class DisplayImpacts extends Component {

  _navigateBack() {
    //console.log(this.props.route);
    this.props.route.popCallback();
    this.props.navigator.pop();
  }

  render() {
    //console.log("this.props.route.barCode: " + this.props.route.barCode)
    var product;
    if (this.props.route.barCodeType === "UPC_A"){
      //console.log("Inside UPC_A");
      if (this.props.route.barCode === "722252212122"){
        product = "Clif Bar";
      }
    }

    return (<View>
              <ScanToolbar onPress={this._navigateBack.bind(this)}/>
              <Text>Display Impacts</Text>
              <Text>{product}</Text>
            </View>)
  }

}

// store the navigator for BackAndroid
// var _navigator;

class AwesomeFootprints extends Component {

  _renderScene (route, navigator) {
      // _navigator = navigator;
      var Component = route.component;
      return (
        <Component {...route.props} navigator={navigator} route={route} />
      );
  }

  render() {
    //console.log("In AwesomeFootprints component");
    return (
      <Navigator
        initialRoute={{
          name: "Home",
          component: Home
        }}
        configureScene={() => {
          return Navigator.SceneConfigs.FloatFromRight;
        }}
        renderScene={this._renderScene} />
    );
  }
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  containerScan: {
    flex: 1,
    justifyContent: 'center',
    // without alignItems stretch, the scanner appear to have zero width,
    // and the toolbar won't stretch out
    // https://github.com/facebook/react-native/issues/2957#event-417214498
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  toolbarAndroid: {
    backgroundColor: '#e9eaed',
    height: 56,
  },
  toolbar: {
    backgroundColor:'#81c04d',
    paddingTop:30,
    paddingBottom:10,
    flexDirection:'row'
  },
  toolbarButton:{
    width: 100,
    marginLeft: 20,
    //color:'#fff',
    //textAlign:'center'
  },
  toolbarButtonText:{
    color:'#fff',
    fontSize: 20,
  },
  toolbarTitle:{
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold',
    flex:1,
    fontSize: 20,
  },
  toolbarTitleOneButton:{
    color:'#fff',
    justifyContent: 'flex-start',
    fontWeight:'bold',
    flex:1,
    fontSize: 20,
  }
  // button: {
  //   marginTop: 20,
  //   marginBottom: 20,
  // }
});

AppRegistry.registerComponent('AwesomeFootprints', () => AwesomeFootprints);


//BackAndroid.addEventListener('hardwareBackPress', function() {
    //  if (!this.onMainScreen()) {
    //    this.goBack();
    //    return true;
    //  }
    //  return false;
    //_navigator.pop();
//});
